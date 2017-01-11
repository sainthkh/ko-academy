import * as React from 'react';
import { connect } from 'react-redux'
import { fetchProps, defaultFetchProps, FetchProps } from './props'
import { submit, load, fetchPackage } from './action'

export function FetchableComponent(options) {
	let moreProps = options.moreProps ? options.moreProps : (p, s) => p
	const mapStateToProps = state => {
		let props = (options.id == state.fetch.id) ?
			fetchProps(state.fetch) : defaultFetchProps() 
		return moreProps(props, state)
	}
		
	
	const { load, submit } = fetchPackage(options)
	const mapDispatchToProps = dispatch => {
		return {
			submit: course => dispatch(submit(course)),
			load: id => dispatch(load(id)),
		}
	}

	return connect(mapStateToProps, mapDispatchToProps)
}

export abstract class FetchableLayout<P extends FetchProps, S> extends React.Component<P, S> {
	constructor(props, members:string[] = []) {
		super(props)
		
		let funcs = ["submit", "main"]
		funcs.push(...funcs)
		let self = this
		funcs.forEach(f => {
			self[f] = self[f].bind(self)
		})

		this.lastInput = {}
	}

	protected submit(e) {
		e.preventDefault()

		var inputs = document.forms[this.formName].querySelectorAll("input, textarea, select")
		inputs = Array.prototype.slice.call(inputs)
		let data = {}
		inputs.forEach(v => {
			data[v.name] = v.value
		})
		this.lastInput = data

		this.props.submit(data)
	}

	protected formName: string
	protected lastInput: any

	protected abstract main()
}