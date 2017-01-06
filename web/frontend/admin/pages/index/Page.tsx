import { connect } from 'react-redux'

import { fetchAction, fetchProps } from '../../../common/lib/fetch'
import { Layout } from './Layout'

const mapStateToProps = (state) => {
	return fetchProps(state.auth)
}

const mapDispatchToProps = dispatch => {
	return {
		submit: user => {
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