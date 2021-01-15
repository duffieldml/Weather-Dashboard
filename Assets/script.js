// Define list of items needed to produce functions
let searchedCities = [];
let city
let APIKEY = "7ca96097be63f6f51d3f8ccd3a2f5564";
let todayDate = moment().format("dddd, MMMM Do, h:mm a");

//Creates buttons for each searched city
//Also creates buttons for cities saved in local storage
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

//Saves searched cities to local storage
function savedSearches() {
    localStorage.setItem("savedCities", JSON.stringify(searchedCities));
}

//Pushes saved cities from local storage to cities array
$(document).ready(function() {
    if(localStorage.getItem("savedCities") != null) {
        var citiesLocal = localStorage.getItem("savedCities");
        var citiesPushed = JSON.parse(citiesLocal);
        searchedCities = searchedCities.concat(citiesPushed);
    }
    createButtons();
})

// This is for searching by city name
// Also switches the style of the 5 day forecast to show
$("#run-search").on("click", function (event) {
    city = $("#city").val().trim();
    event.preventDefault();
    $("#five-day-forecast").show();
    getWeather();
    fiveDay();
})

// This is for searching by a previously saved city
// Also switches the style of the 5 day forecast to show
$(document).on("click", "#past-searched-cities", function(event) {
    event.preventDefault();
    city = $(this).attr("data-name");
    $("#five-day-forecast").show();
    getWeather();
    fiveDay();
})

// API call for the current forecast of the city you are searching
function getWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKEY + "&units=imperial";

    // Perfoming an AJAX GET request to our queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
        .then(function (response) {
            //console.log(response);
            // If you have not searched this city before, it pushes it to the array
            if (searchedCities.includes(response.name) === false ) {
                searchedCities.push(response.name);
            }

            // Prevents the current forecast from holding onto past information
            $("#searched-city").empty();
            $("#current-weather-container").empty();
            
            // Creates a new div to display the name of the city
            var cityDiv = $("<div>");
            cityDiv.html("Current forecast for " + response.name);
            
            // Pulls info from API and adds it into current-weather-container
            var p = $("<p>").html("<i>" + todayDate + "</i>").css({'font-weight': 'bold'});
            var p1 = $("<p>").html("<i> Temperature: " + response.main.temp.toFixed(0) + "&deg;F" + "</i>").css({'font-weight': 'bold'});
            var p2 = $("<p>").html("<i> Humidity: " + response.main.humidity.toFixed(0) + "%" + "</i>").css({'font-weight': 'bold'});
            var p3 = $("<p>").html("<i> Wind Speed: " + response.wind.speed.toFixed(0) + " MPH" + "</i>").css({'font-weight': 'bold'});
            
            // Pulls icon code from API, adds attributes to img tag
            var iconImage = $("<img id = 'icon'>");
            $("#searched-city").append(iconImage);
            var iconURL = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
            $('#icon').attr('src', iconURL);

            //Pushes the new div to the html
            $("#searched-city").prepend(cityDiv);

            // Adds in forecast info
            $("#current-weather-container").append(p, p1, p2, p3);

            // Variables for lat and lon. Need these for UV index API call
            var lon = response.coord.lon;
            var lat = response.coord.lat;

            // UV Index API call
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY;

            // Perfoming an AJAX GET request to our queryURL
            $.ajax({
              url: uvURL,
              method: "GET"
            })
                .then(function (response) {
                    //Gets response from API and appends it
                    var uvIndex = response.value;
                    //if else statements for different color UV index
                    if (uvIndex <= 2) {
                        var p4 = $("<p class=col-md-2>").html("<i> UV Index: " + uvIndex + "</i>").css({'background-color': 'green', 'font-weight': 'bold'});  
                        $("#current-weather-container").append(p4);
                    } else if (uvIndex > 2 && uvIndex <=5) {
                        var p4 = $("<p class=col-md-2>").html("<i> UV Index: " + uvIndex + "</i>").css({'background-color': 'yellow', 'font-weight': 'bold'});  
                        $("#current-weather-container").append(p4);
                    } else {
                        var p4 = $("<p class=col-md-2>").html("<i> UV Index: " + uvIndex + "</i>").css({'background-color': 'red', 'font-weight': 'bold'});  
                        $("#current-weather-container").append(p4);
                    }
                });

                
            createButtons();
            savedSearches();
        });
}

function fiveDay() { 
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKEY + "&units=imperial";

    // Perfoming an AJAX GET request to our queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
        .then(function (response) {
            
            //Getting date for upcoming forecast
            var date1 = new Date (response.list[2].dt_txt);
            var date2 = new Date (response.list[10].dt_txt);
            var date3 = new Date (response.list[18].dt_txt);
            var date4 = new Date (response.list[26].dt_txt);
            var date5 = new Date (response.list[34].dt_txt);

            //Gets icon image for each forecast day
            var img1URL = "http://openweathermap.org/img/w/" + response.list[2].weather[0].icon + ".png";
            var img2URL = "http://openweathermap.org/img/w/" + response.list[10].weather[0].icon + ".png";
            var img3URL = "http://openweathermap.org/img/w/" + response.list[18].weather[0].icon + ".png";
            var img4URL = "http://openweathermap.org/img/w/" + response.list[26].weather[0].icon + ".png";
            var img5URL = "http://openweathermap.org/img/w/" + response.list[34].weather[0].icon + ".png";

            //Gets temperature for each forecast day
            var temp1 = response.list[2].main.temp.toFixed(0);
            var temp2 = response.list[10].main.temp.toFixed(0);
            var temp3 = response.list[18].main.temp.toFixed(0);
            var temp4 = response.list[26].main.temp.toFixed(0);
            var temp5 = response.list[34].main.temp.toFixed(0);

            //Gets humidity for each forecast day
            var hum1 = response.list[2].main.humidity.toFixed(0);
            var hum2 = response.list[10].main.humidity.toFixed(0);
            var hum3 = response.list[18].main.humidity.toFixed(0);
            var hum4 = response.list[26].main.humidity.toFixed(0);
            var hum5 = response.list[34].main.humidity.toFixed(0);

            //Adds date to the card
            $(".date1").html(moment(date1).format("dddd, hA"));
            $(".date2").html(moment(date2).format("dddd, hA"));
            $(".date3").html(moment(date3).format("dddd, hA"));
            $(".date4").html(moment(date4).format("dddd, hA"));
            $(".date5").html(moment(date5).format("dddd, hA"));

            //Adds icon image to the card
            $(".img1").attr("src", img1URL);
            $(".img2").attr("src", img2URL);
            $(".img3").attr("src", img3URL);
            $(".img4").attr("src", img4URL);
            $(".img5").attr("src", img5URL);

            //Adds temperature to the card
            $(".temp1").html("Temperature: " + temp1 + "&deg;F");
            $(".temp2").html("Temperature: " + temp2 + "&deg;F");
            $(".temp3").html("Temperature: " + temp3 + "&deg;F");
            $(".temp4").html("Temperature: " + temp4 + "&deg;F");
            $(".temp5").html("Temperature: " + temp5 + "&deg;F");

            //Adds humidity to the card
            $(".hum1").html("Humidity: " + hum1 + "%");
            $(".hum2").html("Humidity: " + hum2 + "%");
            $(".hum3").html("Humidity: " + hum3 + "%");
            $(".hum4").html("Humidity: " + hum4 + "%");
            $(".hum5").html("Humidity: " + hum5 + "%");

            //Console logs to determine if I had paths correct
            // console.log(response);
            // console.log(date1);
            // console.log(temp1);
            // console.log(hum1);
            // console.log(img1);
        })
}

