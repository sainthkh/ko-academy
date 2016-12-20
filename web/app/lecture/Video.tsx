'use strict'
import * as React from 'react'
import * as Measure from 'react-measure'
import * as CSSModules from 'react-css-modules';

import styles from './Video.css'

export interface VideoProps {
	url: string
}

class Video extends React.Component<VideoProps, {}> {
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
			<div className="wrap">
				<Measure onMeasure={dimensions => {
					console.log(dimensions)
					this.setState({dimensions})
				}}>
					<div styleName="video">
						<iframe width={width} height={height} src={this.props.url}></iframe>
					</div>
				</Measure>
			</div>
		);
	}
}

export default CSSModules(Video, styles)
