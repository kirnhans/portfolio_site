$('document').ready(function() {
	var title = document.title;
	var standard_num = title[title.length-1];
	//magic numbers na na na na, but this is for standards pages only so
	var ul_element = document.getElementById("menu_nav_ul");
	var li_element = ul_element.children[standard_num-1];
	var a_element = li_element.getElementsByTagName("a")[0];
	a_element.classList.add("current-tab");
});