'use strict';

import * as React from 'react';
import { FetchableComponent } from '../../../common/lib/fetch'
import { FetchProps } from '../../../common/lib/fetch/props'
import MainBar from '../common/menu/MainBar'
import Section from './Section'
import Lecture from './Lecture'
import Overview from './Overview'

interface LayoutProps extends FetchProps {
	params: any
}

class Layout extends React.Component<LayoutProps, {
	loading: boolean
	content: any
}> {
	constructor(props) {
		super(props);

		this.loading = this.loading.bind(this)
		this.content = this.content.bind(this)
		this.parseToc = this.parseToc.bind(this)
	}

	componentWillMount() {
		this.props.load({slug: this.props.params.slug})
		this.setState({
			loading: true,
			content: {},
		})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			loading: nextProps.loading,
			content: nextProps.content,
		})
	}

	render() {
		if(this.state.loading) {
			return this.loading()
		} else {
			return this.content()
		}
	}

	content() {
		let { title, description, slug, content } = this.state.content
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

	loading() {
		return (
			<div>
				<h1>Loading...</h1>
				<p>Please waiting</p>
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
					return <Lecture title={parts[0]} courseSlug={courseSlug} slug={parts[1]} accessLevel={parts[2]} time={parts[3]} />
			}
		})
	}
}

export const CourseTocPage = FetchableComponent({
	id: "course-toc",
	resource: "/course",
})(Layout)

var toc = {
	padding: '5px',
}