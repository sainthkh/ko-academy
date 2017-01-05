import { connect } from 'react-redux'
import { LoginDialogContent, LoginDialogContentProps } from './LoginDialogContent'

const mapStateToProps = (state) => {
	return {
		waitingLogin: false,
		loginErrors: []
	} as LoginDialogContentProps
}

export default connect(mapStateToProps)(LoginDialogContent)