// To make the caret rotate to show and hide the subsections
/* Source: https://codepen.io/danmalarkey/pen/oNmEwm?editors=0110 */
$(document).ready(function(){

	const h_list = $( ":header" );
	// first one will be my name at the top
	for (let i = 1; i < h_list.length; i++) {
		let current_h = h_list[i];
		current_h.classList.add("dropdown");
		// let a = createDropdownA();
		// current_h.appendChild(a);
		let caret = createCaret();
		// a.appendChild(caret);
		current_h.appendChild(caret);

		// add br before h1s, after ul
		// markdown() removes newlines after bullet lists
		if (i != 0) {
			let br = document.createElement('br');
			current_h.parentNode.insertBefore(br, current_h);
		}
	}

	document.addEventListener('submit',handleSearch);

  $('.dropdown').click(function(e){
    $(this).find('.dropdown-menu').toggleClass('open');
    $($(e.target).find('.down-caret').toggleClass('open-caret'));
    e.preventDefault();
    e.stopPropagation();
    const ul = $(this).next();
    console.log(ul);
    ul.toggleClass('hidden');
    $(document).click(function(){
      $('.dropdown-menu').removeClass('open');
      $('.down-caret').removeClass('open-caret');

      // make child invisible
    });
  });
});

// this func is dead code, I don't need an a href
function createDropdownA() {
	let a = document.createElement('a');
	a.classList.add("drop");
	$(a).attr("href", "javascript:void(0);");
	return a;
}

function createCaret() {
	let caret = document.createElement('span');
    caret.classList.add("down-caret");
    return caret;
}

function handleSearch() {
	// body...
}