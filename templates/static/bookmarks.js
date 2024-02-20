// plaintext array of resources, for searching purposes
var resources = [];
var whole_input_selected = false; // I have literally no idea where to put this, so here it goes
// this is for when the search input is selected as a whole

$(document).ready(function() {
	CollapsiblePanesLogic();
	makeImagesTooltips(); // needs to be before getPlainTextResources call
	// otherwise HTML for resources is out of date
	getPlainTextResources();

	// if there is no search button, bookmarks.html should be ashamed of itself
	// search.addEventListener('submit',handleSearch);
	search.addEventListener('input', handleSearch);

	// look at what work we have to do to imitate a fraction of deleting
	search.addEventListener('keydown', function(event) {
		var input = document.getElementById('search_input');

		// Enter + dynamic typing = bad defaults
  	if (event.keyCode === 13) { // Enter
  		event.preventDefault(); // don't reload
  	}

  		// ~~ Deletion cases time
		// Check for deletion involving Ctrl
  	if (event.ctrlKey) {
  		console.log(event.target.selectionStart);
  		if (event.target.selectionStart === 0) {
				if (event.keyCode === 46) { // Ctrl + Delete
						location.reload();
				}
  		}
  		else if (event.target.selectionStart === input.value.length) {
				if (event.keyCode === 8) { // Ctrl + Backspace
					location.reload();
	  		}
  		}
  		
  	}

  	// Check for Deletion by selecting everything + del/backspace
  	whole_input_selected = isTextSelected(input);
		if (whole_input_selected) {
			if (event.keyCode === 8 || event.keyCode === 46) { // Backspace and Delete
				whole_input_selected = false;
				location.reload();
				return;
			}
		}
	});

	document.addEventListener('reset', function(event) {
  	location.reload();
	});

});

// Source: https://stackoverflow.com/questions/5001608/how-to-know-if-the-text-in-a-textbox-is-selected
function isTextSelected(input) {
    if (typeof input.selectionStart == "number") {
        return input.selectionStart == 0 && input.selectionEnd == input.value.length;
    } else if (typeof document.selection != "undefined") {
        input.focus();
        return document.selection.createRange().text == input.value;
    }
}


function createCaret() {
	let caret = document.createElement('span');
  caret.classList.add("down-caret");
  return caret;
}

function CollapsiblePanesLogic() {
	// Add all the HTML elements to headers
	const h_list = $( ":header" );
	// first one is my name at the top
	for (let i = 1; i < h_list.length; i++) {
		let current_h = h_list[i];
		current_h.classList.add("collapsible");
		let caret = createCaret();
		current_h.appendChild(caret);

		var next_sibling = current_h.nextSibling;
		while(next_sibling.nodeName != ("UL")) {
			next_sibling = next_sibling.nextSibling;
		}
		next_sibling.classList.add("collapsible-list");
	}

	$('.collapsible').click(function(e) {
		// $(this).find('.collapsible-list').toggleClass('open');
		if (e.target.nodeName == "SPAN") {
			$(e.target).toggleClass('open-caret');	
		}
		else {
			$($(e.target).find('.down-caret').toggleClass('open-caret'));
		}

		e.preventDefault();
		e.stopPropagation();
		const ul = $(this).next();
		ul.toggleClass('hidden');
		// $('.collapsible').click(function() {
		// 	$('.collapsible-list').removeClass('open');
		// 	$('.down-caret').removeClass('open-caret');

    //   // make child invisible
		// });
	});
}

function makeImagesTooltips() {
	// is it legal to just grab all the image tags and make them tooltip classed? who knows, let's try
	var images = document.getElementsByTagName("img");
	for (let i = 0; i < images.length; i++) {
		images[i].classList.add("tooltipimg");

		// all a_tags right before an image, make them a tooltip
		// those are the ones that are supposed to display the image
		let a_tag = images[i].previousElementSibling;
		if (a_tag.tagName != "A") {
			console.log("Problem: Markdown isn't formatted properly");
			console.log(images[i].src);
		}
		a_tag.classList.add("tooltip");

	// now we need to pick up the image and plop it into the a tag
	// I hate this dom tree arrangement but this is what we need for the pseudo element hover to work
	// because it won't play with the sibling combinator
		a_tag.appendChild(images[i]);
	}
}

