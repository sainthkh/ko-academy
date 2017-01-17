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
	title: string
	content: string
}

var Broadcast = seq.define('Broadcast', {
	ID: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true}, 
	list: Sequelize.TEXT,
	title: Sequelize.TEXT,
	content: Sequelize.TEXT,
}).sync()

export interface AutoresponderRecord {
	ID: number
	slug: string
	listName: string
	title: string
	content: string
}

var Autoresponder = seq.define('Autoresponder', {
	ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	slug: { type: Sequelize.TEXT, unique: true }, 
	listName: Sequelize.TEXT,
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
	stripeID: Sequelize.TEXT,
}).sync()

export interface CourseRecord {
	ID: number
	slug: string
	title: string
	description: string
	content: string
}

var Course = seq.define('Course', {
	ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	slug: { type: Sequelize.TEXT, unique: true }, 
	title: Sequelize.TEXT,
	description: Sequelize.TEXT,
	content: Sequelize.TEXT,
}).sync()

var Lecture = seq.define('Lecture', {
	ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	slug: Sequelize.TEXT,
	courseSlug: Sequelize.TEXT,
	title: Sequelize.TEXT,
	video: Sequelize.TEXT,
	accessLevel: Sequelize.TEXT,
	downloads: Sequelize.TEXT,
	script: Sequelize.TEXT,
	quizSlug: Sequelize.TEXT,
	nextSlug: Sequelize.TEXT,
}).sync()

var Quiz = seq.define('Quiz', {
	ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	slug: Sequelize.TEXT,
	courseSlug: Sequelize.TEXT,
	title: Sequelize.TEXT,
	questionIDs: Sequelize.TEXT,
	accessLevel: Sequelize.TEXT,
	nextSlug: Sequelize.TEXT,
}).sync()

var Question = seq.define('Question', {
	ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	question: Sequelize.TEXT,
	answerChoices: Sequelize.TEXT,
	correctMessages: Sequelize.TEXT,
	wrongMessages: Sequelize.TEXT,
}).sync()

var QuestionLog = seq.define('QuestionLog', {
	userID: Sequelize.INTEGER,
	questionID: Sequelize.INTEGER,
	answerChoice: Sequelize.INTEGER,
	date: Sequelize.DATE,
}).sync()

export {
	Subscriber,
	Broadcast,
	Autoresponder,
	User,
	Course,
	Lecture,
	Quiz,
	Question,
	QuestionLog,
}

export function upsert(db, model) {
	return model.ID ? db.update(model, { where: {ID: model.ID}}) : db.create(model)
}