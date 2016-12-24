import * as Sequelize from 'sequelize'
import * as path from 'path'

export function connect() {
	var sequlz = new Sequelize("wa-auth", "", "", {
		dialect: "sqlite",
		storage: path.join(__dirname, "../..", "db.sqlite"),
	});

	connectUserDB(sequlz)
	connectLoginLogDB(sequlz)
}

export function User() {
	return userDB.sync();
}

var userDB;
function connectUserDB(sequlz) {
	userDB = sequlz.define('User', {
		ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		username: Sequelize.STRING(50),
		email: { type: Sequelize.STRING(255), unique: true },
		password: Sequelize.BLOB,
		accessLevel: Sequelize.STRING,
		signupDate: Sequelize.DATE,
		lastLogin: Sequelize.DATE,
	})
	userDB.sync()
}

export function LoginLog() {
	return loginLogDB;
}

var loginLogDB;
function connectLoginLogDB(sequlz) {
	loginLogDB = sequlz.define('LoginLog', {
		userID: Sequelize.STRING,
		loginTime: Sequelize.DATE,
	})

	loginLogDB.sync()
}