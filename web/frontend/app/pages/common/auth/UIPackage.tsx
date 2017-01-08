'use strict'
import * as React from 'react'
import { SignupDialog } from './SignupDialog'
import { LoginDialog } from './LoginDialog'
import { SubscribeDialog } from './SubscribeDialog'

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