import { connect } from 'react-redux'

import { fetchAction, fetchProps } from '../../../../../common/lib/fetch'
import { Layout, LayoutProps } from './Layout'

export const INVALID_EMAIL = "INVALID_EMAIL"

const mapStateToProps = state => {
	let props:LayoutProps = fetchProps(state.auth.subscribe) as LayoutProps
	if (props.failed) {
		let error = state.auth.subscribe.error
		props.error = {
			invalidEmail: error.indexOf(INVALID_EMAIL) >= 0,
		}
	} else {
		props.error = {}
	}
	return props
}

const mapDispatchToProps = dispatch => {
	return {
		fetch: user => {
			dispatch(fetchAction({
				name: "subscribe",
				resource: "/subscribe",
				processResult: result => {
					let action = {} as any
					if (!result.success) {
						action.error = [INVALID_EMAIL]
					}
					return action
				}
			})(user))
		}
	}
}

export const SubscribeDialog = connect(mapStateToProps, mapDispatchToProps)(Layout)