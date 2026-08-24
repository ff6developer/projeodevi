const express = require('express');
const cors = require('cors');
const app = express();

// Burayı böyle güncelle:
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Geçici bir "veritabanı" (Sunucu kapanınca sıfırlanır)
const users = [];

// NOT: Rotalar "/api/backend" öneki ile tanımlanıyor çünkü Vercel Services
// yönlendirmesi isteğin ORİJİNAL tam path'ini backend servisine değiştirmeden
// iletir (bkz. kök dizindeki vercel.json'daki rewrite kuralı). Yani tarayıcıdan
// /api/backend/auth/login'e giden bir istek, Express'e de tam olarak
// /api/backend/auth/login olarak ulaşır.

// --- KAYIT OLMA (REGISTER) ---
app.post('/api/backend/auth/register', (req, res) => {
    const { name, email, password } = req.body;

    // Email daha önce kullanılmış mı?
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "Bu email zaten kayıtlı!" });
    }

    const newUser = { name, email, password };
    users.push(newUser);
    
    console.log("Yeni kullanıcı kaydedildi:", name);
    res.status(201).json({ message: "Kayıt başarılı!", user: newUser });
});

// --- GİRİŞ YAPMA (LOGIN) ---
app.post('/api/backend/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Email veya şifre hatalı!" });
    }

    console.log("Giriş başarılı:", user.name);
    res.status(200).json({ 
        message: "Giriş başarılı", 
        user: { name: user.name, email: user.email } 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend sunucusu http://localhost:${PORT} adresinde çalışıyor!`);
});