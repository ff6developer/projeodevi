"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, Plus, Share2, Coffee, Users, X, CheckCircle2, Star, LogOut } from "lucide-react"
import "../../styles/profil.css"

export default function Profil() {
  const router = useRouter()

  // --- STATE YÖNETİMİ ---
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [bio, setBio] = useState("Kahve tasarlamayı seviyorum ☕")
  const [avatar, setAvatar] = useState("/profilikon.png")
  const [post, setPost] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  
  const [lastDesign, setLastDesign] = useState<any>(null)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [selectedCoffee, setSelectedCoffee] = useState<any>(null)

  // --- GİRİŞ KONTROLÜ VE VERİ YÜKLEME ---
  useEffect(() => {
    // 1. Giriş kontrolü
    const loggedInUser = localStorage.getItem("user")
    if (!loggedInUser) {
      router.push("/giris") // Kullanıcı yoksa giriş sayfasına gönder
      return
    }
    setUser(JSON.parse(loggedInUser))

    // 2. Yerel verileri çek
    const savedCoffee = localStorage.getItem("lastCoffeeDesign")
    if (savedCoffee) setLastDesign(JSON.parse(savedCoffee))

    const savedAvatar = localStorage.getItem("userAvatar")
    if (savedAvatar) setAvatar(savedAvatar)

    const savedBio = localStorage.getItem("userBio")
    if (savedBio) setBio(savedBio)
  }, [router])

  // --- FONKSİYONLAR ---

  const handleLogout = () => {
    localStorage.removeItem("user") // Kullanıcı bilgisini sil
    router.push("/giris")
  }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setAvatar(base64String)
      localStorage.setItem("userAvatar", base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleBioChange = (val: string) => {
    setBio(val)
    localStorage.setItem("userBio", val)
  }

  const selectSuggestedCoffee = () => {
    if (!lastDesign) return
    setSelectedCoffee(lastDesign)
    setPost(`${lastDesign.name} hazırladım, tadı efsane oldu! ☕✨`)
    setShowSuggestion(false)
  }

  const sharePost = () => {
    if (!post.trim()) return
    
    const newPost = {
      id: Date.now(),
      text: post,
      coffee: selectedCoffee, 
      date: "Şimdi"
    }

    setPosts([newPost, ...posts])
    setPost("")
    setSelectedCoffee(null) 
  }

  // Kullanıcı verisi yüklenene kadar boş ekran veya loading göster
  if (!user) return <div className="loading-screen">Yükleniyor...</div>

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

  return (
    <div className="profil-page">
      <div className="profil-container">

        {/* --- HERO SECTION --- */}
        <header className="profil-hero">
          {/* Çıkış Yap Butonu */}
          <button className="logout-button" onClick={handleLogout} title="Çıkış Yap">
            <LogOut size={20} />
          </button>

          <div className="avatar-wrapper">
            <label className="avatar-upload">
              <img src={avatar} alt="Profil" className="profil-avatar" />
              <div className="avatar-overlay">
                <Camera size={24} />
              </div>
              <input type="file" onChange={handleAvatar} style={{ display: "none" }} accept="image/*" />
            </label>
          </div>

          <h1 className="profil-name">{user.name}</h1>
          <p className="profil-email">{user.email}</p>
          
          <div className="bio-container">
            <textarea
              className="profil-bio"
              value={bio}
              onChange={e => handleBioChange(e.target.value)}
              placeholder="Kendinden bahset..."
              maxLength={150}
            />
          </div>

          <div className="profil-stats">
            <div className="stat-item"><strong>24</strong><span>Tasarım</span></div>
            <div className="stat-item"><strong>540</strong><span>Takipçi</span></div>
            <div className="stat-item"><strong>180</strong><span>Takip</span></div>
          </div>
        </header>

        {/* --- TASARIMLAR --- */}
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
                <span className="design-rating"><Star size={14} fill="#c58a5c" /> {d.rating}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- PAYLAŞIM ALANI --- */}
        <section className="post-section">
          <h2><Plus size={20} /> Yeni Paylaşım</h2>
          
          <div className="post-box" style={{ position: 'relative' }}>
            
            {showSuggestion && lastDesign && !selectedCoffee && (
              <div className="coffee-suggestion-box">
                <div className="suggestion-content" onClick={selectSuggestedCoffee}>
                  <div className="suggestion-icon">☕</div>
                  <div className="suggestion-text">
                    <strong>Son tasarımını paylaşmak ister misin?</strong>
                    <span>{lastDesign.name} ({lastDesign.totalPrice} TL)</span>
                  </div>
                </div>
                <button className="close-suggestion" onClick={() => setShowSuggestion(false)}>
                  <X size={16} />
                </button>
              </div>
            )}

            {selectedCoffee && (
              <div className="selected-coffee-tag">
                <CheckCircle2 size={16} color="#c58a5c" />
                <span>{selectedCoffee.name} eklendi</span>
                <button onClick={() => setSelectedCoffee(null)} className="remove-selection">
                  <X size={14} />
                </button>
              </div>
            )}

            <textarea
              className="post-input"
              placeholder="Bugün nasıl bir kahve tasarladın?"
              value={post}
              onFocus={() => setShowSuggestion(true)}
              onChange={e => setPost(e.target.value)}
            />
            
            <div className="post-actions">
              <button className="share-btn" onClick={sharePost}>
                <Share2 size={18} /> Paylaş
              </button>
            </div>
          </div>

          <div className="post-feed">
            {posts.length === 0 && <p className="empty-state">Henüz bir şey paylaşmadın.</p>}
            {posts.map((p) => (
              <div key={p.id} className="post-card">
                <p>{p.text}</p>
                {p.coffee && (
                  <div className="post-attached-coffee">
                    <div className="attached-img">☕</div>
                    <div className="attached-info">
                      <strong>{p.coffee.name}</strong>
                      <small>{p.coffee.totalPrice} TL • Özel Tasarım</small>
                    </div>
                  </div>
                )}
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