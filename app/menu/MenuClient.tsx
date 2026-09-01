'use client';

import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import "@/styles/menu.css";
import { useToast } from "@/components/ToastProvider";

type KategoriTipi = 'sicak' | 'soguk' | 'tatli';

interface Yorum {
  kullanici: string;
  puan: number;
  metin: string;
  gorsel?: string;
}
interface MenuItem {
  id: number;
  name: string;
  price: string;
  image: string;
}

function StarRating({
  rating,
  onRatingChange,
  saltOkunur = false,
}: {
  rating: number;
  onRatingChange?: (newRating: number) => void;
  saltOkunur?: boolean;
}) {
  return (
    <div
      className="star-rating"
      style={{
        display: 'flex',
        gap: '4px',
        fontSize: saltOkunur ? '1rem' : '1.6rem',
        cursor: saltOkunur ? 'default' : 'pointer',
        justifyContent: 'center',
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() =>
            !saltOkunur &&
            onRatingChange &&
            onRatingChange(star)
          }
          style={{
            color: star <= rating ? '#facc15' : '#d1d5db',
            transition: 'all 0.1s',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function MenuClient() {
  const router = useRouter();
  const toast = useToast();

  const [kategori, setKategori] =
    useState<KategoriTipi>('sicak');

  const [tumYorumlar, setTumYorumlar] =
    useState<Record<number, Yorum[]>>({});

  const [yeniYorum, setYeniYorum] = useState('');
  const [yeniPuan, setYeniPuan] = useState(5);
  const [aktifUrunId, setAktifUrunId] =
    useState<number | null>(null);

  const [modalUrunId, setModalUrunId] =
    useState<number | null>(null);

  const [yeniGorsel, setYeniGorsel] =
    useState<string>('');

  const [yeniGorselAdi, setYeniGorselAdi] =
    useState<string>('');

  const menuBaslangicRef =
    useRef<HTMLDivElement>(null);

  const dosyaInputRef =
    useRef<HTMLInputElement>(null);

  const [arenaSampiyonu, setArenaSampiyonu] =
    useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('arenaChampion');

    if (data) {
      setArenaSampiyonu(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (!modalUrunId) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalUrunId(null);
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalUrunId]);

  const menuVerisi: Record<KategoriTipi, MenuItem[]> = {
    sicak: [
      {
        id: 1,
        name: 'Espresso',
        price: '80 TL',
        image: '/espresso.jpg',
      },
      {
        id: 2,
        name: 'Latte',
        price: '110 TL',
        image: '/latte.jpg',
      },
      {
        id: 3,
        name: 'Cappicino',
        price: '100 TL',
        image: '/cappicino.jpg',
      },
      {
        id: 4,
        name: 'Americano',
        price: '95 TL',
        image: '/amerikano.jpg',
      },
      {
        id: 5,
        name: 'Filtre',
        price: '95 TL',
        image: '/Filtre.jpg',
      },
      {
        id: 6,
        name: 'Mocha',
        price: '95 TL',
        image: '/mocha.jpg',
      },
      {
        id: 7,
        name: 'Macciato',
        price: '95 TL',
        image: '/macciato.jpg',
      },
      {
        id: 8,
        name: 'Türk kahvesi',
        price: '95 TL',
        image: '/türk kahvesi.jpg',
      },
      {
        id: 9,
        name: 'Flat White',
        price: '95 TL',
        image: '/Flat White.jpg',
      },
    ],

    soguk: [
      {
        id: 10,
        name: 'Iced Latte',
        price: '120 TL',
        image: '/Iced Latte.jpg',
      },
      {
        id: 11,
        name: 'Cold Brew',
        price: '115 TL',
        image: '/cod brew.jpg',
      },
      {
        id: 12,
        name: 'Frappe',
        price: '130 TL',
        image: '/frappe.jpg',
      },
      {
        id: 13,
        name: 'Iced Americano',
        price: '100 TL',
        image: '/Iced Americano.jpg',
      },
      {
        id: 14,
        name: 'Iced caramel Macchiato',
        price: '95 TL',
        image: '/Caramel Macchiato.jpg',
      },
      {
        id: 15,
        name: 'Iced Mocha',
        price: '95 TL',
        image: '/ıceMocha.jpg',
      },
      {
        id: 16,
        name: 'White Mocha',
        price: '95 TL',
        image: '/white mocha.jpg',
      },
    ],

    tatli: [
      {
        id: 18,
        name: 'Sufle',
        price: '80 TL',
        image: '/sufle.jpg',
      },
      {
        id: 19,
        name: 'Limonlu Cheesecake',
        price: '80 TL',
        image: '/lmchasecake.jpg',
      },
      {
        id: 20,
        name: 'ispanyol creamy',
        price: '80 TL',
        image: '/San Sebastian.jpg',
      },
      {
        id: 21,
        name: 'frambuazlı Cheesecake',
        price: '80 TL',
        image: '/frcheesecake.jpg',
      },
      {
        id: 22,
        name: 'cookie',
        price: '80 TL',
        image: '/Cookies.jpg',
      },
      {
        id: 23,
        name: 'Çikolatalı donat',
        price: '80 TL',
        image: '/donat.jpg',
      },
      {
        id: 24,
        name: 'Brownie',
        price: '80 TL',
        image: '/Brownie.jpg',
      },
    ],
  };

  const gorselSec = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.warning(
        "Görsel boyutu 2MB'dan küçük olmalıdır."
      );
      return;
    }

    setYeniGorselAdi(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      setYeniGorsel(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const gorselKaldir = () => {
    setYeniGorsel('');
    setYeniGorselAdi('');

    if (dosyaInputRef.current) {
      dosyaInputRef.current.value = '';
    }
  };

  const yorumGonder = (id: number) => {
    if (!yeniYorum.trim() && !yeniGorsel) return;

    const yorumObjesi: Yorum = {
      kullanici: 'Müşteri',
      puan: yeniPuan,
      metin: yeniYorum,
      gorsel: yeniGorsel || undefined,
    };

    setTumYorumlar((onceki) => ({
      ...onceki,
      [id]: [...(onceki[id] || []), yorumObjesi],
    }));

    setYeniYorum('');
    setYeniPuan(5);
    setYeniGorsel('');
    setYeniGorselAdi('');
    setAktifUrunId(null);

    if (dosyaInputRef.current) {
      dosyaInputRef.current.value = '';
    }
  };

  const yorumIptal = () => {
    setYeniYorum('');
    setYeniPuan(5);
    setYeniGorsel('');
    setYeniGorselAdi('');
    setAktifUrunId(null);

    if (dosyaInputRef.current) {
      dosyaInputRef.current.value = '';
    }
  };

  const urunKartTikla = (
    e: MouseEvent<HTMLElement>,
    id: number
  ) => {
    const target = e.target as HTMLElement | null;

    if (
      target?.closest(
        'button, textarea, input, label, a'
      )
    ) {
      return;
    }

    setModalUrunId(id);
  };

  return (
    <div className="menu-page">
      <p className="menu-subtitle">Menü</p>

      <h1 className="menu-title">
        ELMENES COFFEE
      </h1>

      {arenaSampiyonu && (
        <div className="arena-champion">
          <div className="arena-champion-inner">
            <div className="arena-trophy">🏆</div>

            <div className="arena-info">
              <p className="arena-label">
                Ayın öne çıkan tasarımı
              </p>

              <h2 className="arena-name">
                {arenaSampiyonu?.name}
              </h2>

              <p className="arena-creator">
                Tasarlayan: <strong>{arenaSampiyonu?.creator}</strong>
              </p>
            </div>

            {arenaSampiyonu?.image && (
              <div className="arena-image-wrapper">
                <Image
                  src={arenaSampiyonu.image}
                  alt={arenaSampiyonu?.name}
                  width={150}
                  height={150}
                  className="arena-image"
                />
              </div>
            )}

            <button
              onClick={() =>
                router.push('/topluluk')
              }
              className="arena-btn"
            >
              Detaylara Git →
            </button>
          </div>
        </div>
      )}

      <div
        ref={menuBaslangicRef}
        className="category-buttons"
      >
        {(['sicak', 'soguk', 'tatli'] as const).map(
          (kat) => (
            <button
              key={kat}
              onClick={() => setKategori(kat)}
              className={`category-btn ${
                kategori === kat ? 'active' : ''
              }`}
            >
              {kat === 'sicak'
                ? 'Sıcaklar'
                : kat === 'soguk'
                ? 'Soğuklar'
                : 'Tatlılar'}
            </button>
          )
        )}
      </div>

      <div className="products-grid">
        {menuVerisi[kategori].map((item) => (
          <div
            key={item.id}
            className="product-card"
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            onClick={(e) => urunKartTikla(e, item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setModalUrunId(item.id);
              }
            }}
          >
            <div className="product-image-wrapper">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="product-image"
                sizes="(max-width: 768px) 100vw, 285px"
              />
            </div>

            <h3 className="product-name">
              {item.name}
            </h3>

            <p className="product-price">
              {item.price}
            </p>

            <div className="comments-section">
              <h4 className="comments-title">
                Yorumlar (
                {tumYorumlar[item.id]?.length || 0})
              </h4>

              <div className="comments-list">
                {tumYorumlar[item.id]?.map(
                  (y, index) => (
                    <div
                      key={index}
                      className="comment-item"
                    >
                      <StarRating
                        rating={y.puan}
                        saltOkunur
                      />

                      <p className="comment-text">
                        {y.metin}
                      </p>

                      {y.gorsel && (
                        <div className="comment-image-wrapper">
                          <Image
                            src={y.gorsel}
                            alt="Yorum görseli"
                            width={200}
                            height={150}
                            className="comment-image"
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {aktifUrunId === item.id ? (
                <div className="comment-form">
                  <StarRating
                    rating={yeniPuan}
                    onRatingChange={setYeniPuan}
                  />

                  <textarea
                    value={yeniYorum}
                    onChange={(e) =>
                      setYeniYorum(
                        e.target.value
                      )
                    }
                    placeholder="Yazın..."
                    className="comment-textarea"
                  />

                  <div className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={gorselSec}
                      ref={dosyaInputRef}
                      id={`gorsel-input-${item.id}`}
                      className="image-upload-input"
                    />

                    <label
                      htmlFor={`gorsel-input-${item.id}`}
                      className="image-upload-label"
                    >
                      📷 Görsel Ekle
                    </label>

                    {yeniGorsel && (
                      <div className="image-preview-area">
                        <div className="image-preview-wrapper">
                          <Image
                            src={yeniGorsel}
                            alt="Önizleme"
                            width={120}
                            height={90}
                            className="image-preview"
                          />
                        </div>

                        <div className="image-preview-info">
                          <span className="image-preview-name">
                            {yeniGorselAdi}
                          </span>

                          <button
                            onClick={
                              gorselKaldir
                            }
                            className="image-remove-btn"
                            type="button"
                          >
                            ❌ Kaldır
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="comment-form-buttons">
                    <button
                      onClick={() =>
                        yorumGonder(item.id)
                      }
                      className="comment-submit-btn"
                    >
                      Gönder
                    </button>

                    <button
                      onClick={yorumIptal}
                      className="comment-cancel-btn"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setAktifUrunId(item.id)
                  }
                  className="comment-toggle-btn"
                >
                  Yorum Yap
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalUrunId && (
        <div
          className="menu-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setModalUrunId(null);
            }
          }}
        >
          <div className="menu-modal">
            <button
              className="menu-modal-close"
              onClick={() => setModalUrunId(null)}
              aria-label="Kapat"
              type="button"
            >
              ✕
            </button>

            {menuVerisi[kategori]
              .filter((x) => x.id === modalUrunId)
              .map((item) => (
                <div
                  key={item.id}
                  className="product-card is-modal"
                >
                  <div className="product-image-wrapper">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="product-image"
                      sizes="(max-width: 768px) 92vw, 680px"
                    />
                  </div>

                  <h3 className="product-name">
                    {item.name}
                  </h3>

                  <p className="product-price">
                    {item.price}
                  </p>

                  <div className="comments-section">
                    <h4 className="comments-title">
                      Yorumlar (
                      {tumYorumlar[item.id]?.length ||
                        0}
                      )
                    </h4>

                    <div className="comments-list">
                      {tumYorumlar[item.id]?.map(
                        (y, index) => (
                          <div
                            key={index}
                            className="comment-item"
                          >
                            <StarRating
                              rating={y.puan}
                              saltOkunur
                            />

                            <p className="comment-text">
                              {y.metin}
                            </p>

                            {y.gorsel && (
                              <div className="comment-image-wrapper">
                                <Image
                                  src={y.gorsel}
                                  alt="Yorum görseli"
                                  width={260}
                                  height={180}
                                  className="comment-image"
                                />
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>

                    {aktifUrunId === item.id ? (
                      <div className="comment-form">
                        <StarRating
                          rating={yeniPuan}
                          onRatingChange={setYeniPuan}
                        />

                        <textarea
                          value={yeniYorum}
                          onChange={(e) =>
                            setYeniYorum(
                              e.target.value
                            )
                          }
                          placeholder="Yazın..."
                          className="comment-textarea"
                        />

                        <div className="image-upload-area">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={gorselSec}
                            ref={dosyaInputRef}
                            id={`gorsel-input-modal-${item.id}`}
                            className="image-upload-input"
                          />

                          <label
                            htmlFor={`gorsel-input-modal-${item.id}`}
                            className="image-upload-label"
                          >
                            📷 Görsel Ekle
                          </label>

                          {yeniGorsel && (
                            <div className="image-preview-area">
                              <div className="image-preview-wrapper">
                                <Image
                                  src={yeniGorsel}
                                  alt="Önizleme"
                                  width={120}
                                  height={90}
                                  className="image-preview"
                                />
                              </div>

                              <div className="image-preview-info">
                                <span className="image-preview-name">
                                  {yeniGorselAdi}
                                </span>

                                <button
                                  onClick={gorselKaldir}
                                  className="image-remove-btn"
                                  type="button"
                                >
                                  ❌ Kaldır
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="comment-form-buttons">
                          <button
                            onClick={() =>
                              yorumGonder(item.id)
                            }
                            className="comment-submit-btn"
                          >
                            Gönder
                          </button>

                          <button
                            onClick={yorumIptal}
                            className="comment-cancel-btn"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setAktifUrunId(item.id)
                        }
                        className="comment-toggle-btn"
                      >
                        Yorum Yap
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
