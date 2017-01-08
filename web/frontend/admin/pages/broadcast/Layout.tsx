'use strict';

import * as React from 'react';
import * as CSSModules from 'react-css-modules'
import { Editor, EditorLayoutProps } from '../common/EditorLayout'
import styles from './Layout.css'

export interface LayoutProps extends EditorLayoutProps {

}

class PageLayout extends Editor<EditorLayoutProps, {}> {
	constructor(props) {
		super(props)
		this.formName = "broadcast-form"
	}

	form() {
		const { ID, title, to, content} = this.props.content
		return (
			<div className="wrap">
				<form className="wide-form" name={this.formName} action="POST" onSubmit={this.submit}>
					{this.title(this.update, 'Broadcast', title)}
					<input type="hidden" name="ID" value={ID} />
					<div className="form-group">
						<label htmlFor="title">Title</label>
						<input type="text" className="form-field" name="title" defaultValue={title} placeholder="title" />
					</div>
					<div className="form-group">
						<label htmlFor="list">List</label>
						<select name="list" className="form-field" defaultValue={to}>
							<option value="beginning-hangeul@mg.wiseinit.com">Hangeul</option>
						</select>
					</div>
					<div className="form-group">
						<label htmlFor="content">Content</label>
						<textarea name="content" className="form-field" rows={30}>{content}</textarea>
					</div>
					{this.props.waiting && (<div>Now sending mails ...</div>)}
					{this.props.succeeded && (<div>Broadcast Success</div>)}
					{this.props.failed && (<div>Save failed. Maybe slug problem.</div>)}
					<div className="button-wrap">
						<button type="submit" className="submit-button">Send</button>
					</div>
				</form>
			</div>
		);
	}
}

export const Layout = CSSModules(PageLayout, styles)