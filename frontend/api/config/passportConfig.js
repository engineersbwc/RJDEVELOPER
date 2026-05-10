const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://rjdeveloper-tawny.vercel.app/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleName = profile.displayName || "Google User";
          const googleEmail = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;

          if (!googleEmail) {
            return done(new Error("No email found in your Google profile. Please ensure your Google account has an email."), null);
          }

          // Case 1: User already linked with this Google account
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            user.name = googleName;
            await user.save();
            return done(null, user);
          }

          // Case 2: User exists with same email
          user = await User.findOne({ email: googleEmail });
          if (user) {
            user.googleId = profile.id;
            user.name = googleName;
            user.isVerified = true;
            await user.save();
            return done(null, user);
          }

          // Case 3: Brand new user
          user = await User.create({
            googleId: profile.id,
            name: googleName,
            email: googleEmail,
            isVerified: true,
          });
          return done(null, user);
        } catch (err) {
          console.error("Google Strategy Error:", err);
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("Google OAuth credentials missing. Google login disabled.");
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "displayName", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });

          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.facebookId = profile.id;
              user.name = profile.displayName;
              await user.save();
            } else {
              user = await User.create({
                facebookId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                isVerified: true,
              });
            }
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
