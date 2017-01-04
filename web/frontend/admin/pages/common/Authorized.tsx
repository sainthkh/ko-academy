'use strict';

import * as React from 'react';

class Authorized<P, S> extends React.Component<P, S> {
	constructor(props) {
		super(props)
	}

	static contextTypes = {
		router: React.PropTypes.func.isRequired
    }

	componentWillMount() {
		const token = localStorage.getItem('token')
		const time = localStorage.getItem('expiration')
		if (!token || new Date() > new Date(time)) {
			this.context.router.push('/admin')
		}
	}
}

export default Authorized