import { connect } from 'react-redux'

import {
	REQUEST_FETCH, FAILED_FETCH, SUCCEEDED_FETCH, fetchAction
} from '../../../common/lib/fetch-action'

import { Layout, LayoutProps } from './Layout'

const mapStateToProps = (state) => {
	return {
		waiting: state.auth.stage == REQUEST_FETCH,
		failed: state.auth.stage == FAILED_FETCH,
		succeeded: state.auth.stage == SUCCEEDED_FETCH,
	} as LayoutProps
}

const mapDispatchToProps = dispatch => {
	return {
		fetch: user => {
			dispatch(fetchAction({
				admin: true,
				name: "login",
				resource: "/auth/login",
				processResult: result => {
					let action = {} as any
					if (result.success) {
						action.token = result.token
						localStorage.setItem("token", action.token)
						let expiration = new Date(new Date().getTime() + 30 * 60000/* 30 minutes*/)
						localStorage.setItem("expiration", expiration.toISOString())
					} 
					return action
				}
			})(user))
		}
	}
}

export const IndexPage = connect(mapStateToProps, mapDispatchToProps)(Layout)