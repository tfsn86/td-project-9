'use strict';

module.exports = (sequelize, DataTypes) => {
	const Course = sequelize.define(
		'Course',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			userId: DataTypes.INTEGER, // Id from users table.
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Please provide a "course title"'
					},
					notEmpty: {
						msg: 'Please provide a "course"'
					}
				}
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Please provide a "course description"'
					},
					notEmpty: {
						msg: 'Please provide a "course description"'
					}
				}
			},
			estimatedTime: {
				type: DataTypes.STRING,
				allowNull: true
			},
			materialsNeeded: {
				type: DataTypes.STRING,
				allowNull: true
			}
		},
		{ sequelize }
	);

	Course.associate = models => {
		models.Course.belongsTo(models.User, {
			foreignKey: { fieldName: 'userId', allowNull: false }
		});
	};
	return Course;
};
