import { connect } from 'react-redux'
import { fetchSignupResult } from './action'
import { SignupDialogContent, SignupDialogContentProps } from './SignupDialogContent'
import {
	DIALOG_WAITING, DIALOG_DONE
} from '../../common/dialog'

const mapStateToProps = (state) => {
	let dialog = state.auth.get('dialog')
	return {
		waitingSignUp: dialog ? dialog.get('status') == DIALOG_WAITING : false,
		signupDone: dialog ? dialog.get('status') == DIALOG_DONE : false,
		signupErrors: dialog ? dialog.get('error') : false,
	} as SignupDialogContentProps
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchSignup: user => {
			dispatch(fetchSignupResult(user))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupDialogContent)