'use strict';

import * as React from 'react';
import MainBar from '../common/menu/MainBar'
import * as CSSModules from 'react-css-modules'
import Video from './Video'
import Content from './Content'
import Next from './Next'
import styles from "./Layout.css"

class LecturePage extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<MainBar />
				<Video url="https://www.youtube.com/embed/Y97GwEOs11w" />
				<Content content={`<h1>Downloads</h1><a href="#">Practice</a><p>Test Paragraph</p>`} />
				<Next url="/lecture/next" title="ㄱ, ㄴ, ㄷ, and ㅏ" />
			</div>
		);
	}
}

export default CSSModules(LecturePage, styles)