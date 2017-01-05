'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './Dialog.css'

export const DIALOG_WAITING = "DIALOG_WAITING"
export const DIALOG_ERROR = "DIALOG_ERROR"
export const DIALOG_DONE = "DIALOG_DONE"

export interface DialogContentProps {
	readonly ID: string
	readonly freeze?: boolean
	readonly title?: string
	readonly main: JSX.Element
	readonly footer?: JSX.Element
}

class DialogReact extends React.Component<DialogContentProps, {}> {
	render() {
		return (
			<div id={this.props.ID} styleName="modal">
				<a href="#" styleName="bg-close" onClick={e => this.close(e)}></a>
				<div styleName="modal-content">
					{this.props.title && (
						<div styleName="modal-header">
							<h2>{this.props.title}</h2>
							<a href="#" title="Close" onClick={e => this.close(e)}>X</a>
						</div>
					)}
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
		if(!this.props.freeze) {
			closeDialog(this.props.ID)
		}
	}
}

export function closeDialog(id) {
	var dlg = document.getElementById(id)
	dlg.classList.remove('show-dialog')
}

export function openDialog(e, id) {
	e.preventDefault() 

	var dlgs = document.getElementsByClassName('show-dialog')
	
	for(let i = 0; i < dlgs.length; i++) {
		dlgs[i].classList.remove('show-dialog')
	}

	var dlg = document.getElementById(id)
	dlg.classList.add('show-dialog')
}

export default CSSModules(DialogReact, styles)
