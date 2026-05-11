const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const googleCallbackHost = process.env.GOOGLE_CALLBACK_URL || process.env.BACKEND_URL;
  
  if (!googleCallbackHost) {
    console.warn('⚠️ GOOGLE_CALLBACK_URL or BACKEND_URL not set. Google OAuth will not work correctly.');
  }

  // Use the provided GOOGLE_CALLBACK_URL or build one using BACKEND_URL
  // Standardizing on /api/auth/google/callback as the reliable path
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 
    `${googleCallbackHost?.replace(/\/+$/, '')}/api/auth/google/callback`;

  console.log(`📡 Registering Google Strategy. Callback URL: ${callbackURL}`);

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
        proxy: true // Required for Vercel/proxied environments
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(`🔑 Google Auth triggered for: ${profile.emails?.[0]?.value}`);
          
          const googleName = profile.displayName || "Google User";
          const googleEmail = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;

          if (!googleEmail) {
            console.error("❌ No email found in Google profile");
            return done(new Error("No email found in your Google profile. Please ensure your Google account has an email."), null);
          }

          // Case 1: User already linked with this Google account
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            console.log("✅ User found via Google ID");
            user.name = googleName;
            await user.save();
            return done(null, user);
          }

          // Case 2: User exists with same email
          user = await User.findOne({ email: googleEmail });
          if (user) {
            console.log("✅ User found via Email, linking Google ID");
            user.googleId = profile.id;
            user.name = googleName;
            user.isVerified = true;
            await user.save();
            return done(null, user);
          }

          // Case 3: Brand new user
          console.log("🆕 Creating new user from Google profile");
          user = await User.create({
            googleId: profile.id,
            name: googleName,
            email: googleEmail,
            isVerified: true,
          });
          return done(null, user);
        } catch (err) {
          console.error("❌ Google Strategy Error:", err.message);
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️ Google OAuth credentials missing. Google login disabled.");
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  const facebookCallbackHost = process.env.FACEBOOK_CALLBACK_URL || process.env.BACKEND_URL;
  if (!facebookCallbackHost) {
    console.warn('⚠️ FACEBOOK_CALLBACK_URL or BACKEND_URL not set. Facebook OAuth will not work.');
  } else {
    const facebookCallbackPath = process.env.FACEBOOK_CALLBACK_URL ? '' : '/api/auth/facebook/callback';

    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: `${facebookCallbackHost.replace(/\/+$/, '')}${facebookCallbackPath}`,
          profileFields: ["id", "displayName", "emails"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await User.findOne({ facebookId: profile.id });

            if (!user) {
              if (!profile.emails || profile.emails.length === 0) {
                return done(new Error("No email found in your Facebook profile."), null);
              }
              
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
            console.error("Facebook Strategy Error:", err);
            return done(err, null);
          }
        }
      )
    );
  }
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
