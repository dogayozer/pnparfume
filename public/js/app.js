document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Routing & Initialization ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.page-section');
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-links');

    // Handle scroll effect on header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Initialize Database
    initDatabase();

    // Render cart items
    renderCart();

    // Routing Logic
    window.navigateTo = function(targetHash) {
        const parts = targetHash.split("?");
        const route = parts[0].replace("#", "");
        const queryString = parts[1] || "";

        // Parse query params
        const queryParams = {};
        if (queryString) {
            queryString.split("&").forEach(param => {
                const pair = param.split("=");
                queryParams[pair[0]] = decodeURIComponent(pair[1] || "");
            });
        }

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${route}`) {
                link.classList.add('active');
            }
        });

        // Hide all sections, show target
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(route);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo(0, 0);
        }

        // Page specific initializations
        if (route === 'shop') {
            renderShop();
        } else if (route === 'product') {
            renderProductDetail(queryParams.id);
        } else if (route === 'admin') {
            checkAdminSession();
        }

        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        }
    };

    // Event listeners for links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            navigateTo(target);
            history.pushState(null, null, target);
        });
    });

    // Handle initial load hash
    if (window.location.hash) {
        navigateTo(window.location.hash);
    } else {
        navigateTo('#home');
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        if (window.location.hash) {
            navigateTo(window.location.hash);
        } else {
            navigateTo('#home');
        }
    });

    // --- B2B Franchise application submission on digital franchise page ---
    const b2bFranchiseForm = document.querySelector('#digital-franchise form');
    if (b2bFranchiseForm) {
        b2bFranchiseForm.onsubmit = function(event) {
            event.preventDefault();
            const inputs = b2bFranchiseForm.querySelectorAll('input');
            const username = inputs[0].value;
            const password = inputs[1].value;

            // Simple mock authentication or saving as dealer request
            if (username === "b2b_pien" && password === "pien2026") {
                alert("Bayi girişi başarılı! B2B Portalına yönlendiriliyorsunuz.");
                navigateTo("#shop");
            } else {
                // Save it as a dealer request application
                const newApp = {
                    id: "app-" + Date.now(),
                    name: username,
                    phone: "Giriş Denemesi",
                    email: "B2B Bayilik Talebi",
                    city: "Belirtilmemiş",
                    location: "Belirtilmemiş",
                    experience: "B2B Şifre Denemesi",
                    budget: password, // Store password attempted
                    status: "new",
                    date: new Date().toISOString().split('T')[0]
                };
                let apps = JSON.parse(localStorage.getItem("pien_applications") || "[]");
                apps.push(newApp);
                localStorage.setItem("pien_applications", JSON.stringify(apps));

                alert("Hatalı kullanıcı adı veya şifre. Bayilik başvurunuz kaydedildi, ekiplerimiz size ulaşacaktır.");
            }
        };
    }

    // --- Subscribe & Win Form Submission ---
    const subscribeForm = document.getElementById('subscribe-win-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('sub-name').value;
            const age = document.getElementById('sub-age').value;
            const gender = document.getElementById('sub-gender').value;
            const favs = document.getElementById('sub-favs').value;
            const feedback = document.getElementById('sub-feedback').value;

            // Save to local storage for admin use
            const subscriber = {
                id: "sub-" + Date.now(),
                name,
                age,
                gender,
                favs,
                feedback,
                date: new Date().toISOString().split('T')[0]
            };
            let subs = JSON.parse(localStorage.getItem('pien_subscribers') || '[]');
            subs.push(subscriber);
            localStorage.setItem('pien_subscribers', JSON.stringify(subs));

            // Hide form and show success message
            subscribeForm.style.display = 'none';
            document.getElementById('sub-success-msg').style.display = 'block';
        });
    }
});

// --- LOCAL STORAGE DATABASE SETUP ---
const INITIAL_PRODUCTS = [
    {
        id: "p1",
        name: "Premium Parfüm",
        code: "PN-101",
        category: "perfume",
        family: "oriental",
        familyLabel: "Oryantal & Çiçeksi",
        price: 750,
        desc: "Zengin amber, vanilya ve yasemin notalarıyla bezeli, teninizle bütünleşen lüks parfüm serimiz. Nöro-parfümeri ilkelerine göre enerjinizi yükseltir.",
        notes: {
            top: ["Bergamot", "Limon", "Mandarin"],
            heart: ["Yasemin", "Şam Gülü", "Karabiber"],
            base: ["Kehribar", "Vanilya", "Sedir Ağacı"]
        },
        image: "assets/product_1.jpg"
    },
    {
        id: "p2",
        name: "Lüks Oda Kokusu",
        code: "PN-201",
        category: "room",
        family: "citrus",
        familyLabel: "Narenciye & Ferah",
        price: 420,
        desc: "Çubuklu tasarımıyla odanıza sürekli ferahlık ve şıklık yayan, özel formüle edilmiş premium oda kokusu. Yaşam alanlarınıza lüks bir hava katar.",
        notes: {
            top: ["Limon kabuğu", "Mandalina", "Nane"],
            heart: ["Lavanta", "Adaçayı", "Yeşil Yapraklar"],
            base: ["Misk", "Beyaz Amber", "Sandal Ağacı"]
        },
        image: "assets/product_2.jpg"
    },
    {
        id: "p3",
        name: "Zarif Kolonya",
        code: "PN-301",
        category: "cologne",
        family: "citrus",
        familyLabel: "Narenciye & Aromatik",
        price: 280,
        desc: "Geleneksel Türk limon kolonyasını modern lüks dokunuşlarla yeniden yorumlayan premium serimiz. Ferahlatıcı ve şık hediye kutusundadır.",
        notes: {
            top: ["Portakal Çiçeği", "Mandalina", "Bergamot"],
            heart: ["Biberiye", "Kekik", "Limon Otu"],
            base: ["Misk", "Hafif Odunsu Notalar", "Ambergris"]
        },
        image: "assets/product_3.jpg"
    }
];

const INITIAL_APPLICATIONS = [
    {
        id: "app-1",
        name: "Ahmet Yılmaz",
        phone: "0532 123 45 67",
        email: "ahmet@yilmazholding.com",
        city: "Ankara",
        location: "Bahçelievler 7. Cadde",
        experience: "Evet (5 yıl perakende tekstil)",
        budget: "450000",
        status: "new",
        date: "2026-06-15"
    }
];

function initDatabase() {
    if (!localStorage.getItem("pien_products") || localStorage.getItem("pien_products") === "[]") {
        localStorage.setItem("pien_products", JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem("pien_applications") || localStorage.getItem("pien_applications") === "[]") {
        localStorage.setItem("pien_applications", JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem("pien_cart")) {
        localStorage.setItem("pien_cart", JSON.stringify([]));
    }
}

// --- E-COMMERCE SHOP CATALOG RENDER ---
let currentCategoryFilter = "all";
let currentFamilyFilter = "all";
let currentSearchQuery = "";

function renderShop() {
    const grid = document.getElementById("catalog-grid");
    if (!grid) return;

    // Set up filter event listeners once
    const catFilters = document.querySelectorAll('input[name="cat-filter"]');
    catFilters.forEach(radio => {
        if (!radio.dataset.listener) {
            radio.addEventListener("change", (e) => {
                currentCategoryFilter = e.target.value;
                applyFilters();
            });
            radio.dataset.listener = "true";
        }
    });

    const famFilters = document.querySelectorAll('input[name="family-filter"]');
    famFilters.forEach(radio => {
        if (!radio.dataset.listener) {
            radio.addEventListener("change", (e) => {
                currentFamilyFilter = e.target.value;
                applyFilters();
            });
            radio.dataset.listener = "true";
        }
    });

    const searchInput = document.getElementById("shop-search");
    if (searchInput && !searchInput.dataset.listener) {
        searchInput.addEventListener("input", (e) => {
            currentSearchQuery = e.target.value;
            applyFilters();
        });
        searchInput.dataset.listener = "true";
    }

    applyFilters();
}

function applyFilters() {
    const grid = document.getElementById("catalog-grid");
    if (!grid) return;

    const products = JSON.parse(localStorage.getItem("pien_products") || "[]");
    let filtered = products;

    if (currentCategoryFilter !== "all") {
        filtered = filtered.filter(p => p.category === currentCategoryFilter);
    }

    if (currentFamilyFilter !== "all") {
        filtered = filtered.filter(p => p.family && p.family.includes(currentFamilyFilter));
    }

    if (currentSearchQuery.trim()) {
        const query = currentSearchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => {
            return (p.name && p.name.toLowerCase().includes(query)) ||
                   (p.code && p.code.toLowerCase().includes(query)) ||
                   (p.desc && p.desc.toLowerCase().includes(query)) ||
                   (p.familyLabel && p.familyLabel.toLowerCase().includes(query));
        });
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--color-text-muted);">
            <p style="font-size: 1.5rem; margin-bottom: 1rem;">Aradığınız kriterlere uygun ürün bulunamadı.</p>
        </div>
        `;
        return;
    }

    let html = "";
    filtered.forEach(p => {
        html += `
        <div class="product-card glass-panel" onclick="navigateTo('product?id=${p.id}')" style="cursor:pointer; padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between; height:100%; transition: var(--transition-smooth);">
            <div>
                <div class="product-img-wrapper" style="height: 250px; overflow: hidden; border-radius: 8px; background: rgba(196,139,113,0.05); display:flex; align-items:center; justify-content:center;">
                    <img src="${p.image}" alt="${p.name}" style="max-height:100%; max-width:100%; object-fit:contain; transition: var(--transition-smooth);">
                </div>
                <div class="product-family" style="margin-top: 1rem; color: var(--color-copper); font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">${p.familyLabel}</div>
                <h3 class="product-title" style="font-size:1.25rem; margin-top:0.5rem;">${p.name}</h3>
                <p class="product-desc" style="font-size:0.85rem; color: var(--color-text-muted); margin-top:0.5rem; height: 3.5rem; overflow:hidden; display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">${p.desc}</p>
            </div>
            <div class="product-footer" style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.05);">
                <span class="product-price" style="font-size:1.2rem; font-weight:600; color:var(--color-copper-light);">${p.price} TL</span>
                <button class="btn btn-outline" style="padding:0.4rem 1rem; font-size:0.75rem; border-radius:20px;" onclick="event.stopPropagation(); quickAdd('${p.id}')" data-i18n="btnAddToBag">SEPETE EKLE</button>
            </div>
        </div>
        `;
    });
    grid.innerHTML = html;
}

