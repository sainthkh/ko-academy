'use strict';

import * as React from 'react';

import { isTokenValid } from '../../../common/lib/token'

class Authorized<P, S> extends React.Component<P, S> {
	constructor(props) {
		super(props)
	}

	static contextTypes = {
		router: React.PropTypes.func.isRequired
    }

	componentWillMount() {
		if (!isTokenValid()) {
			this.context.router.push('/admin')
		}
	}
}

export default Authorized