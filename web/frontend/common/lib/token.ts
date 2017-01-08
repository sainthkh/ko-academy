export function isTokenValid() {
	const token = localStorage.getItem('token')
	const time = localStorage.getItem('expiration')
	return token && new Date() < new Date(time)
}

export function getToken() {
	return isTokenValid() ? localStorage.getItem('token') : null
}

export function setToken(token) {
	localStorage.setItem("token", token)
	let expiration = new Date(new Date().getTime() + 30 * 60000/* 30 minutes*/)
	localStorage.setItem("expiration", expiration.toISOString())
}