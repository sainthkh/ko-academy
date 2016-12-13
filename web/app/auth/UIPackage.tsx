'use strict'
import * as React from 'react'
import {default as SignupDialog} from './signup/SignupDialog'

export default class AuthUI extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<SignupDialog />
			</div>
		);
	}
}