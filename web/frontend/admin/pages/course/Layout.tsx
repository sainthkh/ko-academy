'use strict';

import * as React from 'react';
import * as CSSModules from 'react-css-modules'
import { FetchProps } from '../../../common/lib/fetch/props'
import Authorized from '../common/Authorized'
import styles from './Layout.css'

export interface LayoutProps extends FetchProps {

}

class PageLayout extends Authorized<LayoutProps, {}> {
	constructor(props) {
		super(props)
		this.submit = this.submit.bind(this)
	}

	render() {
		return (
			<div className="wrap">
				<form className="wide-form" name="course-form" action="POST" onSubmit={this.submit}>
					<div className="form-group">
						<label>Title</label>
						<input type="text" className="form-field" name="title" placeholder="title" />
					</div>
					<div className="form-group">
						<label>Slug</label>
						<input type="text" className="form-field" name="slug" placeholder="slug" />
					</div>	
					<div className="form-group">
						<label htmlFor="content">Description</label>
						<textarea name="description" className="form-field" rows={8}></textarea>
					</div>				
					<div className="form-group">
						<label htmlFor="content">Content</label>
						<textarea name="content" className="form-field" rows={20}></textarea>
					</div>
					{this.props.waiting && (<div>Now saving course...</div>)}
					{this.props.succeeded && (<div>Course saved</div>)}
					{this.props.failed && (<div>Save failed. Maybe slug problem.</div>)}
					<div className="button-wrap">
						<button type="submit" className="submit-button">Save</button>
					</div>
				</form>
			</div>
		);
	}

	submit(e) {
		e.preventDefault()

		var form = document.forms['course-form']
		let course = {
			slug: form.slug.value,
			title: form.title.value,
			description: form.description.value,
			content: form.content.value,
		}

		this.props.submit(course)
	}
}

export const Layout = CSSModules(PageLayout, styles)