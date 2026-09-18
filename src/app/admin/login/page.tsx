import { connection } from "next/server";
import { adminConfigured } from "@/lib/auth";
import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  await connection(); // read env at request time, not build time
  const configured = adminConfigured();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy-950 p-6">
      <div className="w-full max-w-md rounded-3xl bg-ivory p-8 md:p-10">
        <div className="rounded-2xl bg-navy-950 p-4">
          <Logo />
        </div>
        <h1 className="mt-8 text-4xl text-navy-900">Admin sign in</h1>
        {configured ? (
          <LoginForm />
        ) : (
          <div role="alert" className="mt-6 rounded-2xl border border-gold-500/40 bg-white p-5 text-sm leading-relaxed text-stone">
            <p className="font-semibold text-navy-900">CONFIGURATION REQUIRED</p>
            <p className="mt-2">
              Set <code>ADMIN_PASSWORD</code> (at least 10 characters) and <code>ADMIN_SESSION_SECRET</code> (at least 32 random characters) in <code>.env.local</code> or your host&apos;s environment settings, then restart the server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
