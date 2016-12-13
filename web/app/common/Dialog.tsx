'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './Dialog.css'

export interface DialogContentProps {
	readonly ID: string
	readonly title: string
	readonly main: JSX.Element
	readonly footer?: JSX.Element
}

class DialogReact extends React.Component<DialogContentProps, {}> {
	render() {
		return (
			<div id={this.props.ID} styleName="modal">
				<a href="#" styleName="bg-close" onClick={e => this.close(e)}></a>
				<div styleName="modal-content">
					<div styleName="modal-header">
						<h2>{this.props.title}</h2>
						<a href="#" title="Close" onClick={e => this.close(e)}>X</a>
					</div>
					<div styleName="modal-main">
						{this.props.main}
					</div>
					{this.props.footer && (
						<div styleName="modal-footer">
							{this.props.footer}
						</div>
					)}
				</div>
			</div>
		);
	}

	close(e) {
		e.preventDefault()

		var dlg = document.getElementById(this.props.ID)
		dlg.classList.remove('show-dialog')
	}
}

export default CSSModules(DialogReact, styles)
