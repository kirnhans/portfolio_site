$('document').ready(function() {
    animate();
});

let landing_zones = ["100px,400px", /*globe*/] //change this
let timer;

function animate()
{
   const body = document.getElementById("body");
   // body.style.right = "54px";
   body.style.bottom = "127px";
   const wing = document.getElementById("w1");
   // wing.style.right = "44px";
   // wing.style.bottom = "150px";

   // https://stackoverflow.com/questions/1100503/how-to-get-just-numeric-part-of-css-property-with-jquery
   // this method uses jQuery, with the value set in the css file
   // doing this because I'm messing around with functions
   let body_right = parseInt($(body).css('right'), 10 /* base*/);
   // this method uses raw JS assuming body.style.bottom has been assigned earlier
   // appropriate for when I implement the flying-to-other-places-with-location-
   // assigned-by-JavaScript functionality
   let body_bottom = parseInt(body.style.bottom, 10 /* base*/);
   wing.style.right = `${body_right - 10}px`;
   wing.style.bottom = `${body_bottom + 23}px`;

   const time = new Date().getTime();
   const sine = Math.sin(time/300);

   wing.style.transform = `rotate(${Math.round(sine*2)}deg) scaleY(${sine})`;
   // wing.style.transformOrigin = "left bottom";
   body.style.transform = `rotate(${Math.round(sine*2)}deg) translateY(${sine*2}px)`;
   // body.style.transformOrigin = "45% 50%";

   // monarchs flap their wings about 5 to 12 times a second
   // source: https://journeynorth.org/tm/monarch/FlightPoweredSlowMotion.html
   // let stepTime = getRandomArbitrary(83,200);
   window.requestAnimationFrame(animate);
}

function butterfly_main() {
   // randomly choose where to fly
   // every [interval] landOnGlobe
   WingFlaps();
   let prev_i = landing_zones.length();
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
   const body = document.getElementById("body");

   // get current position
   // orig_loc: current location, defined by the right and bottom most pixels
   // of the body of the butterfly, since these stay more fixed than the wings
   let orig_loc = [body.style.right, body.style.bottom];

   // distance formula with x,y
   // calculated in pixels
   let travel_distance = Math.hypot(x-orig_loc[0], y-orig_loc[1]);

   // divide by speed of butterfly per millisecond
   // butterflies fly upto 37 miles per hour
   // or 16.5 metres / second
   // So we'll say 100 pixels per millisecond?
   // travel_time: in milliseconds, time from original location to x,y
   let travel_time = travel_distance / 100;

   // loop
   // set butterfly's position in next millisecond
   // repeat until at position
   for (let i = 0; i < travel_time; i++) {
      let step_factor = i / travel_time;
      let new_loc = [orig_loc[0] + (x - orig_loc[0]) * step_factor,
                     orig_loc[1] + (y - orig_loc[1]) * step_factor];

      body.style.right = new_loc[0];
      body.style.bottom = new_loc[1];
      //todo: delay 1 ms
   }

   //return value: is the butterfly more or less where I said it would be?
   return ((x - body.style.right) < 5) && ((y - body.style.bottom) < 5)
}

function landOn(x,y) {
   let globeTop = ["300px, 400px"]; //change this
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