var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const Pool = require(`../config/db`)
const { randomUUID } = require(`crypto`)

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    passReqToCallback: true,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    // Check is user registred
    try{
      const user = await Pool.query(`SELECT * FROM users WHERE id='${profile.id}' AND type='google' `)
      if(user.rows.length == 0) {
        const createUser = await Pool.query(`INSERT INTO users (id, name, email, password, type) VALUES('${profile.id}', '${profile.displayName}', '${profile.id}@gmail.com', '${randomUUID()}', '${profile.provider}')`)

        return done(null, {profile: {
          id: `${profile.id}`,
          name: `${profile.displayName}`,
          email: `${profile.id}@gmail.com`,
          phone: null,
          city: null,
          address: null,
          title: null,
          post_code: null,
          photo: null,
          role: 'customer',
          type: 'google'
        },refreshToken, accessToken})
      }

      const {password, ...data} = user.rows[0]
      done(null, {profile: data,refreshToken, accessToken})
    }catch(err){
      console.log(err)  
    }
  }
));

passport.serializeUser((user, done) => {
  return done(null, user)
})

passport.deserializeUser((user, done) => {
  return done(null, user)
})