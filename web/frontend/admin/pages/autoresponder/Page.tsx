import { connect } from 'react-redux'

import { fetchAction, fetchProps } from '../../../common/lib/fetch'
import { Layout, LayoutProps } from './Layout'

const mapStateToProps = (state) => {
	let props:LayoutProps = fetchProps(state.email.autoresponder) as LayoutProps
	return props
}

const mapDispatchToProps = dispatch => {
	return {
		submit: autoresponder => {
			dispatch(fetchAction({
				admin: true,
				name: "autoresponder",
				resource: "/email/autoresponder",
				processResult: result => {
					let action = {} as any
					if (result.success) {
						// Set slug
					} 
					return action
				}
			})(autoresponder))
		}
	}
}

export const AutoresponderPage = connect(mapStateToProps, mapDispatchToProps)(Layout)