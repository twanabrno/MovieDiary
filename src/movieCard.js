export function createMovieCard(movie, isFavorite = false, onFavoriteClick) {
  const movieCard = document.createElement("div");
  movieCard.className = "rounded-lg shadow-lg h-96 overflow-hidden relative";

  const image = document.createElement("img");
  image.src = `https://image.tmdb.org/t/p/w500${movie.posterPath}`;
  image.alt = movie.title;
  image.className = "w-full object-cover";

  movieCard.appendChild(image);

  const overlay = document.createElement("div");
  overlay.className =
    "absolute top-0 left-0 w-full h-full text-white flex flex-col justify-between p-4 bg-black bg-opacity-50 hover:bg-opacity-75";

  const header = document.createElement("div");
  header.className = "header px-4";

  const title = document.createElement("h3");
  title.className = "font-bold text-xl capitalize";
  title.textContent = movie.title;

  const releaseDate = document.createElement("p");
  releaseDate.className = "text-gray-300 text-sm";
  releaseDate.textContent = movie.releaseDate;

  header.appendChild(title);
  header.appendChild(releaseDate);

  const body = document.createElement("div");
  body.className = "body";

  const flexContainer = document.createElement("div");
  flexContainer.className = "flex justify-between mb-3";

  const rate = document.createElement("p");
  rate.className = "text-gray-300";
  rate.textContent = movie.voteAverage.toFixed(1);

  const ageRating = document.createElement("p");
  ageRating.textContent = movie.adult ? "+18" : "";

  flexContainer.appendChild(rate);
  flexContainer.appendChild(ageRating);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "w-full flex gap-3 px-3 h-11";

  const addButton = document.createElement("button");
  addButton.className =
    "backdrop-blur-sm bg-white/30 px-5 rounded-lg hover:bg-white/50";
  addButton.classList.add("favorite-btn");

  const icon = document.createElement("i");
  icon.classList.add("fa-lg", "fa-heart", "text-red-500");
  icon.classList.add(isFavorite ? "fa-solid" : "fa-regular");
  addButton.appendChild(icon);

  addButton.addEventListener("click", () => {
    if (onFavoriteClick) {
      onFavoriteClick(movie, icon);
    }
  });

  const watchButton = document.createElement("button");
  watchButton.className =
    "bg-[#00b9ae] rounded-lg grow bg-opacity-90 hover:bg-opacity-100";
  watchButton.textContent = "Watch";
  watchButton.addEventListener("click", () => {
    window.location.href = `movieDetails.html?id=${movie.id}`;
  });

  buttonContainer.appendChild(addButton);
  buttonContainer.appendChild(watchButton);

  body.appendChild(flexContainer);
  body.appendChild(buttonContainer);

  overlay.appendChild(header);
  overlay.appendChild(body);

  movieCard.appendChild(overlay);

  return movieCard;
}
