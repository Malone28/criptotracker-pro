window.Simulator = (function() {
  'use strict';
  
  const STORAGE_KEY_HOLDINGS = 'criptotracker_holdings';
  const STORAGE_KEY_HISTORY = 'criptotracker_history';
  const STORAGE_KEY_BALANCE = 'criptotracker_balance';
  const INITIAL_BALANCE = 10000;
  
  let balance = INITIAL_BALANCE;
  let holdings = [];  
  let history = [];   
  
  function load() {
    try {
      const storedBalance = localStorage.getItem(STORAGE_KEY_BALANCE);
      if (storedBalance !== null) balance = parseFloat(storedBalance);
      
      const storedHoldings = localStorage.getItem(STORAGE_KEY_HOLDINGS);
      if (storedHoldings) holdings = JSON.parse(storedHoldings);
      
      const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (storedHistory) history = JSON.parse(storedHistory);
    } catch (e) {
      console.warn("Failed to load simulator data:", e);
      balance = INITIAL_BALANCE;
      holdings = [];
      history = [];
    }
  }
  
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY_BALANCE, balance.toString());
      localStorage.setItem(STORAGE_KEY_HOLDINGS, JSON.stringify(holdings));
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save simulator data:", e);
    }
  }
  
  function getBalance() { return balance; }
  
  function getHoldings() { return holdings; }
  
  function getHistory() { return history; }
  
  function buy(coinId, coinName, coinSymbol, coinImage, amountUSD, pricePerCoin, stopLoss, takeProfit) {
    if (amountUSD <= 0) return { success: false, message: "El monto debe ser mayor a 0" };
    if (amountUSD > balance) return { success: false, message: "Saldo insuficiente" };
    if (pricePerCoin <= 0) return { success: false, message: "Precio de activo inválido" };
    
    const tokens = amountUSD / pricePerCoin;
    balance -= amountUSD;
    
    const slVal = (stopLoss !== null && stopLoss !== undefined && !isNaN(stopLoss) && Number(stopLoss) > 0) ? Number(stopLoss) : null;
    const tpVal = (takeProfit !== null && takeProfit !== undefined && !isNaN(takeProfit) && Number(takeProfit) > 0) ? Number(takeProfit) : null;
    
    const existing = holdings.find(h => h.coinId === coinId);
    if (existing) {
      const totalTokens = existing.amount + tokens;
      const totalCost = (existing.amount * existing.buyPrice) + amountUSD;
      existing.buyPrice = totalCost / totalTokens;
      existing.amount = totalTokens;
      existing.timestamp = Date.now();
      if (slVal !== null) existing.stopLoss = slVal;
      if (tpVal !== null) existing.takeProfit = tpVal;
    } else {
      holdings.push({
        coinId, coinName, coinSymbol, coinImage, 
        amount: tokens, buyPrice: pricePerCoin, 
        stopLoss: slVal, takeProfit: tpVal,
        timestamp: Date.now()
      });
    }
    
    history.push({
      type: 'buy', coinId, coinName, coinSymbol, 
      amount: tokens, price: pricePerCoin, total: amountUSD,
      stopLoss: slVal, takeProfit: tpVal,
      timestamp: Date.now()
    });
    
    save();
    return { success: true, tokens, message: `Compra exitosa: +${tokens.toFixed(6)} ${coinSymbol.toUpperCase()}` };
  }
  
  function setHoldingTargets(coinId, stopLoss, takeProfit) {
    const holding = holdings.find(h => h.coinId === coinId);
    if (!holding) return { success: false, message: "Posición no encontrada en cartera" };
    
    holding.stopLoss = (stopLoss !== null && stopLoss !== undefined && !isNaN(stopLoss) && Number(stopLoss) > 0) ? Number(stopLoss) : null;
    holding.takeProfit = (takeProfit !== null && takeProfit !== undefined && !isNaN(takeProfit) && Number(takeProfit) > 0) ? Number(takeProfit) : null;
    
    save();
    return { success: true, message: `Objetivos SL/TP actualizados para ${holding.coinName}` };
  }
  
  function sell(coinId, amountTokens, pricePerCoin) {
    if (amountTokens <= 0) return { success: false, message: "La cantidad debe ser mayor a 0" };
    if (pricePerCoin <= 0) return { success: false, message: "Precio de activo inválido" };
    
    const index = holdings.findIndex(h => h.coinId === coinId);
    if (index === -1) return { success: false, message: "Criptomoneda no encontrada en cartera" };
    
    const holding = holdings[index];
    if (amountTokens > holding.amount) return { success: false, message: "Cantidad de tokens insuficiente" };
    
    const totalUSD = amountTokens * pricePerCoin;
    const pnlUSD = (pricePerCoin - holding.buyPrice) * amountTokens;
    const pnlPercent = holding.buyPrice > 0 ? ((pricePerCoin - holding.buyPrice) / holding.buyPrice) * 100 : 0;
    balance += totalUSD;
    
    holding.amount -= amountTokens;
    if (holding.amount <= 0.0000001) {
      holdings.splice(index, 1);
    }
    
    history.push({
      type: 'sell', coinId, coinName: holding.coinName, coinSymbol: holding.coinSymbol, 
      amount: amountTokens, price: pricePerCoin, total: totalUSD,
      pnlUSD: pnlUSD, pnlPercent: pnlPercent,
      timestamp: Date.now()
    });
    
    save();
    return { success: true, totalUSD, message: `Venta exitosa: ${amountTokens.toFixed(6)} ${holding.coinSymbol.toUpperCase()} por $${totalUSD.toFixed(2)} USD` };
  }
  
  function checkTriggers(currentPrices) {
    if (!currentPrices || Object.keys(currentPrices).length === 0) return [];
    const triggeredEvents = [];
    
    const holdingsCopy = [...holdings];
    for (let i = 0; i < holdingsCopy.length; i++) {
      const h = holdingsCopy[i];
      const currentPrice = currentPrices[h.coinId];
      if (!currentPrice || isNaN(currentPrice) || currentPrice <= 0) continue;
      
      // 1. Check Stop Loss (Trigger when market price falls to or below stopLoss)
      if (h.stopLoss && h.stopLoss > 0 && currentPrice <= h.stopLoss) {
        const amountTokens = h.amount;
        const totalUSD = amountTokens * currentPrice;
        const pnlUSD = (currentPrice - h.buyPrice) * amountTokens;
        const pnlPercent = h.buyPrice > 0 ? ((currentPrice - h.buyPrice) / h.buyPrice) * 100 : 0;
        
        balance += totalUSD;
        const hIndex = holdings.findIndex(item => item.coinId === h.coinId);
        if (hIndex !== -1) holdings.splice(hIndex, 1);
        
        history.push({
          type: 'stop_loss',
          coinId: h.coinId,
          coinName: h.coinName,
          coinSymbol: h.coinSymbol,
          amount: amountTokens,
          price: currentPrice,
          triggerPrice: h.stopLoss,
          total: totalUSD,
          pnlUSD: pnlUSD,
          pnlPercent: pnlPercent,
          timestamp: Date.now()
        });
        
        triggeredEvents.push({
          type: 'stop_loss',
          coinId: h.coinId,
          coinName: h.coinName,
          coinSymbol: h.coinSymbol,
          amount: amountTokens,
          triggerPrice: h.stopLoss,
          sellPrice: currentPrice,
          totalUSD: totalUSD,
          pnlUSD: pnlUSD,
          pnlPercent: pnlPercent
        });
        
        save();
        continue;
      }
      
      // 2. Check Take Profit (Trigger when market price reaches or exceeds takeProfit)
      if (h.takeProfit && h.takeProfit > 0 && currentPrice >= h.takeProfit) {
        const amountTokens = h.amount;
        const totalUSD = amountTokens * currentPrice;
        const pnlUSD = (currentPrice - h.buyPrice) * amountTokens;
        const pnlPercent = h.buyPrice > 0 ? ((currentPrice - h.buyPrice) / h.buyPrice) * 100 : 0;
        
        balance += totalUSD;
        const hIndex = holdings.findIndex(item => item.coinId === h.coinId);
        if (hIndex !== -1) holdings.splice(hIndex, 1);
        
        history.push({
          type: 'take_profit',
          coinId: h.coinId,
          coinName: h.coinName,
          coinSymbol: h.coinSymbol,
          amount: amountTokens,
          price: currentPrice,
          triggerPrice: h.takeProfit,
          total: totalUSD,
          pnlUSD: pnlUSD,
          pnlPercent: pnlPercent,
          timestamp: Date.now()
        });
        
        triggeredEvents.push({
          type: 'take_profit',
          coinId: h.coinId,
          coinName: h.coinName,
          coinSymbol: h.coinSymbol,
          amount: amountTokens,
          triggerPrice: h.takeProfit,
          sellPrice: currentPrice,
          totalUSD: totalUSD,
          pnlUSD: pnlUSD,
          pnlPercent: pnlPercent
        });
        
        save();
      }
    }
    
    return triggeredEvents;
  }
  
  function getPortfolioValue(currentPrices) {
    if (!currentPrices) return 0;
    return holdings.reduce((total, holding) => {
      const currentPrice = currentPrices[holding.coinId] || holding.buyPrice;
      return total + (holding.amount * currentPrice);
    }, 0);
  }
  
  function getPnL(currentPrices) {
    if (!currentPrices) return 0;
    return holdings.reduce((total, holding) => {
      const currentPrice = currentPrices[holding.coinId] || holding.buyPrice;
      return total + ((currentPrice - holding.buyPrice) * holding.amount);
    }, 0);
  }
  
  function getHoldingPnL(holding, currentPrice) {
    const price = currentPrice || holding.buyPrice;
    const pnlUSD = (price - holding.buyPrice) * holding.amount;
    const pnlPercent = holding.buyPrice > 0 ? ((price - holding.buyPrice) / holding.buyPrice) * 100 : 0;
    return { pnlUSD, pnlPercent };
  }
  
  function reset() {
    balance = INITIAL_BALANCE;
    holdings = [];
    history = [];
    save();
  }
  
  load();
  
  return { 
    getBalance, 
    getHoldings, 
    getHistory, 
    buy, 
    sell, 
    setHoldingTargets,
    checkTriggers,
    getPortfolioValue, 
    getPnL, 
    getHoldingPnL, 
    reset 
  };
})();

