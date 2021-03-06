// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map,
    infowindow,
    markers = [],
    melbourne = {lat: -37.7963689, lng: 144.9611738};

function initMap() {
    "use strict";

    // Google Autocomplete with custom binding
    ko.bindingHandlers.addressAutocomplete = {
        init: function (element, valueAccessor) {
            var value = valueAccessor(),
                options = { types: ['geocode'] },
                autocomplete = new google.maps.places.Autocomplete(element, options);
            autocomplete.addListener('place_changed', function () {
                var result = autocomplete.getPlace();
                value(result.formatted_address);
            });
        }
    };

    // Google SearchBox with custom binding
    ko.bindingHandlers.searchBox = {
        init: function (element, valueAccessor) {
            // New York as initial viewport
            map = new google.maps.Map(document.getElementById('map'), {
                center: melbourne,
                zoom: 13,
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                }
            });

            // Create the search box and link it to the UI element.
            var searchBox = new google.maps.places.SearchBox(element);

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
                places.forEach(function (place) {
                    valueAccessor(place);
                    getMarkers(place.geometry.location.lat(), place.geometry.location.lng());
                });
            });
        }
    };

    var ViewModel = function () {
        var self = this;
        this.cityAddress = ko.observable();
        this.placeAddress = ko.observable();
        this.infowindow = ko.observable();
        this.bounds = ko.observable();
        this.restaurantList = ko.observableArray([]);
        this.cuisinesList = ko.observableArray([]);

        // For filtering distinct cuisines
        this.cuisinesUnique = [];

        this.addMarker = function (marker, infowindow, bounds) {
            // Add marker to restaurantList for sidebar
            self.restaurantList.push(new Restaurant(marker, infowindow));

            // Add marker to cuisinesList for dropdown
            if (marker.cuisines !== '') {
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

        // Go to selected city when 'Go' is clicked
        this.zoomToArea = function () {
            // Initialize the geocoder.
            var geocoder = new google.maps.Geocoder();

            // Get the address or place that the user entered.
            var address = self.cityAddress();

            // Make sure the address isn't blank.
            if (address === '') {
                window.alert('You must enter an area, or address.');
            } else {
                // Geocode the address/area entered to get the center. Then, center the map
                // on it and zoom in
                geocoder.geocode(
                    { address: address
                    }, function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            map.setCenter(results[0].geometry.location);
                            map.setZoom(13);
                        } else {
                            window.alert('We could not find that location - try entering a more' +
                                ' specific place.');
                        }
                    });
            }
        };

        this.showAll = function () {
            if (self.infowindow()) {
                self.infowindow().close();
            }
            map.fitBounds(self.bounds());
            self.restaurantList().forEach(function (restaurant) {
                restaurant.marker.setMap(map);
                restaurant.visibility(true);
            });
        };
    };

    var Restaurant = function (marker, infowindow) {
        this.marker = marker;

        // Hide filtered restaurant on sidebar if false
        this.visibility = ko.observable(true);

        // Get infowindow when click on restaurant on sidebar
        this.detail = function () {
            getPlacesDetails(marker, infowindow);
        };
    };

    var Cuisines = function (cuisine) {
        var self = this;
        this.name = cuisine;

        // Dropdown filter
        this.filter = function () {
            var bounds = new google.maps.LatLngBounds();
            VM.restaurantList().forEach(function (restaurant) {
                restaurant.marker.setMap(null);
                restaurant.visibility(false);
                var cuisines = restaurant.marker.cuisines;
                var cuisinesSplit = cuisines.split(', ');
                if (cuisinesSplit.indexOf(self.name) !== -1) {
                    bounds.extend(restaurant.marker.position);

                    // Visibility on map
                    restaurant.marker.setMap(map);

                    // Visibility on sidebar
                    restaurant.visibility(true);
                }
            });
            map.fitBounds(bounds);
        };
    };

    var VM = new ViewModel();

    ko.applyBindings(VM);


    var menu = document.getElementById('menu'),
        input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(menu);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Showing restaurants around Google New York Office by default
    getMarkers(melbourne.lat, melbourne.lng);

    // For each place, get the marker icon, name and location.
    function getMarkers(lat, lng) {
        infowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds(),
            restaurantAPI = `https://developers.zomato.com/api/v2.1/search?count=20&lat=${lat}&lon=${lng}&radius=500&apikey=fdab76b655596f02ba656c39adca693e`;
        $.getJSON(restaurantAPI, function (data) {
            if (data.results_shown === 0) {
                // No restaurant info
                window.alert('Sorry, we cannot find restaurant information around this place.');
            } else {
                data.restaurants.forEach(function (item) {
                    var restaurant = item.restaurant,
                        marker = new google.maps.Marker({
                            name: restaurant.name,
                            map: map,
                            position: {lat: Number(restaurant.location.latitude), lng: Number(restaurant.location.longitude)},
                            animation: null
                        });
                    markers.push(marker);
                    bounds.extend(marker.position);

                    // Restaurant info
                    marker.url = restaurant.url;
                    marker.rating = restaurant.user_rating.aggregate_rating;
                    marker.votes = restaurant.user_rating.votes;
                    marker.cost = restaurant.average_cost_for_two;
                    marker.currency = restaurant.currency;
                    marker.cuisines = restaurant.cuisines;
                    marker.thumb = restaurant.thumb;
                    marker.addListener('click', function() {
                        getPlacesDetails(this, infowindow);
                    });

                    // Add marker to restaurantList and cuisinesList for sidebar and dropdown respectively
                    VM.addMarker(marker, infowindow);
                });

                // `bounds` is a `LatLngBounds` object
                map.fitBounds(bounds);
                VM.bounds(bounds);
                google.maps.event.addDomListener(window, 'resize', function() {
                    map.fitBounds(bounds);
                });
            }
        }).fail(function (e) {
            window.alert('Sorry, restaurant information cannot be loaded.');
        });
    }

    // Populate the DOM
    function getPlacesDetails(marker, infowindow) {
        VM.infowindow(infowindow);
        map.setCenter(marker.getPosition());

        // Set the marker property on this infowindow so it isn't created again.
        infowindow.marker = marker;
        var innerHTML = '<div>';
        if (marker.url !== '') {
            innerHTML += `<a href="${marker.url}">${marker.name}</a>`;
        } else {
            innerHTML += `${marker.name}`;
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
            innerHTML += `<br>${marker.cost} for two people`;
        }
        if (marker.cuisines !== '') {
            innerHTML += `<br>${marker.cuisines}`;
        }
        if (marker.thumb !== '') {
            innerHTML += `<br><img src="${marker.thumb}" alt="thumb" style="width:250px">`;
        }
        innerHTML += '<br><span style="float:right; color:#b1b5be">Powered by Zomato API</span>';
        innerHTML += '</div>';
        infowindow.setContent(innerHTML);
        animation(marker, infowindow);
    }

    // Open the infowindow and make the marker bounce once
    function animation(marker, infowindow) {
        infowindow.open(map, marker);
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ marker.setAnimation(null); }, 750);
        }
    }
}

function googleError () {
    "use strict";
    window.alert('Sorry, Google Maps cannot be loaded.');
}

/*
   * Open the drawer when the menu icon is clicked.
   */
var menu = document.querySelector('#menu');
var main = document.querySelector('main');
var drawer = document.querySelector('#sidebar-wrapper');

menu.addEventListener('click', function(e) {
    "use strict";
    drawer.classList.toggle('open');
    e.stopPropagation();
});
main.addEventListener('click', function() {
    "use strict";
    drawer.classList.remove('open');
});
