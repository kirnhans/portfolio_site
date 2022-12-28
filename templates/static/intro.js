$('document').ready(function() {
    setUpToggle();
});

function setUpToggle() {
   document.getElementById("slider_button").onclick = function () {
        location.href = "./developer.html";
    };
   document.getElementById("slider_button").checked = false;
}