import json
import os
import random  

def generate_fake_products(category, count):
    products = []
    for i in range(1, count + 1):
        products.append({
            "id": i,
            "title": f"{category.capitalize()} Ürün {i}",
            "price": round(random.uniform(50, 500), 2),  # 50-500 TL arası rastgele fiyat
            "description": f"{category.capitalize()} kategorisine ait harika bir ürün!",
            "category": category,
            "image": f"https://picsum.photos/id/{(i * 10) % 1000}/300/300",  # Rastgele görseller
            "rating": {
                "rate": round(2.5 + (i % 3) * 0.5, 1),  # Rastgele puanlar
                "count": 10 + (i * 2)  # Rastgele değerlendirme sayısı
            }
        })
    return products

# Kategorilerer
categories = [
    "electronics", "cosmetics", "shoes", "clothing", "bags", "furniture", "books"
]

fake_products = []
id_counter = 1

# Her kategori için rastgele 10-20 arası ürün sayısı belirliyoruz
for category in categories:
    product_count = random.randint(10, 20)
    print(f"{category.capitalize()} kategorisi için {product_count} ürün oluşturuluyor...")
    
    products = generate_fake_products(category, product_count) 
    for product in products:
        product["id"] = id_counter  # Her ürün için benzersiz ID atama
        id_counter += 1
    fake_products.extend(products)

# JSON dosyası olarak kaydetme
fake_backend_data = {"products": fake_products}
script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(script_dir, "products.json")

with open(json_file_path, "w", encoding="utf-8") as json_file:
    json.dump(fake_backend_data, json_file, indent=4, ensure_ascii=False)
