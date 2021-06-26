$('document').ready(function() {
    animate();
});

var timer;

function animate()
{
   const body = document.getElementById("body");
   // body.style.right = "54px";
   // body.style.bottom = "127px";
   const wing = document.getElementById("w1");
   // wing.style.right = "44px";
   // wing.style.bottom = "150px";

   const time = new Date().getTime();
   const sine = Math.sin(time/300);

   wing.style.transform = `rotate(${Math.round(sine*2)}deg) scaleY(${sine})`;
   // wing.style.transformOrigin = "left bottom";
   body.style.transform = `rotate(${Math.round(sine*-5)}deg) translateY(${sine*2}px)`;
   // body.style.transformOrigin = "45% 50%";

   // monarchs flap their wings about 5 to 12 times a second
   // source: https://journeynorth.org/tm/monarch/FlightPoweredSlowMotion.html
   // var stepTime = getRandomArbitrary(83,200);
   window.requestAnimationFrame(animate);
}

function butterfly_main() {
   // randomly choose where to fly
   // every [interval] landOnGlobe
}

function WingFlaps() {
   // scale image, cycle through time
   var stepTime = getRandomArbitrary(83,200);
   timer = setTimeout("animate()",stepTime);
}

function flyHere(x, y) {
   // get current position
   // distance formula with x,y
   // divide by speed of butterfly per millsecond
   // loop
   // set butterfly's position in next millisecond
   // repeat until at position
}

function landOnGlobe() {
   var globeTop = ["300px, 400px"]; //change this
   // stop flying randomly
   // set this as a location of where to go
   // sit here and flap wings for a few seconds
}

// Mozilla Developer Network page:
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}