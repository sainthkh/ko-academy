import * as React from 'react';
import { PageLayout, PageLayoutProps } from './Page'

export enum AccessLevel {
	GUEST,
	FREE, 
	GOLD,
}

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
		this.context.router.push(contentLevel == AccessLevel.FREE ? '/signup' : '/pricing')
	}

	static contextTypes = {
		router: React.PropTypes.object.isRequired
    }

	protected abstract approved(userLevel:AccessLevel, contentLevel:AccessLevel): JSX.Element

	protected accessLevelCode(level:string):AccessLevel {
		switch(level) {
			case "guest":	return AccessLevel.GUEST
			case "free":	return AccessLevel.FREE
			case "gold":	return AccessLevel.GOLD
			default:		return AccessLevel.GUEST
		}
	}
}