'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import { openDialog } from '../common/Dialog'
import styles from './style.css'

export interface ContentProps {
	content: string
	userLevel: string
}

class Downloads extends React.Component<ContentProps, {}> {
	render() {
		let { content, userLevel } = this.props
		return (
			<div>
				<h1>Downloads</h1>
				<div styleName="downloads">
					{this.parseList(content, userLevel)}
				</div>
			</div>
		);
	}

	parseList(content:string, userLevel) {
		content = content.replace(/\r/, `\n`).replace(/\n\n+/, '\n')
		return content.split('\n').map(line => {
			let parts = line.split('|')
			if(this.props.userLevel == "guest") {
				return <a href="#" onClick={ e => openDialog(e, "signup")}>{parts[0]}</a>
			} else {
				return <a href={`/uploads/${parts[1]}`}>{parts[0]}</a>
			}
		})
	}

	constructor(props) {
		super(props)

		this.parseList = this.parseList.bind(this)
	}
}

export default CSSModules(Downloads, styles)
