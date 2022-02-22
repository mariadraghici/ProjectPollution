//javascript.js
//set map options

var myLatLng = { lat: 44.172388, lng: 28.636472 };
var mapOptions = {
    center: myLatLng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP

};

//create map
var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);

function calcRouteDriving() {
    var pretCombustibil = checkCombustibil();

    var result = 0;

    //create driving request
    var requestDriving = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, //DRIVING, WALKING, BYCYCLING, TRANSIT,SCOOTER
        unitSystem: google.maps.UnitSystem.METRIC
    }

    //pass the request to the route method
    directionsService.route(requestDriving, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            //Get distance and time
            const outputDriving = document.querySelector('#outputDriving');
            
             //Calculate price
             var myResult = result.routes[0].legs[0].distance.value * document.getElementById("consum").value * pretCombustibil /100 / 1000;
             var tax = 3.43;
             var twoTax = parseFloat(myResult + tax).toFixed(2);
             var polution = carPolutionCalculate(result.routes[0].legs[0].distance.value, document.getElementById("consum").value);
             var twoPolution = parseFloat(polution).toFixed(5);
            outputDriving.innerHTML = "<div class='alert-info'>Car:<br />" + "From: " + document.getElementById("from").value + ".<br />To: " + 
                                        document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + 
                                        ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".<br />Price <i class='fa fa-money' aria-hidden='true'></i> : " + twoTax +
                                        ".<br />Vehicle CO2 Emissions:" + twoPolution  +" kg."+"</div>";

            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            outputDriving.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });
}
/*function RouteDriving() {
    var pretCombustibil = checkCombustibil();

    var result = 0;

    //create driving request
    var requestDriving = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, //DRIVING, WALKING, BYCYCLING, TRANSIT,SCOOTER
        unitSystem: google.maps.UnitSystem.METRIC
    }
    directionsService.route(requestDriving, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            outputDriving.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });
}*/
function calcRouteWalking() {

    var result = 0;

    //create walking request
    var requestWalking = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.WALKING, //DRIVING, WALKING, BYCYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.METRIC
    }

    //pass the request to the route method
    directionsService.route(requestWalking, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            //Get distance and time
            const outputWalking = document.querySelector('#outputWalking');
            var calories = 65 * result.routes[0].legs[0].distance.value /1000
            outputWalking.innerHTML = "<div class='alert-info'>Walking:<br />" + "From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Walking distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".<br />Calories <i class='fas fa-fire'></i> : " + calories + "</div>";
            


            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            outputWalking.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });
}

function calcRouteBycycling() {

    var result = 0;

    //create bycycling request
    var requestBycycling = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.BICYCLING, //DRIVING, WALKING, BYCYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.METRIC
    }

    //pass the request to the route method
    directionsService.route(requestBycycling, function (result, status) {

        
        if (status == google.maps.DirectionsStatus.OK) {

            //Get distance and time
            const outputBycycling = document.querySelector('#outputBycycling');
            
            outputBycycling.innerHTML = "<div class='alert-info'>Bycycling:<br />" + "From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text +  "</div>";
            


            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            outputBycycling.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Bicycling not available in your city.</div>";
        }
    });
}

function calcRouteTransit() {

    var result = 0;

    //create bycycling request
    var requestTransit = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.TRANSIT, //DRIVING, WALKING, BYCYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.METRIC
    }

    //pass the request to the route method
    directionsService.route(requestTransit, function (result, status) {

        var ticketPrice = 1.5;
        
        if (status == google.maps.DirectionsStatus.OK) {

            //Get distance and time
            const outputTransit = document.querySelector('#outputTransit');
            var polution = result.routes[0].legs[0].distance.value /1000 * document.getElementById("consum").value/100 /23.9 / 1.6/25;
            var busPolution = parseFloat(polution).toFixed(5);
            outputTransit.innerHTML = "<div class='alert-info'>Bus:<br />" + "From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".<br />Price <i class='fa fa-money' aria-hidden='true'></i> : " + ticketPrice + ".<br />Bus CO2 Emissions:" + busPolution  +" kg."+"</div>";
            


            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            outputTransit.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });
}


