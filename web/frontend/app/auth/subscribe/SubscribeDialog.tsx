import { connect } from 'react-redux'
import { fetchSubscribeResult } from './action'
import { SubscribeDialogContent, SubscribeDialogContentProps } from './SubscribeDialogContent'
import {
	DIALOG_WAITING, DIALOG_DONE, DIALOG_ERROR
} from '../../common/Dialog'

import {
	INVALID_EMAIL,
} from './action'

const mapStateToProps = (state) => {
	let dialog = state.auth.get('dialog')
	let props = {
		waiting: dialog ? dialog.get('status') == DIALOG_WAITING : false,
		done: dialog ? dialog.get('status') == DIALOG_DONE : false,
	} as SubscribeDialogContentProps

	if (dialog && dialog.get('error')) {
		let error = dialog.get('error')
		props.error = {
			invalidEmail: error.indexOf(INVALID_EMAIL) >= 0,
		}
	} else {
		props.error = false
	}
	return props
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchSubscribe: user => {
			dispatch(fetchSubscribeResult(user))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeDialogContent)