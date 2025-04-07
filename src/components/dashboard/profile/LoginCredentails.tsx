"use client"
import React from 'react'
import H4Title from "@/components/typography/h4";
import Link from "next/link";
import { toast } from "@/hooks/use-toast"

const LoginCredentails = () => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied",
            description: `${label} copied to clipboard`,
        })

    }
    return (
        <div className="max-w-5xl mx-auto px-2 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Webmail Card */}
                <div className="bg-white rounded-2xl shadow-md p-3 transition-all hover:shadow-xl">
                    <H4Title>Webmail</H4Title>
                    <Link
                        href="https://webmail-oxcs.networksolutionsemail.com/appsuite/?user_domain=mail.dolcefrutti.com"
                        className="inline-block mt-3 bg-black text-gold hover:bg-gold hover:text-black px-4 py-2 rounded-lg transition-colors"
                    >
                        Click Here For Webmail
                    </Link>
                    <div className="mt-6 space-y-2 text-gray-800">
                        <p>
                            <strong>User Mail:</strong>{' '}
                            <span
                                className="cursor-pointer transition"
                                onClick={() => handleCopy('abc@dolcefrutti.com', 'Email')}
                            >
                                abc@dolcefrutti.com
                            </span>
                        </p>
                        <p>
                            <strong>Password:</strong>{' '}
                            <span
                                className="cursor-pointer transition"
                                onClick={() => handleCopy('UPI*9325abc', 'Password')}
                            >
                                UPI*9325abc
                            </span>
                        </p>
                    </div>
                </div>

                {/* Clockin Card */}
                <div className="bg-white rounded-2xl shadow-md p-6 transition-all hover:shadow-xl">
                    <H4Title>Clockin</H4Title>
                    <Link
                        href="https://apps.timeclockwizard.com/Login?subDomain=unitedproviders"
                        className="inline-block mt-4 bg-black text-gold hover:bg-gold hover:text-black px-4 py-2 rounded-lg transition-colors"
                    >
                        Click Here For Clockin
                    </Link>
                    <div className="mt-6 space-y-2 text-gray-800">
                        <p>
                            <strong>User Name:</strong>{' '}
                            <span
                                className="cursor-pointer transition"
                                onClick={() => handleCopy('Abc', 'Username')}
                            >
                                Abc
                            </span>
                        </p>
                        <p>
                            <strong>Password:</strong>{' '}
                            <span
                                className="cursor-pointer transition"
                                onClick={() => handleCopy('UPI*9325abc', 'Password')}
                            >
                                UPI*9325abc
                            </span>
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6 transition-all hover:shadow-xl">
                    <H4Title>Zoom Meeting</H4Title>
                    <Link
                        href="https://zoom.us/signin#/login"
                        className="inline-block mt-4 bg-black text-gold hover:bg-gold hover:text-black px-4 py-2 rounded-lg transition-colors"
                    >
                        Click Here For Zoom
                    </Link>
                    <div className="mt-6 space-y-2 text-gray-800">
                        <p>
                            <strong>Meeting Id:</strong>{' '}
                            <span
                                className="cursor-pointer transition"
                                onClick={() => handleCopy('760.786.7786', 'Username')}
                            >
                                760.786.7786
                            </span>
                        </p>
                        <p>
                            <strong>Password:</strong>{' '}
                            <span
                                className="cursor-pointer transition"
                                onClick={() => handleCopy('frutti', 'Password')}
                            >
                                frutti
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginCredentails
