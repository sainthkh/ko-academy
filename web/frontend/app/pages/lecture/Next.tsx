'use strict'
import * as React from 'react'

export interface NextProps {
	url: string
	title: string
}

export default class Next extends React.Component<NextProps, {}> {
	render() {
		return (
			<div style={next}>
				<span>Next: </span><a href={this.props.url}>{this.props.title}</a>
			</div>
		);
	}
}

var next = {
	fontSize: '1.8em'
}