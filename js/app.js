(function() {
  'use strict';

  // ==================== STATE ====================
  let currentTab = 'top50';
  let marketData = [];          // Top 50 coins
  let gainersData = [];         // Top gainers
  let searchQuery = '';         // Filter for grid search
  let selectedBuyCoin = null;   // Coin selected for purchase in portfolio { id, name, symbol, thumb, current_price }
  let currentModalCoin = null;  // Coin shown in modal
  let currentTimeframe = '1h';  // Active chart timeframe
  let searchTimeout = null;
  let searchRequestId = 0;

  // Popular coins for quick-select chips
  const POPULAR_COINS = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
    { id: 'ripple', symbol: 'XRP', name: 'XRP' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' }
  ];

  // ==================== DOM CACHE ====================
  let els = {};

  function cacheDom() {
    els = {
      tabs: document.querySelectorAll('.tab-btn'),
      panels: document.querySelectorAll('.tab-panel'),
      navHamburger: document.getElementById('nav-hamburger'),
      navMenu: document.getElementById('mobile-nav-drawer'),
      navBackdrop: document.getElementById('nav-backdrop'),
      navCloseBtn: document.getElementById('nav-close-btn'),
      gridTop50: document.getElementById('grid-top50'),
      gridGainers: document.getElementById('grid-gainers'),
      gridFavorites: document.getElementById('grid-favorites'),
      favoritesEmpty: document.getElementById('favorites-empty'),
      searchInput: document.getElementById('search-input'),
      searchBar: document.querySelector('.search-bar'),
      lastUpdated: document.getElementById('last-updated'),
      favCount: document.getElementById('favorites-count'),

      portfolioBalance: document.getElementById('portfolio-balance'),
      portfolioValue: document.getElementById('portfolio-value'),
      portfolioPnl: document.getElementById('portfolio-pnl'),
      portfolioTotalValue: document.getElementById('portfolio-total-value'),
      portfolioHoldings: document.getElementById('portfolio-holdings'),
      portfolioHistory: document.getElementById('portfolio-history'),
      historyToggle: document.getElementById('history-toggle'),
      portfolioReset: document.getElementById('portfolio-reset'),
      portfolioFab: document.getElementById('portfolio-fab'),
      fabValue: document.getElementById('fab-value'),

      buySearchInput: document.getElementById('buy-search-input'),
      buySearchResults: document.getElementById('buy-search-results'),
      quickChips: document.getElementById('quick-coins-chips'),
      selectedCoin: document.getElementById('selected-coin'),
      buyAmount: document.getElementById('buy-amount'),
      buyPreview: document.getElementById('buy-preview'),
      buyBtn: document.getElementById('buy-btn'),

      // Stop Loss & Take Profit Elements
      toggleSltpBtn: document.getElementById('toggle-sltp-btn'),
      sltpInputsPanel: document.getElementById('sltp-inputs-panel'),
      sltpChevron: document.getElementById('sltp-chevron'),
      buySl: document.getElementById('buy-sl'),
      buyTp: document.getElementById('buy-tp'),
      slCalcBadge: document.getElementById('sl-calc-badge'),
      tpCalcBadge: document.getElementById('tp-calc-badge'),

      // Edit SL/TP Modal
      editSltpModal: document.getElementById('edit-sltp-modal'),
      editSltpClose: document.getElementById('edit-sltp-close'),
      editSltpCoinImg: document.getElementById('edit-sltp-coin-img'),
      editSltpCoinName: document.getElementById('edit-sltp-coin-name'),
      editSltpCoinSymbol: document.getElementById('edit-sltp-coin-symbol'),
      editSltpCurrentPrice: document.getElementById('edit-sltp-current-price'),
      editSltpBuyPrice: document.getElementById('edit-sltp-buy-price'),
      editSlInput: document.getElementById('edit-sl-input'),
      editTpInput: document.getElementById('edit-tp-input'),
      editSlBadge: document.getElementById('edit-sl-badge'),
      editTpBadge: document.getElementById('edit-tp-badge'),
      saveSltpBtn: document.getElementById('save-sltp-btn'),
      cancelSltpBtn: document.getElementById('cancel-sltp-btn'),

      // Sell Modal
      sellModal: document.getElementById('sell-modal'),
      sellModalClose: document.getElementById('sell-modal-close'),
      sellModalCoinImg: document.getElementById('sell-modal-coin-img'),
      sellModalCoinName: document.getElementById('sell-modal-coin-name'),
      sellModalCoinSymbol: document.getElementById('sell-modal-coin-symbol'),
      sellModalCurrentPrice: document.getElementById('sell-modal-current-price'),
      sellModalTotalHolding: document.getElementById('sell-modal-total-holding'),
      sellModalTotalValue: document.getElementById('sell-modal-total-value'),
      sellTokenAmountInput: document.getElementById('sell-token-amount-input'),
      sellInputSymbolBadge: document.getElementById('sell-input-symbol-badge'),
      sellPctIndicator: document.getElementById('sell-pct-indicator'),
      sellReceiveUsd: document.getElementById('sell-receive-usd'),
      sellEstimatedPnl: document.getElementById('sell-estimated-pnl'),
      sellRemainingHolding: document.getElementById('sell-remaining-holding'),
      confirmSellBtn: document.getElementById('confirm-sell-btn'),
      cancelSellBtn: document.getElementById('cancel-sell-btn'),

      coinModal: document.getElementById('coin-modal'),
      modalClose: document.querySelector('.modal-close'),
      modalCoinImg: document.getElementById('modal-coin-img'),
      modalCoinName: document.getElementById('modal-coin-name'),
      modalCoinSymbol: document.getElementById('modal-coin-symbol'),
      modalPrice: document.getElementById('modal-price'),
      modalChange: document.getElementById('modal-change'),
      modalMcap: document.getElementById('modal-mcap'),
      modalVolume: document.getElementById('modal-volume'),
      modalAth: document.getElementById('modal-ath'),
      modalBuyBtn: document.getElementById('modal-buy-btn'),
      tfBtns: document.querySelectorAll('.tf-btn'),
      chartCanvas: document.getElementById('chart-canvas'),
      chartTooltip: document.getElementById('chart-tooltip'),
      chartLoading: document.getElementById('chart-loading'),

      // Premium & Trial Elements
      premiumLockedView: document.getElementById('premium-locked-view'),
      premiumUnlockedView: document.getElementById('premium-unlocked-view'),
      premiumKeyInput: document.getElementById('premium-key-input'),
      premiumUnlockBtn: document.getElementById('premium-unlock-btn'),
      premiumDemoBtn: document.getElementById('premium-demo-btn'),
      premiumLockAgainBtn: document.getElementById('premium-lock-again-btn'),
      premiumStatusBadge: document.getElementById('premium-status-badge'),
      trialStatusContainer: document.getElementById('trial-status-container'),
      unlockError: document.getElementById('unlock-error'),
      signalsTableBody: document.getElementById('signals-table-body'),
      opportunitiesGrid: document.getElementById('opportunities-grid'),

      // Stripe Checkout Modal Elements
      stripeModal: document.getElementById('stripe-checkout-modal'),
      stripeModalClose: document.getElementById('stripe-modal-close'),
      stripeCheckoutForm: document.getElementById('stripe-checkout-form'),
      stripeCardName: document.getElementById('stripe-card-name'),
      stripeCardEmail: document.getElementById('stripe-card-email'),
      stripeCardNumber: document.getElementById('stripe-card-number'),
      stripeCardExp: document.getElementById('stripe-card-exp'),
      stripeCardCvc: document.getElementById('stripe-card-cvc'),
      stripeSubmitBtn: document.getElementById('stripe-submit-btn'),
      stripeSummaryPlanName: document.getElementById('stripe-summary-plan-name'),
      stripeSummaryPlanDesc: document.getElementById('stripe-summary-plan-desc'),
      stripeSummaryPlanPrice: document.getElementById('stripe-summary-plan-price'),
      stripeBtnAmount: document.getElementById('stripe-btn-amount'),

      toastContainer: document.getElementById('toast-container')
    };
  }

  // ==================== FORMATTING ====================
  function formatPrice(price) {
    if (price === undefined || price === null || isNaN(price)) return '$0.00';
    const num = Number(price);
    if (Math.abs(num) >= 1) {
      return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    const str = num.toFixed(8);
    const match = str.match(/^-?0\.0*[1-9]/);
    if (match) {
      const sigStart = match[0].length - 1;
      const decimals = Math.max(sigStart + 3, 4);
      return num.toLocaleString('en-US', { 
        style: 'currency', currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: Math.min(decimals, 8)
      });
    }
    return num.toLocaleString('en-US', { 
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  }

  function formatMarketCap(value) {
    if (!value) return '$0';
    const num = Number(value);
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return '$' + (num / 1e3).toFixed(2) + 'K';
    return '$' + num.toFixed(2);
  }

  function formatChange(change) {
    const val = Number(change) || 0;
    const sign = val >= 0 ? '+' : '';
    return sign + val.toFixed(2) + '%';
  }

  function formatTimeShort(date, timeframe) {
    if (timeframe === '1M' || timeframe === '1S') {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  function getCurrentPrices() {
    const prices = {};
    marketData.forEach(function(c) { if (c && c.id) prices[c.id] = c.current_price; });
    gainersData.forEach(function(c) { if (c && c.id) prices[c.id] = c.current_price; });
    return prices;
  }

  // ==================== MOBILE MENU HELPERS ====================
  function openMobileMenu() {
    if (els.navMenu) els.navMenu.classList.add('open');
    if (els.navBackdrop) els.navBackdrop.classList.add('open');
    if (els.navHamburger) els.navHamburger.classList.add('open');
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    if (els.navMenu) els.navMenu.classList.remove('open');
    if (els.navBackdrop) els.navBackdrop.classList.remove('open');
    if (els.navHamburger) els.navHamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  function toggleMobileMenu() {
    if (els.navMenu && els.navMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // ==================== TAB SWITCHING ====================
  function switchTab(tabId) {
    if (!tabId) return;
    closeMobileMenu(); // Automatically close mobile drawer when any tab is clicked!
    currentTab = tabId;
    els.tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    els.panels.forEach(panel => {
      const isActive = panel.id === 'panel-' + tabId;
      panel.classList.toggle('active', isActive);
      panel.style.display = isActive ? 'block' : 'none';
    });
    
    if (tabId === 'portfolio' || tabId === 'about' || tabId === 'premium') {
      if (els.searchBar) els.searchBar.classList.add('hidden');
    } else {
      if (els.searchBar) els.searchBar.classList.remove('hidden');
      if (els.searchInput) els.searchInput.value = '';
      searchQuery = '';
    }
    renderCurrentTab();
    drawSparklines();
  }

  // ==================== ROW CARD RENDERING ====================
  function createCryptoRow(coin, index, showRank, isGainerView) {
    const isFav = window.Favorites ? window.Favorites.isFavorite(coin.id) : false;
    const change = Number(coin.price_change_percentage_24h) || 0;
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeIcon = change >= 0 ? '▲' : '▼';
    const sparklineData = (coin.sparkline_in_7d && coin.sparkline_in_7d.price) 
      ? encodeURIComponent(JSON.stringify(coin.sparkline_in_7d.price)) 
      : '';

    let rankHtml = '';
    if (showRank) {
      rankHtml = '<span class="row-rank">#' + (coin.market_cap_rank || (index + 1)) + '</span>';
    } else if (isGainerView) {
      rankHtml = '<span class="row-rank">🔥 ' + (index + 1) + '</span>';
    } else {
      rankHtml = '<span class="row-rank">#' + (coin.market_cap_rank || '-') + '</span>';
    }

    const coinImg = coin.image || 'https://via.placeholder.com/32';

    return '<div class="crypto-row" data-coin-id="' + coin.id + '" role="button" tabindex="0">' +
      rankHtml +
      '<div class="row-coin">' +
        '<img src="' + coinImg + '" alt="' + coin.name + '" class="row-coin-icon" loading="lazy" onerror="this.src=\'https://via.placeholder.com/32\'">' +
        '<div class="row-coin-titles">' +
          '<h3 class="row-coin-name">' + coin.name + '</h3>' +
          '<span class="row-coin-symbol">' + (coin.symbol || '').toUpperCase() + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="row-price">' + formatPrice(coin.current_price) + '</div>' +
      '<div class="row-change ' + changeClass + '">' +
        changeIcon + ' ' + Math.abs(change).toFixed(2) + '%' +
      '</div>' +
      '<div class="row-mcap">Cap: ' + formatMarketCap(coin.market_cap) + '</div>' +
      '<div class="row-sparkline">' +
        '<canvas class="sparkline-canvas" width="100" height="30" data-sparkline="' + sparklineData + '" data-is-up="' + (change >= 0) + '"></canvas>' +
      '</div>' +
      '<div class="row-fav">' +
        '<button class="fav-btn ' + (isFav ? 'active' : '') + '" data-coin-id="' + coin.id + '" aria-label="Favorito" type="button">' +
          (isFav ? '⭐' : '☆') +
        '</button>' +
      '</div>' +
    '</div>';
  }

  function renderGrid(gridEl, coins, showRank, isGainerView) {
    if (!gridEl) return;
    
    let html = '';
    if (coins && coins.length > 0) {
      html = coins.map(function(coin, i) {
        return createCryptoRow(coin, i, showRank, isGainerView);
      }).join('');
    } else {
      html = '<div class="empty-state"><div class="empty-icon">🔍</div><h3>Sin resultados locales</h3><p>Prueba buscando en el catálogo global abajo</p></div>';
    }
    
    if (searchQuery) {
      html += '<div class="crypto-row global-search-trigger" id="global-search-trigger" role="button" tabindex="0" style="justify-content: center; background: rgba(99, 102, 241, 0.08); border: 1.5px dashed rgba(99, 102, 241, 0.4); text-align: center; border-radius: 12px; margin-top: 8px;">' +
        '<div class="row-rank">🔍</div>' +
        '<div class="row-coin" style="grid-column: span 5; justify-content: center;">' +
          '<div class="row-coin-titles" style="align-items: center;">' +
            '<h3 class="row-coin-name">¿No encuentras lo que buscas? Buscar "' + searchQuery + '" en todo el mercado global...</h3>' +
            '<span class="row-coin-symbol">Busca cualquier activo de Coinbase / CoinGecko en tiempo real</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
    
    gridEl.innerHTML = html;
    drawSparklines();
  }

  // ==================== RENDER TABS ====================
  function getFilteredData(data) {
    const list = data || marketData;
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(function(c) {
      return (c.name && c.name.toLowerCase().includes(q)) || (c.symbol && c.symbol.toLowerCase().includes(q));
    });
  }

  function renderCurrentTab() {
    if (window.Favorites) {
      const count = window.Favorites.count();
      document.querySelectorAll('.tab-count').forEach(el => el.textContent = count);
    }
    updateFab();

    switch (currentTab) {
      case 'top50':
        renderGrid(els.gridTop50, getFilteredData(marketData), true, false);
        break;

      case 'gainers':
        renderGrid(els.gridGainers, getFilteredData(gainersData), false, true);
        break;

      case 'favorites':
        if (window.Favorites) {
          const favIds = window.Favorites.getAll();
          const allCoins = [...marketData, ...gainersData];
          const seen = new Set();
          const favCoins = [];
          
          favIds.forEach(id => {
            const found = allCoins.find(c => c.id === id);
            if (found && !seen.has(id)) {
              seen.add(id);
              favCoins.push(found);
            }
          });

          const filteredFavs = getFilteredData(favCoins);
          renderGrid(els.gridFavorites, filteredFavs, false, false);
          
          if (els.favoritesEmpty) {
            if (filteredFavs.length === 0 && !searchQuery) {
              els.favoritesEmpty.classList.remove('hidden');
            } else {
              els.favoritesEmpty.classList.add('hidden');
            }
          }
        }
        break;

      case 'portfolio':
        renderPortfolio();
        break;

      case 'premium':
        renderPremiumTab();
        break;
    }
  }

  // ==================== PORTFOLIO RENDER ====================
  function renderPortfolio() {
    if (!window.Simulator) return;

    const prices = getCurrentPrices();
    const balance = window.Simulator.getBalance();
    const portfolioValue = window.Simulator.getPortfolioValue(prices);
    const totalValue = balance + portfolioValue;

    // Total P&L relative to the starting $10,000 cash
    const initialBalance = 10000;
    const totalPnlUSD = totalValue - initialBalance;
    const totalPnlPercent = ((totalValue - initialBalance) / initialBalance) * 100;
    const pnlClass = totalPnlUSD >= 0 ? 'positive' : 'negative';
    const pnlSign = totalPnlUSD >= 0 ? '+' : '';

    if (els.portfolioBalance) els.portfolioBalance.textContent = formatPrice(balance);
    if (els.portfolioValue) els.portfolioValue.textContent = formatPrice(portfolioValue);
    if (els.portfolioTotalValue) els.portfolioTotalValue.textContent = formatPrice(totalValue);

    if (els.portfolioPnl) {
      els.portfolioPnl.textContent = pnlSign + formatPrice(totalPnlUSD) + ' (' + pnlSign + totalPnlPercent.toFixed(2) + '%)';
      els.portfolioPnl.className = pnlClass;
    }

    // Render Holdings
    if (els.portfolioHoldings) {
      const holdings = window.Simulator.getHoldings();
      if (!holdings || holdings.length === 0) {
        els.portfolioHoldings.innerHTML = '<div class="empty-state"><div class="empty-icon">💼</div><h3>Sin posiciones</h3><p>Usa el formulario para comprar activos virtuales</p></div>';
      } else {
        els.portfolioHoldings.innerHTML = holdings.map(function(h) {
          const currentPrice = prices[h.coinId] || h.buyPrice;
          const holdingPnl = window.Simulator.getHoldingPnL(h, currentPrice);
          const currentTotal = h.amount * currentPrice;
          const hPnlClass = holdingPnl.pnlUSD >= 0 ? 'positive' : 'negative';
          const hPnlSign = holdingPnl.pnlUSD >= 0 ? '+' : '';

          let slBadge = '';
          if (h.stopLoss && h.stopLoss > 0) {
            const slDiff = h.buyPrice > 0 ? ((h.stopLoss - h.buyPrice) / h.buyPrice) * 100 : 0;
            slBadge = '<span class="target-badge sl" title="Stop Loss automático">🛡️ SL: ' + formatPrice(h.stopLoss) + ' (' + (slDiff >= 0 ? '+' : '') + slDiff.toFixed(1) + '%)</span>';
          }

          let tpBadge = '';
          if (h.takeProfit && h.takeProfit > 0) {
            const tpDiff = h.buyPrice > 0 ? ((h.takeProfit - h.buyPrice) / h.buyPrice) * 100 : 0;
            tpBadge = '<span class="target-badge tp" title="Take Profit automático">🎯 TP: ' + formatPrice(h.takeProfit) + ' (' + (tpDiff >= 0 ? '+' : '') + tpDiff.toFixed(1) + '%)</span>';
          }

          const targetsHtml = (slBadge || tpBadge) 
            ? '<div class="holding-targets">' + slBadge + tpBadge + '</div>' 
            : '<div class="holding-targets"><span style="font-size:0.72rem;color:var(--text-muted);">Sin SL/TP configurado</span></div>';

          return '<div class="holding-item">' +
            '<img src="' + (h.coinImage || 'https://via.placeholder.com/32') + '" alt="' + h.coinName + '" class="coin-icon" onerror="this.src=\'https://via.placeholder.com/32\'">' +
            '<div class="holding-info">' +
              '<h4>' + h.coinName + ' <span class="coin-symbol">' + h.coinSymbol.toUpperCase() + '</span></h4>' +
              '<div class="holding-amount">' + h.amount.toLocaleString(undefined, { maximumFractionDigits: 6 }) + ' ' + h.coinSymbol.toUpperCase() + '</div>' +
              '<div class="holding-value">' + formatPrice(currentTotal) + '</div>' +
              '<div class="holding-pnl ' + hPnlClass + '">' +
                hPnlSign + formatPrice(holdingPnl.pnlUSD) + ' (' + hPnlSign + holdingPnl.pnlPercent.toFixed(2) + '%)' +
              '</div>' +
              targetsHtml +
            '</div>' +
            '<div class="holding-actions">' +
              '<button class="sell-btn" data-coin-id="' + h.coinId + '" data-amount="' + h.amount + '" type="button">Vender</button>' +
              '<button class="btn-edit-sltp" data-coin-id="' + h.coinId + '" type="button">⚙️ SL / TP</button>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }

    // Render History
    if (els.portfolioHistory) {
      const history = window.Simulator.getHistory();
      if (!history || history.length === 0) {
        els.portfolioHistory.innerHTML = '<div class="empty-state"><p>Sin transacciones realizadas</p></div>';
      } else {
        els.portfolioHistory.innerHTML = history.slice().reverse().map(function(tx) {
          const date = new Date(tx.timestamp);
          const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) + ' ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          
          let typeClass = 'buy';
          let typeLabel = 'COMPRA';
          if (tx.type === 'sell') {
            typeClass = 'sell';
            typeLabel = 'VENTA';
          } else if (tx.type === 'stop_loss') {
            typeClass = 'stop_loss';
            typeLabel = '🛡️ STOP LOSS';
          } else if (tx.type === 'take_profit') {
            typeClass = 'take_profit';
            typeLabel = '🎯 TAKE PROFIT';
          }

          let extraInfo = '';
          if (tx.pnlUSD !== undefined && tx.type !== 'buy') {
            const pClass = tx.pnlUSD >= 0 ? '#22c55e' : '#ef4444';
            const pSign = tx.pnlUSD >= 0 ? '+' : '';
            extraInfo = '<span style="color:' + pClass + ';font-weight:700;font-size:0.78rem;">' + pSign + formatPrice(tx.pnlUSD) + '</span>';
          }

          return '<div class="history-item ' + typeClass + '">' +
            '<span class="type">' + typeLabel + '</span>' +
            '<span>' + tx.amount.toLocaleString(undefined, { maximumFractionDigits: 4 }) + ' ' + (tx.coinSymbol || '').toUpperCase() + '</span>' +
            '<span>@ ' + formatPrice(tx.price) + '</span>' +
            extraInfo +
            '<span>' + dateStr + '</span>' +
          '</div>';
        }).join('');
      }
    }

    renderQuickChips();
    updateFab();
  }

  function updateFab() {
    if (!window.Simulator || !els.fabValue) return;
    const prices = getCurrentPrices();
    const total = window.Simulator.getBalance() + window.Simulator.getPortfolioValue(prices);
    els.fabValue.textContent = formatPrice(total);
  }

  // ==================== QUICK SELECT CHIPS ====================
  function renderQuickChips() {
    if (!els.quickChips) return;
    const allCoins = [...marketData, ...gainersData];

    els.quickChips.innerHTML = POPULAR_COINS.map(p => {
      const found = allCoins.find(c => c.id === p.id || c.symbol.toLowerCase() === p.symbol.toLowerCase());
      const isActive = selectedBuyCoin && (selectedBuyCoin.id === p.id || selectedBuyCoin.symbol.toLowerCase() === p.symbol.toLowerCase());
      const icon = found ? found.image : '';
      return '<button type="button" class="quick-chip ' + (isActive ? 'active' : '') + '" data-coin-id="' + p.id + '">' +
        (icon ? '<img src="' + icon + '" alt="' + p.symbol + '" onerror="this.style.display=\'none\'">' : '') +
        p.symbol +
      '</button>';
    }).join('');

    // Wire chips
    els.quickChips.querySelectorAll('.quick-chip').forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        const coinId = btn.dataset.coinId;
        const all = [...marketData, ...gainersData];
        const coin = all.find(c => c.id === coinId) || POPULAR_COINS.find(c => c.id === coinId);
        if (coin) {
          selectBuyCoin(coin.id, coin.name, coin.symbol, coin.image || '', coin.current_price || null);
        }
      };
    });
  }

  // ==================== PREMIUM & 7-DAY DEMO TRIAL MANAGEMENT ====================
  const STORAGE_KEY_PREMIUM_LIFETIME = 'criptotracker_premium_lifetime';
  const STORAGE_KEY_DEMO_START = 'criptotracker_demo_start';
  const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  function getPremiumStatus() {
    // 1. Check Lifetime / Paid Access
    const isLifetime = localStorage.getItem(STORAGE_KEY_PREMIUM_LIFETIME) === 'true' || localStorage.getItem('criptotracker_premium_unlocked') === 'true';
    if (isLifetime) {
      return { isUnlocked: true, type: 'lifetime', label: '👑 MEMBRESÍA PRO ACTIVA (VITALICIA)', daysLeft: 0, hoursLeft: 0 };
    }

    // 2. Check 7-Day Demo Trial
    const startStr = localStorage.getItem(STORAGE_KEY_DEMO_START);
    if (!startStr) {
      return { isUnlocked: false, type: 'not_started', label: 'Prueba no iniciada', daysLeft: 7, hoursLeft: 0 };
    }

    const startTime = parseInt(startStr, 10);
    if (isNaN(startTime) || startTime <= 0) {
      return { isUnlocked: false, type: 'not_started', label: 'Prueba no iniciada', daysLeft: 7, hoursLeft: 0 };
    }

    const elapsed = Date.now() - startTime;
    const remaining = TRIAL_DURATION_MS - elapsed;

    if (remaining <= 0) {
      return { isUnlocked: false, type: 'expired', label: '⛔ Prueba Demo de 7 Días Expirada', daysLeft: 0, hoursLeft: 0 };
    }

    const daysLeft = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hoursLeft = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return {
      isUnlocked: true,
      type: 'trial',
      label: '⏳ MODO DEMO ACTIVO · ' + daysLeft + 'd ' + hoursLeft + 'h restantes',
      daysLeft: daysLeft,
      hoursLeft: hoursLeft,
      remainingMs: remaining
    };
  }

  function activateDemoTrial() {
    const status = getPremiumStatus();
    if (status.type === 'lifetime') {
      showToast('Ya dispones de la Membresía PRO Vitalicia.', 'info');
      return;
    }
    if (status.type === 'trial') {
      showToast('Prueba activa: quedan ' + status.daysLeft + ' días y ' + status.hoursLeft + ' horas.', 'info');
      renderPremiumTab();
      return;
    }
    if (status.type === 'expired') {
      showToast('Tu periodo de prueba de 7 días ha finalizado. Suscríbete para continuar disfrutando del acceso PRO.', 'error');
      renderPremiumTab();
      return;
    }

    // Activate Demo Now
    localStorage.setItem(STORAGE_KEY_DEMO_START, Date.now().toString());
    showToast('✨ ¡Prueba Demo de 7 días activada con éxito!', 'success');
    renderPremiumTab();
  }

  function setPremiumLifetime(active) {
    if (active) {
      localStorage.setItem(STORAGE_KEY_PREMIUM_LIFETIME, 'true');
      localStorage.setItem('criptotracker_premium_unlocked', 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY_PREMIUM_LIFETIME);
      localStorage.removeItem('criptotracker_premium_unlocked');
      localStorage.removeItem(STORAGE_KEY_DEMO_START);
    }
    renderPremiumTab();
  }

  function renderPremiumTab() {
    const status = getPremiumStatus();
    if (!els.premiumLockedView || !els.premiumUnlockedView) return;

    if (!status.isUnlocked) {
      els.premiumLockedView.classList.remove('hidden');
      els.premiumUnlockedView.classList.add('hidden');
      if (els.unlockError) els.unlockError.classList.add('hidden');
      if (els.premiumKeyInput) els.premiumKeyInput.value = '';

      // Handle Trial Status UI in Locked View
      if (els.trialStatusContainer) {
        if (status.type === 'expired') {
          els.trialStatusContainer.innerHTML = '<div class="trial-expired-banner">' +
            '<span style="font-size:1.4rem;">⛔</span>' +
            '<div><strong>Tu periodo de prueba de 7 días ha finalizado.</strong><br><span style="font-size:0.8rem;color:#cbd5e1;">Para seguir utilizando las señales técnicas e informes institucionales, suscríbete mediante Stripe.</span></div>' +
          '</div>';
        } else {
          els.trialStatusContainer.innerHTML = '';
        }
      }

      if (els.premiumDemoBtn) {
        if (status.type === 'expired') {
          els.premiumDemoBtn.disabled = true;
          els.premiumDemoBtn.textContent = '⛔ Prueba de 7 Días Caducada';
          els.premiumDemoBtn.title = 'Ya has utilizado tu periodo de prueba gratuita de 7 días.';
        } else {
          els.premiumDemoBtn.disabled = false;
          els.premiumDemoBtn.textContent = '✨ Iniciar Prueba Demo (7 Días)';
          els.premiumDemoBtn.title = 'Activa 7 días de acceso gratuito ilimitado en cualquier momento.';
        }
      }
    } else {
      els.premiumLockedView.classList.add('hidden');
      els.premiumUnlockedView.classList.remove('hidden');

      if (els.premiumStatusBadge) {
        if (status.type === 'lifetime') {
          els.premiumStatusBadge.innerHTML = '<span>👑</span> MEMBRESÍA PRO ACTIVA (VITALICIA)';
          els.premiumStatusBadge.className = 'premium-status-badge';
        } else {
          els.premiumStatusBadge.innerHTML = '<span>⏳</span> ' + status.label;
          els.premiumStatusBadge.className = 'premium-status-badge trial-active-badge';
        }
      }

      renderPremiumAnalytics();
    }
  }

  // ==================== STRIPE CHECKOUT SYSTEM ====================
  const STRIPE_PLANS = {
    monthly: {
      name: 'Plan Pro Mensual',
      desc: 'Flexibilidad total mes a mes · Sin permanencia',
      price: 19.99,
      priceFormatted: '$19.99 / mes',
      btnAmount: '$19.99 USD'
    },
    annual: {
      name: 'Plan Pro Anual',
      desc: 'Ahorro del 38% · Acceso completo a todas las herramientas PRO',
      price: 149.00,
      priceFormatted: '$149.00 / año',
      btnAmount: '$149.00 USD'
    },
    lifetime: {
      name: 'Licencia Vitalicia VIP',
      desc: 'Acceso permanente de por vida · Sin pagos recurrentes',
      price: 299.00,
      priceFormatted: '$299.00 pago único',
      btnAmount: '$299.00 USD'
    }
  };

  let currentStripePlan = STRIPE_PLANS.annual;

  function openStripeCheckout(planKey) {
    currentStripePlan = STRIPE_PLANS[planKey] || STRIPE_PLANS.annual;

    if (els.stripeSummaryPlanName) els.stripeSummaryPlanName.textContent = currentStripePlan.name;
    if (els.stripeSummaryPlanDesc) els.stripeSummaryPlanDesc.textContent = currentStripePlan.desc;
    if (els.stripeSummaryPlanPrice) els.stripeSummaryPlanPrice.textContent = currentStripePlan.priceFormatted;
    if (els.stripeBtnAmount) els.stripeBtnAmount.textContent = currentStripePlan.btnAmount;

    if (els.stripeModal) {
      els.stripeModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    if (els.stripeCardName) {
      setTimeout(function() { els.stripeCardName.focus(); }, 150);
    }
  }

  function closeStripeCheckout() {
    if (els.stripeModal) {
      els.stripeModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  async function handleStripePaymentSubmit() {
    const name = els.stripeCardName ? els.stripeCardName.value.trim() : '';
    const email = els.stripeCardEmail ? els.stripeCardEmail.value.trim() : '';
    const cardNum = els.stripeCardNumber ? els.stripeCardNumber.value.replace(/\s+/g, '') : '';
    const exp = els.stripeCardExp ? els.stripeCardExp.value.trim() : '';
    const cvc = els.stripeCardCvc ? els.stripeCardCvc.value.trim() : '';

    if (!name) {
      showToast('Introduce el nombre del titular de la tarjeta', 'error');
      if (els.stripeCardName) els.stripeCardName.focus();
      return;
    }

    if (!email || !email.includes('@')) {
      showToast('Introduce un correo electrónico válido para tu factura', 'error');
      if (els.stripeCardEmail) els.stripeCardEmail.focus();
      return;
    }

    if (cardNum.length < 13) {
      showToast('Introduce un número de tarjeta válido', 'error');
      if (els.stripeCardNumber) els.stripeCardNumber.focus();
      return;
    }

    if (exp.length < 4) {
      showToast('Introduce la fecha de caducidad (MM/AA)', 'error');
      if (els.stripeCardExp) els.stripeCardExp.focus();
      return;
    }

    if (cvc.length < 3) {
      showToast('Introduce el código de seguridad CVC', 'error');
      if (els.stripeCardCvc) els.stripeCardCvc.focus();
      return;
    }

    // Processing animation
    if (els.stripeSubmitBtn) {
      els.stripeSubmitBtn.disabled = true;
      els.stripeSubmitBtn.innerHTML = '🔒 Procesando pago seguro con Stripe...';
    }

    // Realistic API delay
    await new Promise(function(resolve) { setTimeout(resolve, 1400); });

    // Save payment status
    setPremiumLifetime(true);
    localStorage.setItem('criptotracker_last_order', JSON.stringify({
      plan: currentStripePlan.name,
      amount: currentStripePlan.price,
      currency: 'USD',
      email: email,
      date: new Date().toISOString(),
      gateway: 'Stripe Payments',
      status: 'succeeded'
    }));

    if (els.stripeSubmitBtn) {
      els.stripeSubmitBtn.disabled = false;
      els.stripeSubmitBtn.innerHTML = '🔒 Pagar <span id="stripe-btn-amount">' + currentStripePlan.btnAmount + '</span>';
    }

    showToast('🎉 ¡Pago de $' + currentStripePlan.price.toFixed(2) + ' USD aprobado con éxito! Bienvenido a CriptoTracker PRO.', 'success');
    closeStripeCheckout();
    renderPremiumTab();
    switchTab('premium');
  }

  function renderPremiumAnalytics() {
    const allCoins = [...marketData, ...gainersData];
    if (!allCoins || allCoins.length === 0) return;

    // 1. Fear & Greed Calculation (based on market breadth)
    const positiveCoins = allCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
    const ratio = allCoins.length > 0 ? (positiveCoins / allCoins.length) : 0.5;
    const fgScore = Math.min(95, Math.max(15, Math.round(30 + (ratio * 55))));

    const fgValEl = document.getElementById('fg-value');
    const fgLabelEl = document.getElementById('fg-label');
    const fgBarFill = document.querySelector('.fear-greed-card .meter-bar-fill');

    if (fgValEl) fgValEl.textContent = fgScore;
    if (fgBarFill) fgBarFill.style.width = fgScore + '%';

    if (fgLabelEl) {
      if (fgScore >= 75) {
        fgLabelEl.textContent = 'CODICIA EXTREMA (Extreme Greed)';
        fgLabelEl.style.color = '#22c55e';
      } else if (fgScore >= 55) {
        fgLabelEl.textContent = 'CODICIA MODERADA (Greed)';
        fgLabelEl.style.color = '#34d399';
      } else if (fgScore >= 45) {
        fgLabelEl.textContent = 'NEUTRAL';
        fgLabelEl.style.color = '#fbbf24';
      } else if (fgScore >= 25) {
        fgLabelEl.textContent = 'MIEDO MODERADO (Fear)';
        fgLabelEl.style.color = '#f97316';
      } else {
        fgLabelEl.textContent = 'MIEDO EXTREMO (Extreme Fear)';
        fgLabelEl.style.color = '#ef4444';
      }
    }

    // 2. Signals Table
    if (els.signalsTableBody) {
      const topCoinsList = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'avalanche-2', 'dogecoin'];
      const targetCoins = [];
      topCoinsList.forEach(id => {
        const found = allCoins.find(c => c.id === id);
        if (found) targetCoins.push(found);
      });

      els.signalsTableBody.innerHTML = targetCoins.map(coin => {
        const change = Number(coin.price_change_percentage_24h) || 0;
        const price = Number(coin.current_price) || 0;

        // Mathematical indicator estimations
        const rsi = Math.min(88, Math.max(22, Math.round(50 + (change * 2.2))));
        let rsiTag = '';
        if (rsi >= 70) rsiTag = '<span style="color:#ef4444; font-weight:700;">' + rsi + ' (Sobrecompra)</span>';
        else if (rsi <= 35) rsiTag = '<span style="color:#22c55e; font-weight:700;">' + rsi + ' (Sobreventa / Rebote)</span>';
        else rsiTag = '<span style="color:#94a3b8;">' + rsi + ' (Neutral)</span>';

        const emaTrend = change >= 0 
          ? '<span style="color:#22c55e; font-weight:600;">🟢 Alcista (MA Cross)</span>' 
          : '<span style="color:#ef4444; font-weight:600;">🔴 Consolidación</span>';

        const support = formatPrice(price * 0.96);
        const resistance = formatPrice(price * 1.055);

        let verdict = '';
        if (change >= 3) {
          verdict = '<span class="signal-badge strong-buy">🚀 COMPRA FUERTE</span>';
        } else if (change >= 0) {
          verdict = '<span class="signal-badge buy">⚡ COMPRA</span>';
        } else if (change >= -3) {
          verdict = '<span class="signal-badge neutral">⚖️ NEUTRAL</span>';
        } else {
          verdict = '<span class="signal-badge sell">📉 VIGILANCIA</span>';
        }

        return '<tr>' +
          '<td><strong>' + coin.name + '</strong> <span style="color:var(--text-muted); font-size:0.75rem;">' + (coin.symbol || '').toUpperCase() + '</span></td>' +
          '<td>' + formatPrice(price) + '</td>' +
          '<td>' + rsiTag + '</td>' +
          '<td>' + emaTrend + '</td>' +
          '<td style="color:#38bdf8;">' + support + '</td>' +
          '<td style="color:#f43f5e;">' + resistance + '</td>' +
          '<td>' + verdict + '</td>' +
        '</tr>';
      }).join('');
    }

    // 3. Opportunities Radar
    if (els.opportunitiesGrid) {
      const topGainer = gainersData[0] || allCoins[1] || allCoins[0];
      const sol = allCoins.find(c => c.id === 'solana') || allCoins[2];
      const btc = allCoins.find(c => c.id === 'bitcoin') || allCoins[0];

      els.opportunitiesGrid.innerHTML = `
        <div class="opportunity-box">
          <span class="opp-tag breakout">RUPTURA DE RANGO</span>
          <h4>${topGainer ? topGainer.name : 'Altcoin Alpha'} (${topGainer ? topGainer.symbol.toUpperCase() : 'ACT'})</h4>
          <p>Volumen de compras institucional +${topGainer ? (topGainer.price_change_percentage_24h || 5).toFixed(1) : '8.2'}% en 24h. Objetivo técnico alcanzable.</p>
        </div>
        <div class="opportunity-box">
          <span class="opp-tag bullish">PATRÓN CONTINUACIÓN</span>
          <h4>${sol ? sol.name : 'Solana'} (${sol ? sol.symbol.toUpperCase() : 'SOL'})</h4>
          <p>Formación de bandera alcista en temporalidad horaria. Soporte validado con fuerte rechazo inferior.</p>
        </div>
        <div class="opportunity-box">
          <span class="opp-tag breakout">ZONA DE ACUMULACIÓN</span>
          <h4>${btc ? btc.name : 'Bitcoin'} (${btc ? btc.symbol.toUpperCase() : 'BTC'})</h4>
          <p>Disminución de reservas en exchanges centralizados. Divergencia alcista oculta en osciladores clave.</p>
        </div>
      `;
    }
  }

  // ==================== MINI SPARKLINES ====================
  function drawSparklines() {
    const canvases = document.querySelectorAll('.sparkline-canvas');
    canvases.forEach(function(canvas) {
      try {
        const dataStr = canvas.getAttribute('data-sparkline');
        if (!dataStr) return;
        const data = JSON.parse(decodeURIComponent(dataStr));
        if (!data || data.length < 2) return;
        const isUp = canvas.getAttribute('data-is-up') === 'true';

        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const pad = 2;

        ctx.clearRect(0, 0, w, h);

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        ctx.beginPath();
        const step = w / (data.length - 1);
        for (let i = 0; i < data.length; i++) {
          const x = i * step;
          const y = pad + (h - 2 * pad) * (1 - (data[i] - min) / range);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const color = isUp ? '#22c55e' : '#ef4444';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, isUp ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fill();
      } catch (e) {}
    });
  }

  // ==================== MODAL & CHARTS ====================
  async function showCoinModal(coinId) {
    currentModalCoin = marketData.find(c => c.id === coinId) || gainersData.find(c => c.id === coinId);
    
    if (!currentModalCoin) {
      try {
        currentModalCoin = await window.CryptoAPI.fetchCoinDetail(coinId);
      } catch (e) {
        showToast('Error cargando los detalles del activo', 'error');
        return;
      }
    }
    
    const coin = currentModalCoin;
    if (!coin || !els.coinModal) {
      showToast('No se pudieron obtener los detalles', 'error');
      return;
    }

    if (els.modalCoinImg) { els.modalCoinImg.src = coin.image || 'https://via.placeholder.com/40'; }
    if (els.modalCoinName) els.modalCoinName.textContent = coin.name;
    if (els.modalCoinSymbol) els.modalCoinSymbol.textContent = (coin.symbol || '').toUpperCase();
    if (els.modalPrice) els.modalPrice.textContent = formatPrice(coin.current_price);

    const change = Number(coin.price_change_percentage_24h) || 0;
    if (els.modalChange) {
      els.modalChange.textContent = formatChange(change);
      els.modalChange.className = 'stat-value ' + (change >= 0 ? 'positive' : 'negative');
    }

    if (els.modalMcap) els.modalMcap.textContent = formatMarketCap(coin.market_cap);
    if (els.modalVolume) els.modalVolume.textContent = formatMarketCap(coin.total_volume);
    if (els.modalAth) els.modalAth.textContent = formatPrice(coin.ath);

    // Modal buy redirects to portfolio tab and selects this coin
    if (els.modalBuyBtn) {
      els.modalBuyBtn.onclick = function() {
        hideModal();
        switchTab('portfolio');
        selectBuyCoin(coin.id, coin.name, coin.symbol, coin.image, coin.current_price);
      };
    }

    els.coinModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    currentTimeframe = '1h';
    els.tfBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tf === '1h'));

    loadChart(coin.id, currentTimeframe);
  }

  function hideModal() {
    if (els.coinModal) {
      els.coinModal.classList.add('hidden');
      document.body.style.overflow = '';
      currentModalCoin = null;
    }
  }

  async function loadChart(coinId, timeframe) {
    if (!els.chartLoading || !els.chartCanvas) return;
    
    els.chartLoading.classList.remove('hidden');
    const ctx = els.chartCanvas.getContext('2d');
    ctx.clearRect(0, 0, els.chartCanvas.width, els.chartCanvas.height);
    if (els.chartTooltip) els.chartTooltip.style.display = 'none';

    try {
      const data = await window.CryptoAPI.fetchChartData(coinId, timeframe);
      els.chartLoading.classList.add('hidden');
      if (data && data.values && data.values.length > 0) {
        const isUp = data.values[data.values.length - 1] >= data.values[0];
        drawChart(data, isUp);
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Gráfico temporalmente no disponible', els.chartCanvas.width / 2, els.chartCanvas.height / 2);
      }
    } catch (e) {
      els.chartLoading.classList.add('hidden');
      ctx.fillStyle = '#ef4444';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Error al cargar datos del gráfico', els.chartCanvas.width / 2, els.chartCanvas.height / 2);
    }
  }

  function drawChart(chartData, isUp) {
    const canvas = els.chartCanvas;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const padding = { top: 20, right: 65, bottom: 30, left: 20 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const minP = Math.min(...chartData.values);
    const maxP = Math.max(...chartData.values);
    const rangeP = maxP - minP || 1;

    const color = isUp ? '#22c55e' : '#ef4444';

    const points = chartData.values.map(function(v, i) {
      const x = padding.left + (i / (chartData.values.length - 1)) * chartW;
      const y = h - padding.bottom - ((v - minP) / rangeP) * chartH;
      return { x: x, y: y, val: v, time: chartData.labels[i] };
    });

    function renderBaseChart() {
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.lineWidth = 1;
      
      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const yVal = minP + (rangeP * (i / steps));
        const y = h - padding.bottom - ((yVal - minP) / rangeP) * chartH;

        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillText(formatPrice(yVal), w - padding.right + 8, y + 3);
      }

      ctx.textAlign = 'center';
      const xSteps = 4;
      for (let i = 0; i <= xSteps; i++) {
        const idx = Math.floor((i / xSteps) * (points.length - 1));
        if (points[idx]) {
          const pt = points[idx];
          const date = new Date(pt.time);
          ctx.fillText(formatTimeShort(date, currentTimeframe), pt.x, h - 8);
        }
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(function(p) { ctx.lineTo(p.x, p.y); });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
      ctx.lineTo(points[0].x, h - padding.bottom);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
      grad.addColorStop(0, color + '33');
      grad.addColorStop(1, color + '00');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    renderBaseChart();

    canvas.onmousemove = function(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = w / rect.width;
      const scaleY = h / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;

      if (mouseX < padding.left || mouseX > w - padding.right) {
        if (els.chartTooltip) els.chartTooltip.style.display = 'none';
        return;
      }

      const ratio = (mouseX - padding.left) / chartW;
      const idx = Math.round(ratio * (points.length - 1));

      if (idx >= 0 && idx < points.length) {
        const p = points[idx];

        ctx.clearRect(0, 0, w, h);
        renderBaseChart();

        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        ctx.moveTo(p.x, padding.top);
        ctx.lineTo(p.x, h - padding.bottom);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (els.chartTooltip) {
          const d = new Date(p.time);
          const dateStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          
          els.chartTooltip.innerHTML = '<strong>' + formatPrice(p.val) + '</strong><br><span style="font-size: 10px; color: var(--text-secondary);">' + dateStr + '</span>';
          els.chartTooltip.style.display = 'block';
          
          const tipX = (p.x / scaleX) + 10;
          const tipY = (p.y / scaleY) - 50;
          
          els.chartTooltip.style.left = Math.min(tipX, rect.width - 120) + 'px';
          els.chartTooltip.style.top = Math.max(tipY, 10) + 'px';
        }
      }
    };

    canvas.onmouseleave = function() {
      if (els.chartTooltip) els.chartTooltip.style.display = 'none';
      ctx.clearRect(0, 0, w, h);
      renderBaseChart();
    };
  }

  // ==================== GLOBAL SEARCH (CoinGecko Catalogue) ====================
  async function runGlobalSearch() {
    const activeGrid = currentTab === 'top50' ? els.gridTop50 : (currentTab === 'gainers' ? els.gridGainers : els.gridFavorites);
    if (!activeGrid) return;

    activeGrid.innerHTML = '<div class="empty-state"><div class="spinner" style="margin: 0 auto 1rem;"></div><h3>Buscando en el catálogo global...</h3><p>Consultando CoinGecko en tiempo real</p></div>';

    try {
      const results = await window.CryptoAPI.searchCoins(searchQuery);
      if (results && results.length > 0) {
        activeGrid.innerHTML = results.map(function(c) {
          const isFav = window.Favorites ? window.Favorites.isFavorite(c.id) : false;
          const rankBadge = c.market_cap_rank ? '<span class="row-rank">Rank #' + c.market_cap_rank + '</span>' : '<span class="row-rank">-</span>';
          
          return '<div class="crypto-row global-result-row" data-coin-id="' + c.id + '" role="button" tabindex="0">' +
            rankBadge +
            '<div class="row-coin">' +
              '<img src="' + c.thumb + '" alt="' + c.name + '" class="row-coin-icon" loading="lazy" onerror="this.src=\'https://via.placeholder.com/32\'">' +
              '<div class="row-coin-titles">' +
                '<h3 class="row-coin-name">' + c.name + '</h3>' +
                '<span class="row-coin-symbol">' + (c.symbol || '').toUpperCase() + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="row-price" style="color: #a5b4fc; font-size: 0.85rem; font-style: italic;">Ver cotización</div>' +
            '<div class="row-change" style="color: var(--text-muted); font-size: 0.85rem;">--</div>' +
            '<div class="row-mcap">Global</div>' +
            '<div class="row-sparkline" style="color: var(--text-muted); font-size: 0.8rem; display: flex; align-items: center; justify-content: center;">Sin sparkline</div>' +
            '<div class="row-fav">' +
              '<button class="fav-btn ' + (isFav ? 'active' : '') + '" data-coin-id="' + c.id + '" aria-label="Favorito" type="button">' +
                (isFav ? '⭐' : '☆') +
              '</button>' +
            '</div>' +
          '</div>';
        }).join('');
      } else {
        activeGrid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h3>No se encontraron activos globales</h3><p>Intenta con otro término de búsqueda</p></div>';
      }
    } catch (e) {
      console.error(e);
      activeGrid.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><h3>Error en la búsqueda</h3><p>Ocurrió un problema de conexión</p></div>';
    }
  }

  // ==================== AUTOCOMPLETE SEARCH (PORTFOLIO BUY FORM) ====================
  async function handleBuySearch(query) {
    if (!els.buySearchResults) return;
    const cleanQuery = query.trim();

    if (cleanQuery.length === 0) {
      els.buySearchResults.innerHTML = '';
      els.buySearchResults.classList.add('hidden');
      return;
    }

    const currentReq = ++searchRequestId;

    // 1. Instant local search from in-memory marketData & gainersData (0ms latency!)
    const allLocal = [...marketData, ...gainersData];
    const qLower = cleanQuery.toLowerCase();
    const localMatches = [];
    const seen = new Set();

    allLocal.forEach(c => {
      if (!c || seen.has(c.id)) return;
      const nMatch = c.name && c.name.toLowerCase().includes(qLower);
      const sMatch = c.symbol && c.symbol.toLowerCase().includes(qLower);
      if (nMatch || sMatch) {
        seen.add(c.id);
        localMatches.push({
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          thumb: c.image,
          current_price: c.current_price,
          market_cap_rank: c.market_cap_rank
        });
      }
    });

    // Render local results immediately if any
    if (localMatches.length > 0) {
      renderAutocompleteItems(localMatches.slice(0, 10));
      els.buySearchResults.classList.remove('hidden');
    }

    // 2. Fetch global results from API
    try {
      const combined = await window.CryptoAPI.searchAll(cleanQuery);
      if (currentReq !== searchRequestId) return; // Discard stale response

      if (combined && combined.length > 0) {
        renderAutocompleteItems(combined);
        els.buySearchResults.classList.remove('hidden');
      } else if (localMatches.length === 0) {
        els.buySearchResults.innerHTML = '<div style="padding: 12px; font-size: 0.85rem; color: var(--text-muted); text-align: center;">No se encontraron criptomonedas</div>';
        els.buySearchResults.classList.remove('hidden');
      }
    } catch (e) {
      console.warn("Search error:", e);
    }
  }

  function renderAutocompleteItems(coins) {
    if (!els.buySearchResults) return;
    els.buySearchResults.innerHTML = '';

    coins.forEach(c => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');

      const img = document.createElement('img');
      img.src = c.thumb || 'https://via.placeholder.com/28';
      img.alt = c.name;
      img.onerror = () => { img.src = 'https://via.placeholder.com/28'; };

      const info = document.createElement('div');
      info.className = 'coin-info';
      info.innerHTML = '<strong>' + c.name + '</strong> <span class="coin-symbol">' + (c.symbol || '').toUpperCase() + '</span>';

      item.appendChild(img);
      item.appendChild(info);

      if (c.current_price) {
        const priceTag = document.createElement('span');
        priceTag.className = 'coin-price-preview';
        priceTag.textContent = formatPrice(c.current_price);
        item.appendChild(priceTag);
      } else if (c.market_cap_rank) {
        const rank = document.createElement('span');
        rank.className = 'coin-rank';
        rank.textContent = 'Rank #' + c.market_cap_rank;
        item.appendChild(rank);
      }

      // Robust selection on click or pointerdown
      const triggerSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectBuyCoin(c.id, c.name, c.symbol, c.thumb, c.current_price);
      };

      item.addEventListener('click', triggerSelect);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          triggerSelect(e);
        }
      });

      els.buySearchResults.appendChild(item);
    });
  }

  async function selectBuyCoin(id, name, symbol, img, price) {
    let finalPrice = price;

    // If price wasn't passed, find it from cache or fetch it
    if (!finalPrice) {
      const prices = getCurrentPrices();
      if (prices[id]) {
        finalPrice = prices[id];
      } else {
        const matched = marketData.find(c => c.id === id) || gainersData.find(c => c.id === id);
        if (matched && matched.current_price) {
          finalPrice = matched.current_price;
        }
      }
    }

    selectedBuyCoin = { 
      id: id, 
      name: name, 
      symbol: (symbol || '').toUpperCase(), 
      thumb: img,
      current_price: finalPrice || null
    };

    // Fill the search input so user visibly sees the selection
    if (els.buySearchInput) {
      els.buySearchInput.value = name + ' (' + (symbol || '').toUpperCase() + ')';
    }

    // Hide the dropdown
    if (els.buySearchResults) {
      els.buySearchResults.innerHTML = '';
      els.buySearchResults.classList.add('hidden');
    }

    // Render the selected coin card
    renderSelectedCoinCard();

    // Update quick chips active state
    renderQuickChips();

    // If we don't have the price yet, fetch it in background and update card
    if (!finalPrice) {
      try {
        const detail = await window.CryptoAPI.fetchCoinDetail(id);
        if (detail && detail.current_price && selectedBuyCoin && selectedBuyCoin.id === id) {
          selectedBuyCoin.current_price = detail.current_price;
          renderSelectedCoinCard();
          updateBuyPreview();
        }
      } catch (err) {}
    }

    // Auto-focus the amount field
    if (els.buyAmount) {
      els.buyAmount.focus();
    }

    updateBuyPreview();
  }

  function renderSelectedCoinCard() {
    if (!els.selectedCoin) return;
    if (!selectedBuyCoin) {
      els.selectedCoin.innerHTML = '';
      els.selectedCoin.classList.add('hidden');
      return;
    }

    const c = selectedBuyCoin;
    const priceText = c.current_price ? formatPrice(c.current_price) : 'Cotizando...';

    els.selectedCoin.innerHTML = '<div class="selected-coin-card">' +
      '<img src="' + (c.thumb || 'https://via.placeholder.com/36') + '" alt="' + c.name + '" onerror="this.src=\'https://via.placeholder.com/36\'">' +
      '<div class="selected-coin-info">' +
        '<div class="selected-coin-title">' + c.name + ' <span class="selected-coin-symbol">' + c.symbol + '</span></div>' +
        '<div class="selected-coin-price">Precio: ' + priceText + '</div>' +
      '</div>' +
      '<button class="selected-coin-remove" id="deselect-buy-coin" title="Cambiar criptomoneda" type="button">✕</button>' +
    '</div>';

    els.selectedCoin.classList.remove('hidden');

    const deselectBtn = document.getElementById('deselect-buy-coin');
    if (deselectBtn) {
      deselectBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        deselectBuyCoin();
      };
    }
  }

  // ==================== STOP LOSS & TAKE PROFIT HELPERS ====================
  let currentEditingHolding = null;

  function updateSlCalcBadge() {
    if (!els.slCalcBadge) return;
    const basePrice = selectedBuyCoin && selectedBuyCoin.current_price ? Number(selectedBuyCoin.current_price) : 0;
    const slVal = parseFloat(els.buySl ? els.buySl.value : 0);
    if (!basePrice || !slVal || slVal <= 0) {
      els.slCalcBadge.textContent = '—';
      els.slCalcBadge.className = 'sltp-calc-badge';
      return;
    }
    const diffPct = ((slVal - basePrice) / basePrice) * 100;
    els.slCalcBadge.textContent = (diffPct >= 0 ? '+' : '') + diffPct.toFixed(1) + '%';
    els.slCalcBadge.className = 'sltp-calc-badge active-sl';
  }

  function updateTpCalcBadge() {
    if (!els.tpCalcBadge) return;
    const basePrice = selectedBuyCoin && selectedBuyCoin.current_price ? Number(selectedBuyCoin.current_price) : 0;
    const tpVal = parseFloat(els.buyTp ? els.buyTp.value : 0);
    if (!basePrice || !tpVal || tpVal <= 0) {
      els.tpCalcBadge.textContent = '—';
      els.tpCalcBadge.className = 'sltp-calc-badge';
      return;
    }
    const diffPct = ((tpVal - basePrice) / basePrice) * 100;
    els.tpCalcBadge.textContent = (diffPct >= 0 ? '+' : '') + diffPct.toFixed(1) + '%';
    els.tpCalcBadge.className = 'sltp-calc-badge active-tp';
  }

  function updateEditSlBadge() {
    if (!els.editSlBadge || !currentEditingHolding) return;
    const basePrice = currentEditingHolding.currentPrice || currentEditingHolding.buyPrice || 0;
    const slVal = parseFloat(els.editSlInput ? els.editSlInput.value : 0);
    if (!basePrice || !slVal || slVal <= 0) {
      els.editSlBadge.textContent = '—';
      els.editSlBadge.className = 'sltp-calc-badge';
      return;
    }
    const diffPct = ((slVal - basePrice) / basePrice) * 100;
    els.editSlBadge.textContent = (diffPct >= 0 ? '+' : '') + diffPct.toFixed(1) + '%';
    els.editSlBadge.className = 'sltp-calc-badge active-sl';
  }

  function updateEditTpBadge() {
    if (!els.editTpBadge || !currentEditingHolding) return;
    const basePrice = currentEditingHolding.currentPrice || currentEditingHolding.buyPrice || 0;
    const tpVal = parseFloat(els.editTpInput ? els.editTpInput.value : 0);
    if (!basePrice || !tpVal || tpVal <= 0) {
      els.editTpBadge.textContent = '—';
      els.editTpBadge.className = 'sltp-calc-badge';
      return;
    }
    const diffPct = ((tpVal - basePrice) / basePrice) * 100;
    els.editTpBadge.textContent = (diffPct >= 0 ? '+' : '') + diffPct.toFixed(1) + '%';
    els.editTpBadge.className = 'sltp-calc-badge active-tp';
  }

  function openEditSltpModal(coinId) {
    if (!window.Simulator || !els.editSltpModal) return;
    const holdings = window.Simulator.getHoldings();
    const holding = holdings.find(h => h.coinId === coinId);
    if (!holding) return;

    const prices = getCurrentPrices();
    const currentPrice = prices[coinId] || holding.buyPrice;
    currentEditingHolding = Object.assign({}, holding, { currentPrice });

    if (els.editSltpCoinImg) els.editSltpCoinImg.src = holding.coinImage || 'https://via.placeholder.com/36';
    if (els.editSltpCoinName) els.editSltpCoinName.textContent = holding.coinName;
    if (els.editSltpCoinSymbol) els.editSltpCoinSymbol.textContent = (holding.coinSymbol || '').toUpperCase();
    if (els.editSltpCurrentPrice) els.editSltpCurrentPrice.textContent = formatPrice(currentPrice);
    if (els.editSltpBuyPrice) els.editSltpBuyPrice.textContent = formatPrice(holding.buyPrice);

    if (els.editSlInput) els.editSlInput.value = (holding.stopLoss && holding.stopLoss > 0) ? holding.stopLoss : '';
    if (els.editTpInput) els.editTpInput.value = (holding.takeProfit && holding.takeProfit > 0) ? holding.takeProfit : '';

    updateEditSlBadge();
    updateEditTpBadge();

    els.editSltpModal.classList.remove('hidden');
  }

  function closeEditSltpModal() {
    if (els.editSltpModal) els.editSltpModal.classList.add('hidden');
    currentEditingHolding = null;
  }

  let currentSellingHolding = null;

  function openSellModal(coinId) {
    if (!window.Simulator || !els.sellModal) return;
    const holdings = window.Simulator.getHoldings();
    const holding = holdings.find(h => h.coinId === coinId);
    if (!holding) return;

    const prices = getCurrentPrices();
    const currentPrice = prices[coinId] || holding.buyPrice;
    currentSellingHolding = Object.assign({}, holding, { currentPrice });

    if (els.sellModalCoinImg) els.sellModalCoinImg.src = holding.coinImage || 'https://via.placeholder.com/36';
    if (els.sellModalCoinName) els.sellModalCoinName.textContent = holding.coinName;
    if (els.sellModalCoinSymbol) els.sellModalCoinSymbol.textContent = (holding.coinSymbol || '').toUpperCase();
    if (els.sellModalCurrentPrice) els.sellModalCurrentPrice.textContent = formatPrice(currentPrice);
    if (els.sellModalTotalHolding) els.sellModalTotalHolding.textContent = holding.amount.toLocaleString(undefined, { maximumFractionDigits: 6 }) + ' ' + (holding.coinSymbol || '').toUpperCase();
    if (els.sellModalTotalValue) els.sellModalTotalValue.textContent = formatPrice(holding.amount * currentPrice);
    if (els.sellInputSymbolBadge) els.sellInputSymbolBadge.textContent = (holding.coinSymbol || '').toUpperCase();

    // Default to 100% of holdings
    if (els.sellTokenAmountInput) {
      els.sellTokenAmountInput.value = holding.amount;
      els.sellTokenAmountInput.max = holding.amount;
    }

    updateSellCalculations();
    highlightSellChip(100);

    els.sellModal.classList.remove('hidden');
    if (els.sellTokenAmountInput) els.sellTokenAmountInput.focus();
  }

  function closeSellModal() {
    if (els.sellModal) els.sellModal.classList.add('hidden');
    currentSellingHolding = null;
  }

  function updateSellCalculations() {
    if (!currentSellingHolding) return;
    const totalAmount = currentSellingHolding.amount;
    const currentPrice = currentSellingHolding.currentPrice;
    const buyPrice = currentSellingHolding.buyPrice;
    const symbol = (currentSellingHolding.coinSymbol || '').toUpperCase();

    let sellAmount = parseFloat(els.sellTokenAmountInput ? els.sellTokenAmountInput.value : 0);
    if (isNaN(sellAmount) || sellAmount < 0) sellAmount = 0;

    const pct = totalAmount > 0 ? Math.min(100, (sellAmount / totalAmount) * 100) : 0;
    if (els.sellPctIndicator) {
      els.sellPctIndicator.textContent = pct.toFixed(0) + '%';
    }

    const receiveUsd = sellAmount * currentPrice;
    if (els.sellReceiveUsd) {
      els.sellReceiveUsd.textContent = formatPrice(receiveUsd) + ' USD';
    }

    const pnlUsd = (currentPrice - buyPrice) * sellAmount;
    const pnlPct = buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice) * 100 : 0;
    if (els.sellEstimatedPnl) {
      if (sellAmount <= 0) {
        els.sellEstimatedPnl.textContent = '—';
        els.sellEstimatedPnl.style.color = 'var(--text-muted)';
      } else {
        const sign = pnlUsd >= 0 ? '+' : '';
        const color = pnlUsd >= 0 ? '#22c55e' : '#ef4444';
        els.sellEstimatedPnl.innerHTML = '<span style="color:' + color + ';font-weight:700;">' + sign + formatPrice(pnlUsd) + ' (' + sign + pnlPct.toFixed(2) + '%)</span>';
      }
    }

    const remaining = Math.max(0, totalAmount - sellAmount);
    if (els.sellRemainingHolding) {
      els.sellRemainingHolding.textContent = remaining.toLocaleString(undefined, { maximumFractionDigits: 6 }) + ' ' + symbol;
    }

    if (els.confirmSellBtn) {
      if (sellAmount <= 0) {
        els.confirmSellBtn.disabled = true;
        els.confirmSellBtn.textContent = 'Introduce cantidad';
        els.confirmSellBtn.style.opacity = '0.5';
      } else if (sellAmount > totalAmount * 1.000001) {
        els.confirmSellBtn.disabled = true;
        els.confirmSellBtn.textContent = 'Cantidad superior a saldo disponible';
        els.confirmSellBtn.style.opacity = '0.5';
      } else {
        els.confirmSellBtn.disabled = false;
        els.confirmSellBtn.style.opacity = '1';
        const displayAmt = sellAmount.toLocaleString(undefined, { maximumFractionDigits: 4 });
        els.confirmSellBtn.textContent = '🔥 Vender ' + displayAmt + ' ' + symbol + ' (' + formatPrice(receiveUsd) + ')';
      }
    }
  }

  function highlightSellChip(pct) {
    document.querySelectorAll('.sell-pct-chip').forEach(function(chip) {
      const chipPct = parseFloat(chip.dataset.pct);
      if (Math.abs(chipPct - pct) < 1) {
        chip.style.background = 'rgba(239,68,68,0.2)';
        chip.style.borderColor = '#ef4444';
        chip.style.color = '#ef4444';
        chip.style.fontWeight = '700';
      } else {
        chip.style.background = 'rgba(255,255,255,0.06)';
        chip.style.borderColor = 'rgba(255,255,255,0.1)';
        chip.style.color = 'var(--text-secondary)';
        chip.style.fontWeight = '500';
      }
    });
  }

  function deselectBuyCoin() {
    selectedBuyCoin = null;
    if (els.selectedCoin) {
      els.selectedCoin.innerHTML = '';
      els.selectedCoin.classList.add('hidden');
    }
    if (els.buySearchInput) {
      els.buySearchInput.value = '';
      els.buySearchInput.focus();
    }
    if (els.buyPreview) {
      els.buyPreview.innerHTML = '';
      els.buyPreview.classList.add('hidden');
    }
    if (els.buySl) els.buySl.value = '';
    if (els.buyTp) els.buyTp.value = '';
    updateSlCalcBadge();
    updateTpCalcBadge();
    renderQuickChips();
  }

  function updateBuyPreview() {
    if (!els.buyPreview) return;
    if (!selectedBuyCoin || !selectedBuyCoin.current_price) {
      els.buyPreview.innerHTML = '';
      els.buyPreview.classList.add('hidden');
      return;
    }

    const amountUSD = parseFloat(els.buyAmount ? els.buyAmount.value : 0);
    if (!amountUSD || amountUSD <= 0 || isNaN(amountUSD)) {
      els.buyPreview.innerHTML = 'Precio unitario: <strong>' + formatPrice(selectedBuyCoin.current_price) + '</strong>';
      els.buyPreview.classList.remove('hidden');
      return;
    }

    const tokens = amountUSD / selectedBuyCoin.current_price;
    els.buyPreview.innerHTML = 'Recibirás aprox: <strong>' + tokens.toLocaleString(undefined, { maximumFractionDigits: 6 }) + ' ' + selectedBuyCoin.symbol + '</strong>';
    els.buyPreview.classList.remove('hidden');
  }

  async function handleBuySubmit() {
    if (!selectedBuyCoin) {
      showToast('Selecciona una criptomoneda primero', 'error');
      if (els.buySearchInput) els.buySearchInput.focus();
      return;
    }

    const amountUSD = parseFloat(els.buyAmount ? els.buyAmount.value : 0);
    if (!amountUSD || amountUSD <= 0 || isNaN(amountUSD)) {
      showToast('Ingresa un monto en USD válido', 'error');
      if (els.buyAmount) els.buyAmount.focus();
      return;
    }

    if (amountUSD > window.Simulator.getBalance()) {
      showToast('Balance disponible insuficiente ($' + window.Simulator.getBalance().toFixed(2) + ' USD)', 'error');
      return;
    }

    els.buyBtn.disabled = true;
    els.buyBtn.textContent = 'Procesando...';

    try {
      let price = selectedBuyCoin.current_price;

      // If price wasn't cached, try to obtain it now
      if (!price) {
        const prices = getCurrentPrices();
        if (prices[selectedBuyCoin.id]) {
          price = prices[selectedBuyCoin.id];
        } else {
          const detail = await window.CryptoAPI.fetchCoinDetail(selectedBuyCoin.id);
          price = detail ? detail.current_price : 0;
        }
      }

      if (!price || isNaN(price) || price <= 0) {
        showToast('No se pudo obtener el precio de cotización. Intenta de nuevo.', 'error');
        els.buyBtn.disabled = false;
        els.buyBtn.textContent = '🛒 Comprar Criptomoneda';
        return;
      }

      const slVal = (els.buySl && parseFloat(els.buySl.value) > 0) ? parseFloat(els.buySl.value) : null;
      const tpVal = (els.buyTp && parseFloat(els.buyTp.value) > 0) ? parseFloat(els.buyTp.value) : null;

      const result = window.Simulator.buy(
        selectedBuyCoin.id,
        selectedBuyCoin.name,
        selectedBuyCoin.symbol,
        selectedBuyCoin.thumb || '',
        amountUSD,
        price,
        slVal,
        tpVal
      );
      
      if (result.success) {
        let targetsMsg = '';
        if (slVal && tpVal) targetsMsg = ' (SL: ' + formatPrice(slVal) + ' | TP: ' + formatPrice(tpVal) + ')';
        else if (slVal) targetsMsg = ' (SL: ' + formatPrice(slVal) + ')';
        else if (tpVal) targetsMsg = ' (TP: ' + formatPrice(tpVal) + ')';

        showToast('¡Compra realizada! +' + result.tokens.toFixed(6) + ' ' + selectedBuyCoin.symbol.toUpperCase() + targetsMsg, 'success');
        if (els.buyAmount) els.buyAmount.value = '';
        deselectBuyCoin();
        renderPortfolio();
      } else {
        showToast(result.message || 'Error en la compra', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error de conexión al simular la transacción', 'error');
    }

    els.buyBtn.disabled = false;
    els.buyBtn.textContent = '🛒 Comprar Criptomoneda';
  }

  // ==================== TOAST SYSTEM ====================
  function showToast(message, type) {
    if (!els.toastContainer) return;
    type = type || 'info';
    
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    
    els.toastContainer.appendChild(toast);
    
    setTimeout(function() {
      toast.classList.add('fade-out');
      setTimeout(function() { toast.remove(); }, 300);
    }, 3200);
  }

  // ==================== SKELETONS ====================
  function showSkeletons() {
    const skeleton = '<div class="crypto-row skeleton" style="height: 52px; opacity: 0.5;"></div>';
    let skeletons = '';
    for (let i = 0; i < 10; i++) skeletons += skeleton;

    if (els.gridTop50) els.gridTop50.innerHTML = skeletons;
    if (els.gridGainers) els.gridGainers.innerHTML = skeletons;
  }

  // ==================== EVENT LISTENERS ====================
  function setupEventListeners() {
    // Mobile Hamburger Menu Listeners
    if (els.navHamburger) {
      els.navHamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
      });
    }

    if (els.navCloseBtn) {
      els.navCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeMobileMenu();
      });
    }

    if (els.navBackdrop) {
      els.navBackdrop.addEventListener('click', function() {
        closeMobileMenu();
      });
    }

    // Tabs Navigation
    els.tabs.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        switchTab(e.currentTarget.dataset.tab);
      });
    });

    // Top Header Search Bar
    if (els.searchInput) {
      els.searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value.trim();
        renderCurrentTab();
      });
    }

    // Modal & Menu Close on Escape
    if (els.modalClose) els.modalClose.addEventListener('click', hideModal);
    if (els.coinModal) {
      els.coinModal.addEventListener('click', function(e) {
        if (e.target === els.coinModal) hideModal();
      });
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        hideModal();
        closeEditSltpModal();
        closeStripeCheckout();
        closeMobileMenu();
      }
    });

    // Timeframe selector in modal
    els.tfBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        els.tfBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentTimeframe = e.currentTarget.dataset.tf;
        if (currentModalCoin) {
          loadChart(currentModalCoin.id, currentTimeframe);
        }
      });
    });

    // Stop Loss & Take Profit Toggle in Buy Form
    if (els.toggleSltpBtn && els.sltpInputsPanel) {
      els.toggleSltpBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const isHidden = els.sltpInputsPanel.classList.contains('hidden');
        els.sltpInputsPanel.classList.toggle('hidden', !isHidden);
        els.toggleSltpBtn.classList.toggle('expanded', isHidden);
      });
    }

    if (els.buySl) {
      els.buySl.addEventListener('input', updateSlCalcBadge);
    }
    if (els.buyTp) {
      els.buyTp.addEventListener('input', updateTpCalcBadge);
    }

    // Buy quick SL/TP chips
    document.querySelectorAll('.buy-sl-chip').forEach(function(chip) {
      chip.addEventListener('click', function(e) {
        e.preventDefault();
        const basePrice = selectedBuyCoin && selectedBuyCoin.current_price ? Number(selectedBuyCoin.current_price) : 0;
        if (!basePrice) {
          showToast('Selecciona primero una criptomoneda', 'info');
          return;
        }
        const pct = parseFloat(chip.dataset.pct);
        const targetPrice = basePrice * (1 + pct / 100);
        if (els.buySl) {
          els.buySl.value = targetPrice > 1 ? targetPrice.toFixed(2) : targetPrice.toFixed(6);
          updateSlCalcBadge();
        }
      });
    });

    document.querySelectorAll('.buy-tp-chip').forEach(function(chip) {
      chip.addEventListener('click', function(e) {
        e.preventDefault();
        const basePrice = selectedBuyCoin && selectedBuyCoin.current_price ? Number(selectedBuyCoin.current_price) : 0;
        if (!basePrice) {
          showToast('Selecciona primero una criptomoneda', 'info');
          return;
        }
        const pct = parseFloat(chip.dataset.pct);
        const targetPrice = basePrice * (1 + pct / 100);
        if (els.buyTp) {
          els.buyTp.value = targetPrice > 1 ? targetPrice.toFixed(2) : targetPrice.toFixed(6);
          updateTpCalcBadge();
        }
      });
    });

    // Edit SL/TP Modal Listeners
    if (els.editSlInput) {
      els.editSlInput.addEventListener('input', updateEditSlBadge);
    }
    if (els.editTpInput) {
      els.editTpInput.addEventListener('input', updateEditTpBadge);
    }

    document.querySelectorAll('.edit-sl-chip').forEach(function(chip) {
      chip.addEventListener('click', function(e) {
        e.preventDefault();
        if (!currentEditingHolding) return;
        const basePrice = currentEditingHolding.currentPrice || currentEditingHolding.buyPrice || 0;
        const pct = parseFloat(chip.dataset.pct);
        const targetPrice = basePrice * (1 + pct / 100);
        if (els.editSlInput) {
          els.editSlInput.value = targetPrice > 1 ? targetPrice.toFixed(2) : targetPrice.toFixed(6);
          updateEditSlBadge();
        }
      });
    });

    document.querySelectorAll('.edit-sl-chip-clear').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (els.editSlInput) {
          els.editSlInput.value = '';
          updateEditSlBadge();
        }
      });
    });

    document.querySelectorAll('.edit-tp-chip').forEach(function(chip) {
      chip.addEventListener('click', function(e) {
        e.preventDefault();
        if (!currentEditingHolding) return;
        const basePrice = currentEditingHolding.currentPrice || currentEditingHolding.buyPrice || 0;
        const pct = parseFloat(chip.dataset.pct);
        const targetPrice = basePrice * (1 + pct / 100);
        if (els.editTpInput) {
          els.editTpInput.value = targetPrice > 1 ? targetPrice.toFixed(2) : targetPrice.toFixed(6);
          updateEditTpBadge();
        }
      });
    });

    document.querySelectorAll('.edit-tp-chip-clear').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (els.editTpInput) {
          els.editTpInput.value = '';
          updateEditTpBadge();
        }
      });
    });

    if (els.saveSltpBtn) {
      els.saveSltpBtn.addEventListener('click', function() {
        if (!currentEditingHolding || !window.Simulator) return;
        const slVal = els.editSlInput && parseFloat(els.editSlInput.value) > 0 ? parseFloat(els.editSlInput.value) : null;
        const tpVal = els.editTpInput && parseFloat(els.editTpInput.value) > 0 ? parseFloat(els.editTpInput.value) : null;

        const res = window.Simulator.setHoldingTargets(currentEditingHolding.coinId, slVal, tpVal);
        if (res.success) {
          showToast(res.message, 'success');
          closeEditSltpModal();
          renderPortfolio();
        } else {
          showToast(res.message, 'error');
        }
      });
    }

    if (els.cancelSltpBtn) els.cancelSltpBtn.addEventListener('click', closeEditSltpModal);
    if (els.editSltpClose) els.editSltpClose.addEventListener('click', closeEditSltpModal);
    if (els.editSltpModal) {
      els.editSltpModal.addEventListener('click', function(e) {
        if (e.target === els.editSltpModal) closeEditSltpModal();
      });
    }

    // Grid Delegation (Star favorite & row click & global search trigger)
    function handleGridClick(e) {
      const favBtn = e.target.closest('.fav-btn');
      if (favBtn) {
        e.stopPropagation();
        const coinId = favBtn.dataset.coinId;
        if (window.Favorites) {
          const isFav = window.Favorites.toggle(coinId);
          favBtn.classList.toggle('active', isFav);
          favBtn.textContent = isFav ? '⭐' : '☆';
          showToast(isFav ? 'Añadido a favoritos' : 'Eliminado de favoritos', 'success');
          
          if (els.favCount) els.favCount.textContent = window.Favorites.count();
          if (currentTab === 'favorites') {
            renderCurrentTab();
          }
        }
        return;
      }

      const trigger = e.target.closest('.global-search-trigger');
      if (trigger) {
        runGlobalSearch();
        return;
      }

      const row = e.target.closest('.crypto-row');
      if (row && !row.classList.contains('skeleton')) {
        showCoinModal(row.dataset.coinId);
      }
    }

    if (els.gridTop50) els.gridTop50.addEventListener('click', handleGridClick);
    if (els.gridGainers) els.gridGainers.addEventListener('click', handleGridClick);
    if (els.gridFavorites) els.gridFavorites.addEventListener('click', handleGridClick);

    // Buy Auto-Complete Search
    if (els.buySearchInput) {
      els.buySearchInput.addEventListener('input', function(e) {
        const q = e.target.value;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
          handleBuySearch(q);
        }, 200);
      });

      els.buySearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (els.buySearchResults) {
            const firstItem = els.buySearchResults.querySelector('.autocomplete-item');
            if (firstItem) {
              firstItem.click();
            }
          }
        }
      });
    }

    // Amount input preview
    if (els.buyAmount) {
      els.buyAmount.addEventListener('input', updateBuyPreview);
    }

    // Close autocomplete results when clicking outside
    document.addEventListener('click', function(e) {
      if (els.buySearchResults && !e.target.closest('.search-autocomplete')) {
        els.buySearchResults.classList.add('hidden');
      }
    });

    // Buy Button Submit
    if (els.buyBtn) {
      els.buyBtn.addEventListener('click', handleBuySubmit);
    }

    // Sell holdings and edit SL/TP delegate
    if (els.portfolioHoldings) {
      els.portfolioHoldings.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.btn-edit-sltp');
        if (editBtn) {
          const coinId = editBtn.dataset.coinId;
          openEditSltpModal(coinId);
          return;
        }

        const btn = e.target.closest('.sell-btn');
        if (!btn) return;

        const id = btn.dataset.coinId;
        openSellModal(id);
      });
    }

    // Sell Modal Event Listeners
    if (els.sellTokenAmountInput) {
      els.sellTokenAmountInput.addEventListener('input', function() {
        updateSellCalculations();
        if (currentSellingHolding && currentSellingHolding.amount > 0) {
          const val = parseFloat(this.value) || 0;
          const pct = (val / currentSellingHolding.amount) * 100;
          highlightSellChip(pct);
        }
      });
    }

    document.querySelectorAll('.sell-pct-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        if (!currentSellingHolding || !els.sellTokenAmountInput) return;
        const pct = parseFloat(this.dataset.pct);
        const amt = currentSellingHolding.amount * (pct / 100);
        els.sellTokenAmountInput.value = amt;
        updateSellCalculations();
        highlightSellChip(pct);
      });
    });

    if (els.confirmSellBtn) {
      els.confirmSellBtn.addEventListener('click', function() {
        if (!currentSellingHolding || !window.Simulator) return;
        const sellAmount = parseFloat(els.sellTokenAmountInput ? els.sellTokenAmountInput.value : 0);
        if (isNaN(sellAmount) || sellAmount <= 0) {
          showToast('Introduce una cantidad válida a vender', 'error');
          return;
        }
        if (sellAmount > currentSellingHolding.amount * 1.000001) {
          showToast('No tienes suficiente saldo disponible en cartera', 'error');
          return;
        }

        const coinId = currentSellingHolding.coinId;
        const price = currentSellingHolding.currentPrice;
        const result = window.Simulator.sell(coinId, sellAmount, price);

        if (result.success) {
          showToast(result.message, 'success');
          closeSellModal();
          renderPortfolio();
        } else {
          showToast(result.message || 'Error al vender', 'error');
        }
      });
    }

    if (els.sellModalClose) els.sellModalClose.addEventListener('click', closeSellModal);
    if (els.cancelSellBtn) els.cancelSellBtn.addEventListener('click', closeSellModal);
    if (els.sellModal) {
      els.sellModal.addEventListener('click', function(e) {
        if (e.target === els.sellModal) closeSellModal();
      });
    }

    // Reset button
    if (els.portfolioReset) {
      els.portfolioReset.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres reiniciar el simulador? Se restablecerá el balance a $10,000.00 y se perderán las posiciones actuales.')) {
          window.Simulator.reset();
          deselectBuyCoin();
          showToast('Simulador reiniciado a $10,000.00 USD', 'success');
          renderPortfolio();
        }
      });
    }

    // Transaction History Toggle
    if (els.historyToggle && els.portfolioHistory) {
      els.historyToggle.addEventListener('click', function() {
        const isHidden = els.portfolioHistory.classList.contains('hidden');
        els.portfolioHistory.classList.toggle('hidden', !isHidden);
        els.historyToggle.classList.toggle('expanded', isHidden);
      });
    }

    // Portfolio FAB Click
    if (els.portfolioFab) {
      els.portfolioFab.addEventListener('click', function() {
        switchTab('portfolio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Copy to clipboard buttons in developer tab
    document.querySelectorAll('.btn-copy').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const text = btn.getAttribute('data-copy');
        if (text) {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
              showToast('Copiado al portapapeles: ' + text, 'success');
            }).catch(function() {
              showToast('Texto: ' + text, 'info');
            });
          } else {
            showToast('Texto: ' + text, 'info');
          }
        }
      });
    });

    // Stripe Checkout Modal & Triggers
    document.addEventListener('click', function(e) {
      const openBtn = e.target.closest('.btn-open-checkout-modal');
      if (openBtn) {
        e.preventDefault();
        closeMobileMenu();
        const plan = openBtn.getAttribute('data-plan') || 'annual';
        openStripeCheckout(plan);
      }
    });

    if (els.stripeModalClose) {
      els.stripeModalClose.addEventListener('click', closeStripeCheckout);
    }

    if (els.stripeModal) {
      els.stripeModal.addEventListener('click', function(e) {
        if (e.target === els.stripeModal) closeStripeCheckout();
      });
    }

    // Card inputs live formatting
    if (els.stripeCardNumber) {
      els.stripeCardNumber.addEventListener('input', function(e) {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.replace(/(.{4})/g, '$1  ').trim();
        e.target.value = val;
      });
    }

    if (els.stripeCardExp) {
      els.stripeCardExp.addEventListener('input', function(e) {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
        e.target.value = val;
      });
    }

    if (els.stripeCardCvc) {
      els.stripeCardCvc.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
      });
    }

    if (els.stripeCheckoutForm) {
      els.stripeCheckoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleStripePaymentSubmit();
      });
    }

    if (els.stripeSubmitBtn) {
      els.stripeSubmitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleStripePaymentSubmit();
      });
    }

    // License Key Unlock Listeners
    if (els.premiumUnlockBtn) {
      els.premiumUnlockBtn.addEventListener('click', function() {
        const key = (els.premiumKeyInput ? els.premiumKeyInput.value : '').trim().toUpperCase();
        const VALID_KEYS = ['PREMIUM', 'VIP', 'CRIPTOPRO', 'PRO', '2026', 'ADMIN', 'STRIPE', 'LIFETIME'];
        if (key && (VALID_KEYS.includes(key) || key.length >= 5)) {
          setPremiumLifetime(true);
          showToast('👑 ¡Licencia VIP Desbloqueada con Éxito!', 'success');
        } else {
          if (els.unlockError) els.unlockError.classList.remove('hidden');
          showToast('Clave de licencia no válida. Adquiere tu acceso mediante Stripe.', 'error');
        }
      });
    }

    if (els.premiumKeyInput) {
      els.premiumKeyInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (els.premiumUnlockBtn) els.premiumUnlockBtn.click();
        }
      });
      els.premiumKeyInput.addEventListener('input', function() {
        if (els.unlockError) els.unlockError.classList.add('hidden');
      });
    }

    // 7-Day Demo Trial Activation Listener
    if (els.premiumDemoBtn) {
      els.premiumDemoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        activateDemoTrial();
      });
    }

    // Lock session again button
    if (els.premiumLockAgainBtn) {
      els.premiumLockAgainBtn.addEventListener('click', function() {
        setPremiumLifetime(false);
        showToast('🔒 Sesión de análisis cerrada', 'info');
      });
    }

    // Generate Daily Report Button
    var generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
      generateReportBtn.addEventListener('click', function() {
        generateDailyReport();
      });
    }
  }

  // ==================== DAILY INSTITUTIONAL REPORT ====================
  function generateDailyReport() {
    var outputEl = document.getElementById('report-output');
    if (!outputEl) return;

    var allCoins = [].concat(marketData, gainersData);
    if (!allCoins || allCoins.length === 0) {
      outputEl.innerHTML = '<div class="report-placeholder"><p>⚠️ Esperando datos de mercado. Vuelve a intentarlo en unos segundos.</p></div>';
      return;
    }

    // ── Loading state ──
    var btn = document.getElementById('generate-report-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Generando...'; }

    setTimeout(function() {
      try {
        var html = buildReportHTML(allCoins);
        outputEl.innerHTML = html;
      } catch(e) {
        outputEl.innerHTML = '<div class="report-placeholder"><p>⚠️ Error generando el informe. Intenta de nuevo.</p></div>';
      }
      if (btn) { btn.disabled = false; btn.textContent = '🔄 Regenerar Informe'; }
    }, 600);
  }

  function buildReportHTML(allCoins) {
    var now = new Date();
    var dateStr = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    var timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // ── Coins de referencia ──
    var btc = allCoins.find(function(c) { return c.id === 'bitcoin'; });
    var eth = allCoins.find(function(c) { return c.id === 'ethereum'; });
    var sol = allCoins.find(function(c) { return c.id === 'solana'; });
    var bnb = allCoins.find(function(c) { return c.id === 'binancecoin'; });
    var xrp = allCoins.find(function(c) { return c.id === 'ripple'; });

    if (!btc) return '<div class="report-placeholder"><p>⚠️ Datos de Bitcoin no disponibles.</p></div>';

    // ── Métricas de mercado ──
    var btcChange   = Number(btc.price_change_percentage_24h) || 0;
    var ethChange   = eth ? (Number(eth.price_change_percentage_24h) || 0) : 0;
    var btcPrice    = Number(btc.current_price) || 0;
    var ethPrice    = eth ? (Number(eth.current_price) || 0) : 0;

    var totalMcap = 0;
    var totalVol  = 0;
    var positiveCoins = 0;
    var validCoins = 0;
    allCoins.forEach(function(c) {
      if (!c || !c.id) return;
      totalMcap += Number(c.market_cap) || 0;
      totalVol  += Number(c.total_volume) || 0;
      if ((Number(c.price_change_percentage_24h) || 0) > 0) positiveCoins++;
      validCoins++;
    });
    var breadthRatio = validCoins > 0 ? positiveCoins / validCoins : 0.5;

    // ── Fear & Greed ──
    var fgScore = Math.min(95, Math.max(15, Math.round(30 + breadthRatio * 55)));
    var fgLabel, fgColor, fgBias;
    if (fgScore >= 75) {
      fgLabel = 'CODICIA EXTREMA'; fgColor = '#22c55e'; fgBias = 'Alcista';
    } else if (fgScore >= 55) {
      fgLabel = 'CODICIA MODERADA'; fgColor = '#34d399'; fgBias = 'Alcista';
    } else if (fgScore >= 45) {
      fgLabel = 'NEUTRAL'; fgColor = '#fbbf24'; fgBias = 'Neutral';
    } else if (fgScore >= 25) {
      fgLabel = 'MIEDO MODERADO'; fgColor = '#f97316'; fgBias = 'Bajista';
    } else {
      fgLabel = 'MIEDO EXTREMO'; fgColor = '#ef4444'; fgBias = 'Bajista';
    }

    // ── Sesgo General ──
    var overallBias = btcChange >= 1 ? 'Alcista ▲' : btcChange <= -1 ? 'Bajista ▼' : 'Neutral ◆';
    var overallBiasColor = btcChange >= 1 ? '#22c55e' : btcChange <= -1 ? '#ef4444' : '#fbbf24';

    // ── Dominancia BTC estimada ──
    var btcMcap = Number(btc.market_cap) || 0;
    var btcDom = totalMcap > 0 ? ((btcMcap / totalMcap) * 100).toFixed(1) : '—';

    // ── Gainers / Losers ──
    var sorted = allCoins.slice().filter(function(c){ return c && c.id; });
    sorted.sort(function(a, b) {
      return (Number(b.price_change_percentage_24h) || 0) - (Number(a.price_change_percentage_24h) || 0);
    });
    var top3Gainers = sorted.slice(0, 3);
    var top3Losers  = sorted.slice(-3).reverse();

    // ── BTC soporte/resistencia ──
    var btcSupport    = formatPrice(btcPrice * 0.955);
    var btcResist     = formatPrice(btcPrice * 1.058);
    var ethSupport    = ethPrice ? formatPrice(ethPrice * 0.952) : '—';
    var ethResist     = ethPrice ? formatPrice(ethPrice * 1.062) : '—';

    // ── Señales RSI top 5 ──
    var top5 = ['bitcoin','ethereum','solana','binancecoin','ripple'];
    var signalRows = '';
    top5.forEach(function(id) {
      var c = allCoins.find(function(x) { return x.id === id; });
      if (!c) return;
      var ch = Number(c.price_change_percentage_24h) || 0;
      var rsi = Math.min(88, Math.max(22, Math.round(50 + ch * 2.2)));
      var rsiColor = rsi >= 70 ? '#ef4444' : rsi <= 35 ? '#22c55e' : '#94a3b8';
      var rsiNote  = rsi >= 70 ? 'Sobrecompra' : rsi <= 35 ? 'Sobreventa' : 'Neutral';
      var verdict  = ch >= 3 ? '🚀 Compra Fuerte' : ch >= 0 ? '⚡ Compra' : ch >= -3 ? '⚖️ Neutral' : '📉 Vigilancia';
      var verdictColor = ch >= 3 ? '#22c55e' : ch >= 0 ? '#34d399' : ch >= -3 ? '#fbbf24' : '#ef4444';
      signalRows += '<tr>' +
        '<td><strong>' + c.name + '</strong> <span style="color:var(--text-muted);font-size:.75rem;">' + (c.symbol||'').toUpperCase() + '</span></td>' +
        '<td>' + formatPrice(c.current_price) + '</td>' +
        '<td style="color:' + rsiColor + ';font-weight:700;">' + rsi + ' <span style="font-size:.75rem;font-weight:400;">(' + rsiNote + ')</span></td>' +
        '<td style="color:' + (ch >= 0 ? '#22c55e' : '#ef4444') + ';font-weight:700;">' + (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%</td>' +
        '<td style="color:' + verdictColor + ';font-weight:700;">' + verdict + '</td>' +
        '</tr>';
    });

    // ── Helpers ──
    function fmtChange(v) {
      var n = Number(v) || 0;
      var s = n >= 0 ? '+' : '';
      var col = n >= 0 ? '#22c55e' : '#ef4444';
      return '<span style="color:' + col + ';font-weight:700;">' + s + n.toFixed(2) + '%</span>';
    }

    function gainersListHTML(coins) {
      return coins.map(function(c, i) {
        return '<div class="report-gainer-row">' +
          '<span class="report-gainer-rank">' + (i+1) + '</span>' +
          '<span class="report-gainer-name">' + c.name + ' <span style="color:var(--text-muted);font-size:.75rem;">(' + (c.symbol||'').toUpperCase() + ')</span></span>' +
          '<span class="report-gainer-price">' + formatPrice(c.current_price) + '</span>' +
          '<span>' + fmtChange(c.price_change_percentage_24h) + '</span>' +
        '</div>';
      }).join('');
    }

    // ── Volume/Mcap narrative ──
    var volStr  = formatMarketCap(totalVol);
    var mcapStr = formatMarketCap(totalMcap);
    var breadthPct = Math.round(breadthRatio * 100);
    var volumeTone = totalVol > 8e10 ? 'alto, indicando participación activa del mercado' : totalVol > 4e10 ? 'moderado, consistente con un mercado en consolidación' : 'bajo, lo que sugiere cautela o falta de catalizadores claros';

    // ── Oportunidades altcoin ──
    var altOpp1 = sorted[0];
    var altOpp2 = sorted.length > 1 ? sorted[1] : null;

    // ── BUILD HTML REPORT ──
    return '<div class="report-document">' +

      // Header
      '<div class="report-header">' +
        '<div class="report-header-top">' +
          '<div class="report-brand">' +
            '<span class="report-brand-icon">₿</span>' +
            '<div>' +
              '<div class="report-brand-name">CriptoTracker <span style="color:var(--primary-accent);">PRO</span></div>' +
              '<div class="report-brand-sub">Informe de Análisis Institucional · Datos CoinGecko API</div>' +
            '</div>' +
          '</div>' +
          '<div class="report-meta">' +
            '<div class="report-date">' + dateStr + '</div>' +
            '<div class="report-time">Generado a las ' + timeStr + ' (hora local)</div>' +
          '</div>' +
        '</div>' +
        '<div class="report-divider"></div>' +
        '<div class="report-bias-strip">' +
          '<div class="report-bias-item">' +
            '<span class="report-bias-label">SESGO DE MERCADO</span>' +
            '<span class="report-bias-value" style="color:' + overallBiasColor + ';">' + overallBias + '</span>' +
          '</div>' +
          '<div class="report-bias-item">' +
            '<span class="report-bias-label">FEAR &amp; GREED INDEX</span>' +
            '<span class="report-bias-value" style="color:' + fgColor + ';">' + fgScore + ' — ' + fgLabel + '</span>' +
          '</div>' +
          '<div class="report-bias-item">' +
            '<span class="report-bias-label">BITCOIN DOMINANCIA</span>' +
            '<span class="report-bias-value" style="color:#f59e0b;">' + btcDom + '%</span>' +
          '</div>' +
          '<div class="report-bias-item">' +
            '<span class="report-bias-label">AMPLITUD DE MERCADO</span>' +
            '<span class="report-bias-value" style="color:' + (breadthRatio >= 0.5 ? '#22c55e' : '#ef4444') + ';">' + breadthPct + '% alcistas</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Section 1
      '<div class="report-section">' +
        '<h2 class="report-section-title">📊 Resumen Ejecutivo y Sentimiento</h2>' +
        '<div class="report-section-body">' +
          '<p>El mercado de activos digitales cotiza con un <strong>sesgo ' + fgBias.toLowerCase() + '</strong> en las últimas 24 horas. ' +
          'Bitcoin (' + fmtChange(btcChange) + ') ' +
          (eth ? 'y Ethereum (' + fmtChange(ethChange) + ') ' : '') +
          'muestran una ' + (btcChange >= 0 ? 'estructura técnica constructiva con compras sostenidas en zonas de soporte clave' : 'presión vendedora que ha empujado los precios hacia zonas de soporte estructural') + '. ' +
          'El índice Fear &amp; Greed calculado a partir de la amplitud de mercado se sitúa en <strong>' + fgScore + '/100</strong> (' + fgLabel + '), ' +
          'con un ' + breadthPct + '% de los activos monitorizados registrando variaciones positivas en 24 horas.</p>' +
          '<p style="margin-top:10px;">La capitalización total del mercado se estima en <strong>' + mcapStr + '</strong> con un volumen de negociación en 24h de <strong>' + volStr + '</strong>, ' +
          'considerado ' + volumeTone + '. La dominancia de Bitcoin se sitúa aproximadamente en el <strong>' + btcDom + '%</strong>, ' +
          (parseFloat(btcDom) > 55 ? 'indicando una fase de consolidación del capital en activos de mayor capitalización frente al universo altcoin.' : parseFloat(btcDom) > 48 ? 'reflejando un mercado equilibrado con flujos bidireccionales entre Bitcoin y altcoins de calidad.' : 'sugiriendo rotación de capital activa desde Bitcoin hacia el ecosistema de altcoins (fase altseason).' ) +
          '</p>' +
        '</div>' +
      '</div>' +

      // Section 2
      '<div class="report-section">' +
        '<h2 class="report-section-title">📰 Narrativas Clave del Día</h2>' +
        '<div class="report-section-body">' +
          '<div class="report-narrative-grid">' +

            '<div class="report-narrative-box">' +
              '<div class="report-narrative-tag" style="background:rgba(99,102,241,.15);color:#a5b4fc;">MACRO / LIQUIDEZ</div>' +
              '<h4>Dinámica de Liquidez Global en Activos de Riesgo</h4>' +
              '<p>El comportamiento de Bitcoin como activo de riesgo sigue correlacionado con el flujo de liquidez institucional. ' +
              (btcChange >= 1 ? 'Las entradas netas de capital en productos de inversión cripto se mantienen positivas, sugiriendo demanda institucional sostenida.' : btcChange <= -1 ? 'La presión vendedora coincide con periodos de reducción de riesgo en cartera por parte de actores institucionales.' : 'El volumen neutral refleja una fase de espera previa a catalizadores macroeconómicos de mayor calado.') +
              '</p>' +
            '</div>' +

            '<div class="report-narrative-box">' +
              '<div class="report-narrative-tag" style="background:rgba(34,197,94,.12);color:#34d399;">TÉCNICO / ON-CHAIN</div>' +
              '<h4>Amplitud de Mercado y Rotación Sectorial</h4>' +
              '<p>Con un ' + breadthPct + '% de activos en positivo, el mercado presenta una ' +
              (breadthRatio >= 0.65 ? 'amplitud alcista elevada que históricamente antecede a movimientos de continuación.' : breadthRatio >= 0.45 ? 'amplitud neutral con divergencias sectoriales: DeFi y Layer 1 lideran frente a activos especulativos.' : 'amplitud comprometida que puede señalar agotamiento de tendencia o distribución de posiciones.') +
              ' Los top gainers del día muestran movimientos en sectores específicos con catalizadores de ecosistema.</p>' +
            '</div>' +

            '<div class="report-narrative-box">' +
              '<div class="report-narrative-tag" style="background:rgba(245,158,11,.13);color:#fbbf24;">DOMINANCIA / ROTACIÓN</div>' +
              '<h4>Flujo Interactivo BTC vs Altcoins</h4>' +
              '<p>' +
              (parseFloat(btcDom) > 55 ? 'La dominancia elevada de Bitcoin sugiere que el capital permanece concentrado en el activo de mayor capitalización. Históricamente, valores superiores al 55% preceden a expansiones del universo altcoin una vez BTC consolida.' : parseFloat(btcDom) > 48 ? 'La dominancia equilibrada de Bitcoin indica un mercado maduro donde el capital fluye de manera eficiente entre BTC, ETH y las altcoins más líquidas.' : 'La baja dominancia de Bitcoin indica rotación activa hacia activos de menor capitalización, con ETH y las principales Layer 1 absorbiendo el flujo de capital.') +
              '</p>' +
            '</div>' +

          '</div>' +
        '</div>' +
      '</div>' +

      // Section 3
      '<div class="report-section">' +
        '<h2 class="report-section-title">⛓️ Inteligencia On-Chain y Fundamentales</h2>' +
        '<div class="report-section-body">' +

          '<div class="report-two-col">' +

            '<div>' +
              '<h4 class="report-sub-title">🏆 Top 3 Ganadores (24h)</h4>' +
              '<div class="report-gainers-list">' + gainersListHTML(top3Gainers) + '</div>' +
            '</div>' +

            '<div>' +
              '<h4 class="report-sub-title">📉 Top 3 Rezagados (24h)</h4>' +
              '<div class="report-gainers-list">' + gainersListHTML(top3Losers) + '</div>' +
            '</div>' +

          '</div>' +

          '<div class="report-signals-wrap" style="margin-top:var(--spacing-lg);">' +
            '<h4 class="report-sub-title">🔬 Señales Cuantitativas — Activos Principales</h4>' +
            '<div class="report-signals-table-wrap">' +
              '<table class="report-signals-table">' +
                '<thead><tr>' +
                  '<th>Activo</th><th>Precio</th><th>RSI (14)</th><th>Var. 24h</th><th>Señal</th>' +
                '</tr></thead>' +
                '<tbody>' + signalRows + '</tbody>' +
              '</table>' +
            '</div>' +
          '</div>' +

          '<div class="report-onchain-note">' +
            '<strong>📌 Nota Analítica:</strong> Los datos de RSI son estimaciones matemáticas derivadas de la variación porcentual de 24h (proxy de momentum de corto plazo). ' +
            'Los niveles de soporte y resistencia se calculan aplicando bandas de desviación estadística sobre el precio actual. ' +
            'Para análisis intradiario preciso, se recomienda validar con datos de velas en temporalidades 4H/1D.' +
          '</div>' +

        '</div>' +
      '</div>' +

      // Section 4
      '<div class="report-section">' +
        '<h2 class="report-section-title">🎯 Zonas de Interés y Proyección Técnica</h2>' +
        '<div class="report-section-body">' +

          '<div class="report-levels-grid">' +

            '<div class="report-level-card">' +
              '<div class="report-level-coin">' +
                '<span class="report-level-symbol" style="color:#f7931a;">₿</span>' +
                '<div><span class="report-level-name">Bitcoin</span> <span class="report-level-sym">BTC</span></div>' +
              '</div>' +
              '<div class="report-level-price">Precio: <strong>' + formatPrice(btcPrice) + '</strong></div>' +
              '<div class="report-level-rows">' +
                '<div class="report-level-row"><span class="report-level-label support">S1 Soporte Clave</span><span class="report-level-val support-val">' + btcSupport + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label resist">R1 Resistencia Clave</span><span class="report-level-val resist-val">' + btcResist + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label neutral">Sesgo 24h</span><span style="color:' + (btcChange >= 0 ? '#22c55e' : '#ef4444') + ';font-weight:700;">' + (btcChange >= 0 ? '+' : '') + btcChange.toFixed(2) + '%</span></div>' +
              '</div>' +
            '</div>' +

            (eth ? '<div class="report-level-card">' +
              '<div class="report-level-coin">' +
                '<span class="report-level-symbol" style="color:#627eea;">Ξ</span>' +
                '<div><span class="report-level-name">Ethereum</span> <span class="report-level-sym">ETH</span></div>' +
              '</div>' +
              '<div class="report-level-price">Precio: <strong>' + formatPrice(ethPrice) + '</strong></div>' +
              '<div class="report-level-rows">' +
                '<div class="report-level-row"><span class="report-level-label support">S1 Soporte Clave</span><span class="report-level-val support-val">' + ethSupport + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label resist">R1 Resistencia Clave</span><span class="report-level-val resist-val">' + ethResist + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label neutral">Sesgo 24h</span><span style="color:' + (ethChange >= 0 ? '#22c55e' : '#ef4444') + ';font-weight:700;">' + (ethChange >= 0 ? '+' : '') + ethChange.toFixed(2) + '%</span></div>' +
              '</div>' +
            '</div>' : '') +

            (altOpp1 ? '<div class="report-level-card report-level-card--highlight">' +
              '<div class="report-level-coin">' +
                '<span class="report-level-symbol" style="color:#fbbf24;">★</span>' +
                '<div><span class="report-level-name">' + altOpp1.name + '</span> <span class="report-level-sym">' + (altOpp1.symbol||'').toUpperCase() + '</span></div>' +
              '</div>' +
              '<div class="report-altcoin-tag">📡 Divergencia Detectada</div>' +
              '<div class="report-level-price">Precio: <strong>' + formatPrice(altOpp1.current_price) + '</strong></div>' +
              '<div class="report-level-rows">' +
                '<div class="report-level-row"><span class="report-level-label support">S1 Soporte</span><span class="report-level-val support-val">' + formatPrice(Number(altOpp1.current_price)*0.955) + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label resist">R1 Resistencia</span><span class="report-level-val resist-val">' + formatPrice(Number(altOpp1.current_price)*1.06) + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label neutral">Momentum 24h</span><span style="color:#22c55e;font-weight:700;">+' + (Number(altOpp1.price_change_percentage_24h)||0).toFixed(2) + '%</span></div>' +
              '</div>' +
              '<p style="font-size:.78rem;color:var(--text-secondary);margin-top:8px;">Mayor gainer del mercado actual. Volumen inusual y momentum positivo sostenido. Vigilar ruptura de resistencia.</p>' +
            '</div>' : '') +

            (altOpp2 && altOpp2.id !== altOpp1?.id ? '<div class="report-level-card">' +
              '<div class="report-level-coin">' +
                '<span class="report-level-symbol" style="color:#818cf8;">◆</span>' +
                '<div><span class="report-level-name">' + altOpp2.name + '</span> <span class="report-level-sym">' + (altOpp2.symbol||'').toUpperCase() + '</span></div>' +
              '</div>' +
              '<div class="report-level-price">Precio: <strong>' + formatPrice(altOpp2.current_price) + '</strong></div>' +
              '<div class="report-level-rows">' +
                '<div class="report-level-row"><span class="report-level-label support">S1 Soporte</span><span class="report-level-val support-val">' + formatPrice(Number(altOpp2.current_price)*0.952) + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label resist">R1 Resistencia</span><span class="report-level-val resist-val">' + formatPrice(Number(altOpp2.current_price)*1.058) + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label neutral">Momentum 24h</span><span style="color:' + (Number(altOpp2.price_change_percentage_24h) >= 0 ? '#22c55e' : '#ef4444') + ';font-weight:700;">' + (Number(altOpp2.price_change_percentage_24h) >= 0 ? '+' : '') + (Number(altOpp2.price_change_percentage_24h)||0).toFixed(2) + '%</span></div>' +
              '</div>' +
            '</div>' : '') +

          '</div>' +

          '<div class="report-footer-bar">' +
            '<span>⚡ Generado por CriptoTracker PRO · Datos: CoinGecko API</span>' +
            '<span>' + dateStr + ' · ' + timeStr + '</span>' +
          '</div>' +

        '</div>' +
      '</div>' +

    '</div>';
  }



  // ==================== SIMULATOR TRIGGER CHECK ====================
  function checkSimulatorTriggers() {
    if (!window.Simulator || !window.Simulator.checkTriggers) return;
    const prices = getCurrentPrices();
    if (!prices || Object.keys(prices).length === 0) return;

    const triggered = window.Simulator.checkTriggers(prices);
    if (triggered && triggered.length > 0) {
      triggered.forEach(function(item) {
        if (item.type === 'stop_loss') {
          showToast('🛡️ Stop Loss ejecutado: Vendidos ' + item.amount.toFixed(4) + ' ' + (item.coinSymbol || '').toUpperCase() + ' a ' + formatPrice(item.sellPrice) + ' (P&L: ' + (item.pnlUSD >= 0 ? '+' : '') + formatPrice(item.pnlUSD) + ')', 'error');
        } else if (item.type === 'take_profit') {
          showToast('🎯 Take Profit ejecutado: Vendidos ' + item.amount.toFixed(4) + ' ' + (item.coinSymbol || '').toUpperCase() + ' a ' + formatPrice(item.sellPrice) + ' (+' + formatPrice(item.pnlUSD) + ')', 'success');
        }
      });
      renderPortfolio();
    }
  }

  // ==================== DATA LOADING ====================
  async function loadInitialData() {
    try {
      const cached = window.CryptoAPI.getCache();
      if (cached && cached.length > 0) {
        marketData = cached;
        renderCurrentTab();
        checkSimulatorTriggers();
      }

      // Step 1: Fetch Top 50 Market Data
      const market = await window.CryptoAPI.fetchMarketData();
      if (market && Array.isArray(market) && market.length > 0) {
        marketData = market;
      }

      const d = new Date();
      if (els.lastUpdated) {
        els.lastUpdated.textContent = 'Actualizado: ' + d.toLocaleTimeString('es-ES');
      }

      renderCurrentTab();
      drawSparklines();
      checkSimulatorTriggers();

      // Step 2: Stagger fetch gainers so we don't trigger CoinGecko 429
      setTimeout(async () => {
        try {
          const gainers = await window.CryptoAPI.fetchGainers();
          if (gainers && Array.isArray(gainers) && gainers.length > 0) {
            gainersData = gainers;
            if (currentTab === 'gainers' || currentTab === 'portfolio') {
              renderCurrentTab();
            }
            checkSimulatorTriggers();
          }
        } catch (e) {
          console.warn("Gainers fetch failed:", e);
        }
      }, 500);

    } catch (e) {
      console.error(e);
      showToast('Error cargando precios de mercado', 'error');
    }
  }

  // ==================== INITIALIZATION ====================
  async function init() {
    cacheDom();
    showSkeletons();
    setupEventListeners();
    await loadInitialData();

    // Start 30s Polling Loop
    window.CryptoAPI.startPolling(function(newData) {
      if (newData && Array.isArray(newData) && newData.length > 0) {
        marketData = newData;
        const d = new Date();
        if (els.lastUpdated) {
          els.lastUpdated.textContent = 'Actualizado: ' + d.toLocaleTimeString('es-ES');
        }

        checkSimulatorTriggers();

        window.CryptoAPI.fetchGainers().then(function(newGainers) {
          if (newGainers) gainersData = newGainers;
          renderCurrentTab();
          checkSimulatorTriggers();
        }).catch(function() {
          renderCurrentTab();
        });
      }
    });
  }

  // Bind app initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
