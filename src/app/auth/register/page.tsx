import Link from "next/link";
import RegisterForm from "@/app/ui/auth/register-form";

export default function RegisterPage() {
	return (
		<>
			<div className="text-center">
				<h1 className="text-3xl font-extrabold tracking-tight">
					Create your account
				</h1>
				<p className="mt-2 text-sm">
					Already have an account?{" "}
					<Link
						href="/auth/login"
						className="font-medium text-blue-600 hover:text-blue-500"
					>
						Sign in here
					</Link>
				</p>
			</div>
			<RegisterForm />
		</>
	);
}
