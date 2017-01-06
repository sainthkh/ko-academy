import { connect } from 'react-redux'

import { fetchAction, fetchProps } from '../../../common/lib/fetch'
import { Layout, LayoutProps } from './Layout'

const mapStateToProps = (state) => {
	let props:LayoutProps = fetchProps(state.email.broadcast) as LayoutProps
	return props
}

const mapDispatchToProps = dispatch => {
	return {
		submit: broadcast => {
			dispatch(fetchAction({
				admin: true,
				name: "broadcast",
				resource: "/email/broadcast",
				processResult: result => {
					let action = {} as any
					if (result.success) {
						// Set ID
					} 
					return action
				}
			})(broadcast))
		}
	}
}

export const BroadcastPage = connect(mapStateToProps, mapDispatchToProps)(Layout)