let isLogin = true;
let cart = [];
let products = [
    { id: 1, name: 'Buquê de Flores', image: 'images/flores.png', price: 79.99 },
    { id: 2, name: 'Chocolate Premium', image: 'images/chocolate.png', price: 35.00 },
    { id: 3, name: 'Urso de Pelúcia', image: 'images/urso.png', price: 80.00 },
    { id: 4, name: 'Carro Alegórico', image: 'images/carro.png', price: 300.00 },
    { id: 5, name: 'Cesta Romântica', image: 'images/cesta.png', price: 129.99 },
    { id: 6, name: 'Carta Personalizada', image: 'images/carta.png', price: 14.99 }
];

// Elementos do DOM
const authScreen = document.getElementById('authScreen');
const mainScreen = document.getElementById('mainScreen');
const cartScreen = document.getElementById('cartScreen');
const authForm = document.getElementById('authForm');
const authBtn = document.getElementById('authBtn');
const toggleLink = document.getElementById('toggleLink');
const toggleText = document.getElementById('toggleText');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const logoutBtn = document.getElementById('logoutBtn');
const cartBtn = document.getElementById('cartBtn');
const backBtn = document.getElementById('backBtn');
const finalizeBtn = document.getElementById('finalizeBtn');
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const emptyCart = document.getElementById('emptyCart');
const totalItems = document.getElementById('totalItems');
const totalPrice = document.getElementById('totalPrice');

// Toggle entre login e cadastro
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    
    if (isLogin) {
        authBtn.textContent = 'Entrar';
        toggleText.textContent = 'Não tem conta?';
        toggleLink.textContent = 'Cadastre-se';
        confirmPasswordGroup.classList.add('hidden');
    } else {
        authBtn.textContent = 'Cadastrar';
        toggleText.textContent = 'Já tem conta?';
        toggleLink.textContent = 'Faça login';
        confirmPasswordGroup.classList.remove('hidden');
    }
});

// Autenticação
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!isLogin) {
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
    }
    
    // Simular login/cadastro
    authScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    renderProducts();
});

// Logout
logoutBtn.addEventListener('click', () => {
    mainScreen.style.display = 'none';
    cartScreen.style.display = 'none';
    authScreen.style.display = 'block';
    authForm.reset();
    cart = [];
    updateCartCount();
});

// Mostrar carrinho
cartBtn.addEventListener('click', () => {
    showCartScreen();
});

// Voltar para tela principal
backBtn.addEventListener('click', () => {
    showMainScreen();
});

// Finalizar compra
finalizeBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const total = calculateTotal();
    alert(`Compra finalizada com sucesso!\n\nTotal: R$ ${total.toFixed(2)}\n\nObrigado por comprar no Mimou! 💝`);
    cart = [];
    updateCartCount();
    showMainScreen();
});

// Renderizar produtos
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-icon">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">R$ ${product.price.toFixed(2)}</div>
            
            <div class="quantity-control">
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                <span class="quantity-display" id="qty-${product.id}">1</span>
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>
            
            <input type="text" 
                   class="message-input" 
                   id="msg-${product.id}" 
                   placeholder="Mensagem personalizada (opcional)">
            
            <button class="add-cart-btn" onclick="addToCart(${product.id})">
                Adicionar ao Carrinho
            </button>
        </div>
    `).join('');
}

// Controle de quantidade
function changeQuantity(productId, delta) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyElement.textContent);
    currentQty = Math.max(1, currentQty + delta);
    qtyElement.textContent = currentQty;
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).textContent);
    const message = document.getElementById(`msg-${productId}`).value;
    
    const cartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantity,
        message: message,
        subtotal: product.price * quantity
    };
    
    cart.push(cartItem);
    updateCartCount();
    
    alert(`${product.name} adicionado ao carrinho! 🛒`);
    
    // Resetar quantidade e mensagem
    document.getElementById(`qty-${productId}`).textContent = '1';
    document.getElementById(`msg-${productId}`).value = '';
}

// Remover do carrinho
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    renderCart();
}

// Atualizar contador do carrinho
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Calcular total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
}

// Renderizar carrinho
function renderCart() {
    if (cart.length === 0) {
        cartItems.parentElement.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartItems.parentElement.style.display = 'grid';
    emptyCart.style.display = 'none';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                ${item.message ? `<div class="cart-item-message">"${item.message}"</div>` : ''}
                <div class="cart-item-quantity">Quantidade: ${item.quantity}x</div>
            </div>
            <div class="cart-item-price">R$ ${item.subtotal.toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remover</button>
        </div>
    `).join('');
    
    const total = calculateTotal();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    totalItems.textContent = itemCount;
    totalPrice.textContent = `R$ ${total.toFixed(2)}`;
}

// Mostrar tela do carrinho
function showCartScreen() {
    mainScreen.style.display = 'none';
    cartScreen.style.display = 'block';
    renderCart();
}

// Mostrar tela principal
function showMainScreen() {
    cartScreen.style.display = 'none';
    mainScreen.style.display = 'block';
}