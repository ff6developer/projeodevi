'use client'; 
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// 1. TİPLER VE ARAYÜZLER
type KategoriTipi = 'sicak' | 'soguk' | 'tatli';

interface Yorum {
  kullanici: string;
  puan: number;
  metin: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: string;
  image: string;
}

// 2. YILDIZ BİLEŞENİ
function StarRating({ rating, onRatingChange, saltOkunur = false }: { 
  rating: number; 
  onRatingChange?: (newRating: number) => void;
  saltOkunur?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: '4px', fontSize: saltOkunur ? '1rem' : '1.6rem', cursor: saltOkunur ? 'default' : 'pointer', justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !saltOkunur && onRatingChange && onRatingChange(star)}
          style={{ 
            color: star <= rating ? '#facc15' : '#d1d5db',
            transition: 'all 0.1s'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// 3. ANA MENÜ SAYFASI
export default function MenuPage() {
  const router = useRouter();
  const [kategori, setKategori] = useState<KategoriTipi>('sicak');
  const [tumYorumlar, setTumYorumlar] = useState<Record<number, Yorum[]>>({});
  const [yeniYorum, setYeniYorum] = useState("");
  const [yeniPuan, setYeniPuan] = useState(5);
  const [aktifUrunId, setAktifUrunId] = useState<number | null>(null);
  const menuBaslangicRef = useRef<HTMLDivElement>(null);

  const arenaSampiyonu = {
    name: "Caramel Dream Latte",
    creator: "Zeynep Kaya",
    image: "/champion-coffee.jpg" 
  };

  const menuVerisi: Record<KategoriTipi, MenuItem[]> = {
    sicak: [
      { id: 1, name: "Espresso", price: "80 TL", image: "/espresso.jpg" }, 
      { id: 2, name: "Latte", price: "110 TL", image: "/latte.jpg" },
      { id: 3, name: "Cappicino", price: "100 TL", image: "/cappicino.jpg" },
      { id: 4, name: "Americano", price: "95 TL", image: "/amerikano.jpg" },
      { id: 5, name: "Filtre", price: "95 TL", image: "/filtre.jpg" },
      { id: 6, name: "Mocha", price: "95 TL", image: "/mocha.jpg" },
      { id: 7, name: "Macciato", price: "95 TL", image: "/macciato.jpg" },
      { id: 8, name: "Türk kahvesi", price: "95 TL", image: "/türk kahvesi.jpg" },
      { id: 9, name: "Flat White", price: "95 TL", image: "/Flat White.jpg" },
    ],
    soguk: [
      { id: 10, name: "Iced Latte", price: "120 TL", image: "/Iced Latte.jpg" },
      { id: 11, name: "Cold Brew", price: "115 TL", image: "/cod brew.jpg" },
      { id: 12, name: "Frappe", price: "130 TL", image: "/frappe.jpg" },
      { id: 13, name: "Iced Americano", price: "100 TL", image: "/Iced Americano.jpg" },
      { id: 14, name: "Iced caramel Macchiato", price: "95 TL", image: "/Caramel Macchiato.jpg" },
      { id: 15, name: "Iced Mocha", price: "95 TL", image: "/ıceMocha.jpg" },
      { id: 16, name: "White Mocha", price: "95 TL", image: "/white mocha.jpg" }
    ],
    tatli: [
      { id: 18, name: "Sufle", price: "80 TL", image: "/sufle.jpg" },
      { id: 19, name: "Limonlu Cheesecake", price: "80 TL", image: "/lmchasecake.jpg" },
      { id: 20, name: "ispanyol creamy", price: "80 TL", image: "/San Sebastian.jpg" },
      { id: 21, name: "frambuazlı Cheesecake", price: "80 TL", image: "/frcheesecake.jpg" },
      { id: 22, name: "cookie", price: "80 TL", image: "/Cookies.jpg" },
      { id: 23, name: "Çikolatalı donat", price: "80 TL", image: "/donat.jpg" },
      { id: 24, name: "Brownie", price: "80 TL", image: "/Brownie.jpg" },
    ]
  };

  const yorumGonder = (id: number) => {
    if (!yeniYorum.trim()) return;
    const yorumObjesi: Yorum = { kullanici: "Müşteri", puan: yeniPuan, metin: yeniYorum };
    setTumYorumlar(onceki => ({ ...onceki, [id]: [...(onceki[id] || []), yorumObjesi] }));
    setYeniYorum("");
    setYeniPuan(5);
    setAktifUrunId(null);
  };

  return (
    <div style={{
      backgroundImage: "url('/menuark.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      padding: '20px',
      margin: 0,
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', fontSize: '2.3rem', fontStyle: 'italic', color: '#5d4037', marginBottom: '5px' }}>Menü</h2>
      <h1 style={{ textAlign: 'center', color: 'black', fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '40px' }}>ELMENES COFFEE</h1>

      {/* Şampiyon Kartı */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 50px auto', width: '100%', paddingLeft: '60px' }}>
        <div style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', border: '3px solid #facc15', borderRadius: '30px', padding: '30px', display: 'flex', alignItems: 'center', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', backdropFilter: 'blur(5px)' }}>
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{ color: '#d97706', fontWeight: 'bold', margin: 0 }}>🏅 KAHVE ARENASI ŞAMPİYONU</p>
            <h2 style={{ fontSize: '2.2rem', color: '#3e2723', margin: '10px 0' }}>{arenaSampiyonu.name}</h2>
            <p style={{ margin: 0 }}>Yapan: <strong>{arenaSampiyonu.creator}</strong></p>
          </div>
          <img src={arenaSampiyonu.image} alt={arenaSampiyonu.name} style={{ width: '150px', height: '150px', borderRadius: '20px', border: '4px solid white', objectFit: 'cover' }} />
          
          {/* ARENAYA GİDEN BUTON */}
          <button 
            onClick={() => router.push('/kahvearenasii')} 
            style={{ padding: '15px 30px', backgroundColor: '#3e2723', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          >
            Detaylara Git →
          </button>
        </div>
      </div>

      {/* Kategori Butonları */}
      <div ref={menuBaslangicRef} style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap', paddingLeft: '60px' }}>
        {['sicak', 'soguk', 'tatli'].map((kat) => (
          <button 
            key={kat}
            onClick={() => setKategori(kat as KategoriTipi)}
            style={{ padding: '12px 30px', borderRadius: '25px', border: 'none', cursor: 'pointer', backgroundColor: kategori === kat ? '#3e2723' : '#d7ccc8', color: kategori === kat ? 'white' : 'black', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {kat === 'sicak' ? 'Sıcaklar' : kat === 'soguk' ? 'Soğuklar' : 'Tatlılar'}
          </button>
        ))}
      </div>

      {/* Ürünler Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, 285px)', 
        gap: '25px', 
        maxWidth: '1300px', 
        margin: '0 auto',
        justifyContent: 'center',
        paddingBottom: '100px',
        paddingLeft: '60px', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {menuVerisi[kategori].map((item) => (
          <div key={item.id} style={{
            width: '285px',
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <img 
              src={item.image} 
              alt={item.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px' }} 
            />
            <h3 style={{ color: '#3e2723', marginTop: '15px', fontSize: '1.2rem' }}>{item.name}</h3>
            <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' }}>{item.price}</p>

            <div style={{ width: '100%', marginTop: 'auto', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Yorumlar ({tumYorumlar[item.id]?.length || 0})</h4>
              
              <div style={{ maxHeight: '80px', overflowY: 'auto', margin: '5px 0' }}>
                {tumYorumlar[item.id]?.map((y, index) => (
                  <div key={index} style={{ backgroundColor: 'rgba(255,255,255,0.4)', padding: '5px', borderRadius: '8px', marginBottom: '5px', fontSize: '0.8rem', textAlign: 'left' }}>
                    <StarRating rating={y.puan} saltOkunur />
                    <p style={{ margin: '2px 0' }}>{y.metin}</p>
                  </div>
                ))}
              </div>

              {aktifUrunId === item.id ? (
                <div style={{ marginTop: '10px' }}>
                  <StarRating rating={yeniPuan} onRatingChange={setYeniPuan} />
                  <textarea value={yeniYorum} onChange={(e) => setYeniYorum(e.target.value)} placeholder="Yazın..." style={{ width: '100%', height: '60px', marginTop: '10px', borderRadius: '10px', padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc' }} />
                  <button onClick={() => yorumGonder(item.id)} style={{ width: '100%', marginTop: '10px', padding: '8px', backgroundColor: '#3e2723', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Gönder</button>
                </div>
              ) : (
                <button onClick={() => setAktifUrunId(item.id)} style={{ marginTop: '10px', background: 'none', border: '1px solid #3e2723', color: '#3e2723', padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>Yorum Yap</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}