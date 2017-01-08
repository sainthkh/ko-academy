import { connect } from 'react-redux'

import { fetchProps, submit } from '../../../../common/lib/fetch'

export function ReduxDialog(options) {
	const mapStateToProps = state => fetchProps(state.fetch)

	const mapDispatchToProps = dispatch => {
		return {
			submit: user => dispatch(submit(options)(user))
		}
	}
	
	return connect(mapStateToProps, mapDispatchToProps)
}