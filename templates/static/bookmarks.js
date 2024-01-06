// plaintext array of resources, for searching purposes
var resources = [];

$(document).ready(function(){
	CollapsiblePanesLogic();
	getPlainTextResources();

	// if there is no search button, resourcemarks.html should be ashamed of itself
	// search.addEventListener('submit',handleSearch);
	search.addEventListener('input', handleSearch);
	document.addEventListener('reset', function(event){
  	location.reload();
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

function CollapsiblePanesLogic() {
	// Add all the HTML elements to headers
	const h_list = $( ":header" );
	// first one is my name at the top
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

	$('.dropdown').click(function(e){
		$(this).find('.dropdown-menu').toggleClass('open');
		$($(e.target).find('.down-caret').toggleClass('open-caret'));
		e.preventDefault();
		e.stopPropagation();
		const ul = $(this).next();
		ul.toggleClass('hidden');
		$(document).click(function(){
			$('.dropdown-menu').removeClass('open');
			$('.down-caret').removeClass('open-caret');

      // make child invisible
		});
	});
}

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
	var filtered_uls = arr_ul.filter(function(list){
		return list.parentNode.tagName != 'LI';
	});

	// last ul is my contact information in the footer, so we will leave it off this for loop
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
    var tokens = searchTerm.toLowerCase().split(' ')
    .filter(function(token){
    	return token.trim() !== '';
    });

    if(tokens.length) {
    	var filteredList = resources.filter(function(resource){
      // Create a string of all object values
    		var resourceString = '';
    		for(var key in resource) {
    			if(resource.hasOwnProperty(key) && resource[key] !== '') {
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