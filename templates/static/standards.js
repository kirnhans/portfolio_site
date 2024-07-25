$('document').ready(function() {
    var title = document.title;
    var standard_num = title[title.length-1];

    //magic numbers na na na na, but this is for standards pages only so
    //this logic is to change the style of the "tab" in the nav bar
    //to reflect which standard page is open
    var ul_element = document.getElementById("menu_nav_ul");
    var li_element = ul_element.children[standard_num-1];
    var a_element = li_element.getElementsByTagName("a")[0];
    a_element.classList.add("current-tab");

    // setUpToggle();
});

// function setUpToggle() {
//    document.getElementById("slider_button").onclick = function () {
//         location.href = "./developer.html";
//     };
//     document.getElementById("slider_button").checked = false;
// }

// https://www.w3schools.com/howto/howto_js_mobile_navbar.asp
function clickHamburger() {
    var x = document.getElementById("menu_main_nav_area");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

// code to fix glitch that occurs when hamburger menu is open+closed and then window resized
window.onresize = function() {
   var em_width = $(window).width() / parseFloat($("body").css("font-size"));
   console.log(em_width)
   var x = document.getElementById("menu_main_nav_area");
   if (em_width > 50) {
        x.style.display = "block";
   }
   else {
        x.style.display = "none";
   }
};