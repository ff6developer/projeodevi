"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { 
  Trophy, MessageCircle, Zap, Award, 
  Flame, X, User, ShoppingCart, Send, Star 
} from "lucide-react"
import "../../styles/kahvearenasi.css"

export default function KahveArenasi() {
  const router = useRouter()

  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null) 
  const [activeComments, setActiveComments] = useState<number | null>(null)
  const [commentText, setCommentText] = useState("")
  const [remainingDays, setRemainingDays] = useState(0)

  // TURNOVA KONTROL SİSTEMİ
  const checkTournament = (posts: any[]) => {
    const start = localStorage.getItem("tournamentStart")

    // ilk giriş
    if (!start) {
      localStorage.setItem("tournamentStart", Date.now().toString())
      return posts
    }

    const now = Date.now()
    const diff = now - Number(start)
    const ONE_MONTH = 1000 * 60 * 60 * 24 * 30

    // süre dolduysa
    if (diff > ONE_MONTH) {
      if (posts.length > 0) {
        const winner = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0]

        // şampiyonu kaydet
        localStorage.setItem("championCoffee", JSON.stringify(winner))
      }

      // arena sıfırla
      localStorage.setItem("arenaPosts", JSON.stringify([]))
      localStorage.setItem("tournamentStart", Date.now().toString())

      return []
    }

    return posts
  }

  // VERİ YÜKLE
  useEffect(() => {
    const timer = setTimeout(() => {
      const rawPosts = JSON.parse(localStorage.getItem("arenaPosts") || "[]")
      const checkedPosts = checkTournament(rawPosts)

      setPosts(checkedPosts)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Geri sayım
useEffect(() => {
  let start = localStorage.getItem("tournamentStart")

  // eğer hiç yoksa şimdi başlat
  if (!start) {
    start = Date.now().toString()
    localStorage.setItem("tournamentStart", start)
  }

  const startTime = Number(start)

  const calculate = () => {
    const now = Date.now()
    const diff = now - startTime

    const ONE_DAY = 1000 * 60 * 60 * 24
    const passedDays = Math.floor(diff / ONE_DAY)

    const remaining = 30 - passedDays

    setRemainingDays(remaining > 0 ? remaining : 0)
  }

  calculate()

  // her dakika güncelle (isteğe bağlı ama daha doğru)
  const interval = setInterval(calculate, 60000)

  return () => clearInterval(interval)
}, [])

  // TOP 3
  const topThree = [...posts]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 3)

  // LIKE
  const handleVote = (postId: number) => {
    const updated = posts.map(p => 
      p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
    )

    setPosts(updated)
    localStorage.setItem("arenaPosts", JSON.stringify(updated))
  }

  // YORUM
  const handleAddComment = (postId: number) => {
    if (!commentText.trim()) return

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const newComments = [
          ...(p.comments || []),
          { id: Date.now(), text: commentText, user: "Sen" }
        ]
        return { ...p, comments: newComments }
      }
      return p
    })

    setPosts(updatedPosts)
    localStorage.setItem("arenaPosts", JSON.stringify(updatedPosts))
    setCommentText("")
  }

  // TARİF KOPYALA
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
          <p>Kahveni Oluştur ve Şampiyonlar Ligine Katıl!</p>
          <span>{remainingDays} gün kaldı</span>
        </div>
      </header>

      {!isLoading && topThree.length > 0 && (
        <section className="podium-section">
          <div className="podium-container">
            {[topThree[1], topThree[0], topThree[2]].map((item, idx) => {
              if (!item) return null
              const isGold = item.id === topThree[0].id

              return (
                <div 
                  key={item.id}
                  className={`podium-card ${isGold ? 'gold' : idx === 0 ? 'silver' : 'bronze'}`}
                  onClick={() => setSelectedUser(item)}
                >
                  {isGold && <div className="winner-crown"><Award size={40} /></div>}

                  <div className="rank-label">
                    #{isGold ? '1' : idx === 0 ? '2' : '3'}
                  </div>

                  <Image
                    src={item.coffee.image}
                    alt="Winner"
                    width={isGold ? 160 : 120}
                    height={isGold ? 160 : 120}
                    priority
                    className="podium-img"
                  />

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

      <main className="arena-feed">
        <div className="arena-grid">

          {isLoading ? (
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
                  <Image
                    src={post.coffee.image}
                    alt={post.coffee.name}
                    width={400}
                    height={300}
                    className="card-main-img"
                  />

                  <div className="score-badge">
                    <Zap size={14} /> {post.arenaScore} Puan
                  </div>

                  <button 
                    className="copy-recipe-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyRecipe(post.coffee.details)
                    }}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>

                <div className="card-body">
                  <div className="user-line" onClick={() => setSelectedUser(post)}>
                    <Image src={post.userAvatar || "/profilikon.png"} alt="User" width={24} height={24} className="avatar-round" />
                    <span>@{post.userName}</span>
                  </div>

                  <h3>{post.coffee.name}</h3>
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
                      <input
                        type="text"
                        placeholder="Yaz..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <button onClick={() => handleAddComment(post.id)}>
                        <Send size={16}/>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))
          )}

        </div>
      </main>

      {selectedUser && (
        <div className="user-drawer-overlay open" onClick={() => setSelectedUser(null)}>
          <div className="user-drawer" onClick={e => e.stopPropagation()}>

            <button className="close-drawer" onClick={() => setSelectedUser(null)}>
              <X size={24} />
            </button>

            <div className="drawer-content">
              <div className="drawer-header">
                <div className="drawer-avatar-bg">
                  <Image src={selectedUser.userAvatar || "/profilikon.png"} alt="User" width={80} height={80} />
                </div>

                <h2>@{selectedUser.userName}</h2>

                <div className="barista-rank">
                  <Star size={14} fill="#ffcc00" color="#ffcc00" /> Master Barista
                </div>
              </div>

              <div className="drawer-stats-row">
                <div className="drawer-stat-item">
                  <strong>{selectedUser.likes || 0}</strong>
                  <span>OY</span>
                </div>
                <div className="drawer-stat-item">
                  <strong>{selectedUser.arenaScore || 0}</strong>
                  <span>PUAN</span>
                </div>
              </div>

              <button 
                className="full-profile-btn"
                onClick={() => router.push(`/profil`)}
              >
                TAM PROFİLİ GÖR <User size={18} />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}