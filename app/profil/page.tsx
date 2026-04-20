"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image" // Performans için eklendi
import { 
  Camera, Plus, Share2, Coffee, X, LogOut, 
  Heart, MessageCircle, Trophy, Zap, Image as ImageIcon 
} from "lucide-react"
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
  const [arenaCoffeeName, setArenaCoffeeName] = useState("")
  const [arenaCoffeeImage, setArenaCoffeeImage] = useState<string | null>(null)

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

  const handleCoffeeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setArenaCoffeeImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleBioChange = (val: string) => {
    setBio(val)
    localStorage.setItem("userBio", val)
  }

  const sharePost = () => {
    if (!postText.trim() || !arenaCoffeeImage || !arenaCoffeeName.trim() || !lastDesign) {
        alert("Lütfen tüm alanları doldurun!")
        return
    }
    
    const newPost = {
      id: Date.now(),
      text: postText,
      coffee: {
          ...lastDesign,
          name: arenaCoffeeName,
          image: arenaCoffeeImage
      }, 
      date: new Date().toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      arenaScore: lastDesign.score || 0 
    }

    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem("userPosts", JSON.stringify(updatedPosts))
    
    const allArenaPosts = JSON.parse(localStorage.getItem("arenaPosts") || "[]")
    localStorage.setItem("arenaPosts", JSON.stringify([{ ...newPost, userName: user?.name, userAvatar: avatar }, ...allArenaPosts]))

    setPostText("")
    setArenaCoffeeName("")
    setArenaCoffeeImage(null)
  }

  const deletePost = useCallback((postId: number) => {
    setPosts(prev => {
      const filtered = prev.filter(p => p.id !== postId)
      localStorage.setItem("userPosts", JSON.stringify(filtered))
      return filtered
    })
  }, [])

  if (!user) return <div className="loading-screen"><h2>Yükleniyor...</h2></div>

  // BURASI: İstediğin WebP güncellemelerini buraya yaptım!
  const suggestedUsers = [
    { name: "Baristanesli", img: "/pp1.webp", title: "Master Barista" },
    { name: "CoffeeQueen", img: "/pp2.webp", title: "Roaster" },
    { name: "LatteKing", img: "/pp3.webp", title: "Artiste" }
  ]

  const isShareDisabled = !postText.trim() || !arenaCoffeeImage || !arenaCoffeeName.trim();

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
              <Image 
                src={avatar} 
                alt="Profil" 
                width={150} 
                height={150} 
                priority // LCP Skoru için en önemli resim
                className="profil-avatar"
              />
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
          </div>
        </header>

        {/* --- PAYLAŞIM ALANI --- */}
        <section className="post-section">
          <div className="section-title-wrapper">
              <h2><Plus size={22} /> Arenada Paylaş</h2>
              {!lastDesign && <span className="warning-text">Önce bir kahve tasarlamalısın!</span>}
          </div>
          
          <div className={`post-box ${!lastDesign ? "locked-box" : ""}`}>
            {lastDesign && (
              <div className="arena-preparation-area">
                <div className="arena-form-row">
                    <input 
                        type="text" 
                        placeholder="Kahve İsmi..." 
                        className="arena-coffee-name-input"
                        value={arenaCoffeeName}
                        onChange={(e) => setArenaCoffeeName(e.target.value)}
                    />
                    
                    <label className={`arena-mini-upload ${arenaCoffeeImage ? 'has-image' : ''}`}>
                        {arenaCoffeeImage ? (
                          <Image src={arenaCoffeeImage} alt="Preview" width={40} height={40} />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                        <input type="file" hidden accept="image/*" onChange={handleCoffeeImageUpload} />
                    </label>
                </div>
              </div>
            )}

            <textarea
              className="post-input"
              placeholder={lastDesign ? "Arenayı salla..." : "Kilitli..."}
              value={postText}
              disabled={!lastDesign}
              onChange={e => setPostText(e.target.value)}
            />
            
            <div className="post-actions">
              <button 
                className={`share-btn ${isShareDisabled ? "disabled" : ""}`} 
                onClick={sharePost}
                disabled={isShareDisabled}
              >
                <Share2 size={18} /> Paylaş
              </button>
            </div>
          </div>

          {/* POST FEED */}
          <div className="post-feed">
            {posts.map((p) => (
              <div key={p.id} className="post-card arena-card">
                <header className="post-header">
                  <div className="post-user-info">
                    <Image src={avatar} alt="User" width={40} height={40} className="post-user-avatar" />
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
                      <Image 
                        src={p.coffee.image} 
                        alt={p.coffee.name} 
                        width={600} 
                        height={400} 
                        className="post-main-image" 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- ARENA DEVLERİ --- */}
        <section className="follow-section">
          <div className="section-title-wrapper">
            <h2><Trophy size={20} color="#ffcc00" /> Arena Devleri</h2>
          </div>
          <div className="follow-grid">
            {suggestedUsers.map((u, index) => (
              <div key={u.name} className={`follow-card ${index === 0 ? "champion-border" : ""}`}>
                <div className="rank-badge">#{index + 1}</div>
                {/* BURASI: WebP resimlerin ekrana basıldığı yer */}
                <Image 
                  src={u.img} 
                  alt={u.name} 
                  width={60} 
                  height={60} 
                  className="follow-avatar" 
                />
                <div className="follow-info">
                  <span className="follow-name">{u.name}</span>
                  <span className="follow-title">{u.title}</span>
                </div>
                <button className="follow-btn">Gör</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}