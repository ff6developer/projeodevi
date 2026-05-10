"use client"

import Image from "next/image"
import { Zap, Trash2 } from "lucide-react"

interface PostCardProps {
  post: any
  user: any
  avatar: string
  onDelete: (id: number) => void
}

export default function PostCard({ post, user, avatar, onDelete }: PostCardProps) {
  const coffee = post.coffee

  // Kahve detaylarını güvenli şekilde al
  const details = coffee?.details || {}

  const ingredients = [
    details.milkType?.name,
    details.beanType?.name,
    details.foam?.name,
    details.cupType?.name,
    details.syrup?.name,
    details.spice?.name,
    details.sweetener?.name,
    details.technique?.name
  ].filter(Boolean)

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user-info">
          <Image
            src={avatar}
            alt={user.name}
            width={40}
            height={40}
            className="post-user-avatar"
          />
          <div>
            <span className="post-user-name">{user.name}</span>
            <div className="post-date">{post.date}</div>
          </div>
        </div>
        <button className="delete-post" onClick={() => onDelete(post.id)}>
          <Trash2 size={18} />
        </button>
      </div>

      <p className="post-text">{post.text}</p>

      {coffee?.image && (
        <div className="post-main-image-wrapper">
          <Image
            src={coffee.image}
            alt={coffee.name || "Kahve"}
            width={600}
            height={400}
            className="post-main-image"
          />
        </div>
      )}

      <div className="post-coffee-info">
        <div className="post-coffee-details">
          <span className="post-coffee-name">{coffee?.name || "İsimsiz Kahve"}</span>
          <div className="post-ingredients">
            {ingredients.map((item, idx) => (
              <span key={idx} className="post-ingredient-tag">{item}</span>
            ))}
          </div>
        </div>
        <div className="post-arena-score">
          <Zap size={16} /> {post.arenaScore || 0} puan
        </div>
      </div>
    </div>
  )
}