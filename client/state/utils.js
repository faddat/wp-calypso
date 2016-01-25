/**
 * External dependencies
 */
import Joi from 'joi-browser';

/**
 * Internal dependencies
 */
import config from 'config';

/**
 * Module variables
 */

export function isValidStateWithSchema( state, schema ) {
	const validationError = Joi.validate( state, schema ).error;
	if ( validationError && config( 'env' ) === 'development' ) {
		console.warn( 'state validation failed', state, validationError );
	}
	return ! validationError;
}
