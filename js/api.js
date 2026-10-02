window.CryptoAPI = (function() {
  'use strict';

  const BASE_URL = 'https://api.coingecko.com/api/v3';
  const POLL_INTERVAL = 30000; // 30 seconds

  const STORAGE_MARKET_KEY = 'criptotracker_market_cache';
  const STORAGE_GAINERS_KEY = 'criptotracker_gainers_cache';

  let marketCache = null;
  let gainersCache = null;
  let chartCache = {}; // { coinId-days: { data, timestamp } }
  let pollTimer = null;

  // Pre-seed caches from localStorage or fallback
  try {
    const storedMarket = localStorage.getItem(STORAGE_MARKET_KEY);
    if (storedMarket) marketCache = JSON.parse(storedMarket);
    const storedGainers = localStorage.getItem(STORAGE_GAINERS_KEY);
    if (storedGainers) gainersCache = JSON.parse(storedGainers);
  } catch (e) {
    console.warn("Could not read market localStorage:", e);
  }

  if (!marketCache || !Array.isArray(marketCache) || marketCache.length === 0) {
    marketCache = getFallbackMarketData();
  }
  if (!gainersCache || !Array.isArray(gainersCache) || gainersCache.length === 0) {
    gainersCache = [...marketCache].sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ==================== RETRY HELPER ====================
  async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.status === 429) {
          // Rate limited — wait longer
          console.warn('CoinGecko rate limited, backing off...');
          await sleep(Math.pow(2, i) * 2000);
          continue;
        }
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return await response.json();
      } catch (error) {
        console.warn('Fetch attempt ' + (i + 1) + ' failed:', error.message);
        if (i === retries - 1) return null;
        await sleep(Math.pow(2, i) * 1000);
      }
    }
    return null;
  }

  // ==================== MARKET DATA (Top 50) ====================
  async function fetchMarketData() {
    const url = BASE_URL + '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h';
    const data = await fetchWithRetry(url);
    if (data && Array.isArray(data) && data.length > 0) {
      marketCache = data;
      try { localStorage.setItem(STORAGE_MARKET_KEY, JSON.stringify(data)); } catch(e){}
      return data;
    }
    return marketCache || getFallbackMarketData();
  }

  // ==================== GAINERS (Top sorted by 24h change) ====================
  async function fetchGainers() {
    const url = BASE_URL + '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h';
    const data = await fetchWithRetry(url);
    if (data && Array.isArray(data) && data.length > 0) {
      const sorted = data
        .filter(c => c.price_change_percentage_24h > 0)
        .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
      gainersCache = sorted;
      try { localStorage.setItem(STORAGE_GAINERS_KEY, JSON.stringify(sorted)); } catch(e){}
      return sorted;
    }
    return gainersCache || [];
  }

  // ==================== SEARCH ====================
  async function searchCoins(query) {
    if (!query || query.length < 2) return [];
    const url = BASE_URL + '/search?query=' + encodeURIComponent(query);
    const data = await fetchWithRetry(url);
    if (data && data.coins) {
      return data.coins.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        thumb: c.thumb,
        large: c.large,
        market_cap_rank: c.market_cap_rank
      }));
    }
    return [];
  }

  // Hybrid search: instant memory search + optional CoinGecko search
  async function searchAll(query) {
    if (!query) return [];
    const q = query.trim().toLowerCase();
    const results = [];
    const seenIds = new Set();

    // 1. Search local caches first (0ms latency!)
    const allLocal = [...(marketCache || []), ...(gainersCache || [])];
    allLocal.forEach(c => {
      if (seenIds.has(c.id)) return;
      const nameMatch = c.name.toLowerCase().includes(q);
      const symbolMatch = c.symbol.toLowerCase().includes(q);
      if (nameMatch || symbolMatch) {
        seenIds.add(c.id);
        results.push({
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          thumb: c.image,
          large: c.image,
          market_cap_rank: c.market_cap_rank,
          current_price: c.current_price,
          isLocal: true
        });
      }
    });

    // Sort exact matches or top rank first
    results.sort((a, b) => {
      const aExact = a.symbol.toLowerCase() === q || a.name.toLowerCase() === q;
      const bExact = b.symbol.toLowerCase() === q || b.name.toLowerCase() === q;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return (a.market_cap_rank || 9999) - (b.market_cap_rank || 9999);
    });

    // 2. If query >= 2 chars, also query global search
    if (q.length >= 2) {
      try {
        const globalResults = await searchCoins(q);
        globalResults.forEach(c => {
          if (!seenIds.has(c.id)) {
            seenIds.add(c.id);
            results.push({
              id: c.id,
              name: c.name,
              symbol: c.symbol,
              thumb: c.thumb,
              large: c.large,
              market_cap_rank: c.market_cap_rank,
              current_price: null,
              isLocal: false
            });
          }
        });
      } catch (e) {
        console.warn("Global search failed:", e);
      }
    }

    return results.slice(0, 15);
  }

  // ==================== COIN DETAIL ====================
  async function fetchCoinDetail(coinId) {
    if (marketCache) {
      const cached = marketCache.find(c => c.id === coinId);
      if (cached) return cached;
    }
    if (gainersCache) {
      const cachedG = gainersCache.find(c => c.id === coinId);
      if (cachedG) return cachedG;
    }

    const url = BASE_URL + '/coins/' + coinId + '?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true';
    const data = await fetchWithRetry(url);
    if (data) {
      return {
        id: data.id,
        symbol: data.symbol,
        name: data.name,
        image: data.image ? (data.image.large || data.image.small || data.image.thumb) : '',
        current_price: data.market_data && data.market_data.current_price ? data.market_data.current_price.usd : 0,
        market_cap: data.market_data && data.market_data.market_cap ? data.market_data.market_cap.usd : 0,
        market_cap_rank: data.market_cap_rank,
        total_volume: data.market_data && data.market_data.total_volume ? data.market_data.total_volume.usd : 0,
        high_24h: data.market_data && data.market_data.high_24h ? data.market_data.high_24h.usd : 0,
        low_24h: data.market_data && data.market_data.low_24h ? data.market_data.low_24h.usd : 0,
        price_change_percentage_24h: data.market_data ? data.market_data.price_change_percentage_24h : 0,
        ath: data.market_data && data.market_data.ath ? data.market_data.ath.usd : 0,
        sparkline_in_7d: data.market_data && data.market_data.sparkline_7d ? data.market_data.sparkline_7d : null
      };
    }

    // Fallback: try simple price endpoint if full detail failed
    try {
      const pUrl = BASE_URL + '/simple/price?ids=' + coinId + '&vs_currencies=usd&include_24hr_change=true';
      const pData = await fetchWithRetry(pUrl);
      if (pData && pData[coinId]) {
        return {
          id: coinId,
          symbol: coinId.slice(0, 5),
          name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
          image: '',
          current_price: pData[coinId].usd || 0,
          market_cap: 0,
          market_cap_rank: null,
          total_volume: 0,
          high_24h: 0,
          low_24h: 0,
          price_change_percentage_24h: pData[coinId].usd_24h_change || 0,
          ath: 0,
          sparkline_in_7d: null
        };
      }
    } catch(e) {}

    return null;
  }

  // ==================== CHART DATA ====================
  async function fetchChartData(coinId, timeframe) {
    const tfConfig = {
      '1m':  { days: 1,  label: '1 Min' },
      '5m':  { days: 1,  label: '5 Min' },
      '15m': { days: 1,  label: '15 Min' },
      '1h':  { days: 1,  label: '1 Hora' },
      '1S':  { days: 7,  label: '1 Semana' },
      '1M':  { days: 30, label: '1 Mes' }
    };

    const config = tfConfig[timeframe] || tfConfig['1h'];
    const cacheKey = coinId + '-' + config.days;

    if (chartCache[cacheKey] && (Date.now() - chartCache[cacheKey].timestamp) < 30000) {
      return sliceChartData(chartCache[cacheKey].data, timeframe);
    }

    const url = BASE_URL + '/coins/' + coinId + '/market_chart?vs_currency=usd&days=' + config.days;
    const data = await fetchWithRetry(url);

    if (data && data.prices) {
      chartCache[cacheKey] = { data: data.prices, timestamp: Date.now() };
      return sliceChartData(data.prices, timeframe);
    }
    return null;
  }

  function sliceChartData(prices, timeframe) {
    if (!prices || prices.length === 0) return { prices: [], labels: [], values: [] };

    const now = Date.now();
    const windows = {
      '1m':  1 * 60 * 1000,
      '5m':  5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h':  60 * 60 * 1000,
      '1S':  7 * 24 * 60 * 60 * 1000,
      '1M':  30 * 24 * 60 * 60 * 1000
    };

    const windowMs = windows[timeframe] || windows['1h'];
    const cutoff = now - windowMs;

    let filtered = prices.filter(p => p[0] >= cutoff);
    if (filtered.length < 3) {
      filtered = prices.slice(-Math.min(10, prices.length));
    }

    return {
      prices: filtered,
      labels: filtered.map(p => p[0]),
      values: filtered.map(p => p[1])
    };
  }

  // ==================== POLLING ====================
  function startPolling(callback) {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
      const data = await fetchMarketData();
      if (data && callback) callback(data);
    }, POLL_INTERVAL);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  function getCache() { return marketCache; }

  // Fallback data in case the external API is unreachable or rate-limited on first launch
  function getFallbackMarketData() {
    const list = [
      { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 68450, market_cap: 1350000000000, market_cap_rank: 1, price_change_percentage_24h: 2.45, total_volume: 28000000000, ath: 73750, image: "https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png" },
      { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 3620, market_cap: 435000000000, market_cap_rank: 2, price_change_percentage_24h: 3.12, total_volume: 17000000000, ath: 4891, image: "https://coin-images.coingecko.com/coins/images/279/thumb/ethereum.png" },
      { id: "tether", symbol: "usdt", name: "Tether", current_price: 1.0, market_cap: 114000000000, market_cap_rank: 3, price_change_percentage_24h: 0.02, total_volume: 45000000000, ath: 1.32, image: "https://coin-images.coingecko.com/coins/images/325/thumb/Tether.png" },
      { id: "binancecoin", symbol: "bnb", name: "BNB", current_price: 590, market_cap: 89000000000, market_cap_rank: 4, price_change_percentage_24h: 1.84, total_volume: 1100000000, ath: 720, image: "https://coin-images.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png" },
      { id: "solana", symbol: "sol", name: "Solana", current_price: 165, market_cap: 77000000000, market_cap_rank: 5, price_change_percentage_24h: 5.68, total_volume: 4200000000, ath: 260, image: "https://coin-images.coingecko.com/coins/images/4128/thumb/solana.png" },
      { id: "ripple", symbol: "xrp", name: "XRP", current_price: 0.58, market_cap: 32000000000, market_cap_rank: 6, price_change_percentage_24h: 1.15, total_volume: 1300000000, ath: 3.84, image: "https://coin-images.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png" },
      { id: "dogecoin", symbol: "doge", name: "Dogecoin", current_price: 0.12, market_cap: 17000000000, market_cap_rank: 7, price_change_percentage_24h: 4.22, total_volume: 850000000, ath: 0.73, image: "https://coin-images.coingecko.com/coins/images/5/thumb/dogecoin.png" },
      { id: "cardano", symbol: "ada", name: "Cardano", current_price: 0.38, market_cap: 13600000000, market_cap_rank: 8, price_change_percentage_24h: 2.10, total_volume: 340000000, ath: 3.10, image: "https://coin-images.coingecko.com/coins/images/975/thumb/cardano.png" },
      { id: "avalanche-2", symbol: "avax", name: "Avalanche", current_price: 28.5, market_cap: 11300000000, market_cap_rank: 9, price_change_percentage_24h: 3.80, total_volume: 410000000, ath: 146, image: "https://coin-images.coingecko.com/coins/images/12559/thumb/Avalanche_Circle_RedWhite_Trans.png" },
      { id: "shiba-inu", symbol: "shib", name: "Shiba Inu", current_price: 0.000018, market_cap: 10600000000, market_cap_rank: 10, price_change_percentage_24h: 3.45, total_volume: 380000000, ath: 0.000088, image: "https://coin-images.coingecko.com/coins/images/11939/thumb/shiba.png" }
    ];
    return list;
  }

  function getGainersCache() { return gainersCache; }

  return {
    fetchMarketData,
    fetchGainers,
    searchCoins,
    searchAll,
    fetchCoinDetail,
    fetchChartData,
    startPolling,
    stopPolling,
    getCache,
    getGainersCache
  };
})();
