// disabling form submission
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

const storedLocation = localStorage.getItem("location");
// show hide search results
const searchResultsUl = document.querySelector(`[data-search-results]`);
function showHideSearchResults(flag = true) {
  flag
    ? searchResultsUl.classList.add(`active`)
    : searchResultsUl.classList.remove(`active`);
}

document.addEventListener("click", () => {
  showHideSearchResults(false);
});

// getting user input
const input = document.querySelector(`[data-input]`);

function userInput() {
  return input.value;
}

// getting search results
async function gettingSearchResults() {
  const url = `http://api.weatherapi.com/v1/search.json?key=520e9e98cb9446d4b2485659231601&q=${userInput()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// show cities regarding user input
function showCities() {
  gettingSearchResults().then((data) => {
    showHideSearchResults();
    if (data.length == 0) {
      searchResultsUl.innerHTML = `<li>No City Found</li>`;
    } else {
      const html = data
        .map((city) => {
          return `<li>${city.name}</li>`;
        })
        .join("");
      searchResultsUl.innerHTML = html;
      const liS = document.querySelectorAll("ul li");
      liS.forEach((li) => {
        li.addEventListener("click", liTextToInputValue);
      });
    }
  });
}

input.addEventListener("input", showCities);

// li text to input value
function liTextToInputValue() {
  input.value = this.textContent;
  displayingWeatherData();
  localStorage.setItem("location", this.textContent);
}

// getting weather information
const searchBtn = document.querySelector("button");

async function gettingWeatherData() {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=520e9e98cb9446d4b2485659231601&q=${
    userInput() || storedLocation || "london"
  }&days=1&aqi=no&alerts=no`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// html elements for displaying information

const currentLocation = document.querySelector("h1");
const currentTemp = document.querySelector("[data-current-temp]");
const currentWeatherImg = document.querySelector(".right img");
const currentWeatherCondition = document.querySelector(".right p");
const maxTemp = document.querySelector(".max-temp .value");
const minTemp = document.querySelector(".min-temp .value");
const rain = document.querySelector(".rain .value");
const sunrise = document.querySelector(".sunrise .value");
const sunset = document.querySelector(".sunset .value");
const windSpeed = document.querySelector(".wind .value");
const main = document.querySelector(`main`);
const animation = document.querySelector(".animation");

function displayingWeatherData() {
  gettingWeatherData().then((data) => {
    if (Object.keys(data).length == 1) {
      alert(data.error.message);
      return;
    }
    animation.classList.add("lds-roller");
    main.classList.add("hide");
    setTimeout(() => {
      document.title = `${data.location.name}'s Weather `;
      currentLocation.textContent = data.location.name;
      currentTemp.textContent = data.current.temp_c + "\xB0 C";
      currentWeatherImg.src = data.current.condition.icon;
      currentWeatherCondition.textContent = data.current.condition.text;
      maxTemp.textContent = `${data.forecast.forecastday[0].day.maxtemp_c}\xB0 C`;
      minTemp.textContent =
        data.forecast.forecastday[0].day.mintemp_c + "\xB0 C";
      rain.textContent =
        data.forecast.forecastday[0].day.daily_chance_of_rain + " %";
      sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;
      sunset.textContent = data.forecast.forecastday[0].astro.sunset;
      windSpeed.textContent =
        data.forecast.forecastday[0].day.maxwind_kph + " km/h";
      animation.classList.remove("lds-roller");
      main.classList.remove("hide");
    }, 1500);
  });
}

searchBtn.addEventListener("click", displayingWeatherData);
displayingWeatherData();
