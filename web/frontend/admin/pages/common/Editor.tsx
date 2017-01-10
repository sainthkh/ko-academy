import * as React from 'react';
import { connect } from 'react-redux'

import { isTokenValid } from '../../../common/lib/token'
import { FetchProps } from '../../../common/lib/fetch/props'
import { FetchableLayout } from '../../../common/lib/fetch'

export interface EditorLayoutProps extends FetchProps {
	params: any
	load: (any) => void
}

export abstract class EditorLayout<P extends EditorLayoutProps, S> extends FetchableLayout<P, S> {
	constructor(props) {
		super(props, ["title", "loading"])
	}

	title(update, type, title) {
		if(!update) {
			return (<h1>Add New {type}</h1>)
		} else {
			return (<h1>Edit {type}: {title}</h1>)
		}
	}
	
	componentWillMount() {
		if (!isTokenValid()) {
			this.context.router.push('/admin')
		}
		if(this.props.params.id) {
			this.props.load({ ID: this.props.params.id })
			this.props.loading = true
			this.update = true
		} else {
			this.props.loading = false
		}
	}

	render() {
		if(this.props.loading) {
			return this.loading()
		} else {
			return this.main()
		}
	}

	loading() {
		return (
			<div className="wrap">
				<h1> Now loading... </h1>
			</div>
		)
	}

	static contextTypes = {
		router: React.PropTypes.func.isRequired
    }

	protected update: boolean
}