'use strict';

const express = require('express');
const router = express.Router();

const User = require('./models').User;
const Course = require('./models').Course;

const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

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

		res.status(401).json({ message });
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
	[
		check('emailAddress')
			.isEmail()
			.withMessage('Please provide a valid email address')
	],
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map(error => error.msg);
			res.status(400).json({ errors: errorMessages });
		} else {
			const user = req.body;

			if (user.password) {
				user.password = bcryptjs.hashSync(user.password);
			}

			await User.create(req.body);
			res
				.status(201)
				.location('/')
				.end();
		}
	})
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
	'/courses',
	authenticateUser,
	asyncHandler(async (req, res) => {
		const course = await Course.create(req.body);
		res
			.status(201)
			.location('/courses/' + course.id)
			.end();
	})
);

// Updates a course and returns no content
router.put(
	'/courses/:id',
	[
		check('title').exists({
			checkFalsy: true,
			checkNull: true
		}),
		check('description').exists({
			checkFalsy: true,
			checkNull: true
		}),
		check('userId').exists({
			checkFalsy: true,
			checkNull: true
		})
	],
	authenticateUser,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map(error => error.msg);
			res.status(400).json({ errors: errorMessages });
		} else {
			const authUser = req.currentUser;
			const course = await Course.findByPk(req.params.id);

			if (authUser.id === course.userId) {
				await course.update(req.body);
				res.status(204).end();
			} else {
				res
					.status(403)
					.json({ message: 'Changes can only be made to your own courses' });
			}
		}
	})
);

// Deletes a course and returns no content
router.delete(
	'/courses/:id',
	authenticateUser,
	asyncHandler(async (req, res) => {
		const authUser = req.currentUser;
		const course = await Course.findByPk(req.params.id);
		if (course) {
			if (authUser.id === course.userId) {
				await course.destroy();
				res.status(204).end();
			} else {
				res
					.status(403)
					.json({ message: 'You can only delete your own courses' });
			}
		} else {
			next();
		}
	})
);

module.exports = router;