function calcElectricScooter() {

    var result = 0;

    //create driving request
    var requestDriving = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, //DRIVING, WALKING, BYCYCLING, TRANSIT,SCOOTER
        unitSystem: google.maps.UnitSystem.METRIC
    }

    //pass the request to the route method
    directionsService.route(requestDriving, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            //Get distance and time
            const outputScooter = document.querySelector('#outputElectricScooter');
            
             //Calculate price
             var time = result.routes[0].legs[0].distance.value / 15 * 60 / 1000;
             var myResult = time * 0.4;
             var twoTax = parseFloat(myResult).toFixed(2);
             outputScooter.innerHTML = "<div class='alert-info'>Electric Scooter:<br />" + "From: " + document.getElementById("from").value + ".<br />To: " + 
                                        document.getElementById("to").value + ".<br /> Distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + 
                                        ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + time + "mins.<br />Price <i class='fa fa-money' aria-hidden='true'></i> : " + twoTax +
                                        ".<br />Vehicle CO2 Emissions:" + 0  +" kg." + "</div>";

            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            outputScooter.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });
}

//define calcRoute function
function calcRoute() {
    calcRouteDriving();
    calcRouteWalking();
    calcRouteBycycling();
    calcElectricScooter();
    calcRouteTransit();
    ff();
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, {
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  });

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, {
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  });

var pretCombustibil;

function checkCombustibil() {
    if (document.getElementById("flexRadioDefault1").checked === true) {
        return pretCombustibil = 6.83;
    } else {
        return pretCombustibil = 6.13;
    }
}

function carPolutionCalculate(distance, consum) {
    if (document.getElementById("flexRadioDefault1").checked === true) {
        //return carPolution = result.routes[0].legs[0].distance.value /1000 * document.getElementById("consum").value /100 /26.2 / 1.6;
        return  carPolution = distance /1000 * consum/100 /26.2 / 1.6;
    } else {
        //return carPolution = result.routes[0].legs[0].distance.value /1000 * document.getElementById("consum").value /100 /23.9 / 1.6;
        return  carPolution = distance /1000 * consum/100 /23.9 / 1.6;
    }
}



async function f(string) {
    let userResponse = await fetch(string);
    return userResponse.json();
}

async function ff(){
    var city = document.getElementById("to").value.split(",");
    console.log(city[1]);
    // var city2 = city[1].split(" ");
    var string = "https://api.weatherbit.io/v2.0/current/airquality?city=" + city[1] + "&country=RO&key=5bde06df3dfc424c9081eae078e24efe";
    console.log(string);
    let data = await f(string);
    console.log(data.data);
    outputStatistic.innerHTML = "<div class='alert-info2'>Air Statistics<br />" + "For: "+ city[1] +  ".<br /> Air Quality Index : " + data.data[0].aqi +
                            ".<br /> Concentration of surface O3 (µg/m³): " + data.data[0].o3 +".<br /> Concentration of surface SO2 (µg/m³) : " + data.data[0].so2 +
                            ".<br /> Concentration of surface NO2 (µg/m³): " + data.data[0].no2 + ".<br /> Concentration of carbon monoxide (µg/m³) : " + data.data[0].co +
                            ".<br /> Concentration of particulate matter .<br />< 2.5 microns (µg/m³) : " + data.data[0].pm25+ ".<br /> Concentration of particulate matter .<br /> < 10 microns (µg/m³) : " + data.data[0].pm10 +
                            ".<br /> Tree pollen level : " + data.data[0].pollen_level_tree +
                            ".<br /> Grass pollen level : " + data.data[0].pollen_level_grass +
                            ".<br /> Mold level : " + data.data[0].mold_level +
                            ".<br /> Predominant pollen type .<br /> (Trees/Weeds/Molds/Grasses) : " + data.data[0].predominant_pollen_type      + "</div>";


}


