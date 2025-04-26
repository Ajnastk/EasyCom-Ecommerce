import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

const handler= NextAuth({
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials:{
                email :{label : "Email" ,type :"email"},
                password :{ label : "Password", type : "password"}
            },
            async authorize(credentials){
                await dbConnect();
                const user = await User.findOne({email : credentials.email});

                if(!user){
                    throw new Error("User not found");
                }

                const isMatch = await bcrypt.compare(credentials.password,user.password);
                
                if(!isMatch){
                    throw new Error("Invalid password");
                }
                //Return safe user object -this becomes the JWT payloads
                return{
                    id:user._id.toString(),
                    name:user.name,
                    email:user.email,
                    role:user.role,
                };
            }
            //you can add social providers here
        }),
    ],
    callbacks:{
        //JWT callback-runs when JWT is created/updated
        async jwt ({token,user}){
            if(user){
                token.id=user.id;
                token.role=user.role
            }
            return token;
        },
        //sessipn callback -runs when session is checked
        async session({session,token}){
            if(token){
                session.user.id= token.id;
                session.user.role= token.role;
            }
            return session;
        }
    },
    pages:{
        signIn:'/', //custom login page path
        error:'',//custom error page
    },
    session:{
        strategy:"jwt", //use jwt strategy
        maxAge: 7 * 24 * 60 * 60 //7days,matching current expiry
    },
    secret:process.env.NEXTAUTH_SECRET,
    debug : true, //add this to see more detailed logs
});

export { handler as GET, handler as POST} ;