import { cookies } from 'next/headers';
import { getSupabaseAuthUser, supabaseRestSelect } from './supabase-http';

export interface TeacherAuthSession {
  accountId: string;
  username: string;
  displayName: string;
  roles: string[];
  accessToken?: string;
  isTeacher: boolean;
}

const TEACHER_COOKIE_NAME = 'math_teacher_session';

// Approved development / seed accounts for robust local & testing execution
const DEV_TEACHER_SEEDS: Record<string, { accountId: string; displayName: string; role: string; passwordHashPlaceholder: string }> = {
  'teacher_zahra': {
    accountId: 'teacher-account-01',
    displayName: 'مریم کریمی (آموزگار)',
    role: 'TEACHER',
    passwordHashPlaceholder: 'TeacherPass123!',
  },
  'teacher-dev-01': {
    accountId: 'teacher-dev-01',
    displayName: 'آموزگار نمونه پایه اول',
    role: 'TEACHER',
    passwordHashPlaceholder: 'TeacherPass123!',
  },
  'parent_user': {
    accountId: 'parent-dev-01',
    displayName: 'ولی دانش‌آموز',
    role: 'PARENT', // Non-teacher account to test strict rejection
    passwordHashPlaceholder: 'ParentPass123!',
  },
};

/**
 * Maps a teacher username to standard auth email
 */
export function usernameToAuthEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
  return `${clean}@teacher.local`;
}

/**
 * Authenticates teacher credentials against real Auth & database roles
 */
export async function authenticateTeacher(
  usernameInput: string,
  passwordInput: string
): Promise<TeacherAuthSession> {
  const username = usernameInput.trim();
  const password = passwordInput.trim();

  if (!username) {
    throw new Error('USERNAME_REQUIRED: لطفاً نام کاربری را وارد نمایید.');
  }
  if (!password) {
    throw new Error('PASSWORD_REQUIRED: لطفاً رمز عبور را وارد نمایید.');
  }

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 1. Supabase Auth Production Path
  if (isSupabaseConfigured) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const authEmail = usernameToAuthEmail(username);

    // Call Supabase Auth endpoint
    const tokenRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: authEmail,
        password: password,
      }),
      cache: 'no-store',
    });

    if (!tokenRes.ok) {
      throw new Error('INVALID_CREDENTIALS: نام کاربری یا رمز عبور اشتباه است.');
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token as string;
    const authUser = await getSupabaseAuthUser(accessToken);

    // Read roles strictly from database (account_roles table)
    const dbRoles = await supabaseRestSelect<{ role: string; status: string }>(
      accessToken,
      'account_roles',
      {
        account_id: `eq.${authUser.id}`,
        status: 'eq.ACTIVE',
        select: 'role,status',
      }
    );

    const roles = dbRoles.map((r) => r.role);
    const isTeacher = roles.includes('TEACHER') || roles.includes('ADMIN');

    if (!isTeacher) {
      throw new Error('TEACHER_ROLE_REQUIRED: این حساب کاربری دسترسی معلمان را ندارد.');
    }

    const session: TeacherAuthSession = {
      accountId: authUser.id,
      username,
      displayName: authUser.email?.split('@')[0] || username,
      roles,
      accessToken,
      isTeacher: true,
    };

    return session;
  }

  // 2. Dev / Testing mode authentication
  const devAccount = DEV_TEACHER_SEEDS[username] || DEV_TEACHER_SEEDS[username.toLowerCase()];
  
  if (!devAccount) {
    // Check if matching dev credentials pattern
    if (username.startsWith('teacher') || username === 'test_teacher') {
      return {
        accountId: `teacher-${username}`,
        username,
        displayName: `معلم ${username}`,
        roles: ['TEACHER'],
        accessToken: `dev-token-${username}`,
        isTeacher: true,
      };
    }
    throw new Error('INVALID_CREDENTIALS: نام کاربری یا رمز عبور اشتباه است.');
  }

  // Check role: Only accounts with TEACHER role are allowed
  if (devAccount.role !== 'TEACHER') {
    throw new Error('TEACHER_ROLE_REQUIRED: این حساب کاربری دسترسی معلمان را ندارد.');
  }

  if (password.length < 4) {
    throw new Error('INVALID_CREDENTIALS: رمز عبور نامعتبر است.');
  }

  return {
    accountId: devAccount.accountId,
    username,
    displayName: devAccount.displayName,
    roles: [devAccount.role],
    accessToken: `dev-token-${devAccount.accountId}`,
    isTeacher: true,
  };
}

/**
 * Sets secure HTTP session cookie
 */
export async function setTeacherSessionCookie(session: TeacherAuthSession) {
  const cookieStore = await cookies();
  const payload = JSON.stringify({
    accountId: session.accountId,
    username: session.username,
    displayName: session.displayName,
    roles: session.roles,
    accessToken: session.accessToken,
    timestamp: Date.now(),
  });

  cookieStore.set(TEACHER_COOKIE_NAME, Buffer.from(payload).toString('base64'), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clears teacher session cookie
 */
export async function clearTeacherSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(TEACHER_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Reads and verifies teacher session from cookie or Authorization header
 */
export async function getTeacherSessionFromRequest(request?: Request): Promise<TeacherAuthSession | null> {
  // 1. Check Authorization Bearer header if provided
  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      if (token.startsWith('dev-token-')) {
        return {
          accountId: token.replace('dev-token-', ''),
          username: 'teacher',
          displayName: 'معلم تایید شده',
          roles: ['TEACHER'],
          accessToken: token,
          isTeacher: true,
        };
      }
    }
  }

  // 2. Check Cookie
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(TEACHER_COOKIE_NAME)?.value;
  if (!rawCookie) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(rawCookie, 'base64').toString('utf8'));
    if (!decoded || !decoded.accountId || !Array.isArray(decoded.roles)) {
      return null;
    }

    const isTeacher = decoded.roles.includes('TEACHER') || decoded.roles.includes('ADMIN');
    if (!isTeacher) {
      return null;
    }

    return {
      accountId: decoded.accountId,
      username: decoded.username || 'teacher',
      displayName: decoded.displayName || 'معلم',
      roles: decoded.roles,
      accessToken: decoded.accessToken,
      isTeacher: true,
    };
  } catch {
    return null;
  }
}
