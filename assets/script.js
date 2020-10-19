 // Button on click event to search for city   
 $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var citySearched = $("#userInput").val();

    // variables for api key and concatonated query url

    var apiKey = "0e14f6cd8a34cf2c0af1f393473c489b";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearched + "&appid=" + apiKey;

    // Ajax call to Open Weather API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);

            // Transfer data content to HTML
            $("#nowCityName").html("<h3>" + response.name + " (" + moment().format('L') + ")" + "</h3>");
            $("#nowHumidity").text("Humidity (%): " + response.main.humidity);
            $("#nowWind").text("Wind Speed (mph): " + response.wind.speed);

            // Convert the temp to fahrenheit
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            // add temp content to html
            $("#nowTemp").text("Temperature (°F): " + tempF.toFixed(2));
            // Call to run function "saveCity"
            saveCity();
            // Function to prepend city to searched city div
            function saveCity() {
                for (var i = 0; i < localStorage.length; i++) {
                    localStorage.setItem("InputCities", response.name);
                    var cities = localStorage.getItem(localStorage.key(i));
                    $('#userCities').prepend('<li><a href="#">' + cities + '</a></li>');
                }
            }
            // Variables for getting the longetude and latitude
            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;
            // New url for getting the uv index
            var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + apiKey;
            // Ajax call to get the uv index
            $.ajax({
                url: uvQueryURL,
                method: "GET"
            })
                .then(function (response) {
                    $("#nowUV").text("UV Index: " + response.value);
                });
            // New url for getting the 5-day forecast
            var forcastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearched + "&cnt=5&appid=" + apiKey;
            // Ajax call for 5-day forecast
            $.ajax({
                url: forcastQueryURL,
                method: "GET"
            })
                .then(function (response) {
                    console.log(response);
                    $("#forecastCards").empty();
                    for (var i = 0; i < response.list.length; i++) {
                        var forecastDiv = $("<div class='card bg-primary'></div>");
                        var p = $("<p>").text(moment().add(i + 1, 'days').format('L'));
                        
                        console.log("Future Temp: "+futureTemp);
                        var humid = $("<p>").text("Humidity (%): " + response.list[i].main.humidity);
                        var foreTemp = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                        var futureTemp = $("<p>").text("Temp (°F)" + (foreTemp * 1).toFixed(2));
                        console.log("ForeTemp: "+foreTemp);
                        var iconCode = response.list[i].weather[0].icon;
                        var iconImage = $("<img>");
                        iconImage.attr("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
                        
                        console.log(iconCode);
                        forecastDiv.append(p);
                        forecastDiv.append(futureTemp);
                        forecastDiv.append(iconImage);
                        forecastDiv.append(humid);
                        $("#forecastCards").append(forecastDiv);
                    }
                    
                });
        });
});
