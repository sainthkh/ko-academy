import * as Sequelize from "sequelize"
import * as path from 'path'

var seq = new Sequelize("db", "", "", {
	dialect: "sqlite",
	storage: path.join(__dirname, "../..", "db.sqlite3")
});

var Subscriber = seq.define('Subscriber', {
	ID: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true}, 
	email: { type: Sequelize.TEXT, unique: true},
	first_name: Sequelize.TEXT,
}).sync()

export interface BroadcastRecord {
	ID: number
	to: string
	time: any
	title: string
	content: string
}

var Broadcast = seq.define('Broadcast', {
	ID: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true}, 
	to: Sequelize.TEXT,
	time: Sequelize.DATE,
	title: Sequelize.TEXT,
	content: Sequelize.TEXT,
}).sync()

export interface AutoresponderRecord {
	slug: string
	listName: string
	address: string
	title: string
	content: string
}

var Autoresponder = seq.define('Autoresponder', {
	slug: { type: Sequelize.TEXT, primaryKey: true }, 
	listName: Sequelize.TEXT,
	address: Sequelize.TEXT,
	title: Sequelize.TEXT,
	content: Sequelize.TEXT,
}).sync()

var User = seq.define('User', {
	ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	username: Sequelize.STRING(50),
	email: { type: Sequelize.STRING(255), unique: true },
	password: Sequelize.BLOB,
	accessLevel: Sequelize.STRING,
	signupDate: Sequelize.DATE,
	lastLogin: Sequelize.DATE,
}).sync()

var LoginLog = seq.define('LoginLog', {
	userID: Sequelize.STRING,
	loginTime: Sequelize.DATE,
}).sync()

export {
	Subscriber,
	Broadcast,
	Autoresponder,
	User,
	LoginLog,
}