// --- PRODUCT DETAIL PAGE ---
let selectedSize = "50ml";
function renderProductDetail(productId) {
    const products = JSON.parse(localStorage.getItem("pien_products") || "[]");
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.getElementById("product").innerHTML = `
        <div class="container text-center" style="padding: 6rem 0;">
            <h2>Ürün Bulunamadı</h2>
            <a href="#shop" class="btn btn-primary" style="margin-top: 2rem;">Koleksiyona Geri Dön</a>
        </div>
        `;
        return;
    }

    // Populate fields
    document.getElementById("detail-img").src = product.image;
    document.getElementById("detail-img").alt = product.name;
    document.getElementById("detail-name").innerText = product.name;
    document.getElementById("detail-code").innerText = product.code;
    document.getElementById("detail-category-tag").innerText = product.category === 'perfume' ? 'Parfüm' : product.category === 'room' ? 'Oda Kokusu' : 'Kolonya';
    document.getElementById("detail-desc").innerText = product.desc;
    
    let quantity = 1;
    let basePrice = product.price;

    function updateDetailPrice() {
        const sizePrice = selectedSize === "100ml" ? basePrice * 1.5 : basePrice;
        document.getElementById("detail-price-display").innerText = `${Math.round(sizePrice * quantity)} TL`;
    }

    updateDetailPrice();

    // Size events
    const sizeBtns = document.querySelectorAll(".size-btn");
    sizeBtns.forEach(btn => {
        // Clone to remove old listener
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener("click", (e) => {
            document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            selectedSize = e.target.getAttribute("data-size");
            updateDetailPrice();
        });
    });

    // Quantity events
    const plusBtn = document.getElementById("detail-qty-plus");
    const minusBtn = document.getElementById("detail-qty-minus");
    const qtyVal = document.getElementById("detail-qty-val");
    
    qtyVal.innerText = quantity;

    plusBtn.onclick = () => {
        quantity++;
        qtyVal.innerText = quantity;
        updateDetailPrice();
    };

    minusBtn.onclick = () => {
        if (quantity > 1) {
            quantity--;
            qtyVal.innerText = quantity;
            updateDetailPrice();
        }
    };

    // Add to cart event
    const addBtn = document.getElementById("detail-add-btn");
    addBtn.onclick = () => {
        const finalPrice = selectedSize === "100ml" ? basePrice * 1.5 : basePrice;
        addToCart(product.id, product.name, selectedSize, Math.round(finalPrice), quantity, product.image);
    };

    // Scent Pyramid Explanation Logic
    const explainTitle = document.getElementById("explain-title");
    const explainDesc = document.getElementById("explain-desc");
    const explainList = document.getElementById("explain-list");

    function showPyramidLayer(layer) {
        document.querySelectorAll(".pyramid-layer").forEach(l => l.style.borderColor = "rgba(196,139,113,0.2)");
        
        let title = "";
        let desc = "";
        let notesArr = [];

        if (layer === "top") {
            document.getElementById("layer-btn-top").style.borderColor = "var(--color-copper)";
            title = "Tepe Notaları (İlk Saniyeler)";
            desc = "Parfüm sıkıldığı an duyulan ilk kokudur. Hafif ve uçucudur. Birkaç dakika içinde uçar.";
            notesArr = product.notes ? product.notes.top : ["Portakal Çiçeği", "Mandalina"];
        } else if (layer === "heart") {
            document.getElementById("layer-btn-heart").style.borderColor = "var(--color-copper)";
            title = "Kalp Notaları (Parfümün Ruhu)";
            desc = "Tepe notaları kaybolduktan sonra ortaya çıkan ve kokunun ana gövdesini oluşturan katmandır.";
            notesArr = product.notes ? product.notes.heart : ["Lavanta", "Biberiye"];
        } else if (layer === "base") {
            document.getElementById("layer-btn-base").style.borderColor = "var(--color-copper)";
            title = "Dip Notaları (Kalıcı İz)";
            desc = "Parfümün en son kalan, kalıcılığını sağlayan zemin katmanıdır. Tende en uzun süre kalan kısımdır.";
            notesArr = product.notes ? product.notes.base : ["Sedir Ağacı", "Misk"];
        }

        explainTitle.innerText = title;
        explainDesc.innerText = desc;
        
        let listHTML = "";
        notesArr.forEach(n => {
            listHTML += `<span style="background-color: rgba(196,139,113,0.1); padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; border: 1px solid rgba(196,139,113,0.2);">✨ ${n}</span>`;
        });
        explainList.innerHTML = listHTML;
    }

    document.getElementById("layer-btn-top").onclick = () => showPyramidLayer("top");
    document.getElementById("layer-btn-heart").onclick = () => showPyramidLayer("heart");
    document.getElementById("layer-btn-base").onclick = () => showPyramidLayer("base");

    showPyramidLayer("top");
}

