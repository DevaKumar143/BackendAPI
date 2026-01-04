const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/create",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // let user = await User.findOne({ email: profile.emails[0].value });
        const email = profile.emails?.[0]?.value;
        console.log("Email", email);
        if (!email) return done(new Error("Email not found in Google profile"));

        let user = await User.findOne({ email });
        console.log("Full profile:", profile);

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "google",
            providerId: profile.id,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/github/create",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Full GitHub profile:", profile);

        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;
        if (!email) {
          return done(new Error("Github email not found"));
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,
            email,
            provider: "github",
            providerId: profile.id,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
