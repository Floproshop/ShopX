// Données initiales
let products = [
    { id: 1, name: "Smartphone", price: 50000, category: "Électronique", desc: "Un téléphone performant.", stock: 10, rating: 4, seller: "Vendeur1", promo: 10 },
    { id: 2, name: "T-shirt", price: 5000, category: "Mode", desc: "Coton bio.", stock: 20, rating: 5, seller: "Vendeur2", promo: 0 }
];
let pendingSellers = [];
let pendingProducts = [];
let wishlist = [];
let orders = [];

// Langue
let lang = "fr";
const translations = {
    fr: {
        welcome: "Bienvenue sur ShopX",
        desc: "Une plateforme innovante pour acheter et vendre en toute simplicité.",
        promo: "Promotions en cours",
        buyer: "Espace Acheteur",
        seller: "Espace Vendeur",
        admin: "Espace Admin",
        search: "Rechercher un produit...",
        signup: "Inscription Vendeur"
    },
    en: {
        welcome: "Welcome to ShopX",
        desc: "An innovative platform to buy and sell with ease.",
        promo: "Current Promotions",
        buyer: "Buyer Space",
        seller: "Seller Space",
        admin: "Admin Space",
        search: "Search for a product...",
        signup: "Seller Signup"
    }
};

// Afficher les sections
const sections = ["home", "buyer", "seller", "admin"];
function showSection(id) {
    sections.forEach(section => {
        document.getElementById(section).classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

document.getElementById("home-btn").addEventListener("click", () => showSection("home"));
document.getElementById("buyer-btn").addEventListener("click", () => showSection("buyer"));
document.getElementById("seller-btn").addEventListener("click", () => {
    showSection("seller");
    document.getElementById("seller-signup").classList.remove("hidden");
});
document.getElementById("admin-btn").addEventListener("click", () => showSection("admin"));

// Changer langue
document.getElementById("lang-fr").addEventListener("click", () => switchLang("fr"));
document.getElementById("lang-en").addEventListener("click", () => switchLang("en"));

function switchLang(newLang) {
    lang = newLang;
    document.getElementById("home").querySelector("h2").textContent = translations[lang].welcome;
    document.getElementById("home").querySelector("p").textContent = translations[lang].desc;
    document.getElementById("promo-section").querySelector("h3").textContent = translations[lang].promo;
    document.getElementById("buyer").querySelector("h2").textContent = translations[lang].buyer;
    document.getElementById("seller").querySelector("h2").textContent = translations[lang].seller;
    document.getElementById("admin").querySelector("h2").textContent = translations[lang].admin;
    document.getElementById("search").placeholder = translations[lang].search;
    document.getElementById("seller-signup").querySelector("h3").textContent = translations[lang].signup;
}

// Afficher produits
function displayProducts(containerId, productArray) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    productArray.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = 
            <h4>${product.name}</h4>
            <p>${product.price} FCFA${product.promo > 0 ?  (-${product.promo}%) : ""}</p>
            <p>${product.desc}</p>
            <p>Note : ${"★".repeat(product.rating)}${"☆".repeat(5 - product.rating)}</p>
            <p>Vendeur : ${product.seller}</p>
            <button class="action-btn" onclick="addToWishlist(${product.id})">Ajouter à la liste</button>
        ;
        container.appendChild(div);
    });
}

// Afficher promotions
function displayPromos() {
    const promoList = products.filter(p => p.promo > 0);
    displayProducts("promo-list", promoList);
}// Recherche et filtres
document.getElementById("search-btn").addEventListener("click", () => {
    const query = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("filter-category").value;
    const priceRange = document.getElementById("filter-price").value;

    let filtered = products;
    if (query) filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
    if (category) filtered = filtered.filter(p => p.category === category);
    if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }
    displayProducts("product-list", filtered);
});

// Inscription vendeur
document.getElementById("seller-signup").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("seller-name").value;
    const email = document.getElementById("seller-email").value;
    pendingSellers.push({ name, email });
    alert("Inscription soumise ! En attente de validation par l'admin.");
    document.getElementById("seller-signup").classList.add("hidden");
    document.getElementById("seller-dashboard").classList.remove("hidden");
    updateAdmin();
});

// Ajouter produit
document.getElementById("add-product-btn").addEventListener("click", () => {
    document.getElementById("add-product-form").classList.remove("hidden");
});

document.getElementById("add-product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const product = {
        id: products.length + 1,
        name: document.getElementById("product-name").value,
        price: Number(document.getElementById("product-price").value),
        category: document.getElementById("product-category").value,
        desc: document.getElementById("product-desc").value,
        stock: Number(document.getElementById("product-stock").value),
        rating: 0,
        seller: document.getElementById("seller-name").value,
        promo: Number(document.getElementById("promo-discount").value) || 0
    };
    pendingProducts.push(product);
    alert("Produit soumis pour modération !");
    document.getElementById("add-product-form").reset();
    document.getElementById("add-product-form").classList.add("hidden");
    updateAdmin();
});

// Liste de souhaits
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!wishlist.some(p => p.id === productId)) {
        wishlist.push(product);
        document.getElementById("wishlist-count").textContent = wishlist.length;
    }
}

document.getElementById("view-wishlist").addEventListener("click", () => {
    displayProducts("product-list", wishlist);
});

// Admin
function updateAdmin() {
    const sellerContainer = document.getElementById("pending-sellers");
    sellerContainer.innerHTML = "";
    pendingSellers.forEach((seller, index) => {
        const div = document.createElement("div");
        div.innerHTML = ${seller.name} (${seller.email}) <button onclick="approveSeller(${index})">Valider</button>;
        sellerContainer.appendChild(div);
    });

    const productContainer = document.getElementById("pending-products");
    productContainer.innerHTML = "";
    pendingProducts.forEach((product, index) => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = ${product.name} - ${product.price} FCFA <button onclick="approveProduct(${index})">Valider</button>;
        productContainer.appendChild(div);
    });
}

function approveSeller(index) {
    pendingSellers.splice(index, 1);
    updateAdmin();
}

function approveProduct(index) {
    products.push(pendingProducts[index]);
    pendingProducts.splice(index, 1);
    displayProducts("product-list", products);
    displayPromos();
    updateAdmin();
}

// Initialisation
displayProducts("product-list", products);
displayPromos();