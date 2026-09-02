"use client"

import { useState } from "react"
import { Trash2, Coffee } from "lucide-react"
import { useToast } from "@/components/ToastProvider"
import {
  Button,
  IconButton,
  Card,
  Badge,
  Input,
  PasswordInput,
  Textarea,
  Select,
  Modal,
  useConfirm,
  Tabs,
  Stepper,
  Progress,
  EmptyState,
  LoadingState,
  Price,
  QuantityStepper,
  RoastMeter,
  IntensityDots,
  OriginTag,
  TastingNotes,
} from "@/components/ui"

export default function DevUiClient() {
  const [modalOpen, setModalOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const confirm = useConfirm()
  const toast = useToast()

  return (
    <div className="container" style={{ paddingBlock: "var(--s-8)", display: "flex", flexDirection: "column", gap: "var(--s-7)" }}>
      <h1>UI Bileşenleri</h1>

      <section>
        <h2>Button</h2>
        <div className="cluster">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="lg">Large</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button href="/menu" variant="secondary">Link</Button>
          <IconButton label="Sil" tone="danger" icon={<Trash2 size={18} />} />
        </div>
      </section>

      <section>
        <h2>Card + Badge + CoffeeSpec</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "var(--s-4)" }}>
          <Card elevated>
            <h3>Etiyopya Yirgacheffe</h3>
            <p className="text-sm text-muted">Çiçeksi, dengeli</p>
            <div className="stack stack-2" style={{ marginTop: "var(--s-3)" }}>
              <RoastMeter level={2} />
              <OriginTag origin="Etiyopya" />
              <IntensityDots value={3} />
              <TastingNotes notes={["Yasemin", "Bergamot", "Bal"]} />
            </div>
            <p style={{ marginTop: "var(--s-3)" }}><Price value={14500} original={16000} /></p>
          </Card>
          <Card interactive as="a" href="#">
            <p>Interactive card</p>
            <div className="cluster" style={{ marginTop: "var(--s-2)" }}>
              <Badge tone="accent">Seçki</Badge>
              <Badge tone="success">Hazır</Badge>
              <Badge tone="warning">Bekliyor</Badge>
              <Badge tone="danger">İptal</Badge>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h2>Field</h2>
        <div className="stack stack-4" style={{ maxWidth: 380 }}>
          <Input label="Ad Soyad" placeholder="Adınız" />
          <Input label="E-posta" type="email" error="Geçerli bir e-posta girin" />
          <PasswordInput label="Şifre" hint="En az 8 karakter" />
          <Textarea label="Not" placeholder="…" />
          <Select label="Teslimat">
            <option>Standart</option>
            <option>Hızlı</option>
          </Select>
        </div>
      </section>

      <section>
        <h2>Modal / Confirm</h2>
        <div className="cluster">
          <Button onClick={() => setModalOpen(true)}>Modal aç</Button>
          <Button
            variant="danger"
            onClick={async () => {
              const ok = await confirm({
                title: "Silinsin mi?",
                description: "Bu işlem geri alınamaz.",
                confirmText: "Sil",
                tone: "danger",
              })
              if (ok) toast.success("Silindi.")
              else toast.info("Vazgeçildi.")
            }}
          >
            Confirm test
          </Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Örnek modal"
          actions={<Button onClick={() => setModalOpen(false)}>Tamam</Button>}
        >
          <p className="text-sm text-muted">İçerik buraya gelir. ESC ile kapanır.</p>
        </Modal>
      </section>

      <section>
        <h2>Tabs / Stepper / Progress / Quantity</h2>
        <Tabs
          items={[
            { id: "a", label: "Gönderiler", content: <p>Sekme A</p> },
            { id: "b", label: "Kahvelerim", content: <p>Sekme B</p> },
            { id: "c", label: "Siparişlerim", content: <p>Sekme C</p> },
          ]}
        />
        <div style={{ marginTop: "var(--s-5)" }}>
          <Stepper steps={["Teslimat", "Yöntem", "Ödeme", "Onay"]} current={2} />
        </div>
        <div style={{ marginTop: "var(--s-5)", maxWidth: 320 }}>
          <Progress value={5} max={8} label="5 / 8 seçim" />
        </div>
        <div style={{ marginTop: "var(--s-5)" }}>
          <QuantityStepper value={qty} onChange={setQty} />
        </div>
      </section>

      <section>
        <h2>States</h2>
        <EmptyState
          icon={<Coffee size={32} />}
          title="Henüz bir şey yok"
          description="İlk kaydı sen oluştur."
          action={<Button href="/menu">Menüye git</Button>}
        />
        <LoadingState />
      </section>
    </div>
  )
}
