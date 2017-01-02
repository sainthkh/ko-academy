'use strict'
import * as React from 'react'
import { default as Dialog, openDialog, closeDialog } from '../../common/Dialog'
import { default as Spinner } from '../../common/Spinner'
import * as CSSModules from 'react-css-modules';
import styles from './SignupDialogContent.css'

export interface SignupDialogContentProps {
	waiting: boolean
	done: boolean
	error: any
	fetchSignup: any
}

class SignupDialogContentReact extends React.Component<SignupDialogContentProps, {}> {
	private ID: string
	constructor(props) {
		super(props)
		this.submit = this.submit.bind(this)
		this.form = this.form.bind(this)
		this.loading = this.loading.bind(this)
		this.done = this.done.bind(this)
		this.ID = "signup"
	}

	render() {
		if(!this.props.waiting) {
			if(!this.props.done) {
				return this.form()
			} else {
				return this.done()
			}
		} else {
			return this.loading()
		}
	}

	private form() {
		var title = "Sign up and wait for your Korean journey!"
		var main = (
			<div>
				<form method="POST" name="signup" role="form" onSubmit={this.submit}>
					<input type="text" styleName="field" name="username" id="username" placeholder="user name" />
					{this.props.error.longName && (<div styleName="invalid">Your name is too long. User name should be shorter than 50 characters.</div>)}
					<input type="email" styleName="field" name="email" id="email" placeholder="email" />
					{this.props.error.invalidEmail && (<div styleName="invalid">Your email format is invalid. Please check it out.</div>)}
					{this.props.error.duplicateEmail && (<div styleName="invalid">You have already signed up.</div>)}
					<input type="password" styleName="field" name="password" id="password" placeholder="password" />
					{this.props.error.shortPassword && (<div styleName="invalid">Your password is too short. Password should be at least 8 characters.</div>)}
					{this.props.error.commonPassword && (<div styleName="invalid">Your password is too common. Please use another password.</div>)}
					<button type="submit" styleName="submit">Sign up</button>
				</form>
			</div>
		)
		var footer = (
			<div>
				Did you mean to <a href="#login" onClick={ e => openDialog(e, 'login')}>login</a>?
			</div>
		)
		return <Dialog ID={this.ID} title={title} main={main} footer={footer}/>;
	}

	private submit(e) {
		e.preventDefault()

		var form = document.forms['signup']
		var user = {
			username: form.username.value,
			email: form.email.value,
			password: form.password.value,
		}

		this.props.fetchSignup(user)
	}

	private loading() {
		var main = (
			<div styleName="message">
				<Spinner />
				<div>
					<p>now signing up...</p>
					<p>please wait.</p>
				</div>
			</div>
		)
		return <Dialog ID={this.ID} freeze={true} main={main} />
	}

	private done() {
		var title = "Thank you for signing up."
		var main = (
			<div styleName="message">
				<p>I'll contact you soon when I open the site. </p>
				<p><a href="/uploads/hangeul-practice">Here is your gift.</a></p>
			</div>
		)
		return <Dialog ID={this.ID} title={title} main={main} />
	}
}

export const SignupDialogContent = CSSModules(SignupDialogContentReact, styles) 