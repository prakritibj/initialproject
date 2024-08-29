const UserServices = require("./services.user")

const jwttoken = require("jsonwebtoken")
require('dotenv').config()
console.log(process.env.TOKEN_SECRET)

const userController = {};
userController.registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        return res.send({
            satus: "ERR",
            msg: "name,email,password  are required",
            data: null,
        })
    }

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
            confirmPassword
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

// our
// userController.loginUser = async (req, res)=>{

//   // const user = await  UserServices.findUserByEmailAndPassword(email, password)

//   // if(user){

//   //   var token =jwttoken.sign({_id : user._id}, process.env.TOKEN_SECRET);


//   //   res.send({status : "OK", msg:"login successfully", data :token})
//   // }else{
//     //   res.send({status : "ERR", msg:"Invalid email or password", data : null})
//     //   console.log("fgg")
//     // }

//     try{
//       const {email, password} = req.body

//       const user = await  UserServices.findUserByEmailAndPassword(email, password)



//     var token =jwttoken.sign({_id : user._id}, process.env.TOKEN_SECRET);


//     res.send({status : "OK", msg:"login successfully", data :token})

//   }catch(err){
//     res.send({status : "ERR", msg:"Invalid email or password", data : null})
//     console.log(err)
//   }

// }

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

userController.getUserByEmail = async (req,res) => {
    const { email } = req.body
    try {
        const user = await UserServices.findUserByEmail(email)
         if(!user){
            return res.send({ msg: "user not found", data:null, status: false })
         }
        return  res.send({ status: "OK", data: user, error: null })
    } catch (err) {
        console.log(err)
        return res.send({ status: "ERR", data: [], error: err })
    }
}

// find all users
userController.getAllusers= async (req,res) => {
    try {
        const getAllusers = await UserServices.findAllusers()
        if(getAllusers.length){
             return  res.send({ status: "OK", data: getAllusers, error: null })
        }
        return res.send({ msg: "user not found", data:null, status: false })
    } catch (err) {
        console.log(err)
        return res.send({ status: "ERR", data: [], error: err })
    }

}

userController.deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const deletedUser = await UserServices.findDelete(id,{$set:{  isDeleted  : true}})

    if(deletedUser === null){
        return res.send({msg: "data not found", data : null})
    }
    return res.send({ msg :"data deleted successfully", data: deletedUser, error: null })
      } catch (err) {
        console.error(err)
        return res.send({ status: "ERR",msg:"data not deleted", error: err.message })
    }
        // if (!deletedUser) {
        //     return res.send({ msg: "User not found", data: null, status: false })
        // }

        // return res.send({ status: "OK", data: deletedUser, error: null })
    // } catch (err) {
    //     console.error(err)
    //     return res.send({ status: "ERR", data: [], error: err.message })
    // }
};



 



module.exports = userController;