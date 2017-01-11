'use strict';

import * as React from 'react';
import { PageLayout, PageLayoutProps, FetchablePageComponent } from '../common/Page'
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
		let { title, video, downloads, script } = this.props.content
		return (
			<div>
				<MainBar />
				<div className="wrap">
					<h1>{title}</h1>
					<Video url={video} />
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