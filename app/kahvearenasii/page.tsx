"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import html2canvas from "html2canvas" // Kütüphane import edildi
import { 
  Trophy, MessageCircle, Zap, Filter, Award, 
  Flame, X, User, ShoppingCart, Send, Star, Download 
} from "lucide-react"
import "../../styles/kahvearenasi.css"

export default function KahveArenasi() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true) // Skeleton state
  const [selectedUser, setSelectedUser] = useState<any>(null) 
  const [activeComments, setActiveComments] = useState<number | null>(null)
  const [commentText, setCommentText] = useState("")

  // Verileri Yükle
  useEffect(() => {
    // Gerçekçi bir yükleme simülasyonu (1.2 saniye)
    const timer = setTimeout(() => {
      const allArenaPosts = JSON.parse(localStorage.getItem("arenaPosts") || "[]")
      setPosts(allArenaPosts)
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // --- AI: Tat Profili Tahminleyicisi ---
  const getFlavorNotes = (details: any) => {
    const notes = []
    if (details?.beanType?.name === "Ethiopia") notes.push("🍓 Meyvemsi", "🌸 Yasemin")
    if (details?.technique?.name === "V60") notes.push("✨ Berrak", "🍋 Sitrik")
    if (details?.milkType?.name === "Yulaf Sütü") notes.push("🌾 Tatlımsı")
    if (notes.length === 0) notes.push("☕ Dengeli", "🍫 Çikolamsı")
    return notes.slice(0, 2)
  }

  // --- STORY OLARAK İNDİRME FONKSİYONU ---
  const downloadStory = async (postId: number) => {
    const element = document.getElementById(`post-card-${postId}`);
    if (!element) return;

    try {
      // Kaliteyi artırmak için scale: 2 kullanıyoruz
      const canvas = await html2canvas(element, {
        useCORS: true, 
        scale: 2,
        backgroundColor: "#080808",
        borderRadius: 35
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `elmenes-coffee-story-${postId}.png`;
      link.click();
    } catch (err) {
      console.error("Görsel oluşturma hatası:", err);
      alert("Görsel hazırlanırken bir hata oluştu.");
    }
  };

  const topThree = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 3)
  }, [posts])

  const handleVote = useCallback((postId: number) => {
    setPosts(prevPosts => {
      const updated = prevPosts.map(p => 
        p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
      )
      localStorage.setItem("arenaPosts", JSON.stringify(updated))
      return updated
    })
  }, [])

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

  const copyRecipe = (details: any) => {
    localStorage.setItem("copiedRecipe", JSON.stringify(details))
    alert("Tarif laboratuvara aktarıldı!")
    router.push("/kahveniolustur")
  }

  return (
    <div className="arena-page">
      <div className="arena-overlay"></div>

      <header className="arena-header">
        <div className="arena-title-area">
          <Trophy className="gold-trophy" size={40} />
          <h1>KAHVE ARENASI</h1>
          <p>Yapay Zeka Destekli Tat Analizi ve Şampiyonlar Meydanı</p>
        </div>
      </header>

      {/* --- KÜRSÜ (THE PODIUM) --- */}
      {!isLoading && topThree.length > 0 && (
        <section className="podium-section">
          <div className="podium-container">
            {[topThree[1], topThree[0], topThree[2]].map((item, idx) => {
              if (!item) return null
              const isGold = item.id === topThree[0].id
              return (
                <div key={item.id} className={`podium-card ${isGold ? 'gold' : idx === 0 ? 'silver' : 'bronze'}`} onClick={() => setSelectedUser(item)}>
                  {isGold && <div className="winner-crown"><Award size={40} /></div>}
                  <div className="rank-label">#{isGold ? '1' : idx === 0 ? '2' : '3'}</div>
                  <Image src={item.coffee.image} alt="Winner" width={isGold ? 160 : 120} height={isGold ? 160 : 120} priority className="podium-img" />
                  <div className="podium-info">
                    <strong>{item.coffee.name}</strong>
                    <span>@{item.userName}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* --- GLOBAL FEED --- */}
      <main className="arena-feed">
        <div className="feed-filter-bar">
          <h2>Meydan Okuyanlar <span>({posts.length})</span></h2>
          <button className="filter-btn"><Filter size={16} /> En Çok Beğenilenler</button>
        </div>

        <div className="arena-grid">
          {isLoading ? (
            // --- SKELETON LOADER DÖNGÜSÜ ---
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="arena-item-card skeleton-card">
                <div className="skeleton" style={{ width: '100%', height: '250px', borderRadius: '25px' }}></div>
                <div className="card-body">
                  <div className="skeleton" style={{ width: '60%', height: '20px', marginBottom: '10px' }}></div>
                  <div className="skeleton" style={{ width: '40%', height: '15px' }}></div>
                </div>
              </div>
            ))
          ) : (
            posts.map((post) => (
              <div key={post.id} id={`post-card-${post.id}`} className="arena-item-card">
                <div className="card-image-wrapper">
                  <Image src={post.coffee.image} alt={post.coffee.name} width={400} height={300} loading="lazy" className="card-main-img" />
                  <div className="score-badge"><Zap size={14} /> {post.arenaScore} Puan</div>
                  
                  {/* STORY OLARAK İNDİR BUTONU */}
                  <button 
                    className="download-story-btn" 
                    title="Story Modunda İndir" 
                    onClick={(e) => { e.stopPropagation(); downloadStory(post.id); }}
                  >
                    <Download size={18} />
                  </button>

                  <button className="copy-recipe-btn" onClick={(e) => { e.stopPropagation(); copyRecipe(post.coffee.details); }}>
                    <ShoppingCart size={18} />
                  </button>
                </div>

                <div className="card-body">
                  <div className="user-line" onClick={() => setSelectedUser(post)}>
                    <Image src={post.userAvatar || "/profilikon.png"} alt="User" width={24} height={24} className="avatar-round" />
                    <span>@{post.userName}</span>
                  </div>
                  <h3>{post.coffee.name}</h3>
                  
                  {/* AI TAT NOTALARI */}
                  <div className="flavor-tags">
                    {getFlavorNotes(post.coffee.details).map((note, i) => (
                      <span key={i} className="flavor-tag">{note}</span>
                    ))}
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

                  {activeComments === post.id && (
                    <div className="comment-section-mini">
                      <div className="comment-list">
                        {post.comments?.map((c: any) => (
                          <div key={c.id} className="mini-comment">
                            <span className="comment-author">@{c.user}</span>
                            <span className="comment-text">{c.text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="comment-input-row">
                        <input type="text" placeholder="Yaz..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)} />
                        <button onClick={() => handleAddComment(post.id)}><Send size={16}/></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* --- PROFİL YAN PANELİ (DRAWER) --- */}
      {selectedUser && (
        <div className="user-drawer-overlay open" onClick={() => setSelectedUser(null)}>
          <div className="user-drawer" onClick={e => e.stopPropagation()}>
            <button className="close-drawer" onClick={() => setSelectedUser(null)}><X size={24} /></button>
            <div className="drawer-content">
              <div className="drawer-header">
                <div className="drawer-avatar-bg">
                  <Image src={selectedUser.userAvatar || "/profilikon.png"} alt="User" width={80} height={80} />
                </div>
                <h2>@{selectedUser.userName}</h2>
                <div className="barista-rank"><Star size={14} fill="#ffcc00" color="#ffcc00" /> Master Barista</div>
              </div>
              <div className="drawer-stats-row">
                <div className="drawer-stat-item"><strong>{selectedUser.likes || 0}</strong><span>OY</span></div>
                <div className="drawer-stat-item"><strong>{selectedUser.arenaScore || 0}</strong><span>PUAN</span></div>
              </div>
              <button className="full-profile-btn" onClick={() => router.push(`/profil`)}>
                TAM PROFİLİ GÖR <User size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}