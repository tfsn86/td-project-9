'use strict';

const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

const router = express.Router();

/**User routes */
// Route that returns the current authenticated user.
router.get('/users', (req, res) => {
	res.json({
		test: 'test'
	});
});

// Route that creates a user
router.post('/users', (req, res) => {});

/**Course routes */
// Returns a list of courses (including the user that owns each course)
router.get('/courses', (req, res) => {});

// Returns a course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', (req, res) => {});

// Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('courses/:id', (req, res) => {});

// Updates a course and returns no content
router.put('/courses/:id', (req, res) => {});

// Deletes a course and returns no content
router.delete('/courses/:id', (req, res) => {});

module.exports = router;
