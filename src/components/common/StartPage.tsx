import React from 'react'
import { Link } from 'react-router-dom'
import { PiWechatLogo } from "react-icons/pi";

function StartPage() {
  return (<div className='h-screen justify-center rounded p-[50px] text-center  bg-blue-500 '>
    <div>
      <h1 className='text-3xl font-bold text-white'>WELCOME</h1>
      <h2 className='text-4xl font-bold text-white'>CHAT ACS</h2>

      <div className='flex mt-6 items-center justify-center'>
        <PiWechatLogo color='white' size={100} />
      </div>

      <div className='flex items-center justify-center h-44'>
        <div className='bg-white text-blue-500 font-bold p-4 w-44 rounded mx-2'>
          <Link to="/auth/sign-in">Sign in</Link>
        </div>
        <div className='bg-white text-blue-500 font-bold p-4 w-44 rounded'>
          <Link to="/auth/sign-up">Sign up</Link>
        </div>
      </div>
    </div>
</div>
  )
}

export default StartPage