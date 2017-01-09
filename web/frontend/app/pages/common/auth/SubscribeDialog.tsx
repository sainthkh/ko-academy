'use strict'
import * as React from 'react'
import { default as Dialog, openDialog, closeDialog } from '../Dialog'
import { default as Spinner } from '../Spinner'
import { FetchProps } from '../../../../common/lib/fetch/props'
import { FetchableComponent } from '../../../../common/lib/fetch'

export interface LayoutProps extends FetchProps {
}

class Layout extends React.Component<LayoutProps, {}> {
	private ID: string
	private email: string
	constructor(props) {
		super(props)
		this.submit = this.submit.bind(this)
		this.form = this.form.bind(this)
		this.loading = this.loading.bind(this)
		this.done = this.done.bind(this)
		this.ID = "subscribe"
	}

	render() {
		if(!this.props.waiting) {
			if(!this.props.succeeded) {
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
				<form method="POST" name={this.ID} role="form" onSubmit={this.submit}>
					<input type="text" styleName="field" name="first_name" id="first_name" placeholder="your first name" />
					<input type="email" styleName="field" name="email" id="email" placeholder="your-best@email.com" />
					{this.props.error.invalidEmail && (<div styleName="invalid">Your email format is invalid. Please check it out.</div>)}
					<button type="submit" styleName="submit">Sign up</button>
				</form>
			</div>
		)
		return <Dialog ID={this.ID} title={title} main={main}/>;
	}

	private submit(e) {
		e.preventDefault()

		var form = document.forms[this.ID]
		var user = {
			first_name: form.first_name.value,
			email: form.email.value,
		}
		this.email = form.email.value

		this.props.submit(user)
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
				<p>I've also sent your gift, <i>Hangeul Practice Sheet</i>, to your email address, {this.email}. </p>
				<p>Please check it out.</p>
			</div>
		)
		return <Dialog ID={this.ID} title={title} main={main} />
	}
}

export const SubscribeDialog = FetchableComponent({
	id: "subscribe",
	resource: "/subscribe"
})(Layout)
