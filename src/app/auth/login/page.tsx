import Link from "next/link";
import LoginForm from "@/app/ui/auth/login-form";
/**
 * Login page component with authentication form and registration link.
 * Simple layout with centered content and navigation to account creation.
 */

export default function LoginPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Sign in to your account
        </h1>
        <p className="mt-2 text-sm">
          Or{" "}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </Link>
        </p>
      </div>
      <LoginForm />
    </>
  );
}
