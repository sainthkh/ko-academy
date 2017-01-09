import { connect } from 'react-redux'

import { fetchProps, defaultFetchProps, submit } from '../../../../common/lib/fetch'

export function ReduxDialog(options) {
	const mapStateToProps = state => 
		(options.id == state.fetch.id) ?
			fetchProps(state.fetch) : defaultFetchProps()

	const mapDispatchToProps = dispatch => {
		return {
			submit: user => dispatch(submit(options)(user))
		}
	}
	
	return connect(mapStateToProps, mapDispatchToProps)
}