/* SEARCH code starts here */

function getPlainTextResources() {
	// first, I need to flatten the html hierarchy into each resource
	// then search each resources
	// and figure out how to find what element it is
	// 

	// all resources are in the ul's
	// ul's with li parents are the descriptions
	// we only want the items of the top-level ul's
	var unordered_lists = document.getElementsByTagName("ul");
	var arr_ul = [].slice.call(unordered_lists); // tfw html collections aren't arrays :/
	var filtered_uls = arr_ul.filter(function(list) {
		return list.parentNode.tagName != 'LI';
	});

	// last ul is my contact information in the footer, so we will leave it off this for loop
	// WARNING: magic numbers
	for (let i = 0; i < filtered_uls.length - 1; i++) {
		// iterating through all the unordered lists, i.e. top level
		var current_ul = filtered_uls[i];
		// the children should be the li's
		for (let j = 0; j <current_ul.children.length; j++) {
			var current_resource = getLiText(current_ul.children[j]);
			if (Object.keys(current_resource).length === 0 &&
				current_resource.constructor === Object) {
				console.log("found an empty item");
			}
			else {
				addHeadingToResourceListItem(current_ul, current_resource);
				current_resource.text = '<li>' + current_resource.text + '</li>';
				resources.push(current_resource);
			}
		}
	}
}

function addHeadingToResourceListItem(ul, resource) {
	var previous_sibling = ul;
	do {
		let current_sibling = previous_sibling;
		new_prev = current_sibling.previousSibling;
		previous_sibling = new_prev;
		if (previous_sibling == null) {
			console.log("we found a null sibling, current_sibling is:");
			console.log(current_sibling);
		}
	}	while (previous_sibling.nodeName == ("#text"));
	
	let heading_text = previous_sibling.outerHTML;
	resource.heading = heading_text;
}

function handleSearch(event) {
// Source: https://levelup.gitconnected.com/implement-search-feature-on-a-web-page-in-plain-javascript-adad27e48
 	event.preventDefault(); //don't reload page

  // Get the search terms from the input field
  // var searchTerm = event.target.elements['search'].value;
		var searchTerm = event.target.value;

  // Tokenize the search terms and remove empty spaces
  var tokens = searchTerm.toLowerCase().split(' ').filter(function(token) {
  	return token.trim() !== '';
  });

  if (tokens.length) {
  	var filteredList = resources.filter(function(resource) {
    // Create a string of all object values
  		var resourceString = '';
  		for(var key in resource) {
  			if (resource.hasOwnProperty(key) && resource[key] !== '') {
  				resourceString += resource[key].toString().toLowerCase().trim() + ' ';
  			}
  		}

  		// return true only if resource has all search keywords in it
  		for (let i = 0; i < tokens.length; i++) {
  			if (!resourceString.match(tokens[i])) {
  				return false;
  			}
  		}
  		return true;
  	});
  // Render the search results
  	renderSearchResults(filteredList);
  }
} 

function renderSearchResults(data) {
	const resourceHashmap = new Map();
	for (let i = 0; i < data.length; i++) {
		let resource = data[i];
		if (resourceHashmap.has(resource.heading)) {
			let existing_text = resourceHashmap.get(resource.heading);
			resourceHashmap.set(resource.heading, existing_text + resource.text);
		}
		else {
			resourceHashmap.set(resource.heading, resource.text);
		}
	}

	var content = document.getElementsByClassName('bookmarks-content')[0];
	content.innerHTML = '';
	resourceHashmap.forEach(function(resources_text, heading) {
		content.innerHTML += heading + '<ul>' + resources_text  +	'</ul>' + '<br>';
	});
}

function getLiText(node) {
	if (node.tagName == "LI") {
		return {
			"node":node,
			"text": node.innerHTML
		};
	}
}

/* SEARCH code ends here */