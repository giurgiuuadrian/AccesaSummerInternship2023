const succesfull = (position) => {
    getForecast.fetchForecastWeather(position.coords.latitude, position.coords.longitude);
};

const error = (error) => {
    console.log(error);
};

navigator.geolocation.getCurrentPosition(succesfull, error);


let hour = new Date().getHours();
if (hour < 20 && hour > 7) {
    const element = document.getElementById("body");
    element.className = "day";
}
else {
    const element = document.getElementById("body");
    element.className = "night";
};


let getForecast = {
    apiKey: "fba9ded37b21de3c17e0fb75f3980e9e",
    fetchForecastWeather: function (latitude, longitude) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&units=metric&appid=" + 
            this.apiKey
        )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.displayWeather(data)
        });
    },

    displayWeather: function (data) {
        const cityName = data.city.name;
        const icon = data.list[0].weather[0].icon;
        const weatherDescription = data.list[0].weather[0].description;
        const currentTemp = data.list[0].main.temp

        document.querySelector("#city").innerText = cityName;
        document.querySelector("#icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector("#description").innerText = weatherDescription;
        document.querySelector("#temp").innerText = currentTemp + "°C";
        
        for(let i = 1; i <= 17; i=i+8){
            const date =  document.getElementById("date-"+i);
            date.innerText = new Date ((data.list[i].dt) * 1000).toLocaleDateString('en-GB');

            const name = document.getElementById("cityName-"+i);
            name.innerText = data.city.name;

            const elementIcon = document.getElementById("icon-forecast-"+i);
            elementIcon.src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";

            const temp = document.getElementById("temp-"+i);
            temp.innerText = data.list[i].main.temp + "°C";

            const description = document.getElementById("description-"+i);
            description.innerText = data.list[i].weather[0].description;
        }
    },
}

let getWeather = {
    apiKey: "fba9ded37b21de3c17e0fb75f3980e9e",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            getForecast.fetchForecastWeather(data.coord.lat, data.coord.lon)
        });
    },


    searchWeather: function () {
        this.fetchWeather(document.querySelector("#search-bar").value);
    },

    searchWeatherFromFav: function (item) {
        this.fetchWeather(item.innerText);
    },
};


document.querySelector("#search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        getWeather.searchWeather();
    }
});


let favoritesArr = [];

const getFavorites = () => {
    return window.localStorage.getItem('favorites');
};

const showFavorites = (start) => {
    end = favoritesArr.length - 1;
    for (let i = start; i <= end; i++){
        const item = favoritesArr[i];
        const element = document.createElement("button");
        element.setAttribute("onclick",`getWeather.searchWeatherFromFav(${item});`);
        element.innerText = item;
        element.className = "btn btn-city";
        element.id = item;
        document.getElementById("favLst").appendChild(element);
    }
};

if(getFavorites()){
    favoritesArr = getFavorites().split(',');
    showFavorites(0);
}

const addFavorite = () => {
    if(document.querySelector("#search-bar").value.length == 0 || favoritesArr.indexOf(document.querySelector("#search-bar").value) != -1) {
        alert("The input is empty or the city already exist in your favorites list.");
        console.log("The input is empty or the city already exist in your favorites list.");
        return false;
    }

    else if(favoritesArr.length > 3){ 
        alert("You have reached the maximum favorites number.");
        return false;
    }

    else{
        favoritesArr.push(document.querySelector("#search-bar").value);
        window.localStorage.setItem('favorites', favoritesArr);
        showFavorites(end+1);
    }
};