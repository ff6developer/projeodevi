"use client"

import { useRouter } from "next/navigation"
import AuthForm from "../../components/AuthForm"
import "../../styles/login.css"

export default function Login() {
  const router = useRouter()

  return (
    <AuthForm
      title="Giriş Yap"
      subtitle="ELMENES COFFEE hesabınıza giriş yapın"
      fields={[
        {
          id: "email",
          label: "Email",
          type: "email",
          autoComplete: "email",
          placeholder: "email@example.com",
          required: true
        },
        {
          id: "password",
          label: "Şifre",
          type: "password",
          autoComplete: "current-password",
          placeholder: "Şifrenizi girin",
          required: true
        }
      ]}
      submitUrl="http://localhost:5000/api/auth/login"
      submitMethod="POST"
      submitButtonText="Giriş Yap"
      adminCheck={{
        email: "admin@gmail.com",
        password: "admin123",
        redirect: "/adminpanel",
        alertMessage: "Admin olarak giriş yaptın",
        storageKey: "isAdmin",
        storageValue: "true"
      }}
      onSuccess={(data) => {
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("isLoggedIn", "true")
        alert(`Hoş geldin, ${data.user.name}!`)
        router.push("/profil")
      }}
      onError={(data) => data.message || "Giriş başarısız"}
      links={[
        { href: "#", label: "Şifremi Unuttum", isExternal: true },
        { href: "/kayit", label: "Hesap Oluştur" }
      ]}
    />
  )
}