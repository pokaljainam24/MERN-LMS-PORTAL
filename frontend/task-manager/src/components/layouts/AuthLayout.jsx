import React from 'react'
import UI_IMG from "../../../public/bg.png";

function AuthLayout({children}) {
  return (
    <>
        <div className="flex">
            <div className="w-screen h-screen md:w-[60vw] px-20 pt-8 pb-20">
                <h2 className="text-lg font-medium text-black text-[2rem]">Task Manager</h2>
                {children}
            </div>

            <div className="hidden md:flex w-[50vw] h-screen items-center justify-center bg-blue-50 bg-[url('/bg-image.png')] bg-no-repeat bg-center overflow-hidden p-8">
                <img src={UI_IMG} alt="" className="w-64 lg:w-[80%] lg:h-[110%]" />
            </div>
        </div>
    </>
  )
}

export default AuthLayout
