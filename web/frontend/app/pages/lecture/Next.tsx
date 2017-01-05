'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './Next.css'

export interface NextProps {
	url: string
	title: string
}

class Next extends React.Component<NextProps, {}> {
	render() {
		return (
			<div className="wrap">
				<div styleName="next">
					<span>Next: </span><a href={this.props.url}>{this.props.title}</a>
				</div>
			</div>
		);
	}
}

export default CSSModules(Next, styles)
