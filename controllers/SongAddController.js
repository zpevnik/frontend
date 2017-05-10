/**
 *
 * @constructor
 */
function SongAddController ( authorsService, songsService, $mdToast, $mdDialog ) {

	/**
	 * Displays form error.
	 *
	 * @param errorMessage
	 */
	var displayFormError = function ( errorMessage ) {
		$mdToast.show(
			$mdToast.simple()
				.textContent( errorMessage )
				.position( 'top right' )
				.hideDelay( 3000 )
		);
	};

	/**
	 * Validates song.
	 *
	 * @param song
	 * @returns {boolean}
	 */
	var isValidSong = function ( song ) {
		var valid = true;

		if ( !song.name || song.name.trim() === '' ) {
			displayFormError( 'Název písně nesmí být prázdný.' );
			valid = false;
		}

		if ( !song.text || song.text.trim() === '' ) {
			displayFormError( 'Text písně nesmí být prázdný.' );
			valid = false;
		}

		if ( !song.author ) {
			displayFormError( 'Musíte vybrat autora písně.' );
			valid = false;
		}

		return valid;
	};

	this.searchAuthor = function( authorName ) {
		return authorsService.searchAuthors( authorName );
	};

	this.addAuthor = function( authorName ) {
		var prompt = $mdDialog.prompt()
			.title( 'Přidat autora' )
			.textContent( 'Zadejte celé jméno nového autora.' )
			.initialValue( authorName )
			.ariaLabel( 'Jméno autora' )
			.ok( 'Přidat' )
			.cancel( 'Zrušit' );

		$mdDialog.show( prompt ).then( function ( result ) {
			var name = result.split( ' ' );
			var secondName = name.pop();
			var firstName = name.join( ' ' );

			authorsService.add( { firstName : firstName, secondName : secondName, fullName : result } );
		} );
	};

	this.addSong = function( song ) {
		if ( isValidSong( song ) ) {

		}
	};

}

/** Register controller. */
angular.module( APP_NAME ).controller( 'SongAddController', [ 'authorsService', 'songsService', '$mdToast', '$mdDialog', SongAddController ] );