import { defineStore } from "pinia";

// sprema u local storage jer se inače na refresh obrišu podaci
const STORAGE_KEY = "book-explorer-favorites";

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load favorites from localStorage', e);
    return [];
  }
}

function saveFavorites(favs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
  }
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: loadFavorites()
  }),
  actions: {
    addFavorite(book) {
      if (!this.favorites.find(b => b.key === book.key)) {
        this.favorites.push(book);
        saveFavorites(this.favorites);
      }
    },
    removeFavorite(book) {
      this.favorites = this.favorites.filter(b => b.key !== book.key);
      saveFavorites(this.favorites);
    },
    clearFavorites() {
      this.favorites = [];
      saveFavorites(this.favorites);
    }
  }
})