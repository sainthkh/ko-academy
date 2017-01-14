import * as React from 'react';
import { PageLayout, PageLayoutProps } from './Page'
import { AuthRenderer } from './AuthRenderer'

export abstract class AuthPage<P extends PageLayoutProps, S> extends PageLayout<P, S> {
	content() {
		const userLevel = this.accessLevelCode(this.props.accessLevel)
		const contentLevel = this.accessLevelCode(this.props.content.accessLevel)
		return (contentLevel <= userLevel)? 
			this.approved(userLevel, contentLevel) : 
			this.denied(userLevel, contentLevel)
	}

	constructor(props) {
		super(props)

		this.approved = this.approved.bind(this)
		this.denied = this.denied.bind(this)
		this.accessLevelCode = this.accessLevelCode.bind(this)
	}

	protected denied(userLevel, contentLevel) {
		this.context.router.push(contentLevel == 1 ? '/signup' : '/pricing')
	}

	static contextTypes = {
		router: React.PropTypes.object.isRequired
    }

	protected abstract approved(userLevel:number, contentLevel:number): JSX.Element

	protected accessLevelCode(level) {
		switch(level) {
			case "guest":	return 0
			case "free":	return 1
			case "gold":	return 2
			default:		return 0
		}
	}
}