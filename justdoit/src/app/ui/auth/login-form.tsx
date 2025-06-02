import FormInput, { Button, FormCard } from "@/app/ui/auth/form-elements";

export default function LoginForm() {
    return (
        <FormCard>
            <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="example@example.com"
                required
            />
            <FormInput
                id="password"
                name="password"
                type="password"
                label="Password"
                required
            />
            <Button label="Sign In" />
        </FormCard>


    )
}