// --- SHOPPING CART MANAGEMENT ---
window.quickAdd = function(productId) {
    const products = JSON.parse(localStorage.getItem("pien_products") || "[]");
    const product = products.find(p => p.id === productId);
    if (product) {
        addToCart(product.id, product.name, "50ml", product.price, 1, product.image);
    }
};

window.addToCart = function(id, name, size, price, qty, img) {
    let cart = JSON.parse(localStorage.getItem("pien_cart") || "[]");
    const itemIndex = cart.findIndex(item => item.id === id && item.size === size);

    if (itemIndex > -1) {
        cart[itemIndex].qty += qty;
    } else {
        cart.push({ id, name, size, price, qty, img });
    }

    localStorage.setItem("pien_cart", JSON.stringify(cart));
    renderCart();
    toggleCartDrawer(true);
};

function renderCart() {
    const cart = JSON.parse(localStorage.getItem("pien_cart") || "[]");
    const drawerItems = document.getElementById("cart-drawer-items");
    const cartCountSpan = document.getElementById("cart-icon-count");
    const subtotalSpan = document.getElementById("cart-subtotal-val");

    if (!drawerItems) return;

    if (cart.length === 0) {
        drawerItems.innerHTML = `
        <div style="text-align:center; padding:3rem 0; color:var(--color-text-muted);">
            <i class="fas fa-shopping-bag" style="font-size:3rem; margin-bottom:1rem; opacity:0.3;"></i>
            <p data-i18n="cartEmpty">Sepetiniz boş.</p>
        </div>
        `;
        subtotalSpan.innerText = "0 TL";
        cartCountSpan.style.display = "none";
        return;
    }

    // Update cart count badge
    let totalQty = 0;
    let subtotal = 0;
    let itemsHTML = "";

    cart.forEach((item, index) => {
        totalQty += item.qty;
        subtotal += item.price * item.qty;
        
        itemsHTML += `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div>
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-meta">${item.size} | ${item.price} TL</span>
                </div>
                <div class="cart-item-footer">
                    <div class="cart-item-qty">
                        <button class="cart-qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
                        <span class="cart-qty-val">${item.qty}</span>
                        <button class="cart-qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeCartItem(${index})">Kaldır</button>
                </div>
            </div>
        </div>
        `;
    });

    drawerItems.innerHTML = itemsHTML;
    subtotalSpan.innerText = `${subtotal} TL`;
    cartCountSpan.innerText = totalQty;
    cartCountSpan.style.display = "flex";
}

