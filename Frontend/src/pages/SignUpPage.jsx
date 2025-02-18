import React, { useState } from 'react'
import { User, Mail, MessageSquare, Eye, EyeOff, Lock, Loader2 } from 'lucide-react'
import useAuthStore from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const { signup, isSignUp } = useAuthStore();

  const validateForm = () => {
    if(!formData.name.trim()) return toast.error("Full Name is required")
    if(!formData.email.trim()) return toast.error("Email is required")
    if(!formData.password.trim()) return toast.error("Password is required")
    if(formData.password.length < 6) return toast.error("Password must be atleast 6 characters long")
    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) return toast.error("Invalid email")
    return true
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const success = validateForm()
  
    if(success === true){
      signup(formData)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
        <div className="flex flex-col justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-1 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center 
                justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-8 h-8 text-primary"/>
            </div>
            <h1 className="text-2xl font-bold mt-2">Create an account</h1>
            <p className="text-base-content/60">Already have an account?</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input type="text" className={`input input-bordered w-full pl-10`} 
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input type="email" className={`input input-bordered w-full pl-10`} 
                placeholder="xyz@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input type={showPassword ? "text": "password"} 
                className={`input input-bordered w-full pl-10`} 
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <button type="button" 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : 
                  <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <button type='submit' className="btn btn-primary w-full" disabled={isSignUp}>
              {isSignUp ? <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </> :
               "Submit"}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
            Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
            <p className="text-base-content/60">By signing up, you
            agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <AuthImagePattern
          title="Join our community"
          subtitle="Connect with Friends, Family and Colleagues"
          image=""
        />
    </div>
  )


}

export default SignUpPage
