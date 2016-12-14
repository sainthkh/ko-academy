'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './Dialog.css'

export interface DialogContentProps {
	readonly ID: string
	readonly title?: string
	readonly main: JSX.Element
	readonly footer?: JSX.Element
}

class DialogReact extends React.Component<DialogContentProps, {}> {
	render() {
		return (
			<div id={this.props.ID} styleName="modal">
				<a href="#" styleName="bg-close" onClick={e => closeDialog(e, this.props.ID)}></a>
				<div styleName="modal-content">
					{this.props.title && (
						<div styleName="modal-header">
							<h2>{this.props.title}</h2>
							<a href="#" title="Close" onClick={e => closeDialog(e, this.props.ID)}>X</a>
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
}

export function closeDialog(e, id) {
	e.preventDefault()

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
