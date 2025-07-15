'use client';

import FormInput, { Button, FormCard } from "@/app/ui/auth/form-elements";
import { useAuth } from "@/contexts/AuthContext";
import { redirect, useRouter } from "next/navigation";

const fields = [
	{
		id: "name",
		name: "name",
		type: "text",
		label: "Full Name",
		placeholder: "John Doe",
		required: true,
	},
	{
		id: "email",
		name: "email",
		type: "email",
		label: "Email",
		placeholder: "name@example.com",
		required: true,
	},
	{
		id: "password",
		name: "password",
		type: "password",
		label: "Password",
		required: true,
	},
	{
		id: "confirmPassword",
		name: "confirmPassword",
		type: "password",
		label: "Confirm Password",
		required: true,
	},
];

export default function RegisterForm() {

	const {signup} = useAuth();
		const router = useRouter()

	function HandleSignup(){
		const name : string = document.getElementById("name")?.value;
		const email: string = document.getElementById("email")?.value;
		const password: string = document.getElementById("password")?.value;

		if(signup){
			signup(email, password, name)
			.then(() => {
				alert("You have successfully signed up!")
				router.back()
			})
		}else{
			console.log("signup not defined")
		}
	}

	return (
		<FormCard onSubmit={HandleSignup}>
			{fields.map((field) => (
				<FormInput key={field.id} {...field} />
			))}
			<Button label="Create Account" />
		</FormCard>
	);
}
