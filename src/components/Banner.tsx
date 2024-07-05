import React, { useState } from "react";

const btnDefaultStyle =
    "bg-accent text-slate-100 text-sm px-3 w-full py-2 rounded-2xl flex justify-between items-center gap-2";

const Banner = ({onRemoved}) => {
    function removeBanner(){
        onRemoved(true)
    }
    
    return (
        <div className="w-full mb-6">
            <button className={btnDefaultStyle}>
                <div>🎉 Get 100 Point to get 1 QuizTok Token!</div>
                <div onClick={removeBanner}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20"><path fill="white" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07M11.4 10l2.83-2.83l-1.41-1.41L10 8.59L7.17 5.76L5.76 7.17L8.59 10l-2.83 2.83l1.41 1.41L10 11.41l2.83 2.83l1.41-1.41L11.41 10z" /></svg>
                </div>
            </button>
        </div>
    )
};

export default Banner;
