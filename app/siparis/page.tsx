"use client"
import { useEffect, useState } from "react"
import "../../styles/siparis.css"

export default function Siparis(){

  const [dots,setDots] = useState(".")

  /* ===== LOADER DOTS ===== */
  useEffect(()=>{

    const interval = setInterval(()=>{

      setDots(prev=>{
        if(prev === "...") return "."
        return prev + "."
      })

    },500)

    return ()=> clearInterval(interval)

  },[])

  /* ===== STEP SCROLL ===== */
  useEffect(()=>{

    const container = document.querySelector(".siparis-wrapper") as HTMLElement | null
    const sections = document.querySelectorAll(".siparis-screen")

    if(!container || sections.length === 0) return

    let index = 0
    let animating = false

    const smoothScroll = (targetY:number)=>{

      const startY = container.scrollTop
      const distance = targetY - startY
      const duration = 800
      let startTime:number | null = null

      const ease = (t:number)=> 1 - Math.pow(1 - t, 4)

      const animate = (time:number)=>{
        if(!startTime) startTime = time

        const progress = time - startTime
        const percent = Math.min(progress / duration, 1)

        container.scrollTop = startY + distance * ease(percent)

        if(percent < 1){
          requestAnimationFrame(animate)
        }else{
          animating = false
        }
      }

      requestAnimationFrame(animate)
    }

    const wheelHandler = (e:WheelEvent)=>{

      if(animating) return
      animating = true

      if(e.deltaY > 0){
        index = Math.min(index + 1, sections.length - 1)
      }else{
        index = Math.max(index - 1, 0)
      }

      const target = sections[index] as HTMLElement
      smoothScroll(target.offsetTop)
    }

    container.addEventListener("wheel", wheelHandler)

    return ()=> container.removeEventListener("wheel", wheelHandler)

  },[])

  /* ===== REVEAL ANIMATION ===== */
  useEffect(()=>{

    const els = document.querySelectorAll(".reveal")

    const obs = new IntersectionObserver(
      (entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add("show")
          }
        })
      },
      { threshold:0.3 }
    )

    els.forEach(el=> obs.observe(el))

    return ()=> obs.disconnect()

  },[])

  return (

    <div className="siparis-wrapper">

      {/* ===== SCREEN 1 HERO ===== */}
      <section className="siparis-screen hero-screen">

        <div className="siparis-overlay"></div>

        <h1 className="siparis-hero">
          Siparişiniz Hazırlanıyor{dots}
        </h1>

      </section>

      {/* ===== SCREEN 2 BARISTA ===== */}
     <section className="siparis-screen barista-screen">

  <div className="siparis-overlay"></div>

  <h2 className="info-title reveal">
    Baristamız kahvenizi büyük bir özenle hazırlıyor
  </h2>

</section>

    </div>
  )
}