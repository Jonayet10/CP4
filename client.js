(function() {
  "use strict";

  const BASE_URL = "http://localhost:3000/reviews"; 

  // Set up event listeners
  async function init() {
    document.getElementById("review-form").addEventListener("submit", submitReview);
  }

  // Submit a new review to the server
  async function submitReview(event) {
    event.preventDefault();
    const form = event.target;

    // Custom validation
    if (!validateForm(form)) {
      return;
    }

    const formData = new FormData(form);
    const newReview = {
      gameTitle: formData.get("game-title"),
      content: formData.get("content"),
      rating: formData.get("rating")
    };

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview)
      });
      checkStatus(response);
      form.reset();
    } catch (error) {
      handleError(error);
    }
  }

  // Custom form validation
  function validateForm(form) {
    const gameTitle = form.querySelector("#game-title").value.trim();
    const content = form.querySelector("#content").value.trim();
    const rating = form.querySelector("#rating").value;

    if (!gameTitle) {
      handleError(new Error("Game Title is required."));
      return false;
    }
    if (!content) {
      handleError(new Error("Review content is required."));
      return false;
    }
    if (!rating || rating < 1 || rating > 10) {
      handleError(new Error("Rating must be between 1 and 10."));
      return false;
    }
    return true;
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
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
  }

  init();
})();
