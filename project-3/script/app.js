const CATEGORY_TRANSLATIONS = {
  electronics: "Elektronik",
  cosmetics: "Kozmetik",
  shoes: "Ayakkabı",
  clothing: "Giyim",
  bags: "Çanta",
  furniture: "Mobilya",
  books: "Kitap",
};

$(document).ready(function () {
  let products = []; // Tüm ürünleri tutacak dizi
  let cart = []; // Sepet öğelerini tutacak dizi
  let filteredProducts = []; // Filtrelenmiş ürünleri tutacak dizi
  let categories = []; // Kategorileri tutacak dizi

  const productsPerPage = 15;
  let currentPage = 1;
  let minPrice = 0;
  let maxPrice = 500;

  // LocalStorage'dan sepeti yükleme
  loadCartFromLocalStorage();

  fetchProducts();

  setupEventListeners();

  initPriceSlider();

  function fetchProducts() {
    $.ajax({
      url: "http://localhost:8001/products?_sort=id&_order=asc",
      method: "GET",
      dataType: "json",
      success: function (data) {
        products = data;
        filteredProducts = products;
        extractCategories();
        populateCategoryMenu();
        createPagination();
        displayProducts();
        displayFeaturedProducts();
      },
      error: function (xhr, status, error) {
        console.error("Ürünler yüklenirken hata oluştu:", error);
        $("#products-container").html(
          '<div class="error-message">Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>'
        );
      },
    });
  }

  function extractCategories() {
    const categorySet = new Set();

    products.forEach((product) => {
      categorySet.add(product.category);
    });

    categories = Array.from(categorySet);
  }

  function populateCategoryMenu() {
    const $categoryList = $("#category-list");
    const $sidebarCategories = $("#sidebar-categories");

    $categoryList.empty();
    $categoryList.append('<a href="#" data-category="all">Tüm Kategoriler</a>');

    categories.forEach((category) => {
      let categoryName = translateCategory(category);
      $categoryList.append(
        `<a href="#" data-category="${category}">${categoryName}</a>`
      );
    });

    $sidebarCategories.empty();
    $sidebarCategories.append(
      '<li><a href="#" data-category="all">Tüm Kategoriler <span></span></a></li>'
    );

    categories.forEach((category) => {
      const categoryCount = products.filter(
        (product) => product.category === category
      ).length;
      let categoryName = translateCategory(category);
      $sidebarCategories.append(
        `<li><a href="#" data-category="${category}">
                        ${categoryName}
                        <span>${categoryCount}</span>
                    </a></li>`
      );
    });
  }

  const translateCategory = (category) =>
    CATEGORY_TRANSLATIONS[category] || category;

  function generateProductHTML(product) {
    let starsHTML = "";
    for (let j = 1; j <= 5; j++) {
      if (j <= Math.floor(product.rating.rate)) {
        starsHTML += '<i class="fas fa-star"></i>';
      } else if (j - 0.5 <= product.rating.rate) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starsHTML += '<i class="far fa-star"></i>';
      }
    }

    let categoryName = translateCategory(product.category);

    return `
      <div class="product-card" data-product-id="${product.id}">
        <img src="${
          product.image
        }" alt="${product.title}" class="product-image">
        <div class="product-info">
        <h3 class="product-title">${categoryName} Ürün ${filteredProducts.indexOf(product) + 1}</h3>
          <div class="product-price">${product.price.toFixed(2)} TL</div>
          <div class="product-rating">
            ${starsHTML}
            <span>(${product.rating.count})</span>
          </div>
          <div class="product-buttons">
            <button class="add-to-cart" data-product-id="${
              product.id
            }">Sepete Ekle</button>
          </div>
        </div>
      </div>
    `;
  }

  function displayProducts() {
    const $productsContainer = $("#products-container");
    $productsContainer.empty();

    if (filteredProducts.length === 0) {
      $productsContainer.html(
        '<div class="no-products">Bu filtrelere uygun ürün bulunamadı.</div>'
      );
      return;
    }

    filteredProducts.sort((a, b) => a.id - b.id);

    filteredProducts
      .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
      .forEach((product) =>
        $productsContainer.append(generateProductHTML(product))
      );

    $(".product-card")
      .hide()
      .each((index, el) =>
        $(el)
          .delay(50 * index)
          .fadeIn(300)
      );
  }

  function displayFeaturedProducts() {
    const $featuredCarousel = $("#featured-carousel");
    $featuredCarousel.empty();

    [...products]
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, 10)
      .forEach((product) =>
        $featuredCarousel.append(generateProductHTML(product))
      );
  }

  function showProductDetail(productId) {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    let categoryName = translateCategory(product.category);

    let starsHTML = "";
    for (let j = 1; j <= 5; j++) {
      if (j <= Math.floor(product.rating.rate)) {
        starsHTML += '<i class="fas fa-star"></i>';
      } else if (j - 0.5 <= product.rating.rate) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starsHTML += '<i class="far fa-star"></i>';
      }
    }

    // Modal içeriğini oluşturma
    const modalHTML = `
                <div class="product-detail-image">
                    <a href="${product.image}" data-fancybox>
                        <img src="${product.image}" alt="${product.title}">
                    </a>
                </div>
                <div class="product-detail-info">
                    <h2 class="product-detail-title">${categoryName} Ürün ${
      product.id % 18 || 18
    }</h2>
                    <div class="product-detail-price">${product.price.toFixed(
                      2
                    )} TL</div>
                    <div class="product-detail-rating">
                        ${starsHTML}
                        <span>(${product.rating.count} değerlendirme)</span>
                    </div>
                    <div class="product-detail-description">
                        <p>${categoryName} kategorisine ait harika bir ürün!</p>
                        <p>Kategori: ${categoryName}</p>
                    </div>
                    <div class="product-detail-buttons">
                        <button class="add-to-cart" data-product-id="${
                          product.id
                        }">Sepete Ekle</button>
                    </div>
                </div>
            `;

    $("#product-detail-content").html(modalHTML);
    $("#product-detail-modal").fadeIn(300);

    Fancybox.bind("[data-fancybox]", {
      Thumbs: {
        autoStart: true,
      },
    });
  }

  /**
   * Kategoriye göre ürünleri filtreler
   * @param {string} category - Kategori adı
   */
  function filterByCategory(category) {
    if (category === "all") {
      filteredProducts = [...products];
      $(".products-header h2").text("Tüm Ürünler");
    } else {
      filteredProducts = products.filter(
        (product) => product.category === category
      );
      let categoryName = translateCategory(category);
      $(".products-header h2").text(`Tüm ${categoryName} Ürünleri`);
    }

    applyPriceFilter();
    currentPage = 1;
    createPagination();
    displayProducts();
  }

  function applyPriceFilter() {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    if ($("#sort-by-rating").is(":checked")) {
      filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    if ($("#sort-by-price").is(":checked")) {
      filteredProducts.sort((a, b) => a.price - b.price);
    }
  }

  function createPagination() {
    const $pagination = $("#pagination");
    $pagination.empty();

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (totalPages <= 1) return;

    if (currentPage > 1) {
      $pagination.append('<button class="prev-page">Önceki</button>');
    }

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        const activeClass = i === currentPage ? "active" : "";
        $pagination.append(
          `<button class="page-number ${activeClass}" data-page="${i}">${i}</button>`
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        $pagination.append('<span class="page-dots">...</span>');
      }
    }

    if (currentPage < totalPages) {
      $pagination.append('<button class="next-page">Sonraki</button>');
    }
  }

  /**
   * Ürün arama işlevini uygular
   * @param {string} query - Arama sorgusu
   */
  function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();

    if (searchTerm === "") {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }

    currentPage = 1;
    createPagination();
    displayProducts();
  }

  /**
   * Sepete ürün ekleme işlevi
   * @param {number} productId - Ürün ID'si
   */
  function addToCart(productId) {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    const existingItem = cart.find((item) => item.product.id === productId);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        product: product,
        quantity: 1,
      });
    }

    updateCartCount();

    // Sepet içeriğini güncelle
    updateCartItems();

    // LocalStorage'a kaydet
    saveCartToLocalStorage();

    showAddToCartAnimation(productId);
  }

  /**
   * Sepete ekleme animasyonunu gösterir
   * @param {number} productId - Ürün ID'si
   */
  function showAddToCartAnimation(productId) {
    const $productCard = $(`.product-card[data-product-id="${productId}"]`);
    const $cartBtn = $(".cart-btn");

    // Ürün resmini klonla
    const $clone = $productCard
      .find(".product-image")
      .clone()
      .css({
        position: "absolute",
        top: $productCard.offset().top,
        left: $productCard.offset().left,
        width: 70,
        height: 70,
        "z-index": 1000,
        "border-radius": "50%",
        "object-fit": "cover",
      })
      .appendTo("body");

    $clone.animate(
      {
        top: $cartBtn.offset().top,
        left: $cartBtn.offset().left,
        width: 20,
        height: 20,
        opacity: 0.5,
      },
      800,
      function () {
        $clone.remove();

        $cartBtn.addClass("pulse");
        setTimeout(() => {
          $cartBtn.removeClass("pulse");
        }, 500);
      }
    );
  }

  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    $(".cart-count").text(totalItems);

    if (totalItems === 0) {
      $(".cart-count").hide();
    } else {
      $(".cart-count").show();
    }
  }

  function updateCartItems() {
    const $cartItems = $(".cart-items");
    $cartItems.empty();

    if (cart.length === 0) {
      $cartItems.html(
        '<div class="empty-cart">Sepetinizde ürün bulunmamaktadır.</div>'
      );
      $("#cart-total-price").text("0.00");
      return;
    }

    let totalPrice = 0;

    cart.forEach((item) => {
      const product = item.product;
      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      let categoryName = translateCategory(product.category);

      const cartItemHTML = `
                    <div class="cart-item" data-product-id="${product.id}">
                        <img src="${product.image}" alt="${product.title}">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${categoryName} Ürün ${
        product.id % 18 || 18
      }</div>
                            <div class="cart-item-price">${product.price.toFixed(
                              2
                            )} TL</div>
                            <div class="cart-item-quantity">
                                <button class="decrease-quantity" data-product-id="${
                                  product.id
                                }">-</button>
                                <span>${item.quantity}</span>
                                <button class="increase-quantity" data-product-id="${
                                  product.id
                                }">+</button>
                            </div>
                        </div>
                        <button class="remove-from-cart" data-product-id="${
                          product.id
                        }">×</button>
                    </div>
                `;

      $cartItems.append(cartItemHTML);
    });

    $("#cart-total-price").text(totalPrice.toFixed(2));
  }

  /**
   * Sepetten ürün çıkartma işlevi
   * @param {number} productId - Ürün ID'si
   */
  function removeFromCart(productId) {
    cart = cart.filter((item) => item.product.id !== productId);

    updateCartCount();
    updateCartItems();
    saveCartToLocalStorage();
  }

  /**
   * Sepetteki ürün miktarını artırma işlevi
   * @param {number} productId - Ürün ID'si
   */
  function increaseQuantity(productId) {
    const cartItem = cart.find((item) => item.product.id === productId);

    if (cartItem) {
      cartItem.quantity++;
      updateCartItems();
      updateCartCount();
      saveCartToLocalStorage();
    }
  }

  /**
   * Sepetteki ürün miktarını azaltır
   * @param {number} productId - Ürün ID'si
   */
  function decreaseQuantity(productId) {
    const cartItem = cart.find((item) => item.product.id === productId);

    if (cartItem) {
      cartItem.quantity--;

      if (cartItem.quantity <= 0) {
        removeFromCart(productId);
      } else {
        updateCartItems();
        updateCartCount();
        saveCartToLocalStorage();
      }
    }
  }

  /**
   * Sepeti tamamen temşzleme işlevi
   */
  function clearCart() {
    cart = [];
    updateCartCount();
    updateCartItems();
    saveCartToLocalStorage();

    $(".mini-cart").fadeOut(300);
  }

  /**
   * Sepeti LocalStorage'a kaydetme işlevi
   */
  function saveCartToLocalStorage() {
    const cartData = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    localStorage.setItem("cart", JSON.stringify(cartData));
  }

  //  LocalStorage'dan sepeti yükeleme işlevi

  function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);

        cartData.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            cart.push({
              product: product,
              quantity: item.quantity,
            });
          }
        });
        updateCartCount();
        updateCartItems();
      } catch (e) {
        console.error("LocalStorage'dan sepet yüklenirken hata oluştu:", e);
      }
    }
  }

  // jQuery UI Price Slider'ı başlatır

  function initPriceSlider() {
    $("#price-slider").slider({
      range: true,
      min: 0,
      max: 500,
      values: [0, 500],
      slide: function (event, ui) {
        minPrice = ui.values[0];
        maxPrice = ui.values[1];

        $("#min-price").text(minPrice + " TL");
        $("#max-price").text(maxPrice + " TL");
      },
      stop: function (event, ui) {
        filteredProducts = [...products];
        applyPriceFilter();
        currentPage = 1;
        createPagination();
        displayProducts();
      },
    });
  }

  // Tüm olay dinleyicilerini ayarlar

  function setupEventListeners() {
    $(document).on("click", ".add-to-cart", function () {
      const productId = parseInt($(this).data("product-id"));
      addToCart(productId);
    });

    $(document).on("click", ".product-card", function (e) {
      if (
        !$(e.target).hasClass("add-to-cart") &&
        !$(e.target).closest(".add-to-cart").length
      ) {
        const productId = parseInt($(this).data("product-id"));
        showProductDetail(productId);
      }
    });

    $(".close-modal").click(function () {
      $("#product-detail-modal").fadeOut(300);
    });

    $(window).click(function (event) {
      const $modal = $("#product-detail-modal");
      if (event.target === $modal[0]) {
        $modal.fadeOut(300);
      }
    });

    $("#cart-btn").click(function (e) {
      e.stopPropagation();
      $(".mini-cart").fadeToggle(300);
    });

    $(document).click(function (e) {
      if (!$(e.target).closest(".cart-container").length) {
        $(".mini-cart").fadeOut(300);
      }
    });

    $("#clear-cart-btn").click(function () {
      clearCart();
    });

    // Kategori Filtreleme
    $(document).on("click", "a[data-category]", function (e) {
      e.preventDefault();
      const category = $(this).data("category");

      $("a[data-category]").removeClass("active");
      $(this).addClass("active");

      filterByCategory(category);
    });

    $('.filter-options input[type="checkbox"]').change(function () {
      filteredProducts = [...products];
      applyPriceFilter();
      currentPage = 1;
      createPagination();
      displayProducts();
    });

    $(document).on("click", ".page-number", function () {
      currentPage = parseInt($(this).data("page"));
      createPagination();
      displayProducts();

      $("html, body").animate(
        {
          scrollTop: $("#products-container").offset().top - 100,
        },
        300
      );
    });

    $(document).on("click", ".prev-page", function () {
      if (currentPage > 1) {
        currentPage--;
        createPagination();
        displayProducts();

        // Sayfa başına kaydır
        $("html, body").animate(
          {
            scrollTop: $("#products-container").offset().top - 100,
          },
          300
        );
      }
    });

    // Sonraki sayfa
    $(document).on("click", ".next-page", function () {
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

      if (currentPage < totalPages) {
        currentPage++;
        createPagination();
        displayProducts();

        // Sayfa başına kaydır
        $("html, body").animate(
          {
            scrollTop: $("#products-container").offset().top - 100,
          },
          300
        );
      }
    });

    $("#search-btn").click(function () {
      const query = $("#search-input").val();
      searchProducts(query);
    });

    $("#search-input").keypress(function (e) {
      if (e.which === 13) {
        const query = $(this).val();
        searchProducts(query);
      }
    });

    // Sepet Öğesi Silme
    $(document).on("click", ".remove-from-cart", function () {
      const productId = parseInt($(this).data("product-id"));
      removeFromCart(productId);
    });

    // Sepet Öğesi Miktarını Artırma
    $(document).on("click", ".increase-quantity", function () {
      const productId = parseInt($(this).data("product-id"));
      increaseQuantity(productId);
    });

    // Sepet Öğesi Miktarını Azaltma
    $(document).on("click", ".decrease-quantity", function () {
      const productId = parseInt($(this).data("product-id"));
      decreaseQuantity(productId);
    });

    // Ödeme Yapma Butonu
    $("#checkout-btn").click(function () {
      alert("Bu demo sürümünde ödeme işlevi bulunmamaktadır.");
    });
  }
});
