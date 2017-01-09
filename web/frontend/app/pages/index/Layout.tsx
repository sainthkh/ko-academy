'use strict';

import * as React from 'react';
import MainBar from '../common/menu/MainBar'
import Hero from './Hero'
import { commonStyle } from '../common/style'

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
	background: commonStyle.background,
	height: '100%',
}

export default IndexPage