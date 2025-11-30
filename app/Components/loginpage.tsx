import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import axiosClient from "../axios/axios";
const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const [serverError, setServerError] = useState("");
    const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
	async function onSubmit(values: LoginForm) {
		try {
			const data = await axiosClient.post("/auth/login", { username: values.username, password: values.password });
			const token = (data as any)?.accessToken || (data as any)?.token;
			if (token) localStorage.setItem("accessToken", token);
			setServerError("");
			router.push("/home");
		} catch (err: any) {
			setServerError(err?.response?.data?.message || "Login failed");
		}
	}

	return (
		<div style={{ backgroundImage: "url(/wallpaper.jpg)" }} className="min-h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center transition-cubic-bezier(0.4, 0, 0.2, 1) duration-300 ease-in-out">
			<div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden">
				<div className="hidden md:block relative">
					<CldImage src="/banner.jpg" alt="Banner" fill className="object-cover object-top" priority />
				</div>
				{/* Form block */}
				<div className="bg-[#f4fbf8] p-8 md:p-12">
					<h2 className="text-2xl font-semibold text-[#e9632c]">Sign in to your account</h2>
					<p className="mt-2 text-sm text-black">Enter your credentials below.</p>
					{serverError && <p className="mt-3 text-sm text-red-600">{serverError}</p>}
					<form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
							<input
								{...register("username")}
								className={`mt-1 block w-full px-3 py-2 bg-[#daede9] border border-[#cbd1d0] rounded-md shadow-sm placeholder:text-slate-400 text-slate-100 transition-all duration-200 ease-in-out focus:border-[#2a2a2a] focus:ring-1 focus:ring-[#e9632c] ${errors.username ? "ring-1 ring-rose-500" : ""}`}
								placeholder="your_username"
								type="text"
								autoComplete="username"
							/>
							{errors.username && <p className="text-rose-500 text-sm mt-1">{errors.username.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
							<input
								{...register("password")}
								className={`mt-1 block w-full px-3 py-2 bg-[#daede9] border border-[#cbd1d0] rounded-md shadow-sm placeholder:text-slate-400 text-slate-100 transition-all duration-200 ease-in-out focus:border-[#2a2a2a] focus:ring-1 focus:ring-[#e9632c] ${errors.password ? "ring-1 ring-rose-500" : ""}`}
								placeholder="Your password"
								type="password"
								autoComplete="current-password"
							/>
							{errors.password && <p className="text-rose-500 text-sm mt-1">{errors.password.message}</p>}
						</div>
						<div className="flex items-center justify-between">
							<label className="inline-flex items-center text-sm text-slate-700 dark:text-slate-200">
								<input type="checkbox" {...register("remember")} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
								<span className="ml-2">Remember me</span>
							</label>

							<a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
						</div>
						<div>
							<button
							type="submit"
							disabled={isSubmitting}
							className="w-full inline-flex items-center justify-center rounded-md bg-[#e9632c] text-white px-4 py-2 font-medium shadow hover:opacity-95 transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Signing in..." : "Sign in"}
						</button>
						</div>
					</form>
					<p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
						New to Wonder Music? <a href="/signup" className="text-indigo-600 hover:underline">Create an account</a>
					</p>
				</div>
			</div>
		</div>
	);
}

