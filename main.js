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
