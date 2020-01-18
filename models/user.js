'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Please provide a value for "firstName"'
					},
					notEmpty: {
						msg: 'Please provide a value for "firstName"'
					}
				}
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Please provide a value for "lastName"'
					},
					notEmpty: {
						msg: 'Please provide a value for "lastName"'
					}
				}
			},
			emailAddress: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Please provide an "email address"'
					},
					notEmpty: {
						msg: 'Please provide an "email address"'
					}
				}
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Please provide a "password"'
					},
					notEmpty: {
						msg: 'Please provide a "password"'
					}
				}
			}
		},
		{}
	);
	User.associate = models => {
		User.hasMany(models.Course, {
			as: 'user',
			foreignKey: { fieldName: 'userId', allowNull: false }
		});
	};
	return User;
};
