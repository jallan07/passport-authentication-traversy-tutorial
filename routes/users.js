const express = require("express");
const router = express.Router();
// require the user model
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// login page
router.get("/login", (req, res) => res.render("login"));

// register page
router.get("/register", (req, res) => res.render("register"));

// register handler
router.post("/register", (req, res) => {
	const { name, email, password, password2 } = req.body;

	// begin validation checks
	let errors = [];
	// check required fields
	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please fill in all fields" });
	}
	// check passwords match
	if (password !== password2) {
		errors.push({ msg: "Passwords do not match." });
	}
	// check password is 6 chars long
	if (password.length < 6) {
		errors.push({ msg: "Password must be at least 6 characters." });
	}

	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			password,
			password2,
		});
	} else {
		// validation passed
		User.findOne({ email: email }).then((user) => {
			if (user) {
				// user exists
				errors.push({ msg: "Email is already registered." });
				res.render("register", {
					errors,
					name,
					email,
					password,
					password2,
				});
			} else {
				const newUser = new User({
					name,
					email,
					password,
				});
				// hash password
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						// set pw to hashed
						newUser.password = hash;
						// save the user
						newUser
							.save()
							.then((user) => {
								req.flash(
									"success_msg",
									"You are now registered, and can login!"
								);
								res.redirect("/users/login");
							})
							.catch((err) => console.log(err));
					});
				});
			}
		});
	}
});

// login handler
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
});

//logout handler
router.get("/logout", (req, res) => {
	req.logOut();
	req.flash("Success_msg", "You are logged out.");
	res.redirect("/users/login");
});

module.exports = router;
