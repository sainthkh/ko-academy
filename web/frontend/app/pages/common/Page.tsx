'use strict';

import * as React from 'react';
import { FetchableComponent } from '../../../common/lib/fetch'
import { FetchProps } from '../../../common/lib/fetch/props'

export interface PageLayoutProps extends FetchProps {
	params: any
}

export abstract class PageLayout<P extends PageLayoutProps, S> extends React.Component<P, S> {
	constructor(props) {
		super(props);

		this.loading = this.loading.bind(this)
		this.content = this.content.bind(this)
	}

	componentWillMount() {
		this.props.load({slug: this.props.params.slug})
	}

	componentWillReceiveProps(nextProps) {
		
	}

	render() {
		if(this.props.loading) {
			return this.loading()
		} else {
			return this.content()
		}
	}

	abstract content()

	loading() {
		return (
			<div>
				<h1>Loading...</h1>
				<p>Please waiting</p>
			</div>
		)
	}
}