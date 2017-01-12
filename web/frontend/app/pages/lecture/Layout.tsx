'use strict';

import * as React from 'react';

import { PageLayout, PageLayoutProps, FetchablePageComponent } from '../common/Page'
import { openDialog } from '../common/Dialog'
import { RenderGrid } from '../common/RenderGrid'

import MainBar from '../common/menu/MainBar'
import Video from './Video'
import Script from './Script'
import Next from './Next'

import * as CSSModules from 'react-css-modules'
import styles from './style.css'

class Layout extends PageLayout<PageLayoutProps, {}> {
	componentWillMount() {
		this.props.load({
			courseSlug: this.props.params.courseSlug,
			slug: this.props.params.slug,
		})
	}

	content() {
		const userAccessLevel = this.props.accessLevel
		const contentAccessLevel = this.props.content.accessLevel
		let grid = new RenderGrid(userAccessLevel, contentAccessLevel, [
			[this.guest, this.signup],
			[this.free, this.signup],
			[this.gold, this.gold],
		])
		return grid.render()
	}

	guest() {
		let { title, video, downloads, script } = this.props.content
		return (
			<div>
				<MainBar />
				<div className="wrap">
					<div styleName="lecture">
						<h1>{title}<span styleName="preview">Preview</span></h1>
						<Video url={video} />
						<div styleName="signup-message">
							<span styleName="message">Isn't this cool? How about signing up and getting unlimited access to all vides?</span>
							<span styleName="button-wrap"><a styleName="button" onClick={ e => openDialog(e, "signup")}>Join Now</a></span>
						</div>
						<Script content={script} />
					</div>
				</div>
			</div>
		);
	}

	signup(userLevel, contentLevel) {

	}

	free() {
		let { title, video, downloads, script } = this.props.content
		return (
			<div>
				<MainBar />
				<div className="wrap">
					<div styleName="lecture">
						<h1>{title}</h1>
						<Video url={video} />
						<Script content={script} />
					</div>
				</div>
			</div>
		);
	}

	gold() {
		let { title, video, downloads, script } = this.props.content
		return (
			<div>
				<MainBar />
				<div className="wrap">
					<div styleName="lecture">
						<h1>{title}</h1>
						<Video url={video} />
						<Script content={script} />
					</div>
				</div>
			</div>
		);
	}

	constructor(props) {
		super(props)

		this.guest = this.guest.bind(this)
		this.signup = this.signup.bind(this)
		this.free = this.free.bind(this)
		this.gold = this.gold.bind(this)
	}
}

export const LecturePage = FetchablePageComponent({
	id: "lecture",
	resource: "/lecture",
})(CSSModules(Layout, styles))