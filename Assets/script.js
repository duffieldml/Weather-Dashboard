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
        pastCities.addClass("col-md-12 past-search-buttons");
        pastCities.attr("data-name", searchedCities[i]);
        pastCities.text(searchedCities[i]);
        $("#past-search-buttons").prepend(pastCities);
    }
}

// function getWeather() {
//     var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKEY + "&units=imperial";
//     $.ajax({
//         url: queryURL,
//         method: "GET"
//       })

//         .then(function (response) {
//             //$("#list-group").html("")
//             var weatherDiv = $("<div class='currentWeather'>");
//             weatherDiv.html("<h2>Current Weather for: " + city);

//             console.log(response);
//         })
        
// }




$("#run-search").on("click", function (event) {
    city = $("#city").val().trim();
    event.preventDefault();

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
            $("#searched-city").prepend(cityDiv);
            var p = $("<p>").html("<i>" + todayDate + "</i>");
            var p1 = $("<p>").html("<i> Temperature: " + response.main.temp.toFixed(0) + "&deg;F" + "</i>");
            var p2 = $("<p>").html("<i> Humidity: " + response.main.humidity.toFixed(0) + "%" + "</i>");
            var p3 = $("<p>").html("<i> Wind Speed: " + response.wind.speed.toFixed(0) + " MPH" + "</i>");
            var p4 = $("<p>").html("<i> UV Index: " + response.wind.speed.toFixed(0) + " MPH" + "</i>");
            $("#current-weather-container").append(p, p1, p2, p3);

            console.log(response.main.temp);
            console.log(response.main.humidity);
            console.log(response.wind.speed);

            createButtons();
        });

})


