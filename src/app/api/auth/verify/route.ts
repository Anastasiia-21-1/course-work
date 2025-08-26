import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ isValid: false });
    }

    if (!user.password) {
      return NextResponse.json({ isValid: false });
    }

    const isValid = await bcrypt.compare(password, user.password);

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json({ isValid: false });
  }
}
