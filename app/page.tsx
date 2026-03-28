import { redirect } from "next/navigation";

export default function RootPage() {
  // Kullanıcı ana sayfaya geldiği anda Kahve Arenası'na yönlendirilir
  redirect("/kahvearenasii");
}