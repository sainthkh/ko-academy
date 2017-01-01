'use strict';

import * as React from 'react';
import * as CSSModules from 'react-css-modules'
import styles from './Layout.css'

class IndexPage extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="home">
				Succeeded!
			</div>
		);
	}
}

export default CSSModules(IndexPage, styles)