import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const { name, email, password, role } = await req.json();
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed, role });
  return NextResponse.json({ success: true, user }, { status: 201 });
}
