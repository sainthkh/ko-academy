'use strict'
import * as React from 'react'
import { openDialog } from '../common/Dialog'
import { RenderGrid } from '../common/RenderGrid'
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
}

class Lecture extends React.Component<LectureProps, {}> {
	render() {
		let { userAccessLevel, contentAccessLevel } = this.props
		let grid = new RenderGrid(userAccessLevel, contentAccessLevel, [
			[this.preview, this.signup],
			[this.normal, this.gold],
			[this.normal, this.normal],
		])
		
		return grid.render()
	}

	preview() {
		const { courseSlug, slug, title, time } = this.props
		return (
			<div styleName="lecture">
				<Link to={`/lecture/${courseSlug}/${slug}`}>
					<div styleName="lecture-wrap">
						<span styleName="title">{title}</span><span styleName="preview">Preview</span><span styleName="time">{time}</span>
					</div>
				</Link>
			</div>
		);
	}

	normal() {
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

	signup() {
		const { courseSlug, slug, title, time } = this.props
		return (
			<div styleName="lecture">
				<a styleName="gray" onClick={ e => openDialog(e, "signup")}>
					<div styleName="lecture-wrap">
						<span styleName="title">{title}</span><span styleName="time">{time}</span>
					</div>
				</a>
			</div>
		);
	}

	gold() {
		const { courseSlug, slug, title, time } = this.props
		return (
			<div styleName="lecture">
				<a styleName="gray" onClick={ e => openDialog(e, "gold")}>
					<div styleName="lecture-wrap">
						<span styleName="title">{title}</span><span styleName="gold">Gold</span><span styleName="time">{time}</span>
					</div>
				</a>
			</div>
		);
	}

	constructor(props) {
		super(props)
		
		this.signup = this.signup.bind(this)
		this.gold = this.gold.bind(this)
		this.preview = this.preview.bind(this)
		this.normal = this.normal.bind(this)
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