function Preview(model) {
    var T;
    switch (model) {
        case 47:
            T = "For riders 5&#39;0&#34; to 5&#39;5&#34; with an inseam of at least 28&#34;";
            break;
        case 50:
            T = "For riders 5&#39;3&#34; to 5&#39;7&#34; with an inseam of at least 29&#34;";
            break;
        case 54:
            T = "For riders 5&#39;6&#34; to 5&#39;11&#34; with an inseam of at least 30&#34;";
            break;
        case 58:
            T = "For riders 5&#39;10&#34; to 6&#39;3&#34; with an inseam of at least 32&#34;";
            break;
        case 61:
            T = "For riders 6&#39;1&#34; to 6&#39;5&#34; with an inseam of at least 33&#34;";
            break;
        case 64:
            T = "For riders 6&#39;4&#34; and up with an inseam of at least 34&#34;";
            break;
    }
    document.getElementById("modellabel").innerHTML = T;
}
function DisPreview() {
    document.getElementById("modellabel").innerHTML = "型號"
}