window.updateCartQty = function(index, delta) {
    let cart = JSON.parse(localStorage.getItem("pien_cart") || "[]");
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem("pien_cart", JSON.stringify(cart));
    renderCart();
};

window.removeCartItem = function(index) {
    let cart = JSON.parse(localStorage.getItem("pien_cart") || "[]");
    cart.splice(index, 1);
    localStorage.setItem("pien_cart", JSON.stringify(cart));
    renderCart();
};

// Toggle Cart Drawer
function toggleCartDrawer(isOpen) {
    const backdrop = document.getElementById("cart-backdrop");
    const drawer = document.getElementById("cart-drawer");
    if (backdrop && drawer) {
        if (isOpen) {
            backdrop.classList.add("active");
            drawer.classList.add("active");
        } else {
            backdrop.classList.remove("active");
            drawer.classList.remove("active");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("header-cart-icon");
    const closeBtn = document.getElementById("cart-close-btn");
    const continueBtn = document.getElementById("cart-continue-btn");
    const backdrop = document.getElementById("cart-backdrop");

    if (cartIcon) cartIcon.addEventListener("click", () => toggleCartDrawer(true));
    if (closeBtn) closeBtn.addEventListener("click", () => toggleCartDrawer(false));
    if (continueBtn) continueBtn.addEventListener("click", () => toggleCartDrawer(false));
    if (backdrop) backdrop.addEventListener("click", () => toggleCartDrawer(false));
});

// --- ADMIN PANEL CONTROL ---
let isAdminLoggedIn = false;

function checkAdminSession() {
    const loginBox = document.getElementById("admin-login-box");
    const dashboard = document.getElementById("admin-dashboard");

    if (isAdminLoggedIn) {
        loginBox.style.display = "none";
        dashboard.style.display = "grid";
        renderAdminDashboard();
    } else {
        loginBox.style.display = "block";
        dashboard.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("admin-login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("admin-username").value;
            const pass = document.getElementById("admin-password").value;

            // Secure mock login
            if (user === "admin" && pass === "pienlab2026") {
                isAdminLoggedIn = true;
                checkAdminSession();
            } else {
                alert("Hatalı kullanıcı adı veya şifre!");
            }
        });
    }

    const btnApps = document.getElementById("admin-btn-apps");
    const btnProds = document.getElementById("admin-btn-prods");
    const btnLogout = document.getElementById("admin-btn-logout");

    if (btnApps) btnApps.addEventListener("click", () => showAdminTab("apps"));
    if (btnProds) btnProds.addEventListener("click", () => showAdminTab("prods"));
    if (btnLogout) btnLogout.addEventListener("click", () => {
        isAdminLoggedIn = false;
        checkAdminSession();
    });
});

