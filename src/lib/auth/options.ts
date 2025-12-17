import "server-only"

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { authenticatePatientCredentials, ensurePatientProfile } from "@/lib/patients/auth"
import { registerPatientWithAdmin } from "@/lib/patients/register"

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!googleClientId || !googleClientSecret) {
  console.warn("Missing Google OAuth credentials. Google sign-in will not work until configured.")
}

export const authOptions: NextAuthOptions = {
  useSecureCookies: true,
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase()
        const password = credentials?.password ?? ""

        if (!email || !password) {
          return null
        }

        const authenticated = await authenticatePatientCredentials(email, password)
        if (!authenticated) {
          return null
        }

        return {
          id: authenticated.accountId,
          email: authenticated.email,
          name: authenticated.name,
          patientId: authenticated.patientId,
          firstName: authenticated.firstName,
          lastName: authenticated.lastName,
        }
      },
    }),
    GoogleProvider({
      clientId: googleClientId ?? "",
      clientSecret: googleClientSecret ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials" && user) {
        token.role = "patient"
        token.patientId = (user as { patientId?: string }).patientId
        token.firstName = (user as { firstName?: string }).firstName
        token.lastName = (user as { lastName?: string }).lastName
        token.name = user.name ?? token.name
      }

      if (account?.provider === "google") {
        token.role = "patient"
      }

      if ((!token.patientId || !token.firstName) && token.email) {
        const patient = await ensurePatientProfile(token.email)
        if (patient) {
          token.patientId = patient.id
          token.firstName = patient.firstName
          token.lastName = patient.lastName
          token.name = `${patient.firstName} ${patient.lastName}`.trim()
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as {
          role?: string
          patientId?: string
          firstName?: string
          lastName?: string
        }
        user.role = token.role as string | undefined
        user.patientId = token.patientId as string | undefined
        user.firstName = token.firstName as string | undefined
        user.lastName = token.lastName as string | undefined
        if (token.name) {
          session.user.name = token.name as string
        }
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google" || !user.email) {
        return
      }

      const firstName =
        (profile as { given_name?: string } | null)?.given_name ??
        user.name?.split(" ").at(0) ??
        "Patient"

      const lastName =
        ((profile as { family_name?: string } | null)?.family_name ??
          user.name?.split(" ").slice(1).join(" ")) ||
        firstName

      const result = await registerPatientWithAdmin({
        firstName,
        lastName,
        email: user.email,
      })

      if (!result.ok && result.status !== 409) {
        console.error("Unable to register patient in admin panel", result.error)
      }
    },
  },
}
