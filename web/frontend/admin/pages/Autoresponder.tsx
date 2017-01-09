'use strict';

import * as React from 'react';
import { EditorLayout, EditorLayoutProps } from './common/Editor'
import { FetchableComponent } from '../../common/lib/fetch'

export interface LayoutProps extends EditorLayoutProps {

}

class PageLayout extends EditorLayout<EditorLayoutProps, {}> {
	constructor(props) {
		super(props)
		this.formName = "autoresponder-form"
	}

	form() {
		const { ID, slug, title, listName, content } = this.props.content
		return (
			<div className="wrap">
				<form className="wide-form" name={this.formName} action="POST" onSubmit={this.submit}>
					{this.title(this.update, 'Autoresponder', title)}
					<input type="hidden" name="ID" value={ID} />
					<div className="form-group">
						<label>List name</label>
						<input type="text" className="form-field" name="list_name" placeholder="list name" />
					</div>
					<div className="form-group">
						<label>Slug</label>
						<input type="text" className="form-field" name="slug" placeholder="slug" />
					</div>
					<div className="form-group">
						<label>Title</label>
						<input type="text" className="form-field" name="title" placeholder="title" />
					</div>
					<div className="form-group">
						<label htmlFor="content">Content</label>
						<textarea name="content" className="form-field" rows={30}></textarea>
					</div>
					{this.props.waiting && (<div>Now saving autoresponder...</div>)}
					{this.props.succeeded && (<div>Autoresponder saved</div>)}
					{this.props.failed && (<div>Save failed. Maybe slug problem.</div>)}
					<div className="button-wrap">
						<button type="submit" className="submit-button">Save</button>
					</div>
				</form>
			</div>
		);
	}
}

export const AutoresponderPage = FetchableComponent({
	admin: true,
	name: "autoresponder",
	resource: "/email/autoresponder",
})(PageLayout)