import * as restify from 'restify'

var client
export function connectAuth():Promise<restify.Client> {
	return new Promise((resolve, reject) => {
		try {
			if (!client) {
				client = restify.createJsonClient({
					url: "http://localhost:5000",
					version: "*"
				})
			}
			resolve(client)
		} catch (e) {
			reject(e)
		}
	})
}