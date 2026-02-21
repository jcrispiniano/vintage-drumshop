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
    
    // Busca com autocomplete
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', showSearchSuggestions);
        searchInput.addEventListener('keydown', handleSearchKeyboard);
    }
    
    // Fechar sugestões ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            hideSearchSuggestions();
        }
    });
    
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

// Busca de produtos com autocomplete
let selectedSuggestionIndex = -1;

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length < 1) {
        hideSearchSuggestions();
        renderProducts();
        return;
    }
    
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    showSearchSuggestions(filtered, searchTerm);
}

function showSearchSuggestions(filteredProducts = null, searchTerm = '') {
    const searchInput = document.getElementById('searchInput');
    const searchBar = searchInput.closest('.search-bar');
    
    // Criar container de sugestões se não existir
    let suggestionsBox = document.getElementById('searchSuggestions');
    if (!suggestionsBox) {
        suggestionsBox = document.createElement('div');
        suggestionsBox.id = 'searchSuggestions';
        suggestionsBox.className = 'search-suggestions';
        searchBar.appendChild(suggestionsBox);
    }
    
    if (!filteredProducts) {
        filteredProducts = products;
    }
    
    if (filteredProducts.length === 0) {
        suggestionsBox.innerHTML = '<div class="suggestion-item no-results">Nenhum produto encontrado</div>';
        suggestionsBox.style.display = 'block';
        return;
    }
    
    // Limitar a 8 sugestões
    const suggestions = filteredProducts.slice(0, 8);
    
    suggestionsBox.innerHTML = suggestions.map((product, index) => `
        <div class="suggestion-item" data-product-id="${product.id}" data-index="${index}">
            <div class="suggestion-image">
                ${product.image.startsWith('images/') || product.image.startsWith('http') 
                    ? `<img src="${product.image}" alt="${product.name}">` 
                    : `<span class="suggestion-emoji">${product.image}</span>`}
            </div>
            <div class="suggestion-info">
                <div class="suggestion-name">${product.name}</div>
                <div class="suggestion-price">${formatPrice(product.price)}</div>
            </div>
        </div>
    `).join('');
    
    suggestionsBox.style.display = 'block';
    selectedSuggestionIndex = -1;
    
    // Adicionar eventos de click
    suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            selectProduct(productId);
        });
        
        item.addEventListener('mouseenter', function() {
            selectedSuggestionIndex = parseInt(this.dataset.index);
            updateSelectedSuggestion();
        });
    });
}

function hideSearchSuggestions() {
    const suggestionsBox = document.getElementById('searchSuggestions');
    if (suggestionsBox) {
        suggestionsBox.style.display = 'none';
    }
    selectedSuggestionIndex = -1;
}

function handleSearchKeyboard(e) {
    const suggestionsBox = document.getElementById('searchSuggestions');
    if (!suggestionsBox || suggestionsBox.style.display === 'none') return;
    
    const items = suggestionsBox.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, items.length - 1);
        updateSelectedSuggestion();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
        updateSelectedSuggestion();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
            const selectedItem = items[selectedSuggestionIndex];
            const productId = parseInt(selectedItem.dataset.productId);
            selectProduct(productId);
        }
    } else if (e.key === 'Escape') {
        hideSearchSuggestions();
    }
}

function updateSelectedSuggestion() {
    const items = document.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function selectProduct(productId) {
    const product = getProductById(productId);
    if (product) {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = product.name;
        hideSearchSuggestions();
        
        // Scroll até o produto ou mostrar detalhes
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            productCard.classList.add('highlight');
            setTimeout(() => productCard.classList.remove('highlight'), 2000);
        }
    }
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

// Header sempre visível - removido animação de esconder no scroll

// Botão voltar - usar histórico do browser
document.addEventListener('DOMContentLoaded', function() {
    const backButtons = document.querySelectorAll('[data-action="back"], .btn-back, .back-button');
    
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.back();
        });
    });
});

// Função global para voltar - pode ser chamada de qualquer lugar
function goBack() {
    window.history.back();
}