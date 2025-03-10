# 🛒 UShop - Mini E-Ticaret / Ürün Kataloğu Uygulaması

UShop, kullanıcıların ürünleri inceleyip sepete ekleyebileceği, kategori bazlı filtreleme yapabileceği bir **mini e-ticaret** uygulamasıdır. 🎯  
**JSON Server ile fake backend** kullanılarak oluşturulmuş, **jQuery & AJAX** ile ürünlerin dinamik olarak listelendiği bir web projesidir.

---

## 🚀 **Proje Özeti**
- Kullanıcılar, **fake bir API** veya **JSON dosyasından** ürünleri dinamik olarak çekip görüntüleyebilir.
- **Ürün Kartları**, sayfada yer alır ve içerisinde **"Sepete Ekle"**, **"Detay Göster"** gibi butonlar bulunur.
- **Sepete Ekleme:**  
  - Kullanıcı, bir ürünü **Sepete Ekle** butonuna basarak **Local Storage**'a kaydedebilir.
  - **Sepeti Temizle** butonu ile local storage ve DOM sıfırlanır.
- **Kategori ve Fiyat Filtreleme:**  
  - Ürünler **kategoriye göre** filtrelenebilir.
  - Fiyat aralığı seçilerek belirli ürünler gösterilebilir.
- **AJAX & jQuery Kullanımı:**  
  - Ürünler, **JSON Server** üzerinden AJAX isteği ile çekilir.
  - **jQuery efektleri** ile kullanıcı deneyimi artırılmıştır (hover, fade, slide vb.).

---

## 🛠 **Proje Bileşenleri**
### 📌 **1. HTML & CSS**
- **Navbar:** Üst menü ve arama çubuğu içerir.
- **Sidebar:** Kategoriler, fiyat aralığı ve filtreleme seçeneklerini içerir.
- **Ürün Kartları:** Ürünlerin resim, isim, fiyat ve sepete ekle butonu içeren kutular.
- **Modal (FancyBox)**: Ürün detaylarını göstermek için açılan pencere.
- **Carousel (Slick Slider)**: Öne çıkan ürünler için kaydırılabilir ürün listesi.

### 📌 **2. JavaScript & jQuery**
- **AJAX ile ürünleri JSON Server’dan çekme**
- **Dinamik DOM manipülasyonu ile ürünleri ekrana listeleme**
- **Event Handling (click, hover, filter, sort işlemleri)**
- **Sepete ürün ekleme ve Local Storage ile kaydetme**
- **jQuery Animasyonları (fadeIn, slideDown, toggleClass)**
- **Modal & Lightbox ile ürün detaylarını büyütme**

### 📌 **3. Fake Backend (JSON Server)**
- **Ürünler `data/products.json` dosyasından çekilmektedir.**
- **JSON Server, `http://localhost:8001/products` üzerinden çalışmaktadır.**
- **Ürün listesi şu kategorilerden oluşmaktadır:**
  - 📱 **Elektronik**
  - 💄 **Kozmetik**
  - 👟 **Ayakkabı**
  - 👕 **Giyim**
  - 🎒 **Çanta**
  - 🏠 **Mobilya**
  - 📚 **Kitap**

---

## 📦 **Kurulum & Çalıştırma**
### **1️⃣ Projeyi Klonla**
```sh
git clone https://github.com/ufkcnkmc/Bootcamp-projects/
cd projects-3
```
### **2️⃣ Gerekli Bağımlılıkları Yükle**
```sh
npm install -g json-server
```
### **3️⃣ JSON Server'ı Başlat (Fake Backend)**
```sh
json-server --watch data/products.json --port 8001
```
JSON Server çalıştığında şu adreste ürün listesini görebilirsiniz: 🔗 http://localhost:8001/products### 
### **4️⃣ Live Server ile Projeyi Başlat**
Eğer Visual Studio Code kullanıyorsanız, Live Server eklentisi ile doğrudan çalıştırabilirsiniz.
Terminalden manuel başlatmak için:
```sh
npx http-server
```
veya
```sh
python -m http.server 8000
```
Ardından tarayıcıdan http://localhost:8000/ adresine giderek projeyi çalıştırabilirsiniz. 🚀

**🎯 Örnek API Kullanımı**
**✅ Tüm Ürünleri AJAX Kullanarak Çekme:** 
```javascript
$.ajax({
    url: "http://localhost:8001/products", 
    method: "GET",
    dataType: "json",
    success: function(data) {
        console.log("Ürünler başarıyla çekildi:", data);
    },
    error: function(xhr, status, error) {
        console.error("Hata oluştu:", error);
    }
});
```
**✅ Kategori Bazlı Filtreleme:** 
Sadece **giyim** kategorisindeki ürünleri getirmek için:
```javascript
fetch("http://localhost:8001/products?category=clothing")
  .then(res => res.json())
  .then(data => console.log(data));
```
**✅ Fiyat Aralığı Filtreleme:**
```javascript
fetch("http://localhost:8001/products?price_gte=100&price_lte=500")
  .then(res => res.json())
  .then(data => console.log(data));
```
**✨ Geliştirme & Katkı** 
Bu proje açık kaynaklıdır! 🛠 Eğer katkıda bulunmak isterseniz:
1. **Fork** yapın 🍴 
2. **Yeni bir özellik ekleyin** 🚀 
3. **Pull Request (PR) açın** ✅

**📩 İletişim**
Eğer proje ile ilgili herhangi bir sorunuz olursa bana ulaşabilirsiniz:
📧 Email: ufukcnkmc@gmail.com
💼 LinkedIn: linkedin.com/in/ufukcnkmc

---
🚀 Keyifli Kodlamalar!