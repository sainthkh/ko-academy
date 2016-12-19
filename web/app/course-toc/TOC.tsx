'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import Section from './Section'
import Lecture from './Lecture'
import styles from './TOC.css'

class TOC extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="toc">
				<div className="wrap">
					<Section title="Basic Sounds" />
					<Lecture number="1" title="Introduction" slug="introduction" time="2:48" />
				</div>
			</div>
		);
	}
}

export default CSSModules(TOC, styles)
