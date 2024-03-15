"use strict"

const swiper = document.querySelector(".swiper");

// console.log(window.location.pathname);

const link = document.querySelectorAll(".nav-link");
const spinner = document.querySelector(".spinner");
const tvShowDetails = document.querySelector(".tv-show-details");
const movieDetails = document.querySelector(".movie-detail-section");
// console.log(link);
// page=router==
const global = {
  curentpage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 0,
    total_results: 0,
    genres:"no genres"
  },
  api: {
    apiKeys: "e7a336984af4d23ad80d1f97735d0be1",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

function init() {
  switch (global.curentpage) {
    case "/INDEX.HTML":
    case "/index.html":
      displaySlider();
      dispplayPopular();
      dispplayTrending();
      break;
    case "/Tv-shows.html":
    dispplayPopularShow();
      break;
    case "/movie-details.html":
displayMovieDetails();
      break;
    case "/tv-details.html":
      displayTvDetails();
      console.log("tv-detals");
      break;
    case "/search.html":
    searchData();
      break;
  }
  activeLink();
}
const activeLink = function () {
  link.forEach(function (cur) {
    if (cur.getAttribute("href") === global.curentpage) {
      cur.classList.add("active-link");
    }
  });
};
// ===========
// fetch data from TMDB== global async function
// ============
async function getData(endpoint){
  const apiKey = global.api.apiKeys;
  const apiUrl = global.api.apiUrl;
   showSpinner();
  const response = await fetch(`${endpoint}?api_key=${apiKey}`);
  const data = await response.json()
   hideSpinner();
  return data;
}

// ==============
// display movie==
// ================
async function dispplayPopular(){
  const {results}= await getData("https://api.themoviedb.org/3/movie/popular");
  results.forEach(function(movie){
    const div = document.createElement("div")
    div.classList.add("cards")
    div.innerHTML = `
   <div class="card">
    <a href="movie-details.html?id=${movie.id}">
${
  movie.poster_path
    ? ` <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`
    : `  <img src="./images/no-image.jpg" alt="movie title">`
}
    </a>
    <div class="card-footer">
     <h3>${movie.title} </h3>
     <H4> <span class="">Release: ${movie.release_date}</span></H4>
    </div>
   </div>
 `;
   document.querySelector(".card-container").appendChild(div);
  })
  console.log(results);
}
// ==============
// display Trending
// ================
async function dispplayTrending(){
  const {results}= await getData("https://api.themoviedb.org/3/movie/upcoming");
  results.forEach(function(movie){
    const div = document.createElement("div")
    div.classList.add("upcomingcards");
    div.innerHTML = `
   <div class="card">
    <a href="movie-details.html?id=${movie.id}">
${
  movie.poster_path
    ? ` <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`
    : `  <img src="./images/no-image.jpg" alt="movie title">`
}
    </a>
    <div class="card-footer">
     <h3>${movie.title} </h3>
     <H4> <span class="">Release: ${movie.release_date}</span></H4>
    </div>
   </div>
 `;
   document.querySelector(".upcomingcards-container").appendChild(div);
  })
  console.log(results);
}
// ==============
// display tv show==
// ================
async function dispplayPopularShow(){
  const {results}= await getData("https://api.themoviedb.org/3/tv/popular");
  results.forEach(function(show){
    const div = document.createElement("div")
    div.classList.add("tv-card-container");
    div.innerHTML = `
   <a href="/tv-details.html?id=${show.id}">
  ${
    show.poster_path
      ? ` <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">`
      : ` <img src="./images/no-image.jpg" alt="${show.name}" class="show-img">`
  }
   </a>
   <div class="tv-card-footer">
    <h3>${show.name}</h3>
    <h3>Aire Date : <span>${show.first_air_date}</span></h3>
   </div>
 `;
   document.querySelector(".show-name").appendChild(div);
  })
  console.log(results);
}


 function showSpinner() {
   spinner.classList.add("show");
 };
function hideSpinner() {
  spinner.classList.remove("show");
};
// ===============
// displymovie details==
// =================
async function displayMovieDetails(){
  const movieId = window.location.search.split("=")[1];
  const mainMovie = await getData(
    `https://api.themoviedb.org/3/movie/${movieId}`
  );
  const div = document.createElement("div")
 ;
 displayBackGroungImage("movie",mainMovie.backdrop_path)
  div.innerHTML = `
  <article class="movie-details-container">
     ${
       mainMovie.poster_path
         ? ` <img src="https://image.tmdb.org/t/p/w500${mainMovie.poster_path}" alt="${mainMovie.name}">`
         : ` <img src="./images/no-image.jpg" alt="${mainMovie.name}" class="show-img">`
     }
<!-- movie details== -->
    <div class="movie-details">
  <h2  class="section-title">${mainMovie.title}</h2>
<div class="details">
  <p>
              <i class="fas fa-star text-primary"></i>
            ${mainMovie.vote_average.toFixed(1)}/ 10
            </p>
            <p class="text-muted">Release Date: ${mainMovie.release_date}</p>
            <p>
              ${mainMovie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
        ${mainMovie.genres.map((genre) => ` <li>${genre.name}</li>`).join(" ")}
            </ul>
            <a href="${
              mainMovie.homepage
            }" target="_blank" class="btn">Visit HomePage</a>
</div>
    </div>
  </article>
    <!-- movie info=== -->
    <div class="movie-info">
<h2 class="section-title">movie-info</h2>
<p class="movie-budget">Budget :<span class="mov-detail-info-span">${numberWithCommas(
    mainMovie.budget
  )}</span></p>
<p class="movie-budget">Revenue :<span class="mov-detail-info-span">${numberWithCommas(
    mainMovie.revenue
  )}</span></p>
<p class="movie-budget">Runtime :<span class="mov-detail-info-span">${
    mainMovie.runtime
  } minuites</span></p>
<p>Status :<span class="mov-detail-info-span">${mainMovie.status}</span></p>
<div class="production-companies">
  <h3>production companies</h3>
<h5 class="companies">${mainMovie.production_companies
    .map((cur) => `<span>${cur.name}</span>`)
    .join(", ")}</h5>
</div>
</div>
  `;
movieDetails.appendChild(div)
  console.log(mainMovie);
}

// =================
// display Tv show deatails==
// ======================
async function displayTvDetails(){
  const tvId = window.location.search.split("=")[1];
  console.log(tvId);
  const mainTv = await getData(`https://api.themoviedb.org/3/tv/${tvId}`);
  console.log(mainTv);
  const div = document.createElement("div")
 ;
 displayBackGroungImage("tv",mainTv.backdrop_path)
  div.innerHTML = `
 <article class="show-container">
  <div class="show-name-details">
    ${
      mainTv.poster_path
        ? ` <img src="https://image.tmdb.org/t/p/w500${mainTv.poster_path}" alt="${mainTv.name}">`
        : ` <img src="./images/no-image.jpg" alt="${mainTv.name}" class="show-img">`
    }
    <div class="show-name-info">
            <h2 class="section-title">${mainTv.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              8 / 10
            </p>
            <p class="text-muted">Release Date:${mainTv.last_air_date}</p>
            <p>
        ${mainTv.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${mainTv.genres.length===0 
                ? global.search.genres
                : mainTv.genres[0].name}
            </ul>
            <a href="${
              mainTv.homepage
            }" target="_blank" class="btn tv-home-page">Visit Show Homepage</a>
    </div>
  </div>
  <!-- show details== -->
     <div class="details-bottom">
        <h2 class="section-title">Show Info</h2>
        <ul class="details-bottom-links">
          <li class="show-text"><span class="text-secondary">Number Of Episodes:</span> ${
            mainTv.number_of_episodes
          }</li>
          <li class="show-text">
            <span class="text-secondary">Last Episode To Air:</span> ${
              mainTv.last_episode_to_air.name
            }
          </li>
          <li class="show-text"><span class="text-secondary">Status:</span> ${
            mainTv.status
          }</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${mainTv.production_companies
          .map((cur) => `<span class="text-secondary">${cur.name}</span>`)
          .join(", ")}</div>
      </div>
 </article>
  `;
  tvShowDetails.appendChild(div);
  console.log(tvShowDetails);
}
// =================
// display swiper slider==
// ====================
// first step => get the image from the api==
// 2nd step => loop through the result given from the api by destructuring==
async function displaySlider(){
  const {results}= await getData("https://api.themoviedb.org/3/movie/now_playing")
results.forEach(function(cur){
  const div = document.createElement("div")
  div.classList.add("swiper-slide")
  div.innerHTML = `
            <a href="movie-details.html?=${cur.id}">
              <img src="https://image.tmdb.org/t/p/w500${cur.poster_path}" alt="${cur.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${cur.vote_average}/ 10
            </h4>
         `;
         document.querySelector(".swiper-wrapper").appendChild(div);

        })
        initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}





// ===========
// display background==
const  displayBackGroungImage = function(type,background){
const overlayDiv = document.createElement("div")
overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${background})`;
 overlayDiv.style.backgroundSize = "cover";
 overlayDiv.style.backgroundPosition = "center";
 overlayDiv.style.backgroundRepeat = "no-repeat";
 overlayDiv.style.height = "100vh";
 overlayDiv.style.width = "100vw";
 overlayDiv.style.position = "absolute";
 overlayDiv.style.top = "0";
 overlayDiv.style.left = "0";
 overlayDiv.style.zIndex = "-1";
 overlayDiv.style.opacity = "0.3";

 if(type==="movie"){
  movieDetails.appendChild(overlayDiv)
}else{
  tvShowDetails.appendChild(overlayDiv);
 }
}
function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}
document.addEventListener("DOMContentLoaded", init);


// async function postData({title,body}){
//   const res = await fetch("https://jsonplaceholder.typicode.com/posts",{
//     method:"POST",
//     body:JSON.stringify({title,body}),
//     headers:{
//       "Content-Type":"application/json",
//   token:"abc333",
//     }
//   })
//   const data = await res.json()
//   console.log(data);
// }
// postData({title: "my post", body:{
//   image:"jpeg"
// }});


// ===============
// search movies======
// ================
// BEGINING OF SEARCH FUNCTIONALITY==
// making search request==
async function searchgetData(){
  const apiKey = global.api.apiKeys;
  const apiUrl = global.api.apiUrl;
   showSpinner();
  const response = await fetch(`
https://api.themoviedb.org/3/search/${global.search.type}?api_key=${apiKey}&query=${global.search.term}&page=${global.search.page}`);
  const data = await response.json()
   hideSpinner();
  return data;
}
// getting the query string== tyype and search term

 async function searchData(){
  const queryString = window.location.search
  const url = new URLSearchParams(queryString);
  global.search.type = url.get("type");
  console.log(global.search.type);
  global.search.term = url.get("search-term");
if(  global.search.term!== ""&& global.search.term!== null){
const { results,total_pages, page,total_results, } = await searchgetData();
global.search.page = page
global.search.totalPages = total_pages;
global.search.total_results = total_results
console.log(results, total_results, total_pages);
if(results.length===0){
  showAlert("no result found");
  return;
}
displaySearchResult(results)
document.querySelector(".main-search-input").value = "";
}else{
showAlert("please enter a search term");
}
 }
