"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doCredentialLogin } from "@/actions/auth";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const { update } = useSession();

  // Redirect when the user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/blogs");
    }
  }, [status, router]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Clear general error/success messages
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);

    try {
      await doCredentialLogin(formDataToSend);
      await update();
      setSuccess("Login successful! Redirecting...");

      // Redirect after successful login
      setTimeout(() => {
        router.push("/blogs");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="space-y-6"
    >
      {/* Email Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaEnvelope className="text-primary" />
            Email Address
          </span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className={`input input-bordered w-full ${fieldErrors.email ? 'input-error' : ''}`}
          required
        />
        {fieldErrors.email && (
          <label className="label">
            <span className="label-text-alt text-error">{fieldErrors.email}</span>
          </label>
        )}
      </div>

      {/* Password Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaLock className="text-primary" />
            Password
          </span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className={`input input-bordered w-full pr-12 ${fieldErrors.password ? 'input-error' : ''}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {fieldErrors.password && (
          <label className="label">
            <span className="label-text-alt text-error">{fieldErrors.password}</span>
          </label>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="label cursor-pointer">
          <input type="checkbox" className="checkbox checkbox-primary checkbox-sm mr-2" />
          <span className="label-text text-sm">Remember me</span>
        </label>
        <a href="/forgot-password" className="link link-primary text-sm">
          Forgot password?
        </a>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="alert alert-error"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="alert alert-success"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full text-lg"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </motion.form>
  );
}