'use client'; 
import { useState } from 'react';

// Yıldız Bileşeni
function StarRating({ rating, onRatingChange }: { 
  rating: number; 
  onRatingChange: (newRating: number) => void 
}) {
  return (
    <div style={{ display: 'flex', gap: '4px', fontSize: '1.6rem', cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRatingChange(star)}
          style={{ 
            color: star <= rating ? '#facc15' : '#d1d5db',
            transition: 'all 0.1s'
          }}
          onMouseEnter={() => onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

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

export default function MenuPage() {
  const [kategori, setKategori] = useState<KategoriTipi>('sicak');
  const [tumYorumlar, setTumYorumlar] = useState<Record<number, Yorum[]>>({});
  const [yeniYorum, setYeniYorum] = useState("");
  const [yeniPuan, setYeniPuan] = useState(5);
  const [aktifUrunId, setAktifUrunId] = useState<number | null>(null);
    // Arena Şampiyonu State'i
  const [arenaSampiyonu] = useState({
    id: 999,
    name: "Caramel Dream Latte",
    price: "135 TL",
    image: "/champion-coffee.jpg",   // kendi fotoğrafını koy
    likes: 187,
    creator: "Zeynep Kaya"
  });
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
      { id: 9, name: "Flat White", price: "95 TL", image: "/flat vhıte.jpg" },
    ],
    soguk: [
      { id: 10, name: "Iced Latte", price: "120 TL", image: "/ıced latte.jpg" },
      { id: 11, name: "Cold Brew", price: "115 TL", image: "/cold brew.jpg" },
      { id: 12, name: "Frappe", price: "130 TL", image: "/frappe.jpg" },
      { id: 13, name: "Iced Americano", price: "100 TL", image: "/ice americano.jpg" },
      { id: 14, name: "Iced caramel Macchiato", price: "95 TL", image: "/Iced Caramel Macchiato.jpg" },
      { id: 15, name: "Iced Mocha", price: "95 TL", image: "/ıced mocha.jpg" },
      { id: 16, name: "Vanilla Iced Latte", price: "95 TL", image: "/Vanilla Iced Latte.jpg" }
    ],
    tatli: [
      { id: 17, name: "Tremisu", price: "80 TL", image: "/Tiramisu.jpg" },
      { id: 18, name: "Sufle", price: "80 TL", image: "/sufle.jpg" },
      { id: 19, name: "Limonlu Cheesecake", price: "80 TL", image: "/Limonlu Cheesecake.jpg" },
      { id: 20, name: "ispanyol creamy", price: "80 TL", image: "/ispanyol creamy.jpg" },
      { id: 21, name: "frambuazlı Cheesecake", price: "80 TL", image: "/frambuazlı Cheesecake.jpg" },
      { id: 22, name: "cookie", price: "80 TL", image: "/cookie.jpg" },
      { id: 23, name: "Çikolatalı donat", price: "80 TL", image: "/çikolatalı donat.jpg" },
      { id: 24, name: "Brownie", price: "80 TL", image: "/Brownie.jpg" },
    ]
  };

  const yorumGonder = (id: number) => {
    if (!yeniYorum.trim()) return;
    
    const yorumObjesi: Yorum = {
      kullanici: "Müşteri",
      puan: yeniPuan,
      metin: yeniYorum
    };

    setTumYorumlar(onceki => ({
      ...onceki,
      [id]: [...(onceki[id] || []), yorumObjesi]
    }));

    setYeniYorum("");
    setYeniPuan(5);        // puan da sıfırlansın
    setAktifUrunId(null);
  };

  return (
    <div style={{
      backgroundImage: "url('/menuark.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '10px 15px',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '2.3rem',
        fontStyle: 'italic',
        fontWeight: '500',
        fontFamily: 'Playfair Display, serif',
        color: '#5d4037',
        letterSpacing: '1px',
        marginBottom: '5px'
      }}>
        Menü
      </h2>
      <h1 style={{ textAlign: 'center', color: 'black', fontSize: '3rem', fontWeight: 'bold' }}>
        ELMENES COFFEE
      </h1>
            {/* ==================== ARENA ŞAMPİYONU ==================== */}
      <div style={{
        maxWidth: '1532px',
        margin: '20px auto 40px auto',
        padding: '0 15px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 215, 0, 0.18)',
          border: '3px solid #facc15',
          borderRadius: '25px',
          padding: '25px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}>
          <div style={{ fontSize: '3.8rem' }}>🏆</div>
          
          <div style={{ flex: 1 }}>
            <p style={{ color: '#d97706', fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '1.1rem' }}>
              🏅 KAHVE ARENASI ŞAMPİYONU
            </p>
            <h2 style={{ margin: '0 0 8px 0', color: '#3e2723', fontSize: '2.2rem' }}>
              {arenaSampiyonu.name}
            </h2>
            <p style={{ margin: 0, color: '#5d4037', fontSize: '1.05rem' }}>
              Yapan: <strong>{arenaSampiyonu.creator}</strong> • {arenaSampiyonu.likes} Beğeni
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <img 
              src={arenaSampiyonu.image} 
              alt={arenaSampiyonu.name}
              style={{ 
                width: '155px', 
                height: '155px', 
                objectFit: 'cover', 
                borderRadius: '18px',
                border: '4px solid white',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }} 
            />
            <p style={{ marginTop: '8px', fontWeight: 'bold', color: '#3e2723', fontSize: '1.1rem' }}>
              {arenaSampiyonu.price}
            </p>
          </div>

          <button style={{
            padding: '16px 32px',
            backgroundColor: '#3e2723',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>
            Detaylara Git →
          </button>
        </div>
      </div>
      {/* ==================== ARENA ŞAMPİYONU BİTTİ ==================== */}

      {/* Kategoriler */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
        {['sicak', 'soguk', 'tatli'].map((kat) => (
          <button 
            key={kat}
            onClick={() => setKategori(kat as KategoriTipi)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: kategori === kat ? '#3e2723' : '#d7ccc8',
              color: kategori === kat ? 'white' : 'black',
              fontWeight: 'bold'
            }}>
            {kat === 'sicak' ? 'Sıcaklar' : kat === 'soguk' ? 'Soğuklar' : 'Tatlılar'}
          </button>
        ))}
      </div>

      {/* Ürünler */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))', 
        gap: '20px', 
        maxWidth: '1532px', 
        margin: '0 auto',
        padding: '0 15px'
      }}>
        {menuVerisi[kategori].map((item) => (
          <div key={item.id} style={{
            backgroundColor: 'rgba(196, 180, 154, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px' }} />
            <h3 style={{ color: '#3e2723', marginTop: '15px' }}>{item.name}</h3>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.price}</p>

            {/* Yorumlar Alanı */}
            <div style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
              <h4 style={{ fontSize: '0.9rem' }}>Yorumlar ({tumYorumlar[item.id]?.length || 0})</h4>
              
              {tumYorumlar[item.id]?.map((y, index) => (
                <div key={index} style={{ backgroundColor: 'rgba(255,255,255,0.4)', padding: '8px', borderRadius: '8px', marginBottom: '5px', fontSize: '0.85rem' }}>
                  <strong>{"⭐".repeat(y.puan)}</strong>
                  <p style={{ margin: '5px 0' }}>{y.metin}</p>
                </div>
              ))}

              {/* DÜZELTİLMİŞ KISIM */}
              {aktifUrunId === item.id ? (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ margin: '8px 0 5px 0', fontSize: '0.9rem', color: '#5d4037' }}>
                    Puan verin:
                  </p>
                  
                  <StarRating 
                    rating={yeniPuan} 
                    onRatingChange={setYeniPuan} 
                  />

                  <textarea
                    value={yeniYorum}
                    onChange={(e) => setYeniYorum(e.target.value)}
                    placeholder="Deneyiminizi yazın..."
                    style={{ 
                      width: '100%', 
                      height: '70px', 
                      marginTop: '10px',
                      borderRadius: '8px', 
                      padding: '8px', 
                      border: '1px solid #ccc' 
                    }}
                  />
                  <button 
                    onClick={() => yorumGonder(item.id)} 
                    style={{ 
                      width: '100%', 
                      marginTop: '8px', 
                      padding: '10px', 
                      backgroundColor: '#3e2723', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Yorum Gönder
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAktifUrunId(item.id)}
                  style={{ 
                    marginTop: '10px', 
                    background: 'none', 
                    border: '1px solid #3e2723', 
                    color: '#3e2723', 
                    padding: '6px 12px', 
                    borderRadius: '15px', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem' 
                  }}
                >
                  Yorum Yap
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
