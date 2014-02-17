// just don't boder me if you don't cut the mustard...
if(!(
	'querySelector' in document
	&& 'localStorage' in window
	&& 'addEventListener' in window
	&& typeof([].indexOf) == 'function'
	)) {
	alert("Your browser doesn't cut the mustard. Please change it.");
}
