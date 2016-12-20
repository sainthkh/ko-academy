'use strict';

import * as React from 'react';
import MenuBar from '../common/MenuBar'
import * as CSSModules from 'react-css-modules'
import Video from './Video'
import Content from './Content'
import Next from './Next'
import styles from "./PageLayout.css"

class LecturePage extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="home">
				<MenuBar />
				<Video url="https://www.youtube.com/embed/Y97GwEOs11w" />
				<Content content={`<h1>Downloads</h1><a href="#">Practice</a><p>Test Paragraph</p>`} />
				<Next url="/lecture/next" title="ㄱ, ㄴ, ㄷ, and ㅏ" />
			</div>
		);
	}
}

export default CSSModules(LecturePage, styles)