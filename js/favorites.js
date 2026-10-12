window.Favorites = (function() {
  'use strict';
  
  const STORAGE_KEY = 'criptotracker_favorites';
  let favorites = new Set();
  
  function load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        favorites = new Set(JSON.parse(stored));
      } else {
        favorites = new Set();
      }
    } catch(e) { 
      console.warn("Failed to load favorites:", e);
      favorites = new Set(); 
    }
  }
  
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
      if (window.CriptoAuth && window.CriptoAuth.saveCloudData) {
        window.CriptoAuth.saveCloudData();
      }
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  }
  
  function toggle(coinId) {
    if (favorites.has(coinId)) {
      favorites.delete(coinId);
    } else {
      favorites.add(coinId);
    }
    save();
    return favorites.has(coinId);
  }
  
  function isFavorite(coinId) { return favorites.has(coinId); }
  
  function getAll() { return [...favorites]; }
  
  function count() { return favorites.size; }
  
  load();
  
  return { toggle, isFavorite, getAll, count, reload: load };
})();
