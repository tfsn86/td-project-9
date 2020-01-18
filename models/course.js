'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const Course = sequelize.define(
		'Course',
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			userId: DataTypes.INTEGER, // Id from users table.
			title: {
				type: Sequelize.STRING,
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
				type: Sequelize.TEXT,
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
				type: Sequelize.STRING,
				allowNull: true
			},
			materialsNeeded: {
				type: Sequelize.STRING,
				allowNull: true
			}
		},
		{}
	);
	Course.associate = models => {
		Course.belongsTo(models.User, {
			as: 'user',
			foreignKey: { fieldName: 'userId', allowNull: false }
		});
	};
	return Course;
};
