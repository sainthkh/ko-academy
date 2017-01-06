import { connect } from 'react-redux'

import { fetchAction, fetchProps2, submit, load } from '../../../common/lib/fetch'
import { Layout, LayoutProps } from './Layout'

const mapStateToProps = (state) => {
	let props:LayoutProps = fetchProps2(state.fetch) as LayoutProps
	return props
}

const mapDispatchToProps = dispatch => {
	return {
		submit: course => {
			dispatch(submit({
				admin: true,
				id: "course",
				resource: "/course",
			})(course))
		}
	}
}

export const CoursePage = connect(mapStateToProps, mapDispatchToProps)(Layout)