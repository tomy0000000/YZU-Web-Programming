var map;

function init() {
    if (location.protocol != 'https:') {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    } else {
        loadLatestVersion(initMap);
    }
}

function manuallyLoadGeoJSON(version, route) {
    var features;

    function parseJson(json) {

        //  Method: Manually
        // for (var i = 0; i < json.features.length; i++) {
        //     var objectType = json.features[i].geometry.type;
        //     switch (objectType) {
        //         case "LineString":
        //             var coords = json.features[i].geometry.coordinates;
        //             for (var j = coords.length - 1; j >= 0; j--) {
        //                 // console.log(coords[j]);
        //                 coords[j] = { lat: coords[j][1], lng: coords[j][0] };
        //             }
        //             var polylineBuilder = {
        //                 path: coords,
        //                 geodesic: true,
        //                 strokeColor: getColor(route)
        //             };
        //             var polyline = new google.maps.Polyline(polylineBuilder);
        //             polyline.setMap(map);
        //             break;
        //         case "Point":
        //             var coord = json.features[i].geometry.coordinates;
        //             var latLng = new google.maps.LatLng(coord[1], coord[0]);
        //             var markerBuilder = {
        //                 position: latLng,
        //                 map: map
        //             };
        //             var itemFeatures = json.features[i].properties;
        //             var infoWindowBuilder = {
        //                 content: "<ul><li>站牌名稱: "+itemFeatures.站牌名稱+"</li><li>站牌英文: "+itemFeatures.站牌英文+"</li><li>語音查詢代碼: "+itemFeatures.語音查詢代碼+"</li></ul>"
        //             };
        //             var marker = new google.maps.Marker(markerBuilder);
        //             var infoWindow = new google.maps.InfoWindow(infoWindowBuilder);
        //             // marker.addListener("click", function() { infoWindow.open(map, this); });
        //             marker.addListener("click", function() { new google.maps.InfoWindow({
        //                 content: "<ul><li>站牌名稱: "+itemFeatures.站牌名稱+"</li><li>站牌英文: "+itemFeatures.站牌英文+"</li><li>語音查詢代碼: "+itemFeatures.語音查詢代碼+"</li></ul>"
        //             }).open(map, this); });
        //             marker.setMap(map);
        //             break;
        //     }
        // }


        //  Method: addGeoJSON
        features = map.data.addGeoJson(json);
        loadingActions(features);
    }

    function loadingActions(features) {
        for (var i = 0; i < features.length; i++) {
            features[i].setProperty("route", route);
            switch (features[i].getGeometry().getType()) {
                case "LineString":
                    // features[i].setProperty("strokeColor", getColor(route));
                    break;
                case "Point":
                    // features[i].setProperty("icon", "https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1532-bus_4x.png&scale=2&highlight=" + getColor(route).slice(1));
                    break;
            }
        }
    }

    function loadingFailed() {
        alert("Failed to load Route!");
    }

    //  Load GeoJSON (Local)
    $.getJSON("./data/Lines/" + version + "/" + route + ".json", parseJson).fail(loadingFailed);

    //  Load GeoJSON (Online)
    // map.data.loadGeoJson("https://storage.googleapis.com/mapsdevsite/json/google.json", loadingActions);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getCurrentView() {
    console.log("Latitude: ");
    console.log(map.getCenter().lat());
    console.log("Longitude: ");
    console.log(map.getCenter().lng());
    console.log("Altitude: ");
    console.log(map.getZoom());
}

function updateUserLoc(firstTime) {
    function toggleBounce() {
        if (userLocationMarker.getAnimation() !== null) {
            userLocationMarker.setAnimation(null);
        } else {
            userLocationMarker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    function fetchSucceed(position) {
        if (firstTime) {
            var userLocationMarkerBuilder = {
                icon: {
                    url: "https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-pin-container_4x.png&scale=2&highlight=000000",
                    size: new google.maps.Size(64, 64),
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 16),
                    origin: new google.maps.Point(0, 0)
                },
                animation: google.maps.Animation.DROP,
                position: { lat: position.coords.latitude, lng: position.coords.longitude },
                map: map
            };
            userLocationMarker = new google.maps.Marker(userLocationMarkerBuilder);
            userLocationMarker.addListener('click', toggleBounce);
            map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
            map.setZoom(17);
        } else {
            userLocationMarker.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        }
        setTimeout(updateUserLoc, 10000, false);
    }

    function fetchFailed() {
        alert("Error: The Geolocation service failed.");
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchSucceed, fetchFailed);
    } else {
        alert("Error: Your browser doesn\'t support geolocation.");
    }
}

