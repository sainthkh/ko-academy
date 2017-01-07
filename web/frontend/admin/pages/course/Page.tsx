import { connect } from 'react-redux'

import { fetchProps2, fetchPackage } from '../../../common/lib/fetch'
import { Layout, LayoutProps } from './Layout'

const mapStateToProps = state => fetchProps2(state.fetch)

const { load, submit } = fetchPackage({
	admin: true,
	id: "course",
	resource: "/course",
})

const mapDispatchToProps = dispatch => {
	return {
		submit: course => dispatch(submit(course)),
		load: slug => dispatch(load(slug)),
	}
}

export const CoursePage = connect(mapStateToProps, mapDispatchToProps)(Layout)