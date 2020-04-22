var routeColors = {
    // "紅":"rgb(157,33,51)",
    // "橘":"rgb(204,85,23)",
    // "黃":"rgb(241,207,0)",
    // "綠":"rgb(189,183,0)",
    // "藍":"rgb(64,186,179)",
    // "棕":"rgb(118,103,87)"
    "紅": "#9d2133",
    "橘": "#cc5517",
    "黃": "#f1cf00",
    "綠": "#bdb700",
    "藍": "#40bab3",
    "棕": "#766757"
};

function getColor(routeName) {
    for (var color in routeColors) {
        if (routeName.includes(color)) {
            return routeColors[color];
        }
    }
    return "#000000";
}

function mapDataStyling(feature) {
    var featureType = feature.getGeometry().getType();
    var returnDict = {};
    switch (featureType) {
        case "Point":
            var originalPx = 48;
            var shrinkScale = (map.getZoom() > 14) ? 2 : 1.5;
            returnDict.icon = {
                url: "https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1532-bus_4x.png&scale=2&highlight=" + getColor(feature.getProperty("route")).slice(1),
                size: new google.maps.Size(originalPx, originalPx),
                scaledSize: new google.maps.Size(originalPx/shrinkScale, originalPx/shrinkScale),
                anchor: new google.maps.Point(originalPx/shrinkScale/2, originalPx/shrinkScale/2),
                origin: new google.maps.Point(0, 0)
            };
            break;
        case "LineString":
            returnDict.strokeWeight = 5;
            returnDict.strokeOpacity = 1;
            returnDict.strokeColor = getColor(feature.getProperty("route"));
            break;
    }

    return returnDict;
}

var MapBasicOptions = {
    zoom: 12,
    center: { lat: 23.078352730656285, lng: 120.25781059265138 }
};

// Style Created with
// https://mapstyle.withgoogle.com/
var MapStyleArray = [{
        "elementType": "geometry",
        "stylers": [{
            "color": "#ebe3cd"
        }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#523735"
        }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#f5f1e6"
        }]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#a5b076"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#447530"
        }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
                "color": "#f5f1e6"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "color": "#fdfcf8"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f8c967"
        }]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{
            "color": "#e98d58"
        }]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#db8555"
        }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
                "color": "#dfd2ae"
            },
            {
                "visibility": "on"
            },
            {
                "weight": 4
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#b9d3c2"
        }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#92998d"
        }]
    }
];

var MapStyleOptions = {
    name: "cleanVintage",
    alt: "清爽復古"
};