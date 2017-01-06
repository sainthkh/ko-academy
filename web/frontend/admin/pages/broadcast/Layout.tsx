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
				<form className="wide-form" name="broadcast-form" action="POST" onSubmit={this.submit}>
					<div className="form-group">
						<label htmlFor="title">Title</label>
						<input type="text" className="form-field" name="title" placeholder="title" />
					</div>
					<div className="form-group">
						<label htmlFor="list">List</label>
						<select name="list" className="form-field">
							<option value="beginning-hangeul@mg.wiseinit.com">Hangeul</option>
						</select>
					</div>
					<div className="form-group">
						<label htmlFor="content">Content</label>
						<textarea name="content" className="form-field" rows={30}></textarea>
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

	submit(e) {
		e.preventDefault()

		var form = document.forms['broadcast-form']
		let broadcast = {
			title: form.title.value,
			list: form.list.value,
			content: form.content.value,
		}

		this.props.submit(broadcast)
	}
}

export const Layout = CSSModules(PageLayout, styles)