'use strict';

import * as React from 'react';
import { Link } from 'react-router'
import MainBar from '../common/menu/MainBar'
import Hero from './Hero'
import * as CSSModules from 'react-css-modules';
import styles from './style.css'

class IndexPage extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="index-wrap">
				<Hero />
				<div className="wrap">
					<h1>Courses</h1>
					<Link styleName="course" to="/course/hangeul">
						<div>
							<img src="/uploads/hangeul.png" />
							<div styleName="title">Beginning Korean with Hangeul</div>
							<div styleName="description">
								Start your Korean Journey with Hangeul, Korean Alphabet.
							</div>
						</div>
					</Link>
				</div>
			</div>
		);
	}
}

export default CSSModules(IndexPage, styles)