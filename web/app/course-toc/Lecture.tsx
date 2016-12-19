'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import {Link} from 'react-router'
import styles from './Lecture.css'

export interface LectureProps {
	slug: string
	number: string | number
	title: string
	time: string
}

class Lecture extends React.Component<LectureProps, {}> {
	render() {
		return (
			<div styleName="lecture">
				<Link to="{this.props.slug}">
					<div styleName="lecture-wrap">
						<span styleName="number">{this.props.number}</span><span styleName="title">{this.props.title}</span><span styleName="time">{this.props.time}</span>
					</div>
				</Link>
			</div>
		);
	}
}

export default CSSModules(Lecture, styles)
