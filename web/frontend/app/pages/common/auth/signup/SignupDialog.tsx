import { connect } from 'react-redux'
import { fetchSignupResult } from './action'
import { SignupDialogContent, SignupDialogContentProps } from './SignupDialogContent'
import {
	DIALOG_WAITING, DIALOG_DONE, DIALOG_ERROR
} from '../../Dialog'

import {
	LONG_USERNAME, DUPLICATE_EMAIL, INVALID_EMAIL, SHORT_PASSWORD, COMMON_PASSWORD
} from './action'

const mapStateToProps = (state) => {
	let dialog = state.auth.get('dialog')
	let props = {
		waiting: dialog ? dialog.get('status') == DIALOG_WAITING : false,
		done: dialog ? dialog.get('status') == DIALOG_DONE : false,
	} as SignupDialogContentProps

	if (dialog && dialog.get('error')) {
		let error = dialog.get('error')
		props.error = {
			longName: error.indexOf(LONG_USERNAME) >= 0,
			duplicateEmail: error.indexOf(DUPLICATE_EMAIL) >=0,
			invalidEmail: error.indexOf(INVALID_EMAIL) >= 0,
			shortPassword: error.indexOf(SHORT_PASSWORD) >= 0,
			commonPassword: error.indexOf(COMMON_PASSWORD) >= 0,
		}
	} else {
		props.error = false
	}
	return props
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchSignup: user => {
			dispatch(fetchSignupResult(user))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupDialogContent)