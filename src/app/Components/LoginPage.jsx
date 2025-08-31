"use client";
import { useState } from "react";
import Image from "next/image";
import logo from '../../../public/logo.png';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { login } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const loginDispatch = useDispatch();

    //login field validation part
    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        loginDispatch(login({email,password}));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="p-8 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 w-[400px]">
                <div>
                    <Image src={logo} alt="dummy logo" className="w-[200px] m-auto" />
                </div>

                <form onSubmit={handleLogin} className="flex flex-col justify-between h-[300px] pt-10">

                    <div className="space-y-6 mx-auto">
                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-200 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Mail Id"
                            className="w-[290px] border border-white/20 px-4 py-2 rounded-md bg-white/5 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <label className="block text-gray-200 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-[290px] border border-white/20 px-4 py-2 rounded-md bg-white/5 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="cursor-pointer absolute right-2 top-10 text-sm text-emerald-300 hover:text-emerald-200 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                        </button>
                    </div>
                    </div>
                    {/* submit button */}
                    <button
                        type="submit"
                        className="cursor-pointer w-[100%] bg-[#005ACF]  text-white py-2 rounded-full hover:from-emerald-500 hover:to-green-500 transition block mx-auto shadow-lg shadow-emerald-900/30"
                    >
                        Login
                    </button>

                </form>
            </div>
        </div>

    );
}
