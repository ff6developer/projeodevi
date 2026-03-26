"use client"
import { useState, useRef } from "react"
import { Camera, Plus, Share2, Coffee, Users, Check } from "lucide-react"
import "../../styles/profil.css"

export default function Profil() {
  const [bio, setBio] = useState("Kahve tasarlamayı seviyorum ☕")
  const [avatar, setAvatar] = useState("/profilikon.png")
  const [post, setPost] = useState("")
  const [posts, setPosts] = useState<{id: number, text: string, date: string}[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const designs = [
    { id: 1, name: "Vanilyalı Latte", rating: 4.8 },
    { id: 2, name: "Buzlu Karamel", rating: 4.5 },
    { id: 3, name: "Protein Cappuccino", rating: 4.9 }
  ]

  const suggestedUsers = [
    { name: "Baristanesli", img: "/pp1.jpg", title: "Master Barista" },
    { name: "CoffeeQueen", img: "/pp2.jpg", title: "Roaster" },
    { name: "LatteKing", img: "/pp3.jpg", title: "Artiste" }
  ]

  const sharePost = () => {
    if (!post.trim()) return
    const newPost = {
      id: Date.now(),
      text: post,
      date: "Şimdi"
    }
    setPosts([newPost, ...posts])
    setPost("")
  }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatar(url)
  }

  return (
    <div className="profil-page">
      <div className="profil-container">
        
        {/* --- HERO SECTION --- */}
        <header className="profil-hero">
          <div className="avatar-wrapper">
            <label className="avatar-upload">
              <img src={avatar} alt="Profil" className="profil-avatar" />
              <div className="avatar-overlay">
                <Camera size={24} />
              </div>
              <input type="file" onChange={handleAvatar} className="hidden-input" />
            </label>
          </div>

          <h1 className="profil-name">Neslişah</h1>
          
          <div className="bio-container">
            <textarea
              className="profil-bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Kendinden bahset..."
              maxLength={150}
            />
          </div>

          <div className="profil-stats">
            <div className="stat-item">
              <strong>24</strong>
              <span>Tasarım</span>
            </div>
            <div className="stat-item">
              <strong>540</strong>
              <span>Takipçi</span>
            </div>
            <div className="stat-item">
              <strong>180</strong>
              <span>Takip</span>
            </div>
          </div>
        </header>

        {/* --- TASARIMLAR (GRID) --- */}
        <section className="design-section">
          <div className="section-header">
            <h2><Coffee size={20} /> Kahve Tasarımlarım</h2>
            <button className="view-all">Tümünü Gör</button>
          </div>

          <div className="design-grid">
            {designs.map(d => (
              <div key={d.id} className="design-card">
                <div className="design-icon-box">☕</div>
                <h3>{d.name}</h3>
                <span className="design-rating">⭐ {d.rating}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- PAYLAŞIM ALANI --- */}
        <section className="post-section">
          <h2><Plus size={20} /> Yeni Paylaşım</h2>
          <div className="post-box">
            <textarea
              className="post-input"
              placeholder="Bugün nasıl bir kahve tasarladın?"
              value={post}
              onChange={e => setPost(e.target.value)}
            />
            <div className="post-actions">
              <button className="share-btn" onClick={sharePost}>
                <Share2 size={18} /> Paylaş
              </button>
            </div>
          </div>

          <div className="post-feed">
            {posts.map((p) => (
              <div key={p.id} className="post-card">
                <p>{p.text}</p>
                <span className="post-date">{p.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- ÖNERİLER --- */}
        <section className="follow-section">
          <h2><Users size={20} /> Önerilen Baristalar</h2>
          <div className="follow-grid">
            {suggestedUsers.map(u => (
              <div key={u.name} className="follow-card">
                <img src={u.img} alt={u.name} className="follow-avatar" />
                <div className="follow-info">
                  <span className="follow-name">{u.name}</span>
                  <span className="follow-title">{u.title}</span>
                </div>
                <button className="follow-btn">Takip Et</button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}