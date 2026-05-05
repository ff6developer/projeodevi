"use client"

import { useRouter } from "next/navigation"
import AuthForm from "../../components/AuthForm"
import "../../styles/login.css"

export default function Signin() {
  const router = useRouter()

  return (
    <AuthForm
      title="Kayıt Ol"
      subtitle="ELMENES COFFEE hesabı oluşturun"
      fields={[
        {
          id: "name",
          label: "Ad Soyad",
          type: "text",
          autoComplete: "name",
          placeholder: "Adınızı girin",
          required: true
        },
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
          autoComplete: "new-password",
          placeholder: "Şifre oluşturun",
          required: true
        }
      ]}
      submitUrl="http://127.0.0.1:5000/api/auth/register"
      submitMethod="POST"
      submitButtonText="Kayıt Ol"
      noValidate={true}
      onSuccess={() => {
        alert("Kayıt başarılı ✔")
        router.push("/giris")
      }}
      onError={(data) => data.message || "Bir hata oluştu"}
      links={[
        { text: "Zaten hesabınız var mı?", href: "/giris", label: "Giriş Yap" }
      ]}
    />
  )
}