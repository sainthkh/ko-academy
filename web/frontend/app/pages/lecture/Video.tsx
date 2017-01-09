'use strict'
import * as React from 'react'
import * as Measure from 'react-measure'

export interface VideoProps {
	url: string
}

export default class Video extends React.Component<VideoProps, {}> {
	state = {
		dimensions: {
			width: -1,
			height: -1,
		}
	}

	render() {
		let { width, height } = this.state.dimensions
		height = width / 16 * 9;

		return (
			<Measure onMeasure={dimensions => {
				this.setState({dimensions})
			}}>
				<div>
					<iframe width={width} height={height} src={this.props.url}></iframe>
				</div>
			</Measure>
		);
	}
}
