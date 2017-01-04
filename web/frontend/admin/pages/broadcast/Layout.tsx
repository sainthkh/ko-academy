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
			<div styleName="wrap">
				<form styleName="broadcast" name="broadcast-form" action="POST" onSubmit={this.submit}>
					<div styleName="form-group">
						<label htmlFor="title">Title</label>
						<input type="text" styleName="field" name="title" placeholder="title" />
					</div>
					<div styleName="form-group">
						<label htmlFor="list">List</label>
						<select name="list" styleName="field">
							<option value="beginning-hangeul@mg.wiseinit.com">Hangeul</option>
						</select>
					</div>
					<div styleName="form-group">
						<label htmlFor="content">Content</label>
						<textarea name="content" styleName="field" rows={30}></textarea>
					</div>
					<div styleName="button-wrap">
						{this.props.waiting && (<div>Now sending mails ...</div>)}
						{this.props.succeeded && (<div>Broadcast Success</div>)}
						<button type="submit" styleName="submit">Send</button>
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

		this.props.fetch(broadcast)
	}
}

export const Layout = CSSModules(PageLayout, styles)