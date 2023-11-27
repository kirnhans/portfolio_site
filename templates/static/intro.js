$('document').ready(function() {
    setUpToggle();
    lessonPlanFolderLift();
});

function setUpToggle() {
   document.getElementById("slider_button").onclick = function () {
        location.href = "./developer.html";
    };
   document.getElementById("slider_button").checked = false;
}

/* this is for the lesson plan folder dropdown so that I can add more links
    and it'll still go the right amount up  */
function lessonPlanFolderLift() {

    // there should be only one dropdown element with lesson-plan as a class
    var dropdown_element = document.getElementsByClassName("lesson-plan")[0];
    var a_elements = dropdown_element.children; 
    
    var moveTopBy = -1 * 16 * a_elements.length;
    dropdown_element.style.top = `${moveTopBy}%`;

    console.log(`${moveTopBy}%`);
}
