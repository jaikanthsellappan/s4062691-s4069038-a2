import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery } from "@apollo/client";
import { VALIDATE_ADMIN_LOGIN } from "../services/api"

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const [checkAdminLogin] = useLazyQuery(VALIDATE_ADMIN_LOGIN, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data.validateAdminLogin && password === "admin") {
                localStorage.setItem("isAdminAuthenticated", "true");
                router.push("/dashboard");
            } else {
                alert("Invalid credentials");
            }
        },
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return alert("Please enter credentials.");
        checkAdminLogin({ variables: { email: username } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-purple-500">
            <div className="bg-white shadow-xl rounded-md flex overflow-hidden max-w-4xl w-full">
                {/* Login form */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Admin Login</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Enter admin credentials to continue.
                    </p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full p-2 border border-gray-300 rounded placeholder:text-gray-500 text-gray-800"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-2 border border-gray-300 rounded placeholder:text-gray-500 text-gray-800"
                        />
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                        >
                            Login
                        </button>
                    </form>
                </div>

                {/* Illustration image */}
                <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-4">
                    <img
                        src="https://plus.unsplash.com/premium_vector-1683134311669-efed56570b2d?w=900&auto=format&fit=crop&q=60"
                        alt="Admin Login Illustration"
                        className="w-full h-auto object-contain rounded"
                    />
                </div>
            </div>
        </div>
    );
}
