import { Autoresponder, AutoresponderRecord } from '../common/data'
import { mailgun, sendmail } from '../common/email'

export function sendAutoresponder(slug, to, firstName) {
	Autoresponder.then(db => {
		db.findOne({ where: {slug: slug}})
		.then((result:AutoresponderRecord) => {
			let text = result.content.replace(/%\s*name\s*%/, firstName)
			sendmail(to, result.title, text)
		})
	})
}

export function addMember(slug, address, firstName) {
	var list = mailgun().lists(`${slug}@mg.wiseinit.com`)

	list.members().create({
		address,
		name: firstName,
	}, (err, data) => {
		console.log(data)
	})
}

export function validEmailFormat(email) {
	let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
	return emailFormat.test(email)
}