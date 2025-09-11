"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

function strengthLabel(pw: string) {
	let score = 0;
	if (pw.length >= 8) score++;
	if (/[A-Z]/.test(pw)) score++;
	if (/[a-z]/.test(pw)) score++;
	if (/\d/.test(pw)) score++;
	if (/[^A-Za-z0-9]/.test(pw)) score++;
	const levels = ["Very weak", "Weak", "Okay", "Good", "Strong", "Excellent"];
	return { score, label: levels[score] ?? "Very weak" };
}

export default function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [showPw, setShowPw] = useState(false);
	const [loading, setLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [devOtp, setDevOtp] = useState<string | null>(null);

	const pw = strengthLabel(password);
	const canSubmit =
		email.trim().length > 3 &&
		password.length >= 8 &&
		password === confirm &&
		!loading;

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSuccessMsg(null);
		setDevOtp(null);

		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL!}/v1/api/auth/signup`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				}
			);

			const data = await res.json().catch(() => ({}));

			if (!res.ok) {
				setError(data?.message || "Signup failed. Try again.");
				return;
			}

			// Store token if you want immediate “signed-in” UX
			if (data?.token) {
				localStorage.setItem("token", data.token);
			}

			setSuccessMsg(
				data?.message ||
					"Signed up successfully. Please verify your email if required."
			);

			// In non-production your API returns the OTP; show it for convenience
			if (data?.otp && typeof data.otp === "string") {
				setDevOtp(data.otp);
			}

			setEmail("");
			setPassword("");
			setConfirm("");
		} catch {
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-[80vh] w-full flex items-center justify-center bg-gradient-to-b from-slate-950 via-zinc-950 to-slate-900 text-zinc-100">
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.25 }}
				className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-sm p-6 shadow-xl">
				<div className="mb-6">
					<h1 className="text-xl font-semibold tracking-tight">
						Create your account
					</h1>
					<p className="text-sm text-zinc-400 mt-1">
						Build flows like n8n—securely and fast.
					</p>
				</div>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="block text-sm text-zinc-300 mb-1.5">Email</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@company.com"
							className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 py-2.5 px-3 text-sm outline-none
                         ring-0 focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600/50
                         placeholder:text-zinc-500"
							autoComplete="email"
						/>
					</div>

					<div>
						<label className="block text-sm text-zinc-300 mb-1.5">
							Password
						</label>
						<div className="relative">
							<input
								type={showPw ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="At least 8 characters"
								className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 py-2.5 px-3 pr-10 text-sm outline-none
                           focus:border-zinc-700 focus:ring-2 focus:ring-indigo-600/50 placeholder:text-zinc-500"
								autoComplete="new-password"
							/>
							<button
								type="button"
								onClick={() => setShowPw((s) => !s)}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition"
								aria-label={showPw ? "Hide password" : "Show password"}>
								{showPw ? "🙈" : "👁️"}
							</button>
						</div>
						<div className="mt-1.5 flex items-center justify-between">
							<span className="text-xs text-zinc-400">
								Strength: {pw.label}
							</span>
							<div className="flex gap-1">
								{Array.from({ length: 5 }).map((_, i) => (
									<div
										key={i}
										className={[
											"h-1.5 w-8 rounded",
											i < pw.score
												? [
														"bg-gradient-to-r",
														i < 2
															? "from-red-500 to-orange-500"
															: i < 4
																? "from-yellow-500 to-green-500"
																: "from-green-500 to-emerald-500",
													].join(" ")
												: "bg-zinc-800",
										].join(" ")}
									/>
								))}
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm text-zinc-300 mb-1.5">
							Confirm Password
						</label>
						<input
							type={showPw ? "text" : "password"}
							required
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							placeholder="Re-enter password"
							className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 py-2.5 px-3 text-sm outline-none
                         focus:border-zinc-700 focus:ring-2 focus:ring-blue-600/50 placeholder:text-zinc-500"
							autoComplete="new-password"
						/>
						{confirm.length > 0 && confirm !== password && (
							<p className="mt-1 text-xs text-red-400">
								Passwords do not match.
							</p>
						)}
					</div>

					{error && (
						<div className="rounded-lg border border-red-900/40 bg-red-950/50 p-3 text-sm text-red-200">
							{error}
						</div>
					)}

					{successMsg && (
						<div className="rounded-lg border border-green-900/40 bg-emerald-950/50 p-3 text-sm text-emerald-200">
							{successMsg}
						</div>
					)}

					{devOtp && (
						<div className="rounded-lg border border-yellow-900/40 bg-yellow-950/40 p-3 text-sm text-yellow-200">
							Dev OTP: <span className="font-mono">{devOtp}</span>
						</div>
					)}

					<motion.button
						whileHover={{ y: -1 }}
						whileTap={{ y: 0 }}
						disabled={!canSubmit}
						type="submit"
						className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl
                       border border-zinc-700 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600
                       px-4 py-2.5 text-sm font-medium text-white shadow
                       focus:outline-none focus:ring-2 focus:ring-purple-600/60 disabled:cursor-not-allowed
                       disabled:opacity-60">
						<span className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-20 bg-white" />
						{loading ? "Creating account..." : "Create account"}
					</motion.button>
				</form>

				<p className="mt-4 text-center text-xs text-zinc-500">
					By signing up, you agree to our Terms & Privacy Policy.
				</p>
			</motion.div>
		</div>
	);
}
