function loadLatestVersion(successFunction) {

    function parseTxt(txt) {
        var versions = txt.split("\n");
        successFunction(versions[versions.length - 2]);
    }

    function loadingFailed() {
        alert("Failed to load Version!");
    }

    $.get("./data/Lines/version.txt", parseTxt).fail(loadingFailed);
}