interface config {
	restServer: string
	apiKey: string
}

var config

if(process.env.NODE_ENV !== 'production') {
	config = {
		restServer: "https://api.academy.wiseinit.com:8509",
		apiKey: "api-key",
	}
} else {
	config = {
		restServer: "http://localhost:4000",
		apiKey: "api-key",
	}
}

export { config as config }