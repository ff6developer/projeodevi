"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Camera, LogOut, Trash2, Zap } from "lucide-react"
import "@/styles/profil.css"
import { useToast } from "@/components/ToastProvider"
import { getUser, setUser as setSessionUser, clearSession } from "@/lib/session"
import { getOrders, STATUS_LABEL } from "@/lib/orders"
import { formatDateTime } from "@/lib/format"
import {
  Button,
  IconButton,
  Card,
  Badge,
  Input,
  Textarea,
  Tabs,
  Modal,
  Price,
  EmptyState,
  useConfirm,
} from "@/components/ui"

type Coffee = {
  id: number
  name: string
  image?: string | null
  score?: number
  total?: number
  isFromArena?: boolean
  details?: Record<string, { name?: string } | null>
}
type Post = {
  id: number
  text: string
  date: string
  arenaScore?: number
  coffee?: { name?: string; image?: string | null; details?: Record<string, { name?: string } | null> }
}

const DETAIL_ORDER = ["milkType", "beanType", "foam", "cupType", "syrup", "spice", "sweetener", "technique"] as const

export default function ProfilClient() {
  const router = useRouter()
  const toast = useToast()
  const confirm = useConfirm()

  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState("/profilikon.png")
  const [posts, setPosts] = useState<Post[]>([])
  const [coffees, setCoffees] = useState<Coffee[]>([])

  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null)
  const [postText, setPostText] = useState("")

  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editBio, setEditBio] = useState("")

  useEffect(() => {
    const parsed = getUser()
    if (!parsed) {
      router.push("/giris")
      return
    }
    setUser(parsed)
    setEditName(parsed.name)
    setEditEmail(parsed.email)

    try {
      const p = localStorage.getItem("userPosts")
      if (p) setPosts(JSON.parse(p))
      const a = localStorage.getItem("userAvatar")
      if (a) setAvatar(a)
      const b = localStorage.getItem("userBio")
      if (b) {
        setBio(b)
        setEditBio(b)
      }
      setCoffees(JSON.parse(localStorage.getItem("coffees") || "[]"))
    } catch {
      /* yoksay */
    }
  }, [router])

  const orders = useMemo(() => getOrders(), [])

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const saveProfile = () => {
    if (!user) return
    const updated = { ...user, name: editName, email: editEmail }
    setSessionUser(updated)
    setUser(updated)
    setBio(editBio)
    localStorage.setItem("userBio", editBio)
    setShowEdit(false)
    toast.success("Profil güncellendi.")
  }

  const persistPosts = (next: Post[]) => {
    setPosts(next)
    localStorage.setItem("userPosts", JSON.stringify(next))
  }

  const sharePost = () => {
    if (!selectedCoffee || !postText.trim()) {
      toast.warning("Bir kahve seç ve birkaç kelime yaz.")
      return
    }
    const newPost: Post = {
      id: Date.now(),
      text: postText.trim(),
      date: new Date().toISOString(),
      arenaScore: selectedCoffee.score || 0,
      coffee: {
        name: selectedCoffee.name,
        image: selectedCoffee.image,
        details: selectedCoffee.details,
      },
    }
    persistPosts([newPost, ...posts])
    const arenaPosts = JSON.parse(localStorage.getItem("arenaPosts") || "[]")
    localStorage.setItem(
      "arenaPosts",
      JSON.stringify([{ ...newPost, userName: user?.name, userAvatar: avatar }, ...arenaPosts]),
    )
    setPostText("")
    setSelectedCoffee(null)
    toast.success("Tasarımın toplulukta paylaşıldı.")
  }

  const deletePost = async (id: number) => {
    const ok = await confirm({ title: "Gönderiyi sil", confirmText: "Sil", tone: "danger" })
    if (!ok) return
    persistPosts(posts.filter((p) => p.id !== id))
    const arenaPosts = JSON.parse(localStorage.getItem("arenaPosts") || "[]")
    localStorage.setItem(
      "arenaPosts",
      JSON.stringify(arenaPosts.filter((p: { id: number }) => p.id !== id)),
    )
  }

  const deleteCoffee = async (id: number) => {
    const ok = await confirm({ title: "Kahveyi sil", confirmText: "Sil", tone: "danger" })
    if (!ok) return
    const next = coffees.filter((c) => c.id !== id)
    setCoffees(next)
    localStorage.setItem("coffees", JSON.stringify(next))
    if (selectedCoffee?.id === id) setSelectedCoffee(null)
  }

  if (!user) {
    return <div className="profil-page container"><EmptyState title="Yükleniyor…" /></div>
  }

  const totalScore = posts.reduce((a, p) => a + (p.arenaScore || 0), 0)

  const detailTags = (details?: Record<string, { name?: string } | null>) =>
    DETAIL_ORDER.map((k) => details?.[k]?.name).filter(Boolean) as string[]

  const gonderilerTab = (
    <div className="profil-share">
      <Card pad="md">
        <h3>Toplulukta paylaş</h3>
        {coffees.length === 0 ? (
          <p className="profil-muted">
            Önce bir kahve tasarla, sonra buradan toplulukla paylaşabilirsin.
          </p>
        ) : (
          <>
            <p className="profil-label">Kahve seç</p>
            <div className="profil-coffee-picker">
              {coffees.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`profil-coffee-opt${selectedCoffee?.id === c.id ? " is-active" : ""}`}
                  onClick={() => setSelectedCoffee(c)}
                >
                  <strong>{c.name}</strong>
                  <span>{c.score} puan</span>
                </button>
              ))}
            </div>

            {selectedCoffee && (
              <p className="profil-selected-note">
                <strong>{selectedCoffee.name}</strong> — {detailTags(selectedCoffee.details).join(", ")}
              </p>
            )}

            <Textarea
              label="Birkaç kelime"
              placeholder="Bu tarifi neden seviyorsun?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            <div className="profil-share-actions">
              <Button onClick={sharePost} disabled={!selectedCoffee || !postText.trim()}>
                Paylaş
              </Button>
            </div>
          </>
        )}
      </Card>

      <div className="profil-feed">
        {posts.length === 0 ? (
          <EmptyState title="Henüz paylaşımın yok" />
        ) : (
          posts.map((p) => (
            <Card key={p.id} pad="md" className="profil-post">
              <div className="profil-post-head">
                <span className="profil-post-meta">
                  {formatDateTime(p.date) || p.date}
                </span>
                <IconButton
                  label="Gönderiyi sil"
                  tone="danger"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => deletePost(p.id)}
                />
              </div>
              <p className="profil-post-text">{p.text}</p>
              {p.coffee?.image && (
                <span className="profil-post-img">
                  <Image src={p.coffee.image} alt={p.coffee.name || "Kahve"} width={480} height={320} />
                </span>
              )}
              <div className="profil-post-foot">
                <strong>{p.coffee?.name || "İsimsiz kahve"}</strong>
                <span className="profil-post-score">
                  <Zap size={14} aria-hidden="true" /> {p.arenaScore || 0} puan
                </span>
              </div>
              <div className="profil-tags">
                {detailTags(p.coffee?.details).map((t, i) => (
                  <span key={i} className="profil-tag">{t}</span>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )

  const kahvelerimTab =
    coffees.length === 0 ? (
      <EmptyState
        title="Henüz kahve tasarlamadın"
        action={<Button href="/kahveniolustur">Kahveni tasarla</Button>}
      />
    ) : (
      <div className="profil-coffees">
        {coffees.map((c) => (
          <Card key={c.id} pad="md" className="profil-coffee-card">
            <div className="profil-coffee-card-head">
              <div>
                <strong>{c.name}</strong>
                {c.isFromArena && <Badge tone="accent">Topluluk</Badge>}
              </div>
              <IconButton
                label="Kahveyi sil"
                tone="danger"
                size="sm"
                icon={<Trash2 size={16} />}
                onClick={() => deleteCoffee(c.id)}
              />
            </div>
            <div className="profil-tags">
              {detailTags(c.details).map((t, i) => (
                <span key={i} className="profil-tag">{t}</span>
              ))}
            </div>
            <div className="profil-coffee-card-foot">
              {typeof c.total === "number" && <Price value={c.total * 100} />}
              <span className="profil-post-score">
                <Zap size={14} aria-hidden="true" /> {c.score || 0}
              </span>
            </div>
          </Card>
        ))}
      </div>
    )

  const siparislerimTab =
    orders.length === 0 ? (
      <EmptyState
        title="Henüz siparişin yok"
        action={<Button href="/menu">Menüye git</Button>}
      />
    ) : (
      <div className="profil-orders">
        {orders.map((o) => (
          <Card
            key={o.id}
            as="a"
            href={`/siparis?o=${o.id}`}
            interactive
            pad="md"
            className="profil-order"
          >
            <div className="profil-order-head">
              <strong className="text-mono">#{o.id}</strong>
              <Badge tone={o.status === "hazir" || o.status === "teslim" ? "success" : "accent"}>
                {STATUS_LABEL[o.status]}
              </Badge>
            </div>
            <p className="profil-order-items">
              {o.items.map((it) => it.name).join(", ")}
            </p>
            <div className="profil-order-foot">
              <span className="profil-post-meta">{formatDateTime(o.createdAt)}</span>
              <Price value={o.totalKurus} />
            </div>
          </Card>
        ))}
      </div>
    )

  return (
    <div className="profil-page container container-narrow">
      <Card pad="lg" className="profil-hero">
        <label className="profil-avatar">
          <Image src={avatar} alt="" width={96} height={96} className="profil-avatar-img" />
          <span className="profil-avatar-overlay">
            <Camera size={18} />
          </span>
          <input type="file" accept="image/*" hidden onChange={handleAvatar} />
        </label>
        <div className="profil-hero-body">
          <h1 className="profil-name">{user.name}</h1>
          <p className="profil-email">{user.email}</p>
          {bio && <p className="profil-bio">{bio}</p>}
          <div className="profil-hero-actions">
            <Button variant="secondary" size="md" onClick={() => setShowEdit(true)}>
              Profili düzenle
            </Button>
            <Button variant="ghost" size="md" onClick={() => { clearSession(); router.push("/giris") }}>
              <LogOut size={16} aria-hidden="true" /> Çıkış
            </Button>
          </div>
        </div>
        <div className="profil-stats">
          <div>
            <strong>{posts.length}</strong>
            <span>Gönderi</span>
          </div>
          <div>
            <strong>{coffees.length}</strong>
            <span>Kahve</span>
          </div>
          <div>
            <strong>{totalScore}</strong>
            <span>Puan</span>
          </div>
        </div>
      </Card>

      <Tabs
        items={[
          { id: "posts", label: "Gönderiler", content: gonderilerTab },
          { id: "coffees", label: "Kahvelerim", content: kahvelerimTab },
          { id: "orders", label: "Siparişlerim", content: siparislerimTab },
        ]}
      />

      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Profili düzenle"
        actions={
          <>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Vazgeç</Button>
            <Button onClick={saveProfile}>Kaydet</Button>
          </>
        }
      >
        <div className="profil-edit-form">
          <Input label="Ad" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <Input label="E-posta" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
          <Textarea
            label="Hakkında"
            placeholder="Kendinden kısaca bahset…"
            maxLength={150}
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}
