import * as React from 'react'
import { FetchProps } from '../../../common/lib/fetch/props'
import { FetchableComponent } from '../../../common/lib/fetch'

import Spinner from '../common/Spinner'
import Dialog from '../common/Dialog'
import { DialogLayout } from '../common/FetchableDialog'

declare var Stripe: any

class Layout extends DialogLayout<FetchProps, {}> {
	main() {
		let title = "Join Now and Learn More About Korean Faster!"
		let main = (
			<div>
				<form name="payment-form" id="payment-form" onSubmit={this.submit}>
					<div id="payment-errors" styleName="invalid"></div>
					<input type="text" styleName="field" size={20} data-stripe="number" placeholder="card number"/>
					<div styleName="card-info">
						<div styleName="expiration">
							<label>Expiration</label>
							<input type="text" style={{width:"25%"}} styleName="field" size={2} data-stripe="exp_month" placeholder="MM"/>
							<input type="text" style={{width:"25%"}} styleName="field" size={2} data-stripe="exp_year" placeholder="YY"/>
						</div>
						<div styleName="cvc">
							<label>CVC</label>
							<input type="text" style={{width:"50%"}} styleName="field" size={4} data-stripe="cvc" placeholder="cvc"/>
						</div>
					</div>
					<button type="submit" id="submit-payment" styleName="submit">Pay</button>
				</form>
				<script type="text/javascript" src="https://js.stripe.com/v2/"></script>
			</div>
		)
		return <Dialog ID="payment" title={title} main={main} />
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
		var title = "Thank you for signing up."
		var main = (
			<div styleName="message">
				<p>Now, boost your Korean skills!</p>
				<p><a href="/uploads/hangeul-practice">Go on to Hangeul Course</a></p>
			</div>
		)
		return <Dialog ID={this.formName} title={title} main={main} />
	}

	protected submit(e) {
		e.preventDefault()

		let button = document.getElementById('submit-payment') as HTMLInputElement
		button.disabled = true

		Stripe.setPublishableKey('pk_test_EqP0OlXN1LSgmF42nzhh3TKs');
		Stripe.card.createToken(document.forms['payment-form'], (status, res) => {
			if(res.error) {
				let errDiv = document.getElementById('payment-errors')
				errDiv.textContent = res.error.message
				button.disabled = false
			} else {
				this.props.submit({
					token: res.id
				})
			}
		});
	}

	constructor(props) {
		super(props)

		this.submit = this.submit.bind(this)
	}
}

export const PaymentDialog = FetchableComponent({
	id: "payment",
	resource: "/payment/subscription/gold",
})(Layout)