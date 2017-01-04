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

export {
	Subscriber,
	Broadcast,
}