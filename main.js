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

function fetchSearchedMovies(query) {
  const url = `${baseURL}/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
    query
  )}&page=1`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => displayMovies(data.results));
}

function displayMovies(movies) {
  const movieGrid = document.getElementById("movieGrid");
  movieGrid.innerHTML = "";

  if (movies.length === 0) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.classList.add(
      "text-white",
      "flex",
      "text-3xl",
      "h-full",
      "justify-center",
      "items-center"
    );
    noResultsMessage.textContent = "No movies found!";
    movieGrid.appendChild(noResultsMessage);
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
  let allFavoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];

  if (index === -1) {
    favorites.push(movie.id);

    const movieExists = allFavoriteMovies.some((m) => m.id === movie.id);
    if (!movieExists) {
      allFavoriteMovies.push(movie);
    }
  } else {
    favorites.splice(index, 1);
    allFavoriteMovies = allFavoriteMovies.filter((m) => m.id !== movie.id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  localStorage.setItem("favoriteMovies", JSON.stringify(allFavoriteMovies));

  updateMovieCards();
}

function updateMovieCards() {
  const searchInput = document.getElementById("search");

  if (searchInput) {
    const query = searchInput.value.trim();
    if (query) {
      fetchSearchedMovies(query);
    } else {
      fetchPopularMovies();
    }
  } else {
    fetchPopularMovies();
  }
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedFetchMovies = debounce((query) => {
  if (query) {
    fetchSearchedMovies(query);
  } else {
    fetchPopularMovies();
  }
}, 500);

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value.trim();
      debouncedFetchMovies(query);
    });
  }
});
