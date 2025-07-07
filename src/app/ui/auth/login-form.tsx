'use client';

import FormInput, { Button, FormCard } from "@/app/ui/auth/form-elements";
import { useAuth } from "@/contexts/AuthContext";
import { redirect, RedirectType } from "next/navigation";

const fields = [
	{
		id: "email",
		name: "email",
		type: "email",
		label: "Email",
		placeholder: "example@example.com",
		required: true,
	},
	{
		id: "password",
		name: "password",
		type: "password",
		label: "Password",
		required: true,
	},
];

export default function LoginForm() {

	const {login} = useAuth();
	
	function HandleLogin(){
		const email: string = document.getElementById("email")?.value;
		const password: string = document.getElementById("password")?.value;

		if(login){
			login(email, password)
			.then(res => {
				alert("You have successfully logged in!")
				redirect("/", RedirectType.replace)
			}).catch(err => {
				alert(err)
			})
		}else{
			console.log("signup not defined")
		}
	}

	return (
		<FormCard onSubmit={HandleLogin}>
			{fields.map((field) => (
				<FormInput key={field.id} {...field} />
			))}
			<Button label="Sign In"/>
		</FormCard>
	);
}
