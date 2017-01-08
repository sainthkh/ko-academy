import { connect } from 'react-redux'

import { fetchAction, fetchProps } from '../../../common/lib/fetch'
import { setToken } from '../../../common/lib/token'
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
						setToken(result.token)
					} 
					return action
				}
			})(user))
		}
	}
}

export const IndexPage = connect(mapStateToProps, mapDispatchToProps)(Layout)