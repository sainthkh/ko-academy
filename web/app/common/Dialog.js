'use strict'
import React from 'react'
import CSSModules from 'react-css-modules';
import styles from './Dialog.css'

class Dialog extends React.Component {
	render() {
		return (
			<div id={this.props.ID} styleName="modal">
				<a href="#" styleName="bg-close"></a>
				<div styleName="modal-content">
					<div styleName="modal-header">
						<h2>{this.props.title}</h2>
						<a href="#" title="Close">X</a>
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
}

export default CSSModules(Dialog, styles)
