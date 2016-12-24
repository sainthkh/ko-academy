import {
	connect, User, LoginLog
} from './connect'

export function init(server) {
	connect()
}

export {
	User, 
	LoginLog,
}