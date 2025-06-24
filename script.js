let apiUrl = "https://www.omdbapi.com/?apikey=f1fa13ae&t=";

function renderStars(rating, max = 5) {
  let value = parseFloat(rating);
  if (!value) return "";
  let starCount =
    max === 100 ? value / 20 : max === 10 ? (max = value / 2) : value;
  let percent = Math.max(0, Math.min(1, starCount / 5)) * 100 - 1;
  return `
      <div class="stars-container">
          <img src="images/stars-gray.png"/>
          <div class="stars" style="width:${percent}%;">
              <img src="images/stars.png" />
          </div>
      </div>
  `;
}

function loadMovieData(data) {
  // Movie data
  document.getElementById("title").innerText = data.Title;
  document.getElementById("yearGenre").innerText =
    data.Year + " • " + data.Genre;
  document.getElementById("poster").src = data.Poster;
  document.getElementById("plot").innerText = data.Plot;
  document.getElementById("director").innerText = data.Director;
  document.getElementById("runtime").innerText = data.Runtime;
  document.getElementById("language").innerText = data.Language;

  // Actors as chips
  const actors = data.Actors.split(",").map((a) => a.trim());
  document.getElementById("actors").innerHTML = actors
    .map((actor) => `<span class="chip">${actor}</span>`)
    .join(" ");

  // IMDB rating and stars
  document.getElementById("imdbRating").innerText = data.imdbRating;
  document.getElementById("imdbStars").innerHTML = renderStars(
    data.imdbRating,
    10
  );

  // Rotten Tomatoes rating and stars
  const rt = data.Ratings.find((r) => r.Source === "Rotten Tomatoes");
  document.getElementById("rtRating").innerText = rt ? rt.Value : "N/A";
  if (rt && rt.Value.endsWith("%")) {
    const percent = parseInt(rt.Value);
    document.getElementById("rtStars").innerHTML = renderStars(percent, 100);
  } else {
    document.getElementById("rtStars").innerHTML = "";
  }
}

function clearMovieData() {
  document.getElementById("title").innerText = "Loading...";
  document.getElementById("yearGenre").innerText = "";
  document.getElementById("poster").src = "";
  document.getElementById("plot").innerText = "";
  document.getElementById("director").innerText = "";
  document.getElementById("runtime").innerText = "";
  document.getElementById("language").innerText = "";
  document.getElementById("actors").innerText = "";
  document.getElementById("imdbRating").innerText = "";
  document.getElementById("imdbStars").innerHTML = renderStars(0);
  document.getElementById("rtRating").innerText = "N/A";
  document.getElementById("rtStars").innerHTML = renderStars(0);
}

function fetchFavoriteMovie(movieName) {
  clearMovieData();
  fetch(apiUrl + movieName)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("favoriteMovie", JSON.stringify(data));
      loadMovieData(data);
    })
    .catch((err) => {
      document.getElementById("title").innerText =
        "Oops! Failed to load movie.";
      console.error("Error fetching movie data:", err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Greeting
  let userName = localStorage.getItem("userName");
  if (!userName) {
    userName = prompt("What's your name?");
    localStorage.setItem("userName", userName);
  }
  document.getElementById("greeting").innerText = `Welcome back, ${userName}!`;

  // Show/Hide Details
  let isVisible = true;
  const showHideBtn = document.getElementById("toggleDetails");
  showHideBtn.addEventListener("click", () => {
    const details = document.getElementById("movieDetails");
    isVisible = !isVisible;
    if (isVisible) {
      details.style.display = "block";
      showHideBtn.innerText = "Hide ▲";
    } else {
      details.style.display = "none";
      showHideBtn.innerText = "Show ▼";
    }
  });

  // Fetch favorite movie/series
  const favoriteMovie = localStorage.getItem("favoriteMovie");
  if (favoriteMovie) {
    console.log("Movie is saved locally");
    loadMovieData(JSON.parse(favoriteMovie));
  } else {
    let movieName = prompt("What is your favorite movie/series?");
    console.log("Fetching movie from OMDB API");
    fetchFavoriteMovie(movieName);
  }
  document.getElementById("greeting-subtitle").innerHTML = `
    Here is your favorite movie 
    <button id="changeMovieBtn" class="btn btn-sm btn-outline-none" style="color: blue;">
      Change Movie
    </button>
  `;
  document.getElementById("changeMovieBtn").addEventListener("click", () => {
    let movieName = prompt("What is your favorite movie/series?");
    fetchFavoriteMovie(movieName);
  });
});
