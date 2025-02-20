import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { useEffect } from "react"
import { Loader } from 'lucide-react'
import {Toaster}  from 'react-hot-toast'
import useAuthStore from "./store/useAuthStore"
import useThemeStore from "./store/useThemeStore"
import AuthDirectPage from "./pages/AuthDirectPage"

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers,authRedirect} = useAuthStore()
  const {theme} = useThemeStore()

  useEffect(() => {
    // if(location.pathname == "/auth") return
    checkAuth()
  }, [checkAuth]);

  if(isCheckingAuth && !authUser)
    return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )

  return (
    <div data-theme={theme}>
      {location.pathname !== "/auth" && <Navbar />}
      <Routes>
        <Route path="/auth" element={<AuthDirectPage/>} />
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to= "/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to= "/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to= "/"/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to= "/login" />}/>
      </Routes>
      <Toaster position="top-center" reverseOrder={false}/>
    </div>
  )
}

export default App