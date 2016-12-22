import { connect } from 'react-redux'
import { fetchSignupResult } from './action'
import { SignupDialogContent, SignupDialogContentProps } from './SignupDialogContent'

const mapStateToProps = (state) => {
	return {
		waitingSignUp: state.signup.get('waitingSignUp'),
		signupErrors: [/* dummy */] //state.signup.get('signupDialog').get('error')
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