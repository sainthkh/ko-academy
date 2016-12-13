export const OPEN_DIALOG = "OPEN_DIALOG"
export const CLOSE_DIALOG = "CLOSE_DIALOG"

export function toggleDialog(dialog) {
	if(dialog.open) {
		return closeDialog(dialog)
	} else {
		return openDialog(dialog)
	}
}

export function openDialog(dialog) {
	return {
		type: OPEN_DIALOG
	}
}

export function closeDialog(dialog) {
	return {
		type: CLOSE_DIALOG
	}
}