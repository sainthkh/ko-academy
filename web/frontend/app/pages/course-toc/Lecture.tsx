'use strict'
import * as React from 'react'
import { openDialog } from '../common/Dialog'
import { } from '../common/'
import * as CSSModules from 'react-css-modules';
import {Link} from 'react-router'
import styles from './Lecture.css'

export interface LectureProps {
	slug: string
	courseSlug: string
	title: string
	contentAccessLevel: string
	userAccessLevel: string
	time: string
	approved: boolean
}

class Lecture extends React.Component<LectureProps, {}> {
	render() {
		return this.props.approved ? this.approved() : this.denied()
	}

	approved() {
		const { courseSlug, slug, title, time } = this.props
		return (
			<div styleName="lecture">
				<Link to={`/lecture/${courseSlug}/${slug}`}>
					<div styleName="lecture-wrap">
						<span styleName="title">{title}</span>
						{this.props.userAccessLevel == "guest" && 
						<span styleName="preview">Preview</span>}
						<span styleName="time">{time}</span>
					</div>
				</Link>
			</div>
		);
	}

	denied() {
		const { courseSlug, slug, title, time } = this.props
		if(this.props.contentAccessLevel == "free") {
			return (
				<div styleName="lecture">
					<a styleName="gray" onClick={ e => openDialog(e, "signup")}>
						<div styleName="lecture-wrap">
							<span styleName="title">{title}</span><span styleName="time">{time}</span>
						</div>
					</a>
				</div>
			);
		} else {
			return (
				<div styleName="lecture">
					<Link to="/pricing">
						<div styleName="gray">
							<div styleName="lecture-wrap">
								<span styleName="title">{title}</span><span styleName="gold">Gold</span><span styleName="time">{time}</span>
							</div>
						</div>
					</Link>
				</div>
			);	
		}
	}

	constructor(props) {
		super(props)
		
		this.approved = this.approved.bind(this)
		this.denied = this.denied.bind(this)
	}
}

export default CSSModules(Lecture, styles)

function accessLevelCode(level) {
	switch(level) {
		case "guest":	return 0
		case "free":	return 1
		case "gold":	return 2
		default:		return 0
	}
}