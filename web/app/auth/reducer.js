export default function username(state = "", action) {
	switch(action.type) {
		case "SUCCESS_LOGIN":
			return action.username
		default:
			return state
	}
} 