// application.js

$(document).ready(function($) {

	var owlCast = $("#owl-demo-cast");

	owlCast.owlCarousel({
		items : 6,
		itemsDesktop : [1199,6],
		itemsDesktopSmall : [980,4],
		itemsTablet: [768,3],
		itemsMobile: [479, 2]
	});
});
