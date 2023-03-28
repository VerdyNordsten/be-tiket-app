/* eslint-disable no-unused-vars */
require("dotenv").config()
const express = require("express")
const createError = require("http-errors")
const morgan = require("morgan")
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const mainRouter = require("./routes/index")
const passportSetup = require('./lib/passport.js')
const passport = require('passport')
const cookieSession = require(`cookie-session`)
const authSSORoutes = require('./routes/authSSORoutes')
const session = require('express-session')
const app = express()
const port = process.env.PORT

// app.use(cookieSession({
//   name: 'session',
//   keys: ['ticket'],
//   maxAge: 24 * 60 * 60 * 100
// }))

app.use(session({
secret: "this_is_a_secret",
  // store: pgSessionStorage,
  resave: true,
  saveUnitialized: true,
  rolling: true, // forces resetting of max age
  cookie: {
    maxAge: 360000,
    secure: false // this should be true only when you don't want to show it for security reason
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
  origin: 'https://ui-tiket-app.vercel.app',
  methods: "GET, PUT, POST, DELETE",
  credentials: true
}))

app.use(express.json())
app.use(morgan("dev"))
app.use(helmet())
app.use(xss())

app.use("/api/v1", mainRouter)
app.use("/auth", authSSORoutes)

app.all("*", (req, res, next) => {
  next(new createError.NotFound())
})

app.use((err, req, res, next) => {
  const messageError = err.message || "internal server error"
  const statusCode = err.status || 500
  res.status(statusCode).json({
    message: messageError,
  })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
