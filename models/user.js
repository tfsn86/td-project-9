'use strict';

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			firstName: {
				type: DataTypes.STRING,
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
				type: DataTypes.STRING,
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
				type: DataTypes.STRING,
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
				type: DataTypes.STRING,
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
		{ sequelize }
	);

	User.associate = models => {
		models.User.hasMany(models.Course, {
			foreignKey: { fieldName: 'userId', allowNull: false }
		});
	};
	return User;
};
