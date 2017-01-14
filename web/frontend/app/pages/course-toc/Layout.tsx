'use strict';

import * as React from 'react';
import { PageLayoutProps, FetchablePageComponent } from '../common/Page'
import { AuthPage, AccessLevel } from '../common/AuthPage'
import MainBar from '../common/menu/MainBar'
import Section from './Section'
import Lecture from './Lecture'
import Overview from './Overview'

interface LayoutProps extends PageLayoutProps {
}

class Layout extends AuthPage<PageLayoutProps, {}> {
	constructor(props) {
		super(props);

		this.parseToc = this.parseToc.bind(this)
	}

	protected approved(userLevel, contentLevel) {
		return this.renderLayout(true)
	}

	protected denied(userLevel, contentLevel) {
		return this.renderLayout(false)
	}

	private renderLayout(approved) {
		let { title, description, slug, content } = this.props.content
		return (
			<div>
				<MainBar />
				<Overview title={title} description={description} />
				<div style={toc}>
					<div className="wrap">
						{this.parseToc(content, slug)}
					</div>
				</div>
			</div>
		)
	}

	parseToc(content:string, courseSlug) {
		content = content.replace(/\r/, `\n`).replace(/\n\n+/, '\n')
		return content.split('\n').map(line => {
			let type = line[0]
			line = line.substring(1)
			line = line.trim()
			switch(type) {
				case '#':
					return <Section title={line.trim()} />
				case '*':
					let parts = line.split('|').map(v => {
						return v.trim()
					})
					let userLevel = this.accessLevelCode(this.props.accessLevel)
					let contentLevel = this.accessLevelCode(parts[2])
					return <Lecture title={parts[0]} courseSlug={courseSlug} slug={parts[1]} time={parts[3]} 
						userAccessLevel={this.props.accessLevel} contentAccessLevel={parts[2]} 
						approved={contentLevel <= userLevel}/>
			}
		})
	}
}

export const CourseTocPage = FetchablePageComponent({
	id: "course-toc",
	resource: "/course",
})(Layout)

var toc = {
	padding: '5px',
}