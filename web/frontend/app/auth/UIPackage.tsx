'use strict'
import * as React from 'react'
import {default as SignupDialog} from './signup/SignupDialog'
import {default as LoginDialog} from './login/LoginDialog'
import {default as SubscribeDialog} from './subscribe/SubscribeDialog'

export default class AuthUI extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<SignupDialog />
				<LoginDialog />
				<SubscribeDialog />
			</div>
		);
	}
}