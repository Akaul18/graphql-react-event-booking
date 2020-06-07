const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error('User does not exist')
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            throw new Error('Email or password does not match')
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'somesupersecretkey',
            { expiresIn: '1h' }
        )
        return {
            userId: user.id,
            token,
            tokenExpiration: 1,
        }
    },
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({
                email: args.userInput.email,
            })
            if (existingUser) {
                throw new Error('User exists already..!!')
            }
            const hashedPassword = await bcrypt.hash(
                args.userInput.password,
                12
            )
            const newUser = new User({
                email: args.userInput.email,
                password: hashedPassword,
            })
            const result = await newUser.save()

            return { ...result._doc, password: null }
        } catch (err) {
            console.log(err)
            throw err
        }
    },
}
