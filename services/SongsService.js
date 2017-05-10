/**
 *
 * @param $http
 *
 * @constructor
 */
function SongsService ( $http ) {

	/**
	 * Adds new song.
	 *
	 * @param song
	 *
	 * @returns {HttpPromise}
	 */
	this.add = function ( song ) {
		return $http.post( BACKEND_BASE_URL + '/songs/', song );
	};

}

angular.module( APP_NAME ).service( 'songsService', [ '$http', SongsService ] );