import FormInput, { Button, FormCard } from "@/app/ui/auth/form-elements";

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
  return (
    <FormCard>
      {fields.map((field) => (
        <FormInput key={field.id} {...field} />
      ))}
      <Button label="Create Account" />
    </FormCard>
  );
}