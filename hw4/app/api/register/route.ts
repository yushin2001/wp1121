import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  const body = await request.json();
  const {
    name,
    password,
    confirmpassword
  } = body;

  if (password !== confirmpassword){
    return new NextResponse('password and cconfirm password are not matched', { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      hashedPassword
    }
  });

  return NextResponse.json(user);
}
