# OLX NEO ADMIN — Boshqaruv va Moderatsiya Tizimi

Ushbu loyiha OLX O'zbekiston uchun mo'ljallangan zamonaviy, reaktiv, yuqori darajada himoyalangan va 1-ga-1 rasm asosida yaratilgan **Next.js + Tailwind CSS + Flowbite** boshqaruv panelidir.

## 🚀 Texnologiyalar
- **Next.js 14** (App Router, `.jsx` va `.js` fayllar asosida)
- **React 18**
- **Tailwind CSS 3.4** (Custom OLX Neo ranglar palitrasi, soyalar, glow va animatsiyalar)
- **Lucide React** (Zamonaviy vektor ikonalar)
- **Context API** (Global xabarnomalar, tostlar, til almashtirish va holatlar boshqaruvi)

---

## 📂 Sahifalar va Yo'nalishlar (Routes)

1. **Boshqaruv paneli (Dashboard)** — `http://localhost:3000/`
   - Asosiy statistika kartalari (Jami foydalanuvchilar, Faol e'lonlar, Kutilayotgan moderatsiya, Daromad).
   - "Tashriflar va yangi e'lonlar dinamikasi" interaktiv SVG grafigi, hover tooltip, haftalik/kunlik intervallar.
   - So'nggi qo'shilgan e'lonlar jadvali, toifalar filtri (Barchasi, VIP, Kutilayotgan), tasdiqlash va rad etish harakatlari, batafsil ko'rish modali va sahifalash (pagination).

2. **Moderatsiya va E'lon Tafsilotlari** — `http://localhost:3000/moderatsiya`
   - Jonli navbatdagi e'lonlar oqimi (Chevrolet Malibu 2, iPhone 14 Pro, Kvartira, PS5).
   - Tanlangan e'lonning to'liq ko'rinishi (Single Item Review).
   - 5 ta fotosuratdan iborat interaktiv karusel, ruxsat etilgan kattalashtirish (lightbox zoom) va kichik suratlar (thumbnails).
   - Avtomobil/tovar texnik xususiyatlari jadvali (Yili, Masofa, Yoqilg'i, Manzil).
   - Rad etish sababini kiritish va tezkor teglar (+ Noto'g'ri narx, + Sifatsiz fotosurat, + Taqiqlangan).
   - "Tahrirlashni so'rash", "Rad etish" va "Tasdiqlash" tugmalari.

3. **Foydalanuvchilar boshqaruvi** — `http://localhost:3000/foydalanuvchilar`
   - Jami foydalanuvchilar, Faol mijozlar va Bloklanganlar hisoboti.
   - Ism, telefon, rol (Admin, Moderator, Biznes profil, Foydalanuvchi) va status bo'yicha jonli filtrlar.
   - Foydalanuvchini bloklash / blokdan chiqarish, tahrirlash modali va Excel (XLSX) formatida yuklab olish.
   - Amallar tarixi (Audit Log) ko'rish oynasi.

4. **Kategoriyalar boshqaruvi** — `http://localhost:3000/kategoriyalar`
   - **2 xil rejim:** Jadval ko'rinishi va Daraxt & Tahrirlash (Tree / Drawer) ko'rinishi.
   - Daraxt rejimida ichki toifalar (nested subcategories) ochilib-yopilishi.
   - O'ng tomondagi Kategoriyani tahrirlash paneli (`#CAT-102` Ko'chmas mulk), toifa belgisi (SVG), URL slug avtomatik generatsiyasi, tartib raqami, faol holati va maxsus parametrlar (Maydoni, Xonalar soni va h.k.) teglarini boshqarish.
   - Hududiy taqsimot va o'chirish cheklovi qoidalari.

5. **Shikoyatlar va E'tirozlar** — `http://localhost:3000/shikoyatlar`
   - Jonli shikoyatlar oqimi (24 ta yangi, 18 ta ko'rib chiqilmoqda, 342 ta hal qilingan).
   - `#SH-4812` (iPhone 15 Pro Max, 4.5 mln so'm shubhali zakalat firibgarligi) surishtiruv paneli.
   - Ariza beruvchi va sotuvchi ma'lumotlari, dalil skrinshotlari (chat, karta raqami) kattalashtirish bilan.
   - Avtomatik AI tizim tavsiyasi va chora ko'rish tugmalari ("Ogohlantirish yuborish", "E'lon va akkauntni bloklash", "Asossiz deb rad etish").

6. **To'lovlar va Tushum Tahlili** — `http://localhost:3000/tolovlar`
   - Oylik tushum (348.25 mln UZS), Bugungi tushum (14.82 mln UZS), Konversiya ko'rsatkichlari.
   - Tushum dinamikasi grafigi va To'lov usullari (Payme 52%, Click 36%, Uzum Bank 12%) doiraviy (Donut) diagrammasi.
   - Tranzaksiyalar tarixi jadvali, statuslar, to'lov shlyuzlari filtri va eksport.

7. **Tizim sozlamalari va xavfsizlik** — `http://localhost:3000/sozlamalar`
   - Korporativ ma'lumotlar, aloqa rekvizitlari.
   - Tariflar (Oddiy, VIP, TOP joylashtirish).
   - Texnik xizmat ko'rsatish (MAINTENANCE) rejimini yoqish/o'chirish.
   - Administrator rollari va huquqlari (Super Admin, Moderator, Support) jadvali va yangi rol qo'shish.
   - 2 bosqichli autentifikatsiya (2FA) va faol seanslar (IP cheklovlari) boshqaruvi.

8. **Administrator Profili** — `http://localhost:3000/profil`
   - Sardor Alimov (Super Admin) shaxsiy kabineti, foto almashtirish, profil to'liqligi (94%).
   - Faol qurilmalar (MacBook Pro M2, iPhone 15 Pro).
   - Shaxsiy ma'lumotlarni yangilash va parolni almashtirish shakli (quvvat indikatori va talablar bilan).

9. **Kirish sahifasi (Login)** — `http://localhost:3000/login`
   - Elegant neon/mint va sarg'ish glow fonli toza interfeys.
   - O'zbekcha / Русский til almashtirgich, 256-bit SSL va 2FA xavfsizlik nishonlari, SSO tizimi va Toshkent klasteri holati.

10. **Yuklanmoqda (Splash / Loading)** — `http://localhost:3000/splash`
    - 78% progress bar, server hub holati, sessiya va kesh tekshiruvi animatsiyalari.

11. **E'lonlar umumiy bazasi** — `http://localhost:3000/elonlar`
12. **Xabarlar va Chat tizimi** — `http://localhost:3000/xabarlar`

---

## 🛠 O'rnatish va Ishga tushirish

1. Loyihani yuklab oling yoki arxivdan chiqaring (`olx-neo-admin`).
2. Terminalni oching va quyidagi buyruqni bajaring:

```bash
npm install
```

3. Dasturni dev-rejimida ishga tushiring:

```bash
npm run dev
```

4. Brauzeringizda quyidagi manzilni oching:
👉 **http://localhost:3000**
# Admin-panel-olex-2
