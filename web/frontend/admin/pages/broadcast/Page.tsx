import { connect } from 'react-redux'

import { fetchProps2, fetchPackage } from '../../../common/lib/fetch'
import { Layout, LayoutProps } from './Layout'

const mapStateToProps = state => fetchProps2(state.fetch) as LayoutProps

const { load, submit } = fetchPackage({
	admin: true,
	id: "broadcast",
	resource: "/email/broadcast",
})

const mapDispatchToProps = dispatch => {
	return {
		submit: broadcast => dispatch(submit(broadcast)),
		load: id => dispatch(load(id)),
	}
}

export const BroadcastPage = connect(mapStateToProps, mapDispatchToProps)(Layout)