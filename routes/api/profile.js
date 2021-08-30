const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const JwtAuth = passport.authenticate("jwt", { session: false });

//Load Profile Model
const Profile = require("../../models/Profile");

//Load User Model
const user = require("../../models/User");

const router = express.Router();

//@route GET api/profile/test
//@desc Tests profile route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profile works" });
});

//@route GET api/profile
//@desc Get current user profile
//@access private
router.get("/", JwtAuth, (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for the user";
        return res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

//@route POST api/profile
//@desc create user profile
//@access private
router.post("/", JwtAuth, (req, res) => {
  //get fields

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  //Skills split into array
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }

  //Socials
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id }).then((profile) => {
    if (profile) {
      //Update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then((profile) => res.json(profile));
    } else {
      //create

      //handle exist
      Profile.findOne({ handle: profileFields.handle }).then((profile) => {
        if (profile) {
          errors.handle = "That handle already exist";
          res.status(400).json(errors);
        }
        //Save profile
        new Profile(profileFields).save().then((profile) => res.json(profile));
      });
    }
  });
});

module.exports = router;
