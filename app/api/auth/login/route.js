import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { CreateJwt } from "@/lib/Jwt";
import * as cookie from 'cookie';

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const token = CreateJwt(user);

  //create user object without sensitive data
  const safeUser ={
    _id : user._id,
    name : user.name,
    email : user.email,
    password : user.password,
    role : user.role,
  }
  const res = NextResponse.json({ success: true, user: safeUser}, { status: 200 });

  res.headers.set(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  );
  return res;
}
