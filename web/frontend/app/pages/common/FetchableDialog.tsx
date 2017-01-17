'use strict'
import * as React from 'react'

import { FetchProps } from '../../../common/lib/fetch/props'
import { FetchableLayout } from '../../../common/lib/fetch'

export abstract class DialogLayout<P extends FetchProps, S> extends FetchableLayout<P, S> {
	constructor(props) {
		super(props, ["loading", "done"])
	}

	render() {
		if(!this.props.waiting) {
			if(!this.props.succeeded) {
				return this.main()
			} else {
				return this.done()
			}
		} else {
			return this.loading()
		}
	}

	protected abstract loading()
	protected abstract done()
}