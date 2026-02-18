// Sistema de Carrinho
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Adicionar ao carrinho
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('✅ Produto adicionado ao carrinho!');
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Atualizar quantidade
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
        renderCartItems();
    }
}

// Salvar carrinho
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Calcular total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Atualizar UI do carrinho
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Renderizar itens do carrinho
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        if (cartTotal) cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');
    
    if (cartTotal) {
        cartTotal.textContent = formatPrice(getCartTotal());
    }
}

// Toggle favorito
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    const btn = event.target;
    
    if (index > -1) {
        favorites.splice(index, 1);
        btn.classList.remove('active');
        showNotification('💔 Removido dos favoritos');
    } else {
        favorites.push(productId);
        btn.classList.add('active');
        showNotification('❤️ Adicionado aos favoritos!');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesUI();
}

// Atualizar UI de favoritos
function updateFavoritesUI() {
    const favCount = document.getElementById('favCount');
    if (favCount) {
        favCount.textContent = favorites.length;
    }
    
    // Marcar botões de favoritos
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        const card = btn.closest('.product-card');
        const productId = parseInt(card.getAttribute('data-product-id'));
        if (favorites.includes(productId)) {
            btn.classList.add('active');
        }
    });
}

// Mostrar notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2C1810;
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Modal do carrinho
function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('active');
        renderCartItems();
    }
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Finalizar compra (envia para WhatsApp)
function checkout() {
    if (cart.length === 0) {
        showNotification('⚠️ Seu carrinho está vazio!');
        return;
    }
    
    const message = `🛒 *Pedido - Vintage Drum Shop*\n\n` +
        cart.map(item => 
            `${item.quantity}x ${item.name}\n${formatPrice(item.price)} cada`
        ).join('\n\n') +
        `\n\n*Total: ${formatPrice(getCartTotal())}*\n\n` +
        `Gostaria de finalizar este pedido!`;
    
    const whatsappUrl = `https://wa.me/5511964405519?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
    }
    
    .cart-item-quantity button {
        background: var(--accent-color);
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        font-weight: bold;
    }
    
    .cart-item-quantity span {
        min-width: 30px;
        text-align: center;
        font-weight: 600;
    }
`;
document.head.appendChild(style);