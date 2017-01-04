import * as marked from 'marked'
marked.setOptions({
	breaks: true
})

import * as fs from 'fs'
import * as path from 'path'

var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')).toString())

export function sendmail(to, subject, content) {
	var data = {
		from: config.from,
		to: to,
		subject: subject,
		text: content,
		html: buildEmail(content), 
		"h:reply-To": config.reply,
	}

	mailgun().messages().send(data, (error, body) => {
		if(error) {
			console.log(error)
			throw error
		}
	})
}

var _mailgun;
function mailgun() {
	if(!_mailgun) {
		_mailgun = require('mailgun-js')({
			apiKey: config.apiKey,
			domain: config.domain,
		})
	}
	return _mailgun
}

function buildEmail(content) {
	return [
		`<div style="color:#222222;font-family:'Helvetica','Arial',sans-serif;font-size:14px;line-height:1.4;padding:25px;width:550px">`,
		marked(content),
		`</div>`,
		`<div style="border-top-color:#ddd;border-top-style:solid;border-top-width:1px;color:#888;font-family:'Helvetica','Arial',sans-serif;font-size:12px;line-height:1.4;padding:25px;width:550px">`,
		`To make sure you keep getting these emails, please add academy@wiseinit.com to your address book or whitelist us.<br>`,
		`Want out of the this email list? <a href="%mailing_list_unsubscribe_url%">Unsubscribe this list</a><br>`,		`Want to unsubscribe every email? <a href="%unsubscribe_url%">Click here</a><br>`,
		`Postal Address: ${config.postalAddress}`,
		`</div>`
	].join(``)
}