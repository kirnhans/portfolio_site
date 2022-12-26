$('document').ready(function() {
   init();

   flapWings();
   flightHandler();

   // flyToWrapper(900, 900);    
   flyToWrapper(100, 300);
   flyToWrapper(900, 900);
});


function butterfly_main() {
   // randomly choose where to fly
   // every [interval] landOnGlobe
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

let butterflybody;
let wing;
let landing_zones = ["100px,400px", /*globe*/] //change this
let timer;
const delay = ms => new Promise(res => setTimeout(res, ms));
var current_flights = [];
var wait = 1;
var butterfly_is_flipped = false;

function init() {
   butterflybody = document.getElementById("butterflybody");
   
   // https://stackoverflow.com/questions/1100503/how-to-get-just-numeric-part-of-css-property-with-jquery
   // this method uses jQuery, with the value set in the css file
   let butterflybody_right = parseInt($(butterflybody).css('right'), 10 /* base*/);
   let butterflybody_bottom = parseInt($(butterflybody).css('bottom'), 10 /* base*/);

   butterflybody.style.right = `${butterflybody_right}px`;
   butterflybody.style.bottom = `${butterflybody_bottom}px`;

   wing = document.getElementById("butterflywing");
   syncUpWing();
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

function radToDeg(angle) {
   return 180 / Math.PI * angle;
}

function degToRad(angle) {
   return Math.PI / 180 * angle;
}

function syncUpWing() {
   let butterflybody_right = parseInt($(butterflybody).css('right'), 10 /* base*/);
   let butterflybody_bottom = parseInt($(butterflybody).css('bottom'), 10 /* base*/);
   
   if (butterfly_is_flipped) {
      wing.style.right = `${butterflybody_right - 195}px`; // TODO: maybe tweak these more later
      wing.style.bottom = `${butterflybody_bottom + 23}px`;  
   }
   else {
      wing.style.right = `${butterflybody_right - 10}px`; 
      wing.style.bottom = `${butterflybody_bottom + 23}px`;     
   }
   
}


// flight
function flyToWrapper(x,y) {
   current_flights.push([x, y]);
}

function flightHandler() {
   // todo: add logic to turn body
   // stretch goal: make flight an arc, not a straight line
   // window.requestAnimationFrame(function() {
   //      flyTo(x,y);
   //  });
   if (wait == 1) {
      //time to do a spinny if we've got to rotate
      if (current_flights.length > 0) {
         dest_x = current_flights[0][0];
         ShouldButterflyFlip(dest_x);
         if (butterfly_is_flipped) {
            SpinButterfly();
         }
      }
   }
   
   if (wait > 0){
      wait -= 1;
   }
   else {
      if (current_flights.length > 0) {
         // set course
         dest_x = current_flights[0][0];
         dest_y = current_flights[0][1];

         if (flyTo(dest_x, dest_y)) { // we are done with flight
            current_flights.shift(); // get rid of first elem
            wait = 200;
         }
      }
   }

   window.requestAnimationFrame(flightHandler);
}

/* Doing Thing functions*/
function flapWings() {
   syncUpWing();

   const time = new Date().getTime();
   const sine = Math.sin(time/300);

   if (butterfly_is_flipped) {
      wing.style.transform = `rotate(${-Math.round(sine*2)}deg) scaleY(${sine})`;
      butterflybody.style.transform = `rotate(${-Math.round(sine*2)}deg) translateY(${sine*2}px)`;
   }
   else {
      wing.style.transform = `rotate(${Math.round(sine*2)}deg) scaleY(${sine})`;
      butterflybody.style.transform = `rotate(${Math.round(sine*2)}deg) translateY(${sine*2}px)`;
   }

   flipButterflyMaybe();

   // monarchs flap their wings about 5 to 12 times a second
   // source: https://journeynorth.org/tm/monarch/FlightPoweredSlowMotion.html
   // let stepTime = getRandomArbitrary(83,200);
   window.requestAnimationFrame(flapWings);
}

function ShouldButterflyFlip(dest_x) {
   let current_loc = getButterflyBodyLoc();
   if (dest_x > current_loc[0]) { // pixels, start count from bottom-right
      butterfly_is_flipped = true;
   }
   else {
      butterfly_is_flipped = false;
   }
}

function SpinButterfly() {
   //TODO: sick flips
}

function flipButterflyMaybe() {
   if (butterfly_is_flipped) {
      wing.style.transform = wing.style.transform + ` scaleX(-1)`;
      butterflybody.style.transform = butterflybody.style.transform + `scaleX(-1)`;
   }

}

function flyTo(x, y) {
   // const butterflybody = document.getElementById("butterflybody");

   /* get current position
   orig_loc: current location, defined by the right and bottom most pixels
   of the body of the butterfly, since these stay more fixed than the wings */
   let orig_loc = getButterflyBodyLoc();

   
   /* distance formula with x,y
   calculated in pixels */
   let travel_distance = Math.hypot(x-orig_loc[0], y-orig_loc[1]);
   if (travel_distance == 0) {
      return 1;
   }

   
   /* divide by speed of butterfly per millisecond
   butterflies fly upto 37 miles per hour
   or 16.5 metres / second
   So we'll say 10 pixels per millisecond?
   travel_time: in milliseconds, time from original location to x,y */
   let travel_time = travel_distance / 4;
   
   /* loop
   set butterfly's position in next millisecond
   repeat until at position */
   var new_loc
   if (travel_time >= 1.0) {
      let step_factor = 1.0 / travel_time;
      new_loc = [orig_loc[0] + (x - orig_loc[0]) * step_factor,
                  orig_loc[1] + (y - orig_loc[1]) * step_factor];
   }
   else {
      new_loc = [x, y];
   }
   setButterflyBodyLoc(new_loc)
   syncUpWing();
   return 0;

   //return value: is the butterfly more or less where I said it would be?
   // return ((x - butterflybody.style.right) < 5) && ((y - butterflybody.style.bottom) < 5)
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



/* ~~ dump zone ahead ~~~*/

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
