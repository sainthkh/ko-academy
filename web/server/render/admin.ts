import { renderer } from './renderer'
import { routes } from '../../admin/routes'
import { createStore } from '../../admin/store'

const AdminRenderer = renderer('admin', routes, createStore)

export default AdminRenderer