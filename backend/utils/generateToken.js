import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    //token for JWT
    const token = jwt.sign({
        userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn:'30d' }
      );

      //set JWT as an HTTP-only cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 //30 days in ms
      });
}

export default generateToken;