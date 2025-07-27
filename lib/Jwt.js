// utils/jwt.js
import jwt from "jsonwebtoken";

const Jwt_token = process.env.JWT_SECRET;

export function CreateJwt(user) {
  //   console.log("jwt token created , 1 minutes");
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    Jwt_token,
    { expiresIn: "7d" } // ⏱️ Token now expires in 10 minutes
  );
}

export function VerifyJwt(token) {
  //   console.log("jwt token verify");

  try {
    return jwt.verify(token, Jwt_token);
  } catch (error) {
    return null;
  }
}
