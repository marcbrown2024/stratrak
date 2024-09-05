import { NextResponse } from 'next/server';
import { deleteUser } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'UserId is required' },
        { status: 400 }
      );
    }

    const response = await deleteUser(userId);
    console.log(response)
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
