"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, Plus, Share2, Coffee, Users, X, CheckCircle2, Star, LogOut, Heart, MessageCircle, Trophy, Zap } from "lucide-react"
import "../../styles/profil.css"

export default function Profil() {
  const router = useRouter()

  // --- STATE YÖNETİMİ ---
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [bio, setBio] = useState("Kahve tasarlamayı seviyorum ☕")
  const [avatar, setAvatar] = useState("/profilikon.png")
  const [postText, setPostText] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  
  const [lastDesign, setLastDesign] = useState<any>(null)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [selectedCoffee, setSelectedCoffee] = useState<any>(null)

  // --- GİRİŞ KONTROLÜ VE VERİ YÜKLEME ---
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user")
    if (!loggedInUser) {
      router.push("/giris")
      return
    }
    setUser(JSON.parse(loggedInUser))

    const savedPosts = localStorage.getItem("userPosts")
    if (savedPosts) setPosts(JSON.parse(savedPosts))

    const savedCoffee = localStorage.getItem("lastCoffeeDesign")
    if (savedCoffee) setLastDesign(JSON.parse(savedCoffee))

    const savedAvatar = localStorage.getItem("userAvatar")
    if (savedAvatar) setAvatar(savedAvatar)

    const savedBio = localStorage.getItem("userBio")
    if (savedBio) setBio(savedBio)
  }, [router])

  // --- FONKSİYONLAR ---
  const handleLogout = () => {
    localStorage.removeItem("user") 
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
    setPostText(`${lastDesign.name} hazırladım, Arenada oylarınızı bekliyorum! ☕🔥`)
    setShowSuggestion(false)
  }

  const sharePost = () => {
    // KONTROL: Metin boşsa VEYA kahve seçilmediyse paylaşma
    if (!postText.trim() || !selectedCoffee) return
    
    const newPost = {
      id: Date.now(),
      text: postText,
      coffee: selectedCoffee, 
      date: new Date().toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      arenaScore: selectedCoffee.score || 0 // Tasarımdan gelen yaratıcılık puanı
    }

    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem("userPosts", JSON.stringify(updatedPosts))
    
    // Arena Sayfası için genel bir "Arena Posts" listesi oluştur/güncelle
    const allArenaPosts = JSON.parse(localStorage.getItem("arenaPosts") || "[]")
    localStorage.setItem("arenaPosts", JSON.stringify([{ ...newPost, userName: user?.name, userAvatar: avatar }, ...allArenaPosts]))

    setPostText("")
    setSelectedCoffee(null) 
    setShowSuggestion(false)
  }

  const deletePost = (postId: number) => {
    const filteredPosts = posts.filter(p => p.id !== postId)
    setPosts(filteredPosts)
    localStorage.setItem("userPosts", JSON.stringify(filteredPosts))
  }

  if (!user) return <div className="loading-screen"><h2>ELMENES COFFEE Yükleniyor...</h2></div>

  const suggestedUsers = [
    { name: "Baristanesli", img: "/pp1.jpg", title: "Master Barista" },
    { name: "CoffeeQueen", img: "/pp2.jpg", title: "Roaster" },
    { name: "LatteKing", img: "/pp3.jpg", title: "Artiste" }
  ]

  // BUTON AKTİFLİK KONTROLÜ
  const isShareDisabled = !postText.trim() || !selectedCoffee;

  return (
    <div className="profil-page">
      <div className="profil-container">

        {/* --- HERO SECTION --- */}
        <header className="profil-hero">
          <button className="logout-button" onClick={handleLogout} title="Çıkış Yap">
            <LogOut size={20} />
          </button>

          <div className="avatar-wrapper">
            <label className="avatar-upload">
              <img src={avatar} alt="Profil" className="profil-avatar" />
              <div className="avatar-overlay"><Camera size={24} /></div>
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
            <div className="stat-item">
              <strong>{posts.length}</strong>
              <span>Gönderi</span>
            </div>
            <div className="stat-item">
              <strong><Zap size={14} className="stat-icon" /> {posts.reduce((acc, p) => acc + (p.arenaScore || 0), 0)}</strong>
              <span>Arena Puanı</span>
            </div>
            <div className="stat-item">
              <strong><Trophy size={14} className="stat-icon" /> 0</strong>
              <span>Şampiyonluk</span>
            </div>
          </div>
        </header>

        {/* --- PAYLAŞIM ALANI --- */}
        <section className="post-section">
          <div className="section-title-wrapper">
             <h2><Plus size={22} /> Arenada Paylaş</h2>
             {!lastDesign && <span className="warning-text">Paylaşmak için önce bir kahve tasarlamalısın!</span>}
          </div>
          
          <div className={`post-box ${!lastDesign ? "locked-box" : ""}`}>
            {showSuggestion && lastDesign && !selectedCoffee && (
              <div className="coffee-suggestion-box">
                <div className="suggestion-content" onClick={selectSuggestedCoffee}>
                  <img src={lastDesign.image} alt="Tasarım" className="mini-coffee-preview" />
                  <div className="suggestion-text">
                    <strong>Son tasarımını arenaya sür!</strong>
                    <span>{lastDesign.name}</span>
                  </div>
                </div>
                <button className="close-suggestion" onClick={() => setShowSuggestion(false)}>
                  <X size={16} />
                </button>
              </div>
            )}

            {selectedCoffee && (
              <div className="selected-coffee-preview-container">
                <img src={selectedCoffee.image} alt="Seçili" className="selected-img" />
                <div className="selected-info">
                  <CheckCircle2 size={16} color="#c58a5c" />
                  <span>{selectedCoffee.name} Arenaya hazır!</span>
                </div>
                <button onClick={() => setSelectedCoffee(null)} className="remove-selection-btn">
                  <X size={14} />
                </button>
              </div>
            )}

            <textarea
              className="post-input"
              placeholder={lastDesign ? "Bu kahveyle Arenayı salla..." : "Kahve tasarlamadan paylaşım yapamazsın..."}
              value={postText}
              disabled={!lastDesign}
              onFocus={() => setShowSuggestion(true)}
              onChange={e => setPostText(e.target.value)}
            />
            
            <div className="post-actions">
              <button 
                className={`share-btn ${isShareDisabled ? "disabled" : ""}`} 
                onClick={sharePost}
                disabled={isShareDisabled}
              >
                <Share2 size={18} /> Arenada Paylaş
              </button>
            </div>
          </div>

          {/* POST FEED */}
          <div className="post-feed">
            {posts.length === 0 && (
              <div className="empty-state">
                <Coffee size={48} opacity={0.2} />
                <p>Henüz Arenaya çıkmadın. İlk kahveni tasarla ve rekabete katıl!</p>
              </div>
            )}
            
            {posts.map((p) => (
              <div key={p.id} className="post-card arena-card">
                <header className="post-header">
                  <div className="post-user-info">
                    <img src={avatar} alt="User" className="post-user-avatar" />
                    <div>
                      <span className="post-user-name">{user.name}</span>
                      <span className="post-date">{p.date}</span>
                    </div>
                  </div>
                  <button className="delete-post" onClick={() => deletePost(p.id)}><X size={18} /></button>
                </header>

                <div className="post-content">
                  <p className="post-text">{p.text}</p>
                  {p.coffee && (
                    <div className="post-main-image-wrapper">
                      <img src={p.coffee.image} alt="Coffee Design" className="post-main-image" />
                      <div className="image-overlay-info">
                        <strong>{p.coffee.name}</strong>
                        <div className="post-score-tag"><Zap size={14} /> {p.arenaScore} Puan</div>
                      </div>
                    </div>
                  )}
                </div>

                <footer className="post-footer">
                  <button className="post-action-btn arena-vote"><Heart size={20} /> <span>{p.likes} Oy</span></button>
                  <button className="post-action-btn"><MessageCircle size={20} /> <span>Yorum</span></button>
                </footer>
              </div>
            ))}
          </div>
        </section>

        {/* --- ÖNERİLER --- */}
{/* --- ARENA DEVLERİ (TOP BARISTAS) --- */}
        <section className="follow-section">
          <div className="section-title-wrapper">
            <h2><Trophy size={20} color="#ffcc00" /> Arena Devleri</h2>
            <span className="view-all">Tüm Lig Tablosu</span>
          </div>
          <div className="follow-grid">
            {suggestedUsers.map((u, index) => (
              <div key={u.name} className={`follow-card ${index === 0 ? "champion-border" : ""}`}>
                <div className="rank-badge">#{index + 1}</div>
                <img src={u.img} alt={u.name} className="follow-avatar" />
                <div className="follow-info">
                  <span className="follow-name">{u.name}</span>
                  <span className="follow-title">{u.title}</span>
                </div>
                <button className="follow-btn">Profilini Gör</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}