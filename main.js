import { createMovieCard } from "./movieCard.js";

const apiKey = "580efe9393c83028cf01304220c3c1e4";
const baseURL = "https://api.themoviedb.org/3";

document.addEventListener("DOMContentLoaded", () => {
  fetchPopularMovies();
});

function fetchPopularMovies() {
  fetch(`${baseURL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
    .then((response) => response.json())
    .then((data) => displayMovies(data.results));
}

function displayMovies(movies) {
  const movieGrid = document.getElementById("movieGrid");
  movieGrid.innerHTML = ""; // Clear previous movies

  movies.forEach((movie) => {
    const movieData = {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      isSeries: false, // Set true if it's a series
      episodes: movie.episodes || 0,
      notes: "",
    };

    const movieCard = createMovieCard(movieData, false, addToFavorites);
    movieGrid.appendChild(movieCard);
  });
}

function addToFavorites(movie) {}
