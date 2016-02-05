/** @ssr-ready **/

/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import { getThemeById } from 'state/themes/themes/selectors';

console.log( getThemeById );

export const ThemeSheet = React.createClass( {
	displayName: 'ThemeSheet',

	propTypes: {
		theme: React.PropTypes.object,
	},

	render() {
		return (
			<Main className="themes__sheet">
				<div id="sub-bar">
					<span id="sub-bar-title">Pineapple Fifteen</span>
					<span id="sub-bar-tag">by Alpha and Omega</span>
				</div>
			</Main>
		);
	}
} )

export default connect(
	( state, props ) => Object.assign( {},
		props,
		{
			theme: getThemeById( state, props.themeSlug ),
		}
	)
)( ThemeSheet );
