"use client"

import type {
  ChangeEvent,
  FormEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react"
import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  notes: string
}

type ToastTone = "success" | "error" | "info"

type ToastState = {
  message: string
  tone: ToastTone
}

const toneStyles: Record<ToastTone, string> = {
  success: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
  error: "border-rose-400/40 bg-rose-500/15 text-rose-100",
  info: "border-cyan-400/40 bg-cyan-500/15 text-cyan-100",
}

export function EditPatientDetails({
  initialValues,
}: {
  initialValues: FormValues
}) {
  const router = useRouter()
  const normalizedInitial = useMemo(
    () => ({
      firstName: initialValues.firstName.trim(),
      lastName: initialValues.lastName.trim(),
      email: initialValues.email.trim(),
      phone: initialValues.phone.trim(),
      dob: initialValues.dob,
      notes: initialValues.notes.trim(),
    }),
    [
      initialValues.dob,
      initialValues.email,
      initialValues.firstName,
      initialValues.lastName,
      initialValues.notes,
      initialValues.phone,
    ],
  )

  const [formValues, setFormValues] = useState<FormValues>(normalizedInitial)
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setFormValues(normalizedInitial)
  }, [normalizedInitial])

  useEffect(() => {
    if (!toast) return

    const timeout = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timeout)
  }, [toast])

  const handleChange =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setFormValues((current) => ({
        ...current,
        [field]: value,
      }))
    }

  const closeAndReset = () => {
    setIsOpen(false)
    setFormValues(normalizedInitial)
  }

  const showToast = (message: string, tone: ToastTone) => {
    setToast({ message, tone })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving) return

    const trimmedFirstName = formValues.firstName.trim()
    const trimmedLastName = formValues.lastName.trim()

    if (!trimmedFirstName) {
      showToast("First name cannot be empty.", "error")
      return
    }

    if (!trimmedLastName) {
      showToast("Last name cannot be empty.", "error")
      return
    }

    const updates: Record<string, string | null> = {}

    if (trimmedFirstName !== normalizedInitial.firstName) {
      updates.firstName = trimmedFirstName
    }

    if (trimmedLastName !== normalizedInitial.lastName) {
      updates.lastName = trimmedLastName
    }

    const trimmedEmail = formValues.email.trim()
    if (trimmedEmail !== normalizedInitial.email) {
      updates.email = trimmedEmail.length > 0 ? trimmedEmail : null
    }

    const trimmedPhone = formValues.phone.trim()
    if (trimmedPhone !== normalizedInitial.phone) {
      updates.phone = trimmedPhone.length > 0 ? trimmedPhone : null
    }

    if (formValues.dob !== normalizedInitial.dob) {
      updates.dob = formValues.dob.length > 0 ? formValues.dob : null
    }

    const trimmedNotes = formValues.notes.trim()
    if (trimmedNotes !== normalizedInitial.notes) {
      updates.notes = trimmedNotes.length > 0 ? trimmedNotes : null
    }

    if (Object.keys(updates).length === 0) {
      showToast("No changes detected.", "info")
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch("/api/patient/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        const message = result?.error ?? "Unable to update profile."
        throw new Error(message)
      }

      showToast("Profile updated successfully.", "success")
      closeAndReset()
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      console.error("Profile update failed", error)
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to update profile right now.",
        "error",
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/20 hover:text-cyan-50"
        onClick={() => setIsOpen(true)}
      >
        Edit details
      </button>

      {isOpen ? (
        <div className="fixed  flex items-center justify-center bg-slate-850/60 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/90 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Update your profile
                </h3>
                <p className="text-sm text-slate-300">
                  Keep your contact details current so our care team can reach
                  you quickly.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAndReset}
                className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-white/10 px-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-rose-400/40 hover:bg-rose-500/20 hover:text-rose-50"
              >
                Close
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="First name"
                  inputProps={{
                    name: "firstName",
                    value: formValues.firstName,
                    onChange: handleChange("firstName"),
                    required: true,
                  }}
                />
                <Field
                  label="Last name"
                  inputProps={{
                    name: "lastName",
                    value: formValues.lastName,
                    onChange: handleChange("lastName"),
                    required: true,
                  }}
                />
              </div>

              <Field
                label="Email"
                inputProps={{
                  name: "email",
                  type: "email",
                  value: formValues.email,
                  onChange: handleChange("email"),
                }}
                hint="We use this email to send appointment updates."
              />

              <Field
                label="Phone number"
                inputProps={{
                  name: "phone",
                  type: "tel",
                  value: formValues.phone,
                  onChange: handleChange("phone"),
                }}
                hint="Include your country code if you travel frequently."
              />

              <Field
                label="Date of birth"
                inputProps={{
                  name: "dob",
                  type: "date",
                  value: formValues.dob,
                  onChange: handleChange("dob"),
                }}
              />

              <Field
                label="Care notes"
                textarea
                textareaProps={{
                  name: "notes",
                  value: formValues.notes,
                  onChange: handleChange("notes"),
                  rows: 4,
                }}
                hint="List allergies, medications, or preferences you'd like our team to remember."
              />

              <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/10 px-5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/20"
                  onClick={closeAndReset}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/20 px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:border-cyan-300/60 hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-400"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-auto fixed bottom-6 right-6 z-[60] max-w-xs">
          <div
            role="status"
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-xl ${toneStyles[toast.tone]}`}
          >
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-xs uppercase tracking-[0.3em] text-white/70 transition hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

function Field({
  label,
  hint,
  inputProps,
  textarea,
  textareaProps,
}: {
  label: string
  hint?: string
  textarea?: boolean
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-200">
      <span>{label}</span>
      {textarea ? (
        <textarea
          {...textareaProps}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-500/30"
        />
      ) : (
        <input
          {...inputProps}
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-500/30"
        />
      )}
      {hint ? (
        <span className="block text-xs font-normal text-slate-400">{hint}</span>
      ) : null}
    </label>
  )
}
