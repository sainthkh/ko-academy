'use strict';

import * as React from 'react';
import * as CSSModules from 'react-css-modules'
import MainBar from '../common/menu/MainBar'
import { openDialog } from '../common/Dialog'
import { PaymentDialog } from './PaymentDialog'

import styles from './style.css'

class Layout extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<MainBar />
				<div styleName="hero">
					<div className="wrap">
						<h1>Learn Korean in Faster, Better Way</h1>
						<h2>$9.99/month</h2>
						<a href="#" onClick={e => openDialog(e, "payment")}>Join Now</a>
					</div>
				</div>
				<div className="wrap">
					<div styleName="benefits">
						<h1>What's included?</h1>
						<div styleName="benefit">
							<h2>Learn faster with quizzes.</h2>
							<p>Your brain loves quizzes. Scientifically, you can learn something faster by checking what you have learned. Get a boost to your Korean language by joining Gold Plan.</p>
						</div>
						<div styleName="benefit">
							<h2>Is that all?</h2>
							<p>WiseInit Academy is just born. It’s just the beginning. Please wait and see how it grows!</p>
						</div>
					</div>
					<div styleName="faq">
						<h1>FAQ</h1>
						<div styleName="question">
							<h2>I know nothing about Korean. Is that OK?</h2>
							<p>Actually, you've found the right place. WiseInit Academy is the place for everyone who wants to start learning Korean. You'll learn from basic characters and how to pronounce them.</p>
							<p>And then, you'll learn a lot about grammars and others!</p>
						</div>
						<div styleName="question">
							<h2>What is your refund policy?</h2>
							<p>We don't want your money if you're not amazingly happy with our product. Feel free to contact us at academy@mg.wiseinit.com. We'll refund without any excuses.</p>
						</div>
						<div styleName="question">
							<h2>What is the payment method?</h2>
							<p>Only credit card is accepted now. We'll add more methods later.</p>
						</div>
						<div styleName="question">
							<h2>Is it safe?</h2>
							<p>We don't save your credit card information in our server. That information is safely handled by <a href="http://stripe.com">Stripe</a>.</p>
						</div>
						<div styleName="question">
							<h2>Can I upgrade later?</h2>
							<p>Certainly! Whenever you want to learn Korean fast, you can sign up.</p>
						</div>
						<div styleName="question">
							<h2>How can I cancel my subscription?</h2>
							<p>Currently, you can cancel your subscription by sending us an email(academy@mg.wiseinit.com).</p>
						</div>
					</div>
				</div>
				<PaymentDialog />
			</div>
		);
	}
}
export default CSSModules(Layout, styles)