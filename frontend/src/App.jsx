import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/layout/Layout"
import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/auth/SignUpPage.jsx"
import LoginPage from "./pages/auth/LoginPage.jsx"
import toast, { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios.js"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import NetworkPage from "./pages/NetworkPage.jsx"
import PostPage from "./pages/PostPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"


function App() {

  const { data : authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn : async () =>{
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if(err.response && err.response.status === 401){
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong");
      }
    }
  });

  if(isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={authUser ?<HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
        <Route path="/network" element={authUser ? <NetworkPage /> : <Navigate to="/login" />} />
        <Route path="/post/:postId" element={authUser ? <PostPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>
    </Layout>
  )
}

export default App