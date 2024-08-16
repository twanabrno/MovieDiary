// movieDetails.js
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  if (movieId) {
    fetchMovieDetails(movieId);
  }
});

function fetchMovieDetails(movieId) {
  const apiKey = "580efe9393c83028cf01304220c3c1e4";
  const baseURL = "https://api.themoviedb.org/3";

  fetch(`${baseURL}/movie/${movieId}?api_key=${apiKey}&language=en-US`)
    .then((response) => response.json())
    .then((movie) => {
      displayMovieDetails(movie);
    })
    .catch((error) => {
      console.error("Error fetching movie details:", error);
    });
}

function displayMovieDetails(movie) {
  document.title = movie.title;

  const movieDetailsContainer = document.getElementById("movieDetails");

  const imageContainer = document.createElement("div");
  const moviePoster = document.createElement("img");
  moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  moviePoster.alt = movie.title;
  imageContainer.appendChild(moviePoster);

  const detailsContainer = document.createElement("div");
  detailsContainer.className = "pt-5 text-white space-y-4";

  const movieTitle = document.createElement("h1");
  movieTitle.textContent = movie.title;
  movieTitle.className = "text-4xl font-bold";

  const releaseDate = document.createElement("p");
  releaseDate.textContent = `${movie.release_date}`;
  releaseDate.className = "text-lg text-gray-300";

  const rating = document.createElement("p");
  rating.textContent = `${movie.vote_average}`;
  rating.className = "text-lg text-gray-300";

  const movieDescription = document.createElement("p");
  movieDescription.textContent = movie.overview;

  const watchButton = document.createElement("button");
  watchButton.className =
    "bg-[#00b9ae] rounded-lg grow bg-opacity-90 hover:bg-opacity-100 px-6 py-2";
  watchButton.textContent = "Watch Now";

  detailsContainer.appendChild(movieTitle);
  detailsContainer.appendChild(releaseDate);
  detailsContainer.appendChild(rating);
  detailsContainer.appendChild(movieDescription);
  detailsContainer.appendChild(watchButton);

  movieDetailsContainer.innerHTML = "";
  movieDetailsContainer.appendChild(imageContainer);
  movieDetailsContainer.appendChild(detailsContainer);
}
