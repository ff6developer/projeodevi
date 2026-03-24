"use client"
import { useState } from "react"
import "../../styles/kahveniolustur.css"

export default function KahveniOlustur(){

  const [form,setForm] = useState({
    milkType: null
  })

  const handleMilkChange = (e) => {
    setForm({
      ...form,
      milkType: e.target.value
    })
  }

  return (
    <div className="coffee-page">

      {/* BLUR BACKGROUND */}
      <div className="coffee-bg"></div>

      {/* SÜT SEÇİMİ */}
      <div className="kahvesutu">

        <h3>Süt Tipi</h3>

        <label className="milk-option">
          <input
            type="radio"
            name="milkType"
            value="laktozlu"
            onChange={handleMilkChange}
          />
          Laktozlu Süt
        </label>

        <label className="milk-option">
          <input
            type="radio"
            name="milkType"
            value="laktozsuz"
            onChange={handleMilkChange}
          />
          Laktozsuz Süt
        </label>

      </div>

      <div className="hero">
        <div className="hero-inner">

          <h1 className="hero-title">
            Kahveni Tasarla.
          </h1>

          <p className="hero-sub">
            Her yudum senin karakterini yansıtsın. 
            Kahveni adım adım oluştur ve kendi tarifini keşfet.
          </p>

          <button className="hero-btn">
            Oluşturmaya Başla
          </button>

        </div>
      </div>

    </div>
  )
}