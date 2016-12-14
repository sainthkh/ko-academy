'use strict'
import * as React from 'react'
import { default as Dialog, openDialog } from '../../common/Dialog'
import { default as Spinner } from '../../common/Spinner'
import * as CSSModules from 'react-css-modules';
import styles from './SignupDialogContent.css'

export interface SignupDialogContentProps {
	waitingSignUp: boolean
	signupErrors: any
}

class SignupDialogContentReact extends React.Component<SignupDialogContentProps, {}> {
	render() {
		if(!this.props.waitingSignUp) {
			var title = "Sign up and start your Korean journey!"
			var main = (
				<div>
					<form method="POST" role="form">
						<input type="text" styleName="field" name="username" id="username" placeholder="user name" />
						<input type="email" styleName="field" name="email" id="email" placeholder="email" />
						<input type="password" styleName="field" name="password" id="password" placeholder="password" />
						<button type="submit" styleName="submit">Sign up</button>
					</form>
				</div>
			)
			var footer = (
				<div>
					Did you mean to <a href="#login" onClick={ e => openDialog(e, 'login')}>login</a>?
				</div>
			)
			return <Dialog ID="signup" title={title} main={main} footer={footer}/>;
		} else {
			var main = (
				<div styleName="message">
					<Spinner />
					<div>
						<p>now signing up...</p>
						<p>please wait.</p>
					</div>
				</div>
			)
			return <Dialog ID="signup" main={main} />
		}
	}
}

export const SignupDialogContent = CSSModules(SignupDialogContentReact, styles) 
