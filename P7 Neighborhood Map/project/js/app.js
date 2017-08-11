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

    map = new google.maps.Map(document.getElementById('map'), {
        center: newYork,
        zoom: 13
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('zoom-to-area-text'));

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    document.getElementById('zoom-to-area').addEventListener('click', function() {
        zoomToArea();
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

        // For each place, get the icon, name and location.
        infowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        var service = new google.maps.places.PlacesService(map);
        places.forEach(function(place) {
            service.nearbySearch({
                location: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
                radius: 500,
                type: ['restaurant']
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

                        marker.addListener('click', function() {
                            getPlacesDetails(this, infowindow);
                        });
                    }
                    map.fitBounds(bounds);
                }
            });
        });
    });
}

// This function takes the input value in the find nearby area text input
// locates it, and then zooms into that area. This is so that the user can
// show all listings, then decide to focus on one area of the map.
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

function getPlacesDetails(marker, infowindow) {
    "use strict";
    var restaurantAPI = `https://developers.zomato.com/api/v2.1/search?q=${marker.name}&lat=${marker.position.lat()}&lon=${marker.position.lng()}&apikey=8e563edbe434185a64f3948dad0864a8`;
    $.getJSON(restaurantAPI, function (data) {
        if (data.results_shown === 0) {
            // Set the marker property on this infowindow so it isn't created again.
            infowindow.marker = marker;
            infowindow.setContent(marker.name);
        } else {
            var restaurant = data.restaurants[0].restaurant;
            infowindow.marker = marker;
            var innerHTML = '<div>';
            if (restaurant.name && restaurant.url) {
                innerHTML += `<a href="${restaurant.url}">${restaurant.name}</a>`;
            } else if (restaurant.name) {
                innerHTML += `${restaurant.name}`
            }
            if (restaurant.user_rating.aggregate_rating) {
                innerHTML += `<br>${restaurant.user_rating.aggregate_rating}/5`;
            }
            if (restaurant.user_rating.votes) {
                innerHTML += `  (${restaurant.user_rating.votes} votes)`;
            }
            if (restaurant.average_cost_for_two && restaurant.currency) {
                innerHTML += `<br>${restaurant.currency}${restaurant.average_cost_for_two} for two people`;
            } else if (restaurant.average_cost_for_two) {
                innerHTML += `<br>${restaurant.average_cost_for_two} for two people`
            }
            if (restaurant.cuisines) {
                innerHTML += `<br>${restaurant.cuisines}`;
            }
            if (restaurant.thumb) {
                innerHTML += `<br><img src="${restaurant.thumb}" alt="thumb" style="width:250px">`;
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
        }
        animation(infowindow, marker);
    }).error(function (e) {
        infowindow.marker = marker;
        infowindow.setContent(marker.name);
        animation(infowindow, marker);
    });
}

function animation(infowindow, marker) {
    "use strict";
    infowindow.open(map, marker);
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 750);
    }
}