var map;
var infowindow;
var markers = [];

function initMap() {
    "use strict";
    var newYork = {lat: 40.7413549, lng: -73.9980244};

    map = new google.maps.Map(document.getElementById('map'), {
        center: newYork,
        zoom: 13
    });

    infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: newYork,
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
}