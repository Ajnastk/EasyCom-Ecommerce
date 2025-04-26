import dbConnect from "@/lib/mongodb";
import  User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const { name, email, password, role = "user" } = await req.json();
  try {
    const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed, role });
  //Return user without password
  const safeUser={
    _id:user._id,
    name:user.name,
    email:user.email,
    role:user.role
  };
  return NextResponse.json({
    success: true,
    user:safeUser
  },{status :201});
  } catch (error) {
    return NextResponse.json({
      error:error.message
    },{status:500})
  }
  

}
