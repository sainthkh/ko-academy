import { upsert } from '../common/data'

interface RequestSetting {
	router: any
	Model: any
	path: string
	onPostSuccess?: (any) => any
	onGetSuccess?: (any) => any
}

export function handleRequest(setting) {
	let { router, Model, path, onPostSuccess, onGetSuccess } = setting
	onPostSuccess = onPostSuccess ? onPostSuccess : () => ({})
	onGetSuccess = onGetSuccess ? onGetSuccess : () => ({})
	
	router.post(path, (req, res) => {
		Model.then(db => {
			return upsert(db, req.body)
		}).then((result) => {
			res.json(Object.assign({
				success: true,
			}, onPostSuccess(result)))
		})
	})

	router.get(path, (req, res) => {
		const ID = req.query.id
		Model.then(db => {
			return db.find({ where: { ID }})
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