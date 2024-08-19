import { createMovieCard } from "./movieCard.js";
import { debounce, displayNoResults } from "./utils.js";

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function fetchFavoriteMovies() {
  const allMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  displayMovies(allMovies.filter((movie) => favorites.includes(movie.id)));
}

function fetchSearchedMovies(query) {
  const allMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const filteredMovies = allMovies.filter(
    (movie) =>
      favorites.includes(movie.id) &&
      movie.title.toLowerCase().includes(query.toLowerCase())
  );
  displayMovies(filteredMovies, query);
}

function displayMovies(movies, searchQuery = "") {
  const favoritesGrid = document.getElementById("favoritesGrid");

  if (movies.length === 0) {
    displayNoResults(favoritesGrid, searchQuery, true);
  } else {
    favoritesGrid.classList.add("grid");
    favoritesGrid.innerHTML = "";
    movies.forEach((movie) => {
      const isFavorite = favorites.includes(movie.id);
      const movieCard = createMovieCard(movie, isFavorite, toggleFavorite);
      favoritesGrid.appendChild(movieCard);
    });
  }
}

function toggleFavorite(movie) {
  const index = favorites.indexOf(movie.id);
  let allFavoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

  if (index !== -1) {
    favorites.splice(index, 1);
    allFavoriteMovies = allFavoriteMovies.filter((m) => m.id !== movie.id);
  } else {
    favorites.push(movie.id);
    if (!allFavoriteMovies.some((m) => m.id === movie.id)) {
      allFavoriteMovies.push(movie);
    }
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  localStorage.setItem("favoriteMovies", JSON.stringify(allFavoriteMovies));

  const searchInput = document.getElementById("search");
  const query = searchInput ? searchInput.value.trim() : "";

  if (query) {
    fetchSearchedMovies(query);
  } else {
    fetchFavoriteMovies();
  }
}

const debouncedSearch = debounce((query) => {
  if (query) {
    fetchSearchedMovies(query);
  } else {
    fetchFavoriteMovies();
  }
}, 500);

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value.trim();
      debouncedSearch(query);
    });
  }
  fetchFavoriteMovies();
});
