import { connect } from 'react-redux'
import { fetchSignupResult } from './action'
import { SignupDialogContent, SignupDialogContentProps } from './SignupDialogContent'

const mapStateToProps = (state) => {
	return {
		waitingSignUp: state.signup.get('waitingSignUp'),
		signupErrors: state.signup.get('signupDialog').get('error')
	} as SignupDialogContentProps
}

export default connect(mapStateToProps)(SignupDialogContent)