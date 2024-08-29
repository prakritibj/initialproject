const UserServices = require("./services.user")

const jwttoken = require("jsonwebtoken")
require('dotenv').config()
console.log(process.env.TOKEN_SECRET)

const userController = {};
userController.registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.send({ status: "err", msg: "do not match password" })
    }
    if (!name || !email || !password || !confirmPassword) {
        return res.send({
            satus: "ERR",
            msg: "name,email,password  are required",
            data: null,
        })
    }


    // repated email existance

    const { data } = await UserServices.getUserByEmail(email)
    console.log(data)

    if (data.length) {
        return res.send({ status: "ERR", msg: "email already exists", data: null })
    }

    try {
        const createdUser = await UserServices.registerUser({
            name,
            email,
            password,
        });
        return res.send({
            status: "OK ",
            msg: "user registered successfully",
            data: createdUser.data,
        });
    } catch (error) {
        return res.send({
            status: " ERR",
            msg: "Something went wrong",
            data: null,
        });
    }
};

// as structured
userController.loginUser = async (req, res) => {

    try {
        const { email, password } = req.body

        // destructure body
        if (!email || !password) {
            return res.send({
                satus: "ERR",
                msg: "name,email,password are required",
                data: null,
            })
        }

        const user = await UserServices.findUserByEmailAndPassword(email, password)
        // validation

        if (user) {

            var token = jwttoken.sign({ _id: user._id }, process.env.TOKEN_SECRET);


            res.send({ status: "OK", msg: "login successfully", data: token })
        } else {
            res.send({ status: "ERR", msg: "Invalid email or password", data: null })
            console.log("fgg")
        }

        //   var token =jwttoken.sign({_id : user._id}, process.env.TOKEN_SECRET);
        // return res.send({ status: "OK", msg: "login successfully", data: token })

    } catch (err) {
        return res.send({ status: "ERR", msg: "Invalid email or password", data: null })
        //   console.log(err)
    }
}


// find all users
userController.getAllusers = async (req, res) => {
    try {
        const getAllusers = await UserServices.findAllusers()
        if (getAllusers.length) {
            return res.send({ status: "OK", data: getAllusers, error: null })
        }
        return res.send({ msg: "user not found", data: null, status: false })
    } catch (err) {
        console.log(err)
        return res.send({ status: "ERR", data: [], error: err })
    }

}
// deleteuser as inactive
userController.deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const deletedUser = await UserServices.findDelete(id, { $set: { isDeleted: true } })

        if (deletedUser === null) {
            return res.send({ msg: "data not found", data: null })
        }
        return res.send({ msg: "data deleted successfully", data: deletedUser, error: null })
    } catch (err) {
        console.error(err)
        return res.send({ status: "ERR", msg: "data not deleted", error: err.message })
    }

};

// update
userController.updateduserRoute = async (req, res) => {
    const { id } = req.params
    const { name, email } = req.body
    try {
        const updateuser = await UserServices.updateUser(id, { name, email })
        if (!name || !email) {
            return res.send({
                satus: "ERR",
                msg: "name,email,password are not returned",
                data: null,
            })
        }
        return res.send({ msg: "user updated successfully", data: updateuser, error: null })

    } catch (err) {
        console.error(err)
        return res.send({ status: "ERR", msg: "user not updated" })
    }

}

userController.updatepasswordroutes = async (req, res) => {

    try {

        const { currentPassword, newPassword, confirmPassword } = req.body
        const { id } = req.params


        if(req._id !== id){
            return res.send({ status: "Err", msg: "you are not authorised for this", data: null })

        }
        // const updateuserpass = await UserServices.updatepassword(id, {currentPassword,newPassword,confirmPassword})
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.send({
                satus: "ERR",
                msg: "currentPassword,newPassword,confirmPassword are required",
                data: null,
            })
        }

        const user = await UserServices.getUserById(id)
        console.log(user, "uer")
        if (!user) {
            return res.send({ status: "Err", msg: "user not found", data: null })
        }

        const verifyPass = await UserServices.verifyCurrentPassword(user, currentPassword)
        console.log(currentPassword,"current")


        console.log(verifyPass, "ber")
        if (!verifyPass) {
            return res.send({ status: "Err", msg: "currnt password is incorrect", data: null })
        }

        if (newPassword != confirmPassword) {
            return res.send({ status: "Err", msg: "new password and confirm password do not matched", data: null })

        }

        const hashPassword = await UserServices.hashPassword(newPassword)
        const updatePassword = await UserServices.updatePassword(id, hashPassword)

        if (updatePassword) {
            return res.send({ msg: "currentPassword,newPassword,confirmPassword updated successfully", data: updatePassword, error: null })
        }

    } catch (err) {
        console.error(err, "errr")
        return res.send({ status: "ERR", msg: "password is not updated" })
    }

}



module.exports = userController;