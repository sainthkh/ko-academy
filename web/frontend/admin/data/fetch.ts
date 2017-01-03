'use strict'
import * as lib from '../../common/lib/fetch'

export function fetch (resource: string, username: string, opts:lib.fetchOptions): Promise<any> {
	return lib.fetch('/admin/api', resource, username, opts)
}

export {
	FETCH_SUCCESS, SERVER_DOWN, PAGE_NOT_FOUND, INTERNAL_SERVER_ERROR, OTHER_ERROR,
	serverDown, otherError, pageNotFound, internalServerError,
} from '../../common/lib/fetch'