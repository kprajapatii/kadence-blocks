/* global GLightbox */
/**
 * File lightbox-init.js.
 * Gets Lightbox working for Kadence Blocks Gallery
 */

(function() {
	'use strict';
	var kadenceBlocksGLight = {
		simulateClick: function (elem) {
			// Create our event (with options)
			var evt = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window
			});
			// If cancelled, don't dispatch our event
			!elem.dispatchEvent(evt);
		},
		// checkImage: function( element ) {
		// 	return /(png|jpg|jpeg|gif|tiff|bmp|webp)$/.test(
		// 		element.getAttribute( 'href' ).toLowerCase().split( '?' )[0].split( '#' )[0]
		// 	);
		// },
		handleClones: function( element ) {
			var foundClones = element.querySelectorAll( '.splide__slide--clone a.kb-gallery-item-link' );
			var foundRegular = element.querySelectorAll( '.splide__slide:not(.splide__slide--clone) a.kb-gallery-item-link' );
			for ( let c = 0; c < foundClones.length; c++ ) {
				foundClones[c].addEventListener('click', function (event) {
					event.preventDefault();
					var the_href = foundClones[c].getAttribute( 'href' );
					for ( let b = 0; b < foundRegular.length; b++ ) {
						if ( the_href === foundRegular[b].getAttribute( 'href' ) ) {
							kadenceBlocksGLight.simulateClick( foundRegular[b] );
							break;
						}
					}
				} );
			}
		},
		findGalleries: function() {
			let foundGalleries = document.querySelectorAll( '.kb-gallery-magnific-init' );
			if ( ! foundGalleries.length ) {
				return;
			}
			if ( foundGalleries ) {
				let carousel = [];
				for ( let i = 0; i < foundGalleries.length; i++ ) {
					carousel[i] = foundGalleries[i].querySelector( '.kt-blocks-carousel-init' );
					let carouselClass = ' .splide__slide:not(.splide__slide--clone) ';
					if ( carousel[i] ) {
						carouselClass
						setTimeout( function() {
							kadenceBlocksGLight.handleClones( carousel[i] );
						}, 200 );
					}
					let galleryClass = foundGalleries[i].classList;
					let showCaption = foundGalleries[i].getAttribute( 'data-lightbox-caption' );
					let filter = foundGalleries[i].getAttribute( 'data-image-filter' );
					let foundGalleryClass = false;
					for ( let n = 0; n < galleryClass.length; n++ ) {
						if ( galleryClass[ n ].indexOf( 'kb-gallery-id' ) !== -1 ) {
							foundGalleryClass = galleryClass[ n ];
							break;
						}
					}
					if ( foundGalleryClass ) {
						// if ( filter ) {
						// 	GLightbox.defaults.elementClass = 'slg-kt-blocks kb-gal-light-filter-' + filter;
						// } else {
						// 	GLightbox.defaults.elementClass = 'slg-kt-blocks';
						// }
						// new GLightbox({
						// 	elements: '.' + foundGalleryClass + ' a.kb-gallery-item-link',
						// });
						const customLightboxHTML = `<div id="glightbox-body" class="glightbox-container glightbox-kadence-dark kb-gal-light-filter-${filter}">
							<div class="gloader visible"></div>
							<div class="goverlay"></div>
							<div class="gcontainer">
							<div id="glightbox-slider" class="gslider"></div>
							<button class="gnext gbtn" tabindex="0" aria-label="Next" data-customattribute="example">{nextSVG}</button>
							<button class="gprev gbtn" tabindex="1" aria-label="Previous">{prevSVG}</button>
							<button class="gclose gbtn" tabindex="2" aria-label="Close">{closeSVG}</button>
						</div>
						</div>`;
						const skin = filter ? 'kadence-dark kb-gal-light-filter-' + filter : 'kadence-dark';
						new GLightbox({
							selector: '.' + foundGalleryClass + carouselClass + ' a.kb-gallery-item-link:not([target="_blank"])',
							touchNavigation: true,
							skin: skin,
							loop: true,
							openEffect: 'fade',
							closeEffect: 'fade',
						});
					}
				}
			}
		},
		/**
		 * Initiate the script to process all
		 */
		initAll: function() {
			kadenceBlocksGLight.findGalleries();
		},
		// Initiate the menus when the DOM loads.
		init: function() {
			if ( typeof GLightbox == 'function' ) {
				kadenceBlocksGLight.initAll();
			} else {
				var initLoadDelay = setInterval( function(){ if ( typeof GLightbox == 'function' ) { kadenceBlocksGLight.initAll(); clearInterval(initLoadDelay); } }, 200 );
			}
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', kadenceBlocksGLight.init );
	} else {
		// The DOM has already been loaded.
		kadenceBlocksGLight.init();
	}
})();