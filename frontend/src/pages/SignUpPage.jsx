import React from 'react'
import { useState } from 'react';
import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';

/**
 * SignUpPage Component
 * 
 * This component handles user registration functionality with the following features:
 * - Form validation and data collection
 * - API integration using TanStack Query mutations
 * - Loading states and error handling
 * - Automatic cache invalidation after successful signup
 * - Responsive design with modern UI
 */
const SignUpPage = () => {
  // State management for form data
  // Stores user input for fullName, email, and password
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  // Access to TanStack Query client for cache management
  // Used to invalidate cached queries after successful signup
  // const queryClient = useQueryClient();

  /**
   * TanStack Query Mutation Hook
   * 
   * Handles the signup API call with the following features:
   * - mutationFn: Uses centralized signup function from lib/api
   * - mutate: Renamed to signupMutation for clarity
   * - onSuccess: Invalidates cached auth data to refresh user state
   * - Automatic error handling and loading states
   * - Optimistic updates and rollback on failure
   */
  // const { mutate:signupMutation, isPending, error,} = useMutation({
  //   mutationFn: signup, // Centralized API function for better maintainability
  //   // After successful signup, invalidate cached auth queries
  //   // This ensures fresh user data is fetched on subsequent requests
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  /**
   * Form submission handler
   * 
   * Prevents default form submission and triggers the mutation
   * This ensures proper error handling and loading states
   * Now passes signUpData as parameter to the mutation function
   */
  const { isPending, error, signupMutation } = useSignUp();

  // This is how we did it using our custom hook - optimized version
  const handleSignUp = (e) => {
    e.preventDefault(); // Prevent default form submission
    signupMutation(signUpData); // Pass form data to the signup mutation
  }
  

  return (
    // Main container with responsive padding and forest theme
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      {/* Card container with responsive layout (column on mobile, row on large screens) */}
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

        {/* Left Side - Form Section */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
        {/* Brand Logo and Title */}
        <div className="mb-4 flex items-center justify-start gap-2">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
          Convo
        </span>
        </div>
        
        {/* Error Display Section */}
        {/* Shows server-side validation errors and API errors */}
        {error &&(
          <div className="alert alert-error mb-4">
            <span>{error.response?.data?.message || "An error occurred during signup"}</span>
          </div>
        )}

        {/* SignUp Form Container */}
        <div className="w-full">
          {/* Form with submission handler and spacing */}
          <form onSubmit={handleSignUp} className="space-y-4">
                          <div className="space-y-4">
                {/* Form Header */}
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70 ">
                    Join the Convo community and start your language learning adventure.
                  </p>
                </div>
                
                {/* Form Fields Container */}
                <div className="space-y-3">
                  {/* Full Name Input Field */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input 
                        type="text" 
                        placeholder="Enter your full name"
                        className="input input-borded w-full" 
                        value={signUpData.fullName} 
                        onChange={(e) => setSignUpData({...signUpData, fullName: e.target.value})} 
                        required 
                    />
                  </div>
                  
                  {/* Email Input Field */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input 
                        type="email" 
                        placeholder="Enter your email"
                        className="input input-borded w-full" 
                        value={signUpData.email} 
                        onChange={(e) => setSignUpData({...signUpData, email: e.target.value})} 
                        required 
                    />
                  </div>
                  
                  {/* Password Input Field */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input 
                        type="password" 
                        placeholder="Enter your password"
                        className="input input-borded w-full" 
                        value={signUpData.password} 
                        onChange={(e) => setSignUpData({...signUpData, password: e.target.value})} 
                        required 
                    />
                    {/* Password requirement hint */}
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long.
                    </p>
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  <div className="form-control w-full">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the {" "}
                        <span className="text-primary hover:underline">terms of service</span> and {" "}
                        <span className="text-primary hover:underline">privacy policy</span> and {" "}
                      </span>
                    </label>

                    {/* Submit Button with Enhanced Loading State */}
                    {/* Shows spinner and loading text when mutation is pending */}
                    <button type="submit" className="btn btn-primary w-full">
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Loading...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>

                    {/* Login Link for Existing Users */}
                    <div className="text-center mt-4">
                      <p className="text-sm">
                        Already have an account?{" "}
                        <Link to='/login' className="text-primary hover:underLine">
                          Sign in
                        </Link>

                      </p>

                    </div>
                  </div>

              </div>

            </div>
          </form>
        </div>

        </div>

        {/* Right Side - Marketing/Illustration Section */}
        {/* Hidden on mobile, visible on large screens */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Hero Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            {/* Marketing Copy */}
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  )
}

export default SignUpPage
