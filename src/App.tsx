// import { FormEvent, useEffect, useState } from 'react'
// import { createUserWithEmailAndPassword } from 'firebase/auth'
// import { auth } from './firebase'
// import {message} from 'antd'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from './store'
// import { signIn } from './store/userSlice'
// import { UserSignInForm } from './@types'
import './App.css'
import { Route, Routes, useLocation, useNavigate } from 'react-router'
import { AuthPage } from './pages/auth/auth'
import SignInPage from './pages/auth/signIn'
import { Link } from 'react-router-dom'
import SignUpPage from './pages/auth/signUp';
import StartPage from './components/common/StartPage'
import Home from './pages/home/home'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './store'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { getUserInfo } from './store/userSlice'
import { message } from 'antd'

function App() {


  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const nav = useNavigate()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if(!authUser) {
        if(location.pathname !== '/') {
          message.info("Signed out")
          nav("/")
        }
        return
      }
      // user is remembered
      dispatch(getUserInfo({
        email:authUser.email!,
        phoneNumber:authUser.phoneNumber,
        uid:authUser.uid,
      }))
    })
    return () => {
      unsubscribe()
    }
  },[])

  return (
    <div>
      <Routes>
        <Route index path='/' element={<StartPage />}/>
         
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<AuthPage />}>
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="sign-in" element={<SignInPage />} />
        </Route>
      </Routes>


    </div>
  )
}

export default App
