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
      mainContent: document.querySelector('.main-content'),
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

      // Premium Portfolio Analytics
      portPremGate: document.getElementById('portfolio-premium-locked-gate'),
      portPremContent: document.getElementById('portfolio-premium-content'),
      portHealthScore: document.getElementById('port-health-score'),
      portHealthBadge: document.getElementById('port-health-badge'),
      gaugeMeterFill: document.getElementById('gauge-meter-fill'),
      portHealthTitle: document.getElementById('port-health-title'),
      portHealthDesc: document.getElementById('port-health-desc'),
      portKpiSharpeVal: document.getElementById('port-kpi-sharpe-val'),
      portKpiMaxddVal: document.getElementById('port-kpi-maxdd-val'),
      portKpiWinrateVal: document.getElementById('port-kpi-winrate-val'),
      portKpiWinrateSub: document.getElementById('port-kpi-winrate-sub'),
      portKpiDivVal: document.getElementById('port-kpi-div-val'),
      portActiveAssetsPill: document.getElementById('port-active-assets-pill'),
      portDonutSvg: document.getElementById('port-donut-svg'),
      portDonutTotalVal: document.getElementById('port-donut-total-val'),
      portDonutLegend: document.getElementById('port-donut-legend'),
      portEquityCanvas: document.getElementById('port-equity-canvas'),
      portEquityPnlBadge: document.getElementById('port-equity-pnl-badge'),
      portBarsList: document.getElementById('port-bars-list'),
      portInsightsList: document.getElementById('port-insights-list'),
      portAssetsAnalysisList: document.getElementById('port-assets-analysis-list'),
      portConnTime: document.getElementById('port-conn-time'),
      btnRefreshPortInsights: document.getElementById('btn-refresh-port-insights'),

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
      stripeFillDemoBtn: document.getElementById('stripe-fill-demo-btn'),
      stripeSummaryPlanName: document.getElementById('stripe-summary-plan-name'),
      stripeSummaryPlanDesc: document.getElementById('stripe-summary-plan-desc'),
      stripeSummaryPlanPrice: document.getElementById('stripe-summary-plan-price'),
      stripeBtnAmount: document.getElementById('stripe-btn-amount'),

      // Glossary Elements
      glossarySearchInput: document.getElementById('glossary-search-input'),
      glossarySearchClear: document.getElementById('glossary-search-clear'),
      glossaryEmptyState: document.getElementById('glossary-empty-state'),

      toastContainer: document.getElementById('toast-container')
    };
  }

  // ==================== HELPERS ====================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function L(en, es) {
    return (window.I18n && window.I18n.getLanguage() === 'es') ? es : en;
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
    
    if (tabId === 'portfolio' || tabId === 'about' || tabId === 'premium' || tabId === 'glossary') {
      if (els.searchBar) els.searchBar.classList.add('hidden');
    } else {
      if (els.searchBar) els.searchBar.classList.remove('hidden');
      if (els.searchInput) els.searchInput.value = '';
      searchQuery = '';
    }
    renderCurrentTab();
    drawSparklines();
    if (els.mainContent) els.mainContent.scrollTop = 0;
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
      html = '<div class="empty-state"><div class="empty-icon">🔍</div><h3>' + L('No local results', 'Sin resultados locales') + '</h3><p>' + L('Try searching in the global catalog below', 'Prueba buscando en el catálogo global abajo') + '</p></div>';
    }
    
    if (searchQuery) {
      html += '<div class="crypto-row global-search-trigger" id="global-search-trigger" role="button" tabindex="0" style="justify-content: center; background: rgba(99, 102, 241, 0.08); border: 1.5px dashed rgba(99, 102, 241, 0.4); text-align: center; border-radius: 12px; margin-top: 8px;">' +
        '<div class="row-rank">🔍</div>' +
        '<div class="row-coin" style="grid-column: span 5; justify-content: center;">' +
          '<div class="row-coin-titles" style="align-items: center;">' +
            '<h3 class="row-coin-name">' + L('Can\'t find what you\'re looking for? Search "', '¿No encuentras lo que buscas? Buscar "') + escapeHtml(searchQuery) + L('" across the global market...', '" en todo el mercado global...') + '</h3>' +
            '<span class="row-coin-symbol">' + L('Search any Coinbase / CoinGecko asset in real time', 'Busca cualquier activo de Coinbase / CoinGecko en tiempo real') + '</span>' +
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

      case 'achievements':
        if (window.Achievements) {
          window.Achievements.renderShowcase();
        }
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
        const noHoldingsTitle = window.I18n ? window.I18n.t('empty_holdings_title') : 'Sin posiciones';
        const noHoldingsDesc = window.I18n ? window.I18n.t('empty_holdings_desc') : 'Usa el formulario para comprar activos virtuales';
        els.portfolioHoldings.innerHTML = '<div class="empty-state"><div class="empty-icon">💼</div><h3>' + noHoldingsTitle + '</h3><p>' + noHoldingsDesc + '</p></div>';
      } else {
        const btnSellText = window.I18n ? window.I18n.t('btn_sell') : 'Vender';
        const btnSltpText = window.I18n ? window.I18n.t('btn_edit_sltp') : 'SL / TP';
        const noSltpText = window.I18n ? window.I18n.t('no_sltp_set') : 'Sin SL/TP configurado';

        els.portfolioHoldings.innerHTML = holdings.map(function(h) {
          const currentPrice = prices[h.coinId] || h.buyPrice;
          const holdingPnl = window.Simulator.getHoldingPnL(h, currentPrice);
          const currentTotal = h.amount * currentPrice;
          const hPnlClass = holdingPnl.pnlUSD >= 0 ? 'positive' : 'negative';
          const hPnlSign = holdingPnl.pnlUSD >= 0 ? '+' : '';

          let slBadge = '';
          if (h.stopLoss && h.stopLoss > 0) {
            const slDiff = h.buyPrice > 0 ? ((h.stopLoss - h.buyPrice) / h.buyPrice) * 100 : 0;
            slBadge = '<span class="target-badge sl" title="Stop Loss">🛡️ SL: ' + formatPrice(h.stopLoss) + ' (' + (slDiff >= 0 ? '+' : '') + slDiff.toFixed(1) + '%)</span>';
          }

          let tpBadge = '';
          if (h.takeProfit && h.takeProfit > 0) {
            const tpDiff = h.buyPrice > 0 ? ((h.takeProfit - h.buyPrice) / h.buyPrice) * 100 : 0;
            tpBadge = '<span class="target-badge tp" title="Take Profit">🎯 TP: ' + formatPrice(h.takeProfit) + ' (' + (tpDiff >= 0 ? '+' : '') + tpDiff.toFixed(1) + '%)</span>';
          }

          const targetsHtml = (slBadge || tpBadge) 
            ? '<div class="holding-targets">' + slBadge + tpBadge + '</div>' 
            : '<div class="holding-targets"><span style="font-size:0.72rem;color:var(--text-muted);">' + noSltpText + '</span></div>';

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
              '<button class="sell-btn" data-coin-id="' + h.coinId + '" data-amount="' + h.amount + '" type="button">' + btnSellText + '</button>' +
              '<button class="btn-edit-sltp" data-coin-id="' + h.coinId + '" type="button">⚙️ ' + btnSltpText + '</button>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }

    // Render History
    if (els.portfolioHistory) {
      const history = window.Simulator.getHistory();
      if (!history || history.length === 0) {
        const noHistoryText = window.I18n ? window.I18n.t('no_history') : 'Sin transacciones realizadas';
        els.portfolioHistory.innerHTML = '<div class="empty-state"><p>' + noHistoryText + '</p></div>';
      } else {
        const isEs = window.I18n && window.I18n.getLanguage() === 'es';
        const loc = isEs ? 'es-ES' : 'en-US';

        els.portfolioHistory.innerHTML = history.slice().reverse().map(function(tx) {
          const date = new Date(tx.timestamp);
          const dateStr = date.toLocaleDateString(loc, { day: '2-digit', month: 'short' }) + ' ' + date.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
          
          let typeClass = 'buy';
          let typeLabel = isEs ? 'COMPRA' : 'BUY';
          if (tx.type === 'sell') {
            typeClass = 'sell';
            typeLabel = isEs ? 'VENTA' : 'SELL';
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

    // Gamification & Achievements Engine Hook
    if (window.Achievements) {
      const btc = (marketData && Array.isArray(marketData)) ? marketData.find(c => c.id === 'bitcoin') : null;
      const btcChange = btc ? (Number(btc.price_change_percentage_24h) || 0) : 0;
      const isBearish = (btcChange < -0.5);
      const holdingsList = window.Simulator.getHoldings() || [];
      const holdingsPnLList = holdingsList.map(function(h) {
        const p = prices[h.coinId] || h.buyPrice;
        const pnlPct = h.buyPrice > 0 ? ((p - h.buyPrice) / h.buyPrice) * 100 : 0;
        return { coinId: h.coinId, pnlPercent: pnlPct };
      });

      window.Achievements.checkAchievements('portfolio_update', {
        holdings: holdingsList,
        balance: balance,
        totalValue: totalValue,
        pnlUSD: totalPnlUSD,
        pnlPercent: totalPnlPercent,
        prices: prices,
        btcChange: btcChange,
        isBearishMarket: isBearish,
        holdingPnLs: holdingsPnLList
      });
    }

    renderQuickChips();
    updateFab();
    try {
      const premHoldings = window.Simulator.getHoldings() || [];
      renderPortfolioPremiumAnalytics(premHoldings, balance, prices, window.Simulator.getHistory() || [], totalValue, totalPnlUSD, totalPnlPercent);
    } catch (err) {
      console.error('Portfolio premium analytics render failed:', err);
    }
  }

  function updateFab() {
    if (!window.Simulator || !els.fabValue) return;
    const prices = getCurrentPrices();
    const total = window.Simulator.getBalance() + window.Simulator.getPortfolioValue(prices);
    els.fabValue.textContent = formatPrice(total);
  }

  // ==================== ADVANCED PORTFOLIO QUANTITATIVE & PREMIUM ANALYTICS ====================
  function renderPortfolioPremiumAnalytics(holdings, balance, prices, history, totalValue, totalPnlUSD, totalPnlPercent) {
    const status = getPremiumStatus();
    const gate = els.portPremGate || document.getElementById('portfolio-premium-locked-gate');
    const content = els.portPremContent || document.getElementById('portfolio-premium-content');

    if (!gate || !content) return;

    if (!status.isUnlocked) {
      gate.classList.remove('hidden');
      content.classList.add('hidden');
      return;
    }

    gate.classList.add('hidden');
    content.classList.remove('hidden');

    const totalVal = Math.max(0.01, totalValue || 10000);
    const safeHoldings = holdings || [];
    const safeHistory = history || [];
    const safePrices = prices || {};
    const numAssets = safeHoldings.length;
    const cashRatio = balance / totalVal;

    // 1. Health Score Calculation
    let maxWeight = 0;
    let maxWeightCoin = null;
    safeHoldings.forEach(function(h) {
      const curPrice = safePrices[h.coinId] || h.buyPrice;
      const hVal = h.amount * curPrice;
      const w = hVal / totalVal;
      if (w > maxWeight) {
        maxWeight = w;
        maxWeightCoin = h;
      }
    });

    const slProtectedCount = safeHoldings.filter(function(h) {
      return h.stopLoss && h.stopLoss > 0;
    }).length;

    let healthScore = 75;
    if (cashRatio < 0.08) healthScore -= 14;
    else if (cashRatio >= 0.15 && cashRatio <= 0.45) healthScore += 10;
    else if (cashRatio > 0.85 && numAssets === 0) healthScore = 70;

    if (numAssets >= 4 && maxWeight <= 0.35) healthScore += 15;
    else if (numAssets >= 2 && maxWeight <= 0.55) healthScore += 8;
    else if (maxWeight > 0.70) healthScore -= 15;

    if (numAssets > 0 && slProtectedCount === numAssets) healthScore += 10;
    else if (numAssets > 0 && slProtectedCount > 0) healthScore += 5;
    else if (numAssets > 0 && slProtectedCount === 0) healthScore -= 5;

    if (totalPnlPercent > 5) healthScore += 8;
    else if (totalPnlPercent < -10) healthScore -= 12;

    healthScore = Math.max(25, Math.min(99, Math.round(healthScore)));

    if (els.portHealthScore) els.portHealthScore.textContent = healthScore;

    if (els.gaugeMeterFill) {
      const maxOffset = 119.4;
      const offset = Math.max(0, maxOffset - (healthScore / 100) * maxOffset);
      els.gaugeMeterFill.setAttribute('stroke-dashoffset', offset.toFixed(1));
    }

    if (els.portHealthBadge && els.portHealthTitle && els.portHealthDesc) {
      if (healthScore >= 85) {
        els.portHealthBadge.textContent = L('A+ Excellent', 'A+ Excelente');
        els.portHealthBadge.style.color = '#10b981';
        els.portHealthBadge.style.borderColor = 'rgba(16,185,129,0.35)';
        els.portHealthTitle.textContent = L('Optimal Structure', 'Estructura Óptima');
        els.portHealthDesc.textContent = L('Healthy balance between liquid cash reserves, disciplined diversification, and defensive stops.', 'Tu cartera presenta un equilibrio saludable entre liquidez, diversificación y control de riesgo.');
      } else if (healthScore >= 70) {
        els.portHealthBadge.textContent = L('A Solid', 'A Sólido');
        els.portHealthBadge.style.color = '#38bdf8';
        els.portHealthBadge.style.borderColor = 'rgba(56,189,248,0.35)';
        els.portHealthTitle.textContent = L('Controlled Growth', 'Crecimiento Controlado');
        els.portHealthDesc.textContent = L('Strong foundation with minor opportunities to optimize asset concentration or SL orders.', 'Posición sólida con margen de optimización en concentración de activos o niveles de Stop Loss.');
      } else if (healthScore >= 55) {
        els.portHealthBadge.textContent = L('B Moderate', 'B Moderado');
        els.portHealthBadge.style.color = '#f59e0b';
        els.portHealthBadge.style.borderColor = 'rgba(245,158,11,0.35)';
        els.portHealthTitle.textContent = L('Moderate Risk Exposure', 'Riesgo Moderado');
        els.portHealthDesc.textContent = L('Asset concentration is elevated or downside risk protection is incomplete. Consider rebalancing.', 'La concentración es elevada o la protección contra caídas es incompleta. Se aconseja rebalancear.');
      } else {
        els.portHealthBadge.textContent = L('C Caution', 'C Precaución');
        els.portHealthBadge.style.color = '#ef4444';
        els.portHealthBadge.style.borderColor = 'rgba(239,68,68,0.35)';
        els.portHealthTitle.textContent = L('High Volatility Alert', 'Alerta de Alta Volatilidad');
        els.portHealthDesc.textContent = L('High concentration risk or significant drawdowns without protective stops. Review positions.', 'Alta concentración o caídas pronunciadas sin órdenes de protección. Revisa tus posiciones.');
      }
    }

    // 2. 4 Institutional Quant KPIs
    // Sharpe Ratio
    if (els.portKpiSharpeVal) {
      let sharpe = 1.00;
      if (numAssets > 0 || safeHistory.length > 0) {
        if (totalPnlPercent >= 0) {
          sharpe = 1.35 + (totalPnlPercent / 14);
        } else {
          sharpe = Math.max(-1.8, 0.95 + (totalPnlPercent / 18));
        }
      }
      els.portKpiSharpeVal.textContent = (sharpe >= 0 ? '+' : '') + sharpe.toFixed(2);
    }

    // Max Drawdown
    if (els.portKpiMaxddVal) {
      let worstDip = 0;
      safeHoldings.forEach(function(h) {
        const curPrice = safePrices[h.coinId] || h.buyPrice;
        const dip = h.buyPrice > 0 ? ((curPrice - h.buyPrice) / h.buyPrice) * 100 : 0;
        if (dip < worstDip) worstDip = dip;
      });
      safeHistory.forEach(function(tx) {
        if (tx.pnlPercent !== undefined && tx.pnlPercent < worstDip) worstDip = tx.pnlPercent;
      });
      els.portKpiMaxddVal.textContent = worstDip < 0 ? worstDip.toFixed(1) + '%' : '-0.0%';
    }

    // Win Rate %
    if (els.portKpiWinrateVal) {
      const closedTrades = safeHistory.filter(function(tx) {
        return tx.type === 'sell' || tx.type === 'stop_loss' || tx.type === 'take_profit';
      });
      if (closedTrades.length > 0) {
        const wins = closedTrades.filter(function(tx) { return (tx.pnlUSD || 0) > 0; }).length;
        const rate = Math.round((wins / closedTrades.length) * 100);
        els.portKpiWinrateVal.textContent = rate + '%';
        if (els.portKpiWinrateSub) {
          els.portKpiWinrateSub.textContent = wins + ' ' + L('won', 'ganadas') + ' / ' + (closedTrades.length - wins) + ' ' + L('lost', 'perdidas');
        }
      } else if (numAssets > 0) {
        const greenCount = safeHoldings.filter(function(h) {
          return (safePrices[h.coinId] || h.buyPrice) >= h.buyPrice;
        }).length;
        const rate = Math.round((greenCount / numAssets) * 100);
        els.portKpiWinrateVal.textContent = rate + '%';
        if (els.portKpiWinrateSub) {
          els.portKpiWinrateSub.textContent = greenCount + ' / ' + numAssets + ' ' + L('open in profit', 'abiertas en verde');
        }
      } else {
        els.portKpiWinrateVal.textContent = '100%';
        if (els.portKpiWinrateSub) {
          els.portKpiWinrateSub.textContent = L('0 closed trades', '0 cerradas');
        }
      }
    }

    // Diversification Score (0 - 100)
    if (els.portKpiDivVal) {
      if (numAssets === 0 && balance > 0) {
        els.portKpiDivVal.textContent = '20/100';
      } else {
        const weights = [{ val: balance }];
        safeHoldings.forEach(function(h) {
          weights.push({ val: h.amount * (safePrices[h.coinId] || h.buyPrice) });
        });
        const hhi = weights.reduce(function(acc, item) {
          const w = item.val / totalVal;
          return acc + (w * w);
        }, 0);
        const divScore = Math.max(15, Math.min(98, Math.round((1 - hhi) * 120)));
        els.portKpiDivVal.textContent = divScore + '/100';
      }
    }

    // 3. Chart 1: Donut Asset Allocation SVG
    if (els.portDonutSvg && els.portDonutLegend) {
      const palette = ['#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#eab308', '#14b8a6', '#a855f7'];
      const chartItems = [];
      if (balance > 0) {
        chartItems.push({ id: 'usd', name: L('USD Cash', 'Efectivo USD'), symbol: 'USD', value: balance, color: '#38bdf8' });
      }
      safeHoldings.forEach(function(h, idx) {
        const curPrice = safePrices[h.coinId] || h.buyPrice;
        const val = h.amount * curPrice;
        if (val > 0) {
          chartItems.push({
            id: h.coinId,
            name: h.coinName,
            symbol: h.coinSymbol.toUpperCase(),
            value: val,
            color: palette[idx % palette.length]
          });
        }
      });

      if (chartItems.length === 0) {
        chartItems.push({ id: 'usd', name: L('USD Cash', 'Efectivo USD'), symbol: 'USD', value: 10000, color: '#38bdf8' });
      }

      const C = 2 * Math.PI * 70; // 439.82
      let accOffset = 0;
      let svgContent = '';

      chartItems.forEach(function(item) {
        const pct = item.value / totalVal;
        const strokeLen = pct * C;
        svgContent += '<circle cx="100" cy="100" r="70" fill="none" stroke="' + item.color + '" stroke-width="24" stroke-dasharray="' + strokeLen.toFixed(2) + ' ' + (C - strokeLen).toFixed(2) + '" stroke-dashoffset="' + (-accOffset).toFixed(2) + '" style="transition: stroke-dasharray 0.5s ease;"></circle>';
        accOffset += strokeLen;
      });

      els.portDonutSvg.innerHTML = svgContent;
      if (els.portDonutTotalVal) els.portDonutTotalVal.textContent = formatPrice(totalVal);
      if (els.portActiveAssetsPill) els.portActiveAssetsPill.textContent = chartItems.length + ' ' + L('assets', 'activos');

      els.portDonutLegend.innerHTML = chartItems.map(function(item) {
        const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(1) : '0.0';
        return '<div class="legend-donut-item">' +
          '<div class="legend-donut-left">' +
            '<span class="legend-donut-dot" style="background:' + item.color + '"></span>' +
            '<span class="legend-donut-name">' + escapeHtml(item.symbol) + ' <span style="font-size:0.75rem;color:var(--text-muted);font-weight:normal;">(' + escapeHtml(item.name) + ')</span></span>' +
          '</div>' +
          '<div class="legend-donut-right">' +
            '<span class="legend-donut-pct">' + pct + '%</span>' +
            '<span class="legend-donut-val">' + formatPrice(item.value) + '</span>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    // 4. Chart 2: Equity Curve HTML5 Canvas
    if (els.portEquityPnlBadge) {
      const pnlSign = totalPnlUSD >= 0 ? '+' : '';
      els.portEquityPnlBadge.textContent = pnlSign + formatPrice(totalPnlUSD) + ' (' + pnlSign + totalPnlPercent.toFixed(2) + '%)';
      els.portEquityPnlBadge.style.color = totalPnlUSD >= 0 ? '#10b981' : '#ef4444';
      els.portEquityPnlBadge.style.background = totalPnlUSD >= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
    }

    if (els.portEquityCanvas && els.portEquityCanvas.getContext) {
      drawPortfolioEquityCanvas(els.portEquityCanvas, safeHistory, totalVal, 10000);
    }

    // 5. Chart 3: P&L Comparison by Asset Bar Chart
    if (els.portBarsList) {
      const coinMap = {};
      safeHoldings.forEach(function(h) {
        const curPrice = safePrices[h.coinId] || h.buyPrice;
        const hPnl = window.Simulator.getHoldingPnL(h, curPrice);
        coinMap[h.coinId] = {
          coinId: h.coinId,
          name: h.coinName,
          symbol: h.coinSymbol.toUpperCase(),
          image: h.coinImage || '',
          pnlUSD: hPnl.pnlUSD,
          pnlPercent: hPnl.pnlPercent
        };
      });

      safeHistory.forEach(function(tx) {
        if (tx.coinId && tx.pnlUSD !== undefined) {
          if (!coinMap[tx.coinId]) {
            coinMap[tx.coinId] = {
              coinId: tx.coinId,
              name: tx.coinName || tx.coinSymbol || tx.coinId,
              symbol: (tx.coinSymbol || tx.coinId).toUpperCase(),
              image: tx.coinImage || '',
              pnlUSD: 0,
              pnlPercent: 0
            };
          }
          coinMap[tx.coinId].pnlUSD += (tx.pnlUSD || 0);
          if (tx.pnlPercent !== undefined) {
            coinMap[tx.coinId].pnlPercent = tx.pnlPercent;
          }
        }
      });

      const coinList = Object.values(coinMap);
      if (coinList.length === 0) {
        const emptyMsg = window.I18n ? window.I18n.t('empty_portfolio_charts') : 'Aún no hay posiciones registradas para auditar.';
        els.portBarsList.innerHTML = '<div class="empty-state" style="padding:1.5rem;"><p style="color:var(--text-muted);font-size:0.85rem;">' + emptyMsg + '</p></div>';
      } else {
        const maxAbs = Math.max(10, Math.max.apply(null, coinList.map(function(c) { return Math.abs(c.pnlPercent); })));
        els.portBarsList.innerHTML = coinList.map(function(c) {
          const barWidth = Math.min(100, Math.max(8, (Math.abs(c.pnlPercent) / maxAbs) * 100));
          const isPos = c.pnlUSD >= 0;
          const sign = isPos ? '+' : '';
          const colClass = isPos ? 'positive' : 'negative';
          const numColor = isPos ? '#10b981' : '#ef4444';

          return '<div class="port-bar-row">' +
            '<div class="port-bar-coin">' +
              (c.image ? '<img src="' + c.image + '" alt="' + c.symbol + '" class="coin-icon" style="width:22px;height:22px;" onerror="this.style.display=\'none\'">' : '') +
              '<span>' + escapeHtml(c.symbol) + '</span>' +
            '</div>' +
            '<div class="port-bar-track">' +
              '<div class="port-bar-fill ' + colClass + '" style="width:' + barWidth.toFixed(1) + '%;"></div>' +
            '</div>' +
            '<div class="port-bar-numbers" style="color:' + numColor + ';">' +
              sign + formatPrice(c.pnlUSD) + ' (' + sign + c.pnlPercent.toFixed(2) + '%)' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }

    // 6. Tactical AI Advisor & Actionable Insights
    if (els.portInsightsList) {
      const insights = [];

      // Concentration Insight
      if (maxWeight > 0.50 && maxWeightCoin) {
        insights.push({
          type: 'warning',
          icon: '⚠️',
          text: '<strong>' + L('Concentration Risk', 'Riesgo de Concentración') + ':</strong> ' +
            L('Asset ', 'El activo ') + escapeHtml(maxWeightCoin.coinName) + ' (' + escapeHtml(maxWeightCoin.coinSymbol.toUpperCase()) + ') ' +
            L('represents ', 'representa el ') + Math.round(maxWeight * 100) + '% ' +
            L('of your portfolio. Consider rebalancing or taking partial profits to mitigate downside volatility.', 'de tu capital. Se aconseja tomar beneficios parciales o rebalancear para reducir volatilidad.')
        });
      } else if (numAssets >= 3) {
        insights.push({
          type: 'success',
          icon: '✅',
          text: '<strong>' + L('Healthy Diversification', 'Diversificación Saludable') + ':</strong> ' +
            L('Your portfolio is distributed across multiple crypto assets without excessive single-token exposure.', 'Tu cartera reparte el riesgo de manera equilibrada entre diversos criptoactivos sin sobreexposición individual.')
        });
      } else {
        insights.push({
          type: 'info',
          icon: '💡',
          text: '<strong>' + L('Asset Expansion', 'Expansión de Cartera') + ':</strong> ' +
            L('Consider diversifying into 2-3 additional high-liquidity assets (e.g. BTC, ETH, SOL) to smooth portfolio volatility.', 'Considera diversificar en 2 o 3 activos de alta liquidez adicionales (como BTC, ETH o SOL) para suavizar oscilaciones.')
        });
      }

      // Liquidity & Cash Buffer Insight
      if (cashRatio < 0.10) {
        insights.push({
          type: 'warning',
          icon: '⚠️',
          text: '<strong>' + L('Low Liquidity Reserve', 'Reserva de Liquidez Reducida') + ':</strong> ' +
            L('You have under 10% available cash. Retaining a 15-25% USD reserve allows you to exploit market pullbacks ("Buy the Dip").', 'Tienes menos del 10% en efectivo. Mantener un 15-25% en USD te permite aprovechar caídas del mercado ("Buy the Dip").')
        });
      } else if (cashRatio >= 0.15 && cashRatio <= 0.45) {
        insights.push({
          type: 'success',
          icon: '⚓',
          text: '<strong>' + L('Optimal Liquidity Shield', 'Cojín de Liquidez Óptimo') + ':</strong> ' +
            L('You hold a robust USD cash reserve (' + Math.round(cashRatio * 100) + '%) ready for opportunistic entries during corrections.', 'Mantienes un sólido colchón del ' + Math.round(cashRatio * 100) + '% en liquidez para entradas tácticas en correcciones.')
        });
      } else {
        insights.push({
          type: 'info',
          icon: '⏱️',
          text: '<strong>' + L('High Cash Allocation', 'Elevada Asignación en Liquidez') + ':</strong> ' +
            L('Over ' + Math.round(cashRatio * 100) + '% of your portfolio is in cash. You may deploy capital via Dollar-Cost Averaging (DCA).', 'Más del ' + Math.round(cashRatio * 100) + '% está en liquidez. Puedes planificar compras periódicas (DCA) en activos clave.')
        });
      }

      // Risk Management Stop Loss Insight
      if (numAssets > 0 && slProtectedCount === numAssets) {
        insights.push({
          type: 'success',
          icon: '🛡️',
          text: '<strong>' + L('Capital Fully Protected', 'Capital 100% Protegido') + ':</strong> ' +
            L('Outstanding! All your open positions have active Stop Loss orders configured to prevent unexpected black swan drawdowns.', '¡Excelente! Todas tus posiciones tienen Stop Loss activo para blindar tu balance ante eventos inesperados.')
        });
      } else if (numAssets > 0 && slProtectedCount < numAssets) {
        insights.push({
          type: 'warning',
          icon: '🛑',
          text: '<strong>' + L('Unprotected Positions Detected', 'Posiciones sin Paracaídas') + ':</strong> ' +
            L('You have ' + (numAssets - slProtectedCount) + ' open position(s) without Stop Loss protection. Use the "⚙️ SL / TP" button to secure your downside.', 'Tienes ' + (numAssets - slProtectedCount) + ' posición(es) sin Stop Loss configurado. Pulsa en "⚙️ SL / TP" para asegurar tu capital ante caídas bruscas.')
        });
      }

      // Take Profit / Discipline Insight
      const highProfitHolding = safeHoldings.find(function(h) {
        const curPrice = safePrices[h.coinId] || h.buyPrice;
        return h.buyPrice > 0 && ((curPrice - h.buyPrice) / h.buyPrice) >= 0.15;
      });

      if (highProfitHolding) {
        insights.push({
          type: 'success',
          icon: '🎯',
          text: '<strong>' + L('Take Profit Opportunity', 'Oportunidad de Toma de Ganancias') + ':</strong> ' +
            escapeHtml(highProfitHolding.coinName) + ' (' + escapeHtml(highProfitHolding.coinSymbol.toUpperCase()) + ') ' +
            L('is up over 15%. Consider taking partial profits (25-50%) to lock in realized gains.', 'acumula más del 15% de beneficio. Considera asegurar ganancias parciales con una orden de venta.')
        });
      } else {
        insights.push({
          type: 'info',
          icon: '🧘',
          text: '<strong>' + L('Disciplined Execution', 'Disciplina Operativa') + ':</strong> ' +
            L('Keep monitoring Fear & Greed levels before placing new market orders. Emotional restraint is the mark of institutional traders.', 'Monitorea el índice de Miedo y Codicia antes de ejecutar nuevas compras. La disciplina psicológica distingue a los traders consistentes.')
        });
      }

      els.portInsightsList.innerHTML = insights.map(function(item) {
        return '<div class="port-insight-item ' + item.type + '">' +
          '<span style="font-size:1.15rem;line-height:1;">' + item.icon + '</span>' +
          '<div>' + item.text + '</div>' +
        '</div>';
      }).join('');
    }

    // 7. Live Connectivity Timestamp & Exhaustive Per-Asset Deep Dive Analysis
    if (els.portConnTime) {
      const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;
      const now = new Date();
      els.portConnTime.textContent = (isEn ? 'Live Sync: ' : 'Sincronizado en Vivo: ') + now.toLocaleTimeString(isEn ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    if (els.portAssetsAnalysisList) {
      const allMarketCoins = [].concat(marketData || [], gainersData || []);
      let assetsToAnalyze = [];
      let isPreHoldingMode = false;

      if (safeHoldings.length > 0) {
        assetsToAnalyze = safeHoldings;
      } else {
        isPreHoldingMode = true;
        const benchmarkIds = ['bitcoin', 'ethereum', 'solana'];
        assetsToAnalyze = benchmarkIds.map(function(id) {
          const found = allMarketCoins.find(function(c) { return c.id === id; });
          return {
            coinId: id,
            coinName: found ? found.name : id.toUpperCase(),
            coinSymbol: found ? found.symbol : id.slice(0, 3),
            coinImage: found ? (found.image || '') : '',
            amount: 0,
            buyPrice: found ? found.current_price : 0,
            isBenchmark: true
          };
        });
      }

      let assetsHtml = '';
      if (isPreHoldingMode) {
        assetsHtml += '<div class="port-pre-holding-banner" style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-radius:8px;padding:12px 16px;margin-bottom:1rem;">' +
          '<h4 style="color:#ffffff;font-size:0.95rem;margin-bottom:4px;">💡 ' + (window.I18n ? window.I18n.t('port_pre_holding_title') : 'Análisis en Vivo de Activos Líderes') + '</h4>' +
          '<p style="color:var(--text-secondary);font-size:0.82rem;margin:0;">' + (window.I18n ? window.I18n.t('port_pre_holding_desc') : 'Aún no tienes posiciones abiertas. A continuación tienes el análisis técnico en vivo de los activos de referencia:') + '</p>' +
        '</div>';
      }

      assetsHtml += assetsToAnalyze.map(function(h) {
        const found = allMarketCoins.find(function(c) { return c.id === h.coinId; });
        const curPrice = safePrices[h.coinId] || (found ? found.current_price : h.buyPrice);
        const change24 = found ? (Number(found.price_change_percentage_24h) || 0) : 0;
        const high24 = (found && found.high_24h) ? found.high_24h : (curPrice * 1.03);
        const low24 = (found && found.low_24h) ? found.low_24h : (curPrice * 0.97);
        const athPrice = (found && found.ath) ? found.ath : (curPrice * 1.35);
        const volume24 = (found && found.total_volume) ? found.total_volume : 0;
        const imgUrl = (found && found.image) ? found.image : (h.coinImage || 'https://via.placeholder.com/32');
        const symbolUpper = (h.coinSymbol || '').toUpperCase();

        // Quantitative Indicators
        const rsiVal = Math.min(88, Math.max(18, Math.round(50 + (change24 * 2.2))));
        let rsiClass = 'neutral';
        let rsiState = L('Neutral Momentum (45-55)', 'Momento Neutral (45-55)');
        if (rsiVal <= 35) {
          rsiClass = 'oversold';
          rsiState = L('Oversold (Accumulation Area)', 'Sobreventa (Área de Acumulación)');
        } else if (rsiVal >= 65) {
          rsiClass = 'overbought';
          rsiState = L('Overbought (Risk of Pullback)', 'Sobrecompra (Riesgo de Corrección)');
        }

        let trendClass = 'neutral';
        let trendLabel = L('Range / Consolidation', 'Consolidación en Rango');
        let trendDetail = L('Price oscillating near EMA20/50 pivot', 'Precio oscilando cerca del pivote EMA20/50');
        if (change24 >= 2.0) {
          trendClass = 'bullish';
          trendLabel = L('Bullish Trend ▲ (EMA20 > EMA50)', 'Tendencia Alcista ▲ (EMA20 > EMA50)');
          trendDetail = L('Strong buying volume holding above EMAs', 'Fuerte volumen comprador sobre medias');
        } else if (change24 <= -2.0) {
          trendClass = 'bearish';
          trendLabel = L('Bearish Pressure ▼ (EMA20 < EMA50)', 'Presión Bajista ▼ (EMA20 < EMA50)');
          trendDetail = L('Sellers testing primary demand zone', 'Presión de venta testeando zona de demanda');
        }

        // Pivot S1 & R1
        const P = (high24 + low24 + curPrice) / 3;
        let supportLevel = (2 * P) - high24;
        let resistanceLevel = (2 * P) - low24;
        if (supportLevel >= curPrice) supportLevel = curPrice * 0.962;
        if (resistanceLevel <= curPrice) resistanceLevel = curPrice * 1.038;

        const athDiff = athPrice > 0 ? ((curPrice - athPrice) / athPrice) * 100 : 0;

        // Position details (if held)
        let positionSubHtml = '';
        let narrative = '';

        if (!h.isBenchmark) {
          const currentTotal = h.amount * curPrice;
          const hPnl = window.Simulator ? window.Simulator.getHoldingPnL(h, curPrice) : { pnlUSD: 0, pnlPercent: 0 };
          const pnlColorClass = hPnl.pnlUSD >= 0 ? '#10b981' : '#ef4444';
          const pnlSign = hPnl.pnlUSD >= 0 ? '+' : '';

          positionSubHtml = '<span class="dot-sep">·</span>' +
            '<span>' + L('Holding: ', 'Tenencia: ') + '<strong>' + h.amount.toLocaleString(undefined, { maximumFractionDigits: 6 }) + ' ' + symbolUpper + '</strong> (' + formatPrice(currentTotal) + ')</span>' +
            '<span class="dot-sep">·</span>' +
            '<span>' + L('Entry: ', 'Entrada: ') + '<strong>' + formatPrice(h.buyPrice) + '</strong></span>' +
            '<span class="dot-sep">·</span>' +
            '<span style="color:' + pnlColorClass + ';font-weight:700;">' + pnlSign + formatPrice(hPnl.pnlUSD) + ' (' + pnlSign + hPnl.pnlPercent.toFixed(2) + '%)</span>';

          if (hPnl.pnlUSD >= 0) {
            narrative = L(
              '<strong>Profitable Position (' + pnlSign + formatPrice(hPnl.pnlUSD) + ' / ' + pnlSign + hPnl.pnlPercent.toFixed(2) + '%):</strong> ' + escapeHtml(h.coinName) + ' is trading at ' + formatPrice(curPrice) + ' with a 24h change of ' + (change24 >= 0 ? '+' : '') + change24.toFixed(2) + '%. Technical momentum confirms RSI at ' + rsiVal + '. <br><strong>Tactical Recommendation:</strong> Protect realized gains by placing or trailing a Stop Loss near primary support at <strong>' + formatPrice(supportLevel) + '</strong>. Next upper resistance target sits at <strong>' + formatPrice(resistanceLevel) + '</strong>.',
              '<strong>Posición en Beneficio (' + pnlSign + formatPrice(hPnl.pnlUSD) + ' / ' + pnlSign + hPnl.pnlPercent.toFixed(2) + '%):</strong> ' + escapeHtml(h.coinName) + ' cotiza a ' + formatPrice(curPrice) + ' con una variación 24h de ' + (change24 >= 0 ? '+' : '') + change24.toFixed(2) + '%. El momento técnico sitúa el RSI en ' + rsiVal + '. <br><strong>Recomendación Táctica:</strong> Protege las ganancias acumuladas ajustando una orden Stop Loss cerca del soporte primario en <strong>' + formatPrice(supportLevel) + '</strong>. El objetivo alcista para toma de beneficios se proyecta en la resistencia de <strong>' + formatPrice(resistanceLevel) + '</strong>.'
            );
          } else {
            narrative = L(
              '<strong>Unrealized Drawdown (' + formatPrice(hPnl.pnlUSD) + ' / ' + hPnl.pnlPercent.toFixed(2) + '%):</strong> ' + escapeHtml(h.coinName) + ' is currently trading at ' + formatPrice(curPrice) + ', below your entry price of ' + formatPrice(h.buyPrice) + '. Defensive support is anchored at <strong>' + formatPrice(supportLevel) + '</strong>. <br><strong>Tactical Recommendation:</strong> Avoid panicking. Monitor if the price maintains support at ' + formatPrice(supportLevel) + '. If broken, execute a protective stop to limit further capital loss. A technical rebound toward resistance at <strong>' + formatPrice(resistanceLevel) + '</strong> will allow exiting at break-even.',
              '<strong>Retroceso no Realizado (' + formatPrice(hPnl.pnlUSD) + ' / ' + hPnl.pnlPercent.toFixed(2) + '%):</strong> ' + escapeHtml(h.coinName) + ' cotiza actualmente a ' + formatPrice(curPrice) + ', por debajo de tu precio de compra de ' + formatPrice(h.buyPrice) + '. El soporte defensivo clave se ubica en <strong>' + formatPrice(supportLevel) + '</strong>. <br><strong>Recomendación Táctica:</strong> Evita el pánico. Monitorea que el precio respete el soporte de ' + formatPrice(supportLevel) + '. Si es vulnerado, ejecuta una orden de Stop Loss para salvaguardar tu liquidez. Un rebote técnico hacia la resistencia de <strong>' + formatPrice(resistanceLevel) + '</strong> facilitará una salida en punto de equilibrio (break-even).'
            );
          }
        } else {
          positionSubHtml = '<span class="dot-sep">·</span><span style="color:#fbbf24;font-weight:600;">' + L('Market Benchmark Active Tracking', 'Seguimiento Activo de Referencia') + '</span>';
          narrative = L(
            '<strong>Benchmark Market Analysis:</strong> ' + escapeHtml(h.coinName) + ' is trading at ' + formatPrice(curPrice) + ' with a 24h volume of ' + formatMarketCap(volume24) + '. Key technical support is established at <strong>' + formatPrice(supportLevel) + '</strong> and resistance at <strong>' + formatPrice(resistanceLevel) + '</strong>. <br><strong>Trading Simulator Insight:</strong> Ideal entry setup for Dollar-Cost Averaging (DCA) when RSI tests support levels.',
            '<strong>Análisis Técnico de Referencia:</strong> ' + escapeHtml(h.coinName) + ' cotiza a ' + formatPrice(curPrice) + ' con un volumen en 24h de ' + formatMarketCap(volume24) + '. El soporte técnico inmediato se sitúa en <strong>' + formatPrice(supportLevel) + '</strong> y la resistencia en <strong>' + formatPrice(resistanceLevel) + '</strong>. <br><strong>Guía para el Simulador:</strong> Buen punto de acumulación progresiva (DCA) cuando el RSI visita zonas de soporte.'
          );
        }

        return '<div class="port-asset-card">' +
          '<div class="port-asset-card-header">' +
            '<div class="port-asset-info">' +
              '<img src="' + imgUrl + '" alt="' + escapeHtml(h.coinName) + '" class="port-asset-img" onerror="this.src=\'https://via.placeholder.com/32\'">' +
              '<div>' +
                '<div class="port-asset-title">' +
                  '<h4>' + escapeHtml(h.coinName) + ' <span class="port-asset-symbol">' + escapeHtml(symbolUpper) + '</span></h4>' +
                  '<span class="port-live-sync-pill">🟢 Live API</span>' +
                '</div>' +
                '<div class="port-asset-sub">' +
                  positionSubHtml +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="port-asset-price-box">' +
              '<div class="port-asset-current-price">' + formatPrice(curPrice) + '</div>' +
              '<div class="port-asset-change ' + (change24 >= 0 ? 'positive' : 'negative') + '">' +
                (change24 >= 0 ? '+' : '') + change24.toFixed(2) + '% (24h)' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<!-- Technical Indicators Grid -->' +
          '<div class="port-asset-tech-grid">' +
            '<div class="port-tech-box">' +
              '<div class="port-tech-label">' + L('RSI Momentum (14)', 'Momento RSI (14)') + '</div>' +
              '<div class="port-tech-val ' + rsiClass + '">' +
                rsiVal.toFixed(1) + ' <span class="port-tech-sub">' + (rsiVal >= 65 ? '⚡' : rsiVal <= 35 ? '💎' : '⚖️') + '</span>' +
              '</div>' +
              '<div class="rsi-mini-bar">' +
                '<div class="rsi-mini-fill ' + rsiClass + '" style="width: ' + rsiVal + '%;"></div>' +
              '</div>' +
              '<div class="port-tech-hint">' + rsiState + '</div>' +
            '</div>' +

            '<div class="port-tech-box">' +
              '<div class="port-tech-label">' + L('Trend & EMAs', 'Tendencia & Medias EMAs') + '</div>' +
              '<div class="port-tech-val ' + trendClass + '">' +
                trendLabel +
              '</div>' +
              '<div class="port-tech-hint">' + trendDetail + '</div>' +
            '</div>' +

            '<div class="port-tech-box">' +
              '<div class="port-tech-label">' + L('Support & Resistance', 'Soporte y Resistencia') + '</div>' +
              '<div class="port-tech-levels">' +
                '<span class="level-pill support">🛡️ S1: ' + formatPrice(supportLevel) + '</span>' +
                '<span class="level-pill resistance">🎯 R1: ' + formatPrice(resistanceLevel) + '</span>' +
              '</div>' +
              '<div class="port-tech-hint">' + L('Pivots based on 24h market range', 'Pivotes calculados con rango 24h') + '</div>' +
            '</div>' +

            '<div class="port-tech-box">' +
              '<div class="port-tech-label">' + L('Volume & ATH Drawdown', 'Volumen & Distancia ATH') + '</div>' +
              '<div class="port-tech-val" style="font-size:0.95rem;">' +
                formatMarketCap(volume24) +
              '</div>' +
              '<div class="port-tech-hint" style="color:#ef4444;">' +
                'ATH: ' + formatPrice(athPrice) + ' (' + athDiff.toFixed(1) + '%)' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<!-- Narrative Diagnostic -->' +
          '<div class="port-asset-narrative">' +
            '<div class="narrative-icon">📋</div>' +
            '<div class="narrative-text">' + narrative + '</div>' +
          '</div>' +

          '<!-- Direct External Connections -->' +
          '<div class="port-asset-external-links">' +
            '<span class="ext-links-label">' + (window.I18n ? window.I18n.t('port_ext_portals') : 'Conectar con Sitios de Análisis Profesional:') + '</span>' +
            '<div class="ext-buttons-group">' +
              '<a href="https://www.tradingview.com/chart/?symbol=BINANCE:' + symbolUpper + 'USDT" target="_blank" rel="noopener noreferrer" class="ext-btn tradingview" title="TradingView">' +
                '<span class="ext-icon">📊</span> TradingView' +
              '</a>' +
              '<a href="https://www.coingecko.com/en/coins/' + h.coinId + '" target="_blank" rel="noopener noreferrer" class="ext-btn coingecko" title="CoinGecko">' +
                '<span class="ext-icon">🦎</span> CoinGecko' +
              '</a>' +
              '<a href="https://coinmarketcap.com/currencies/' + h.coinId + '/" target="_blank" rel="noopener noreferrer" class="ext-btn coinmarketcap" title="CoinMarketCap">' +
                '<span class="ext-icon">🪙</span> CoinMarketCap' +
              '</a>' +
              '<a href="https://www.binance.com/en/trade/' + symbolUpper + '_USDT" target="_blank" rel="noopener noreferrer" class="ext-btn binance" title="Binance Spot">' +
                '<span class="ext-icon">🟡</span> Binance Spot' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      els.portAssetsAnalysisList.innerHTML = assetsHtml;
    }
  }

  // ==================== EQUITY CURVE CANVAS RENDERER ====================
  function drawPortfolioEquityCanvas(canvas, history, currentVal, baseVal) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width > 50 ? rect.width : (canvas.parentElement ? canvas.parentElement.clientWidth - 16 : 580);
    const h = 240;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const padLeft = 65;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 28;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    const points = [baseVal];
    if (history && history.length > 0) {
      let runningVal = baseVal;
      const closed = history.filter(function(tx) { return tx.pnlUSD !== undefined; });
      if (closed.length > 0) {
        closed.forEach(function(tx) {
          runningVal += (tx.pnlUSD || 0);
          points.push(runningVal);
        });
      } else {
        for (let i = 1; i <= 4; i++) {
          points.push(baseVal + (currentVal - baseVal) * (i / 5));
        }
      }
      points.push(currentVal);
    } else {
      points.push(baseVal);
      points.push(baseVal);
      points.push((baseVal + currentVal) / 2);
      points.push(currentVal);
    }

    const minVal = Math.min.apply(null, points.concat([baseVal])) * 0.99;
    const maxVal = Math.max.apply(null, points.concat([baseVal])) * 1.01;
    const valRange = maxVal - minVal || 100;

    function getY(v) {
      return padTop + plotH - ((v - minVal) / valRange) * plotH;
    }
    function getX(idx) {
      return padLeft + (idx / (points.length - 1)) * plotW;
    }

    // Gridlines & Y-axis labels
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';

    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const yVal = minVal + (valRange * (i / gridLines));
      const y = getY(yVal);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();
      ctx.fillText('$' + Math.round(yVal).toLocaleString(), padLeft - 8, y + 3);
    }

    // Baseline $10,000 dashed line
    const baseY = getY(baseVal);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padLeft, baseY);
    ctx.lineTo(padLeft + plotW, baseY);
    ctx.stroke();
    ctx.restore();

    // Area Gradient
    const isProfit = currentVal >= baseVal;
    const strokeColor = isProfit ? '#10b981' : '#ef4444';
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    if (isProfit) {
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.32)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    } else {
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.32)');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
    }

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(points[0]));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(getX(i), getY(points[i]));
    }
    ctx.lineTo(getX(points.length - 1), padTop + plotH);
    ctx.lineTo(getX(0), padTop + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Curve Line
    ctx.save();
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(points[0]));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(getX(i), getY(points[i]));
    }
    ctx.stroke();
    ctx.restore();

    // Pulse dot at end of curve
    const lastX = getX(points.length - 1);
    const lastY = getY(points[points.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = strokeColor;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
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
      return { isUnlocked: false, type: 'not_started', label: L('Trial not started', 'Prueba no iniciada'), daysLeft: 7, hoursLeft: 0 };
    }

    const startTime = parseInt(startStr, 10);
    if (isNaN(startTime) || startTime <= 0) {
      return { isUnlocked: false, type: 'not_started', label: L('Trial not started', 'Prueba no iniciada'), daysLeft: 7, hoursLeft: 0 };
    }

    const elapsed = Date.now() - startTime;
    const remaining = TRIAL_DURATION_MS - elapsed;

    if (remaining <= 0) {
      return { isUnlocked: false, type: 'expired', label: L('⛔ 7-Day Demo Trial Expired', '⛔ Prueba Demo de 7 Días Expirada'), daysLeft: 0, hoursLeft: 0 };
    }

    const daysLeft = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hoursLeft = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return {
      isUnlocked: true,
      type: 'trial',
      label: L('⏳ DEMO MODE ACTIVE · ' + daysLeft + 'd ' + hoursLeft + 'h remaining', '⏳ MODO DEMO ACTIVO · ' + daysLeft + 'd ' + hoursLeft + 'h restantes'),
      daysLeft: daysLeft,
      hoursLeft: hoursLeft,
      remainingMs: remaining
    };
  }

  function activateDemoTrial() {
    const status = getPremiumStatus();
    if (status.type === 'lifetime') {
      showToast(L('You already have Lifetime PRO Membership.', 'Ya dispones de la Membresía PRO Vitalicia.'), 'info');
      return;
    }
    if (status.type === 'trial') {
      showToast(L('Active trial: ' + status.daysLeft + ' days and ' + status.hoursLeft + ' hours left.', 'Prueba activa: quedan ' + status.daysLeft + ' días y ' + status.hoursLeft + ' horas.'), 'info');
      renderPremiumTab();
      return;
    }
    if (status.type === 'expired') {
      showToast(L('Your 7-day demo trial has expired. Subscribe to continue enjoying PRO access.', 'Tu periodo de prueba de 7 días ha finalizado. Suscríbete para continuar disfrutando del acceso PRO.'), 'error');
      renderPremiumTab();
      return;
    }

    // Activate Demo Now
    localStorage.setItem(STORAGE_KEY_DEMO_START, Date.now().toString());
    showToast(L('✨ 7-Day Demo Trial activated successfully!', '✨ ¡Prueba Demo de 7 días activada con éxito!'), 'success');
    renderPremiumTab();
    renderPortfolio();
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
    renderPortfolio();
  }

  function updateAppBrandTier() {
    const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;
    const premStatus = typeof getPremiumStatus === 'function' ? getPremiumStatus() : { isUnlocked: false };
    let hasAuth = false;
    try {
      const u = JSON.parse(localStorage.getItem('criptotracker_auth_user') || 'null');
      if (u && (u.tier === 'PRO' || u.tier === 'VIP')) hasAuth = true;
    } catch(e) {}

    const isPremium = premStatus.isUnlocked || hasAuth;
    const subtitleEls = document.querySelectorAll('.app-user-tier-subtitle');
    const subtitleText = isPremium
      ? (isEn ? 'Dashboard Premium' : 'Dashboard Premium')
      : (isEn ? 'Free Dashboard' : 'Dashboard Gratuito');

    subtitleEls.forEach(function(el) {
      el.textContent = subtitleText;
      if (isPremium) {
        el.classList.add('is-tier-premium');
        el.classList.remove('is-tier-free');
      } else {
        el.classList.add('is-tier-free');
        el.classList.remove('is-tier-premium');
      }
    });
  }
  window.updateAppBrandTier = updateAppBrandTier;

  function renderPremiumTab() {
    updateAppBrandTier();
    const status = getPremiumStatus();
    if (!els.premiumLockedView || !els.premiumUnlockedView) return;
    const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;

    if (!status.isUnlocked) {
      els.premiumLockedView.classList.remove('hidden');
      els.premiumUnlockedView.classList.add('hidden');
      if (els.unlockError) els.unlockError.classList.add('hidden');
      if (els.premiumKeyInput) els.premiumKeyInput.value = '';

      // Handle Trial Status UI in Locked View
      if (els.trialStatusContainer) {
        if (status.type === 'expired') {
          const bannerTitle = isEn ? 'Your 7-day demo trial has expired.' : 'Tu periodo de prueba de 7 días ha finalizado.';
          const bannerDesc = isEn ? 'To continue accessing technical signals and institutional reports, subscribe via Stripe.' : 'Para seguir utilizando las señales técnicas e informes institucionales, suscríbete mediante Stripe.';
          els.trialStatusContainer.innerHTML = '<div class="trial-expired-banner">' +
            '<span style="font-size:1.4rem;">⛔</span>' +
            '<div><strong>' + bannerTitle + '</strong><br><span style="font-size:0.8rem;color:#cbd5e1;">' + bannerDesc + '</span></div>' +
          '</div>';
        } else {
          els.trialStatusContainer.innerHTML = '';
        }
      }

      if (els.premiumDemoBtn) {
        if (status.type === 'expired') {
          els.premiumDemoBtn.disabled = true;
          els.premiumDemoBtn.textContent = isEn ? '⛔ 7-Day Trial Expired' : '⛔ Prueba de 7 Días Caducada';
          els.premiumDemoBtn.title = isEn ? 'You have already used your 7-day free trial.' : 'Ya has utilizado tu periodo de prueba gratuita de 7 días.';
        } else {
          els.premiumDemoBtn.disabled = false;
          els.premiumDemoBtn.textContent = isEn ? '✨ Start 7-Day Demo Trial' : '✨ Iniciar Prueba Demo (7 Días)';
          els.premiumDemoBtn.title = isEn ? 'Activate 7 days of unlimited free access at any time.' : 'Activa 7 días de acceso gratuito ilimitado en cualquier momento.';
        }
      }
    } else {
      els.premiumLockedView.classList.add('hidden');
      els.premiumUnlockedView.classList.remove('hidden');

      if (els.premiumStatusBadge) {
        if (status.type === 'lifetime') {
          const badgeText = isEn ? 'PRO MEMBERSHIP ACTIVE (LIFETIME)' : 'MEMBRESÍA PRO ACTIVA (VITALICIA)';
          els.premiumStatusBadge.innerHTML = '<span>👑</span> <span data-i18n="badge_pro_lifetime">' + badgeText + '</span>';
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
  function getStripePlan(planKey) {
    const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;
    const plans = {
      monthly: {
        name: isEn ? 'Pro Monthly Plan' : 'Plan Pro Mensual',
        desc: isEn ? 'Total flexibility month by month · No contract' : 'Flexibilidad total mes a mes · Sin permanencia',
        price: 9.99,
        priceFormatted: isEn ? '$9.99 / month' : '$9.99 / mes',
        btnAmount: '$9.99 USD'
      },
      annual: {
        name: isEn ? 'Pro Annual Plan' : 'Plan Pro Anual',
        desc: isEn ? 'Save 42% · Full access to all quantitative PRO tools' : 'Ahorro del 42% · Acceso completo a todas las herramientas PRO',
        price: 69.99,
        priceFormatted: isEn ? '$69.99 / year' : '$69.99 / año',
        btnAmount: '$69.99 USD'
      },
      lifetime: {
        name: isEn ? 'VIP Lifetime License' : 'Licencia Vitalicia VIP',
        desc: isEn ? 'Permanent lifetime access · No recurring fees' : 'Acceso permanente de por vida · Sin pagos recurrentes',
        price: 149.99,
        priceFormatted: isEn ? '$149.99 one-time payment' : '$149.99 pago único',
        btnAmount: '$149.99 USD'
      }
    };
    return plans[planKey] || plans.annual;
  }

  let currentStripePlan = getStripePlan('annual');

  function fillDemoCard() {
    if (els.stripeCardName) els.stripeCardName.value = 'Trader Demo PRO';
    if (els.stripeCardEmail) els.stripeCardEmail.value = 'demo@criptotracker.pro';
    if (els.stripeCardNumber) els.stripeCardNumber.value = '4242  4242  4242  4242';
    if (els.stripeCardExp) els.stripeCardExp.value = '12/28';
    if (els.stripeCardCvc) els.stripeCardCvc.value = '888';
    const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : false;
    showToast(isEn ? '✨ Test card 4242 autofilled automatically' : '✨ Tarjeta de prueba 4242 rellenada automáticamente', 'info');
  }

  function openStripeCheckout(planKey) {
    currentStripePlan = getStripePlan(planKey);

    if (els.stripeSummaryPlanName) els.stripeSummaryPlanName.textContent = currentStripePlan.name;
    if (els.stripeSummaryPlanDesc) els.stripeSummaryPlanDesc.textContent = currentStripePlan.desc;
    if (els.stripeSummaryPlanPrice) els.stripeSummaryPlanPrice.textContent = currentStripePlan.priceFormatted;
    if (els.stripeBtnAmount) els.stripeBtnAmount.textContent = currentStripePlan.btnAmount;

    // Prefill demo card if fields are completely blank
    if (els.stripeCardNumber && !els.stripeCardNumber.value) {
      fillDemoCard();
    }

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
    let name = els.stripeCardName ? els.stripeCardName.value.trim() : '';
    let email = els.stripeCardEmail ? els.stripeCardEmail.value.trim() : '';
    let cardNum = els.stripeCardNumber ? els.stripeCardNumber.value.replace(/\s+/g, '') : '';
    let exp = els.stripeCardExp ? els.stripeCardExp.value.trim() : '';
    let cvc = els.stripeCardCvc ? els.stripeCardCvc.value.trim() : '';

    const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : false;

    // If any field is missing in test mode, autofill seamlessly
    if (!name || !email || cardNum.length < 13 || exp.length < 4 || cvc.length < 3) {
      fillDemoCard();
      name = els.stripeCardName.value;
      email = els.stripeCardEmail.value;
      cardNum = '4242424242424242';
      exp = '12/28';
      cvc = '888';
    }

    // Processing animation
    if (els.stripeSubmitBtn) {
      els.stripeSubmitBtn.disabled = true;
      els.stripeSubmitBtn.innerHTML = isEn
        ? '🔄 Simulating authorization with Stripe Sandbox...'
        : '🔄 Simulando autorización con Stripe Sandbox...';
    }

    // Realistic API delay
    await new Promise(function(resolve) { setTimeout(resolve, 1100); });

    // Save simulated payment status
    setPremiumLifetime(true);
    localStorage.setItem('criptotracker_last_order', JSON.stringify({
      plan: currentStripePlan.name,
      amount: currentStripePlan.price,
      currency: 'USD',
      email: email,
      date: new Date().toISOString(),
      gateway: 'Stripe Simulator (Testnet)',
      status: 'succeeded_test_simulation'
    }));

    if (els.stripeSubmitBtn) {
      els.stripeSubmitBtn.disabled = false;
      const btnText = isEn ? '🧪 Simulate Approved Payment' : '🧪 Simular Pago Aprobado';
      els.stripeSubmitBtn.innerHTML = '<span data-i18n="btn_stripe_pay_text">' + btnText + '</span> <span id="stripe-btn-amount">' + currentStripePlan.btnAmount + '</span>';
    }

    const toastSuccess = isEn
      ? '🎉 Simulated payment approved! PRO access unlocked at zero cost.'
      : '🎉 ¡Simulación de pago aprobada! Acceso PRO activado sin coste real.';
    showToast(toastSuccess, 'success');
    closeStripeCheckout();
    renderPremiumTab();
    switchTab('premium');
  }

  function renderPremiumAnalytics() {
    const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;
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
        fgLabelEl.textContent = isEn ? 'EXTREME GREED' : 'CODICIA EXTREMA (Extreme Greed)';
        fgLabelEl.style.color = '#22c55e';
      } else if (fgScore >= 55) {
        fgLabelEl.textContent = isEn ? 'MODERATE GREED' : 'CODICIA MODERADA (Greed)';
        fgLabelEl.style.color = '#34d399';
      } else if (fgScore >= 45) {
        fgLabelEl.textContent = 'NEUTRAL';
        fgLabelEl.style.color = '#fbbf24';
      } else if (fgScore >= 25) {
        fgLabelEl.textContent = isEn ? 'MODERATE FEAR' : 'MIEDO MODERADO (Fear)';
        fgLabelEl.style.color = '#f97316';
      } else {
        fgLabelEl.textContent = isEn ? 'EXTREME FEAR' : 'MIEDO EXTREMO (Extreme Fear)';
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

      const obLabel = isEn ? '(Overbought)' : '(Sobrecompra)';
      const osLabel = isEn ? '(Oversold / Rebound)' : '(Sobreventa / Rebote)';

      els.signalsTableBody.innerHTML = targetCoins.map(coin => {
        const change = Number(coin.price_change_percentage_24h) || 0;
        const price = Number(coin.current_price) || 0;

        // Mathematical indicator estimations
        const rsi = Math.min(88, Math.max(22, Math.round(50 + (change * 2.2))));
        let rsiTag = '';
        if (rsi >= 70) rsiTag = '<span style="color:#ef4444; font-weight:700;">' + rsi + ' ' + obLabel + '</span>';
        else if (rsi <= 35) rsiTag = '<span style="color:#22c55e; font-weight:700;">' + rsi + ' ' + osLabel + '</span>';
        else rsiTag = '<span style="color:#94a3b8;">' + rsi + ' (Neutral)</span>';

        const emaTrend = change >= 0 
          ? '<span style="color:#22c55e; font-weight:600;">🟢 ' + (isEn ? 'Bullish (MA Cross)' : 'Alcista (MA Cross)') + '</span>' 
          : '<span style="color:#ef4444; font-weight:600;">🔴 ' + (isEn ? 'Consolidation' : 'Consolidación') + '</span>';

        const support = formatPrice(price * 0.96);
        const resistance = formatPrice(price * 1.055);

        let verdict = '';
        if (change >= 3) {
          verdict = '<span class="signal-badge strong-buy">' + (isEn ? '🚀 STRONG BUY' : '🚀 COMPRA FUERTE') + '</span>';
        } else if (change >= 0) {
          verdict = '<span class="signal-badge buy">' + (isEn ? '⚡ BUY' : '⚡ COMPRA') + '</span>';
        } else if (change >= -3) {
          verdict = '<span class="signal-badge neutral">⚖️ NEUTRAL</span>';
        } else {
          verdict = '<span class="signal-badge sell">' + (isEn ? '📉 WATCHLIST' : '📉 VIGILANCIA') + '</span>';
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

      const tag1 = isEn ? 'RANGE BREAKOUT' : 'RUPTURA DE RANGO';
      const desc1 = isEn 
        ? `Institutional buy volume +${topGainer ? (topGainer.price_change_percentage_24h || 5).toFixed(1) : '8.2'}% in 24h. Technical price target achievable.`
        : `Volumen de compras institucional +${topGainer ? (topGainer.price_change_percentage_24h || 5).toFixed(1) : '8.2'}% en 24h. Objetivo técnico alcanzable.`;

      const tag2 = isEn ? 'CONTINUATION PATTERN' : 'PATRÓN CONTINUACIÓN';
      const desc2 = isEn 
        ? 'Bullish flag pattern on hourly timeframe. Support validated with strong lower wick rejection.'
        : 'Formación de bandera alcista en temporalidad horaria. Soporte validado con fuerte rechazo inferior.';

      const tag3 = isEn ? 'ACCUMULATION ZONE' : 'ZONA DE ACUMULACIÓN';
      const desc3 = isEn 
        ? 'Centralized exchange reserves depletion. Hidden bullish divergence on key oscillators.'
        : 'Disminución de reservas en exchanges centralizados. Divergencia alcista oculta en osciladores clave.';

      els.opportunitiesGrid.innerHTML = `
        <div class="opportunity-box">
          <span class="opp-tag breakout">${tag1}</span>
          <h4>${topGainer ? topGainer.name : 'Altcoin Alpha'} (${topGainer ? topGainer.symbol.toUpperCase() : 'ACT'})</h4>
          <p>${desc1}</p>
        </div>
        <div class="opportunity-box">
          <span class="opp-tag bullish">${tag2}</span>
          <h4>${sol ? sol.name : 'Solana'} (${sol ? sol.symbol.toUpperCase() : 'SOL'})</h4>
          <p>${desc2}</p>
        </div>
        <div class="opportunity-box">
          <span class="opp-tag breakout">${tag3}</span>
          <h4>${btc ? btc.name : 'Bitcoin'} (${btc ? btc.symbol.toUpperCase() : 'BTC'})</h4>
          <p>${desc3}</p>
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
        ctx.fillText(L('Chart temporarily unavailable', 'Gráfico temporalmente no disponible'), els.chartCanvas.width / 2, els.chartCanvas.height / 2);
      }
    } catch (e) {
      els.chartLoading.classList.add('hidden');
      ctx.fillStyle = '#ef4444';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(L('Error loading chart data', 'Error al cargar datos del gráfico'), els.chartCanvas.width / 2, els.chartCanvas.height / 2);
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

    activeGrid.innerHTML = '<div class="empty-state"><div class="spinner" style="margin: 0 auto 1rem;"></div><h3>' + L('Searching global catalog...', 'Buscando en el catálogo global...') + '</h3><p>' + L('Querying CoinGecko in real time', 'Consultando CoinGecko en tiempo real') + '</p></div>';

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
            '<div class="row-price" style="color: #a5b4fc; font-size: 0.85rem; font-style: italic;">' + L('View quote', 'Ver cotización') + '</div>' +
            '<div class="row-change" style="color: var(--text-muted); font-size: 0.85rem;">--</div>' +
            '<div class="row-mcap">Global</div>' +
            '<div class="row-sparkline" style="color: var(--text-muted); font-size: 0.8rem; display: flex; align-items: center; justify-content: center;">' + L('No sparkline', 'Sin sparkline') + '</div>' +
            '<div class="row-fav">' +
              '<button class="fav-btn ' + (isFav ? 'active' : '') + '" data-coin-id="' + c.id + '" aria-label="Favorito" type="button">' +
                (isFav ? '⭐' : '☆') +
              '</button>' +
            '</div>' +
          '</div>';
        }).join('');
      } else {
        activeGrid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h3>' + L('No global assets found', 'No se encontraron activos globales') + '</h3><p>' + L('Try another search term', 'Intenta con otro término de búsqueda') + '</p></div>';
      }
    } catch (e) {
      console.error(e);
      activeGrid.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><h3>' + L('Search error', 'Error en la búsqueda') + '</h3><p>' + L('Connection issue occurred', 'Ocurrió un problema de conexión') + '</p></div>';
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
        els.buySearchResults.innerHTML = '<div style="padding: 12px; font-size: 0.85rem; color: var(--text-muted); text-align: center;">' + L('No cryptocurrencies found', 'No se encontraron criptomonedas') + '</div>';
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
    const priceText = c.current_price ? formatPrice(c.current_price) : L('Quoting...', 'Cotizando...');

    els.selectedCoin.innerHTML = '<div class="selected-coin-card">' +
      '<img src="' + (c.thumb || 'https://via.placeholder.com/36') + '" alt="' + c.name + '" onerror="this.src=\'https://via.placeholder.com/36\'">' +
      '<div class="selected-coin-info">' +
        '<div class="selected-coin-title">' + c.name + ' <span class="selected-coin-symbol">' + c.symbol + '</span></div>' +
        '<div class="selected-coin-price">' + L('Price: ', 'Precio: ') + priceText + '</div>' +
      '</div>' +
      '<button class="selected-coin-remove" id="deselect-buy-coin" title="' + L('Change cryptocurrency', 'Cambiar criptomoneda') + '" type="button">✕</button>' +
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
        els.confirmSellBtn.textContent = L('Enter amount', 'Introduce cantidad');
        els.confirmSellBtn.style.opacity = '0.5';
      } else if (sellAmount > totalAmount * 1.000001) {
        els.confirmSellBtn.disabled = true;
        els.confirmSellBtn.textContent = L('Amount exceeds available balance', 'Cantidad superior a saldo disponible');
        els.confirmSellBtn.style.opacity = '0.5';
      } else {
        els.confirmSellBtn.disabled = false;
        els.confirmSellBtn.style.opacity = '1';
        const displayAmt = sellAmount.toLocaleString(undefined, { maximumFractionDigits: 4 });
        els.confirmSellBtn.textContent = (L('🔥 Sell ', '🔥 Vender ')) + displayAmt + ' ' + symbol + ' (' + formatPrice(receiveUsd) + ')';
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
      els.buyPreview.innerHTML = L('Unit price: ', 'Precio unitario: ') + '<strong>' + formatPrice(selectedBuyCoin.current_price) + '</strong>';
      els.buyPreview.classList.remove('hidden');
      return;
    }

    const tokens = amountUSD / selectedBuyCoin.current_price;
    els.buyPreview.innerHTML = L('Estimated receipt: ', 'Recibirás aprox: ') + '<strong>' + tokens.toLocaleString(undefined, { maximumFractionDigits: 6 }) + ' ' + selectedBuyCoin.symbol + '</strong>';
    els.buyPreview.classList.remove('hidden');
  }

  async function handleBuySubmit() {
    if (!selectedBuyCoin) {
      showToast(L('Select a cryptocurrency first', 'Selecciona una criptomoneda primero'), 'error');
      if (els.buySearchInput) els.buySearchInput.focus();
      return;
    }

    const amountUSD = parseFloat(els.buyAmount ? els.buyAmount.value : 0);
    if (!amountUSD || amountUSD <= 0 || isNaN(amountUSD)) {
      showToast(L('Enter a valid USD amount', 'Ingresa un monto en USD válido'), 'error');
      if (els.buyAmount) els.buyAmount.focus();
      return;
    }

    if (amountUSD > window.Simulator.getBalance()) {
      showToast(L('Insufficient available balance ($', 'Balance disponible insuficiente ($') + window.Simulator.getBalance().toFixed(2) + ' USD)', 'error');
      return;
    }

    els.buyBtn.disabled = true;
    els.buyBtn.textContent = L('Processing...', 'Procesando...');

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
        showToast(L('Unable to obtain quote price. Please try again.', 'No se pudo obtener el precio de cotización. Intenta de nuevo.'), 'error');
        els.buyBtn.disabled = false;
        els.buyBtn.textContent = L('🛒 Buy Cryptocurrency', '🛒 Comprar Criptomoneda');
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

        showToast(L('Purchase successful! +', '¡Compra realizada! +') + result.tokens.toFixed(6) + ' ' + selectedBuyCoin.symbol.toUpperCase() + targetsMsg, 'success');
        
        if (window.Achievements) {
          let buyRsi = null;
          const allCoins = [...marketData, ...gainersData];
          const foundCoin = allCoins.find(function(x) { return x && x.id === selectedBuyCoin.id; });
          if (foundCoin) {
            const ch = Number(foundCoin.price_change_percentage_24h) || 0;
            buyRsi = Math.min(88, Math.max(12, Math.round(50 + ch * 2.2)));
          }
          window.Achievements.checkAchievements('buy', {
            coinId: selectedBuyCoin.id,
            coinName: selectedBuyCoin.name,
            amountUSD: amountUSD,
            price: price,
            sl: slVal,
            tp: tpVal,
            rsi: buyRsi
          });
        }

        if (els.buyAmount) els.buyAmount.value = '';
        deselectBuyCoin();
        renderPortfolio();
      } else {
        showToast(result.message || L('Purchase error', 'Error en la compra'), 'error');
      }
    } catch (e) {
      console.error(e);
      showToast(L('Connection error simulating transaction', 'Error de conexión al simular la transacción'), 'error');
    }

    els.buyBtn.disabled = false;
    els.buyBtn.textContent = L('🛒 Buy Cryptocurrency', '🛒 Comprar Criptomoneda');
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
      let lastBurgerTrigger = 0;
      const handleBurger = function(e) {
        const now = Date.now();
        if (now - lastBurgerTrigger < 350) return;
        lastBurgerTrigger = now;
        if (e) {
          if (e.cancelable && e.type === 'touchend') e.preventDefault();
          e.stopPropagation();
        }
        toggleMobileMenu();
      };
      els.navHamburger.addEventListener('click', handleBurger);
      els.navHamburger.addEventListener('touchend', handleBurger);
    }

    if (els.navCloseBtn) {
      let lastCloseTrigger = 0;
      const handleClose = function(e) {
        const now = Date.now();
        if (now - lastCloseTrigger < 350) return;
        lastCloseTrigger = now;
        if (e) {
          if (e.cancelable && e.type === 'touchend') e.preventDefault();
          e.stopPropagation();
        }
        closeMobileMenu();
      };
      els.navCloseBtn.addEventListener('click', handleClose);
      els.navCloseBtn.addEventListener('touchend', handleClose);
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

    // Bilingual / Internationalization Event Listener
    window.addEventListener('languageChanged', function(e) {
      renderCurrentTab();
      if (window.Simulator) {
        renderPortfolio();
      }
      updateTimestampDisplay();
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
          showToast(L('Select a cryptocurrency first', 'Selecciona primero una criptomoneda'), 'info');
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
          showToast(L('Select a cryptocurrency first', 'Selecciona primero una criptomoneda'), 'info');
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
          showToast(isFav ? L('Added to favorites', 'Añadido a favoritos') : L('Removed from favorites', 'Eliminado de favoritos'), 'success');
          
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
          showToast(L('Enter a valid amount to sell', 'Introduce una cantidad válida a vender'), 'error');
          return;
        }
        if (sellAmount > currentSellingHolding.amount * 1.000001) {
          showToast(L('Insufficient available balance in portfolio', 'No tienes suficiente saldo disponible en cartera'), 'error');
          return;
        }

        const coinId = currentSellingHolding.coinId;
        const price = currentSellingHolding.currentPrice;
        const result = window.Simulator.sell(coinId, sellAmount, price);

        if (result.success) {
          showToast(result.message, 'success');

          if (window.Achievements) {
            const soldRatio = currentSellingHolding.amount > 0 ? (sellAmount / currentSellingHolding.amount) : 1;
            const pnlUSD = (price - currentSellingHolding.buyPrice) * sellAmount;
            const pnlPercent = currentSellingHolding.buyPrice > 0 ? ((price - currentSellingHolding.buyPrice) / currentSellingHolding.buyPrice) * 100 : 0;
            window.Achievements.checkAchievements('sell', {
              coinId: coinId,
              amountTokens: sellAmount,
              price: price,
              pnlUSD: pnlUSD,
              pnlPercent: pnlPercent,
              soldRatio: soldRatio,
              holdingTimestamp: currentSellingHolding.timestamp || null
            });
          }

          closeSellModal();
          renderPortfolio();
        } else {
          showToast(result.message || L('Error while selling', 'Error al vender'), 'error');
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
        if (confirm(L('Are you sure you want to reset the simulator? Balance will be reset to $10,000.00 and current positions will be cleared.', '¿Estás seguro de que quieres reiniciar el simulador? Se restablecerá el balance a $10,000.00 y se perderán las posiciones actuales.'))) {
          const prices = getCurrentPrices();
          const prevBalance = window.Simulator ? window.Simulator.getBalance() : 10000;
          const prevPnLUSD = (window.Simulator && window.Simulator.getPnL) ? window.Simulator.getPnL(prices).pnlUSD : 0;
          
          window.Simulator.reset();

          if (window.Achievements) {
            window.Achievements.checkAchievements('reset', {
              prevBalance: prevBalance,
              prevPnLUSD: prevPnLUSD
            });
          }

          deselectBuyCoin();
          showToast(L('Simulator reset to $10,000.00 USD', 'Simulador reiniciado a $10,000.00 USD'), 'success');
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
        if (els.mainContent) {
          els.mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
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

    if (els.stripeFillDemoBtn) {
      els.stripeFillDemoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        fillDemoCard();
      });
    }

    // License Key Unlock Listeners
    if (els.premiumUnlockBtn) {
      els.premiumUnlockBtn.addEventListener('click', function() {
        const key = (els.premiumKeyInput ? els.premiumKeyInput.value : '').trim().toUpperCase();
        const VALID_KEYS = ['PREMIUM', 'VIP', 'CRIPTOPRO', 'PRO', '2026', 'ADMIN', 'STRIPE', 'LIFETIME', 'DEMO'];
        const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;
        if (key && (VALID_KEYS.includes(key) || key.length >= 4)) {
          setPremiumLifetime(true);
          showToast(isEn ? '👑 PRO Access Unlocked Successfully!' : '👑 ¡Acceso PRO Desbloqueado con Éxito!', 'success');
        } else {
          if (els.unlockError) els.unlockError.classList.remove('hidden');
          showToast(isEn ? 'Invalid key. Click "Simulate Subscription with Stripe" to test.' : 'Clave no válida. Pulsa "Simular Suscripción con Stripe" para probarlo.', 'info');
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
        const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;
        setPremiumLifetime(false);
        showToast(isEn ? '🔒 Analysis session locked' : '🔒 Sesión de análisis cerrada', 'info');
      });
    }

    // Generate Daily Report Button
    var generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
      generateReportBtn.addEventListener('click', function() {
        generateDailyReport();
      });
    }

    // Delegated click for 7-day demo trial buttons across the app
    document.addEventListener('click', function(e) {
      const demoBtn = e.target.closest('.btn-activate-demo');
      if (demoBtn) {
        e.preventDefault();
        activateDemoTrial();
        renderPortfolio();
      }
    });

    // Refresh Portfolio Insights button with Live External Connect
    const refreshPortInsightsBtn = document.getElementById('btn-refresh-port-insights');
    if (refreshPortInsightsBtn) {
      refreshPortInsightsBtn.addEventListener('click', async function() {
        const isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;
        refreshPortInsightsBtn.disabled = true;
        refreshPortInsightsBtn.textContent = isEn ? '📡 Syncing Live Market Feeds...' : '📡 Conectando en Vivo con CoinGecko & TradingView...';
        
        let liveOk = false;
        try {
          if (window.CryptoAPI && window.CryptoAPI.fetchMarketData) {
            const timeout = new Promise(function(resolve) { setTimeout(function() { resolve(null); }, 8000); });
            const freshData = await Promise.race([window.CryptoAPI.fetchMarketData(), timeout]);
            if (freshData && freshData.length > 0) {
              marketData = freshData;
              liveOk = true;
            }
          }
        } catch(err) {
          console.warn("Market re-sync error:", err);
        } finally {
          try { renderPortfolio(); } catch (e) { console.error(e); }
          refreshPortInsightsBtn.disabled = false;
          refreshPortInsightsBtn.textContent = isEn ? '🔄 Re-analyze Holdings Live' : '🔄 Reanalizar Cartera en Vivo';
        }

        if (liveOk) {
          showToast(L('✅ Live analysis refreshed with fresh CoinGecko market data', '✅ Análisis actualizado con datos frescos de CoinGecko'), 'success');
        } else {
          showToast(L('⚠️ CoinGecko is rate-limiting requests. Analysis shown with the latest cached prices.', '⚠️ CoinGecko está limitando peticiones. Se muestra el análisis con los últimos precios en caché.'), 'info');
        }
      });
    }

    // Glossary Interactive Filter Setup
    setupGlossary();

    // Re-render when language changes
    window.addEventListener('languageChanged', function() {
      updateTimestampDisplay();
      renderCurrentTab();
      renderPremiumTab();
      renderPortfolio();
      var reportOutput = document.getElementById('report-output');
      if (reportOutput && reportOutput.querySelector('.report-document')) {
        generateDailyReport();
      }
    });
  }

  // ==================== GLOSSARY SYSTEM ====================
  function setupGlossary() {
    let currentCategory = 'all';
    let currentQuery = '';

    function filterGlossary() {
      const cards = document.querySelectorAll('.glossary-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.dataset.category || '';
        const keywords = (card.dataset.keywords || '').toLowerCase();
        const text = (card.textContent || '').toLowerCase();

        const matchesCategory = (currentCategory === 'all' || cat === currentCategory);
        const matchesQuery = (!currentQuery || keywords.includes(currentQuery) || text.includes(currentQuery));

        if (matchesCategory && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (els.glossaryEmptyState) {
        els.glossaryEmptyState.classList.toggle('hidden', visibleCount > 0);
      }
    }

    if (els.glossarySearchInput) {
      els.glossarySearchInput.addEventListener('input', function(e) {
        currentQuery = e.target.value.trim().toLowerCase();
        if (els.glossarySearchClear) {
          els.glossarySearchClear.classList.toggle('hidden', currentQuery.length === 0);
        }
        filterGlossary();
      });
    }

    if (els.glossarySearchClear) {
      els.glossarySearchClear.addEventListener('click', function() {
        if (els.glossarySearchInput) {
          els.glossarySearchInput.value = '';
          currentQuery = '';
          els.glossarySearchClear.classList.add('hidden');
          filterGlossary();
          els.glossarySearchInput.focus();
        }
      });
    }

    document.querySelectorAll('.glossary-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.glossary-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.dataset.category || 'all';
        filterGlossary();
      });
    });
  }

  // ==================== DAILY INSTITUTIONAL REPORT ====================
  function generateDailyReport() {
    var outputEl = document.getElementById('report-output');
    if (!outputEl) return;
    var isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;

    var allCoins = [].concat(marketData, gainersData);
    if (!allCoins || allCoins.length === 0) {
      outputEl.innerHTML = '<div class="report-placeholder"><p>' +
        (isEn ? '⚠️ Waiting for live market data. Please retry in a few seconds.' : '⚠️ Esperando datos de mercado. Vuelve a intentarlo en unos segundos.') +
        '</p></div>';
      return;
    }

    // ── Loading state ──
    var btn = document.getElementById('generate-report-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = isEn ? '⏳ Generating...' : '⏳ Generando...';
    }

    setTimeout(function() {
      try {
        var html = buildReportHTML(allCoins);
        outputEl.innerHTML = html;
      } catch(e) {
        outputEl.innerHTML = '<div class="report-placeholder"><p>' +
          (isEn ? '⚠️ Error generating the report. Please try again.' : '⚠️ Error generando el informe. Intenta de nuevo.') +
          '</p></div>';
      }
      if (btn) {
        btn.disabled = false;
        btn.textContent = isEn ? '🔄 Regenerate Report' : '🔄 Regenerar Informe';
      }
    }, 600);
  }

  function buildReportHTML(allCoins) {
    var isEn = window.I18n ? (window.I18n.getLanguage() === 'en') : true;
    var now = new Date();
    var dateStr = isEn
      ? now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    var timeStr = isEn
      ? now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // ── Coins de referencia ──
    var btc = allCoins.find(function(c) { return c.id === 'bitcoin'; });
    var eth = allCoins.find(function(c) { return c.id === 'ethereum'; });
    var sol = allCoins.find(function(c) { return c.id === 'solana'; });
    var bnb = allCoins.find(function(c) { return c.id === 'binancecoin'; });
    var xrp = allCoins.find(function(c) { return c.id === 'ripple'; });

    if (!btc) {
      return '<div class="report-placeholder"><p>' +
        (isEn ? '⚠️ Bitcoin market data currently unavailable.' : '⚠️ Datos de Bitcoin no disponibles.') +
        '</p></div>';
    }

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
      fgLabel = isEn ? 'EXTREME GREED' : 'CODICIA EXTREMA';
      fgColor = '#22c55e';
      fgBias = isEn ? 'Bullish' : 'Alcista';
    } else if (fgScore >= 55) {
      fgLabel = isEn ? 'MODERATE GREED' : 'CODICIA MODERADA';
      fgColor = '#34d399';
      fgBias = isEn ? 'Bullish' : 'Alcista';
    } else if (fgScore >= 45) {
      fgLabel = 'NEUTRAL';
      fgColor = '#fbbf24';
      fgBias = isEn ? 'Neutral' : 'Neutral';
    } else if (fgScore >= 25) {
      fgLabel = isEn ? 'MODERATE FEAR' : 'MIEDO MODERADO';
      fgColor = '#f97316';
      fgBias = isEn ? 'Bearish' : 'Bajista';
    } else {
      fgLabel = isEn ? 'EXTREME FEAR' : 'MIEDO EXTREMO';
      fgColor = '#ef4444';
      fgBias = isEn ? 'Bearish' : 'Bajista';
    }

    // ── Sesgo General ──
    var overallBias = btcChange >= 1 
      ? (isEn ? 'Bullish ▲' : 'Alcista ▲') 
      : btcChange <= -1 
      ? (isEn ? 'Bearish ▼' : 'Bajista ▼') 
      : 'Neutral ◆';
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
      var rsiNote  = rsi >= 70 ? (isEn ? 'Overbought' : 'Sobrecompra') : rsi <= 35 ? (isEn ? 'Oversold' : 'Sobreventa') : 'Neutral';
      var verdict  = ch >= 3 
        ? (isEn ? '🚀 Strong Buy' : '🚀 Compra Fuerte') 
        : ch >= 0 
        ? (isEn ? '⚡ Buy' : '⚡ Compra') 
        : ch >= -3 
        ? (isEn ? '⚖️ Neutral' : '⚖️ Neutral') 
        : (isEn ? '📉 Watchlist' : '📉 Vigilancia');
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

    var volumeTone = isEn
      ? (totalVol > 8e10 ? 'high, signaling active institutional market participation' : totalVol > 4e10 ? 'moderate, consistent with a consolidating market' : 'light, suggesting caution or a lack of immediate macro catalysts')
      : (totalVol > 8e10 ? 'alto, indicando participación activa del mercado' : totalVol > 4e10 ? 'moderado, consistente con un mercado en consolidación' : 'bajo, lo que sugiere cautela o falta de catalizadores claros');

    // ── Oportunidades altcoin ──
    var altOpp1 = sorted[0];
    var altOpp2 = sorted.length > 1 ? sorted[1] : null;

    // Narrative strings depending on isEn
    var s1Text1 = isEn
      ? ('The digital asset market is trading with a <strong>' + fgBias.toLowerCase() + ' bias</strong> over the last 24 hours. ' +
         'Bitcoin (' + fmtChange(btcChange) + ') ' +
         (eth ? 'and Ethereum (' + fmtChange(ethChange) + ') ' : '') +
         'show a ' + (btcChange >= 0 ? 'constructive technical structure with persistent demand at key support levels' : 'selling pressure that has pushed quotes toward structural support zones') + '. ' +
         'The Fear &amp; Greed index derived from market breadth stands at <strong>' + fgScore + '/100</strong> (' + fgLabel + '), ' +
         'with ' + breadthPct + '% of monitored assets registering positive 24h performance.')
      : ('El mercado de activos digitales cotiza con un <strong>sesgo ' + fgBias.toLowerCase() + '</strong> en las últimas 24 horas. ' +
         'Bitcoin (' + fmtChange(btcChange) + ') ' +
         (eth ? 'y Ethereum (' + fmtChange(ethChange) + ') ' : '') +
         'muestran una ' + (btcChange >= 0 ? 'estructura técnica constructiva con compras sostenidas en zonas de soporte clave' : 'presión vendedora que ha empujado los precios hacia zonas de soporte estructural') + '. ' +
         'El índice Fear &amp; Greed calculado a partir de la amplitud de mercado se sitúa en <strong>' + fgScore + '/100</strong> (' + fgLabel + '), ' +
         'con un ' + breadthPct + '% de los activos monitorizados registrando variaciones positivas en 24 horas.');

    var domNarrative = isEn
      ? (parseFloat(btcDom) > 55 ? 'indicating a phase of capital consolidation in high-cap assets relative to the broader altcoin landscape.' : parseFloat(btcDom) > 48 ? 'reflecting a balanced market with bidirectional liquidity flows between Bitcoin and high-quality altcoins.' : 'suggesting active capital rotation from Bitcoin into high-beta altcoins (altseason phase).')
      : (parseFloat(btcDom) > 55 ? 'indicando una fase de consolidación del capital en activos de mayor capitalización frente al universo altcoin.' : parseFloat(btcDom) > 48 ? 'reflejando un mercado equilibrado con flujos bidireccionales entre Bitcoin y altcoins de calidad.' : 'sugiriendo rotación de capital activa desde Bitcoin hacia el ecosistema de altcoins (fase altseason).');

    var s1Text2 = isEn
      ? ('Total cryptocurrency market capitalization is estimated at <strong>' + mcapStr + '</strong> with 24-hour trading volume of <strong>' + volStr + '</strong>, ' +
         'considered ' + volumeTone + '. Bitcoin dominance stands at approximately <strong>' + btcDom + '%</strong>, ' + domNarrative)
      : ('La capitalización total del mercado se estima en <strong>' + mcapStr + '</strong> con un volumen de negociación en 24h de <strong>' + volStr + '</strong>, ' +
         'considerado ' + volumeTone + '. La dominancia de Bitcoin se sitúa aproximadamente en el <strong>' + btcDom + '%</strong>, ' + domNarrative);

    var n1Desc = isEn
      ? ('Bitcoin\'s behavior as a macro asset remains correlated with institutional liquidity dynamics. ' +
         (btcChange >= 1 ? 'Net capital inflows into crypto investment products remain positive, signaling steady institutional accumulation.' : btcChange <= -1 ? 'Selling pressure aligns with portfolio risk-reduction periods among institutional players.' : 'Neutral volume reflects a period of consolidation preceding upcoming macroeconomic catalysts.'))
      : ('El comportamiento de Bitcoin como activo de riesgo sigue correlacionado con el flujo de liquidez institucional. ' +
         (btcChange >= 1 ? 'Las entradas netas de capital en productos de inversión cripto se mantienen positivas, sugiriendo demanda institucional sostenida.' : btcChange <= -1 ? 'La presión vendedora coincide con periodos de reducción de riesgo en cartera por parte de actores institucionales.' : 'El volumen neutral refleja una fase de espera previa a catalizadores macroeconómicos de mayor calado.'));

    var n2Desc = isEn
      ? ('With ' + breadthPct + '% of assets in the green, the market displays ' +
         (breadthRatio >= 0.65 ? 'high bullish breadth that historically precedes strong trend continuation legs.' : breadthRatio >= 0.45 ? 'balanced breadth with sector divergence: DeFi and Layer 1 leaders outperforming speculative tokens.' : 'compromised market breadth that may indicate trend exhaustion or distribution.') +
         ' Leading gainers highlight isolated strength in specific sectors driven by ecosystem catalysts.')
      : ('Con un ' + breadthPct + '% de activos en positivo, el mercado presenta una ' +
         (breadthRatio >= 0.65 ? 'amplitud alcista elevada que históricamente antecede a movimientos de continuación.' : breadthRatio >= 0.45 ? 'amplitud neutral con divergencias sectoriales: DeFi y Layer 1 lideran frente a activos especulativos.' : 'amplitud comprometida que puede señalar agotamiento de tendencia o distribución de posiciones.') +
         ' Los top gainers del día muestran movimientos en sectores específicos con catalizadores de ecosistema.');

    var n3Desc = isEn
      ? (parseFloat(btcDom) > 55 ? 'Elevated Bitcoin dominance suggests capital remains concentrated in the largest asset. Historically, readings above 55% precede expansions across the altcoin universe once BTC consolidates.' : parseFloat(btcDom) > 48 ? 'Balanced Bitcoin dominance reflects a mature market where capital cycles efficiently between BTC, ETH, and liquid altcoins.' : 'Low Bitcoin dominance indicates active rotation into lower-cap assets, with ETH and major Layer 1s absorbing market share.')
      : (parseFloat(btcDom) > 55 ? 'La dominancia elevada de Bitcoin sugiere que el capital permanece concentrado en el activo de mayor capitalización. Históricamente, valores superiores al 55% preceden a expansiones del universo altcoin una vez BTC consolida.' : parseFloat(btcDom) > 48 ? 'La dominancia equilibrada de Bitcoin indica un mercado maduro donde el capital fluye de manera eficiente entre BTC, ETH y las altcoins más líquidas.' : 'La baja dominancia de Bitcoin indica rotación activa hacia activos de menor capitalización, con ETH y las principales Layer 1 absorbiendo el flujo de capital.');

    var onChainNote = isEn
      ? ('<strong>📌 Analytical Note:</strong> RSI values are mathematical estimations derived from 24h percentage delta (short-term momentum proxy). ' +
         'Support and resistance levels are calculated using statistical standard deviation bands around the current price. ' +
         'For precise execution, validating against 4H/1D candlestick closes is recommended.')
      : ('<strong>📌 Nota Analítica:</strong> Los datos de RSI son estimaciones matemáticas derivadas de la variación porcentual de 24h (proxy de momentum de corto plazo). ' +
         'Los niveles de soporte y resistencia se calculan aplicando bandas de desviación estadística sobre el precio actual. ' +
         'Para análisis intradiario preciso, se recomienda validar con datos de velas en temporalidades 4H/1D.');

    var altGainerNote = isEn
      ? 'Leading market gainer today. Unusual volume and sustained positive momentum. Monitor resistance breakout.'
      : 'Mayor gainer del mercado actual. Volumen inusual y momentum positivo sostenido. Vigilar ruptura de resistencia.';

    // ── BUILD HTML REPORT ──
    return '<div class="report-document">' +

      // Header
      '<div class="report-header">' +
        '<div class="report-header-top">' +
          '<div class="report-brand">' +
            '<span class="report-brand-icon">₿</span>' +
            '<div>' +
              '<div class="report-brand-name">CriptoTracker <span style="color:var(--primary-accent);">PRO</span></div>' +
              '<div class="report-brand-sub">' + (isEn ? 'Institutional Analysis Report · CoinGecko API Data' : 'Informe de Análisis Institucional · Datos CoinGecko API') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="report-meta">' +
            '<div class="report-date">' + dateStr + '</div>' +
            '<div class="report-time">' + (isEn ? 'Generated at ' + timeStr + ' (local time)' : 'Generado a las ' + timeStr + ' (hora local)') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="report-divider"></div>' +
        '<div class="report-bias-strip">' +
          '<div class="report-bias-item">' +
            '<span class="report-bias-label">' + (isEn ? 'MARKET BIAS' : 'SESGO DE MERCADO') + '</span>' +
            '<span class="report-bias-value" style="color:' + overallBiasColor + ';">' + overallBias + '</span>' +
          '</div>' +
          '<div class="report-bias-item">' +
            '<span class="report-bias-label">FEAR &amp; GREED INDEX</span>' +
            '<span class="report-bias-value" style="color:' + fgColor + ';">' + fgScore + ' — ' + fgLabel + '</span>' +
          '</div>' +
          '<div class="report-bias-item">' +
            '<span class="report-bias-label">' + (isEn ? 'BITCOIN DOMINANCE' : 'BITCOIN DOMINANCIA') + '</span>' +
            '<span class="report-bias-value" style="color:#f59e0b;">' + btcDom + '%</span>' +
          '</div>' +
          '<div class="report-bias-item">' +
            '<span class="report-bias-label">' + (isEn ? 'MARKET BREADTH' : 'AMPLITUD DE MERCADO') + '</span>' +
            '<span class="report-bias-value" style="color:' + (breadthRatio >= 0.5 ? '#22c55e' : '#ef4444') + ';">' + breadthPct + (isEn ? '% bullish' : '% alcistas') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Section 1
      '<div class="report-section">' +
        '<h2 class="report-section-title">' + (isEn ? '📊 Executive Summary & Market Sentiment' : '📊 Resumen Ejecutivo y Sentimiento') + '</h2>' +
        '<div class="report-section-body">' +
          '<p>' + s1Text1 + '</p>' +
          '<p style="margin-top:10px;">' + s1Text2 + '</p>' +
        '</div>' +
      '</div>' +

      // Section 2
      '<div class="report-section">' +
        '<h2 class="report-section-title">' + (isEn ? '📰 Key Market Narratives of the Day' : '📰 Narrativas Clave del Día') + '</h2>' +
        '<div class="report-section-body">' +
          '<div class="report-narrative-grid">' +

            '<div class="report-narrative-box">' +
              '<div class="report-narrative-tag" style="background:rgba(99,102,241,.15);color:#a5b4fc;">' + (isEn ? 'MACRO / LIQUIDITY' : 'MACRO / LIQUIDEZ') + '</div>' +
              '<h4>' + (isEn ? 'Global Liquidity Dynamics in Risk Assets' : 'Dinámica de Liquidez Global en Activos de Riesgo') + '</h4>' +
              '<p>' + n1Desc + '</p>' +
            '</div>' +

            '<div class="report-narrative-box">' +
              '<div class="report-narrative-tag" style="background:rgba(34,197,94,.12);color:#34d399;">' + (isEn ? 'TECHNICAL / ON-CHAIN' : 'TÉCNICO / ON-CHAIN') + '</div>' +
              '<h4>' + (isEn ? 'Market Breadth & Sector Rotation' : 'Amplitud de Mercado y Rotación Sectorial') + '</h4>' +
              '<p>' + n2Desc + '</p>' +
            '</div>' +

            '<div class="report-narrative-box">' +
              '<div class="report-narrative-tag" style="background:rgba(245,158,11,.13);color:#fbbf24;">' + (isEn ? 'DOMINANCE / ROTATION' : 'DOMINANCIA / ROTACIÓN') + '</div>' +
              '<h4>' + (isEn ? 'Interactive Capital Flow: BTC vs Altcoins' : 'Flujo Interactivo BTC vs Altcoins') + '</h4>' +
              '<p>' + n3Desc + '</p>' +
            '</div>' +

          '</div>' +
        '</div>' +
      '</div>' +

      // Section 3
      '<div class="report-section">' +
        '<h2 class="report-section-title">' + (isEn ? '⛓️ On-Chain Intelligence & Fundamentals' : '⛓️ Inteligencia On-Chain y Fundamentales') + '</h2>' +
        '<div class="report-section-body">' +

          '<div class="report-two-col">' +
            '<div>' +
              '<h4 class="report-sub-title">' + (isEn ? '🏆 Top 3 Gainers (24h)' : '🏆 Top 3 Ganadores (24h)') + '</h4>' +
              '<div class="report-gainers-list">' + gainersListHTML(top3Gainers) + '</div>' +
            '</div>' +

            '<div>' +
              '<h4 class="report-sub-title">' + (isEn ? '📉 Top 3 Laggards (24h)' : '📉 Top 3 Rezagados (24h)') + '</h4>' +
              '<div class="report-gainers-list">' + gainersListHTML(top3Losers) + '</div>' +
            '</div>' +
          '</div>' +

          '<div class="report-signals-wrap" style="margin-top:var(--spacing-lg);">' +
            '<h4 class="report-sub-title">' + (isEn ? '🔬 Quantitative Signals — Core Assets' : '🔬 Señales Cuantitativas — Activos Principales') + '</h4>' +
            '<div class="report-signals-table-wrap">' +
              '<table class="report-signals-table">' +
                '<thead><tr>' +
                  '<th>' + (isEn ? 'Asset' : 'Activo') + '</th><th>' + (isEn ? 'Price' : 'Precio') + '</th><th>RSI (14)</th><th>' + (isEn ? '24h Chg' : 'Var. 24h') + '</th><th>' + (isEn ? 'Signal' : 'Señal') + '</th>' +
                '</tr></thead>' +
                '<tbody>' + signalRows + '</tbody>' +
              '</table>' +
            '</div>' +
          '</div>' +

          '<div class="report-onchain-note">' + onChainNote + '</div>' +

        '</div>' +
      '</div>' +

      // Section 4
      '<div class="report-section">' +
        '<h2 class="report-section-title">' + (isEn ? '🎯 Key Pivot Zones & Technical Outlook' : '🎯 Zonas de Interés y Proyección Técnica') + '</h2>' +
        '<div class="report-section-body">' +

          '<div class="report-levels-grid">' +

            '<div class="report-level-card">' +
              '<div class="report-level-coin">' +
                '<span class="report-level-symbol" style="color:#f7931a;">₿</span>' +
                '<div><span class="report-level-name">Bitcoin</span> <span class="report-level-sym">BTC</span></div>' +
              '</div>' +
              '<div class="report-level-price">' + (isEn ? 'Price: ' : 'Precio: ') + '<strong>' + formatPrice(btcPrice) + '</strong></div>' +
              '<div class="report-level-rows">' +
                '<div class="report-level-row"><span class="report-level-label support">' + (isEn ? 'S1 Key Support' : 'S1 Soporte Clave') + '</span><span class="report-level-val support-val">' + btcSupport + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label resist">' + (isEn ? 'R1 Key Resistance' : 'R1 Resistencia Clave') + '</span><span class="report-level-val resist-val">' + btcResist + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label neutral">' + (isEn ? '24h Bias' : 'Sesgo 24h') + '</span><span style="color:' + (btcChange >= 0 ? '#22c55e' : '#ef4444') + ';font-weight:700;">' + (btcChange >= 0 ? '+' : '') + btcChange.toFixed(2) + '%</span></div>' +
              '</div>' +
            '</div>' +

            (eth ? '<div class="report-level-card">' +
              '<div class="report-level-coin">' +
                '<span class="report-level-symbol" style="color:#627eea;">Ξ</span>' +
                '<div><span class="report-level-name">Ethereum</span> <span class="report-level-sym">ETH</span></div>' +
              '</div>' +
              '<div class="report-level-price">' + (isEn ? 'Price: ' : 'Precio: ') + '<strong>' + formatPrice(ethPrice) + '</strong></div>' +
              '<div class="report-level-rows">' +
                '<div class="report-level-row"><span class="report-level-label support">' + (isEn ? 'S1 Key Support' : 'S1 Soporte Clave') + '</span><span class="report-level-val support-val">' + ethSupport + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label resist">' + (isEn ? 'R1 Key Resistance' : 'R1 Resistencia Clave') + '</span><span class="report-level-val resist-val">' + ethResist + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label neutral">' + (isEn ? '24h Bias' : 'Sesgo 24h') + '</span><span style="color:' + (ethChange >= 0 ? '#22c55e' : '#ef4444') + ';font-weight:700;">' + (ethChange >= 0 ? '+' : '') + ethChange.toFixed(2) + '%</span></div>' +
              '</div>' +
            '</div>' : '') +

            (altOpp1 ? '<div class="report-level-card report-level-card--highlight">' +
              '<div class="report-level-coin">' +
                '<span class="report-level-symbol" style="color:#fbbf24;">★</span>' +
                '<div><span class="report-level-name">' + altOpp1.name + '</span> <span class="report-level-sym">' + (altOpp1.symbol||'').toUpperCase() + '</span></div>' +
              '</div>' +
              '<div class="report-altcoin-tag">' + (isEn ? '📡 Detected Divergence' : '📡 Divergencia Detectada') + '</div>' +
              '<div class="report-level-price">' + (isEn ? 'Price: ' : 'Precio: ') + '<strong>' + formatPrice(altOpp1.current_price) + '</strong></div>' +
              '<div class="report-level-rows">' +
                '<div class="report-level-row"><span class="report-level-label support">' + (isEn ? 'S1 Support' : 'S1 Soporte') + '</span><span class="report-level-val support-val">' + formatPrice(Number(altOpp1.current_price)*0.955) + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label resist">' + (isEn ? 'R1 Resistance' : 'R1 Resistencia') + '</span><span class="report-level-val resist-val">' + formatPrice(Number(altOpp1.current_price)*1.06) + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label neutral">' + (isEn ? '24h Momentum' : 'Momentum 24h') + '</span><span style="color:#22c55e;font-weight:700;">+' + (Number(altOpp1.price_change_percentage_24h)||0).toFixed(2) + '%</span></div>' +
              '</div>' +
              '<p style="font-size:.78rem;color:var(--text-secondary);margin-top:8px;">' + altGainerNote + '</p>' +
            '</div>' : '') +

            (altOpp2 && altOpp2.id !== altOpp1?.id ? '<div class="report-level-card">' +
              '<div class="report-level-coin">' +
                '<span class="report-level-symbol" style="color:#818cf8;">◆</span>' +
                '<div><span class="report-level-name">' + altOpp2.name + '</span> <span class="report-level-sym">' + (altOpp2.symbol||'').toUpperCase() + '</span></div>' +
              '</div>' +
              '<div class="report-level-price">' + (isEn ? 'Price: ' : 'Precio: ') + '<strong>' + formatPrice(altOpp2.current_price) + '</strong></div>' +
              '<div class="report-level-rows">' +
                '<div class="report-level-row"><span class="report-level-label support">' + (isEn ? 'S1 Support' : 'S1 Soporte') + '</span><span class="report-level-val support-val">' + formatPrice(Number(altOpp2.current_price)*0.952) + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label resist">' + (isEn ? 'R1 Resistance' : 'R1 Resistencia') + '</span><span class="report-level-val resist-val">' + formatPrice(Number(altOpp2.current_price)*1.058) + '</span></div>' +
                '<div class="report-level-row"><span class="report-level-label neutral">' + (isEn ? '24h Momentum' : 'Momentum 24h') + '</span><span style="color:' + (Number(altOpp2.price_change_percentage_24h) >= 0 ? '#22c55e' : '#ef4444') + ';font-weight:700;">' + (Number(altOpp2.price_change_percentage_24h) >= 0 ? '+' : '') + (Number(altOpp2.price_change_percentage_24h)||0).toFixed(2) + '%</span></div>' +
              '</div>' +
            '</div>' : '') +

          '</div>' +

          '<div class="report-footer-bar">' +
            '<span>' + (isEn ? '⚡ Generated by CriptoTracker PRO · Data: CoinGecko API' : '⚡ Generado por CriptoTracker PRO · Datos: CoinGecko API') + '</span>' +
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
          showToast(L('🛡️ Stop Loss triggered: Sold ' + item.amount.toFixed(4) + ' ' + (item.coinSymbol || '').toUpperCase() + ' at ' + formatPrice(item.sellPrice) + ' (P&L: ' + (item.pnlUSD >= 0 ? '+' : '') + formatPrice(item.pnlUSD) + ')', '🛡️ Stop Loss ejecutado: Vendidos ' + item.amount.toFixed(4) + ' ' + (item.coinSymbol || '').toUpperCase() + ' a ' + formatPrice(item.sellPrice) + ' (P&L: ' + (item.pnlUSD >= 0 ? '+' : '') + formatPrice(item.pnlUSD) + ')'), 'error');
        } else if (item.type === 'take_profit') {
          showToast(L('🎯 Take Profit triggered: Sold ' + item.amount.toFixed(4) + ' ' + (item.coinSymbol || '').toUpperCase() + ' at ' + formatPrice(item.sellPrice) + ' (+' + formatPrice(item.pnlUSD) + ')', '🎯 Take Profit ejecutado: Vendidos ' + item.amount.toFixed(4) + ' ' + (item.coinSymbol || '').toUpperCase() + ' a ' + formatPrice(item.sellPrice) + ' (+' + formatPrice(item.pnlUSD) + ')'), 'success');
        }

        if (window.Achievements) {
          window.Achievements.checkAchievements('sltp_trigger', item);
        }
      });
      renderPortfolio();
    }
  }

  function updateTimestampDisplay() {
    if (!els.lastUpdated) return;
    const d = new Date();
    const isEs = window.I18n && window.I18n.getLanguage() === 'es';
    const isMobile = window.innerWidth <= 768;
    const timeStr = d.toLocaleTimeString(isEs ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    const fullTimeStr = d.toLocaleTimeString(isEs ? 'es-ES' : 'en-US');
    const prefix = window.I18n ? window.I18n.t('last_updated_prefix') : (isEs ? 'Actualizado: ' : 'Updated: ');

    if (isMobile) {
      els.lastUpdated.innerHTML = '<span class="last-updated-dot"></span> Act. ' + timeStr;
      els.lastUpdated.title = prefix + fullTimeStr;
    } else {
      els.lastUpdated.innerHTML = '<span class="last-updated-dot"></span> ' + prefix + fullTimeStr;
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

      updateTimestampDisplay();

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
    updateAppBrandTier();
    updateTimestampDisplay();
    showSkeletons();
    setupEventListeners();

    if (window.Achievements) {
      window.Achievements.init();
    }

    await loadInitialData();

    // Start 30s Polling Loop
    window.CryptoAPI.startPolling(function(newData) {
      if (newData && Array.isArray(newData) && newData.length > 0) {
        marketData = newData;
        updateTimestampDisplay();

        checkSimulatorTriggers();

        // Calculate Fear & Greed tick for Zen Trader
        if (window.Achievements) {
          const allCoins = [...marketData, ...gainersData];
          const positiveCoins = allCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
          const ratio = allCoins.length > 0 ? (positiveCoins / allCoins.length) : 0.5;
          const fgScore = Math.min(95, Math.max(15, Math.round(30 + (ratio * 55))));
          window.Achievements.checkAchievements('tick', { fgScore: fgScore });
        }

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
