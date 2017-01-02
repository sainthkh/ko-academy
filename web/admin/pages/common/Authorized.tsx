'use strict';

import * as React from 'react';

class Authorized<P, S> extends React.Component<P, S> {
	componentWillMount() {
		const { router } = this.context

		const user = JSON.parse(localStorage.getItem('user'))
		if (!user) {
			router.push('/admin')
		}
	}
}

export default Authorized