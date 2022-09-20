const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

let userModel = require('../models/user')
let rolesModel = require('../models/roles')


exports.checkRoles = function (req, res, next) {

  // console.log("Token is >> ", req.headers)

  let decodedToken = jwt.verify(req.headers.accesstoken, 'MySecret')
  // console.log("decodedToken >>> ", decodedToken)
  let currRole = decodedToken.role.toLowerCase()

  rolesModel.roles.findOne({roleName: currRole}, (err, result) => {
    if (err) {
      console.error("Something went wrong while fetching the roles >> ", err)
      return res.status(500).json({
        success: false,
        message: "Something went wrong while searching for the roles!"
      })
    }
    if (result && result.hasOwnProperty("_doc")) {
      let userPermissions = result._doc.permissions

      let reqMethod = req.method.toLowerCase()

      res.locals.canAccess = userPermissions.indexOf(reqMethod) >= 0

      next()

    } else {
      return res.status(200).json({
        success: true,
        message: "Roles didn't match!"
      })
    }
  })

}