import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuthHealth() {
  const session = await getServerSession(authOptions);
  return (
    <pre className="mx-auto max-w-2xl p-6 text-sm overflow-auto bg-slate-50 border rounded">
{JSON.stringify({ ok: true, user: session?.user ?? null }, null, 2)}
    </pre>
  );
}

