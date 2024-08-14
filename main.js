import { createMovieCard } from "./movieCard.js";

const apiKey = "580efe9393c83028cf01304220c3c1e4";
const baseURL = "https://api.themoviedb.org/3";

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

fetchPopularMovies();

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function fetchPopularMovies() {
  fetch(`${baseURL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
    .then((response) => response.json())
    .then((data) => displayMovies(data.results));
}

function displayMovies(movies) {
  const movieGrid = document.getElementById("movieGrid");
  movieGrid.innerHTML = ""; 

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

document.getElementById("searchButton").addEventListener("click", handleSearch);
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("searchModal").classList.add("hidden");
});

function handleSearch() {
  const query = document.getElementById("searchBar").value.trim();
  if (!query) return;

  fetch(`${baseURL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`)
    .then((response) => response.json())
    .then((data) => displaySearchResults(data.results))
    .catch((error) => {
      console.error("Error fetching search results:", error);
      displayFeedback("An error occurred while searching. Please try again.");
    });
}

function displaySearchResults(movies) {
  const searchResults = document.getElementById("searchResults");
  searchResults.textContent = "";

  if (movies.length === 0) {
    displayFeedback("No movies found for your search query.");
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
    searchResults.appendChild(movieCard);
  });

  document.getElementById("searchModal").classList.remove("hidden");
}

function displayFeedback(message) {
  const searchResults = document.getElementById("searchResults");
  searchResults.textContent = message;
  
  // Clear any existing classes and then add the desired classes
  searchResults.classList.remove(...searchResults.classList); // Remove all existing classes
  searchResults.classList.add("text-center", "text-gray-600");

  document.getElementById("searchModal").classList.remove("hidden");
}
