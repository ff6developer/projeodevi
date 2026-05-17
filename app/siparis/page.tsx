"use client"
import { useEffect, useState } from "react"
import "../../styles/siparis.css"

export default function Siparis(){

  const [dots,setDots] = useState(".")

  useEffect(()=>{
 const interval = setInterval(()=>{
      setDots(prev=>{
        if(prev === "...") return "."
        return prev + "."
      })
    },500)
 return ()=> clearInterval(interval)

  },[])

  return (
   <div className="siparis-page">
 <div className="siparis-overlay"></div>
 <div className="siparis-content">
 <h1 className="siparis-hero">
    Siparişiniz Hazırlanıyor{dots}
 </h1>

        <p className="siparis-desc">
          Kahveniz hazır olduktan sonra profil bölümünden tasarımınızı paylaşın ve
          turnuvadaki sürpriz ödülleri kazanma şansını yakalayın!
        </p>
   </div>
 </div>
  )}