import { createMovieCard } from "./movieCard.js";

const apiKey = "580efe9393c83028cf01304220c3c1e4";
const baseURL = "https://api.themoviedb.org/3";
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let debounceTimeout;

// Initial fetch for popular movies
fetchPopularMovies();

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function fetchPopularMovies() {
  fetch(`${baseURL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
    .then((response) => response.json())
    .then((data) => displayMovies(data.results))
    .catch((error) => {
      console.error("Error fetching popular movies:", error);
      displayFeedback("An error occurred while loading movies. Please try again.");
    });
}

function displayMovies(movies) {
  const movieGrid = document.getElementById("movieGrid");
  movieGrid.innerHTML = "";

  if (movies.length === 0) {
    displayFeedback("No movies found.");
    return;
  }

  movies.forEach((movie) => {
    const isFavorite = favorites.includes(movie.id);
    const movieData = {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
    };

    const movieCard = createMovieCard(movieData, isFavorite, toggleFavorite);
    movieGrid.appendChild(movieCard);
  });
}

function toggleFavorite(movie) {
  const index = favorites.indexOf(movie.id);
  if (index === -1) {
    favorites.push(movie.id);
  } else {
    favorites.splice(index, 1);
  }
  saveFavorites();
  updateMovieCards();
}

function updateMovieCards() {
  fetchPopularMovies();
}

// Secure Search Function with Debouncing
document.getElementById("search-navbar").addEventListener("input", (event) => {
  clearTimeout(debounceTimeout);

  const query = event.target.value.trim();

  if (query.length < 3) {
    return; // Skip searching if the query is too short
  }

  debounceTimeout = setTimeout(() => {
    searchMovies(query);
  }, 300); // Debounce delay of 300ms
});

function searchMovies(query) {
  const encodedQuery = encodeURIComponent(query);

  fetch(`${baseURL}/search/movie?api_key=${apiKey}&query=${encodedQuery}&language=en-US&page=1`)
    .then((response) => response.json())
    .then((data) => displayMovies(data.results))
    .catch((error) => {
      console.error("Error fetching search results:", error);
      displayFeedback("An error occurred while searching. Please try again.");
    });
}

function displayFeedback(message) {
  const movieGrid = document.getElementById("movieGrid");
  movieGrid.textContent = message;
  movieGrid.classList.remove(...movieGrid.classList);
  movieGrid.classList.add("text-center", "text-gray-600");
}
