"use client"
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center m-4">
      <h1 className="text-3xl my-3">Hey, time to Sign In</h1>
      <LoginForm />
      <p className="my-3">
        Don’t have an account?{' '}
        <Link href="/register" className="mx-2 underline">
          Register
        </Link>
      </p>
      testing something
    </div>
  );
}