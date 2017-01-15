'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './style.css'

export enum ChoiceStatus {
	NORMAL,
	SELECTED,
	CORRECT,
	WRONG,
}

export interface ChoiceProps {
	number: string
	content: string
	correctMessage: string
	status: ChoiceStatus
	answer: boolean
	showMessage: boolean
	onClick: any
}

class Choice extends React.Component<ChoiceProps, {}> {
	render() {
		const { number, content, correctMessage, status, answer, showMessage } = this.props
		let backgroundStyle = (answer && status == ChoiceStatus.CORRECT) || 
			status == ChoiceStatus.SELECTED ? { background: "#CEFDDB" } : {}
		return (
			<div styleName="choice">
				<div style={backgroundStyle} styleName={this.statusToStyle(status, answer)}
					onClick={this.props.onClick}
				>
					<span styleName="number">{number}</span>
					<span styleName="content">{content}</span>
				</div>
				{showMessage && (
					<div styleName="correct-message">
						<div styleName="icon-wrap">
							<svg styleName="icon">
								<use xlinkHref="/static/symbols.svg#icon-arrow-right" />
							</svg>
						</div>
						<span>{correctMessage}</span>
					</div>
				)}
			</div>
		);
	}

	private statusToStyle(status:ChoiceStatus, answer): string {
		switch(status) {
			case ChoiceStatus.NORMAL:	return "normal"
			case ChoiceStatus.CORRECT:	return answer? "answer" : "correct"
			case ChoiceStatus.WRONG:	return "wrong"
			case ChoiceStatus.SELECTED:	return "normal"
			default:					return "normal"
		}
	}


	constructor(props) {
		super(props)

		this.statusToStyle = this.statusToStyle.bind(this)
	}
}

export default CSSModules(Choice, styles)