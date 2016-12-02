'use strict';

import React from 'react';
import MenuBar from '../common/MenuBar'
import CTA from './CTA'

export default class IndexPage extends React.Component {
	render() {
		return (
			<div className="home">
				<div styleName="">
					<MenuBar />
					<CTA />
				</div>
			</div>
		);
	}
}
