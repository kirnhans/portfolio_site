$('document').ready(function() {
    animate();
});

var pos = [
"54px,130px,w1,0px,30px",
"84px,130px,w2,30px,85px",
"114px,130px,w3,60px,115px",
"144px,130px,w4,90px,140px",
"174px,130px,w5,120px,140px",
"204px,130px,w6,150px,140px",
"234px,130px,w5,180px,140px",
"264px,130px,w4,210px,140px",
"294px,130px,w3,240px,115px",
"324px,130px,w2,270px,85px",
"354px,130px,w1,300px,30px"
];

var step = 0;
var laststep = pos.length;
var timer;

function animate()
{
   console.log("Hi");
   document.getElementById("w1").style.visibility = "hidden";
   document.getElementById("w2").style.visibility = "hidden";
   document.getElementById("w3").style.visibility = "hidden";
   document.getElementById("w4").style.visibility = "hidden";
   document.getElementById("w5").style.visibility = "hidden";
   document.getElementById("w6").style.visibility = "hidden";

   if(step == laststep) step = 0;

   var newpos = pos[step].split(",");

   document.getElementById("body").style.left = newpos[0];
   document.getElementById("body").style.top = newpos[1];
   document.getElementById(newpos[2]).style.visibility = "visible";
   document.getElementById(newpos[2]).style.left = newpos[3];
   document.getElementById(newpos[2]).style.top = newpos[4];

//   alert(step);

   step++;
   timer = setTimeout("animate()",300);
}

