import { upsert } from '../common/data'

interface RequestSetting {
	router: any
	Model: any
	path: string
	onPostSuccess?: (any) => any
	onGetSuccess?: (any) => any
	modifyContent?: (any) => any
}

export function handleRequest(setting:RequestSetting) {
	handlePostRequest(setting)
	handleGetRequest(setting)
}

export function handlePostRequest(setting:RequestSetting) {
	let { router, Model, path, onPostSuccess } = setting
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
	let { router, Model, path, onGetSuccess, modifyContent } = setting
	onGetSuccess = onGetSuccess ? onGetSuccess : () => ({})
	modifyContent = modifyContent ? modifyContent : c => {
		return new Promise((resolve, reject) => {
			resolve(c)
		})
	}
	
	router.get(path, (req, res) => {
		Model.then(db => {
			return db.find({ where: req.query })
		})
		.then((result:any) => {
			var data = result.dataValues
			modifyContent(data)
			.then(content => {
				delete content.createdAt
				delete content.updatedAt
				res.json(Object.assign({
					success: true,
					content,
				}, onGetSuccess(result)))
			})
		})
	})
}