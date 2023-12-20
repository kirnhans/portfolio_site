// To make the caret rotate to show and hide the subsections
/* Source: https://codepen.io/danmalarkey/pen/oNmEwm?editors=0110 */
$(document).ready(function(){

	// search bar
	const search_form = document.getElementById("search");
	// if there is no search button, bookmarks.html should be ashamed of itself
	search.addEventListener('submit',handleSearch);
	console.log(search);

// TODO: refactor this into a new FUNCTION
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

// Source: https://levelup.gitconnected.com/implement-search-feature-on-a-web-page-in-plain-javascript-adad27e48
function handleSearch() {

	//test material: REMOVE
	var books = [
    {
      "title": "Cracking the coding interview",
      "subtitle":"189 programming questions and solutions",
      "author":"Gayle Laakmann McDowell",
      "category":"Programming",
      "publisher":"CareerCup, LLC"
    },
    {
      "title": "No friend but the mountains",
      "subtitle":"Writing from manu prison",
      "author":"Behrouz Boochani",
      "category":"Literature",
      "publisher":"Pan Macmillan Australia"
    },
    {
      "title": "Indian Harvest",
      "subtitle":"Classic and contemporary vegetarian dishes",
      "author":"Vikas Khanna",
      "category":"Cuisine",
      "publisher":"Bloomsbury USA"
    },
    // Check out the source code on github for a complete list
  ]
	// end test material

	console.log("hi am pressed");
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
    var filteredList = books.filter(function(book){ //will need to change 'books' for my context
      // Create a string of all object values
      var bookString = '';
      for(var key in book) {
        if(book.hasOwnProperty(key) && book[key] !== '') {
          bookString += book[key].toString().toLowerCase().trim() + ' ';
        }
      }
      // Return book objects where a match with the search regex if found
      return bookString.match(searchTermRegex);
    });
    // Render the search results
    renderSearchResults(filteredList);
   }
}

function renderSearchResults(data) {
    var app = document.getElementById('app');
    var booksHTMLString = '<ul>'+
      data.map(function(book){
        return '<li>'+
                '<strong>Title: </strong>' + book.title + '<br/>' +
                '<strong>Subtitle: </strong>' + book.subtitle + '<br/>' +
                '<strong>Author: </strong>' + book.author + '<br/>' +
                '<strong>Category: </strong>' + book.category + '<br/>' +
                '<strong>Publisher: </strong>' + book.publisher + '<br/>' +
              '</li>';
      }).join('');
      + '</ul>';

    var app = document.getElementsByTagName('ul')[0];
    app.innerHTML = booksHTMLString;
  }