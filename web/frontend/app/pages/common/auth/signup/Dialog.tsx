import { connect } from 'react-redux'
import { fetchAction, fetchProps } from '../../../../../common/lib/fetch'
import { Layout, LayoutProps } from './Layout'

export const LONG_USERNAME = "LONG_USERNAME"
export const INVALID_EMAIL = "INVALID_EMAIL"
export const DUPLICATE_EMAIL = "DUPLICATE_EMAIL"
export const WEAK_PASSWORD = "WEAK_PASSWORD"

const mapStateToProps = (state) => {
	let props:LayoutProps = fetchProps(state.auth.signup) as LayoutProps
	if (props.failed) {
		let error = state.auth.signup.error
		props.error = {
			longName: error.indexOf(LONG_USERNAME) >= 0,
			duplicateEmail: error.indexOf(DUPLICATE_EMAIL) >=0,
			invalidEmail: error.indexOf(INVALID_EMAIL) >= 0,
			weakPassword: error.indexOf(WEAK_PASSWORD) >= 0,
		}
		props.feedback = state.auth.signup.feedback
	} else {
		props.error = {}
		props.feedback = {}
	}
	return props
}

const mapDispatchToProps = (dispatch) => {
	return {
		submit: user => {
			dispatch(fetchAction({
				name: "signup",
				resource: "/signup",
				processResult: result => {
					let action = {} as any
					if (result.success) {
						action.username = result.username
						action.token = result.token
						action.accessLevel = result.accessLevel
					} else {
						action.error = result.error
						action.feedback = result.feedback
					}
					return action 
				}
			})(user))
		}
	}
}

export const SignupDialog = connect(mapStateToProps, mapDispatchToProps)(Layout)