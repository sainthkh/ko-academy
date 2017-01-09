'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import {Link} from 'react-router'
import styles from './Lecture.css'

export interface LectureProps {
	slug: string
	courseSlug: string
	title: string
	accessLevel: string
	time: string
}

class Lecture extends React.Component<LectureProps, {}> {
	render() {
		const { courseSlug, slug, title, time } = this.props
		return (
			<div styleName="lecture">
				<Link to={`/lecture/${courseSlug}/${slug}`}>
					<div styleName="lecture-wrap">
						<span styleName="title">{title}</span><span styleName="time">{time}</span>
					</div>
				</Link>
			</div>
		);
	}
}

export default CSSModules(Lecture, styles)
