/**
 * External dependencies
 */
var debug = require( 'debug' )( 'calypso:signup-progress-store' ), // eslint-disable-line no-unused-vars
	store = require( 'store' ),
	assign = require( 'lodash/object/assign' ),
	omit = require( 'lodash/object/omit' ),
	find = require( 'lodash/collection/find' ),
	map = require( 'lodash/collection/map' ),
	isEmpty = require( 'lodash/lang/isEmpty' ),
	clone = require( 'lodash/lang/clone' );

/**
 * Internal dependencies
 */
var Dispatcher = require( 'dispatcher' ),
	emitter = require( 'lib/mixins/emitter' ),
	SignupDependencyStore = require( './dependency-store' ),
	steps = require( 'signup/config/steps' );

/**
 * Constants
 */
const STORAGE_KEY = 'signupProgress';

/**
 * Module variables
 */
let signupProgress = [];

var SignupProgressStore = {
	get: function() {
		return clone( signupProgress );
	},
	reset: function() {
		signupProgress = [];
		store.remove( STORAGE_KEY );
	}
};

emitter( SignupProgressStore );

function updateStep( newStep ) {
	signupProgress = map( signupProgress, function( step ) {
		if ( step.stepName === newStep.stepName ) {
			const { status } = newStep;
			if ( ! newStep.processingMessage && ( status === 'pending' || status === 'completed' ) ) {
				// pending or completed steps can omit the processing message if they are skipped
				return assign( {}, omit( step, 'processingMessage' ), newStep );
			}

			return assign( {}, step, newStep );
		}

		return step;
	} );

	handleChange();
}

function addStep( step ) {
	signupProgress = signupProgress.concat( step );

	handleChange();
}

function updateOrAddStep( step ) {
	if ( find( signupProgress, { stepName: step.stepName } ) ) {
		updateStep( step );
	} else {
		addStep( step );
	}
}

function setStepInvalid( step, errors ) {
	updateOrAddStep( assign( {}, step, {
		status: 'invalid',
		errors: errors
	} ) );
}

function saveStep( step ) {
	if ( find( signupProgress, { stepName: step.stepName } ) ) {
		updateStep( step );
	} else {
		addStep( assign( {}, step, { status: 'in-progress' } ) );
	}
}

function submitStep( step ) {
	const stepHasApiRequestFunction = steps[ step.stepName ] && steps[ step.stepName ].apiRequestFunction,
		status = stepHasApiRequestFunction ? 'pending' : 'completed';

	updateOrAddStep( assign( {}, step, { status } ) );
}

function processStep( step ) {
	updateStep( assign( {}, step, { status: 'processing' } ) );
}

function completeStep( step ) {
	updateStep( assign( {}, step, { status: 'completed' } ) );
}

function addTimestamp( step ) {
	return assign( {}, step, { lastUpdated: Date.now() } );
}

function loadProgressFromCache() {
	const cachedSignupProgress = store.get( STORAGE_KEY );

	if ( ! isEmpty( cachedSignupProgress ) ) {
		signupProgress = cachedSignupProgress;
	}

	handleChange();
}

function omitUserData( progress ) {
	return map( progress, step => {
		return omit( step, 'userData' );
	} );
}

function handleChange() {
	SignupProgressStore.emit( 'change' );

	store.set( STORAGE_KEY, omitUserData( signupProgress ) );
}

SignupProgressStore.dispatchToken = Dispatcher.register( function( payload ) {
	var action = payload.action,
		step = addTimestamp( action.data );

	Dispatcher.waitFor( [ SignupDependencyStore.dispatchToken ] );

	if ( ! isEmpty( action.errors ) ) {
		return setStepInvalid( step, action.errors );
	}

	switch ( action.type ) {
		case 'FETCH_CACHED_SIGNUP':
			loadProgressFromCache();
			break;
		case 'SAVE_SIGNUP_STEP':
			saveStep( step );
			break;
		case 'SUBMIT_SIGNUP_STEP':
			debug( 'submit step' );
			submitStep( step );
			break;
		case 'PROCESS_SIGNUP_STEP':
			processStep( step );
			break;
		case 'PROCESSED_SIGNUP_STEP':
			debug( 'complete step' );
			completeStep( step );
			break;
	}
} );

module.exports = SignupProgressStore;
