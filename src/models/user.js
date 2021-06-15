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

module.exports = User