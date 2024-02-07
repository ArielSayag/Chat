import { User } from "@/@types";
import { RootState } from "@/store";
import { message } from "antd";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";


export function AuthPage() {

  const user = useSelector<RootState, User | null>(state => state.userReducer.user)
  if(user) {
    return <Navigate to="/home"/>
  }
  
  const location = useLocation()

  const BottomButton = useCallback(() =>  {
    if(location.pathname.includes('sign-up')) {
      return <div>
        Already have an account? <Link to="/auth/sign-in">sign in now</Link>
      </div>
    }
    return <div>
    Don't have an account? <Link to="/auth/sign-up">sign up now</Link>
  </div>
  }, [location])
  
  return <div className="mx-auto max-w-[700px] p-4">
      <Outlet/>
      <BottomButton/>
  </div>
}