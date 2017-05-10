/**
 *
 * @param songsService
 *
 * @constructor
 */
function SongsOverviewController ( songsService ) {

	this.songs = [
		{ id : 1, name : 'Anděl', author : { id : 1, firstName : 'Karel', secondName : 'Kryl', fullName : 'Karel Kryl' } },
		{ id : 2, name : 'Děkuji', author : { id : 1, firstName : 'Karel', secondName : 'Kryl', fullName : 'Karel Kryl' } }
	];

}

/** Register controller. */
angular.module( APP_NAME ).controller( 'SongsOverviewController', [ 'songsService', SongsOverviewController ] );