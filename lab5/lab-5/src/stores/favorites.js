import { defineStore } from "pinia";

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: []
  }),
  actions: {
    addFavorite(book) {
      if (!this.favorites.find(b => b.key === book.key)) {
        this.favorites.push(book);
      }
    },
    removeFavorite(book) {
      this.favorites = this.favorites.filter(b => b.key !== book.key);
    }
  }
})