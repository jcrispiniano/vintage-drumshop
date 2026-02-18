// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar produtos na home
    renderProducts();
    
    // Atualizar contadores
    updateCartUI();
    updateFavoritesUI();
    
    // Event Listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Carrinho
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }
    
    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Fechar modal ao clicar fora
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }
    
    // Busca
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Busca de produtos
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length < 2) {
        renderProducts();
        return;
    }
    
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filtered);
}

// Carregar página de categoria
function loadCategoryPage() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('cat');
    const brand = params.get('marca');
    
    if (category || brand) {
        const filtered = filterProducts(category, brand);
        const container = document.getElementById('categoryProducts');
        if (container) {
            container.innerHTML = '';
            filtered.forEach(product => {
                container.appendChild(createProductCard(product));
            });
            updateFavoritesUI();
        }
        
        // Atualizar título
        const title = document.getElementById('categoryTitle');
        if (title) {
            if (category) {
                title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            } else if (brand) {
                title.textContent = brand.toUpperCase();
            }
        }
    }
}

// Se estiver na página de categoria, carregar produtos
if (window.location.pathname.includes('categoria.html')) {
    document.addEventListener('DOMContentLoaded', loadCategoryPage);
}

// Animação de scroll para header
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Adicionar transição ao header
const header = document.querySelector('.header');
if (header) {
    header.style.transition = 'transform 0.3s ease';
}