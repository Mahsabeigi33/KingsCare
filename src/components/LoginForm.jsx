'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formState;

    setErrors({});
    setIsSubmitting(true);

    const callbackUrl =
      searchParams?.get('callbackUrl') ??
      searchParams?.get('next') ??
      process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT ??
      '/user/profile';

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        setErrors({ general: 'Invalid email or password.' });
      } else {
        setErrors({ general: 'Unable to sign in right now. Please try again.' });
      }
    } else if (result?.ok) {
      router.push(result.url ?? callbackUrl);
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    try {
      setIsGoogleSubmitting(true);
      await signIn('google', {
        callbackUrl: process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT ?? '/',
      });
    } catch (error) {
      console.error('Google sign-in failed', error);
      setErrors({ general: 'Google sign-in failed. Please try again.' });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <section
      className="w-full h-screen  text-gray-900 flex items-center justify-center bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('website/login.png')" }}
    >
      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 relative"
        style={{ backgroundColor: 'rgb(3 7 18 / 50%)' }}
      >
        <div className="relative z-30 w-full py-6 opacity-100">
          <h1 className="text-white font-bold text-2xl my-6">Login Kings Care Medical Clinic</h1>
          <div className="flex items-center justify-center">
            <button 
              onClick={handleGoogle}
              disabled={isGoogleSubmitting}
              className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-white hover:border-slate-400 hover:text-[#D9C89E] hover:shadow transition duration-150"
            >
              <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google logo" />
              <span>{isGoogleSubmitting ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
          </div>
          <div className="my-12 border-b text-center">
            <div className="leading-none px-2 inline-block text-xlg tracking-wide font-bold text-white">
              Or Login with e-mail
            </div>
          </div>
          <form onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
            <div className="pb-2 pt-4 text-left">
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="block w-full p-4 text-lg rounded-sm bg-gray-200"
              />
              {errors.email && <p className="mt-2 text-sm text-red-200">{errors.email}</p>}
            </div>
            <div className="pb-2 pt-4 text-left">
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleInputChange}
                className="block w-full p-4 text-lg rounded-sm bg-gray-200"
                placeholder="Password"
              />
              {errors.password && <p className="mt-2 text-sm text-red-200">{errors.password}</p>}
            </div>
            {errors.general && (
              <ul>
                <li className="text-white bg-red-600 text-xl">{errors.general}</li>
              </ul>
            )}
            {searchParams?.get('registered') && (
              <p className="mt-4 text-sm text-green-200">
                Account created successfully. Please log in with your email and password.
              </p>
            )}
            <div className="text-right text-[#D9C89E]">
              <Link href="/login/forgot-password">Forgot your password?</Link>
            </div>
            <div className="px-4 pb-2 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="uppercase block w-full p-4 text-lg rounded-xl bg-[#0E2A47] hover:bg-[#4B5563] text-white"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="mt-4 text-gray-300">
            <p>
              Don't have an account?{' '}
              <Link href="/login/register" className="text-[#D9C89E] hover:text-white">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}





