'use strict';

import * as React from 'react';
import * as CSSModules from 'react-css-modules'
import Authorized from '../common/Authorized'
import styles from './Layout.css'

export interface LayoutProps {

}

class PageLayout extends Authorized<LayoutProps, {}> {
	render() {
		return (
			<div styleName="wrap">
				<form styleName="broadcast" name="broadcast" action="POST">
					<div styleName="form-group">
						<label htmlFor="title">Title</label>
						<input type="text" styleName="field" id="title" name="title" placeholder="title" />
					</div>
					<div styleName="form-group">
						<label htmlFor="list">List</label>
						<select id="list" name="list" styleName="field">
							<option value="beginning-hangeul@mg.wiseinit.com">Hangeul</option>
						</select>
					</div>
					<div styleName="form-group">
						<label htmlFor="content">Content</label>
						<textarea id="content" name="content" styleName="field" rows={30}></textarea>
					</div>
					<div styleName="button-wrap">
						<button type="submit" styleName="submit">Send</button>
					</div>
				</form>
			</div>
		);
	}
}

export const Layout = CSSModules(PageLayout, styles)