'use strict';
import * as React from 'react';
import { connect } from 'react-redux'

import { setToken } from '../../../common/lib/token'
import { FetchableComponent } from '../../../common/lib/fetch'
import { FetchProps } from '../../../common/lib/fetch/props'
import * as CSSModules from 'react-css-modules'
import styles from './Layout.css'

export interface LayoutProps extends FetchProps {
}

class Layout extends React.Component<LayoutProps, {}> {
	constructor(props) {
		super(props)
		this.submit = this.submit.bind(this)
	}
	render() {
		return (
			<div styleName="home">
				<form name="login-form" styleName="login-form" role="form">
					<div styleName="title">WiseInit Academy Admin</div>
					{this.props.failed && (<div>Wrong ID or Password</div>)}
					<input type="text" styleName="field" name="id" placeholder="ID" />
					<input type="password" styleName="field" name="password" placeholder="Password" />
					{this.props.waiting && (<div>Now logging in...</div>)}
					{this.props.succeeded && (<div>Login Success</div>)}
					<button type="submit" styleName="submit" onClick={this.submit}>Log in</button>
				</form>
			</div>
		);
	}

	submit(e) {
		e.preventDefault()

		var form = document.forms['login-form']
		let user = {
			id: form.id.value,
			password: form.password.value
		}

		this.props.submit(user)
	}
}

export const IndexPage = FetchableComponent({
	admin: true,
	id: "login",
	resource: "/auth/login",
	processResult: result => {
		if (result.success) {
			setToken(result.token)
		} 
	}
})(CSSModules(Layout, styles))