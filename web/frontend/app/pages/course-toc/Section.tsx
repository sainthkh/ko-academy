'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './Section.css'

export interface SectionProps {
	title: string
}

class Section extends React.Component<SectionProps, {}> {
	render() {
		return (
			<div styleName="section">
				<h1>{this.props.title}</h1>
			</div>
		);
	}
}

export default CSSModules(Section, styles)
