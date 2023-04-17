const APIKEY = "34ba3e15d55ef14700660a657bf421da";

//element outlets

let topContentCity = document.getElementById("topContentCity");
let topContentDate = document.getElementById("topContentDate");
let topContentIcon = document.getElementById("topContentIcon");

let topContentTemp = document.getElementById("topContentTemp");
let topContentWind = document.getElementById("topContentWind");
let topContentHumidity = document.getElementById("topContentHumidity");

let searchButton = document.getElementById("searchButtonID");
let searchInput = document.getElementById("searchInput");
var container = document.getElementById("container");
var searchTileContainer = document.getElementById("searchTileContainer");

//function for create a weather tile
function createWeatherTile(date, icon, temp, wind, humidity) {
  var weatherTile = document.createElement("div");
  weatherTile.className = "weatherTile";

  var tileTemp = document.createElement("p");
  tileTemp.textContent = "Temp: " + temp + "°F";

  var tileWind = document.createElement("p");
  tileWind.textContent = "Wind: " + wind + " MPH";

  var tileHumidity = document.createElement("p");
  tileHumidity.textContent = "Humidity: " + humidity + "%";

  var tileDate = document.createElement("p");
  tileDate.textContent = formatDate(date);

  var tileIcon = document.createElement("img");
  tileIcon.alt = "icon";
  tileIcon.src = "http://openweathermap.org/img/w/" + icon + ".png";

  weatherTile.append(tileDate);
  weatherTile.append(tileIcon);
  weatherTile.append(tileTemp);
  weatherTile.append(tileWind);
  weatherTile.append(tileHumidity);
  container.appendChild(weatherTile);
}

async function weatherUpdate() {
  var searchedCity = searchInput.value;

  var responseForLatLon = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${APIKEY}`
  );

  var dataForLatLon = await responseForLatLon.json();
  var latValue = dataForLatLon.coord.lat;
  var lonValue = dataForLatLon.coord.lon;

  var responseForWeather = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latValue}&lon=${lonValue}&appid=${APIKEY}`
  );

  var dataForWeather = await responseForWeather.json();

  topContentCity.textContent = dataForWeather.city.name;
  topContentDate.textContent = formatDate(dataForWeather.list[0].dt);
  topContentIcon.src =
    "http://openweathermap.org/img/w/" +
    dataForWeather.list[0].weather[0].icon +
    ".png";

  topContentTemp.textContent = dataForWeather.list[0].main.temp + "°F";
  topContentWind.textContent = dataForWeather.list[0].wind.speed + " MPH";
  topContentHumidity.textContent = dataForWeather.list[0].main.humidity + "%";

  container.innerHTML = "";
  for (var i = 1; i < 6; i++) {
    createWeatherTile(
      dataForWeather.list[i].dt,
      dataForWeather.list[i].weather[0].icon,
      dataForWeather.list[i].main.temp,
      dataForWeather.list[i].wind.speed,
      dataForWeather.list[i].main.humidity
    );
  }

  addToLocalStorage(searchedCity);
  createSearchTile();
}

function addToLocalStorage(cityName) {
  if (localStorage.getItem("cityName") == null) {
    localStorage.setItem("cityName", cityName);
  } else {
    var cityNameExists = localStorage
      .getItem("cityName")
      .split(",")
      .indexOf(cityName);
    if (cityNameExists == -1) {
      localStorage.setItem(
        "cityName",
        localStorage.getItem("cityName") + "," + cityName
      );
    }
  }
}

function createSearchTile() {
  searchTileContainer.innerHTML = "";
  if (localStorage.getItem("cityName") != null) {

      localStorage
      .getItem("cityName")
      .split(",")
      .forEach(function (savedCity) {
          var searchTile = document.createElement("div");
          searchTile.className = "searchTile";
          searchTile.textContent = savedCity;
          searchTileContainer.appendChild(searchTile);
        });
    }
}

function formatDate(date) {
  var date = new Date(date * 1000).toLocaleDateString();
  return `${date}`;
}

function searchFromHistory(event) {
  searchInput.value = event.target.textContent;
  weatherUpdate();
}

createSearchTile();
searchButton.addEventListener("click", weatherUpdate);
searchTileContainer.addEventListener("click", searchFromHistory);