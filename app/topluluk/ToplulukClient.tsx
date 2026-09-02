"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Flame, MessageCircle, ClipboardCopy, Coffee } from "lucide-react"
import "@/styles/kahvearenasi.css"
import { useToast } from "@/components/ToastProvider"
import { getRemainingDays, rollOverIfNeeded } from "@/lib/community"
import {
  Button,
  IconButton,
  Card,
  Badge,
  Input,
  LoadingState,
  EmptyState,
  useConfirm,
} from "@/components/ui"

type Post = {
  id: number
  userName?: string
  userAvatar?: string
  likes?: number
  arenaScore?: number
  comments?: { id: number; text: string; user: string }[]
  coffee?: { name?: string; image?: string | null; details?: Record<string, unknown> }
  details?: Record<string, unknown>
}

const HOW_IT_WORKS = [
  "Kahveni oluştur ve toplulukta paylaş",
  "Diğer kullanıcılar oy versin",
  "Oy aldıkça sıralamada yüksel",
  "Ay sonunda en çok oyu topla",
  "Ayın öne çıkan tasarımına ödül",
]

const REWARDS = [
  { image: "/arena-gift.png", title: "Özel hediye kutusu", desc: "Ayın öne çıkan tasarımına özel hazırlanmış hediye kutusu." },
  { image: "/kupon.png", title: "%15 indirim kuponu", desc: "Tüm kahve çeşitlerinde geçerli özel indirim." },
  { image: "/bardak.png", title: "İsimli seramik kupa", desc: "Ayın öne çıkanına özel, isim yazılı kupa." },
]