//  working with the hard coded value====
const displaySearchResult =function(result){
  document.querySelector(".card-container").innerHTML="";
  document.querySelector(".search-result-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  result.forEach(function (curResult) {
    const div = document.createElement("div");
    div.classList.add("cards");
    div.innerHTML = `
   <div class="card">
    <a href="${global.search.type}-details.html?id=${curResult.id}">
${
 curResult.poster_path
    ? ` <img src="https://image.tmdb.org/t/p/w500/${
        curResult.poster_path
      }" alt="${global.search.type === "movie" ? curResult.title : curResult.name}">`
    : `  <img src="./images/no-image.jpg" alt="${
        global.search.type === "movie" ? curResult.title : curResult.name
      }">`
}
    </a>
    <div class="card-footer">
     <h3>${global.search.type === "movie" ? curResult.title : curResult.name} </h3>
     <H4> <span class="">Release: ${
       global.search.type === "movie" ? curResult.release_date : curResult.first_air_date
     }</span></H4>
    </div>
   </div>
 `;
 document.querySelector(".search-result-heading").innerHTML = `
<h3>${result.length} of ${global.search.total_results} results for ${global.search.term}</h3>
 `;
    document.querySelector(".card-container").appendChild(div);
  });

  displayPagination()
}

const displayPagination = function(){
const div = document.createElement("div")
div.classList.add("pagination")
div.innerHTML = `
     <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter"> Page ${global.search.page} of ${global.search.totalPages}</div>
`;
document.querySelector("#pagination").appendChild(div)

if(global.search.page === 1){
  document.querySelector("#prev").disabled = true
}
if(global.search.page === global.search.totalPages){
  document.querySelector("#next").disabled = true
}
// next page functionality==
  document.querySelector("#next").addEventListener("click", async()=>{
    global.search.page++;
    const { results, total_pages } = await searchData();
    displaySearchResult(results);
  })
  document.querySelector("#prev").addEventListener("click", async()=>{
    global.search.page--;
    const { results, total_pages } = await searchData();
    displaySearchResult(results);
  })

}
// END OF SEARCH FUNCTIONALITY==

 function showAlert(msg){
  const el = document.createElement("div")
  el.classList.add("alert")
  el.appendChild(document.createTextNode(msg))
  document.querySelector(".alert").appendChild(el)

  setTimeout(function(){
 el.remove()
  },3000)
 }

