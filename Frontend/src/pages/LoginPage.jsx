import { useState } from 'react'
import useAuthStore  from '../store/useAuthStore'
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const {login, isLoggingIn} = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    login(formData)
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
        <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
        <p className="text-base-content/60">Sign in to your account</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input type="email" className={`input input-bordered w-full pl-10`} 
            placeholder="you@example.com"
            value={formData.name}
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
        <button type='submit' className="btn btn-primary w-full" disabled={isLoggingIn}>
          {isLoggingIn ? <>
            <Loader2 className="size-5 animate-spin" />
            Loading...
          </> :
           "Submit"}
        </button>
      </form>
      <div className="text-center">
        <p className="text-base-content/60">
        Don&apos;t have an account? {" "} <Link to="/signup" className="text-primary">Create account</Link></p>
        {/* <p className="text-base-content/60">By signing up, you
        agree to our Terms of Service and Privacy Policy</p> */}
        </div>
      </div>
    </div>
    {/* Right Side */}
    <AuthImagePattern
      title="Welcome Back"
      subtitle="Sign in to continue your conversations and catch up with your messages"
      image=""
    />
</div>
  )
}

export default LoginPage
