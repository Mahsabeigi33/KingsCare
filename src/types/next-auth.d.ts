import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      role?: string
      patientId?: string
      firstName?: string
      lastName?: string
    }
  }

  interface User {
    patientId?: string
    firstName?: string
    lastName?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    patientId?: string
    firstName?: string
    lastName?: string
  }
}
