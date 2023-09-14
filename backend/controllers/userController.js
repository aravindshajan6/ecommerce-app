
import asyncHandler from '../middleware/asyncHandler.js'; //error handler
import User from '../models/userModel.js';  
// import jwt  from 'jsonwebtoken';
import generateToken from '../utils/generateToken.js';

//@desc Auth user & get token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler( async (req, res) => {
    // res.send('Auth user !');
    const {email, password } = req.body;

    const user = await User.findOne({ email });

    //user backend authentication
    if(user && (await user.matchPassword(password))) {

      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }


  });

//@desc register user
//@route POST /api/users/
//@access Public
const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if(userExists) {
      res.status(400);
      throw new Error('User already exist!');
    }

    const user  = await User.create({
      name,
      email,
      password
    });

    if(user) {

      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data!');
    }

});

//@desc Logout user & clear logoutcookies
//@route POST /api/users/
//@access Private
const logoutUser = asyncHandler( async (req, res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0) //clear cookie
    });

    res.status(200).json({ message : 'Logged out successfully !'})
});

//@desc get user Profile
//@route GET /api/users/profile
//@access Public
const getUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('user not found !');
    }
});

//@desc Update user Profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler( async (req, res) => {
    // const user = await User.findById(user._id);
    const user = await User.findById(req.user._id);


    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('user not found !');
    }
});

//@desc get users
//@route GET /api/users/
//@access Private/Admin
const getUsers= asyncHandler( async (req, res) => {
    const users = await User.find({ });
    res.status(200).json( users )
});

//@desc get user by ID
//@route GET /api/users/:id
//@access Private/Admin
const getUserById= asyncHandler( async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if( user ) { 
    res.status(200).json( user );
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc delete users
//@route GET /api/users/
//@access Private/Admin
const deleteUser= asyncHandler( async (req, res) => {

    const user = await User.findById(req.params.id);
    console.log(req.params.id, 'happy');
    console.log(user._id);

    if( user ) {
      if(user.isAdmin) { 
        res.status(400);
        throw new Error('Cannot delete admin user!');
      }
      await User.deleteOne({_id: user._id });
      res.status(200).json({ message : 'User deleted successfully'});
    } else {
      res.status(404);
      throw new Error(' User not found')
    }

});

//@desc update user
//@route PUT /api/users/:id
//@access Private
const updateUser= asyncHandler( async (req, res) => {

    const user = await User.findById(req.params.id);
    console.log(user.name);

    if( user ) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
    }
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
})
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser
}