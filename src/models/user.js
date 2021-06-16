const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sequelize, DataTypes } = require('../db/sequelize')

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value) ){
                throw new Error('Input must be a valid email')
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        minLength: 7,
        validate (value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error('Password should not contain the word "password" ');
            }
        }
    }
})

// for instance methods you need to pass the instance as parameter
User.beforeSave( async (user) => {
    
    // checks if password is being created/ modified (needs to be hashed/rehashed)
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
 })

 User.findByCredentials = async (email, password) => {
     const user = await User.findOne({where: { email: email}})
     if(!user) {
        throw new Error('Unable to login')
     }
    // hashes password argument and checks if hash matched user password
    // bcrypt.compare() order of arguments matters!
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('Unable to login')
    }
    return user
 }
 // model instance methods are defined on the models prototype

 // can't use arrow function because we need this binding
 User.prototype.generateAuthToken = async function() {
    const user = this
    //create a token using users unique id
    const token = jwt.sign({id: user.id.toString()}, process.env.JWT_SIGNATURE, { expiresIn: '3h' }) 

    return token
 }

module.exports = User