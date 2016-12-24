import * as Sequelize from 'sequelize'
import * as path from 'path'

var sequlz;
export function connectDB() {
	if (!sequlz) {
		sequlz = new Sequelize("wa-content", "", "", {
			dialect: "sqlite",
			storage: path.join(__dirname, "../..", "db.sqlite"),
		});
	}
}