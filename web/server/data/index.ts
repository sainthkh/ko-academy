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

export {
	Subscriber,
}