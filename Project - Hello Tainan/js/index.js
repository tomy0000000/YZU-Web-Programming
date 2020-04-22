function init() {
    loadLatestVersion(loadRoute);
}

function loadRoute(version) {

    function parseTxt(txt) {
        var routes = txt.split("\n");
        var Menu = document.getElementById("routes");
        for (var i = 0; i < routes.length; i++) {
            var option = document.createElement("option");
            option.value = routes[i];
            option.innerHTML = routes[i];
            Menu.appendChild(option);
        }
    }

    function loadingFailed() {
        alert("Failed to load Routes!");
    }

    $.get("./data/Lines/" + version + "/routes.txt", parseTxt).fail(loadingFailed);
}