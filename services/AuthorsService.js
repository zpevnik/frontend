/**
 *
 * @param {$http} $http
 *
 * @constructor
 */
function AuthorsService ( $http, $mdToast ) {

	/**
	 * @type {Array}
	 * @access private
	 */
	var authors = [
		{ id : 1, firstName : 'Karel', secondName : 'Kryl', fullName : 'Karel Kryl' },
		{ id : 2, firstName : 'Jaromír', secondName : 'Nohavica', fullName : 'Jaromír Nohavica' },
		{ id : 3, firstName : 'Zuzana', secondName : 'Navarová', fullName : 'Zuzana Navarová' },
		{ id : 4, firstName : 'Karel', secondName : 'Plíhal', fullName : 'Karel Plíhal' },
	];

	/**
	 * Load all authors.
	 */
	$http.get( BACKEND_BASE_URL + '/authors/' ).then( function ( response ) {
		authors = response.data;
	}, function ( response ) {
		$mdToast.show(
			$mdToast.simple()
				.textContent( 'Nepodařilo se načíst autory písní.' )
				.hideDelay( 5000 )
		);
	} );

	/**
	 *
	 * @param authorName
	 *
	 * @returns {Array}
	 */
	this.searchAuthors = function ( authorName ) {
		return authors.filter( function ( element ) {
			return element.fullName.indexOf( authorName ) !== -1;
		} );
	};

	/**
	 *
	 * @param author
	 */
	this.add = function ( author ) {
		$http.post( BACKEND_BASE_URL + '/authors/', author ).then( function ( response ) {
			authors.push( response.data );
		}, function ( response ) {
			$mdToast.show(
				$mdToast.simple()
					.textContent( 'Autora se nepodařilo uložit.' )
					.hideDelay( 5000 )
			);
		} );
	}

}

/** Register service. */
angular.module( APP_NAME ).service( 'authorsService', [ '$http', '$mdToast', AuthorsService ] );