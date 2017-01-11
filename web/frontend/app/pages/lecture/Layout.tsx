'use strict';

import * as React from 'react';
import { PageLayout, PageLayoutProps, FetchablePageComponent } from '../common/Page'
import { openDialog } from '../common/Dialog'
import MainBar from '../common/menu/MainBar'
import Video from './Video'
import Script from './Script'
import Next from './Next'

class Layout extends PageLayout<PageLayoutProps, {}> {
	componentWillMount() {
		this.props.load({
			courseSlug: this.props.params.courseSlug,
			slug: this.props.params.slug,
		})
	}

	content() {
		let { title, video, downloads, script, accessLevel } = this.props.content
		return (
			<div>
				<MainBar />
				<div className="wrap">
					<h1>{title}</h1>
					<Video url={video} />
					{this.props.accessLevel == "guest" && accessLevel == "guest" && (
						<div styleName="signup-message">
							<span styleName="message">Isn't this cool? How about signing up and getting unlimited access to all course vides?</span>
							<span styleName="button-wrap"><a styleName="button" onClick={ e => openDialog(e, "signup")}>Join Now</a></span>
						</div>
					)}
					<Script content={script} />
				</div>
			</div>
		);
	}
}

export const LecturePage = FetchablePageComponent({
	id: "lecture",
	resource: "/lecture",
})(Layout)