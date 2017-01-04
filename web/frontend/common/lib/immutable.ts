export function immutable(state, ...value) {
	return Object.assign({}, state, ...value)
}