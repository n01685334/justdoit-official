"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FormInput, { Button, FormCard } from "@/app/ui/auth/form-elements";
import { useAuth } from "@/contexts/AuthContext";

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
/**
 * Login form component with authentication integration and user feedback.
 * Handles form submission, displays success/error messages, and redirects
 * to projects page on successful authentication with loading states.
 */

export default function LoginForm() {
  const [message, setMessage] = useState<{
    message: string;
    success: boolean;
    update: boolean;
  }>({
    message: "",
    success: false,
    update: false,
  });

  const { login } = useAuth();
  const router = useRouter();

  function HandleLogin() {
    setMessage({
      message: message.message,
      success: message.success,
      update: false,
    });

    const email: string = document.getElementById("email")?.value;
    const password: string = document.getElementById("password")?.value;

    if (login) {
      login(email, password)
        .then(() => {
          setMessage({
            message: "Successfully logged in! Redirecting you...",
            success: true,
            update: true,
          });
          setTimeout(() => {
            router.push("/projects")
            router.refresh();
          }, 2000);
        })
        .catch(() => {
          setMessage({
            message: "Failed to log in! Please try again.",
            success: false,
            update: true,
          });
        });
    } else {
      setMessage({
        message: "Failed to log in! Please try again.",
        success: false,
        update: true,
      });
    }
  }

  return (
    <>
      {message.update && (
        <div
          className={
            message.success
              ? "p-4 rounded-md bg-green-800"
              : "p-4 rounded-md bg-red-800"
          }
        >
          {message.message}
        </div>
      )}
      <FormCard onSubmit={HandleLogin}>
        {fields.map((field) => (
          <FormInput key={field.id} {...field} />
        ))}
        <Button label="Sign In" />
      </FormCard>
    </>
  );
}
