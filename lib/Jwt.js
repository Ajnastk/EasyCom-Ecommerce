import jwt from 'jsonwebtoken'

const Jwt_token = process.env.JWT_SECRET;

export function CreateJwt(user){
    return jwt.sign({ id :user._id,email : user.email, role:email.role},
         Jwt_token,
         {expiresIn : '7d'}
        );

}

export function VerifyJwt(token){
    try {
        return jwt.verify(token, Jwt_token)
    } catch (error) {
        return null;
    }
}