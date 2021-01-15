// Define list of items needed to produce functions
let searchCity = $("#current-forecast")
let searchedCities = [];
let city
let APIKEY = "7ca96097be63f6f51d3f8ccd3a2f5564";
let todayDate = moment().format("dddd, MMMM Do, h:mm a");

function createButtons() {
    $("#past-search-buttons").empty();
    for (var i=0; i < searchedCities.length; i++) {
        let pastCities = $("<button>");
        pastCities.addClass("col-md-12");
        pastCities.attr("id", "past-searched-cities")
        pastCities.attr("data-name", searchedCities[i]);
        pastCities.text(searchedCities[i]);
        $("#past-search-buttons").prepend(pastCities);
    }
}

function savedSearches() {
    localStorage.setItem("savedCities", JSON.stringify(searchedCities));
}

$(document).ready(function() {
    if(localStorage.getItem("savedCities") != null) {
        var citiesLocal = localStorage.getItem("savedCities");
        var citiesPushed = JSON.parse(citiesLocal);
        searchedCities = searchedCities.concat(citiesPushed);
    }
    createButtons();
})

$("#run-search").on("click", function (event) {
    city = $("#city").val().trim();
    event.preventDefault();
    getWeather();
    //getFiveDay();
})

$(document).on("click", "#past-searched-cities", function(event) {
    event.preventDefault();
    city = $(this).attr("data-name");
    getWeather();
    //getFiveDay();
})

function getWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKEY + "&units=imperial";

    // Perfoming an AJAX GET request to our queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
        .then(function (response) {
            console.log(response);
            if (searchedCities.includes(response.name) === false ) {
                searchedCities.push(response.name);
            }
            $("#searched-city").empty();
            $("#current-weather-container").empty();
            
            var cityDiv = $("<div>");
            cityDiv.html("Current forecast for " + response.name);
            
            var p = $("<p>").html("<i>" + todayDate + "</i>");
            var p1 = $("<p>").html("<i> Temperature: " + response.main.temp.toFixed(0) + "&deg;F" + "</i>");
            var p2 = $("<p>").html("<i> Humidity: " + response.main.humidity.toFixed(0) + "%" + "</i>");
            var p3 = $("<p>").html("<i> Wind Speed: " + response.wind.speed.toFixed(0) + " MPH" + "</i>");
            
            var iconImage = $("<img id = 'icon'>");
            $("#searched-city").append(iconImage);
            var iconEl = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconEl + ".png";

            $('#icon').attr('src', iconURL);
            $("#searched-city").prepend(cityDiv);
            $("#current-weather-container").append(p, p1, p2, p3);

            // Variables for lat and lon. Need these for UV index API call
            var lon = response.coord.lon;
            var lat = response.coord.lat;

            // UV Index API call
            var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY;

            // Perfoming an AJAX GET request to our queryURL
            $.ajax({
              url: uvURL,
              method: "GET"
            })
                .then(function (response) {
                    //Gets response from API and appends it
                    var uvIndex = response.value;
                    var p4 = $("<p>").html("<i> UV Index: " + uvIndex + "</i>");
                    $("#current-weather-container").append(p4);
                    console.log(response.value);
                });


            createButtons();
            savedSearches();
        });
}

function getFiveDay() {

}

// $("#run-search").on("click", function (event) {
//     city = $("#city").val().trim();
//     event.preventDefault();

//     var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKEY + "&units=imperial";

//     // Perfoming an AJAX GET request to our queryURL
//     $.ajax({
//       url: queryURL,
//       method: "GET"
//     })
//         .then(function (response) {
//             console.log(response);
//             if (searchedCities.includes(response.name) === false ) {
//                 searchedCities.push(response.name);
//             }
//             $("#searched-city").empty();
//             $("#current-weather-container").empty();
            
//             var cityDiv = $("<div>");
//             cityDiv.html("Current forecast for " + response.name);
//             //$("#searched-city").prepend(cityDiv);
            
//             var p = $("<p>").html("<i>" + todayDate + "</i>");
//             var p1 = $("<p>").html("<i> Temperature: " + response.main.temp.toFixed(0) + "&deg;F" + "</i>");
//             var p2 = $("<p>").html("<i> Humidity: " + response.main.humidity.toFixed(0) + "%" + "</i>");
//             var p3 = $("<p>").html("<i> Wind Speed: " + response.wind.speed.toFixed(0) + " MPH" + "</i>");
            
//             var iconImage = $("<img id = 'icon'>");
//             $("#searched-city").append(iconImage);
//             var iconEl = response.weather[0].icon;
//             var iconURL = "http://openweathermap.org/img/w/" + iconEl + ".png";

//             $('#icon').attr('src', iconURL);
//             $("#searched-city").prepend(cityDiv);
//             $("#current-weather-container").append(p, p1, p2, p3);

//             var lon = response.coord.lon;
//             var lat = response.coord.lat;


//             var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY;

//             // Perfoming an AJAX GET request to our queryURL
//             $.ajax({
//               url: uvURL,
//               method: "GET"
//             })
//                 .then(function (response) {
//                     var uvIndex = response.value;
//                     var p4 = $("<p>").html("<i> UV Index: " + uvIndex + "</i>");
//                     $("#current-weather-container").append(p4);
//                     console.log(response.value);
//                 });


//             createButtons();
//             savedSearches();
//         });

// })

