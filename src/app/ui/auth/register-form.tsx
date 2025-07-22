"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FormInput, { Button, FormCard } from "@/app/ui/auth/form-elements";
import { useAuth } from "@/contexts/AuthContext";

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

/**
 * Registration form component with account creation and user feedback.
 * Handles signup with name, email, password confirmation, displays status messages,
 * and navigates back to previous page on successful account creation.
 */

export default function RegisterForm() {
  const [message, setMessage] = useState<{
    message: string;
    success: boolean;
    update: boolean;
  }>({
    message: "",
    success: false,
    update: false,
  });

  const { signup } = useAuth();
  const router = useRouter();

  function HandleSignup() {
    setMessage({
      message: message.message,
      success: message.success,
      update: false,
    });

    const name: string = document.getElementById("name")?.value;
    const email: string = document.getElementById("email")?.value;
    const password: string = document.getElementById("password")?.value;

    if (signup) {
      signup(email, password, name)
        .then(() => {
          setMessage({
            message: "Successfully signed in! Redirecting you...",
            success: true,
            update: true,
          });
          setTimeout(() => router.back(), 2000);
          // next line is because router.back() uses cache and doesn't revalidate the page
          setTimeout(() => router.refresh(), 2100);
        })
        .catch(() => {
          setMessage({
            message: "Failed to sign up! Please try again.",
            success: false,
            update: true,
          });
        });
    } else {
      setMessage({
        message: "Failed to sign up! Please try again.",
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
      <FormCard onSubmit={HandleSignup}>
        {fields.map((field) => (
          <FormInput key={field.id} {...field} />
        ))}
        <Button label="Create Account" />
      </FormCard>
    </>
  );
}
