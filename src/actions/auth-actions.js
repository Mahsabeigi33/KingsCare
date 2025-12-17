'use server';

import { redirect } from 'next/navigation';

import { verifyPassword } from '@/lib/hash';
import { createUser, DuplicateUserError, getUserByEmail } from '@/lib/user';

export async function signup(formData) {
  const payload = normalizeSignupPayload(formData);

  const errors = validateSignupForm(payload);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const fullName = `${payload.firstName} ${payload.lastName}`.trim();
    await createUser({
      name: fullName,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
    });

    return { success: true, redirectUrl: '/login' };
  } catch (error) {
    if (error instanceof DuplicateUserError) {
      return { errors: { email: 'Email already in use.' } };
    }

    console.error('Signup failed:', error);
    return { errors: { general: 'An error occurred during sign up.' } };
  }
}

export async function login(formData) {
  const payload = normalizeLoginPayload(formData);

  const errors = validateLoginForm(payload);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const existingUser = await getUserByEmail(payload.email);
    if (!existingUser) {
      return {
        errors: {
          email: 'Could not authenticate user, please check your credentials.',
        },
      };
    }

    const isValidPassword = await verifyPassword(payload.password, existingUser.passwordHash);
    if (!isValidPassword) {
      return {
        errors: {
          password: 'Could not authenticate user, please check your credentials.',
        },
      };
    }

    redirect('/user/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    return { errors: { general: 'Unexpected error occurred during login.' } };
  }
}

function normalizeSignupPayload(formData) {
  if (typeof FormData !== 'undefined' && formData instanceof FormData) {
    return {
      firstName: (formData.get('firstName') ?? '').toString().trim(),
      lastName: (formData.get('lastName') ?? '').toString().trim(),
      email: (formData.get('email') ?? '').toString().trim(),
      phone: (formData.get('phone') ?? '').toString().trim(),
      password: (formData.get('password') ?? '').toString(),
      confirmPassword: (formData.get('confirmPassword') ?? '').toString(),
    };
  }

  return {
    firstName: (formData.firstName ?? '').toString().trim(),
    lastName: (formData.lastName ?? '').toString().trim(),
    email: (formData.email ?? '').toString().trim(),
    phone: (formData.phone ?? '').toString().trim(),
    password: (formData.password ?? '').toString(),
    confirmPassword: (formData.confirmPassword ?? '').toString(),
  };
}

function normalizeLoginPayload(formData) {
  if (typeof FormData !== 'undefined' && formData instanceof FormData) {
    return {
      email: (formData.get('email') ?? '').toString().trim(),
      password: (formData.get('password') ?? '').toString(),
    };
  }

  return {
    email: (formData.email ?? '').toString().trim(),
    password: (formData.password ?? '').toString(),
  };
}

function validateSignupForm(payload) {
  const errors = {};

  if (!payload.firstName) {
    errors.firstName = 'First name is required';
  }
  if (!payload.lastName) {
    errors.lastName = 'Last name is required';
  }
  if (!payload.email) {
    errors.email = 'Email is required';
  } else if (!payload.email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
  }
  if (payload.password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }
  if (payload.password !== payload.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

function validateLoginForm(payload) {
  const errors = {};

  if (!payload.email) {
    errors.email = 'Email is required';
  }

  if (!payload.password) {
    errors.password = 'Password is required';
  }

  return errors;
}