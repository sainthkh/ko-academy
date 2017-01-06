import { connect } from 'react-redux'

import { fetchAction, fetchProps } from '../../../common/lib/fetch'
import { Layout, LayoutProps } from './Layout'

const mapStateToProps = (state) => {
	let props:LayoutProps = fetchProps(state.course) as LayoutProps
	return props
}

const mapDispatchToProps = dispatch => {
	return {
		fetch: course => {
			dispatch(fetchAction({
				admin: true,
				name: "save-course",
				resource: "/course",
				processResult: result => {
					let action = {} as any
					return action
				}
			})(course))
		}
	}
}

export const CoursePage = connect(mapStateToProps, mapDispatchToProps)(Layout)