'use strict'
import React from 'react'
import { Link } from 'react-router';
import LoginButton from './LoginButton'

export default class MenuBar extends React.Component {
	render() {
		return (
			<header>
				<Link to="/">
					<img src="/img/logo.png" />
					<span styleName="">WiseInit Academy</span>
				</Link>
				<LoginButton />
			</header>
		);
	}
}