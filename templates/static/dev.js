$('document').ready(function() {
   init();

   // animate();
   flyTo(300, 400);
   // flyTo(100, 300);
});

let butterflybody;
let wing;
let landing_zones = ["100px,400px", /*globe*/] //change this
let timer;

function init() {
   butterflybody = document.getElementById("butterflybody");
   
   // https://stackoverflow.com/questions/1100503/how-to-get-just-numeric-part-of-css-property-with-jquery
   // this method uses jQuery, with the value set in the css file
   let butterflybody_right = parseInt($(butterflybody).css('right'), 10 /* base*/);
   let butterflybody_bottom = parseInt($(butterflybody).css('bottom'), 10 /* base*/);

   butterflybody.style.right = `${butterflybody_right}px`;
   butterflybody.style.bottom = `${butterflybody_bottom}px`;

   wing = document.getElementById("w1");
   syncUpWing();

   console.log()
}

/* Helper functions */
function getButterflyBodyLoc() {
   let butterflybody_right = parseInt(butterflybody.style.right, 10 /* base*/);
   let butterflybody_bottom = parseInt(butterflybody.style.bottom, 10 /* base*/);
   return [butterflybody_right, butterflybody_bottom];
}

function setButterflyBodyLoc(new_loc) {
   butterflybody.style.right = `${new_loc[0]}px`;
   butterflybody.style.bottom = `${new_loc[1]}px`;
}

function syncUpWing() {
   let butterflybody_right = parseInt($(butterflybody).css('right'), 10 /* base*/);
   let butterflybody_bottom = parseInt($(butterflybody).css('bottom'), 10 /* base*/);
   
   wing.style.right = `${butterflybody_right - 10}px`;
   wing.style.bottom = `${butterflybody_bottom + 23}px`;
}

/* Doing Thing functions*
function animate()
{
   syncUpWing();

   const time = new Date().getTime();
   const sine = Math.sin(time/300);

   wing.style.transform = `rotate(${Math.round(sine*2)}deg) scaleY(${sine})`;
   // wing.style.transformOrigin = "left bottom";
   butterflybody.style.transform = `rotate(${Math.round(sine*2)}deg) translateY(${sine*2}px)`;
   // butterflybody.style.transformOrigin = "45% 50%";

   // monarchs flap their wings about 5 to 12 times a second
   // source: https://journeynorth.org/tm/monarch/FlightPoweredSlowMotion.html
   // let stepTime = getRandomArbitrary(83,200);
   window.requestAnimationFrame(animate);
}

function butterfly_main() {
   // randomly choose where to fly
   // every [interval] landOnGlobe
   WingFlaps();
   let prev_i = -1; // impossible value, just so we have one
   while (true) {
      let i = getRandomArbitrary(0, landing_zones.length());
      if (i === prev_i) {
         continue; // don't "fly" to the same place twice in a row
      }

      let dest_coords = landing_zones[i].split(",");
      flyTo(dest_coords[0], dest_coords[1]);
      landOn(dest_coords[0], dest_coords[1]);
      // todo: wait a few seconds

      prev_i = i;
   }
}

function WingFlaps() {
   // scale image, cycle through time
   let stepTime = getRandomArbitrary(83,200);
   timer = setTimeout("animate()",stepTime);
}

function flyTo(x, y) {
   const butterflybody = document.getElementById("butterflybody");

   /* get current position
   orig_loc: current location, defined by the right and bottom most pixels
   of the body of the butterfly, since these stay more fixed than the wings */
   let orig_loc = getButterflyBodyLoc();

   /* distance formula with x,y
   calculated in pixels */
   let travel_distance = Math.hypot(x-orig_loc[0], y-orig_loc[1]);
   // console.log("orig_loc", orig_loc);
   // console.log(travel_distance)
   
   /* divide by speed of butterfly per millisecond
   butterflies fly upto 37 miles per hour
   or 16.5 metres / second
   So we'll say 100 pixels per millisecond?
   travel_time: in milliseconds, time from original location to x,y */
   let travel_time = travel_distance / 100;
   // console.log(travel_time);

   /* loop
   set butterfly's position in next millisecond
   repeat until at position */
   for (let i = 0.0; i < travel_time; i++) {
      console.log("got here");
      let step_factor = i / travel_time;
      console.log("step_factor", step_factor);
      let new_loc = [orig_loc[0] + (x - orig_loc[0]) * step_factor,
                     orig_loc[1] + (y - orig_loc[1]) * step_factor];

      setButterflyBodyLoc(new_loc)
      // butterflybody.style.right = new_loc[0];
      // butterflybody.style.bottom = new_loc[1];
      syncUpWing();
      //todo: delay 1 ms
   }

   //return value: is the butterfly more or less where I said it would be?
   return ((x - butterflybody.style.right) < 5) && ((y - butterflybody.style.bottom) < 5)
}

function landOn(x,y) {
   let globeTop = ["300, 400"]; //change this
   let somePlace = ["500, 600"]
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

// This function is where I dump code instead of leaving it in other functions
// wanna keep it in case I need the logic
// don't wanna keep it in the function I got it from
// halfway house! MariKondo your code!
function dump() {
   // this method uses raw JS assuming wing.style.bottom has been assigned earlier
   // appropriate for when I implement the flying-to-other-places-with-location-
   // assigned-by-JavaScript functionality
   let wing_right = parseInt(wing.style.right, 10 /* base*/);
}