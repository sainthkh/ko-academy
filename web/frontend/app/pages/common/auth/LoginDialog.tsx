'use strict'
import * as React from 'react'
import { default as Dialog, openDialog, closeDialog } from '../Dialog'
import { default as Spinner } from '../Spinner'
import { FetchProps } from '../../../../common/lib/fetch/props'
import { FetchableComponent } from '../../../../common/lib/fetch'
import { setToken } from '../../../../common/lib/token'
import { DialogLayout } from '../FetchableDialog'

export interface LayoutProps extends FetchProps {
}


class Layout extends DialogLayout<LayoutProps, {}> {
	constructor(props) {
		super(props)
		this.formName = "login"
	}

	protected main() {
		var title = "Resume your Korean journey!"
		var main = (
			<div>
				<form method="POST" name={this.formName} role="form" onSubmit={this.submit}>
					<input type="email" styleName="field" name="email" id="email" placeholder="email" />
					<input type="password" styleName="field" name="password" id="password" placeholder="password" />
					<button type="submit" styleName="submit">Login</button>
				</form>
			</div>
		)
		var footer = (
			<div>
				Did you mean to <a href="#login" onClick={ e => openDialog(e, 'signup')}>sign up</a>?
			</div>
		)
		return <Dialog ID="login" title={title} main={main} footer={footer}/>;
	}

	protected loading() {
		var main = (
			<div styleName="message">
				<Spinner />
				<div>
					<p>now logging in...</p>
					<p>please wait.</p>
				</div>
			</div>
		)
		return <Dialog ID={this.formName} freeze={true} main={main} />
	}

	protected done() {
		var main = (
			<div styleName="message">
				<p>Welcome back!</p>
				<p><a href="/course/hangeul">Go to Hangeul Course</a></p>
			</div>
		)
		return <Dialog ID={this.formName} main={main} />
	}
}

export const LoginDialog = FetchableComponent({
	id: "login",
	resource: "/login",
	processResult: result => {
		let action = {} as any
		if (result.success) {
			action.username = result.username
			action.accessLevel = result.accessLevel
			setToken(result.token)
		}
		return action
	},
	onSucceeded: action => ({
		auth: {
			username: action.username,
			accessLevel: action.accessLevel,
		}
	}),
})(Layout)
