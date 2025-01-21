"use client";

import React from "react";
import LoginForm from "@/components/login-form";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { IoMail, IoLockClosed } from "react-icons/io5";
import { loginUser } from "@/services/authService"
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";


const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().default(false),
});

const SignIn: React.FC = () => {
    const router = useRouter();
    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            toast.success("Login successful!");
            router.push("/");
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error.message || "Login failed, please try again.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-full max-w-lg p-8 border rounded-lg">
                    <h2 className="text-center text-xl font-semibold mb-4">Login</h2>
                    <LoginForm
                        schema={loginSchema}
                        defaultValues={{
                            email: "",
                            password: "",
                            rememberMe: false,
                        }}
                        onSubmit={onSubmit}
                        fields={[
                            {
                                name: "email",
                                placeholder: "Email Address",
                                type: "email",
                                icon: IoMail,
                            },
                            {
                                name: "password",
                                placeholder: "Password",
                                type: "password",
                                icon: IoLockClosed,
                            },
                        ]}
                        buttonProps={{
                            children: "Login",
                            type: "submit",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SignIn;
