const User = require("./model.user")
const UserServices = {};

const bcrypt = require("bcrypt")


UserServices.registerUser = async ({ name, email, password, confirmPassword }) => {
    try {
        let newUser = await User.create({ name, email, password, confirmPassword });
        return { status: "OK", data: newUser };
    } catch (error) {
        return { status: "ERR", data: null, error: err };
    }
};



UserServices.registerUser = async ({ name, email, password, confirmPassword }) => {
    try {

        const hash = bcrypt.hashSync(password, 10)
        console.log(hash)
        let newUser = await User.create({ name, email, password: hash, confirmPassword })
        return { status: "OK", data: newUser }


    } catch (err) {
        return { status: "ERR", data: null, error: err }
    }

}

UserServices.getUserByEmail = async (email) => {
    try {
        const user = await User.find({ email })
        return { status: "OK", data: user, error: null }
    } catch (err) {
        console.log(err)
        return { status: "ERR", data: [], error: err }
    }

}



UserServices.findUserByEmailAndPassword = async (email, password) => {
    try {
        let user = await User.findOne({ email })
        console.log(user)
        if (user) {
            let { password: hash } = user

            let isMatched = bcrypt.compareSync(password, hash)

            if (isMatched) {
                return user
            } else {
                return false
            }
        } else {
            return false
        }

    } catch (err) {
        return false
    }
}

// 

UserServices.findUserByEmail = async (matchFiles) => {
    return User.findOne({ ...matchFiles })
}

// get All users
UserServices.findAllusers = async () => {
    return User.find({})
}


// deleted as inactive
UserServices.findDelete = async (id, updateFeild) => {
    return User.findByIdAndUpdate({ _id: id }, { ...updateFeild }, { new: true })
}

// update api
UserServices.updateUser = async (id, { name, email }) => {
    return User.findByIdAndUpdate({ _id: id }, { name, email })
}

// password
UserServices.updatepassword = async (id, { password }) => {
    const hash = bcrypt.hashSync(password, 10)
    console.log(hash,)
    return User.findByIdAndUpdate({ _id: id }, { password: hash })

}
// user
UserServices.getUserById = async (id) => {
    const user = await User.findById(id)
    return user
},
    // verifypass
    UserServices.verifyCurrentPassword = async (user, currentPassword) => {
        console.log(user, currentPassword, "uc")
        return await bcrypt.compare(currentPassword, user.password)
    }

// passencrypted
UserServices.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

// updatepassword

UserServices.updatePassword = async (id, updatePass) => {
    return await User.findByIdAndUpdate(id, { password: updatePass })

}

module.exports = UserServices;
