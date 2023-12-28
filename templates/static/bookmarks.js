// plaintext array of resources, for searching purposes
var resources = [];

$(document).ready(function(){

	getPlainTextResources();

	// search bar
	const search_form = document.getElementById("search");
	// if there is no search button, resourcemarks.html should be ashamed of itself
	search.addEventListener('submit',handleSearch);

// To make the caret rotate to show and hide the subsections
/* Source: https://codepen.io/danmalarkey/pen/oNmEwm?editors=0110 */
// TODO: refactor this into a new FUNCTION
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

	for (let i = 0; i < filtered_uls.length; i++) {
		// iterating through all the unordered lists, i.e. top level
		var current_ul = filtered_uls[i];
		// the children should be the li's
		for (let j = 0; j <current_ul.children.length; j++) {
			var current_resource = getLiText(current_ul.children[j]);
			// TODO: add text of heading to this
			if (Object.keys(current_resource).length === 0 &&
				current_resource.constructor === Object) {
				console.log("found an empty item");
			}
			else {
				resources.push(current_resource);
			}
		}
	}
}

function handleSearch() {
// Source: https://levelup.gitconnected.com/implement-search-feature-on-a-web-page-in-plain-javascript-adad27e48
 event.preventDefault(); //don't reload page
    // Get the search terms from the input field
    var searchTerm = event.target.elements['search'].value;

    // Tokenize the search terms and remove empty spaces
    var tokens = searchTerm.toLowerCase().split(' ')
    .filter(function(token){
    	return token.trim() !== '';
    });

    if(tokens.length) {
    //  Create a regular expression of all the search terms
    	var searchTermRegex = new RegExp(tokens.join('|'), 'gim');
    	var filteredList = resources.filter(function(resource){
      // Create a string of all object values
    		var resourceString = '';
    		for(var key in resource) {
    			if(resource.hasOwnProperty(key) && resource[key] !== '') {
    				resourceString += resource[key].toString().toLowerCase().trim() + ' ';
    			}
    		}
      // Return resource objects where a match with the search regex if found
    		return resourceString.match(searchTermRegex);
    	});
    // Render the search results
    	renderSearchResults(filteredList);
    }
  } 

function renderSearchResults(data) {
	var resourcesHTMLString = '<ul>' +
	data.map(function(resource) {
		return '<li>' + resource.text + '</li>';
	}).join('') +
	'</ul>';

	var content = document.getElementsByClassName('intro')[0];
	content.innerHTML = resourcesHTMLString;
}

function getLiText(node) {
	if (node.tagName == "LI") {
		return {
			"node":node,
			"text": node.innerHTML
		};
	}
}

// fix: the babyiest tag was A, not LI
// now the function works but idk how to get text that's not in the child tag
// function is dead code, I'll figure out if it's useful later
function flattenChildren(node) {
	if (node.children.length) {
		console.log("we have a family to feed");
		var node_family = {
			"node":node,
			"text": ""
		};
		for (let i = 0; i < node.children.length; i++) {
			console.log("let's flatten a child");
			let child_node = flattenChildren(node.children[i]);
			console.log("flatterened");
			console.log(child_node);
			if (node.tagName == "LI") {
				node_family.text += child_node.text;
			}
		}
		return node_family;
	}
	else {
		console.log("I'm just a kid");
	// text or something
	// if we manage to get a ul that's empty, that's goofed
		if (node.tagName != "LI" && node.tagName != "A") {
			console.log(node.tagName);
			return {};
		}

	// list item: either a resource or its extended description
		var current = {
			"node": node,
			"text": node.innerHTML
		};
		console.log("kid current");
		console.log(current);
		return current;
	}
}