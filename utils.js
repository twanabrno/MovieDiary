// utils.js

export function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  export function displayNoResults(container, searchQuery, isSearchMode) {
    container.classList.remove("grid");
    container.classList.add("flex", "justify-center", "items-center");
    container.innerHTML = "";
    const noResultsMessage = document.createElement("p");
    noResultsMessage.classList.add("text-white", "text-3xl", "h-full");
    noResultsMessage.textContent = isSearchMode
      ? searchQuery
        ? `No results found for "${searchQuery}"`
        : "No results found!"
      : "No Popular Movies Found!";
    container.appendChild(noResultsMessage);
  }
  
  export function updateClassList(element, removeClasses, addClasses) {
    element.classList.remove(...removeClasses);
    element.classList.add(...addClasses);
  }
  