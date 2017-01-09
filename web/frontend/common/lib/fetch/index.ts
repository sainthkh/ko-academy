export { fetchProps, defaultFetchProps } from './props'
export { submit, load, fetchPackage } from './action'
export { fetchReducer } from './reducer'

import { connect } from 'react-redux'
import { fetchProps, defaultFetchProps } from './props'
import { submit, load, fetchPackage } from './action'

export function FetchableComponent(options) {
	const mapStateToProps = state => 
		(options.id == state.fetch.id) ?
			fetchProps(state.fetch) : defaultFetchProps() 
	const { load, submit } = fetchPackage(options)

	const mapDispatchToProps = dispatch => {
		return {
			submit: course => dispatch(submit(course)),
			load: id => dispatch(load(id)),
		}
	}

	return connect(mapStateToProps, mapDispatchToProps)
}