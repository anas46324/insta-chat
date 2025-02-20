import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

// const BASE_URL = "http://localhost:3000"
const BASE_URL =  import.meta.env.MODE === " development" ?  "http://localhost:3000" : "/"

const useAuthStore = create((set, get) => ({

    authUser: null,
    isSignUp: false,
    isLogingIng : false,
    isUpdatingProfile: false,
    onlineUsers: [],
    isCheckingAuth: true,
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            if(res.data.length !== 0) {
                set({ authUser: res.data.data})
                get().connectSocket()}
        }
        catch (error){
            console.log("Error in CheckAuth",error)
            set({ authUser: null})
        }
        finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async (data) => {
        try {
            set({isSignUp: true})
            const res = await axiosInstance.post("/auth/signup", data)
            toast.success("Success")
            get().connectSocket()
            set({authUser: res.data})
        }
        catch (error){
            toast.error(error.response.data.message)
        }
        finally{
            set({isSignUp: false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser: null})
            toast.success("Logged Out Successfully")
            get().disconnectSocket()
        }
        catch (error){
            toast.error(error.response.data.message)
        }
    },

    login: async (data) => {
        try {
            set({isLoggingIn: true})
            const res = await axiosInstance.post("/auth/signin", data)
            if(res.status === 200 ){
                toast.success(res.data.message)
                set({authUser: res.data.data})
                get().connectSocket()
        }
        }
        catch (error){
            toast.error(error.response.data.message)
        }
        finally{
            set({isLoggingIn: false})
        }
    },

    updateProfile: async (data) => {
        try {
            set({isUpdatingProfile: true})
            const res = await axiosInstance.put("/auth/update-user", data)
            toast.success(res.data.message)
            set({authUser: res.data.user})
        }
        catch (error){
            toast.error(error.response.data.message)
        }
        finally{
            set({isUpdatingProfile: false})
        }
    },

    connectSocket: () => {
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return
        console.log(authUser)
        const socket = io(BASE_URL, {
            query:{
                userId: authUser._id
            }
        })
        socket.connect()

        set({socket: socket})

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },

    disconnectSocket: () => {
        if(get().socket.connected) return get().socket.disconnect()
    },

    authRedirect: async (token) => {
        if (token) {
            try {
                const res = await axiosInstance.post(`/auth/authSignIn?token=${token}`);
                if (res.status === 200) {
                    toast.success(res.data.message);
                    set({ authUser: res.data.data });
                    get().connectSocket();
                }
                else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Login failed");
            } finally {
                set({ isLoggingIn: false });
            }
        } else {
            console.error("Token not found in URL");
        }
    }

}))

export default useAuthStore