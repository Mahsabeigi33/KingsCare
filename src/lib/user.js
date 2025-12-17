import bcrypt from "bcryptjs"

import {
  getPatientByEmail,
  registerPatientWithAdmin,
 // type AdminPatient,
} from "@/lib/patients/register"
import { createPatientAccount, getPatientAccountByEmail } from "@/lib/patients/accounts"

export class DuplicateUserError extends Error {
  constructor(message = "Email already in use.") {
    super(message)
    this.name = "DuplicateUserError"
    this.code = "DUPLICATE_USER"
  }
}

export async function createUser({
  name,
  email,
  password,
  phone,
}) {
  if (!email) {
    throw new Error("Email is required to create a user.")
  }
  if (!password) {
    throw new Error("Password is required to create a user.")
  }

  const existingAccount = email ? await getPatientAccountByEmail(email) : null
  if (existingAccount) {
    throw new DuplicateUserError()
  }

  const [firstNameRaw, ...rest] = (name ?? "").trim().split(/\s+/).filter(Boolean)
  const firstName = firstNameRaw || "Patient"
  const lastName = rest.join(" ") || firstName

  const patientResult = await registerPatientWithAdmin({
    firstName,
    lastName,
    email,
    phone: phone?.trim() ? phone.trim() : undefined,
  })

  //let patientRecord: AdminPatient | null = null
  if (!patientResult.ok) {
    throw new Error(patientResult.error ?? "Failed to register patient with admin API.")
  }

  if (patientResult.duplicated) {
    patientRecord = await getPatientByEmail(email)
    if (!patientRecord) {
      throw new DuplicateUserError()
    }
  } else {
    patientRecord = null //(patientResult.data as AdminPatient | null) ?? null
  }

  if (!patientRecord) {
    patientRecord = await getPatientByEmail(email)
  }

  if (!patientRecord) {
    throw new Error("Unable to locate patient record after registration.")
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await createPatientAccount({
    patientId: patientRecord.id,
    email,
    passwordHash,
  })

  return {
    id: patientRecord.id,
    email,
    firstName: patientRecord.firstName,
    lastName: patientRecord.lastName,
  }
}

export async function getUserByEmail(email) {
  if (!email) return null
  const account = await getPatientAccountByEmail(email)
  if (!account) return null
  return account
}
