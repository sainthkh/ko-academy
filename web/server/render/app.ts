import { renderer } from './renderer'
import { routes } from '../../app/routes'
import { createStore } from '../../app/store'

const AppRenderer = renderer('app', routes, createStore)

export default AppRenderer