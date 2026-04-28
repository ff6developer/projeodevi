"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Camera, Plus, Share2, Trophy, Zap, X, LogOut, Image as ImageIcon
} from "lucide-react"

import "../../styles/profil.css"

export default function Page() {

  const router = useRouter()

  const [user, setUser] = useState<{name: string; email: string} | null>(null)
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState("/profilikon.png")

  const [posts, setPosts] = useState<any[]>([])
  const [postText, setPostText] = useState("")

  const [lastDesign, setLastDesign] = useState<any>(null)
  const [coffees, setCoffees] = useState<any[]>([])
  const [selectedCoffee, setSelectedCoffee] = useState<any>(null)

  const [arenaCoffeeName, setArenaCoffeeName] = useState("")
  const [arenaCoffeeImage, setArenaCoffeeImage] = useState<string | null>(null)

  // Profil düzenleme modal state
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user")
    if (!loggedInUser) {
      router.push("/giris")
      return
    }

    const parsed = JSON.parse(loggedInUser)
    setUser(parsed)
    setEditName(parsed.name)
    setEditEmail(parsed.email)

    const savedPosts = localStorage.getItem("userPosts")
    if (savedPosts) setPosts(JSON.parse(savedPosts))

    const savedAvatar = localStorage.getItem("userAvatar")
    if (savedAvatar) setAvatar(savedAvatar)

    const savedBio = localStorage.getItem("userBio")
    if (savedBio) setBio(savedBio)

    const savedCoffee = localStorage.getItem("lastCoffeeDesign")
    if (savedCoffee) setLastDesign(JSON.parse(savedCoffee))

    const savedCoffees = JSON.parse(localStorage.getItem("coffees") || "[]")
    setCoffees(savedCoffees)

  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    window.dispatchEvent(new Event("authChanged"))
    router.push("/giris")
  }

  const handleAvatar = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setAvatar(base64)
      localStorage.setItem("userAvatar", base64)
    }
    reader.readAsDataURL(file)
  }

  const saveProfileChanges = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      name: editName,
      email: editEmail
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setShowEdit(false)
  }

  const handleCoffeeImageUpload = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setArenaCoffeeImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleBioChange = (text: string) => {
    setBio(text)
    localStorage.setItem("userBio", text)
  }

  const sharePost = () => {
    if (!postText || !selectedCoffee || !arenaCoffeeName || !arenaCoffeeImage) {
      alert("Tüm alanları doldurun!")
      return
    }

    const newPost = {
      id: Date.now(),
      text: postText,
      date: new Date().toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      coffee: {
        ...selectedCoffee,
        name: arenaCoffeeName,
        image: arenaCoffeeImage
      },
      arenaScore: lastDesign?.score || 0
    }

    const updated = [newPost, ...posts]
    setPosts(updated)
    localStorage.setItem("userPosts", JSON.stringify(updated))

    setPostText("")
    setArenaCoffeeName("")
    setArenaCoffeeImage(null)
  }

  const deletePost = useCallback((id: number) => {
    setPosts(prev => {
      const filtered = prev.filter(p => p.id !== id)
      localStorage.setItem("userPosts", JSON.stringify(filtered))
      return filtered
    })
  }, [])

  if (!user) return (
    <div className="loading-screen"><h2>Yükleniyor...</h2></div>
  )

  const suggestedUsers = [
    { name: "Arenadevi#1", img: "/pp1.webp" },
    { name: "Arenadevi#2", img: "/pp2.webp" },
    { name: "Arenadevi#3", img: "/pp3.webp" }
  ]

  const isShareDisabled =
    !postText.trim() ||
    !arenaCoffeeName.trim() ||
    !arenaCoffeeImage ||
    !selectedCoffee

  return (
    <div className="profil-page">
      <div className="profil-container">

        {/* HEADER */}
        <header className="profil-hero">

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
          </button>

          <div className="avatar-wrapper">
            <label className="avatar-upload">
              <Image
                src={avatar}
                alt="Profil"
                width={160}
                height={160}
                className="profil-avatar"
              />
              <div className="avatar-overlay">
                <Camera size={25} />
              </div>
              <input hidden type="file" accept="image/*" onChange={handleAvatar} />
            </label>
          </div>

          <h1 className="profil-name">{user.name}</h1>
          <p className="profil-email">{user.email}</p>

          <button className="edit-profile-btn" onClick={() => setShowEdit(true)}>
            Profili Düzenle
          </button>

          <textarea
            className="profil-bio"
            value={bio}
            onChange={(e) => handleBioChange(e.target.value)}
            maxLength={150}
            placeholder="Kendinden bahset..."
          />

          <div className="profil-stats">
            <div className="stat-item">
              <strong>{posts.length}</strong>
              <span>Gönderi</span>
            </div>
            <div className="stat-item">
              <strong><Zap size={14} className="stat-icon" /> {posts.reduce((a,p)=>a+(p.arenaScore||0),0)}</strong>
              <span>Arena Puanı</span>
            </div>
          </div>

        </header>

        {/* PROFIL EDIT MODAL */}
        {showEdit && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">

              <h2>Profili Düzenle</h2>

              <label>Ad</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <label>Email</label>
              <input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />

              <label>Profil Fotoğrafı</label>
              <input type="file" accept="image/*" onChange={handleAvatar} />

              <div className="edit-buttons">
                <button className="save-edit-btn" onClick={saveProfileChanges}>
                  Kaydet
                </button>

                <button className="cancel-edit-btn" onClick={() => setShowEdit(false)}>
                  İptal
                </button>
              </div>

            </div>
          </div>
        )}

        {/* POST SECTION */}
        <section className="post-section">
          <div className="section-title-wrapper">
            <h2><Plus size={22} /> Arenada Paylaş</h2>
          </div>

          <div className={`post-box ${!lastDesign ? "locked-box" : ""}`}>
            
            <p>Kahve Seç:</p>

            <div className="coffee-select-list">
              {coffees.map((coffee) => (
                <button
                  key={coffee.id}
                  className={`coffee-select-btn ${selectedCoffee?.id === coffee.id ? "selected" : ""}`}
                  onClick={() => setSelectedCoffee(coffee)}
                >
                  <div className="coffee-select-name">{coffee.name}</div>
                  <div className="coffee-select-score">{coffee.score} puan</div>
                </button>
              ))}
            </div>

            {lastDesign && (
              <div className="arena-preparation-area">
                <div className="arena-form-row">

                  <input
                    className="arena-coffee-name-input"
                    placeholder="Kahve İsmi..."
                    value={arenaCoffeeName}
                    onChange={(e) => setArenaCoffeeName(e.target.value)}
                  />

                  <label className={`arena-mini-upload ${arenaCoffeeImage ? "has-image" : ""}`}>
                    {arenaCoffeeImage ? (
                      <Image src={arenaCoffeeImage} alt="coffee" width={40} height={40}/>
                    ) : (
                      <ImageIcon size={20} />
                    )}
                    <input type="file" hidden accept="image/*" onChange={handleCoffeeImageUpload}/>
                  </label>

                </div>
              </div>
            )}

            <textarea
              className="post-input"
              placeholder={lastDesign ? "Karamel şurubu, yulaf sütü..." : "Kilitli..."}
              disabled={!lastDesign}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />

            <div className="post-actions">
              <button
                className={`share-btn ${isShareDisabled ? "disabled" : ""}`}
                disabled={isShareDisabled}
                onClick={sharePost}
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
                    <Image
                      src={avatar}
                      width={45}
                      height={45}
                      className="post-user-avatar"
                      alt="avatar"
                    />
                    <div>
                      <span className="post-user-name">{user.name}</span>
                      <span className="post-date">{p.date}</span>
                    </div>
                  </div>

                  <button className="delete-post" onClick={() => deletePost(p.id)}>
                    <X size={18} />
                  </button>
                </header>

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
            ))}
          </div>

        </section>

      </div>
    </div>
  )
}
