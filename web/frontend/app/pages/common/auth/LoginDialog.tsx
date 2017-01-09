'use strict'
import * as React from 'react'
import { default as Dialog, openDialog, closeDialog } from '../Dialog'
import { default as Spinner } from '../Spinner'
import { FetchProps } from '../../../../common/lib/fetch/props'
import { FetchableComponent } from '../../../../common/lib/fetch'

export interface LayoutProps extends FetchProps {
}


class Layout extends React.Component<LayoutProps, {}> {
	render() {
		var title = "Resume your Korean journey!"
		var main = (
			<div>
				<form method="POST" role="form">
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
}

export const LoginDialog = FetchableComponent({
	id: "login",
	resouce: "/login"
})(Layout)
