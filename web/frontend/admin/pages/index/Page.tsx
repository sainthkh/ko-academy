import { connect } from 'react-redux'

import { fetchProps2, submit } from '../../../common/lib/fetch'
import { setToken } from '../../../common/lib/token'
import { Layout } from './Layout'

const mapStateToProps = state => fetchProps2(state.fetch)

const mapDispatchToProps = dispatch => {
	return {
		submit: user => {
			dispatch(submit({
				admin: true,
				id: "login",
				resource: "/auth/login",
				processResult: result => {
					if (result.success) {
						setToken(result.token)
					} 
				}
			})(user))
		}
	}
}

export const IndexPage = connect(mapStateToProps, mapDispatchToProps)(Layout)