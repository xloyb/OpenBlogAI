"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doCredentialLogin } from "@/actions/auth";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { Button } from "./ui";

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
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FaEnvelope className="text-indigo-600 w-4 h-4" />
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${fieldErrors.email
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-100 hover:border-gray-300'
              }`}
            required
          />
          <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        </div>
        {fieldErrors.email && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 font-medium"
          >
            {fieldErrors.email}
          </motion.p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FaLock className="text-indigo-600 w-4 h-4" />
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${fieldErrors.password
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-100 hover:border-gray-300'
              }`}
            required
          />
          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-50"
          >
            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </motion.button>
        </div>
        {fieldErrors.password && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 font-medium"
          >
            {fieldErrors.password}
          </motion.p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between pt-2">
        <motion.label
          className="flex items-center cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="checkbox"
            className="w-4 h-4 text-indigo-600 bg-white border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 mr-3"
          />
          <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">Remember me</span>
        </motion.label>
        <motion.a
          href="/forgot-password"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Forgot password?
        </motion.a>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 25
            }
          }}
          className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-800 font-medium text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 25
            }
          }}
          className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-800 font-medium text-sm">{success}</p>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div
        whileHover={{ scale: isLoading ? 1 : 1.02, y: -2 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          variant="outline"
          className="w-full border-2 border-slate-200 hover:border-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-slate-700 hover:text-indigo-700 font-semibold py-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg group"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FaSpinner className="w-4 h-4" />
              </motion.div>
              <span>Signing In...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="group-hover:rotate-12 transition-transform duration-300"
              >
                <FiLock className="w-4 h-4" />
              </motion.div>
              <span className="bg-gradient-to-r from-slate-700 to-indigo-700 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700">
                Sign In
              </span>
            </div>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}