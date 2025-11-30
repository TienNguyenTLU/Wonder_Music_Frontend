import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import axiosClient from "../axios/axios";
const signupSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		displayName: z.string().min(1, "Display name is required"),
		email: z.string().min(1, "Email is required").email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		acceptTerms: z.boolean().refine((v) => v === true, "You must accept the terms"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});
type SignUpForm = z.infer<typeof signupSchema>;

export default function SignUpPage() {
	const router = useRouter();
	const [serverError, setServerError] = useState("");
    const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpForm>({ resolver: zodResolver(signupSchema) });

	async function onSubmit(values: SignUpForm) {
		try {
			await axiosClient.post("/auth/register", {
				username: values.name,
				displayname: values.displayName,
				email: values.email,
				password: values.password,
			});
			setServerError("");
			router.push("/login");
		} catch (err: any) {
			setServerError(err?.response?.data?.message || "Signup failed");
		}
	}

	return (
		<div style={{ backgroundImage: "url(/wallpaper.jpg)" }} className="min-h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center">
			<div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-3xl overflow-hidden transition-all duration-300 ease-in-out">
				<div className="hidden md:block relative">
					<CldImage src="/banner.jpg" alt="Banner" fill className="object-cover object-top" priority />
				</div>
				{/* Form block */}	
				<div className="bg-[#f4fbf8] p-8 md:p-12">
					<h2 className="text-2xl text-[#e9632c] font-semibold">Create an account</h2>
					<p className="mt-2 text-sm text-[#141414]">Fill in the details to get started.</p>
					{serverError && <p className="mt-3 text-sm text-red-600">{serverError}</p>}
					<form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
							<input
								{...register("name")}
								className={`mt-1 block w-full px-3 py-2 bg-[#daede9] border border-[#cbd1d0] rounded-md shadow-sm placeholder:text-slate-400 text-slate-100 transition-all duration-200 ease-in-out focus:border-[#b9bfbe] focus:ring-1 focus:ring-[#e9632c] ${errors.name ? "ring-1 ring-rose-500" : ""}`}
								placeholder="Your full name"
								type="text"
							/>
							{errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>}
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Display name</label>
							<input
								{...register("displayName")}
								className={`mt-1 block w-full px-3 py-2 bg-[#daede9] border border-[#cbd1d0] rounded-md shadow-sm placeholder:text-slate-400 text-slate-100 transition-all duration-200 ease-in-out focus:border-[#b9bfbe] focus:ring-1 focus:ring-[#e9632c] ${errors.displayName ? "ring-1 ring-rose-500" : ""}`}
								placeholder="How you'll appear (e.g., dj_anna)"
								type="text"
							/>
							{errors.displayName && <p className="text-rose-500 text-sm mt-1">{errors.displayName.message}</p>}
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
							<input
								{...register("email")}
								className={`mt-1 block w-full px-3 py-2 bg-[#daede9] border border-[#cbd1d0] rounded-md shadow-sm placeholder:text-slate-400 text-slate-100 transition-all duration-200 ease-in-out focus:border-[#b9bfbe] focus:ring-1 focus:ring-[#e9632c] ${errors.email ? "ring-1 ring-rose-500" : ""}`}
								placeholder="you@example.com"
								type="email"
								autoComplete="email"
							/>
							{errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
							<input
								{...register("password")}
								className={`mt-1 block w-full px-3 py-2 bg-[#daede9] border border-[#cbd1d0] rounded-md shadow-sm placeholder:text-slate-400 text-slate-100 transition-all duration-200 ease-in-out focus:border-[#b9bfbe] focus:ring-1 focus:ring-[#e9632c] ${errors.password ? "ring-1 ring-rose-500" : ""}`}
								placeholder="Create a password"
								type="password"
								autoComplete="new-password"
							/>
							{errors.password && <p className="text-rose-500 text-sm mt-1">{errors.password.message}</p>}
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Confirm password</label>
							<input
								{...register("confirmPassword")}
								className={`mt-1 block w-full px-3 py-2 bg-[#daede9] border border-[#cbd1d0] rounded-md shadow-sm placeholder:text-slate-400 text-slate-100 transition-all duration-200 ease-in-out focus:border-[#b9bfbe] focus:ring-1 focus:ring-[#e9632c] ${errors.confirmPassword ? "ring-1 ring-rose-500" : ""}`}
								placeholder="Confirm your password"
								type="password"
							/>
							{errors.confirmPassword && <p className="text-rose-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
						</div>

						<div className="flex items-center">
							<input type="checkbox" {...register("acceptTerms")} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
							<label className="ml-2 text-sm text-slate-700 dark:text-slate-200">I agree to the <a href="#" className="text-indigo-600 hover:underline">terms and conditions</a></label>
						</div>
						{errors.acceptTerms && <p className="text-rose-500 text-sm">{errors.acceptTerms.message}</p>}

						<div>
							<button
							type="submit"
							disabled={isSubmitting}
							className="w-full inline-flex items-center justify-center rounded-md bg-[#e9632c] text-white px-4 py-2 font-medium shadow hover:opacity-95 transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Creating account..." : "Create account"}
						</button>
						</div>
					</form>

					<p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Sign in</a></p>
				</div>
			</div>
		</div>
	);
}

