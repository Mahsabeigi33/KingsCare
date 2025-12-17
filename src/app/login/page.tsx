import LoginForm from "@/components/LoginForm"
import { Suspense } from "react";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Patient Login",
}

export default function LoginPage() {

  return (
      <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
        <LoginForm />
      </Suspense>
  );
}