function zoomChanged(event) {
    map.data.setStyle(mapDataStyling);
}

function getArrival(code, route, infoWindow, feature) {

    function testParse(page) {
        var loadPage = document.createElement("html");
        loadPage.innerHTML = page;
        var routes = loadPage.getElementsByTagName("td");
        var found = false;
        var Final = null;
        for (var i = 0; i < routes.length; i++) {
            if (found) {
                Final = routes[i].children[0].innerHTML;
                break;
            } else if (routes[i].children[0].innerHTML == route) {
                found = true;
            }
        }
        if (!found) {
            Final = "Error!";
        }
        var infoWindowContents = "<div id=\"iw-container\">" +
                "<div id=\"iw-stationCH\" class=\"iw-titles\">" + feature.getProperty("站牌名稱") + "</div>" +
                "<div id=\"iw-stationEN\" class=\"iw-titles\">" + feature.getProperty("站牌英文") + "</div>" +
                "<div id=\"iw-arrival\">"+Final+"</div>" +
                "</div>";
        infoWindow.setContent(infoWindowContents);
    }

    function testloadingFailed() {
        alert("Failed");
    }

    // $.get("http://www.2384.com.tw/qrcode/vstop?code=9211", testParse).fail(testloadingFailed);
    // $.ajax({url: "http://www.2384.com.tw/qrcode/vstop?code=9211", success: testParse}).fail(testloadingFailed);

    $.ajax({
        url: "map.php",
        data: {code: code},
        type: "GET",
        datatype: "html",
        success: testParse,
        error: testloadingFailed
    });

}

function initMap(version) {

    //  Basic Maps
    map = new google.maps.Map(document.getElementById("map"), MapBasicOptions);
    var styledMapType = new google.maps.StyledMapType(MapStyleArray, MapStyleOptions);
    map.mapTypes.set("cleanVintage", styledMapType);
    map.setMapTypeId("cleanVintage");
    map.data.setStyle(mapDataStyling);
    google.maps.event.addListener(map, "zoom_changed", zoomChanged);

    //  Parse Routes
    var files = [
        // "紅幹線_去",
        // "橘幹線_去",
        // "黃幹線_去",
        // "綠幹線_去",
        // "藍幹線_去",
        // "棕幹線_去"
        // "0右"
    ];
    var reqRoute = getParameterByName('route');
    if (reqRoute != null) {
        files.push(reqRoute);
    }

    // Load Routes
    for (var i = 0; i < files.length; i++) {
        manuallyLoadGeoJSON(version, files[i]);
    }

    // Load infoWindow
    var infoWindow = new google.maps.InfoWindow({ maxWidth: 350 });
    map.data.addListener("click", function(event) {
        if (event.feature.getGeometry().getType() === "Point") {
            var anchor = new google.maps.MVCObject();
            var anchorDict = {
                position: event.feature.getGeometry().get(),
                anchorPoint: new google.maps.Point(0, -40)
            };
            anchor.setValues(anchorDict);
            var infoWindowContents = "<div id=\"iw-container\">" +
                "<div id=\"iw-stationCH\" class=\"iw-titles\">" + event.feature.getProperty("站牌名稱") + "</div>" +
                "<div id=\"iw-stationEN\" class=\"iw-titles\">" + event.feature.getProperty("站牌英文") + "</div>" +
                "<div id=\"iw-arrival\">載入中...</div>" +
                "</div>";
            getArrival(event.feature.getProperty("語音查詢代碼"), event.feature.getProperty("route").replace("_去", "").replace("_返", ""), infoWindow, event.feature);
            infoWindow.setContent(infoWindowContents);
            infoWindow.open(map, anchor);
        }
    });

    google.maps.event.addListener(infoWindow, 'domready', function() {

        // Reference to the DIV that wraps the bottom of infoWindow
        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();

        // Removes background shadow DIV
        iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
        // Changes the desired tail shadow color.
        iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1' });
        // Removes white background DIV
        iwBackground.children(':nth-child(4)').css({ 'display': 'none' });

        // close button
        var iwCloseBtn = iwOuter.next();
        iwCloseBtn.css({ opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9' });
        iwCloseBtn.mouseout(function() {
            $(this).css({ opacity: '1' });
        });
    });

    // Get User Location
    updateUserLoc(true);

}