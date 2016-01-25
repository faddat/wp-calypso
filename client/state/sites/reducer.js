/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import pick from 'lodash/object/pick';
import indexBy from 'lodash/collection/indexBy';
import isFunction from 'lodash/lang/isFunction';
import omit from 'lodash/object/omit';

/**
 * Internal dependencies
 */
import { plans } from './plans/reducer';
import { SITE_RECEIVE, SERIALIZE, DESERIALIZE } from 'state/action-types';
import schema from './schema';
import { isValidStateWithSchema } from 'state/utils';

/**
 * Tracks all known site objects, indexed by site ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function items( state = {}, action ) {
	switch ( action.type ) {
		case SITE_RECEIVE:
			return Object.assign( {}, state, {
				[ action.site.ID ]: action.site
			} );
		case SERIALIZE:
			//TODO: find all the places where site is being decorated
			const blackList = [ '_headers', 'fetchingSettings', 'fetchingUsers',
				'latestSettings', '_events', '_maxListeners' ];
			const sites = Object.keys( state ).map( ( siteID ) => {
				let plainJSObject = pick( state[ siteID ], ( value ) => ! isFunction( value ) );
				plainJSObject = omit( plainJSObject, blackList );
				return plainJSObject;
			} );
			return indexBy( sites, 'ID' );
		case DESERIALIZE:
			return isValidStateWithSchema( state, schema ) ? state : {};
	}
	return state;
}

export default combineReducers( {
	items,
	plans
} );
