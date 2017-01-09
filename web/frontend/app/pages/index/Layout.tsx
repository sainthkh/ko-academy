'use strict';

import * as React from 'react';
import MainBar from '../common/menu/MainBar'
import Hero from './Hero'

class IndexPage extends React.Component<{}, {}> {
	render() {
		return (
			<div style={wrap}>
				<Hero />
			</div>
		);
	}
}

var wrap = {
	background: '#192867',
	height: '100%',
}

export default IndexPage