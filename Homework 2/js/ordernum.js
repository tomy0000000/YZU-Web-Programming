var d = new Date();
var dt = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()];
dt = dt.join("");
document.getElementById('ordernum').setAttribute('value', dt);