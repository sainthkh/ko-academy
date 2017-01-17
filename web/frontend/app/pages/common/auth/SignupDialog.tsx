'use strict'
import * as React from 'react'
import { default as Dialog, openDialog, closeDialog } from '../Dialog'
import { default as Spinner } from '../Spinner'
import { FetchProps } from '../../../../common/lib/fetch/props'
import { setToken } from '../../../../common/lib/token'
import { FetchableComponent } from '../../../../common/lib/fetch'
import { DialogLayout } from '../FetchableDialog'

export interface LayoutProps extends FetchProps {
	feedback: any
}

class Layout extends DialogLayout<LayoutProps, {}> {
	constructor(props) {
		super(props)
		this.formName = "signup"
	}

	protected main() {
		var title = "Sign up and start your Korean journey!"
		var main = (
			<div>
				<form action="" method="POST" name={this.formName} role="form" onSubmit={this.submit}>
					<input type="text" styleName="field" name="username" defaultValue={this.lastInput.username} id="username" placeholder="user name" />
					{this.props.error.LONG_USERNAME && (<div styleName="invalid">Your name is too long. User name should be shorter than 50 characters.</div>)}
					<input type="email" styleName="field" name="email" defaultValue={this.lastInput.email} id="email" placeholder="email" />
					{this.props.error.INVALID_EMAIL && (<div styleName="invalid">Your email format is invalid. Please check it out.</div>)}
					{this.props.error.DUPLICATE_EMAIL && (<div styleName="invalid">You have already signed up.</div>)}
					<input type="password" styleName="field" name="password" id="password" placeholder="password" />
					{this.props.error.WEAK_PASSWORD && (
						<div styleName="invalid">
							Your password is weak. How about trying these? <br /> 
							<ul>
							{this.props.feedback.suggestions.map(text => {
								return (<li>{text}</li>)
							})} 
							</ul>
						</div>
					)}
					<button type="submit" styleName="submit">Sign up</button>
				</form>
			</div>
		)
		var footer = (
			<div>
				Did you mean to <a href="#login" onClick={ e => openDialog(e, 'login')}>login</a>?
			</div>
		)
		return <Dialog ID={this.formName} title={title} main={main} footer={footer}/>;
	}

	protected loading() {
		var main = (
			<div styleName="message">
				<Spinner />
				<div>
					<p>now signing up...</p>
					<p>please wait.</p>
				</div>
			</div>
		)
		return <Dialog ID={this.formName} freeze={true} main={main} />
	}

	protected done() {
		var main = (
			<div styleName="message">
				<p>Let's get started.</p>
				<p><a href="/course/hangeul">Go to Hangeul Course</a></p>
			</div>
		)
		return <Dialog ID={this.formName} main={main} />
	}
}

export const SignupDialog = FetchableComponent({
	id: "signup",
	resource: "/signup",
	processResult: result => {
		let action = {} as any
		if (result.success) {
			action.username = result.username
			action.accessLevel = result.accessLevel
			setToken(result.token)
		} else {
			action.feedback = result.feedback
		}
		return action 
	},
	onSucceeded: action => ({
		auth: {
			username: action.username,
			accessLevel: action.accessLevel,
		}
	}),
	toFetch: action => ({
		feedback: action.feedback
	}),
})(Layout)
