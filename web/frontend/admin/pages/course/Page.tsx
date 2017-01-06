import { connect } from 'react-redux'

import { fetchAction, fetchProps } from '../../../common/lib/fetch'
import { Layout, LayoutProps } from './Layout'

const mapStateToProps = (state) => {
	let props:LayoutProps = fetchProps(state.course) as LayoutProps
	return props
}

const mapDispatchToProps = dispatch => {
	return {
		submit: course => {
			dispatch(fetchAction({
				admin: true,
				name: "save-course",
				resource: "/course",
			})(course))
		}
	}
}

export const CoursePage = connect(mapStateToProps, mapDispatchToProps)(Layout)