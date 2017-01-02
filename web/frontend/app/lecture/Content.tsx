'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './Content.css'

export interface ContentProps {
	content: string
}

class Content extends React.Component<ContentProps, {}> {
	render() {
		return (
			<div className="wrap">
				<div styleName="content" dangerouslySetInnerHTML={{__html: this.props.content}} />
			</div>
		);
	}
}

export default CSSModules(Content, styles)
