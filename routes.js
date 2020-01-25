'use strict';

const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('./models').User;
const Course = require('./models').Course;

const router = express.Router();
const { check, validationResult } = require('express-validator');

function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (err) {
			next(err);
		}
	};
}

const authenticateUser = asyncHandler(async (req, res, next) => {
	let message = null;
	const credentials = auth(req);
	if (credentials) {
		const user = await User.findOne({
			where: { emailAddress: credentials.name }
		});
		console.log(user);

		if (user) {
			const authenticated = bcryptjs.compareSync(
				credentials.pass,
				user.password
			);

			if (authenticated) {
				req.currentUser = user;
			} else {
				message = `Authentication failure for username: ${user.emailAddress}`;
			}
		} else {
			message = `User not found for username: ${credentials.emailAddress}`;
		}
	} else {
		message = 'Authenticate header not found';
	}

	// If user authentication failed...
	if (message) {
		console.warn(message);

		res.status(401).json({ message: 'Access Denied' });
	} else {
		next();
	}
});

/**User routes */
// Route that returns the current authenticated user.
router.get('/users', authenticateUser, (req, res) => {
	const user = req.currentUser;

	res
		.status(200)
		.json({
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.emailAddress
		})
		.end();
});

// Route that creates a user
router.post(
	'/users',
	asyncHandler(async (req, res) => {})
);

/**Course routes */
// Returns a list of courses (including the user that owns each course)
router.get(
	'/courses',
	asyncHandler(async (req, res) => {
		const courses = await Course.findAll({
			attributes: {
				exclude: ['createdAt', 'updatedAt']
			},
			include: {
				model: User,
				attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
			}
		});
		res.status(200).json(courses);
	})
);

// Returns a course (including the user that owns the course) for the provided course ID
router.get(
	'/courses/:id',
	asyncHandler(async (req, res) => {
		const course = await Course.findByPk(req.params.id, {
			attributes: {
				exclude: ['createdAt', 'updatedAt']
			},
			include: {
				model: User,
				attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
			}
		});
		res.status(200).json(course);
	})
);

// Creates a course, sets the Location header to the URI for the course, and returns no content
router.post(
	'courses/:id',
	asyncHandler(async (req, res) => {})
);

// Updates a course and returns no content
router.put(
	'/courses/:id',
	asyncHandler(async (req, res) => {})
);

// Deletes a course and returns no content
router.delete(
	'/courses/:id',
	asyncHandler(async (req, res) => {})
);

module.exports = router;
