/**
 *
 * @param {$routeProvider} $routeProvider
 *
 * @constructor
 */
function Router( $routeProvider )
{

	$routeProvider
		.when( '/songs/', {
			templateUrl : 'templates/overview.html',
			controller : 'SongsOverviewController'
		} )
		.when( '/songs/add', {
			templateUrl : 'templates/add.html',
			controller : 'SongAddController'
		} )
		.when( '/songs/:id/', {
			templateUrl : 'templates/single.html',
			controller : 'SongDetailController'
		} )
		.otherwise( {
			redirectTo : '/songs/'
		} );

}

/** Register router. */
angular.module( APP_NAME ).config( [ '$routeProvider', Router ] );