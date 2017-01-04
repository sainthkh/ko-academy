import { renderer } from './renderer'
import { routes } from '../../frontend/app/routes'
import { createStore } from '../../frontend/app/store'

const AppRenderer = renderer('app', routes, createStore, url => (true))

export default AppRenderer