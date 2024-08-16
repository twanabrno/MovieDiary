import { createMovieCard } from "./movieCard.js";
import { debounce, displayNoResults, updateClassList } from "./utils.js";

const apiKey = "580efe9393c83028cf01304220c3c1e4";
const baseURL = "https://api.themoviedb.org/3";

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentPagePopular = 1;
let currentPageSearch = 1;
let isFetching = false;
let isSearchMode = false;

let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  fetchPopularMovies(currentPagePopular);

  window.addEventListener("scroll", () => {
    if (!isSearchMode) {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentPagePopular++;
        fetchPopularMovies(currentPagePopular);
      }
    } else {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentPageSearch++;
        fetchSearchedMovies(searchQuery, currentPageSearch);
      }
    }
  });

  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value.trim();
      if (searchQuery) {
        isSearchMode = true;
        currentPageSearch = 1;
        debouncedFetchMovies(searchQuery);
      } else {
        isSearchMode = false;
        currentPagePopular = 1;
        fetchPopularMovies(currentPagePopular, true);
      }
    });
  }
});

function fetchPopularMovies(page = 1, resetGrid = false) {
  if (isFetching) return;
  isFetching = true;

  fetch(`${baseURL}/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results, resetGrid);
      isFetching = false;
    })
    .catch(() => {
      isFetching = false;
    });
}

function fetchSearchedMovies(query, page = 1, resetGrid = false) {
  const url = `${baseURL}/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`;

  if (isFetching) return;
  isFetching = true;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results, resetGrid);
      isFetching = false;
    })
    .catch(() => {
      isFetching = false;
    });
}

function displayMovies(movies, resetGrid = false) {
  const movieGrid = document.getElementById("movieGrid");

  if (resetGrid) {
    movieGrid.innerHTML = "";
  }

  if (movies.length === 0) {
    displayNoResults(movieGrid, searchQuery, isSearchMode);
    return;
  } else {
    updateClassList(movieGrid, ["flex", "justify-center", "items-center"], ["grid"]);
    const existingMessage = document.getElementById("no-results-message");
    if (existingMessage) {
      existingMessage.remove();
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
}

function toggleFavorite(movie, iconElement) {
  const index = favorites.indexOf(movie.id);
  let allFavoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

  if (index === -1) {
    favorites.push(movie.id);

    const movieExists = allFavoriteMovies.some((m) => m.id === movie.id);
    if (!movieExists) {
      allFavoriteMovies.push(movie);
    }

    iconElement.classList.remove("fa-regular");
    iconElement.classList.add("fa-solid");
  } else {
    favorites.splice(index, 1);

    allFavoriteMovies = allFavoriteMovies.filter((m) => m.id !== movie.id);

    iconElement.classList.remove("fa-solid");
    iconElement.classList.add("fa-regular");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  localStorage.setItem("favoriteMovies", JSON.stringify(allFavoriteMovies));
}

function updateMovieCards() {
  if (isSearchMode) {
    fetchSearchedMovies(searchQuery, currentPageSearch);
  } else {
    fetchPopularMovies(currentPagePopular);
  }
}

const debouncedFetchMovies = debounce((query) => {
  if (query) {
    fetchSearchedMovies(query, 1, true);
  } else {
    fetchPopularMovies(1, true);
  }
}, 500);
