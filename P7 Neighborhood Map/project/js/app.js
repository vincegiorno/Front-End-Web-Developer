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

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var infowindow;
    var markers = [];
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
                        var placeLoc = place.geometry.location;

                        var marker = new google.maps.Marker({
                            map: map,
                            position: placeLoc,
                            animation: null
                        });
                        markers.push(marker);
                        bounds.extend(marker.position);

                        google.maps.event.addListener(marker, 'click', (function(markerCopy, place) {
                            return function () {
                                infowindow.setContent(place.name);
                                infowindow.open(map, this);
                                if (markerCopy.getAnimation() !== null) {
                                    markerCopy.setAnimation(null);
                                } else {
                                    markerCopy.setAnimation(google.maps.Animation.BOUNCE);
                                    setTimeout(function(){ markerCopy.setAnimation(null); }, 750);
                                }
                            };
                        })(marker, place));
                        map.fitBounds(bounds);
                    }
                }
            });
        });
    });
}