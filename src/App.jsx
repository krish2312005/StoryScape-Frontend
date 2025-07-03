import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Admin_Page from './Pages/admin/Admin_Page';
import { 
  Home_Page, 
  User_profile_page, 
  Explore_page, 
  Write_page, 
  Story_page, 
  Login_page, 
  Signup_page,
} from './Pages/user';
import User_Page from './Pages/admin/User_Page';
import Stories_page from './Pages/admin/Stories_page';
import Comments_Page from './Pages/admin/Comments_Page';
import Forgot_password_page from './Pages/user/Forgot_password_page';
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from "@vercel/analytics/next"

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#181824]">
        <Routes>
          <Route path="/" element={<Home_Page />} />
          <Route path="/UserProfile" element={<User_profile_page />} />
          <Route path="/Explore" element={<Explore_page />} />
          <Route path="/Write" element={<Write_page />} />
          <Route path="/Write/:id" element={<Write_page />} />
          <Route path="/Story/:id" element={<Story_page />} />
          <Route path="/login" element={<Login_page />} />
          <Route path="/signup" element={<Signup_page />} />
          <Route path="/forgot-password" element={<Forgot_password_page />} />
          <Route path="/Admin" element={<Admin_Page />} />
          <Route path="/Admin/Users" element={<User_Page />} />
          <Route path="/Admin/Stories" element={<Stories_page />} />
          <Route path="/Admin/Comments" element={<Comments_Page />} />
        </Routes>
      </div>
      <Analytics />
    </ThemeProvider>
  )
}

export default App
