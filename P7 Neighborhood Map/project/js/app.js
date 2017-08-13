// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var markers = [];

function initAutocomplete() {
    "use strict";
    var newYork = {lat: 40.7413549, lng: -73.9980244};

    // New York as initial viewport
    map = new google.maps.Map(document.getElementById('map'), {
        center: newYork,
        zoom: 13
    });

    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('zoom-to-area-text'));
    document.getElementById('zoom-to-area').addEventListener('click', function() {
        zoomToArea();
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length === 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // Clear out sidebar
        VM.restaurantList([]);

        // Clear out dropdown
        VM.cuisinesList([]);
        VM.cuisinesUnique = [];

        // For each place, get the icon, name and location.
        infowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        var service = new google.maps.places.PlacesService(map);
        places.forEach(function(place) {
            service.nearbySearch({
                location: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
                radius: 500,
                uniqueCuisine: ['restaurant']
            }, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        var place = results[i];
                        var marker = new google.maps.Marker({
                            name: place.name,
                            map: map,
                            position: place.geometry.location,
                            animation: null
                        });
                        markers.push(marker);
                        bounds.extend(marker.position);
                        apiRequest(marker);
                    }
                    map.fitBounds(bounds);
                }
            });
        });
    });
}

// Go to selected city when 'Go' is clicked
function zoomToArea() {
    "use strict";

    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();

    // Get the address or place that the user entered.
    var address = document.getElementById('zoom-to-area-text').value;

    // Make sure the address isn't blank.
    if (address === '') {
        window.alert('You must enter an area, or address.');
    } else {
        // Geocode the address/area entered to get the center. Then, center the map
        // on it and zoom in
        geocoder.geocode(
            { address: address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(13);
                } else {
                    window.alert('We could not find that location - try entering a more' +
                        ' specific place.');
                }
            });
    }
}

// Request data from zomato API
function apiRequest(marker) {
    "use strict";
    var restaurantAPI = `https://developers.zomato.com/api/v2.1/search?q=${marker.name}&lat=${marker.position.lat()}&lon=${marker.position.lng()}&apikey=fdab76b655596f02ba656c39adca693e`;
    $.getJSON(restaurantAPI, function (data) {
        if (data.results_shown === 0) {
            // No restaurant info
            marker.api = false;
        } else {
            marker.api = true;
            var restaurant = data.restaurants[0].restaurant;
            marker.url = restaurant.url;
            marker.rating = restaurant.user_rating.aggregate_rating;
            marker.votes = restaurant.user_rating.votes;
            marker.cost = restaurant.average_cost_for_two;
            marker.currency = restaurant.currency;
            marker.cuisines = restaurant.cuisines;
            marker.thumb = restaurant.thumb;
        }
        marker.addListener('click', function() {
            getPlacesDetails(this, infowindow);
        });

        // Add marker to restaurantList and cuisinesList for sidebar and dropdown respectively
        VM.addMarker(marker, infowindow);
    }).error(function (e) {
        marker.api = false;
        marker.addListener('click', function() {
            getPlacesDetails(this, infowindow);
        });
        VM.addMarker(marker, infowindow);
    });
}

// Populate the DOM
function getPlacesDetails(marker, infowindow) {
    "use strict";

    // Set the marker property on this infowindow so it isn't created again.
    infowindow.marker = marker;
    if (marker.api === true) {
        var innerHTML = '<div>';
        if (marker.url !== '') {
            innerHTML += `<a href="${marker.url}">${marker.name}</a>`;
        } else {
            innerHTML += `${marker.name}`
        }
        if (marker.rating !== '') {
            innerHTML += `<br>${marker.rating}/5`;
        }
        if (marker.votes !== '') {
            innerHTML += `  (${marker.votes} votes)`;
        }
        if (marker.cost !== '' && marker.currency !== '') {
            innerHTML += `<br>${marker.currency}${marker.cost} for two people`;
        } else if (marker.cost !== '') {
            innerHTML += `<br>${marker.cost} for two people`
        }
        if (marker.cuisines !== '') {
            innerHTML += `<br>${marker.cuisines}`;
        }
        if (marker.thumb !== '') {
            innerHTML += `<br><img src="${marker.thumb}" alt="thumb" style="width:250px">`;
        }
        innerHTML += '</div>';
        infowindow.setContent(innerHTML);
    } else {
        infowindow.setContent(marker.name);
    }
    animation(marker, infowindow);
}

// Open the infowindow and make the marker bounce once
function animation(marker, infowindow) {
    "use strict";
    infowindow.open(map, marker);
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 750);
    }
}

var ViewModel = function () {
    "use strict";
    var self = this;
    this.restaurantList = ko.observableArray([]);
    this.cuisinesList = ko.observableArray([]);

    // For filtering distinct cuisines
    this.cuisinesUnique = [];
    this.addMarker = function (marker, infowindow) {
        // Add marker to restaurantList for sidebar
        self.restaurantList.push(new Restaurant(marker, infowindow));

        // Add marker to cuisinesList for dropdown
        if (marker.api === true && marker.cuisines !== '') {
            var cuisines = marker.cuisines;
            var cuisinesSplit = cuisines.split(', ');
            cuisinesSplit.forEach(function (cuisine) {
                var uniqueCuisine = new Cuisines(cuisine);
                if (self.cuisinesUnique.indexOf(uniqueCuisine.name) === -1) {
                    self.cuisinesUnique.push(uniqueCuisine.name);
                    self.cuisinesList.push(uniqueCuisine);
                }
            });
        }
    };
};

var Restaurant = function (marker, infowindow) {
    "use strict";
    this.marker = marker;

    // Hide filtered restaurant on sidebar if false
    this.visibility = ko.observable(true);

    // Get infowindow when click on restaurant on sidebar
    this.detail = function () {
        getPlacesDetails(marker, infowindow);
    };
};

var Cuisines = function (cuisine) {
    "use strict";
    var self = this;
    this.name = cuisine;
    this.filter = function () {
        filter(self.name);
    };
};

// Dropdown filter
function filter(name) {
    ko.utils.arrayForEach(VM.restaurantList(), function (restaurant) {
        restaurant.marker.setMap(map);
        restaurant.visibility(true);
        var cuisines = restaurant.marker.cuisines;
        var cuisinesSplit = cuisines.split(', ');
        if (cuisinesSplit.indexOf(name) === -1) {
            // Visibility on map
            restaurant.marker.setMap(null);

            // Visibility on sidebar
            restaurant.visibility(false);
        }
    });
}

var VM = new ViewModel();

ko.applyBindings(VM);
