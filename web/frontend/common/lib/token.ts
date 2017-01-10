export function isTokenValid() {
	if(typeof localStorage === "undefined") {
		return false
	}
	const token = localStorage.getItem('token')
	const time = localStorage.getItem('expiration')
	return token && new Date() < new Date(time)
}

export function getToken() {
	return isTokenValid() ? localStorage.getItem('token') : ''
}

export function setToken(token) {
	localStorage.setItem("token", token)
	let expiration = new Date(new Date().getTime() + 3 * 24 * 60 * 60000/* 3 days*/)
	localStorage.setItem("expiration", expiration.toISOString())
}

export function removeToken() {
	localStorage.removeItem("token")
	localStorage.removeItem("expiration")
}