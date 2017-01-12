'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './style.css'

export interface ContentProps {
	content: string
}

class Script extends React.Component<ContentProps, {}> {
	render() {
		return (
			<div>
				<h1>Script</h1>
				<div styleName="script" dangerouslySetInnerHTML={{__html: this.props.content}} />
			</div>
		);
	}
}

export default CSSModules(Script, styles)
