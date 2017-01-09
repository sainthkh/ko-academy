import * as React from 'react';
import { connect } from 'react-redux'

import Authorized from './Authorized'
import { FetchProps } from '../../../common/lib/fetch/props'

export interface EditorLayoutProps extends FetchProps {
	params: any
	load: (any) => void
}

export abstract class EditorLayout<P extends EditorLayoutProps, S> extends Authorized<P, S> {
	constructor(props) {
		super(props)
		let funcs = ["submit", "waitLoading", "form", "title"]
		let self = this
		funcs.forEach(f => {
			self[f] = self[f].bind(self)
		})
	}

	title(update, type, title) {
		if(!update) {
			return (<h1>Add New {type}</h1>)
		} else {
			return (<h1>Edit {type}: {title}</h1>)
		}
	}
	
	componentWillMount() {
		super.componentWillMount()
		if(this.props.params.id) {
			this.props.load({ id: this.props.params.id })
			this.props.loading = true
			this.update = true
		}
	}

	render() {
		if(this.props.loading) {
			return this.waitLoading()
		} else {
			return this.form()
		}
	}

	abstract form() : JSX.Element

	waitLoading() {
		return (
			<div className="wrap">
				<h1> Now loading... </h1>
			</div>
		)
	}

	submit(e) {
		e.preventDefault()

		var inputs = document.forms[this.formName].querySelectorAll("input, textarea, select")
		inputs = Array.prototype.slice.call(inputs)
		let data = {}
		inputs.forEach(v => {
			data[v.name] = v.value
		})

		this.props.submit(data)
	}

	protected update: boolean
	protected formName: string
}