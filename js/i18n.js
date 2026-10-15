/**
 * CriptoTracker PRO - Internationalization (i18n) Engine
 * Supported Languages: 'en' (English - Default), 'es' (Español)
 */

(function(window) {
  'use strict';

  var STORAGE_KEY = 'criptotracker_lang';

  var translations = {
    en: {
      // General & Header
      app_title: 'CryptoTracker.Pro — Real-Time Cryptocurrency Dashboard',
      logo_title: 'CryptoTracker.Pro',
      logo_subtitle: 'Premium Dashboard',
      tier_premium: 'Premium Dashboard',
      tier_free: 'Free Dashboard',
      menu_title: 'Main Menu',
      last_updated_prefix: 'Updated: ',
      search_placeholder: 'Search cryptocurrencies...',
      current_lang: 'English',
      lang_name_en: 'English (EN)',
      lang_name_es: 'Spanish (ES)',

      // Navigation Tabs & Pillars (4 Pilares)
      tab_top50: '📊 Top 50',
      tab_gainers: '🔥 Gainers',
      tab_favorites: '⭐ Favorites',
      tab_portfolio: '💼 Portfolio',
      tab_glossary: '📖 Crypto Glossary',
      tab_premium: '💎 Premium Analysis',
      tab_about: '💳 Plans & Pricing',
      tab_download: '📲 Download App',

      // Navigation Pillars
      pillar_markets: 'Markets',
      pillar_portfolio: 'Simulator / Portfolio',
      pillar_pro: 'PRO Intelligence',
      pillar_learn: 'Learn',
      nav_plans_cta: 'PRO Plans',

      // Sub-tabs
      subtab_top50: 'Top 50',
      subtab_gainers: 'Top Gainers',
      subtab_favorites: 'Favorites',
      subtab_portfolio: 'My Portfolio',
      subtab_analytics: 'Quantitative Analytics',
      subtab_achievements: 'Achievements',
      subtab_pro_signals: 'Signals (RSI/EMAs)',
      subtab_pro_metrics: 'Fear & Greed / Dominance',
      subtab_pro_report: 'Daily Report',
      subtab_glossary: 'Crypto Glossary',

      // Mobile Drawer
      drawer_top50: 'Top 50 Assets',
      drawer_gainers: 'Top Gainers',
      drawer_favorites: 'My Favorites',
      drawer_portfolio: 'Portfolio Simulator',
      drawer_glossary: 'Crypto Glossary',
      drawer_premium: 'Premium Analysis',
      drawer_about: 'Plans & Pricing',
      drawer_unlock_btn: 'Unlock PRO Access',
      drawer_lang_label: '🌐 Language / Idioma',

      // Auth & User Profile (Dark Luxury)
      nav_sign_in: 'Sign In',
      nav_account: 'Account',
      auth_title: 'CryptoTracker.Pro Access',
      auth_subtitle: 'Sync your portfolio & favorites across Web, Android & iPhone',
      auth_tab_login: 'Sign In',
      auth_tab_register: 'Create Account',
      auth_btn_apple: 'Continue with Apple',
      auth_btn_google: 'Continue with Google',
      auth_divider_or: 'or with email address',
      auth_label_name: 'Full Name',
      auth_label_email: 'Email Address',
      auth_label_password: 'Password',
      auth_forgot_password: 'Forgot password?',
      auth_remember_me: 'Keep me signed in',
      auth_btn_submit_login: 'Enter Account',
      auth_btn_submit_register: 'Create PRO Account',
      auth_sync_status: 'Cloud sync active across all your devices',
      auth_stat_device: 'Synced Platforms',
      auth_stat_portfolio: 'Current Balance',
      auth_btn_sync_now: 'Sync Cloud Now',
      auth_btn_logout: 'Sign Out',
      auth_welcome_toast: 'Welcome back, Investor PRO! Cloud portfolio connected.',
      auth_created_toast: 'Account created successfully! PRO cloud features enabled.',
      auth_logout_toast: 'Signed out successfully. Switched to local storage.',
      auth_sync_toast: 'Cloud synchronization complete! Balance & favorites updated.',

      // Table Headers
      col_rank: '#',
      col_asset: 'Asset',
      col_price: 'Price',
      col_change_24h: '24h Change',
      col_volume_24h: '24h Volume',
      col_market_cap: 'Market Cap',
      col_trend_7d: '7d Trend',
      col_actions: 'Actions',

      // Table Empty / States
      no_favorites_title: 'No favorite cryptos yet',
      no_favorites_desc: 'Click on the star ⭐ next to any asset in the Top 50 or Gainers to pin it here.',
      search_no_results: 'No cryptocurrencies found matching your search.',
      btn_view_details: 'View details',

      // Coin Detail Modal
      modal_stat_price: 'Price',
      modal_stat_change: '24h Change',
      modal_stat_mcap: 'Market Cap',
      modal_stat_volume: '24h Volume',
      modal_stat_ath: 'ATH',
      modal_chart_title: 'Price Evolution',
      modal_buy_cta: '🛒 Buy this crypto',

      // Timeframes
      tf_1m: '1 Min',
      tf_5m: '5 Min',
      tf_15m: '15 Min',
      tf_1h: '1 Hour',
      tf_1w: '1 Week',
      tf_1mo: '1 Month',

      // Portfolio Section
      portfolio_badge: 'REALISTIC TRADING SIMULATOR',
      portfolio_title: 'Virtual Portfolio Simulator',
      portfolio_subtitle: 'Practice trading with $10,000 USD virtual funds in real-time market prices, with automated Stop Loss & Take Profit.',
      stat_cash_balance: 'Available Cash',
      stat_crypto_value: 'Crypto Value',
      stat_total_value: 'Total Portfolio',
      stat_unrealized_pnl: 'Unrealized P&L',
      btn_reset_portfolio: '🔄 Reset $10,000 USD',

      // Buy Form
      buy_title: 'Buy Cryptocurrency',
      buy_search_label: 'Search Crypto',
      buy_search_placeholder: 'Search by name or symbol...',
      buy_amount_label: 'Amount in USD',
      buy_amount_placeholder: 'Amount to buy in USD',
      btn_buy_execute: '🛒 Buy Cryptocurrency',

      // Stop Loss & Take Profit in Buy Form
      sltp_toggle: '🛡️ Set Stop Loss & Take Profit (Optional)',
      sltp_label_sl: '🛡️ Stop Loss ($)',
      sltp_label_tp: '🎯 Take Profit ($)',
      sltp_ph_sl: 'Loss limit in $',
      sltp_ph_tp: 'Target profit in $',
      sltp_notice: '⚡ If market price hits these levels, your order will automatically execute and sell.',

      // Holdings & History
      holdings_title: 'My Active Holdings',
      no_holdings: 'You have no open positions. Search for a coin on the left to execute your first trade.',
      history_title: '📋 Transaction History',
      no_history: 'No transactions recorded yet.',
      btn_sell: 'Sell',
      btn_edit_sltp: 'Edit SL/TP',

      // Sell Modal
      sell_modal_title: 'Sell Cryptocurrency',
      sell_current_price: 'Current Price:',
      sell_total_balance: 'In Wallet:',
      sell_total_value: 'Total Value:',
      sell_amount_label: 'Amount to Sell:',
      sell_estimated_receive: 'Total to receive:',
      sell_estimated_pnl: 'Estimated PnL (Profit/Loss):',
      sell_remaining_balance: 'Remaining in wallet:',
      sell_btn_confirm: '🔥 Confirm Sale',
      sell_btn_cancel: 'Cancel',

      // Edit SL/TP Modal
      edit_sltp_title: 'Configure SL / TP',
      current_price_label: 'Current Price:',
      buy_price_label: 'Purchase Price:',
      no_sl_ph: 'No Stop Loss',
      no_tp_ph: 'No Take Profit',
      btn_save_targets: '💾 Save Targets',
      btn_cancel: 'Cancel',
      sltp_modal_note: 'Orders execute and automatically close the position once the market reaches these prices.',

      // Premium Section
      premium_banner_badge: 'INSTITUTIONAL QUANTITATIVE SUITE',
      premium_title: 'Real-Time Quantitative Analysis',
      premium_subtitle: 'Access proprietary trading indicators, automated market sentiment, institutional reports, and key support & resistance levels.',
      feat_fg_title: 'Fear & Greed Index',
      feat_fg_desc: 'Market sentiment calculated from breadth and momentum indicators.',
      feat_signals_title: 'Technical Signals',
      feat_signals_desc: 'RSI, Golden Crosses, and trend breakouts calculated in real time.',
      feat_sr_title: 'Support & Resistance',
      feat_sr_desc: 'Automated pivot levels and institutional order block zones.',
      feat_dom_title: 'Dominance & Liquidity',
      feat_dom_desc: 'Capital rotation analysis between Bitcoin and the Altcoin sector.',

      // Premium Unlock Box
      unlock_box_title: '🔑 Unlock Premium Area Access',
      unlock_box_desc: 'Gain instant access to algorithmic signals, technical levels, and daily institutional reports. Unlock via our Stripe simulation or start your 7-day free trial.',
      unlock_ph_key: 'Enter your license key...',
      unlock_btn: '🔓 Unlock',
      unlock_error: 'Invalid key. Try the interactive Stripe simulation.',
      unlock_btn_stripe: '🧪 Simulate Subscription with Stripe',
      unlock_btn_trial: '✨ Start 7-Day Demo Trial',

      // Premium Unlocked Active View
      badge_pro_active: '👑 PRO MEMBERSHIP ACTIVE',
      badge_pro_lifetime: '👑 PRO MEMBERSHIP ACTIVE (LIFETIME)',
      btn_lock_session: '🔒 Lock session',
      badge_live: 'LIVE',
      badge_updated: 'UPDATED',
      badge_today: 'TODAY',
      fear_greed_card_title: '🌡️ Fear & Greed Index',
      fg_scale_0: '0 Extreme Fear',
      fg_scale_50: '50 Neutral',
      fg_scale_100: '100 Extreme Greed',
      fg_footer_note: 'Current market sentiment favors trend continuation with low selling pressure across exchanges.',
      dom_card_title: '📊 Dominance & Institutional Flow',
      dom_altcoins: 'Altcoins & Stablecoins',
      dom_footer_note: 'Consolidation phase in Bitcoin. Large-cap altcoins exhibit sustained liquidity inflows.',
      signals_card_title: '🎯 Quantitative Signals & Key Levels (Top Assets)',
      signals_card_subtitle: 'Algorithmic calculation based on RSI (14), Exponential Moving Averages, and ATR Volatility.',
      badge_pro_signals: 'PRO SIGNALS',
      col_price_curr: 'Current Price',
      col_rsi: 'RSI (14)',
      col_trend_emas: 'Trend (EMAs)',
      col_support: 'Key Support',
      col_resistance: 'Key Resistance',
      col_verdict: 'Algorithmic Verdict',
      opp_radar_title: '🚨 Opportunities Radar & Patterns Detected Today',
      macro_report_title: '📑 Daily Market Executive Report',
      macro_summary: '<strong>Market Summary:</strong> Tier-1 digital assets maintain a constructive technical framework. Absorption of sell orders at Bitcoin\'s institutional support indicates steady accumulation by long-term holders.',
      macro_takeaway_1: '<strong>Bullish invalidation level:</strong> Daily close retention above major structural support.',
      macro_takeaway_2: '<strong>Profit-taking target:</strong> Next technical resistance zone for portfolio rebalancing.',
      macro_takeaway_3: '<strong>Risk/Reward Ratio:</strong> Highly favorable for systematic dollar-cost averaging (DCA).',
      report_card_title: '📊 Daily Institutional Report',
      report_card_desc: 'Quantitative analysis generated automatically with live real-time market data',
      btn_generate_report: '⚡ Generate Report',
      btn_regenerate_report: '🔄 Regenerate Report',
      btn_generating_report: '⏳ Generating...',
      report_placeholder_p1: 'Click on <strong>⚡ Generate Report</strong> to produce institutional market intelligence with real-time platform data.',
      report_placeholder_p2: 'The report updates with every regeneration using latest quotes and orderflow metrics.',
      trial_expired_title: 'Your 7-day demo trial has expired.',
      trial_expired_desc: 'To continue accessing technical signals and institutional reports, subscribe via Stripe.',
      btn_trial_expired: '⛔ 7-Day Trial Expired',
      btn_trial_start: '✨ Start 7-Day Demo Trial',

      // Pricing & Plans Tab
      pricing_badge: 'PRO PLANS & LICENSES',
      pricing_title: 'Empower Your Quantitative Trading',
      pricing_subtitle: 'Choose the ideal plan to access real-time algorithmic signals, daily institutional reports, and portfolio simulator with automated SL/TP.',
      sim_notice_badge: '🧪 TEST SANDBOX / STRIPE SIMULATION',
      sim_notice_text: 'Pilot phase active: the Stripe gateway is fully simulated so you can test all plans and unlock PRO tools instantly, free of charge, with no real card or Stripe account required.',

      // Plan Cards
      plan_monthly_name: 'Pro Monthly Plan',
      plan_monthly_desc: 'Total flexibility month by month · No contract',
      plan_monthly_period: '/month',
      btn_monthly: '🧪 Simulate $9.99 / mo',

      plan_annual_name: 'Pro Annual Plan',
      plan_annual_desc: 'The most popular plan chosen by active traders',
      plan_annual_badge: '⭐ MOST POPULAR',
      plan_annual_period: '/year',
      plan_annual_savings: '🔥 Save 42% ($5.83/mo)',
      btn_annual: '🧪 Simulate $69.99 / yr (Stripe)',

      plan_lifetime_name: 'VIP Lifetime License',
      plan_lifetime_desc: 'Unlimited permanent access forever',
      plan_lifetime_period: 'one-time payment',
      plan_lifetime_badge: '👑 Permanent Access',
      btn_lifetime: '🧪 Simulate VIP License ($149.99)',

      // Features
      feat_signals_bullet: 'Real-time quantitative signals (RSI, MA Cross)',
      feat_fg_bullet: 'Live Fear & Greed Index',
      feat_sr_bullet: 'Calculated support and resistance zones',
      feat_sim_bullet: 'Simulator with Stop Loss & Take Profit',
      feat_charts_bullet: 'Multi-timeframe interactive charts',
      feat_all_monthly: 'Everything in the Monthly Plan',
      feat_daily_reports: 'Daily Institutional Report Generator',
      feat_radar: 'Breakout and opportunity radar',
      feat_updates: 'Priority automated updates',
      feat_priority_support: 'Preferred technical support',
      feat_lifetime_access: 'Unlimited access for life',
      feat_no_renewals: 'No monthly fees or renewals',
      feat_future_updates: 'All future features included',
      feat_transferable_key: 'Personal transferable VIP license key',
      feat_vip_support: 'Direct VIP support',

      // Trust Box
      trust_title: '🔒 Secure 256-Bit SSL Encrypted Payment Gateway',
      trust_desc: 'Your data is encrypted and never stored on our servers. Payments simulated via Stripe Payments Europe, Ltd. protocols.',

      // Highlights Grid (Bottom of Plans)
      highlight_top50_title: 'Live Top 50',
      highlight_top50_desc: 'Continuous real-time tracking of highest volume and market capitalization assets.',
      highlight_gainers_title: 'Daily Top Gainers',
      highlight_gainers_desc: 'Instant detection of leading market breakout and percentage gainers.',
      highlight_sltp_title: 'Stop Loss & Take Profit',
      highlight_sltp_desc: 'Automated order execution to lock in profits and limit downside risk.',
      highlight_quant_title: 'Quantitative Analysis',
      highlight_quant_desc: 'Algorithmic indicators, support/resistance zones, and real-time market sentiment.',

      // Stripe Checkout Modal
      stripe_modal_title: 'Payment Gateway Simulation',
      stripe_sandbox_pill: '🧪 Test Mode',
      stripe_test_banner: '⚡ ACTIVE TEST SANDBOX',
      stripe_test_desc: 'Simulate the charge and activate PRO access without real charges.',
      btn_autofill_card: '⚡ Autofill test card (Testnet 4242)',
      label_card_name: 'Cardholder Name',
      ph_card_name: 'e.g. Demo Trader PRO',
      label_card_email: 'Email for Simulated Invoice',
      label_card_number: 'Card Number',
      label_card_exp: 'Expiration',
      ph_card_exp: 'MM/YY (e.g. 12/28)',
      label_card_cvc: 'CVC',
      stripe_guarantee: '🧪 Interactive Stripe simulation for testing phase. PRO assets and features unlock instantly in local storage.',
      btn_stripe_pay: '🧪 Simulate Approved Payment',
      btn_stripe_pay_text: '🧪 Simulate Approved Payment',

      // Glossary Section
      glossary_badge: 'BEGINNERS & PROS GUIDE',
      glossary_title: '📖 Crypto Glossary Made Simple',
      glossary_subtitle: 'Essential crypto terms and concepts explained in everyday words with real-life analogies, free from confusing jargon.',
      glossary_search_ph: 'Search term: e.g. HODL, Wallet, Gas, Whale, Bitcoin...',
      chip_all: '✨ All',
      chip_basics: '🧱 Basics',
      chip_trading: '📈 Market & Trading',
      chip_security: '🛡️ Security & Wallets',
      chip_slang: '💬 Slang & Jargon',
      glossary_tab_all: '✨ All',
      glossary_tab_basics: '🧱 Basics',
      glossary_tab_trading: '📈 Market & Trading',
      glossary_tab_security: '🛡️ Security & Wallets',
      glossary_tab_slang: '💬 Slang & Jargon',
      empty_holdings_title: 'No open positions',
      empty_holdings_desc: 'Use the form to buy virtual assets and start trading.',
      no_sltp_set: 'No SL/TP set',
      glossary_empty_title: 'No term found',
      glossary_empty_desc: 'Try another keyword or select a category above.',
      glossary_in_real_life: 'In real life:',

      // Achievements & Gamification (EN)
      tab_achievements: '🏆 Achievements',
      drawer_achievements: 'Achievements & Badges',
      ach_badge_pill: 'TRADING GAMIFICATION & DISCIPLINE',
      ach_title: '🏆 Achievements & Badges Showcase',
      ach_subtitle: 'Reward and reinforce professional investment habits: risk management, diversification, technical analysis, and psychological discipline.',
      ach_stats_unlocked: 'Unlocked',
      ach_stats_completion: 'Completion Rate',
      ach_rank_label: 'Trader Rank',
      ach_filter_all: '✨ All Badges',
      ach_filter_risk: '🛑 Risk & Psychology',
      ach_filter_strategy: '💼 Portfolio & Strategy',
      ach_filter_tech: '🕯️ Technical & Progress',
      ach_status_unlocked: 'Unlocked on',
      ach_status_locked: 'Locked / In Progress',
      ach_progress_label: 'Challenge Progress',

      // 11 Medals (EN)
      ach_diamond_hands_title: 'Diamond Hands',
      ach_diamond_hands_desc: 'Hold an open position that suffered an unrealized loss of >= 10% for over 48h and then close it in profit.',
      ach_stop_loss_master_title: 'Parachute Deployed',
      ach_stop_loss_master_desc: 'Successfully execute a Stop Loss order that cuts losses before 5% of the position value.',
      ach_take_profit_pro_title: 'Take Profit Pro',
      ach_take_profit_pro_desc: 'Sell at least 50% of a position after reaching over 15% profit.',
      ach_zen_trader_title: 'Zen Calm',
      ach_zen_trader_desc: 'Refrain from trading for 24h when the Fear & Greed index is < 20 (Extreme Fear) or > 80 (Extreme Greed).',
      ach_diversified_portfolio_title: 'Diversified Architect',
      ach_diversified_portfolio_desc: 'Hold at least 5 different assets in your portfolio without any exceeding 30% of total balance.',
      ach_dca_master_title: 'DCA Master',
      ach_dca_master_desc: 'Execute 3 consecutive purchases of the same asset spaced over time.',
      ach_cash_shield_title: 'Storm Shelter',
      ach_cash_shield_desc: 'Maintain at least 20% of total balance in cash/stablecoins during a bearish market trend.',
      ach_rsi_hunter_title: 'Bounce Hunter',
      ach_rsi_hunter_desc: 'Open a simulated buy when RSI(14) is below 30 and close it in profit.',
      ach_first_trade_title: 'First Solid Step',
      ach_first_trade_desc: 'Complete your first buy and sell trade successfully.',
      ach_beat_btc_title: 'Beating the King',
      ach_beat_btc_desc: 'Outperform Bitcoin’s percentage return with a profitable portfolio.',
      ach_phoenix_restart_title: 'Phoenix Restart',
      ach_phoenix_restart_desc: 'Use the portfolio reset button after losses and bring the portfolio back into profit.',

      // Premium Portfolio Analytics (EN)
      port_prem_badge: 'PRO & INSTITUTIONAL PORTFOLIO QUANT',
      port_prem_title: '📊 Advanced Portfolio Analytics & Quantitative Charts',
      port_prem_subtitle: 'Real-time diagnostic audit of asset allocation, capital equity curve, Sharpe risk-adjusted performance, and tactical AI advisory.',
      port_gate_title: 'Unlock Advanced Portfolio Charts & Analytics',
      port_gate_desc: 'Access the historical equity growth curve, asset allocation donut chart, Sharpe risk matrix, and automated position health diagnostic.',
      port_gate_btn_unlock: '🧪 Unlock PRO Free (Stripe Simulation)',
      port_gate_btn_demo: '⚡ Try 7-Day Demo Trial',
      port_health_score_label: 'Portfolio Health Score',
      port_kpi_sharpe: 'Est. Sharpe Ratio',
      port_kpi_sharpe_hint: 'Risk-adjusted return',
      port_kpi_maxdd: 'Max Recorded Drawdown',
      port_kpi_maxdd_hint: 'Peak-to-trough decline',
      port_kpi_winrate: 'Win Rate %',
      port_kpi_diversification: 'Diversification Score',
      port_kpi_div_hint: 'Capital concentration index',
      chart_allocation_title: 'Asset Allocation Breakdown',
      chart_donut_total: 'Total Value',
      chart_equity_title: 'Capital Growth Curve (Equity Curve)',
      legend_equity_curve: 'Portfolio Value',
      legend_baseline: 'Initial Capital ($10,000 USD)',
      chart_pnl_bars_title: 'Asset Performance Comparison (P&L %)',
      port_insights_title: '🧠 Global Tactical Diagnostic & Advisor Recommendations',
      btn_reanalyze: '🔄 Re-audit Portfolio',
      empty_portfolio_charts: 'No active holdings or closed trades yet to analyze. Buy assets above to generate quantitative metrics.',
      port_conn_status: 'Connected to Live External Market Feeds:',
      port_deep_dive_title: '🔬 Exhaustive Technical Analysis of Your Held Assets',
      port_deep_dive_subtitle: 'In-depth quantitative diagnosis for each of your portfolio holdings, connected to real-time indicators (RSI, EMAs, Supports/Resistances) and direct external analysis portals.',
      port_btn_reanalyze_live: '🔄 Re-analyze Holdings Live',
      port_ext_portals: 'Connect with Professional Analysis Sites:',
      port_pre_holding_title: 'Featured Market Leaders Analysis (Live Feeds)',
      port_pre_holding_desc: 'You currently have no open positions in your simulator. Here is the exhaustive live technical analysis for the market benchmarks (BTC, ETH, SOL) so you can plan your trades:'
    },

    es: {
      // General & Header
      app_title: 'CryptoTracker.Pro — Dashboard de Criptomonedas en Tiempo Real',
      logo_title: 'CryptoTracker.Pro',
      logo_subtitle: 'Dashboard Premium',
      tier_premium: 'Dashboard Premium',
      tier_free: 'Dashboard Gratuito',
      menu_title: 'Menú Principal',
      last_updated_prefix: 'Actualizado: ',
      search_placeholder: 'Buscar criptomonedas...',
      current_lang: 'Español',
      lang_name_en: 'Inglés (EN)',
      lang_name_es: 'Español (ES)',

      // Navigation Tabs & Pillars (4 Pilares)
      tab_top50: '📊 Top 50',
      tab_gainers: '🔥 Ganadores',
      tab_favorites: '⭐ Favoritos',
      tab_portfolio: '💼 Portfolio',
      tab_glossary: '📖 Vocabulario Cripto',
      tab_premium: '💎 Análisis Premium',
      tab_about: '💳 Planes y Suscripción',
      tab_download: '📲 Descargar App',

      // Navigation Pillars
      pillar_markets: 'Mercados',
      pillar_portfolio: 'Simulador / Cartera',
      pillar_pro: 'Inteligencia PRO',
      pillar_learn: 'Aprender',
      nav_plans_cta: 'Planes PRO',

      // Sub-tabs
      subtab_top50: 'Top 50',
      subtab_gainers: 'Ganadores',
      subtab_favorites: 'Favoritos',
      subtab_portfolio: 'Mi Portfolio',
      subtab_analytics: 'Analítica Cuantitativa',
      subtab_achievements: 'Logros',
      subtab_pro_signals: 'Señales (RSI/EMAs)',
      subtab_pro_metrics: 'Fear & Greed / Dominancia',
      subtab_pro_report: 'Informe Diario',
      subtab_glossary: 'Glosario Cripto',

      // Mobile Drawer
      drawer_top50: 'Top 50 Activos',
      drawer_gainers: 'Mayores Ganadores',
      drawer_favorites: 'Mis Favoritos',
      drawer_portfolio: 'Simulador Portfolio',
      drawer_glossary: 'Vocabulario Cripto',
      drawer_premium: 'Análisis Premium',
      drawer_about: 'Planes y Suscripción',
      drawer_unlock_btn: 'desbloquear acceso pro',
      drawer_lang_label: '🌐 Idioma / Language',

      // Auth & User Profile (Dark Luxury)
      nav_sign_in: 'Iniciar Sesión',
      nav_account: 'Mi Cuenta',
      auth_title: 'Acceso CryptoTracker.Pro',
      auth_subtitle: 'Sincroniza tu portfolio y favoritos en Web, Android e iPhone',
      auth_tab_login: 'Iniciar Sesión',
      auth_tab_register: 'Crear Cuenta',
      auth_btn_apple: 'Continuar con Apple',
      auth_btn_google: 'Continuar con Google',
      auth_divider_or: 'o con correo electrónico',
      auth_label_name: 'Nombre Completo',
      auth_label_email: 'Correo Electrónico',
      auth_label_password: 'Contraseña',
      auth_forgot_password: '¿Olvidaste tu contraseña?',
      auth_remember_me: 'Mantener sesión iniciada',
      auth_btn_submit_login: 'Entrar a mi Cuenta',
      auth_btn_submit_register: 'Crear Cuenta PRO',
      auth_sync_status: 'Sincronización en la nube activa en todos tus dispositivos',
      auth_stat_device: 'Plataformas Sincronizadas',
      auth_stat_portfolio: 'Saldo en Cartera',
      auth_btn_sync_now: 'Sincronizar Ahora',
      auth_btn_logout: 'Cerrar Sesión',
      auth_welcome_toast: '¡Bienvenido a CryptoTracker.Pro! Cartera en la nube conectada.',
      auth_created_toast: '¡Cuenta creada con éxito! Sincronización multidispositivo activada.',
      auth_logout_toast: 'Sesión cerrada correctamente. Volviendo a almacenamiento local.',
      auth_sync_toast: '¡Sincronización completada! Saldo y favoritos actualizados.',

      // Table Headers
      col_rank: '#',
      col_asset: 'Activo',
      col_price: 'Precio',
      col_change_24h: 'Cambio 24h',
      col_volume_24h: 'Volumen 24h',
      col_market_cap: 'Cap. Mercado',
      col_trend_7d: 'Tendencia 7d',
      col_actions: 'Acciones',

      // Table Empty / States
      no_favorites_title: 'Aún no tienes favoritos',
      no_favorites_desc: 'Haz clic en la estrella ⭐ al lado de cualquier criptomoneda en el Top 50 o Ganadores para fijarla aquí.',
      search_no_results: 'No se encontraron criptomonedas que coincidan con la búsqueda.',
      btn_view_details: 'Ver detalles',

      // Coin Detail Modal
      modal_stat_price: 'Precio',
      modal_stat_change: 'Cambio 24h',
      modal_stat_mcap: 'Cap. Mercado',
      modal_stat_volume: 'Volumen 24h',
      modal_stat_ath: 'ATH',
      modal_chart_title: 'Evolución de Precio',
      modal_buy_cta: '🛒 Comprar esta cripto',

      // Timeframes
      tf_1m: '1 Min',
      tf_5m: '5 Min',
      tf_15m: '15 Min',
      tf_1h: '1 Hora',
      tf_1w: '1 Sem',
      tf_1mo: '1 Mes',

      // Portfolio Section
      portfolio_badge: 'SIMULADOR DE TRADING REALISTA',
      portfolio_title: 'Simulador de Portfolio Virtual',
      portfolio_subtitle: 'Practica trading con $10,000 USD virtuales a precios reales de mercado, con Stop Loss y Take Profit automatizado.',
      stat_cash_balance: 'Efectivo Disponible',
      stat_crypto_value: 'Valor en Criptos',
      stat_total_value: 'Portfolio Total',
      stat_unrealized_pnl: 'P&L No Realizado',
      btn_reset_portfolio: '🔄 Reiniciar $10,000 USD',

      // Buy Form
      buy_title: 'Comprar Criptomoneda',
      buy_search_label: 'Buscar Cripto',
      buy_search_placeholder: 'Buscar por nombre o símbolo...',
      buy_amount_label: 'Cantidad en USD',
      buy_amount_placeholder: 'Monto a comprar en USD',
      btn_buy_execute: '🛒 Comprar Criptomoneda',

      // Stop Loss & Take Profit in Buy Form
      sltp_toggle: '🛡️ Configurar Stop Loss & Take Profit (Opcional)',
      sltp_label_sl: '🛡️ Stop Loss ($)',
      sltp_label_tp: '🎯 Take Profit ($)',
      sltp_ph_sl: 'Límite de pérdida en $',
      sltp_ph_tp: 'Objetivo ganancia en $',
      sltp_notice: '⚡ Si el precio de mercado alcanza estos niveles, la orden se ejecutará y venderá automáticamente.',

      // Holdings & History
      holdings_title: 'Mis Posiciones',
      no_holdings: 'No tienes posiciones abiertas. Busca una moneda en el panel izquierdo para comprar.',
      history_title: '📋 Historial de Transacciones',
      no_history: 'No hay transacciones registradas todavía.',
      btn_sell: 'Vender',
      btn_edit_sltp: 'Editar SL/TP',

      // Sell Modal
      sell_modal_title: 'Vender Criptomoneda',
      sell_current_price: 'Precio Actual:',
      sell_total_balance: 'En Cartera:',
      sell_total_value: 'Valor Total:',
      sell_amount_label: 'Cantidad a Vender:',
      sell_estimated_receive: 'Total a recibir:',
      sell_estimated_pnl: 'PnL estimado (Ganancia/Pérdida):',
      sell_remaining_balance: 'Saldo restante en cartera:',
      sell_btn_confirm: '🔥 Confirmar Venta',
      sell_btn_cancel: 'Cancelar',

      // Edit SL/TP Modal
      edit_sltp_title: 'Configurar SL / TP',
      current_price_label: 'Precio Actual:',
      buy_price_label: 'Precio de Compra:',
      no_sl_ph: 'Sin Stop Loss',
      no_tp_ph: 'Sin Take Profit',
      btn_save_targets: '💾 Guardar Objetivos',
      btn_cancel: 'Cancelar',
      sltp_modal_note: 'Las órdenes se ejecutan y cierran la posición automáticamente en cuanto el mercado alcance estos precios.',

      // Premium Section
      premium_banner_badge: 'SUITE CUANTITATIVA INSTITUCIONAL',
      premium_title: 'Análisis Cuantitativo en Tiempo Real',
      premium_subtitle: 'Acceso a algoritmos propietarios, sentimiento de mercado automatizado, informes diarios y zonas clave de soporte y resistencia.',
      feat_fg_title: 'Índice Fear & Greed',
      feat_fg_desc: 'Sentimiento de mercado calculado a partir de la amplitud del mercado y momentum.',
      feat_signals_title: 'Señales Técnicas',
      feat_signals_desc: 'RSI, Golden Crosses y rupturas de rango detectadas en tiempo real.',
      feat_sr_title: 'Soportes & Resistencias',
      feat_sr_desc: 'Cálculo de pivotes y zonas institucionales de acumulación de órdenes.',
      feat_dom_title: 'Dominancia & Liquidez',
      feat_dom_desc: 'Análisis de rotación de capital institucional entre Bitcoin y el mercado de Altcoins.',

      // Premium Unlock Box
      unlock_box_title: '🔑 Desbloquear Acceso a la Zona Premium',
      unlock_box_desc: 'Accede a algoritmos cuantitativos en tiempo real, señales técnicas avanzadas y niveles clave de mercado. Desbloquea tu acceso mediante la simulación interactiva de Stripe o activa tu prueba gratuita de 7 días.',
      unlock_ph_key: 'Introduce tu clave de licencia...',
      unlock_btn: '🔓 Desbloquear',
      unlock_error: 'Clave no válida. Prueba la simulación interactiva con Stripe.',
      unlock_btn_stripe: '🧪 Simular Suscripción con Stripe',
      unlock_btn_trial: '✨ Iniciar Prueba Demo (7 Días)',

      // Premium Unlocked Active View
      badge_pro_active: '👑 MEMBRESÍA PREMIUM ACTIVA',
      badge_pro_lifetime: '👑 MEMBRESÍA PRO ACTIVA (VITALICIA)',
      btn_lock_session: '🔒 Bloquear de nuevo',
      badge_live: 'EN VIVO',
      badge_updated: 'ACTUALIZADO',
      badge_today: 'HOY',
      fear_greed_card_title: '🌡️ Fear & Greed Index',
      fg_scale_0: '0 Miedo Extremo',
      fg_scale_50: '50 Neutral',
      fg_scale_100: '100 Codicia Extrema',
      fg_footer_note: 'El sentimiento actual favorece la continuación de la tendencia alcista con baja presión de venta en exchanges.',
      dom_card_title: '📊 Dominancia & Flujo Institucional',
      dom_altcoins: 'Altcoins & Stablecoins',
      dom_footer_note: 'Fase de consolidación en Bitcoin. Las altcoins de gran capitalización muestran entradas de liquidez sostenida.',
      signals_card_title: '🎯 Señales Cuantitativas & Niveles Clave (Top Activos)',
      signals_card_subtitle: 'Cálculo algorítmico basado en RSI (14), Medias Móviles Exponenciales y Volatilidad ATR.',
      badge_pro_signals: 'PRO SIGNALS',
      col_price_curr: 'Precio Actual',
      col_rsi: 'RSI (14)',
      col_trend_emas: 'Tendencia (EMAs)',
      col_support: 'Soporte Clave',
      col_resistance: 'Resistencia Clave',
      col_verdict: 'Veredicto Algorítmico',
      opp_radar_title: '🚨 Radar de Oportunidades & Patrones Detectados Hoy',
      macro_report_title: '📑 Informe Ejecutivo Diario del Mercado',
      macro_summary: '<strong>Resumen de Mercado:</strong> Los activos de primera línea mantienen una estructura técnica constructiva. La absorción de órdenes de venta en la zona de soporte institucional de Bitcoin sugiere acumulación por parte de grandes tenedores.',
      macro_takeaway_1: '<strong>Nivel de invalidación alcista:</strong> Mantener cierres diarios por encima de soporte clave.',
      macro_takeaway_2: '<strong>Zona de toma de beneficios:</strong> Próxima zona de resistencia técnica para rebalanceo de posiciones.',
      macro_takeaway_3: '<strong>Ratio Riesgo/Beneficio:</strong> Favorable para estrategias de acumulación progresiva (DCA).',
      report_card_title: '📊 Informe Diario Institucional',
      report_card_desc: 'Análisis cuantitativo generado automáticamente con datos de mercado en tiempo real',
      btn_generate_report: '⚡ Generar Informe',
      btn_regenerate_report: '🔄 Regenerar Informe',
      btn_generating_report: '⏳ Generando...',
      report_placeholder_p1: 'Haz clic en <strong>⚡ Generar Informe</strong> para producir el análisis institucional del mercado con los datos en tiempo real cargados en la plataforma.',
      report_placeholder_p2: 'El informe se actualiza con cada regeneración usando los precios y métricas más recientes.',
      trial_expired_title: 'Tu periodo de prueba de 7 días ha finalizado.',
      trial_expired_desc: 'Para seguir utilizando las señales técnicas e informes institucionales, suscríbete mediante Stripe.',
      btn_trial_expired: '⛔ Prueba de 7 Días Caducada',
      btn_trial_start: '✨ Iniciar Prueba Demo (7 Días)',

      // Pricing & Plans Tab
      pricing_badge: 'PLANES & LICENCIAS PRO',
      pricing_title: 'Potencia tu Trading Cuantitativo',
      pricing_subtitle: 'Elige el plan ideal para acceder a señales algorítmicas en tiempo real, informes institucionales diarios y simulador de trading con Stop Loss & Take Profit automatizado.',
      sim_notice_badge: '🧪 ENTORNO DE PRUEBAS / SIMULACIÓN STRIPE',
      sim_notice_text: 'Estamos en fase piloto: la pasarela Stripe está completamente simulada para que pruebes los planes y actives todas las herramientas PRO al instante, sin cobros reales ni necesidad de cuenta.',

      // Plan Cards
      plan_monthly_name: 'Plan Pro Mensual',
      plan_monthly_desc: 'Flexibilidad total sin permanencia',
      plan_monthly_period: '/mes',
      btn_monthly: '🧪 Simular $9.99 / mes',

      plan_annual_name: 'Plan Pro Anual',
      plan_annual_desc: 'El plan más elegido por traders activos',
      plan_annual_badge: '⭐ MÁS POPULAR',
      plan_annual_period: '/año',
      plan_annual_savings: '🔥 Ahorras un 42% ($5.83/mes)',
      btn_annual: '🧪 Simular $69.99 / año (Stripe)',

      plan_lifetime_name: 'Licencia Vitalicia VIP',
      plan_lifetime_desc: 'Acceso ilimitado para siempre',
      plan_lifetime_period: 'pago único',
      plan_lifetime_badge: '👑 Acceso Permanente',
      btn_lifetime: '🧪 Simular Licencia VIP ($149.99)',

      // Features
      feat_signals_bullet: 'Señales cuantitativas en tiempo real (RSI, MA Cross)',
      feat_fg_bullet: 'Índice Fear & Greed en vivo',
      feat_sr_bullet: 'Soportes y resistencias calculadas',
      feat_sim_bullet: 'Simulador con Stop Loss y Take Profit',
      feat_charts_bullet: 'Gráficos interactivos multi-temporalidad',
      feat_all_monthly: 'Todo lo incluido en el Plan Mensual',
      feat_daily_reports: 'Generador de Informes Institucionales diarios',
      feat_radar: 'Radar de oportunidades y rupturas de rango',
      feat_updates: 'Actualizaciones automáticas prioritarias',
      feat_priority_support: 'Soporte técnico preferente',
      feat_lifetime_access: 'Acceso ilimitado de por vida',
      feat_no_renewals: 'Sin cuotas mensuales ni renovaciones',
      feat_future_updates: 'Todas las características futuras incluidas',
      feat_transferable_key: 'Clave de licencia VIP personal transferible',
      feat_vip_support: 'Soporte VIP directo',

      // Trust Box
      trust_title: '🔒 Pasarela de Pago Segura con Encriptación SSL de 256 bits',
      trust_desc: 'Tus datos viajan cifrados y no se almacenan en nuestros servidores. Pagos procesados por Stripe Payments Europe, Ltd.',

      // Highlights Grid (Bottom of Plans)
      highlight_top50_title: 'Top 50 en Vivo',
      highlight_top50_desc: 'Monitoreo continuo de los activos con mayor volumen y capitalización.',
      highlight_gainers_title: 'Ganadores del Día',
      highlight_gainers_desc: 'Detección en tiempo real de mayores subidas porcentuales.',
      highlight_sltp_title: 'Stop Loss & Take Profit',
      highlight_sltp_desc: 'Ejecución automática de órdenes para proteger beneficios y limitar riesgos.',
      highlight_quant_title: 'Análisis Cuantitativo',
      highlight_quant_desc: 'Señales algorítmicas, zonas de soporte/resistencia y sentimiento de mercado.',

      // Stripe Checkout Modal
      stripe_modal_title: 'Simulación de Pasarela de Pago',
      stripe_sandbox_pill: '🧪 Modo Pruebas',
      stripe_test_banner: '⚡ TEST SANDBOX ACTIVO',
      stripe_test_desc: 'Simula el cobro y activa el acceso PRO sin cargos reales.',
      btn_autofill_card: '⚡ Rellenar tarjeta de prueba (Testnet 4242)',
      label_card_name: 'Titular de la Tarjeta',
      ph_card_name: 'Ej. Trader Demo PRO',
      label_card_email: 'Correo Electrónico para Factura Simulada',
      label_card_number: 'Número de Tarjeta',
      label_card_exp: 'Caducidad',
      ph_card_exp: 'MM/AA (ej. 12/28)',
      label_card_cvc: 'CVC',
      stripe_guarantee: '🧪 Simulación interactiva de Stripe para periodo de pruebas. Los activos y funciones PRO se activan inmediatamente en local.',
      btn_stripe_pay: '🧪 Simular Pago Aprobado',
      btn_stripe_pay_text: '🧪 Simular Pago Aprobado',

      // Glossary Section
      glossary_badge: 'GUÍA PARA PRINCIPIANTES & EXPERTOS',
      glossary_title: '📖 Vocabulario Cripto Sencillo',
      glossary_subtitle: 'Los conceptos y términos más importantes del mundo cripto explicados para personas normales, con ejemplos de la vida real y sin tecnicismos raros.',
      glossary_search_ph: 'Buscar término: ej. HODL, Wallet, Gas, Ballena, Bitcoin...',
      chip_all: '✨ Todos',
      chip_basics: '🧱 Conceptos Básicos',
      chip_trading: '📈 Mercado & Trading',
      chip_security: '🛡️ Seguridad & Carteras',
      chip_slang: '💬 Jerga & Slang',
      glossary_tab_all: '✨ Todos',
      glossary_tab_basics: '🧱 Conceptos Básicos',
      glossary_tab_trading: '📈 Mercado & Trading',
      glossary_tab_security: '🛡️ Seguridad & Carteras',
      glossary_tab_slang: '💬 Jerga & Slang',
      empty_holdings_title: 'Sin posiciones abiertas',
      empty_holdings_desc: 'Usa el formulario para comprar activos virtuales y empezar a operar.',
      no_sltp_set: 'Sin SL/TP configurado',
      glossary_empty_title: 'No encontramos ese término',
      glossary_empty_desc: 'Prueba con otra palabra o selecciona una categoría arriba.',
      glossary_in_real_life: 'En la vida real:',

      // Logros y Gamificación (ES)
      tab_achievements: '🏆 Logros',
      drawer_achievements: 'Logros y Medallas',
      ach_badge_pill: 'GAMIFICACIÓN & DISCIPLINA TRADING',
      ach_title: '🏆 Vitrina de Trofeos & Medallas',
      ach_subtitle: 'Recompensa y refuerza los hábitos profesionales de inversión: gestión de riesgo, diversificación, análisis técnico y disciplina psicológica.',
      ach_stats_unlocked: 'Desbloqueados',
      ach_stats_completion: 'Completado',
      ach_rank_label: 'Rango de Trader',
      ach_filter_all: '✨ Todas las Medallas',
      ach_filter_risk: '🛑 Riesgo y Psicología',
      ach_filter_strategy: '💼 Cartera y Estrategia',
      ach_filter_tech: '🕯️ Análisis Técnico',
      ach_status_unlocked: 'Desbloqueado el',
      ach_status_locked: 'Bloqueado / En Progreso',
      ach_progress_label: 'Progreso del Reto',

      // 11 Medallas (ES)
      ach_diamond_hands_title: 'Manos de Diamante',
      ach_diamond_hands_desc: 'Mantener una posición abierta que haya sufrido una caída no realizada de al menos un 10% durante más de 48h y cerrarla posteriormente en ganancia.',
      ach_stop_loss_master_title: 'Paracaídas Activado',
      ach_stop_loss_master_desc: 'Ejecutar con éxito una orden Stop Loss que corte pérdidas antes del 5% del valor de la posición.',
      ach_take_profit_pro_title: 'Toma de Ganancias',
      ach_take_profit_pro_desc: 'Vender al menos el 50% de una posición tras alcanzar más de un 15% de beneficio.',
      ach_zen_trader_title: 'Frialdad Zen',
      ach_zen_trader_desc: 'No operar durante 24h cuando el índice Fear & Greed sea < 20 (Miedo Extremo) o > 80 (Codicia Extrema).',
      ach_diversified_portfolio_title: 'Arquitecto Diversificado',
      ach_diversified_portfolio_desc: 'Tener al menos 5 activos diferentes en cartera sin que ninguno supere el 30% del balance total.',
      ach_dca_master_title: 'Maestro del DCA',
      ach_dca_master_desc: 'Realizar 3 compras consecutivas del mismo activo espaciadas en el tiempo.',
      ach_cash_shield_title: 'Refugio en Tormenta',
      ach_cash_shield_desc: 'Mantener al menos un 20% del balance total en liquidez/stablecoins durante una semana bajista.',
      ach_rsi_hunter_title: 'Cazador de Rebotes',
      ach_rsi_hunter_desc: 'Abrir una compra simulada cuando el RSI(14) esté por debajo de 30 y cerrarla en positivo.',
      ach_first_trade_title: 'Primer Paso Firme',
      ach_first_trade_desc: 'Completar la primera compra y venta con éxito.',
      ach_beat_btc_title: 'Superando al Rey',
      ach_beat_btc_desc: 'Superar el rendimiento porcentual mensual de Bitcoin.',
      ach_phoenix_restart_title: 'Ave Fénix',
      ach_phoenix_restart_desc: 'Utilizar el botón de reset de cartera tras pérdidas y volver a situar la cartera en positivo.',

      // Análisis Premium de Cartera (ES)
      port_prem_badge: 'ANÁLISIS INSTITUCIONAL & QUANT VIP',
      port_prem_title: '📊 Análisis Exhaustivo & Gráficos Cuantitativos de Cartera',
      port_prem_subtitle: 'Auditoría en tiempo real sobre tu diversificación, curva histórica de capital, ratio Sharpe y diagnóstico táctico inteligente de posiciones.',
      port_gate_title: 'Desbloquea los Gráficos Avanzados de tu Cartera',
      port_gate_desc: 'Accede a la curva de crecimiento del capital (Equity Curve), gráfico Donut de asignación de activos, matriz de riesgo Sharpe y recomendaciones tácticas automáticas.',
      port_gate_btn_unlock: '🧪 Activar Acceso PRO Gratis (Simulación Stripe)',
      port_gate_btn_demo: '⚡ Probar Demo 7 Días',
      port_health_score_label: 'Score de Salud de Cartera',
      port_kpi_sharpe: 'Ratio Sharpe Est.',
      port_kpi_sharpe_hint: 'Retorno ajustado al riesgo',
      port_kpi_maxdd: 'Max Drawdown Registrado',
      port_kpi_maxdd_hint: 'Retroceso máx. de capital',
      port_kpi_winrate: 'Tasa de Acierto (Win Rate)',
      port_kpi_diversification: 'Índice de Diversificación',
      port_kpi_div_hint: 'Riesgo no concentrado',
      chart_allocation_title: 'Distribución de Activos (Asset Allocation)',
      chart_donut_total: 'Valor Total',
      chart_equity_title: 'Curva Histórica de Capital (Equity Curve)',
      legend_equity_curve: 'Valor de Cartera',
      legend_baseline: 'Base Inicial ($10,000 USD)',
      chart_pnl_bars_title: 'Rendimiento Comparativo por Criptoactivo (P&L %)',
      port_insights_title: '🧠 Diagnóstico Táctico Global & Recomendaciones del Asesor',
      btn_reanalyze: '🔄 Reanalizar Cartera',
      empty_portfolio_charts: 'Aún no hay posiciones activas ni operaciones cerradas para auditar. Compra activos arriba para generar métricas cuantitativas.',
      port_conn_status: 'Conectado a Redes de Análisis en Tiempo Real:',
      port_deep_dive_title: '🔬 Análisis Técnico Exhaustivo de tus Criptoactivos en Cartera',
      port_deep_dive_subtitle: 'Diagnóstico cuantitativo detallado para cada una de tus posiciones abiertas, conectando indicadores técnicos en tiempo real (RSI, EMAs, Soportes/Resistencias) y enlaces directos a plataformas profesionales de análisis.',
      port_btn_reanalyze_live: '🔄 Reanalizar Cartera en Vivo',
      port_ext_portals: 'Conectar con Sitios de Análisis Profesional:',
      port_pre_holding_title: 'Análisis en Vivo de Activos Líderes (Mercado en Directo)',
      port_pre_holding_desc: 'Aún no tienes posiciones abiertas en tu simulador. Hemos conectado el análisis técnico exhaustivo en vivo de los activos de referencia (BTC, ETH, SOL) para que evalúes tus entradas:'
    }
  };

  // Detailed Glossary Bilingual Content
  var glossaryTerms = [
    {
      id: 'blockchain',
      category: 'basics',
      icon: '⛓️',
      en: {
        title: 'Blockchain',
        categoryName: 'Basics',
        def: 'An unforgeable digital ledger shared across thousands of computers worldwide. Each block of transactions is sealed cryptographically, making it impossible to erase or tamper with.',
        example: 'Like paying $10 to a friend while the entire neighborhood watches, writes it in their notebooks simultaneously, and no one can ever deny it.',
        keywords: 'blockchain block chain ledger decentralized network nodes decentralized'
      },
      es: {
        title: 'Blockchain (Cadena de Bloques)',
        categoryName: 'Básico',
        def: 'Es un libro de cuentas digital e incorruptible compartido entre miles de ordenadores en todo el mundo. Cada bloque de transacciones se sella matemáticamente y nadie puede borrarlo ni modificarlo.',
        example: 'Como si cuando le pagas 10€ a un amigo, todos los vecinos del barrio lo vieran, lo apuntaran en su libreta a la vez y nadie pudiera mentir jamás.',
        keywords: 'blockchain cadena bloques libro contable decentralizacion red nodos'
      }
    },
    {
      id: 'cryptocurrency',
      category: 'basics',
      icon: '🪙',
      en: {
        title: 'Cryptocurrency',
        categoryName: 'Basics',
        def: '100% digital money that does not rely on central banks, governments, or private corporations. Its security is guaranteed by advanced math and cryptography.',
        example: 'Digital bills with unique serial numbers that you can transfer anywhere across the globe in minutes without asking any bank for permission.',
        keywords: 'cryptocurrency crypto digital money currency satoshi'
      },
      es: {
        title: 'Criptomoneda',
        categoryName: 'Básico',
        def: 'Dinero 100% digital que no depende de bancos centrales, gobiernos ni empresas privadas. Su seguridad se garantiza mediante matemáticas avanzadas y criptografía.',
        example: 'Billetes digitales con número de serie único que puedes enviar a la otra punta del mundo en minutos sin pedirle permiso ni explicaciones a ningún banco.',
        keywords: 'criptomoneda moneda dinero digital crypto satoshi'
      }
    },
    {
      id: 'bitcoin',
      category: 'basics',
      icon: '₿',
      en: {
        title: 'Bitcoin (BTC)',
        categoryName: 'Basics',
        def: 'The first and largest cryptocurrency in history, invented in 2009 by Satoshi Nakamoto. Capped at a strict limit of 21 million coins, with no more ever being produced.',
        example: 'The "Digital Gold". People buy it as a long-term store of value because no government or politician can print more of it at will.',
        keywords: 'bitcoin btc satoshi digital gold scarcity 21 million'
      },
      es: {
        title: 'Bitcoin (BTC)',
        categoryName: 'Básico',
        def: 'La primera y más grande criptomoneda de la historia, inventada en 2009 por Satoshi Nakamoto. Tiene un límite estricto de 21 millones de unidades y jamás habrá más.',
        example: 'El «oro digital». Es reserva de valor porque su cantidad está limitada y ningún político puede pulsar un botón para fabricar más y devaluarlo.',
        keywords: 'bitcoin btc satoshi oro digital escasez 21 millones'
      }
    },
    {
      id: 'altcoin',
      category: 'basics',
      icon: '🚀',
      en: {
        title: 'Altcoin (Alternative Coin)',
        categoryName: 'Basics',
        def: 'Any cryptocurrency that is not Bitcoin (short for Alternative Coin). Famous examples include Ethereum, Solana, Cardano, and Ripple.',
        example: 'If Bitcoin is gold, altcoins are like shares in young tech companies: they can grow much faster, but carry higher risk.',
        keywords: 'altcoin alternative coin ethereum solana cardano ripple tokens'
      },
      es: {
        title: 'Altcoin (Moneda Alternativa)',
        categoryName: 'Básico',
        def: 'Cualquier criptomoneda que no sea Bitcoin (viene de Alternative Coin). Ejemplos famosos son Ethereum, Solana, Cardano o Ripple.',
        example: 'Si Bitcoin es el oro, las altcoins son como acciones de empresas tecnológicas jóvenes: pueden crecer mucho más rápido, pero con más riesgo.',
        keywords: 'altcoin moneda alternativa ethereum solana cardano'
      }
    },
    {
      id: 'ethereum',
      category: 'basics',
      icon: '💎',
      en: {
        title: 'Ethereum (ETH) & Smart Contracts',
        categoryName: 'Basics',
        def: 'A global decentralized computer that executes Smart Contracts: automated programs that fulfill contractual agreements on their own without human middlemen.',
        example: 'Like a vending machine: insert the money and press the button, and the drink drops out automatically. No clerk or lawyer needed.',
        keywords: 'ethereum eth smart contracts vitalik dapps decentralized code'
      },
      es: {
        title: 'Ethereum (ETH) & Smart Contracts',
        categoryName: 'Básico',
        def: 'Plataforma que inventó los «Contratos Inteligentes»: programas que se ejecutan solos sin fallar cuando se cumplen ciertas condiciones programadas.',
        example: 'Como una máquina de refrescos: si introduces el dinero y pulsas el botón, la lata sale sola. No necesitas un empleado ni un notario delante.',
        keywords: 'ethereum eth smart contracts contratos inteligentes vitalik dapps'
      }
    },
    {
      id: 'exchange',
      category: 'basics',
      icon: '🏢',
      en: {
        title: 'Exchange (Crypto Exchange)',
        categoryName: 'Basics',
        def: 'An online platform or app where you can buy, sell, or trade cryptocurrencies using fiat money (USD/EUR) or other crypto assets (e.g., Binance, Coinbase, Kraken).',
        example: 'The currency exchange booth at the airport where you swap euros for dollars, but in your smartphone app with fractional fees.',
        keywords: 'exchange crypto exchange binance coinbase kraken trading buy sell'
      },
      es: {
        title: 'Exchange (Casa de Cambio)',
        categoryName: 'Básico',
        def: 'Plataforma en línea donde puedes comprar, vender o cambiar criptomonedas usando euros, dólares o tus tarjetas (por ejemplo Binance, Coinbase o Kraken).',
        example: 'La casa de cambio del aeropuerto donde cambias euros por dólares antes de viajar, pero en tu móvil y con comisiones mucho más bajas.',
        keywords: 'exchange casa cambio binance coinbase kraken comprar vender'
      }
    },
    {
      id: 'gasfee',
      category: 'basics',
      icon: '⛽',
      en: {
        title: 'Gas Fee (Network Fee)',
        categoryName: 'Basics',
        def: 'The small fee paid to network validators or miners to process, verify, and permanently include your transaction in the blockchain.',
        example: 'A highway toll: when traffic congestion is heavy, the toll rate increases for drivers who want priority clearance.',
        keywords: 'gas fee network fee transaction cost miners validators ethereum'
      },
      es: {
        title: 'Gas Fee (Comisión de Red)',
        categoryName: 'Básico',
        def: 'La pequeña comisión que pagas a los ordenadores de la red para que procesen, verifiquen y confirmen tu transacción.',
        example: 'Como el peaje de una autopista: si la carretera está saturada de tráfico, el peaje sube de precio para quien quiera pasar más rápido.',
        keywords: 'gas fee comision red tarifa transaccion mineros'
      }
    },
    {
      id: 'halving',
      category: 'basics',
      icon: '✂️',
      en: {
        title: 'Halving (Supply Cut Event)',
        categoryName: 'Basics',
        def: 'A pre-programmed event occurring every 4 years in Bitcoin that cuts newly minted coin rewards in half, creating structural supply scarcity.',
        example: 'Imagine a gold mine where suddenly every 4 years miners can only extract half as many nuggets. Supply drops, driving scarcity higher.',
        keywords: 'halving supply cut mining 4 years scarcity cycle bitcoin'
      },
      es: {
        title: 'Halving (Reducción a la Mitad)',
        categoryName: 'Básico',
        def: 'Evento programado en Bitcoin que ocurre cada 4 años donde la cantidad de nuevos bitcoins que se crean al día se reduce exactamente al 50%.',
        example: 'Imagina que en una mina de oro cada cuatro años solo se pudiera extraer la mitad de pepitas. Al haber menos producto nuevo, su valor tiende a subir.',
        keywords: 'halving reduccion mineria 4 anos oferta escasez ciclo'
      }
    },
    {
      id: 'defi',
      category: 'basics',
      icon: '🏦',
      en: {
        title: 'DeFi (Decentralized Finance)',
        categoryName: 'Basics',
        def: 'Financial services (loans, high-yield deposits, peer-to-peer trading) governed directly by software code without commercial banks.',
        example: 'Lending money and earning monthly yield with someone on the other side of the planet, with repayment enforced strictly by a transparent smart contract.',
        keywords: 'defi decentralized finance lending yield borrowing banks'
      },
      es: {
        title: 'DeFi (Finanzas Descentralizadas)',
        categoryName: 'Básico',
        def: 'Servicios financieros (préstamos, depósitos con intereses, transferencias) gestionados por programas informáticos sin intervención de bancos tradicionales.',
        example: 'Prestar dinero a otra persona en cualquier rincón del mundo y cobrar intereses mensuales directamente, sin pedir cita en una sucursal bancaria.',
        keywords: 'defi finanzas descentralizadas prestamos intereses bancos'
      }
    },
    {
      id: 'stablecoin',
      category: 'trading',
      icon: '💵',
      en: {
        title: 'Stablecoin',
        categoryName: 'Trading',
        def: 'A cryptocurrency pegged 1-to-1 with the US Dollar (such as USDT or USDC), shielding users from wild market price fluctuations.',
        example: 'Your financial storm bunker: when prices crash, you convert volatile crypto into stablecoins to preserve your cash value intact.',
        keywords: 'stablecoin usdt usdc dollar peg safe haven fiat hedge'
      },
      es: {
        title: 'Stablecoin (Moneda Estable)',
        categoryName: 'Trading',
        def: 'Criptomoneda cuyo valor está fijado siempre a 1 dólar estadounidense (como USDT o USDC), por lo que su precio no sube ni baja de forma descontrolada.',
        example: 'Tu refugio antitormentas: cuando el mercado está cayendo con fuerza, cambias tus criptomonedas a Stablecoins para mantener a salvo tus dólares.',
        keywords: 'stablecoin moneda estable usdt usdc dolar refugio'
      }
    },
    {
      id: 'marketcap',
      category: 'trading',
      icon: '📊',
      en: {
        title: 'Market Cap (Market Capitalization)',
        categoryName: 'Trading',
        def: 'The total valuation of a cryptocurrency project, computed by multiplying the current token price by the circulating token supply.',
        example: 'Company size: a token worth $1 with 1 billion units is 10 times larger than a token worth $50 that only has 2 million units.',
        keywords: 'market cap capitalization valuation circulating supply total value'
      },
      es: {
        title: 'Market Cap (Capitalización de Mercado)',
        categoryName: 'Trading',
        def: 'El valor económico total de una criptomoneda. Se calcula multiplicando el precio de una moneda por la cantidad total de monedas en circulación.',
        example: 'Una moneda que vale 1$ pero tiene 1.000 millones de monedas es mucho más grande que una que vale 50$ pero solo tiene 10.000 monedas.',
        keywords: 'market cap capitalizacion mercado valor total tamano'
      }
    },
    {
      id: 'ath',
      category: 'trading',
      icon: '🏔️',
      en: {
        title: 'ATH (All-Time High)',
        categoryName: 'Trading',
        def: 'The highest historical price a cryptocurrency has ever recorded since the day it was created.',
        example: 'The highest summit of Mount Everest: the peak moment when anyone who had bought earlier was sitting in profit.',
        keywords: 'ath all time high record peak price summit'
      },
      es: {
        title: 'ATH (All-Time High / Máximo Histórico)',
        categoryName: 'Trading',
        def: 'El precio más alto al que ha cotizado una criptomoneda en toda su historia desde el día de su creación.',
        example: 'La cima más alta del monte Everest: el momento en el que cualquier persona que hubiera comprado antes estaba ganando dinero.',
        keywords: 'ath all time high maximo historico record precio'
      }
    },
    {
      id: 'volatility',
      category: 'trading',
      icon: '🎢',
      en: {
        title: 'Volatility',
        categoryName: 'Trading',
        def: 'How fast and violently an asset price swings up and down over short time horizons (hours or days).',
        example: 'A roller coaster: in crypto, +20% surges or -15% drops in a single day are commonplace, providing high opportunity with heightened risk.',
        keywords: 'volatility price swings risk roller coaster fluctuation'
      },
      es: {
        title: 'Volatilidad',
        categoryName: 'Trading',
        def: 'La velocidad y amplitud con la que oscila el precio de una moneda hacia arriba o hacia abajo en periodos muy cortos de tiempo.',
        example: 'Una montaña rusa: un día el precio puede subir un +25% y al día siguiente corregir un -12%. Ofrece grandes oportunidades pero requiere calma.',
        keywords: 'volatilidad variacion oscilacion subidas bajadas riesgo'
      }
    },
    {
      id: 'bullmarket',
      category: 'trading',
      icon: '🐂',
      en: {
        title: 'Bull Market (Uptrend)',
        categoryName: 'Trading',
        def: 'An extended period when almost all crypto asset prices surge with strong momentum and investor optimism turns euphoric.',
        example: 'The bull thrusts upward with its horns: prices soar, social media celebrates profits, and money flows rapidly into the market.',
        keywords: 'bull market uptrend rally green euphoria surge'
      },
      es: {
        title: 'Bull Market (Mercado Alcista)',
        categoryName: 'Trading',
        def: 'Temporada donde la inmensa mayoría de criptomonedas suben con fuerza durante semanas o meses, y reina el optimismo generalizado entre los inversores.',
        example: 'El toro ataca empujando con sus cuernos de abajo hacia arriba: casi cualquier compra genera ganancias y el mercado está eufórico.',
        keywords: 'bull market mercado alcista toro subidas euforia'
      }
    },
    {
      id: 'bearmarket',
      category: 'trading',
      icon: '🐻',
      en: {
        title: 'Bear Market (Downtrend)',
        categoryName: 'Trading',
        def: 'A protracted season of declining asset prices, market apathy, and pessimism that can last months or years.',
        example: 'The bear swipes downward with its claws: prices sink and casual buyers disappear, but patient investors build positions for the next cycle.',
        keywords: 'bear market downtrend crypto winter crash drops panic'
      },
      es: {
        title: 'Bear Market (Mercado Bajista)',
        categoryName: 'Trading',
        def: 'Periodo prolongado (a menudo de varios meses o años) de caídas continuas de precios, pesimismo y desinterés general del público.',
        example: 'El oso ataca con sus garras de arriba hacia abajo: los precios bajan y es el momento en el que los inversores inteligentes compran barato para el futuro.',
        keywords: 'bear market mercado bajista oso caidas panico invierno'
      }
    },
    {
      id: 'sltp',
      category: 'trading',
      icon: '🛡️',
      en: {
        title: 'Stop Loss & Take Profit',
        categoryName: 'Trading',
        def: 'Automated order safety triggers: Stop Loss cuts losses if price falls below a limit; Take Profit locks in gains once the target is reached.',
        example: 'Your seatbelt and automated piggy bank: they protect your capital in sudden crashes and bank your profits while you sleep.',
        keywords: 'stop loss take profit sl tp risk management limit order exit'
      },
      es: {
        title: 'Stop Loss & Take Profit',
        categoryName: 'Trading',
        def: 'Órdenes automáticas programadas: el Stop Loss vende si el precio cae a un límite para no perder más; el Take Profit vende cuando llega a tu meta para asegurar beneficios.',
        example: 'El cinturón de seguridad y la hucha automática: te salvan del choque si el precio se desploma y guardan tus ganancias mientras duermes.',
        keywords: 'stop loss take profit sl tp riesgo limitar perdidas asegurar ganancias'
      }
    },
    {
      id: 'wallet',
      category: 'security',
      icon: '👛',
      en: {
        title: 'Crypto Wallet',
        categoryName: 'Security',
        def: 'Software or physical device that stores the cryptographic private keys granting you sovereign control over your blockchain funds.',
        example: 'Like your personal Swiss bank account, where you are the sole director and no authority can freeze or withhold your funds.',
        keywords: 'wallet crypto wallet custody keys address funds'
      },
      es: {
        title: 'Wallet (Billetera / Cartera)',
        categoryName: 'Seguridad',
        def: 'Aplicación o dispositivo físico que custodia tus claves criptográficas y te permite consultar tu saldo, enviar y recibir criptomonedas de forma soberana.',
        example: 'Como tu cuenta del banco personal, con la ventaja de que tú eres el único dueño y ningún director de sucursal puede bloquearte o pedirte papeles.',
        keywords: 'wallet billetera cartera monedero custodio fondos'
      }
    },
    {
      id: 'keys',
      category: 'security',
      icon: '🔑',
      en: {
        title: 'Public Key vs. Private Key',
        categoryName: 'Security',
        def: 'The Public Key is your receiving address (safe to share). The Private Key is your secret password authorizing funds transfers (never shared!).',
        example: 'Your home mailbox: anyone can drop mail through the slot (public address), but only you hold the key to unlock the box and take the cash (private key).',
        keywords: 'public key private key address iban pin secret security'
      },
      es: {
        title: 'Clave Pública vs Clave Privada',
        categoryName: 'Seguridad',
        def: 'La Clave Pública es tu dirección para recibir fondos (la compartes con cualquiera). La Clave Privada es tu contraseña secreta para autorizar envíos (¡nunca la compartes!).',
        example: 'El buzón de tu portal: cualquiera puede meter una carta por la ranura (pública), pero solo tú tienes la llave para abrirlo y sacar el dinero (privada).',
        keywords: 'clave publica direccion iban clave privada pin contrasena secretos'
      }
    },
    {
      id: 'seedphrase',
      category: 'security',
      icon: '🌱',
      en: {
        title: 'Seed Phrase (Recovery Phrase)',
        categoryName: 'Security',
        def: 'A sequence of 12 or 24 random English words that acts as the master backup key to restore your entire wallet on any device.',
        example: 'The master blueprint of your vault. Anyone who sees these 12 words owns your funds. Write them on paper, never in cloud photos or notes.',
        keywords: 'seed phrase recovery phrase 12 words 24 words master backup'
      },
      es: {
        title: 'Frase Semilla (Seed Phrase)',
        categoryName: 'Seguridad',
        def: 'Lista de 12 o 24 palabras aleatorias en inglés que respaldan tu cartera completa. Si se rompe tu móvil u ordenador, con ellas restauras todo tu dinero en otro dispositivo.',
        example: 'La llave maestra universal de tu caja fuerte. Si alguien la ve, tiene todo tu dinero. Se escribe a mano en papel y se guarda en un sitio seguro.',
        keywords: 'frase semilla seed phrase 12 palabras 24 palabras backup recuperacion'
      }
    },
    {
      id: 'coldwallet',
      category: 'security',
      icon: '🧊',
      en: {
        title: 'Cold Wallet (Hardware Wallet)',
        categoryName: 'Security',
        def: 'A dedicated physical device (such as Ledger or Trezor) keeping your private keys entirely isolated and offline away from hackers.',
        example: 'An underground steel safe: no online malware or cyber thief can penetrate it because it is physically air-gapped from the internet.',
        keywords: 'cold wallet hardware wallet ledger trezor offline airgapped'
      },
      es: {
        title: 'Cold Wallet (Cartera Fría / Hardware)',
        categoryName: 'Seguridad',
        def: 'Dispositivo físico similar a un USB (como Ledger o Trezor) que almacena tus claves completamente desconectadas de internet para blindarte ante hackers.',
        example: 'Una caja fuerte enterrada sin conexión de red: ningún pirata informático puede acceder a ella porque está desconectada físicamente del mundo digital.',
        keywords: 'cold wallet cartera fria ledger trezor hardware desconectado'
      }
    },
    {
      id: 'hotwallet',
      category: 'security',
      icon: '🔥',
      en: {
        title: 'Hot Wallet (Online App Wallet)',
        categoryName: 'Security',
        def: 'An internet-connected wallet app or browser extension (like MetaMask or Phantom), designed for swift, daily trading convenience.',
        example: 'Your daily pocket wallet: convenient for buying lunch and coffee on the go, but not where you leave your family fortune.',
        keywords: 'hot wallet online metamask phantom app extension mobile'
      },
      es: {
        title: 'Hot Wallet (Cartera Caliente)',
        categoryName: 'Seguridad',
        def: 'Billetera conectada a internet, generalmente una extensión del navegador o app móvil (como MetaMask o Phantom), ideal para operar en el día a día.',
        example: 'La cartera que llevas en el bolsillo con unos billetes para pagar el café y el almuerzo: práctica y rápida, pero no donde guardas todos tus ahorros.',
        keywords: 'hot wallet cartera caliente metamask phantom app movil extension'
      }
    },
    {
      id: 'hodl',
      category: 'slang',
      icon: '✊',
      en: {
        title: 'HODL (Hold On for Dear Life)',
        categoryName: 'Slang',
        def: 'The long-term investing ethos of never selling despite wild market downturns. Originated from a famous 2013 forum typo ("I AM HODLING").',
        example: 'Iron patience: not worrying if it rains today, knowing that the tree you planted will bear abundant fruit over the years.',
        keywords: 'hodl hold on for dear life long term investing patience diamond hands'
      },
      es: {
        title: 'HODL (Mantener a Largo Plazo)',
        categoryName: 'Jerga',
        def: 'Estrategia de guardar tus criptomonedas y no venderlas durante años, pase lo que pase con el precio a corto plazo. Nació de una errata ("I AM HODLING") en un foro de 2013.',
        example: 'Paciencia de titanio: no asustarse si hoy llueve, porque sabes que el árbol que plantaste dará frutos en unos años.',
        keywords: 'hodl hold mantener paciencia largo plazo no vender'
      }
    },
    {
      id: 'fomo',
      category: 'slang',
      icon: '😱',
      en: {
        title: 'FOMO (Fear Of Missing Out)',
        categoryName: 'Slang',
        def: 'The impulsive psychological urge to buy a coin that is already skyrocketing because you fear being left behind while others get rich.',
        example: 'Paying 10x ticket price to a scalper outside a sold-out concert because friends hyped it up, only to walk in just as the show ends.',
        keywords: 'fomo fear of missing out impulsive buying greed hype chase'
      },
      es: {
        title: 'FOMO (Miedo a Quedarse Fuera)',
        categoryName: 'Jerga',
        def: 'Fear Of Missing Out: la ansiedad impulsiva de comprar una criptomoneda que ya ha subido muchísimo porque ves a otros presumiendo ganancias y no quieres quedarte atrás.',
        example: 'Pagar una entrada abusiva a un revendedor en la puerta de una discoteca porque te dijeron que la fiesta es histórica, para entrar y que se acabe la música.',
        keywords: 'fomo fear missing out miedo quedarse fuera compras impulsivas euforia'
      }
    },
    {
      id: 'fud',
      category: 'slang',
      icon: '📰',
      en: {
        title: 'FUD (Fear, Uncertainty, and Doubt)',
        categoryName: 'Slang',
        def: 'Coordinated dissemination of negative or misleading news crafted to panic retail traders into dumping their holdings at lower prices.',
        example: 'Starting a town rumor that tap water will run out so frantic crowds rush to strip grocery store shelves empty.',
        keywords: 'fud fear uncertainty doubt fake news rumors panic dumping'
      },
      es: {
        title: 'FUD (Miedo, Incertidumbre y Duda)',
        categoryName: 'Jerga',
        def: 'Fear, Uncertainty and Doubt: rumores negativos o noticias sensacionalistas diseñadas para asustar al público y provocar ventas por pánico para que los precios caigan.',
        example: 'Difundir el rumor en un pueblo de que se va a cortar el agua para que la gente salga corriendo histérica a vaciar los supermercados.',
        keywords: 'fud fear uncertainty doubt noticias falsas rumores panico'
      }
    },
    {
      id: 'whale',
      category: 'slang',
      icon: '🐋',
      en: {
        title: 'Whale (Market Whale)',
        categoryName: 'Slang',
        def: 'An individual or fund possessing massive cryptocurrency holdings whose buy or sell orders single-handedly move market prices.',
        example: 'If a small fish splashes in a pool, no one notices; but if an enormous blue whale cannonballs in, it creates a tidal wave.',
        keywords: 'whale market whale big holders institutional funds volume'
      },
      es: {
        title: 'Ballena (Whale)',
        categoryName: 'Jerga',
        def: 'Un inversor individual o fondo que tiene tantísimas criptomonedas que sus compras o ventas mueven el precio de todo el mercado de golpe.',
        example: 'Si un pez pequeño se mueve en la piscina nadie lo nota; pero si una ballena salta, crea una ola gigante que salpica a todos los bañistas.',
        keywords: 'ballena whale grandes inversores fondos mover mercado volumen'
      }
    },
    {
      id: 'airdrop',
      category: 'slang',
      icon: '🪂',
      en: {
        title: 'Airdrop (Free Token Distribution)',
        categoryName: 'Slang',
        def: 'Free token rewards deposited directly into early user wallets to bootstrap adoption and reward early protocol testers.',
        example: 'Free promotional samples distributed by a brand so you test their new product and spread positive word of mouth.',
        keywords: 'airdrop free tokens reward distribution community promo'
      },
      es: {
        title: 'Airdrop (Regalo de Tokens)',
        categoryName: 'Jerga',
        def: 'Distribución gratuita de criptomonedas directamente en la cartera de los usuarios para premiar que probaron una plataforma nueva y para darse a conocer.',
        example: 'Las muestras gratuitas de perfume o producto que te regalan en una tienda para que lo pruebes y se lo cuentes a tus conocidos.',
        keywords: 'airdrop regalo tokens gratis premio comunidad marketing'
      }
    }
  ];

  // Universal Hash Routing (Works perfectly in Vercel, iOS, and Android without splitting files)
  function getLangFromHash() {
    var h = window.location.hash.toLowerCase();
    if (h === '#/en' || h === '#/ing' || h === '#/english') return 'en';
    if (h === '#/es' || h === '#/spa' || h === '#/espanol') return 'es';
    return null;
  }

  // Determine initial language
  var currentLanguage = getLangFromHash() || localStorage.getItem(STORAGE_KEY) || 'en';

  // Ensure URL has the language hash on load
  if (!getLangFromHash()) {
    window.history.replaceState(null, null, '#/' + currentLanguage);
  }

  function t(key) {
    var langObj = translations[currentLanguage] || translations.en;
    if (langObj && langObj[key] !== undefined) {
      return langObj[key];
    }
    // Fallback to English
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return key;
  }

  function getLanguage() {
    return currentLanguage;
  }

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'es') lang = 'en';
    
    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    
    // Update URL hash synchronously for native app shell compat
    var newHash = '#/' + lang;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, null, newHash);
    }

    applyTranslations();

    // Trigger custom event so any component can listen and re-render
    var event = new CustomEvent('languageChanged', { detail: { lang: lang } });
    window.dispatchEvent(event);
  }

  // Listen to browser navigation (back/forward arrows or manual URL typing)
  window.addEventListener('hashchange', function() {
    var hashLang = getLangFromHash();
    if (hashLang && hashLang !== currentLanguage) {
      setLanguage(hashLang);
    }
  });

  function applyTranslations() {
    // 1. Text content elements [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (val) {
        el.textContent = val;
      }
    });

    // 2. Placeholders [data-i18n-ph]
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-ph');
      var val = t(key);
      if (val) {
        el.placeholder = val;
      }
    });

    // 3. Titles / tooltips [data-i18n-title]
    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-title');
      var val = t(key);
      if (val) {
        el.title = val;
      }
    });

    // 4. HTML content elements [data-i18n-html]
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      var val = t(key);
      if (val) {
        el.innerHTML = val;
      }
    });

    // 5. Update language selectors UI (active states, labels & checks)
    updateLanguageSelectorUI();

    // 6. Update dynamic Glossary cards
    renderBilingualGlossary();
  }

  function updateLanguageSelectorUI() {
    var isEn = currentLanguage === 'en';
    var shortName = isEn ? 'English' : 'Español';
    var fullName = isEn ? 'English (EN)' : 'Español (ES)';

    // Desktop header tab label
    var tabCurrent = document.getElementById('lang-tab-current');
    if (tabCurrent) {
      tabCurrent.textContent = shortName;
    }
    var currentLabel = document.getElementById('current-lang-label');
    if (currentLabel) {
      currentLabel.textContent = fullName;
    }

    // Toggle buttons & checkmarks in dropdown & mobile drawer
    document.querySelectorAll('.lang-btn, .lang-toggle-btn, .lang-dropdown-item, .drawer-lang-btn, .mobile-lang-btn').forEach(function(btn) {
      var btnLang = btn.getAttribute('data-lang');
      if (btnLang) {
        var isActive = (btnLang === currentLanguage);
        btn.classList.toggle('active', isActive);
        var checkEl = btn.querySelector('.lang-check');
        if (checkEl) {
          checkEl.textContent = isActive ? '✓' : '';
        }
      }
    });
  }

  function setupLanguageSwitcherEvents() {
    // Header dropdown button toggle
    var langTabBtn = document.getElementById('lang-tab-btn');
    var langContainer = document.getElementById('lang-tab-container');

    if (langTabBtn && langContainer) {
      langTabBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = langContainer.classList.toggle('open');
        langTabBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Close header dropdown on clicking outside
    document.addEventListener('click', function(e) {
      if (langContainer && !langContainer.contains(e.target)) {
        langContainer.classList.remove('open');
        if (langTabBtn) langTabBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Delegated click handler for any language choice button
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-lang]');
      if (!btn) return;
      var newLang = btn.getAttribute('data-lang');
      if (newLang === 'en' || newLang === 'es') {
        e.preventDefault();
        setLanguage(newLang);
        if (langContainer) {
          langContainer.classList.remove('open');
          if (langTabBtn) langTabBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  function renderBilingualGlossary() {
    var grid = document.getElementById('glossary-grid');
    if (!grid) return;

    var lang = currentLanguage;
    var cards = grid.querySelectorAll('.glossary-card');

    cards.forEach(function(card) {
      var termId = card.getAttribute('data-term-id');
      var termData = glossaryTerms.find(function(item) { return item.id === termId; });
      if (!termData) return;

      var content = termData[lang] || termData.en;
      card.setAttribute('data-keywords', content.keywords);

      var titleEl = card.querySelector('h3');
      if (titleEl) titleEl.textContent = content.title;

      var pillEl = card.querySelector('.glossary-category-pill');
      if (pillEl) pillEl.textContent = content.categoryName;

      var defEl = card.querySelector('.glossary-def');
      if (defEl) defEl.textContent = content.def;

      var exDiv = card.querySelector('.glossary-example div');
      if (exDiv) {
        exDiv.innerHTML = '<strong>' + t('glossary_in_real_life') + '</strong> ' + content.example;
      }
    });
  }

  // Public API
  window.I18n = {
    t: t,
    getLanguage: getLanguage,
    setLanguage: setLanguage,
    applyTranslations: applyTranslations,
    getGlossaryTerms: function() { return glossaryTerms; }
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyTranslations();
      setupLanguageSwitcherEvents();
    });
  } else {
    applyTranslations();
    setupLanguageSwitcherEvents();
  }

})(window);
