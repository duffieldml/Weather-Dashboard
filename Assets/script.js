// Define list of items needed to produce functions
let searchCity = $("#current-forecast")
let searchedCities = [];
let city
let APIKEY = "7ca96097be63f6f51d3f8ccd3a2f5564";
let presentTime = moment();
let todayDate = moment().format("dddd, MMMM Do, YYYY");

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

function getWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKEY + "&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET"
      })

        .then(function (response) {
            //$("#list-group").html("")
            var newDiv = $("<div class='currentWeather'>");
            newDiv.html("<h2>Current Weather for: " + city);

            console.log(response);
        })
        
}




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
            //$("#list-group").html("")
            var newDiv = $("<div class='currentWeather'>");
            newDiv.html("<h2>Current Weather for: " + city);
            console.log(todayDate)
            createButtons();
        });

})


