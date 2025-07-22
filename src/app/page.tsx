import Link from "next/link";
import Card from "@/components/Footer";
import { getCurrentUser } from "@/lib/api/auth-helpers";

/**
 * Main application entry point and landing page with authentication-aware navigation.
 * Serves as the primary gateway, directing authenticated users to projects and
 * unauthenticated users to registration/login flows with app branding.
 */
export default async function Home() {

  const user = await getCurrentUser();


  return (
    <div className="bg-black-200 flex flex-col justify-center items-center w-full h-screen">
      <h1 className="text-6xl font-bold mb-5">Just do IT ▲</h1>
      <h3>Kanban for the masses</h3>
      {user ? (
        <Link
          href="/projects"
          className="mt-5 text-blue-500 hover:text-blue-700"
        >
          Projects
        </Link>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="mt-5 text-blue-500 hover:text-blue-700"
          >
            Login
          </Link>
          <Link href="/auth/register" className="mt-5 text-blue-500 hover:text-blue-700">
            Register
          </Link>
        </>
      )}

      <Card />
    </div>
  );
}