function showAdminTab(tab) {
    document.querySelectorAll(".admin-menu-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".admin-panel-box").forEach(box => box.classList.remove("active"));

    if (tab === "apps") {
        document.getElementById("admin-btn-apps").classList.add("active");
        document.getElementById("admin-panel-apps").classList.add("active");
    } else if (tab === "prods") {
        document.getElementById("admin-btn-prods").classList.add("active");
        document.getElementById("admin-panel-prods").classList.add("active");
    }
}

function renderAdminDashboard() {
    renderAdminApplications();
    renderAdminProducts();
}

function renderAdminApplications() {
    const list = document.getElementById("admin-apps-list");
    if (!list) return;

    const apps = JSON.parse(localStorage.getItem("pien_applications") || "[]");
    if (apps.length === 0) {
        list.innerHTML = `<tr><td colspan="6" style="text-align:center;">Başvuru bulunmamaktadır.</td></tr>`;
        return;
    }

    let html = "";
    apps.forEach(app => {
        html += `
        <tr>
            <td><strong>${app.name}</strong><br><span style="font-size:0.8rem; color:var(--color-text-muted);">${app.date}</span></td>
            <td>${app.phone}<br>${app.email}</td>
            <td>${app.city}<br>${app.location}</td>
            <td>${app.budget} TL</td>
            <td><span class="status-badge ${app.status}">${app.status === 'new' ? 'Yeni' : app.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}</span></td>
            <td>
                <button class="btn btn-outline" style="padding:4px 8px; font-size:0.75rem; margin-right:5px; border-color:#28a745; color:#28a745;" onclick="updateAppStatus('${app.id}', 'approved')">Onayla</button>
                <button class="btn btn-outline" style="padding:4px 8px; font-size:0.75rem; border-color:#dc3545; color:#dc3545;" onclick="updateAppStatus('${app.id}', 'rejected')">Reddet</button>
            </td>
        </tr>
        `;
    });
    list.innerHTML = html;
}

window.updateAppStatus = function(id, status) {
    let apps = JSON.parse(localStorage.getItem("pien_applications") || "[]");
    const idx = apps.findIndex(a => a.id === id);
    if (idx > -1) {
        apps[idx].status = status;
        localStorage.setItem("pien_applications", JSON.stringify(apps));
        renderAdminApplications();
    }
};

function renderAdminProducts() {
    const list = document.getElementById("admin-prods-list");
    if (!list) return;

    const products = JSON.parse(localStorage.getItem("pien_products") || "[]");
    let html = "";

    products.forEach(p => {
        html += `
        <tr>
            <td><strong>${p.code}</strong></td>
            <td><img src="${p.image}" alt="${p.name}" style="width:40px; height:45px; object-fit:cover; border-radius:4px;"></td>
            <td>${p.name}</td>
            <td>${p.category === 'perfume' ? 'Parfüm' : p.category === 'room' ? 'Oda Kokusu' : 'Kolonya'}</td>
            <td>${p.price} TL</td>
            <td>
                <button class="btn btn-outline" style="padding:4px 8px; font-size:0.75rem; margin-right:5px;" onclick="editProduct('${p.id}')">Düzenle</button>
                <button class="btn btn-outline" style="padding:4px 8px; font-size:0.75rem; border-color:#dc3545; color:#dc3545;" onclick="deleteProduct('${p.id}')">Sil</button>
            </td>
        </tr>
        `;
    });
    list.innerHTML = html;
}

window.showProductForm = function() {
    document.getElementById("product-form-container").style.display = "block";
    document.getElementById("prod-form-title").innerText = "Yeni Ürün Ekle";
    document.getElementById("admin-product-form").reset();
    document.getElementById("prod-id").value = "";
};

window.hideProductForm = function() {
    document.getElementById("product-form-container").style.display = "none";
};

window.editProduct = function(id) {
    const products = JSON.parse(localStorage.getItem("pien_products") || "[]");
    const p = products.find(prod => prod.id === id);
    if (p) {
        document.getElementById("product-form-container").style.display = "block";
        document.getElementById("prod-form-title").innerText = "Ürünü Düzenle";
        document.getElementById("prod-id").value = p.id;
        document.getElementById("prod-name").value = p.name;
        document.getElementById("prod-code").value = p.code;
        document.getElementById("prod-price").value = p.price;
        document.getElementById("prod-cat").value = p.category;
        document.getElementById("prod-family").value = p.family;
        document.getElementById("prod-img").value = p.image;
        document.getElementById("prod-desc").value = p.desc;
    }
};

window.deleteProduct = function(id) {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
        let products = JSON.parse(localStorage.getItem("pien_products") || "[]");
        products = products.filter(p => p.id !== id);
        localStorage.setItem("pien_products", JSON.stringify(products));
        renderAdminProducts();
        if (window.location.hash === "#shop") renderShop();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const prodForm = document.getElementById("admin-product-form");
    if (prodForm) {
        prodForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("prod-id").value;
            const name = document.getElementById("prod-name").value;
            const code = document.getElementById("prod-code").value;
            const price = parseFloat(document.getElementById("prod-price").value);
            const category = document.getElementById("prod-cat").value;
            const family = document.getElementById("prod-family").value;
            const image = document.getElementById("prod-img").value || "assets/product_1.jpg";
            const desc = document.getElementById("prod-desc").value;

            let products = JSON.parse(localStorage.getItem("pien_products") || "[]");

            if (id) {
                // Update
                const idx = products.findIndex(p => p.id === id);
                if (idx > -1) {
                    products[idx] = { ...products[idx], name, code, price, category, family, image, desc };
                }
            } else {
                // Create
                const newProd = {
                    id: "p-" + Date.now(),
                    name, code, price, category, family, image, desc,
                    notes: {
                        top: ["Bergamot", "Limon"],
                        heart: ["Lavanta", "Biberiye"],
                        base: ["Sandal Ağacı", "Amber"]
                    }
                };
                products.push(newProd);
            }

            localStorage.setItem("pien_products", JSON.stringify(products));
            hideProductForm();
            renderAdminProducts();
            if (window.location.hash === "#shop") renderShop();
        });
    }
});


