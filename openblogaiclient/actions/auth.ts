'use server';

import { signIn, signOut } from '@/auth/auth';

export async function doSocialLogin(formData: FormData) {
  const action = formData.get('action') as string;
  await signIn(action, { redirectTo: '/' });
}

export async function doLogout() {
  await signOut({ redirectTo: '/' });
}

export async function doCredentialLogin(formData: FormData) {
  try {
    const response = await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    if (response?.error) {
      throw new Error(response.error);
    }


    return { success: true };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Login failed');
  }
}