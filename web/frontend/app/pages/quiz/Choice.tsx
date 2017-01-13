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
	answer: boolean
}

class Choice extends React.Component<ChoiceProps, {}> {
	render() {
		const { number, content, correctMessage, status, answer } = this.props
		let backgroundStyle = answer && status == ChoiceStatus.CORRECT ?  
			{ background: "#CEFDDB" } : {}
		return (
			<div styleName="choice">
				<div style={backgroundStyle} styleName={this.statusToStyle(status, answer)}>
					<span styleName="number">{number}</span>
					<span styleName="content">{content}</span>
				</div>
				{status == ChoiceStatus.CORRECT && (
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
			default:					return ""
		}
	}


	constructor(props) {
		super(props)

		this.statusToStyle = this.statusToStyle.bind(this)
	}
}

export default CSSModules(Choice, styles)