// --- INTERACTIVE SCENT WIZARD (PIEN ORIGINAL) ---
window.selectedMood = "";
window.selectedNotes = [];
let dropCountId = 0;

window.nextWizardStep = function(stepNumber) {
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach(step => step.classList.remove('active'));
    
    const nextStep = document.getElementById(`wizard-step-${stepNumber}`);
    if (nextStep) {
        nextStep.classList.add('active');
    }
    
    // Toggle visuals for Step 5
    const visuals = {
        bottle: document.querySelector('.wizard-bottle'),
        zone: document.getElementById('anti-gravity-zone'),
        maceration: document.getElementById('maceration-card'),
        finalImg: document.querySelector('.final-bottle-display')
    };
    
    if (stepNumber === 5) {
        if (visuals.bottle) visuals.bottle.style.display = 'none';
        if (visuals.zone) visuals.zone.style.display = 'none';
        if (visuals.maceration) visuals.maceration.style.display = 'none';
        if (visuals.finalImg) {
            visuals.finalImg.style.display = 'block';
        }
    } else {
        if (visuals.bottle) visuals.bottle.style.display = 'flex';
        if (visuals.zone) visuals.zone.style.display = 'block';
    }
};

window.selectMood = function(mood, nextStep) {
    window.selectedMood = mood;
    window.nextWizardStep(nextStep);
};

