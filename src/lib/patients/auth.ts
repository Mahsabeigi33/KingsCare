import "server-only"

import bcrypt from "bcryptjs"

import { getPatientAccountByEmail, type PatientAccountRecord } from "@/lib/patients/accounts"
import { getPatientByEmail } from "@/lib/patients/register"

export type AuthenticatedPatientAccount = {
  accountId: string
  patientId: string
  email: string
  firstName: string
  lastName: string
  name: string
}

const derivePatientNames = (account: PatientAccountRecord) => {
  const fallbackName = account.email.split("@")[0] ?? "Patient"
  const firstName = account.patient?.firstName?.trim() || fallbackName
  const lastName = account.patient?.lastName?.trim() || ""
  const name = [firstName, lastName].filter(Boolean).join(" ") || fallbackName

  return { firstName, lastName, name }
}

export async function authenticatePatientCredentials(
  email: string,
  password: string,
): Promise<AuthenticatedPatientAccount | null> {
  if (!email || !password) {
    return null
  }

  const account = await getPatientAccountByEmail(email)
  if (!account?.passwordHash) {
    return null
  }

  const isValid = await bcrypt.compare(password, account.passwordHash)
  if (!isValid) {
    return null
  }

  const { firstName, lastName, name } = derivePatientNames(account)

  return {
    accountId: account.id,
    patientId: account.patientId,
    email: account.email,
    firstName,
    lastName,
    name,
  }
}

export async function ensurePatientProfile(email: string | null | undefined) {
  if (!email) return null
  return getPatientByEmail(email)
}
