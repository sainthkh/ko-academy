'use strict';

import * as React from 'react';
import { Link } from 'react-router';

import { PageLayoutProps, FetchablePageComponent } from '../common/Page'
import { AuthPage, AccessLevel } from '../common/AuthPage'
import { openDialog } from '../common/Dialog'

import MainBar from '../common/menu/MainBar'
import Video from './Video'
import Script from './Script'
import Next from './Next'
import Downloads from './Downloads'

import * as CSSModules from 'react-css-modules'
import styles from './style.css'

class Layout extends AuthPage<PageLayoutProps, {}> {
	componentWillMount() {
		this.props.load({
			courseSlug: this.props.params.courseSlug,
			slug: this.props.params.slug,
		})
	}

	protected approved(userLevel:AccessLevel, contentLevel:AccessLevel): JSX.Element {
		let { title, video, downloads, script, courseSlug, quizSlug, quizContentLevel, nextSlug } = this.props.content
		return (
			<div>
				<MainBar />
				<div className="wrap">
					<div styleName="lecture">
						<h1>{title}{userLevel == AccessLevel.GUEST && <span styleName="preview">Preview</span>}</h1>
						<Video url={video} />
						{userLevel == AccessLevel.GUEST && (
							<div styleName="signup-message">
								<span styleName="message">Isn't this cool? How about signing up and getting unlimited access to all vides?</span>
								<span styleName="button-wrap"><a styleName="button" onClick={ e => openDialog(e, "signup")}>Join Now</a></span>
							</div>
						)}
						<Downloads content={downloads} userLevel={this.props.accessLevel}/>
						<Script content={script} />
						<div styleName="quiz">
							{this.quiz(courseSlug, quizSlug, userLevel, this.accessLevelCode(quizContentLevel))}
						</div>
						<div className="next-btn">
							<Link to={`/lecture/${courseSlug}/${nextSlug}`}>Go to Next</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	quiz(courseSlug, quizSlug, userLevel, quizContentLevel) {
		if(userLevel < AccessLevel.GOLD) {
			if(quizContentLevel != AccessLevel.FREE) {
				return <Link to="/pricing">▶ Quiz<span styleName="gold">Gold</span></Link>
			} else {
				return <Link to={`/quiz/${courseSlug}/${quizSlug}`}>▶ Quiz<span styleName="gold">Gold Trial</span></Link>
			}			
		} else {
			return <Link to={`/quiz/${courseSlug}/${quizSlug}`}>▶ Quiz</Link>
		}
	}

	constructor(props) {
		super(props)

		this.quiz = this.quiz.bind(this)
	}
}

export const LecturePage = FetchablePageComponent({
	id: "lecture",
	resource: "/lecture",
})(CSSModules(Layout, styles))