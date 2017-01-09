'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './Overview.css'

export interface OverviewProps {
	title: string
	description: string
}

class Overview extends React.Component<OverviewProps, {}> {
	render() {
		return (
			<div styleName="overview">
				<div className="wrap">
					<h1>{this.props.title}</h1>
					<p>{this.props.description}</p>
				</div>
			</div>
		);
	}
}

export default CSSModules(Overview, styles)
