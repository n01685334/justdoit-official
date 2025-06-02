import FormInput, { Button, FormCard } from "@/app/ui/auth/form-elements";

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
    return (
        <FormCard>
            {fields.map((field) => (
                <FormInput key={field.id} {...field} />
            ))}
            <Button label="Sign In" />
        </FormCard>
    );
}
