import {create} from 'zustand';
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import useAuthStore from './useAuthStore';

const useChatStore = create((set, get) => {
    let usersController = new AbortController()
    let messagesController = new AbortController()
    
    return { messages: [],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMsgsLoading: false,

    getUsers: async () => {
        
        usersController.abort();
        usersController = new AbortController();
        set({isUsersLoading: true});
        try{
            const res = await axiosInstance.get("/messages/users",{
                signal: usersController.signal,
            });
             set({users: res.data.data});
        }
        catch(error){
            toast.error(error.response.data.message)
        } finally {
            set({isUsersLoading: false})
        }
    },

    getMessages: async (userId) => {
        messagesController.abort();
        messagesController = new AbortController();
        set({isMsgsLoading: true});
        try{
         const res = await axiosInstance.get(`/messages/${userId}`,{
            signal: messagesController.signal,
         });
         set({ messages: res.data.data });
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isMsgsLoading:false})
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post
            (`/messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data.data] });
            console.log(res.data.data)
            } catch (error) {
                toast.error(error.response.data.message)
        }
    },

    subscribetoMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        console.log(socket)
        socket.on("NewMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set({messages: [...get().messages, newMessage]});
            console.log(...get().messages)
        })
    },

    unsubscribetoMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("NewMessage");
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),

    }
})

export default useChatStore