export default function ToplulukClient() {
  const router = useRouter()
  const toast = useToast()
  const confirm = useConfirm()

  const [posts, setPosts] = useState<Post[]>([])
  const [votedPosts, setVotedPosts] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeComments, setActiveComments] = useState<number | null>(null)
  const [commentText, setCommentText] = useState("")
  const [remainingDays, setRemainingDays] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const raw = JSON.parse(localStorage.getItem("arenaPosts") || "[]") as Post[]
      setPosts(rollOverIfNeeded(raw) as Post[])
      setVotedPosts(JSON.parse(localStorage.getItem("userVotes") || "[]"))
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const update = () => setRemainingDays(getRemainingDays())
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [])

  const persist = (next: Post[]) => {
    setPosts(next)
    localStorage.setItem("arenaPosts", JSON.stringify(next))
  }

  const handleVote = (id: number) => {
    const voted = votedPosts.includes(id)
    const nextVotes = voted ? votedPosts.filter((v) => v !== id) : [...votedPosts, id]
    const nextPosts = posts.map((p) =>
      p.id === id ? { ...p, likes: Math.max(0, (p.likes || 0) + (voted ? -1 : 1)) } : p,
    )
    setVotedPosts(nextVotes)
    persist(nextPosts)
    localStorage.setItem("userVotes", JSON.stringify(nextVotes))
  }

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      title: "Tasarımı kaldır",
      description: "Bu kahve tasarımı seçkiden ve sıralamadan kaldırılacak.",
      confirmText: "Kaldır",
      tone: "danger",
    })
    if (!ok) return
    persist(posts.filter((p) => p.id !== id))
  }

  const handleAddComment = (id: number) => {
    if (!commentText.trim()) return
    persist(
      posts.map((p) =>
        p.id === id
          ? { ...p, comments: [...(p.comments || []), { id: Date.now(), text: commentText.trim(), user: "Sen" }] }
          : p,
      ),
    )
    setCommentText("")
  }

  const copyRecipe = (post: Post) => {
    const d = post.coffee?.details || post.details || {}
    localStorage.setItem(
      "copiedRecipe",
      JSON.stringify({
        ...d,
        fromArena: true,
        locked: true,
        name: post.coffee?.name || "Topluluk Kahvesi",
        image: post.coffee?.image || null,
        arenaScore: post.arenaScore || 0,
      }),
    )
    toast.success("Tarif kahve tasarımına aktarıldı — %15 indirim uygulandı.")
    router.push("/kahveniolustur")
  }

  const topThree = useMemo(
    () => [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3),
    [posts],
  )
  const participantCount = useMemo(
    () => new Set(posts.map((p) => p.userName).filter(Boolean)).size,
    [posts],
  )

  return (
    <div className="community container">
      <header className="community-head">
        <p className="eyebrow">Topluluk</p>
        <h1>Bu ayın seçkisi</h1>
        <p className="community-sub">
          Kendi kahveni tasarla, toplulukla paylaş, oy ver. Ay sonunda en çok oyu alan
          tasarım öne çıkar.
        </p>
        <Badge tone="accent">{remainingDays} gün kaldı</Badge>
      </header>

      <section className="community-section">
        <h2>Nasıl çalışır</h2>
        <ol className="community-steps">
          {HOW_IT_WORKS.map((s, i) => (
            <li key={i}>
              <span className="community-step-n">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="community-section">
        <h2>Ödüller</h2>
        <div className="community-rewards">
          {REWARDS.map((r) => (
            <Card key={r.title} pad="md">
              <span className="community-reward-img">
                <Image src={r.image} alt="" width={64} height={64} />
              </span>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {!isLoading && topThree.length > 0 && (
        <section className="community-section">
          <h2>Sıralama</h2>
          <ol className="community-rank">
            {topThree.map((p, i) => (
              <li key={p.id}>
                <span className="community-rank-n">{i + 1}</span>
                <span className="community-rank-img">
                  <Image src={p.coffee?.image || "/profilikon.png"} alt="" width={44} height={44} />
                </span>
                <span className="community-rank-body">
                  <strong>{p.coffee?.name || "İsimsiz kahve"}</strong>
                  <span className="community-rank-user">@{p.userName}</span>
                </span>
                <span className="community-rank-votes">
                  <Flame size={14} aria-hidden="true" /> {p.likes || 0}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="community-section">
        <div className="community-feed-head">
          <h2>Seçki</h2>
          {participantCount > 0 && (
            <span className="community-count">{participantCount} kişi paylaştı</span>
          )}
        </div>

        {isLoading ? (
          <LoadingState />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<Coffee size={32} />}
            title="Henüz tasarım paylaşılmamış"
            description="Bu ayın seçkisinde ilk sıra senin olabilir."
            action={<Button href="/kahveniolustur">Kahveni tasarla</Button>}
          />
        ) : (
          <div className="community-grid">
            {posts.map((post) => (
              <Card key={post.id} pad="none" className="community-card">
                <span className="community-card-img">
                  <Image
                    src={post.coffee?.image || "/profilikon.png"}
                    alt={post.coffee?.name || "Kahve"}
                    fill
                    sizes="(max-width: 640px) 100vw, 340px"
                  />
                </span>
                <div className="community-card-body">
                  <span className="community-card-user">
                    <Image
                      src={post.userAvatar || "/profilikon.png"}
                      alt=""
                      width={22}
                      height={22}
                      className="community-card-avatar"
                    />
                    @{post.userName}
                  </span>
                  <h3 className="community-card-name">{post.coffee?.name || "İsimsiz kahve"}</h3>

                  <div className="community-card-actions">
                    <Button
                      variant={votedPosts.includes(post.id) ? "primary" : "secondary"}
                      size="md"
                      onClick={() => handleVote(post.id)}
                    >
                      <Flame
                        size={16}
                        fill={votedPosts.includes(post.id) ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                      {post.likes || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() =>
                        setActiveComments(activeComments === post.id ? null : post.id)
                      }
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      {post.comments?.length || 0}
                    </Button>
                    <IconButton
                      label="Tarifi kahve tasarımına kopyala"
                      icon={<ClipboardCopy size={18} />}
                      onClick={() => copyRecipe(post)}
                    />
                    <IconButton
                      label="Tasarımı kaldır"
                      tone="danger"
                      icon={<Coffee size={18} />}
                      onClick={() => handleDelete(post.id)}
                    />
                  </div>

                  {activeComments === post.id && (
                    <div className="community-comments">
                      {(post.comments || []).map((c) => (
                        <p key={c.id} className="community-comment">
                          <strong>@{c.user}</strong> {c.text}
                        </p>
                      ))}
                      <div className="community-comment-form">
                        <Input
                          label="Yorumun"
                          placeholder="Yaz…"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                        />
                        <Button size="md" onClick={() => handleAddComment(post.id)}>
                          Gönder
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
