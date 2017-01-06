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
				<form className="wide-form" name="autoresponder-form" action="POST" onSubmit={this.submit}>
					<div className="form-group">
						<label>List name</label>
						<input type="text" className="form-field" name="list_name" placeholder="list name" />
					</div>
					<div className="form-group">
						<label>Slug</label>
						<input type="text" className="form-field" name="slug" placeholder="slug" />
					</div>
					<div className="form-group">
						<label>Address</label>
						<input type="email" className="form-field" name="address" placeholder="email address" />
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
					<div className="button-wrap">
						<button type="submit" className="submit-button">Save</button>
					</div>
				</form>
			</div>
		);
	}

	submit(e) {
		e.preventDefault()

		var form = document.forms['autoresponder-form']
		let autoresponder = {
			listName: form.list_name.value,
			slug: form.slug.value,
			address: form.address.value,
			title: form.title.value,
			content: form.content.value,
		}

		this.props.submit(autoresponder)
	}
}

export const Layout = CSSModules(PageLayout, styles)