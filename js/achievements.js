/**
 * CriptoTracker PRO - Gamification Engine: Achievements & Badges (Logros y Medallas)
 * Rewards disciplined trading habits, risk management, diversification, and technical analysis.
 */

window.Achievements = (function() {
  'use strict';

  var STORAGE_KEY = 'criptotracker_achievements_v1';

  // 11 Core Achievements Catalog
  var DEFINITIONS = [
    // ── 1. GESTIÓN DE RIESGO Y PSICOLOGÍA ──
    {
      id: 'diamond_hands',
      category: 'risk_psychology',
      icon: '💎',
      titleKey: 'ach_diamond_hands_title',
      descKey: 'ach_diamond_hands_desc',
      maxProgress: 100,
      unit: '%',
      defaultTitle: 'Diamond Hands',
      defaultDesc: 'Hold an open position that suffered an unrealized loss of >= 10% for over 48h and then close it in profit.'
    },
    {
      id: 'stop_loss_master',
      category: 'risk_psychology',
      icon: '🛑',
      titleKey: 'ach_stop_loss_master_title',
      descKey: 'ach_stop_loss_master_desc',
      maxProgress: 1,
      unit: '',
      defaultTitle: 'Parachute Deployed',
      defaultDesc: 'Successfully execute a Stop Loss order that cuts losses before 5% of the position value.'
    },
    {
      id: 'take_profit_pro',
      category: 'risk_psychology',
      icon: '🎯',
      titleKey: 'ach_take_profit_pro_title',
      descKey: 'ach_take_profit_pro_desc',
      maxProgress: 15,
      unit: '%',
      defaultTitle: 'Take Profit Pro',
      defaultDesc: 'Sell at least 50% of a position after reaching over 15% profit.'
    },
    {
      id: 'zen_trader',
      category: 'risk_psychology',
      icon: '🧘',
      titleKey: 'ach_zen_trader_title',
      descKey: 'ach_zen_trader_desc',
      maxProgress: 24,
      unit: 'h',
      defaultTitle: 'Zen Calm',
      defaultDesc: 'Refrain from trading for 24h when the Fear & Greed index is < 20 (Extreme Fear) or > 80 (Extreme Greed).'
    },

    // ── 2. GESTIÓN DE CARTERA Y ESTRATEGIA ──
    {
      id: 'diversified_portfolio',
      category: 'portfolio_strategy',
      icon: '🌐',
      titleKey: 'ach_diversified_portfolio_title',
      descKey: 'ach_diversified_portfolio_desc',
      maxProgress: 5,
      unit: '',
      defaultTitle: 'Diversified Architect',
      defaultDesc: 'Hold at least 5 different assets in your portfolio without any exceeding 30% of total balance.'
    },
    {
      id: 'dca_master',
      category: 'portfolio_strategy',
      icon: '⏱️',
      titleKey: 'ach_dca_master_title',
      descKey: 'ach_dca_master_desc',
      maxProgress: 3,
      unit: '',
      defaultTitle: 'DCA Master',
      defaultDesc: 'Execute 3 consecutive purchases of the same asset spaced over time.'
    },
    {
      id: 'cash_shield',
      category: 'portfolio_strategy',
      icon: '⚓',
      titleKey: 'ach_cash_shield_title',
      descKey: 'ach_cash_shield_desc',
      maxProgress: 20,
      unit: '%',
      defaultTitle: 'Storm Shelter',
      defaultDesc: 'Maintain at least 20% of total balance in cash/stablecoins during a bearish market trend.'
    },

    // ── 3. ANÁLISIS TÉCNICO Y PROGRESIÓN ──
    {
      id: 'rsi_hunter',
      category: 'technical_progression',
      icon: '🕯️',
      titleKey: 'ach_rsi_hunter_title',
      descKey: 'ach_rsi_hunter_desc',
      maxProgress: 1,
      unit: '',
      defaultTitle: 'Bounce Hunter',
      defaultDesc: 'Open a simulated buy when RSI(14) is below 30 and close it in profit.'
    },
    {
      id: 'first_trade',
      category: 'technical_progression',
      icon: '🌱',
      titleKey: 'ach_first_trade_title',
      descKey: 'ach_first_trade_desc',
      maxProgress: 2,
      unit: '',
      defaultTitle: 'First Solid Step',
      defaultDesc: 'Complete your first buy and sell trade successfully.'
    },
    {
      id: 'beat_btc',
      category: 'technical_progression',
      icon: '🏆',
      titleKey: 'ach_beat_btc_title',
      descKey: 'ach_beat_btc_desc',
      maxProgress: 100,
      unit: '%',
      defaultTitle: 'Beating the King',
      defaultDesc: 'Outperform Bitcoin’s percentage return with a profitable portfolio.'
    },
    {
      id: 'phoenix_restart',
      category: 'technical_progression',
      icon: '🔄',
      titleKey: 'ach_phoenix_restart_title',
      descKey: 'ach_phoenix_restart_desc',
      maxProgress: 1,
      unit: '',
      defaultTitle: 'Phoenix Restart',
      defaultDesc: 'Use the portfolio reset button after losses and bring the portfolio back into profit.'
    }
  ];

  // Internal User State
  var state = {
    achievements: {},
    meta: {
      hadLossBeforeReset: false,
      extremeMarketStartTime: null,
      lastTradeTime: null,
      rsiBuys: {},                // coinId -> true
      holdingsLowWatermarks: {},  // coinId -> { maxDipPercent: number, dipStartTime: number }
      createdAt: Date.now()
    }
  };

  var activeFilter = 'all';

  // Helper for i18n
  function t(key, fallback) {
    if (window.I18n && typeof window.I18n.t === 'function') {
      var val = window.I18n.t(key);
      if (val && val !== key) return val;
    }
    return fallback || key;
  }

  // Load from LocalStorage
  function load() {
    try {
      // Default state mapping
      DEFINITIONS.forEach(function(def) {
        state.achievements[def.id] = {
          id: def.id,
          unlockedAt: null,
          progress: 0,
          maxProgress: def.maxProgress
        };
      });

      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.achievements && typeof parsed.achievements === 'object') {
            DEFINITIONS.forEach(function(def) {
              if (parsed.achievements[def.id]) {
                state.achievements[def.id] = {
                  id: def.id,
                  unlockedAt: parsed.achievements[def.id].unlockedAt || null,
                  progress: typeof parsed.achievements[def.id].progress === 'number' ? parsed.achievements[def.id].progress : 0,
                  maxProgress: def.maxProgress
                };
              }
            });
          }
          if (parsed.meta && typeof parsed.meta === 'object') {
            state.meta = Object.assign({}, state.meta, parsed.meta);
          }
        }
      }
    } catch (e) {
      console.warn('[Achievements] Error loading state from storage:', e);
    }
  }

  // Save to LocalStorage
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('[Achievements] Error saving state:', e);
    }
  }

  // Check if achievement is already unlocked
  function isUnlocked(id) {
    return !!(state.achievements[id] && state.achievements[id].unlockedAt !== null);
  }

  // Web Audio API victory chord chime
  function playVictoryChime() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      var now = ctx.currentTime;
      // Arpeggiated cheerful major chord: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      var freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach(function(f, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.5);
      });
    } catch (e) {
      // Audio autoplay policy handled silently
    }
  }

  // Sudden Celebratory Unlock Popup
  function showUnlockModal(def) {
    playVictoryChime();

    // Remove any existing popup
    var oldPopup = document.getElementById('achievement-unlock-modal');
    if (oldPopup) oldPopup.remove();

    var isEn = window.I18n ? window.I18n.getLanguage() === 'en' : true;
    var title = t(def.titleKey, def.defaultTitle);
    var desc = t(def.descKey, def.defaultDesc);
    var headerText = isEn ? '✨ ACHIEVEMENT UNLOCKED! ✨' : '✨ ¡LOGRO DESBLOQUEADO! ✨';
    var btnViewText = isEn ? '🏆 View in Showcase' : '🏆 Ver en Vitrina';
    var btnCloseText = isEn ? 'Keep Trading' : 'Continuar Operando';

    // Particle Burst HTML
    var particlesHtml = '';
    var colors = ['#fbbf24', '#f59e0b', '#6366f1', '#10b981', '#38bdf8', '#ec4899'];
    for (var i = 0; i < 24; i++) {
      var angle = (i / 24) * 360;
      var dist = 90 + (i % 3) * 35;
      var color = colors[i % colors.length];
      var size = 6 + (i % 4) * 2;
      var delay = (i % 6) * 0.04;
      particlesHtml += '<span class="ach-particle" style="--angle:' + angle + 'deg;--dist:' + dist + 'px;--color:' + color + ';--size:' + size + 'px;--delay:' + delay + 's;"></span>';
    }

    var modal = document.createElement('div');
    modal.id = 'achievement-unlock-modal';
    modal.className = 'ach-unlock-overlay';
    modal.innerHTML = 
      '<div class="ach-unlock-backdrop"></div>' +
      '<div class="ach-unlock-card" role="dialog" aria-modal="true">' +
        '<div class="ach-particles-container">' + particlesHtml + '</div>' +
        '<button class="ach-unlock-close" id="ach-popup-close-x" aria-label="Cerrar">✕</button>' +
        '<div class="ach-unlock-badge-glow">' +
          '<div class="ach-unlock-icon">' + def.icon + '</div>' +
        '</div>' +
        '<div class="ach-unlock-header-pill">' + headerText + '</div>' +
        '<h3 class="ach-unlock-title">' + title + '</h3>' +
        '<p class="ach-unlock-desc">' + desc + '</p>' +
        '<div class="ach-unlock-footer">' +
          '<button type="button" class="btn ach-btn-view" id="ach-popup-btn-view">' + btnViewText + '</button>' +
          '<button type="button" class="btn ach-btn-continue" id="ach-popup-btn-continue">' + btnCloseText + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    // Auto-focus & event bindings
    function dismiss() {
      modal.classList.add('closing');
      setTimeout(function() {
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
      }, 350);
    }

    var btnCloseX = document.getElementById('ach-popup-close-x');
    if (btnCloseX) btnCloseX.onclick = dismiss;

    var btnContinue = document.getElementById('ach-popup-btn-continue');
    if (btnContinue) btnContinue.onclick = dismiss;

    var backdrop = modal.querySelector('.ach-unlock-backdrop');
    if (backdrop) backdrop.onclick = dismiss;

    var btnView = document.getElementById('ach-popup-btn-view');
    if (btnView) {
      btnView.onclick = function() {
        dismiss();
        var achievementsTabBtn = document.querySelector('.desktop-nav-tabs button[data-tab="achievements"], .mobile-drawer button[data-tab="achievements"]');
        if (achievementsTabBtn) achievementsTabBtn.click();
      };
    }

    // Auto-dismiss after 8 seconds if untouched
    setTimeout(function() {
      if (document.getElementById('achievement-unlock-modal') === modal) {
        dismiss();
      }
    }, 8000);
  }

  // Trigger achievement unlock
  function unlock(id) {
    var def = DEFINITIONS.find(function(d) { return d.id === id; });
    if (!def) return false;

    if (state.achievements[id] && state.achievements[id].unlockedAt !== null) {
      return false; // Already unlocked
    }

    state.achievements[id] = {
      id: id,
      unlockedAt: Date.now(),
      progress: def.maxProgress,
      maxProgress: def.maxProgress
    };
    save();

    // Display sudden celebration popup
    showUnlockModal(def);

    // Also trigger standard app toast
    var isEn = window.I18n ? window.I18n.getLanguage() === 'en' : true;
    var achTitle = t(def.titleKey, def.defaultTitle);
    var toastMsg = isEn 
      ? '🏆 Achievement Unlocked: ' + achTitle + '!'
      : '🏆 ¡Logro Desbloqueado: ' + achTitle + '!';
    if (typeof window.showToast === 'function') {
      window.showToast(toastMsg, 'success');
    }

    // Update showcase view if rendered
    renderShowcase();
    updateBadgeCounts();

    // Dispatch custom DOM event
    window.dispatchEvent(new CustomEvent('achievementUnlocked', { detail: { id: id, def: def } }));

    return true;
  }

  // Update progress without unlocking
  function setProgress(id, currentProgress) {
    if (isUnlocked(id)) return;
    var def = DEFINITIONS.find(function(d) { return d.id === id; });
    if (!def) return;

    var p = Math.max(0, Math.min(def.maxProgress, Math.round(currentProgress * 10) / 10));
    if (!state.achievements[id]) {
      state.achievements[id] = { id: id, unlockedAt: null, progress: p, maxProgress: def.maxProgress };
    } else {
      state.achievements[id].progress = Math.max(state.achievements[id].progress || 0, p);
    }
    save();
  }

  // ==================== ACHIEVEMENT EVALUATOR ENGINE ====================
  /**
   * Evaluates achievements based on triggered actions:
   * @param {string} actionType - 'buy', 'sell', 'sltp_trigger', 'portfolio_update', 'reset', 'tick'
   * @param {object} contextData - payload with trade details, portfolio stats, market prices, etc.
   */
  function checkAchievements(actionType, contextData) {
    if (!contextData) contextData = {};

    var history = (window.Simulator && typeof window.Simulator.getHistory === 'function') ? window.Simulator.getHistory() : [];
    var holdings = (window.Simulator && typeof window.Simulator.getHoldings === 'function') ? window.Simulator.getHoldings() : [];
    var balance = (window.Simulator && typeof window.Simulator.getBalance === 'function') ? window.Simulator.getBalance() : 10000;

    // Track trade timestamp for Zen Trader
    if (actionType === 'buy' || actionType === 'sell') {
      state.meta.lastTradeTime = Date.now();
      // If trading during extreme market, reset zen timer
      if (state.meta.extremeMarketStartTime) {
        state.meta.extremeMarketStartTime = Date.now();
      }
      save();
    }

    // ── 1. first_trade ('🌱 Primer Paso Firme') ──
    if (!isUnlocked('first_trade')) {
      var hasBuy = history.some(function(h) { return h.type === 'BUY'; });
      var hasSell = history.some(function(h) { return h.type === 'SELL' || h.type === 'stop_loss' || h.type === 'take_profit'; });
      var progress = (hasBuy ? 1 : 0) + (hasSell ? 1 : 0);
      setProgress('first_trade', progress);
      if (hasBuy && hasSell) {
        unlock('first_trade');
      }
    }

    // ── 2. dca_master ('⏱️ Maestro del DCA') ──
    if (!isUnlocked('dca_master')) {
      // Look for 3 consecutive buys of the same coin in history
      var buysOnly = history.filter(function(h) { return h.type === 'BUY'; });
      var maxConsecutive = 0;
      var curConsecutive = 0;
      var curCoinId = null;

      for (var i = 0; i < buysOnly.length; i++) {
        if (buysOnly[i].coinId === curCoinId) {
          curConsecutive++;
        } else {
          curCoinId = buysOnly[i].coinId;
          curConsecutive = 1;
        }
        if (curConsecutive > maxConsecutive) {
          maxConsecutive = curConsecutive;
        }
      }
      setProgress('dca_master', Math.min(3, maxConsecutive));
      if (maxConsecutive >= 3) {
        unlock('dca_master');
      }
    }

    // ── 3. stop_loss_master ('🛑 Paracaídas Activado') ──
    if (!isUnlocked('stop_loss_master')) {
      if (actionType === 'sltp_trigger' && contextData.type === 'stop_loss') {
        var pnlPct = typeof contextData.pnlPercent === 'number' ? contextData.pnlPercent : -99;
        // Stop loss that cuts loss before 5% (i.e. between 0% and -5%)
        if (pnlPct <= 0 && pnlPct >= -5.0) {
          unlock('stop_loss_master');
        }
      } else if (actionType === 'sell' && contextData.isSL) {
        var pnlPctSell = typeof contextData.pnlPercent === 'number' ? contextData.pnlPercent : -99;
        if (pnlPctSell <= 0 && pnlPctSell >= -5.0) {
          unlock('stop_loss_master');
        }
      }
    }

    // ── 4. take_profit_pro ('🎯 Toma de Ganancias') ──
    if (!isUnlocked('take_profit_pro')) {
      if (actionType === 'sell' || (actionType === 'sltp_trigger' && contextData.type === 'take_profit')) {
        var pnlPercent = typeof contextData.pnlPercent === 'number' ? contextData.pnlPercent : 0;
        var ratio = typeof contextData.soldRatio === 'number' ? contextData.soldRatio : 1; // Default to full sell
        setProgress('take_profit_pro', Math.min(15, Math.max(0, pnlPercent)));
        if (pnlPercent >= 15.0 && ratio >= 0.49) {
          unlock('take_profit_pro');
        }
      }
    }

    // ── 5. rsi_hunter ('🕯️ Cazador de Rebotes') ──
    if (!isUnlocked('rsi_hunter')) {
      if (actionType === 'buy' && contextData.coinId) {
        // Check if RSI was low (< 30) at time of buy
        var rsi = typeof contextData.rsi === 'number' ? contextData.rsi : null;
        if (rsi !== null && rsi < 30) {
          state.meta.rsiBuys[contextData.coinId] = true;
          save();
        }
      } else if (actionType === 'sell' && contextData.coinId) {
        var wasLowRsiBuy = state.meta.rsiBuys[contextData.coinId];
        var isProfit = (typeof contextData.pnlUSD === 'number' && contextData.pnlUSD > 0) ||
                       (typeof contextData.pnlPercent === 'number' && contextData.pnlPercent > 0);
        if (wasLowRsiBuy && isProfit) {
          delete state.meta.rsiBuys[contextData.coinId];
          save();
          unlock('rsi_hunter');
        }
      }
    }

    // ── 6. diamond_hands ('💎 Manos de Diamante') ──
    if (!isUnlocked('diamond_hands')) {
      if (actionType === 'portfolio_update' && Array.isArray(contextData.holdingPnLs)) {
        // Track unrealized drawdowns for holdings
        contextData.holdingPnLs.forEach(function(hp) {
          if (!hp || !hp.coinId) return;
          var wm = state.meta.holdingsLowWatermarks[hp.coinId] || { maxDipPercent: 0, dipStartTime: null };
          if (hp.pnlPercent <= -10) {
            if (!wm.dipStartTime) wm.dipStartTime = Date.now();
            wm.maxDipPercent = Math.max(wm.maxDipPercent, Math.abs(hp.pnlPercent));
          }
          state.meta.holdingsLowWatermarks[hp.coinId] = wm;
        });
        save();
      } else if (actionType === 'sell' && contextData.coinId) {
        var wm = state.meta.holdingsLowWatermarks[contextData.coinId];
        var isClosedInProfit = (contextData.pnlUSD > 0) || (contextData.pnlPercent > 0);
        if (wm && wm.maxDipPercent >= 10 && isClosedInProfit) {
          var holdingDurationMs = Date.now() - (contextData.holdingTimestamp || (wm.dipStartTime || 0));
          var hoursHeld = holdingDurationMs / (1000 * 60 * 60);
          setProgress('diamond_hands', Math.min(100, Math.round((hoursHeld / 48) * 100)));
          // Unlock if held >= 48 hours or if simulator time accelerated
          if (hoursHeld >= 48 || (wm.dipStartTime && (Date.now() - wm.dipStartTime) >= 48 * 3600 * 1000)) {
            unlock('diamond_hands');
          }
        }
      }
    }

    // ── 7. diversified_portfolio ('🌐 Arquitecto Diversificado') ──
    if (!isUnlocked('diversified_portfolio')) {
      if (actionType === 'portfolio_update' || actionType === 'buy') {
        var totalVal = typeof contextData.totalValue === 'number' ? contextData.totalValue : (balance + 1);
        var holdingsList = Array.isArray(contextData.holdings) ? contextData.holdings : holdings;

        setProgress('diversified_portfolio', Math.min(5, holdingsList.length));

        if (holdingsList.length >= 5 && totalVal > 0) {
          var prices = contextData.prices || {};
          var anyExceeds30 = false;
          holdingsList.forEach(function(h) {
            var p = prices[h.coinId] || h.buyPrice;
            var val = h.amount * p;
            if ((val / totalVal) > 0.305) { // 30% limit with 0.5% tolerance
              anyExceeds30 = true;
            }
          });
          if (!anyExceeds30) {
            unlock('diversified_portfolio');
          }
        }
      }
    }

    // ── 8. cash_shield ('⚓ Refugio en Tormenta') ──
    if (!isUnlocked('cash_shield')) {
      if (actionType === 'portfolio_update') {
        var totalVal = typeof contextData.totalValue === 'number' ? contextData.totalValue : 10000;
        var cashRatio = totalVal > 0 ? (balance / totalVal) : 0;
        var cashPercent = Math.round(cashRatio * 100);
        setProgress('cash_shield', Math.min(20, cashPercent));

        var isBearishMarket = !!contextData.isBearishMarket;
        if (cashRatio >= 0.20 && isBearishMarket) {
          unlock('cash_shield');
        }
      }
    }

    // ── 9. zen_trader ('🧘 Frialdad Zen') ──
    if (!isUnlocked('zen_trader')) {
      var fgScore = typeof contextData.fgScore === 'number' ? contextData.fgScore : null;
      if (fgScore !== null) {
        var isExtreme = (fgScore < 20 || fgScore > 80);
        if (isExtreme) {
          if (!state.meta.extremeMarketStartTime) {
            state.meta.extremeMarketStartTime = Date.now();
            save();
          } else {
            var elapsedMs = Date.now() - state.meta.extremeMarketStartTime;
            var elapsedHours = elapsedMs / (1000 * 60 * 60);
            setProgress('zen_trader', Math.min(24, Math.floor(elapsedHours)));
            if (elapsedHours >= 24) {
              unlock('zen_trader');
            }
          }
        } else {
          // If market stabilized, reset extreme timer
          state.meta.extremeMarketStartTime = null;
          save();
        }
      }
    }

    // ── 10. beat_btc ('🏆 Superando al Rey') ──
    if (!isUnlocked('beat_btc')) {
      if (actionType === 'portfolio_update') {
        var portfolioPnlPercent = typeof contextData.pnlPercent === 'number' ? contextData.pnlPercent : 0;
        var btcChange = typeof contextData.btcChange === 'number' ? contextData.btcChange : null;

        if (btcChange !== null && portfolioPnlPercent > 0) {
          if (portfolioPnlPercent > btcChange) {
            setProgress('beat_btc', 100);
            unlock('beat_btc');
          } else {
            var diff = Math.max(0, Math.min(100, Math.round(50 + (portfolioPnlPercent - btcChange))));
            setProgress('beat_btc', diff);
          }
        }
      }
    }

    // ── 11. phoenix_restart ('🔄 Ave Fénix') ──
    if (!isUnlocked('phoenix_restart')) {
      if (actionType === 'reset') {
        var prevPnL = typeof contextData.prevPnLUSD === 'number' ? contextData.prevPnLUSD : 0;
        if (prevPnL < -10 || (contextData.prevBalance && contextData.prevBalance < 9900)) {
          state.meta.hadLossBeforeReset = true;
          save();
        }
      } else if (actionType === 'portfolio_update' || actionType === 'sell') {
        if (state.meta.hadLossBeforeReset) {
          var totalVal = typeof contextData.totalValue === 'number' ? contextData.totalValue : (balance);
          var pnlUSD = typeof contextData.pnlUSD === 'number' ? contextData.pnlUSD : (totalVal - 10000);
          if (totalVal > 10000 && pnlUSD > 15) {
            unlock('phoenix_restart');
          }
        }
      }
    }
  }

  // Calculate Rank and Tier based on unlocked medals
  function getRank(unlockedCount) {
    var isEn = window.I18n ? window.I18n.getLanguage() === 'en' : true;
    if (unlockedCount >= 10) {
      return {
        title: isEn ? 'Master of Markets 👑' : 'Maestro del Mercado 👑',
        tier: 'master',
        color: '#fbbf24'
      };
    } else if (unlockedCount >= 7) {
      return {
        title: isEn ? 'Strategic Architect 🌐' : 'Arquitecto Estratégico 🌐',
        tier: 'strategic',
        color: '#a855f7'
      };
    } else if (unlockedCount >= 4) {
      return {
        title: isEn ? 'Tactical Trader ⚡' : 'Trader Táctico ⚡',
        tier: 'tactical',
        color: '#38bdf8'
      };
    } else {
      return {
        title: isEn ? 'Disciplined Novice 🌱' : 'Novato Disciplinado 🌱',
        tier: 'novice',
        color: '#10b981'
      };
    }
  }

  // Get Stats
  function getStats() {
    var total = DEFINITIONS.length;
    var unlocked = 0;
    DEFINITIONS.forEach(function(d) {
      if (isUnlocked(d.id)) unlocked++;
    });
    var pct = Math.round((unlocked / total) * 100);
    return {
      total: total,
      unlocked: unlocked,
      percentage: pct,
      rank: getRank(unlocked)
    };
  }

  // Update badge counters across header / drawer
  function updateBadgeCounts() {
    var stats = getStats();
    var countElements = document.querySelectorAll('.achievements-badge-count');
    countElements.forEach(function(el) {
      el.textContent = stats.unlocked + '/' + stats.total;
    });
  }

  // ==================== UI RENDERING ====================
  function renderShowcase() {
    var container = document.getElementById('achievements-grid');
    if (!container) return;

    var stats = getStats();
    var isEn = window.I18n ? window.I18n.getLanguage() === 'en' : true;

    // Update Progress Banner Stats
    var countEl = document.getElementById('ach-stats-count');
    if (countEl) countEl.textContent = stats.unlocked + ' / ' + stats.total;

    var pctEl = document.getElementById('ach-stats-pct');
    if (pctEl) pctEl.textContent = stats.percentage + '%';

    var progressBar = document.getElementById('ach-stats-progress-fill');
    if (progressBar) progressBar.style.width = stats.percentage + '%';

    var rankEl = document.getElementById('ach-user-rank');
    if (rankEl) {
      rankEl.textContent = stats.rank.title;
      rankEl.style.borderColor = stats.rank.color;
      rankEl.style.color = stats.rank.color;
    }

    // Filter definitions
    var filtered = DEFINITIONS.filter(function(def) {
      if (activeFilter === 'all') return true;
      return def.category === activeFilter;
    });

    var html = '';

    filtered.forEach(function(def) {
      var stateData = state.achievements[def.id] || { unlockedAt: null, progress: 0, maxProgress: def.maxProgress };
      var unlocked = stateData.unlockedAt !== null;
      var title = t(def.titleKey, def.defaultTitle);
      var desc = t(def.descKey, def.defaultDesc);

      // Category Pill label
      var catLabel = '';
      if (def.category === 'risk_psychology') {
        catLabel = isEn ? 'Risk & Psychology' : 'Riesgo y Psicología';
      } else if (def.category === 'portfolio_strategy') {
        catLabel = isEn ? 'Portfolio & Strategy' : 'Cartera y Estrategia';
      } else {
        catLabel = isEn ? 'Technical & Progress' : 'Análisis Técnico';
      }

      // Progress Calculation
      var progress = stateData.progress || 0;
      var maxProgress = def.maxProgress || 1;
      var progressPercent = Math.min(100, Math.round((progress / maxProgress) * 100));

      // Date Format
      var unlockedDateStr = '';
      if (unlocked && stateData.unlockedAt) {
        var d = new Date(stateData.unlockedAt);
        unlockedDateStr = (isEn ? 'Unlocked: ' : 'Desbloqueado: ') + d.toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
          day: '2-digit', month: 'short', year: 'numeric'
        });
      }

      var cardClass = unlocked ? 'ach-card unlocked' : 'ach-card locked';
      var statusBadge = unlocked 
        ? '<div class="ach-card-status unlocked"><span>✓</span> ' + unlockedDateStr + '</div>'
        : '<div class="ach-card-status locked"><span>🔒</span> ' + (isEn ? 'Locked' : 'Bloqueado') + '</div>';

      html += 
        '<div class="' + cardClass + '" data-ach-id="' + def.id + '">' +
          '<div class="ach-card-glow"></div>' +
          '<div class="ach-card-header">' +
            '<div class="ach-icon-wrapper">' +
              '<span class="ach-medal-icon">' + def.icon + '</span>' +
            '</div>' +
            '<div class="ach-meta">' +
              '<span class="ach-category-tag ' + def.category + '">' + catLabel + '</span>' +
              '<h3 class="ach-card-title">' + title + '</h3>' +
            '</div>' +
          '</div>' +
          '<p class="ach-card-desc">' + desc + '</p>' +
          '<div class="ach-card-footer">' +
            (!unlocked ? (
              '<div class="ach-progress-wrap">' +
                '<div class="ach-progress-labels">' +
                  '<span class="ach-progress-text">' + (isEn ? 'Progress' : 'Progreso') + '</span>' +
                  '<span class="ach-progress-val">' + progress + ' / ' + maxProgress + (def.unit ? ' ' + def.unit : '') + ' (' + progressPercent + '%)</span>' +
                '</div>' +
                '<div class="ach-progress-track">' +
                  '<div class="ach-progress-bar" style="width:' + progressPercent + '%;"></div>' +
                '</div>' +
              '</div>'
            ) : '') +
            statusBadge +
          '</div>' +
        '</div>';
    });

    container.innerHTML = html;
  }

  // Setup UI event bindings (Filter chips, re-render)
  function setupUI() {
    var chips = document.querySelectorAll('.ach-filter-chip');
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        chips.forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        activeFilter = chip.dataset.category || 'all';
        renderShowcase();
      });
    });

    // Language change listener
    window.addEventListener('languageChanged', function() {
      renderShowcase();
      updateBadgeCounts();
    });
  }

  // Initialize
  load();

  return {
    init: function() {
      setupUI();
      renderShowcase();
      updateBadgeCounts();
    },
    checkAchievements: checkAchievements,
    renderShowcase: renderShowcase,
    unlock: unlock,
    setProgress: setProgress,
    isUnlocked: isUnlocked,
    getStats: getStats,
    getDefinitions: function() { return DEFINITIONS; },
    getState: function() { return state; },
    resetState: function() {
      localStorage.removeItem(STORAGE_KEY);
      load();
      renderShowcase();
      updateBadgeCounts();
    }
  };
})();
