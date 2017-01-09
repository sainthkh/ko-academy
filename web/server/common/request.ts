import { upsert } from '../common/data'

interface RequestSetting {
	router: any
	Model: any
	path: string
	arg?: string
	onPostSuccess?: (any) => any
	onGetSuccess?: (any) => any
}

export function handleRequest(setting:RequestSetting) {
	handlePostRequest(setting)
	handleGetRequest(setting)
}

export function handlePostRequest(setting:RequestSetting) {
	let { router, Model, path, arg, onPostSuccess } = setting
	onPostSuccess = onPostSuccess ? onPostSuccess : () => ({})

	router.post(path, (req, res) => {
		Model.then(db => {
			return upsert(db, req.body)
		}).then((result) => {
			res.json(Object.assign({
				success: true,
			}, onPostSuccess(result)))
		})
	})
}

export function handleGetRequest(setting:RequestSetting) {
	let { router, Model, path, arg, onGetSuccess } = setting
	arg = arg ? arg : "ID"
	onGetSuccess = onGetSuccess ? onGetSuccess : () => ({})
	
	router.get(path, (req, res) => {
		let where = {}
		where[arg] = req.query[arg.toLowerCase()]
		Model.then(db => {
			return db.find({ where })
		})
		.then((result:any) => {
			var data = result.dataValues
			delete data.createdAt
			delete data.updatedAt
			res.json(Object.assign({
				success: true,
				content: data,
			}, onGetSuccess(result)))
		})
	})
}