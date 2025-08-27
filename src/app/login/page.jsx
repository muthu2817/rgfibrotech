"use client";
import { useState } from "react";
import Image from "next/image";
import logo from '../../../public/logo.png';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { login, fetchUserInfo } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const userinfo = useSelector((state) => state.auth.user);

    // Simple client-side validation
    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }
        if (!password) {
            newErrors.password = "Password is required";
        }
        return newErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            try {
                // login returns a promise (thunk)
                await dispatch(login({ email, password })).unwrap();
                // If login is successful, call fetchUserInfo
                await dispatch(fetchUserInfo()).unwrap();
                console.log(userinfo);
            } catch (err) {
                // Optionally, set error message here
                setErrors({ form: err || "Login failed" });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6]">
            <div className="p-8 rounded-2xl  bg-white  w-[400px] border-grey-200 border-1">
                <div>
                    <Image src={logo} alt="dummy logo" className="w-[200px] m-auto" />
                </div>

                <form onSubmit={handleLogin} className="flex flex-col justify-between h-[300px] pt-10">

                    <div className="space-y-6 mx-auto">
                    {/* Email Input */}
                    <div>
                        <label className="block text-stone-900 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Mail Id"
                            className="w-[290px] border border-white/20 px-4 py-2 rounded-md placeholder-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <label className="block text-stone-900 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-[290px] border border-white/20 px-4 py-2 rounded-md bg-white/5 text-stone-800 placeholder-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="cursor-pointer absolute right-2 top-10 text-sm text-emerald-300 hover:text-emerald-200 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                        </button>
                        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>
                    </div>
                    {/* submit button */}
                    <button
                        type="submit"
                        className="cursor-pointer w-[60%] bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2 rounded-full hover:from-emerald-500 hover:to-green-500 transition block mx-auto shadow-lg shadow-emerald-900/30"
                    >
                        Login
                    </button>
                    {errors.form && <p className="text-red-400 text-center mt-2">{errors.form}</p>}
                </form>
            </div>
        </div>
    );
}
