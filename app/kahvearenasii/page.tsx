"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Trophy, MessageCircle, Zap, Filter, Award, 
  Flame, X, User, ShoppingCart, Send, Info, 
  Star, Share2, Heart 
} from "lucide-react"
import "../../styles/kahvearenasi.css"

export default function KahveArenasi() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [topThree, setTopThree] = useState<any[]>([])
  
  // Sosyal ve Etkileşim State'leri
  const [selectedUser, setSelectedUser] = useState<any>(null) // Profil Yan Paneli (Drawer)
  const [activeComments, setActiveComments] = useState<number | null>(null) // Hangi postun yorumu açık?
  const [commentText, setCommentText] = useState("")

  // Verileri Yükle
  useEffect(() => {
    const allArenaPosts = JSON.parse(localStorage.getItem("arenaPosts") || "[]")
    
    // Oylara göre sıralayıp kürsü (top 3) belirle
    const sortedForPodium = [...allArenaPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0))
    setTopThree(sortedForPodium.slice(0, 3))
    
    // Tüm akışı yükle
    setPosts(allArenaPosts)
  }, [])

  // Oy Verme (Alev Atma) Fonksiyonu
  const handleVote = (postId: number) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) return { ...p, likes: (p.likes || 0) + 1 }
      return p
    })
    setPosts(updatedPosts)
    localStorage.setItem("arenaPosts", JSON.stringify(updatedPosts))
    
    // Kürsüyü anlık güncelle
    const newTop = [...updatedPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0))
    setTopThree(newTop.slice(0, 3))
  }

  // Yorum Ekleme Fonksiyonu
  const handleAddComment = (postId: number) => {
    if (!commentText.trim()) return
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const newComments = [...(p.comments || []), { id: Date.now(), text: commentText, user: "Sen" }]
        return { ...p, comments: newComments }
      }
      return p
    })
    setPosts(updatedPosts)
    localStorage.setItem("arenaPosts", JSON.stringify(updatedPosts))
    setCommentText("")
  }

  // Reçeteyi Kopyala (Laboratuvara Aktar)
  const copyRecipe = (details: any) => {
    // Tarif bilgilerini laboratuvarın anlayacağı formatta kaydediyoruz
    localStorage.setItem("copiedRecipe", JSON.stringify(details))
    alert("Bu efsane tarif laboratuvara aktarıldı! Hemen denemek için 'Laboratuvar' sayfasına git.")
    router.push("/kahveniolustur")
  }

  return (
    <div className="arena-page">
      <div className="arena-overlay"></div>

      {/* --- ARENA HEADER --- */}
      <header className="arena-header">
        <div className="arena-title-area">
          <Trophy className="gold-trophy" size={40} />
          <h1>KAHVE ARENASI</h1>
          <p>Şampiyonların meydanı. Tasarımlarını yarıştır, oyları topla ve zirveye tırman!</p>
        </div>
      </header>

      {/* --- KÜRSÜ (THE PODIUM) --- */}
      {topThree.length > 0 && (
        <section className="podium-section">
          <div className="podium-container">
            {/* 2. NUMARA (GÜMÜŞ) */}
            {topThree[1] && (
              <div className="podium-card silver" onClick={() => setSelectedUser(topThree[1])}>
                <div className="rank-label">#2</div>
                <img src={topThree[1].coffee.image} alt="Silver" />
                <div className="podium-info">
                  <strong>{topThree[1].coffee.name}</strong>
                  <span>@{topThree[1].userName}</span>
                </div>
              </div>
            )}

            {/* 1. NUMARA (ALTIN - MERKEZ) */}
            {topThree[0] && (
              <div className="podium-card gold" onClick={() => setSelectedUser(topThree[0])}>
                <div className="winner-crown"><Award size={40} /></div>
                <div className="rank-label">#1</div>
                <img src={topThree[0].coffee.image} alt="Gold" />
                <div className="podium-info">
                  <strong>{topThree[0].coffee.name}</strong>
                  <span>@{topThree[0].userName}</span>
                </div>
              </div>
            )}

            {/* 3. NUMARA (BRONZ) */}
            {topThree[2] && (
              <div className="podium-card bronze" onClick={() => setSelectedUser(topThree[2])}>
                <div className="rank-label">#3</div>
                <img src={topThree[2].coffee.image} alt="Bronze" />
                <div className="podium-info">
                  <strong>{topThree[2].coffee.name}</strong>
                  <span>@{topThree[2].userName}</span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- GLOBAL FEED --- */}
      <main className="arena-feed">
        <div className="feed-filter-bar">
          <div className="filter-left">
            <h2>Meydan Okuyanlar <span>({posts.length})</span></h2>
          </div>
          <button className="filter-btn"><Filter size={16} /> En Çok Beğenilenler</button>
        </div>

        <div className="arena-grid">
          {posts.map((post) => (
            <div key={post.id} className="arena-item-card">
              <div className="card-image-wrapper">
                <img src={post.coffee.image} alt={post.coffee.name} />
                <div className="score-badge">
                  <Zap size={14} /> {post.arenaScore} Puan
                </div>
                {/* Tarif Kopyalama Butonu */}
                <button 
                  className="copy-recipe-btn" 
                  onClick={() => copyRecipe(post.coffee.details)} 
                  title="Tarifi Laboratuvara Aktar"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>

              <div className="card-body">
                <div className="user-line" onClick={() => setSelectedUser(post)}>
                  <img src={post.userAvatar || "/profilikon.png"} alt="User" />
                  <span>@{post.userName}</span>
                </div>
                <h3>{post.coffee.name}</h3>
                <p className="post-msg">"{post.text}"</p>

                {/* REÇETE KÜNYESİ (Detaylı görünüm) */}
                <div className="recipe-summary">
                  <span>{post.coffee.details.milkType?.name}</span>
                  <span>{post.coffee.details.beanType?.name}</span>
                  <span>{post.coffee.details.technique?.name}</span>
                </div>

                <div className="card-actions">
                  <button className="vote-btn" onClick={() => handleVote(post.id)}>
                    <Flame size={20} /> {post.likes || 0}
                  </button>
                  <button 
                    className={`comment-btn ${activeComments === post.id ? 'active' : ''}`} 
                    onClick={() => setActiveComments(activeComments === post.id ? null : post.id)}
                  >
                    <MessageCircle size={20} /> {post.comments?.length || 0}
                  </button>
                </div>

                {/* YORUM ALANI (Accordion mantığında açılır) */}
                {activeComments === post.id && (
                  <div className="comment-section-mini">
                    <div className="comment-list">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((c: any) => (
                          <div key={c.id} className="mini-comment">
                            <span className="comment-author">@{c.user}</span>
                            <span className="comment-text">{c.text}</span>
                          </div>
                        ))
                      ) : (
                        <p className="no-comments">Henüz yorum yok, ilk sen yaz!</p>
                      )}
                    </div>
                    <div className="comment-input-row">
                      <input 
                        type="text" 
                        placeholder="Harika görünüyor!..." 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <button onClick={() => handleAddComment(post.id)}><Send size={16}/></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- PROFİL YAN PANELİ (DRAWER) --- */}
      <div className={`user-drawer-overlay ${selectedUser ? 'open' : ''}`} onClick={() => setSelectedUser(null)}>
        <div className="user-drawer" onClick={e => e.stopPropagation()}>
          {selectedUser && (
            <>
              <button className="close-drawer" onClick={() => setSelectedUser(null)}><X size={24} /></button>
              
              <div className="drawer-content">
                <div className="drawer-header">
                  <div className="drawer-avatar-bg">
                    <img src={selectedUser.userAvatar || "/profilikon.png"} alt="User" />
                  </div>
                  <h2>@{selectedUser.userName}</h2>
                  <div className="barista-rank">
                    <Star size={14} fill="#ffcc00" color="#ffcc00" /> Master Barista
                  </div>
                </div>

                <div className="drawer-stats-row">
                  <div className="drawer-stat-item">
                    <strong>{selectedUser.likes || 0}</strong>
                    <span>TOPLAM OY</span>
                  </div>
                  <div className="drawer-stat-item">
                    <strong>{selectedUser.arenaScore || 0}</strong>
                    <span>TASARIM PUANI</span>
                  </div>
                </div>

                <div className="drawer-coffee-showcase">
                  <h4>Öne Çıkan Tasarımı</h4>
                  <div className="showcase-card">
                    <img src={selectedUser.coffee.image} alt="Best Coffee" />
                    <div className="showcase-info">
                      <h5>{selectedUser.coffee.name}</h5>
                      <div className="recipe-summary">
                        <span>{selectedUser.coffee.details.milkType?.name}</span>
                        <span>{selectedUser.coffee.details.technique?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  className="full-profile-btn" 
                  onClick={() => router.push(`/profil`)}
                >
                  TAM PROFİLİ GÖR <User size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}