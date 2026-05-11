const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

// ── GOOGLE OAUTH SETUP ───────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Build callback URL - MUST match the one registered in Google Console
  // Priority: explicit URL > build from BACKEND_URL > use default
  let callbackURL = process.env.GOOGLE_CALLBACK_URL;

  if (!callbackURL && process.env.BACKEND_URL) {
    // Build from BACKEND_URL (e.g., https://backend.vercel.app)
    const baseUrl = process.env.BACKEND_URL.replace(/\/+$/, "");
    callbackURL = `${baseUrl}/api/auth/google/callback`;
  }

  if (!callbackURL) {
    console.error(
      "🚨 CRITICAL: Google OAuth callback URL not configured!\n" +
      "Set either GOOGLE_CALLBACK_URL or BACKEND_URL in environment variables.\n" +
      "This URL must match the one registered in Google OAuth Console.\n" +
      "Example: GOOGLE_CALLBACK_URL=https://backend.vercel.app/api/auth/google/callback"
    );
  } else {
    console.log(`📡 Google OAuth Strategy registered with callback: ${callbackURL}`);

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL,
          proxy: true, // Required for Vercel and proxied environments
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const googleEmail = profile.emails?.[0]?.value;
            const googleName = profile.displayName || "User";

            if (!googleEmail) {
              return done(
                new Error(
                  "No email found in your Google profile. " +
                  "Please ensure your Google account has a verified email address."
                ),
                null
              );
            }

            console.log(`🔑 Google Auth: Processing ${googleEmail}`);

            // Case 1: User already exists with this Google ID
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
              console.log(`✅ Google user found: ${googleEmail}`);
              user.name = googleName; // Update name in case it changed
              await user.save();
              return done(null, user);
            }

            // Case 2: User exists with same email
            user = await User.findOne({ email: googleEmail });
            if (user) {
              console.log(`✅ Email exists, linking Google ID: ${googleEmail}`);
              user.googleId = profile.id;
              user.name = googleName;
              user.isVerified = true;
              await user.save();
              return done(null, user);
            }

            // Case 3: New user
            console.log(`🆕 Creating new user from Google: ${googleEmail}`);
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
  }
} else {
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️ Google OAuth credentials missing - Google login disabled");
  }
}

// ── FACEBOOK OAUTH SETUP ─────────────────────────────────────────────────
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  // Build Facebook callback URL
  let facebookCallbackURL = process.env.FACEBOOK_CALLBACK_URL;

  if (!facebookCallbackURL && process.env.BACKEND_URL) {
    const baseUrl = process.env.BACKEND_URL.replace(/\/+$/, "");
    facebookCallbackURL = `${baseUrl}/api/auth/facebook/callback`;
  }

  if (!facebookCallbackURL) {
    console.error(
      "🚨 CRITICAL: Facebook OAuth callback URL not configured!\n" +
      "Set either FACEBOOK_CALLBACK_URL or BACKEND_URL in environment variables."
    );
  } else {
    console.log(`📡 Facebook OAuth Strategy registered with callback: ${facebookCallbackURL}`);

    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: facebookCallbackURL,
          profileFields: ["id", "displayName", "emails"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const facebookEmail = profile.emails?.[0]?.value;
            const facebookName = profile.displayName || "User";

            if (!facebookEmail) {
              return done(
                new Error(
                  "No email found in your Facebook profile. " +
                  "Please ensure your account has a verified email address."
                ),
                null
              );
            }

            console.log(`🔑 Facebook Auth: Processing ${facebookEmail}`);

            // Case 1: User exists with this Facebook ID
            let user = await User.findOne({ facebookId: profile.id });
            if (user) {
              console.log(`✅ Facebook user found: ${facebookEmail}`);
              user.name = facebookName;
              await user.save();
              return done(null, user);
            }

            // Case 2: User exists with same email
            user = await User.findOne({ email: facebookEmail });
            if (user) {
              console.log(`✅ Email exists, linking Facebook ID: ${facebookEmail}`);
              user.facebookId = profile.id;
              user.name = facebookName;
              user.isVerified = true;
              await user.save();
              return done(null, user);
            }

            // Case 3: New user
            console.log(`🆕 Creating new user from Facebook: ${facebookEmail}`);
            user = await User.create({
              facebookId: profile.id,
              name: facebookName,
              email: facebookEmail,
              isVerified: true,
            });

            return done(null, user);
          } catch (err) {
            console.error("❌ Facebook Strategy Error:", err.message);
            return done(err, null);
          }
        }
      )
    );
  }
} else {
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️ Facebook OAuth credentials missing - Facebook login disabled");
  }
}

// ── PASSPORT SERIALIZATION ──────────────────────────────────────────────
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
