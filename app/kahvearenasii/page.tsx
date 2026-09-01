import { redirect } from "next/navigation";

// Eski adres — kalıcı yönlendirme (geriye uyumluluk).
export default function KahveArenasiRedirect() {
  redirect("/topluluk");
}
