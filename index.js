let express = require('express')
let bodyParser = require('body-parser')
let bcrypt = require('bcrypt')
let mongoose = require('mongoose')
let jwt = require('jsonwebtoken')


let userModel = require('./models/user')
let authMiddleware = require("./middleware/authorization").checkRoles

let app = new express()

// app.use(bodyParser.urlencoded({extended: false}))

app.use(express.json())

app.get('/', (req, res, next) => {
  res.status(200).json({
    httpStatus: 200,
    success: true
  })
})

app.post('/signup', async (req, res, next) => {

  // console.log("Request body >> ", req.body)

  let username = req.body.username
  let password = req.body.password
  let role = req.body.role

  if (!username) {
    res.status(400).json({
      success: false,
      message: "Username is missing!"
    })
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is missing!"
    })
  } else if (password && !(password.length >= 8)) {
    return res.status(400).json({
      success: false,
      message: "Password's length should be greater than 8"
    })
  }
  if (!role) {
    return res.status(400).json({
      success: false,
      message: "Role is missing!"
    })
  }

  password = await bcrypt.hash(password, 12)

  console.log("Encrypted password is >> ", password)

  let newUser = new userModel.user({
    username,
    password,
    role
  })

  newUser.save((err, result) => {
    if (err) {
      console.error("Something went wrong while saving the new user >> ", err)
      return res.status(500).json({
        success: false,
        message: "Something went wrong while creating a new user!"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Signup Successfull!"
    })

  })

})

app.post('/login', (req, res, next) => {

  // console.log("Request body >> ", req.body)

  let username = req.body.username
  let password = req.body.password

  if (!username) {
    res.status(400).json({
      success: false,
      message: "Username is missing!"
    })
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is missing!"
    })
  }

  userModel.user.findOne({username}, async (err, result) => {
    if (err) {
      console.error("Something went wrong while searching the user >> ", err)
      return res.status(500).json({
        success: false,
        message: "Something went wrong while loging!"
      })
    }
    // console.log("\nFound the user >> ", result)
    if (result && result.hasOwnProperty('_doc')) {
      let hashPass = result._doc.password
      let passwordMatch = await bcrypt.compare(password, hashPass)
      if (passwordMatch) {

        let payload = Object.assign({role: null, username: null}, {role: result._doc.role, username: result._doc.username})
        // console.log("JWT payload >> ", payload)

        let accessToken = jwt.sign(payload, "MySecret", { expiresIn: 3000})

        res.status(200).json({
          success: true,
          accessToken,
          message: "Successfully logged in!"
        })
      }
    } else {
      res.status(200).json({
        success: true,
        message: "User doesn't found!"
      })
    }
  })

})

app.use("/products", authMiddleware, (req, res, next) => {
  
  let canAccess = res.locals.canAccess

  console.log("Can ACCESS >>> ", canAccess)

  if (canAccess) {
    if (req.method.toLowerCase() === 'get') {
      return res.status(200).json({
        message: "Products sent successfully"
      })
    }
    if (req.method.toLowerCase() === 'post') {
      return res.status(201).json({
        message: "Products addedd successfully"
      })
    }
    if (req.method.toLowerCase() === 'put' || req.method.toLowerCase() === 'patch') {
      return res.status(200).json({
        message: "Products updated successfully"
      })
    }
    if (req.method.toLowerCase() === 'delete') {
      return res.status(200).json({
        message: "Products deleted successfully"
      })
    }
  } else {
    return res.status(401).json({
      message: "Not authorized to access endpoint"
    })
  }

})


let mongoConn = mongoose.connect("mongodb://127.0.0.1:27017/test")

mongoConn.connection.on('connected', (err, conn) => {
  if (err) {
    console.error('Something went wrong while making Mongo Connection')
    process.exit(-1)
  }
  console.log("Successfully connected to the DB, Now starting server")
  app.listen(3000, (err, res) => {
    if (err) {
      console.error("Someting went wrong")
    }
    console.log("Successfully connected to the server")
  })

  app.on('error', () => {
    process.exit(-1)
  })

})