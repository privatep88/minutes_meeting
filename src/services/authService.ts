import { SystemUser } from '../types/meeting';

export interface ValidationError {
  field: 'username' | 'password' | 'general';
  messageAr: string;
  messageEn: string;
}

export interface AuthResponse {
  success: boolean;
  user?: SystemUser;
  sessionToken?: string;
  errors?: ValidationError[];
}

export interface PasswordResetResponse {
  success: boolean;
  messageAr: string;
  messageEn: string;
}

export interface DemoAccountPreset {
  username: string;
  roleKey: 'rapporteur' | 'chairman' | 'regular';
  labelAr: string;
  labelEn: string;
  defaultPassPreview: string;
}

export const SYSTEM_ACCOUNT_PRESETS: DemoAccountPreset[] = [
  {
    username: 'user',
    roleKey: 'rapporteur',
    labelAr: 'مقرر الاجتماع (كامل الصلاحيات)',
    labelEn: 'Meeting Rapporteur (Full Access)',
    defaultPassPreview: 'user',
  },
  {
    username: 'user',
    roleKey: 'chairman',
    labelAr: 'رئيس الاجتماع (اعتماد وتوقيع)',
    labelEn: 'Meeting Chairman (Approval & Sign)',
    defaultPassPreview: 'user',
  },
  {
    username: 'user',
    roleKey: 'regular',
    labelAr: 'مستخدم عادي (اطلاع وأرشيف)',
    labelEn: 'Regular User (View & Archive)',
    defaultPassPreview: 'user',
  },
];

/**
 * Validates login inputs and returns bilingual validation errors if any.
 */
export function validateLoginCredentials(username: string, password: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    errors.push({
      field: 'username',
      messageAr: 'يرجى إدخال اسم المستخدم',
      messageEn: 'Please enter your username',
    });
  } else if (trimmedUsername.length < 3) {
    errors.push({
      field: 'username',
      messageAr: 'يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل',
      messageEn: 'Username must be at least 3 characters long',
    });
  }

  if (!password) {
    errors.push({
      field: 'password',
      messageAr: 'يرجى إدخال كلمة المرور',
      messageEn: 'Please enter your password',
    });
  } else if (password.length < 4) {
    errors.push({
      field: 'password',
      messageAr: 'كلمة المرور قصيرة جدًا (4رموز على الأقل)',
      messageEn: 'Password is too short (minimum 4 characters)',
    });
  }

  return errors;
}

/**
 * Authenticates a user against the enterprise system users list.
 * Never persists raw passwords to localStorage or sessionStorage.
 */
export async function authenticateUser(
  username: string,
  password: string,
  systemUsers: SystemUser[],
  preferredRole: 'rapporteur' | 'chairman' | 'regular' = 'rapporteur'
): Promise<AuthResponse> {
  const validationErrors = validateLoginCredentials(username, password);
  if (validationErrors.length > 0) {
    return {
      success: false,
      errors: validationErrors,
    };
  }

  // Simulate realistic network/authentication handshake
  await new Promise((resolve) => setTimeout(resolve, 650));

  const cleanUser = username.trim().toLowerCase();

  // Enforce username = user and password = user
  if (cleanUser !== 'user' || password !== 'user') {
    return {
      success: false,
      errors: [
        {
          field: 'general',
          messageAr: 'بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم (user) وكلمة المرور (user).',
          messageEn: 'Invalid login credentials. Please verify your username (user) and password (user).',
        },
      ],
    };
  }

  // Match user based on preferredRole or default to rapporteur / first system user
  const matchedUser =
    systemUsers.find((u) => u.role === preferredRole) ||
    systemUsers.find((u) => u.role === 'rapporteur') ||
    systemUsers[0];

  const finalUser = matchedUser || systemUsers[0];

  // Generate ephemeral non-sensitive session token (no passwords stored anywhere)
  const sessionToken = `saaed_sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;

  return {
    success: true,
    user: finalUser,
    sessionToken,
  };
}

/**
 * Handles password recovery requests with validation.
 */
export async function requestPasswordReset(identifier: string): Promise<PasswordResetResponse> {
  const trimmed = identifier.trim();
  if (!trimmed || trimmed.length < 3) {
    return {
      success: false,
      messageAr: 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني المؤسسي بشكل صحيح.',
      messageEn: 'Please enter a valid username or corporate email address.',
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    messageAr: `تم إرسال تعليمات استعادة كلمة المرور للحساب (${trimmed}) إلى البريد المؤسسي المسجل بنجاح.`,
    messageEn: `Password recovery instructions for (${trimmed}) have been sent to your registered corporate email.`,
  };
}
