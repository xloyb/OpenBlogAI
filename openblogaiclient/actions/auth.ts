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

export async function doCredentialRegister(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Call the server's registration API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_BASE_URL || 'http://localhost:8082'}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return { success: true, message: data.message };
  } catch (err) {
    if (err instanceof Error) {
      // Handle specific error cases
      if (err.message.includes('User already exists')) {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      }
      throw new Error(err.message);
    }
    throw new Error('Registration failed. Please try again.');
  }
}