window.toggleNote = function(element, name, type, color, genderScore) {
    genderScore = genderScore || 0;
    const index = window.selectedNotes.findIndex(n => n.name === name);
    
    if (index === -1) {
        window.selectedNotes.push({name, type, color, genderScore});
        element.classList.add('selected');
        spawnDroplet(color);
    } else {
        window.selectedNotes.splice(index, 1);
        element.classList.remove('selected');
    }
    
    updateFormulaStats();
    updateGenderBar();
    
    const nextBtn = document.getElementById('btn-to-step-3');
    if (nextBtn) nextBtn.disabled = window.selectedNotes.length < 3;
};

function updateGenderBar() {
    const indicator = document.getElementById('gender-indicator');
    if (!indicator) return;
    
    if (window.selectedNotes.length === 0) {
        indicator.style.left = '50%';
        return;
    }
    
    let totalScore = 0;
    window.selectedNotes.forEach(n => {
        totalScore += n.genderScore;
    });
    
    const avgScore = totalScore / window.selectedNotes.length;
    const capped = Math.max(-2, Math.min(2, avgScore));
    const percentage = ((capped + 2) / 4) * 100;
    
    indicator.style.left = `${percentage}%`;
}

function spawnDroplet(color) {
    dropCountId++;
    const zone = document.getElementById('anti-gravity-zone');
    if (!zone) return;
    const drop = document.createElement('div');
    drop.className = 'droplet visible';
    drop.style.background = color;
    
    const left = Math.random() * 60 + 20;
    const top = Math.random() * 30 + 10;
    
    drop.style.left = `${left}%`;
    drop.style.top = `${top}%`;
    drop.style.animation = `floatDrop ${Math.random() * 2 + 3}s infinite alternate ease-in-out`;
    
    zone.appendChild(drop);
    
    setTimeout(() => {
        drop.classList.add('falling');
        setTimeout(() => {
            drop.remove();
            updateLiquidColor();
        }, 1000);
    }, 1500);
}

function updateFormulaStats() {
    let topC = 0, midC = 0, baseC = 0;
    window.selectedNotes.forEach(n => {
        if(n.type === 'top') topC++;
        else if(n.type === 'mid') midC++;
        else if(n.type === 'base') baseC++;
    });
    
    const total = topC + midC + baseC;
    if (total === 0) {
        document.getElementById('stat-top').innerText = '0%';
        document.getElementById('stat-mid').innerText = '0%';
        document.getElementById('stat-base').innerText = '0%';
        return;
    }
    
    document.getElementById('stat-top').innerText = Math.round((topC / total) * 100) + '%';
    document.getElementById('stat-mid').innerText = Math.round((midC / total) * 100) + '%';
    document.getElementById('stat-base').innerText = Math.round((baseC / total) * 100) + '%';
}

