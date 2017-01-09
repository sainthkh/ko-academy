'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './lecture.css'

export interface ContentProps {
	content: string
}

class Downloads extends React.Component<ContentProps, {}> {
	render() {
		return (
			<div>
				<h1>Downloads</h1>
				<div styleName="content" dangerouslySetInnerHTML={{__html: this.props.content}} />
			</div>
		);
	}
}

export default CSSModules(Downloads, styles)
