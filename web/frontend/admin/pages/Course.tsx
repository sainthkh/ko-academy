'use strict';

import * as React from 'react';
import { Editor, EditorLayout, EditorLayoutProps } from './common/Editor'

export interface LayoutProps extends EditorLayoutProps {

}

class PageLayout extends EditorLayout<LayoutProps, {}> {
	constructor(props) {
		super(props)
		this.formName = 'course-form'
	}

	form() {
		const { ID, title, slug, description, content } = this.props.content
		return (
			<div className="wrap">
				<form className="wide-form" name={this.formName} action="POST" onSubmit={this.submit}>
					{this.title(this.update, 'Course', title)}
					<input type="hidden" name="ID" value={ID} />
					<div className="form-group">
						<label>Title</label>
						<input type="text" className="form-field" name="title" defaultValue={title} placeholder="title" />
					</div>
					<div className="form-group">
						<label>Slug</label>
						<input type="text" className="form-field" name="slug" defaultValue={slug} placeholder="slug" />
					</div>	
					<div className="form-group">
						<label htmlFor="content">Description</label>
						<textarea name="description" className="form-field" rows={8}>{description}</textarea>
					</div>				
					<div className="form-group">
						<label htmlFor="content">Content</label>
						<textarea name="content" className="form-field" rows={20}>{content}</textarea>
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
}

export const CoursePage = Editor({
	admin: true,
	id: "course",
	resource: "/course",
})(PageLayout)