function updateLiquidColor() {
    const liquid = document.getElementById('wizard-liquid');
    if (!liquid) return;
    if (window.selectedNotes.length === 0) {
        liquid.style.height = '0%';
        return;
    }
    
    liquid.style.height = `${Math.min(window.selectedNotes.length * 15, 80)}%`;
    const lastColor = window.selectedNotes[window.selectedNotes.length - 1].color;
    liquid.style.background = `linear-gradient(to top, ${lastColor}, rgba(183, 110, 121, 0.1))`;
}

window.updateLiquidIntensity = function(val) {
    const liquid = document.getElementById('wizard-liquid');
    const info = document.getElementById('intensity-info');
    if (!liquid || !info) return;

    if (val > 50) {
        liquid.classList.add('sparkle');
        info.innerHTML = "Formülünüz %15-%20 saf esans konsantrasyonu ile Eau de Parfum (EDP) olarak seyreltiliyor. Bu, kokunuzun arkasında unutulmaz bir iz (sillage) bırakmasını sağlayacak.";
    } else {
        liquid.classList.remove('sparkle');
        info.innerHTML = "Formülünüz %5-%10 saf esans konsantrasyonu ile Eau de Toilette (EDT) olarak seyreltiliyor. Hafif ve ferahlatıcı, günlük kullanıma ideal.";
    }
};

window.generateSummary = function() {
    window.nextWizardStep(4);
    
    const card = document.getElementById('maceration-card');
    if (card) card.classList.add('visible');

    const timelines = document.querySelectorAll('.timeline-item');
    timelines.forEach((t, i) => {
        setTimeout(() => {
            t.classList.add('active');
        }, i * 800);
    });

    const finalImgs = document.querySelectorAll('.final-bottle-display');
    finalImgs.forEach(img => img.style.display = 'block');
    
    const zone = document.getElementById('anti-gravity-zone');
    if (zone) zone.style.display = 'none';
    
    const wizBottle = document.querySelector('.wizard-bottle');
    if (wizBottle) wizBottle.style.display = 'none';

    // Populate Receipt
    const today = new Date();
    document.getElementById('receipt-date').innerText = today.toLocaleDateString('tr-TR');
    document.getElementById('receipt-mood').innerText = window.selectedMood;
    
    const slider = document.getElementById('intensitySlider').value;
    document.getElementById('receipt-intensity').innerText = slider > 50 ? 'Eau de Parfum (EDP)' : 'Eau de Toilette (EDT)';
    
    const list = document.getElementById('receipt-notes-list');
    if (list) {
        list.innerHTML = '';
        window.selectedNotes.forEach(n => {
            const li = document.createElement('li');
            const typeTR = n.type === 'top' ? 'Üst' : (n.type === 'mid' ? 'Orta' : 'Alt');
            li.innerText = `${n.name} (${typeTR})`;
            list.appendChild(li);
        });
    }

    const label = document.querySelector('.bottle-label');
    if (label) label.classList.add('visible');
    
    if (!window.formulaCode) {
        window.formulaCode = Math.floor(Math.random() * 9000) + 1000;
    }
    const formNo = document.getElementById('formula-no');
    if (formNo) formNo.innerText = `Formül No: ${window.formulaCode}`;
    
    const reorderSpan = document.getElementById('reorder-code');
    if(reorderSpan) {
        reorderSpan.innerText = `#PIEN-${window.formulaCode}`;
    }
};

window.submitOrder = function() {
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const address = document.getElementById('order-address').value;
    
    if(!name || !phone || !address) {
        alert("Lütfen teslimat ve iletişim bilgilerinizi eksiksiz doldurun.");
        return;
    }
    
    alert(`Teşekkürler ${name}!\nSiparişiniz (Formül: #PIEN-${window.formulaCode}) üretime alındı.\n2 Gün içinde kargolanacaktır.`);
    window.location.reload();
};

// B2B Scroll Story Animation
document.addEventListener('scroll', () => {
    const buildBrandSection = document.getElementById('build-brand');
    if (!buildBrandSection) return;

    const stickyContainer = buildBrandSection.querySelector('.build-brand-sticky');
    if (!stickyContainer) return;

    const sectionTop = buildBrandSection.offsetTop;
    const sectionHeight = buildBrandSection.offsetHeight;
    const windowScrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    let scrolled = windowScrollY - sectionTop;
    let maxScroll = sectionHeight - windowHeight;
    let progress = scrolled / maxScroll;

    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    stickyContainer.style.setProperty('--scroll-p', progress);
});
