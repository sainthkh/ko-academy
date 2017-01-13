'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './style.css'

export enum ChoiceStatus {
	NORMAL,
	CORRECT,
	WRONG,
}

export interface ChoiceProps {
	number: string
	content: string
	correctMessage: string
	status: ChoiceStatus
}

class Choice extends React.Component<ChoiceProps, {}> {
	render() {
		const { number, content, correctMessage, status } = this.props
		return (
			<div styleName="choice">
				<div styleName={this.statusToStyle(status)}>
					<span styleName="number">{number}</span>
					<span styleName="content">{content}</span>
				</div>
			</div>
		);
	}

	private statusToStyle(status:ChoiceStatus): string {
		switch(status) {
			case ChoiceStatus.NORMAL:	return "normal"
			case ChoiceStatus.CORRECT:	return "correct"
			case ChoiceStatus.WRONG:	return "wrong"
			default:					return ""
		}
	}


	constructor(props) {
		super(props)

		this.statusToStyle
	}
}

export default CSSModules(Choice, styles)
