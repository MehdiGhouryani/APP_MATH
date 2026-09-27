import { NextResponse } from 'next/server';
import {
  authenticateTeacher,
  setTeacherSessionCookie,
} from '@/lib/teacher-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { code: 'INVALID_PAYLOAD', message: 'اطلاعات ارسالی نامعتبر است.' },
        { status: 400 }
      );
    }

    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json(
        { code: 'CREDENTIALS_REQUIRED', message: 'لطفاً نام کاربری و رمز عبور را وارد کنید.' },
        { status: 400 }
      );
    }

    const session = await authenticateTeacher(username, password);

    // Set secure HTTP session cookie
    await setTeacherSessionCookie(session);

    return NextResponse.json({
      success: true,
      message: 'ورود با موفقیت انجام شد.',
      session: {
        accountId: session.accountId,
        username: session.username,
        displayName: session.displayName,
        roles: session.roles,
        isTeacher: true,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'خطای سرور در احراز هویت';
    const isRoleError = msg.includes('TEACHER_ROLE_REQUIRED');
    const isCredentialsError = msg.includes('INVALID_CREDENTIALS');

    return NextResponse.json(
      {
        code: isRoleError ? 'FORBIDDEN' : isCredentialsError ? 'UNAUTHORIZED' : 'AUTH_ERROR',
        message: msg.replace(/^[A-Z_]+:\s*/, ''),
      },
      { status: isRoleError ? 403 : isCredentialsError ? 401 : 500 }
    );
  }
}
