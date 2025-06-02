import FormInput, { Button, FormCard } from "@/app/ui/auth/form-elements";

export default function RegisterForm() {
  return (
    <FormCard>
      {/* TODO: maybe have separate inputs for first and last name? */}
      <FormInput
        id="name"
        name="name"
        type="text"
        label="Full Name"
        placeholder="John Doe"
        required
      />
      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="name@example.com"
        required
      />
      <FormInput
        id="password"
        name="password"
        type="password"
        label="Password"
        required
      />
      <FormInput
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        required
      />
      <Button label="Create Account" />
    </FormCard>

  );
}