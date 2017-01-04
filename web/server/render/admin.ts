import { renderer } from './renderer'
import { routes } from '../../frontend/admin/routes'
import { createStore } from '../../frontend/admin/store'

const AdminRenderer = renderer('admin', routes, createStore, url => {
	return url == "/admin"
})

export default AdminRenderer