(function() {
    "use strict";
  
    const BASE_URL = "http://localhost:3000/reviews"; 
  
    // Set up event listeners
    async function init() {
      document.getElementById("search-form").addEventListener("submit", searchReviews);
      await loadReviews();
    }
  
    // Load all reviews from the server and display them
    async function loadReviews() {
      try {
        const response = await fetch(BASE_URL);
        checkStatus(response);
        const reviews = await response.json();
        displayReviews(reviews);
      } catch (error) {
        handleError(error);
      }
    }
  
    // Search reviews by game title
    async function searchReviews(event) {
      event.preventDefault();
      const form = event.target;
      const gameTitle = form.querySelector("#search-game-title").value;
  
      try {
        const response = await fetch(`${BASE_URL}/search?gameTitle=${encodeURIComponent(gameTitle)}`);
        checkStatus(response);
        const reviews = await response.json();
        if (reviews.length === 0) {
          handleError(new Error("No reviews found for the specified game title."));
        } else {
          clearError();
          displayReviews(reviews);
        }
      } catch (error) {
        handleError(error);
      }
    }
  
    // Display reviews on the page
    function displayReviews(reviews) {
      const reviewsContainer = document.getElementById("reviews");
      reviewsContainer.innerHTML = "";
      reviews.forEach(review => {
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review");
  
        const titleElement = document.createElement("h3");
        titleElement.textContent = review.gameTitle;
        reviewElement.appendChild(titleElement);
  
        const contentElement = document.createElement("p");
        contentElement.textContent = review.content;
        reviewElement.appendChild(contentElement);
  
        const ratingElement = document.createElement("p");
        ratingElement.innerHTML = `<strong>Rating:</strong> ${review.rating}`;
        reviewElement.appendChild(ratingElement);
  
        reviewsContainer.appendChild(reviewElement);
      });
    }
  
    // Utility function to check response status
    function checkStatus(response) {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    }
  
    // Error handler
    function handleError(error) {
      clearReviews();
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent = error.message;
      errorMessage.classList.remove("hidden");
    }
  
    // Clear error message
    function clearError() {
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent = "";
      errorMessage.classList.add("hidden");
    }
  
    // Clear reviews from the page
    function clearReviews() {
      const reviewsContainer = document.getElementById("reviews");
      reviewsContainer.innerHTML = "";
    }
  
    init();
  })();
  