// To make the caret rotate to show and hide the subsections
/* Source: https://codepen.io/danmalarkey/pen/oNmEwm?editors=0110 */
$(document).ready(function(){

	getPlainTextResources();

	// search bar
	const search_form = document.getElementById("search");
	// if there is no search button, resourcemarks.html should be ashamed of itself
	search.addEventListener('submit',handleSearch);

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
	var resources = [];
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
		return list.parentNode.tagName != 'li';
	});

	var one_resource = flattenChildren(filtered_uls[0].children[0]);
	// for (let i = 0; i < filtered_uls.length; i++){
	// 	var current_ul = filtered_uls[i];
	// 	// the children should be the li's
	// 	for (let j = 0; j <current_ul.children.length; j++) {
	// 		var current_resource = flattenChildren(current_ul.children[j]);
	// 		if (Object.keys(current_resource).length === 0 &&
	// 			current_resource.constructor === Object) {
	// 			// console.log("wth");
	// 			// console.log(current_ul.children[j]);
	// 		}
	// 		else {
	// 			resources.push(current_resource);
	// 		}
	// 		// console.log("current_resource");
	// 		// console.log(current_resource);
	// 	}
	// }
	// // console.log(resources);
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
    var app = document.getElementById('app');
    var resourcesHTMLString = '<ul>'+
      data.map(function(resource){
        return '<li>'+
                '<strong>Title: </strong>' + resource.title + '<br/>' +
                '<strong>Subtitle: </strong>' + resource.subtitle + '<br/>' +
                '<strong>Author: </strong>' + resource.author + '<br/>' +
                '<strong>Category: </strong>' + resource.category + '<br/>' +
                '<strong>Publisher: </strong>' + resource.publisher + '<br/>' +
              '</li>';
      }).join('');
      + '</ul>';

    var app = document.getElementsByTagName('ul')[0];
    app.innerHTML = resourcesHTMLString;
  }


// okay this function is clearly broken
  // TODO FIX THIS
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
				if (node.tagName == "li") {
					node_family.text += child_node.text;
				}
			}
		return node_family;
	}
	else {
		console.log("I'm just a kid");
		// text or something
		// if we manage to get a ul that's empty, that's goofed
		if (node.tagName != "li") {
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