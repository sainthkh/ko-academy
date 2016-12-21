import * as login from './login'
import * as signup from './signup'

export function init(server) {
	login.init(server)
	signup.init(server)
}