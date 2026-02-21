// Base de produtos
const products = [
    // Pratos Istanbul Agop
    {
        id: 1,
        name: 'Crash Istanbul Agop Xist Dry Dark Brilliant 22"',
        category: 'pratos',
        brand: 'istanbul',
        price: 2999.00,
        oldPrice: null,
        image: '🎵',
        badge: 'Novo',
        description: 'Prato crash profissional com som seco e definido'
    },
    {
        id: 2,
        name: 'Crash Istanbul Agop Power Brilliant 22"',
        category: 'pratos',
        brand: 'istanbul',
        price: 2999.00,
        oldPrice: null,
        image: '🎵',
        badge: 'Novo',
        description: 'Prato crash com projeção e brilho excepcional'
    },
    {
        id: 3,
        name: 'Ride Istanbul Agop Traditional 22"',
        category: 'pratos',
        brand: 'istanbul',
        price: 3499.00,
        oldPrice: null,
        image: '🎵',
        badge: null,
        description: 'Ride tradicional turco com som rico e complexo'
    },
    {
        id: 4,
        name: 'Hi-Hat Istanbul Agop Traditional 14"',
        category: 'pratos',
        brand: 'istanbul',
        price: 2799.00,
        oldPrice: null,
        image: '🎵',
        badge: null,
        description: 'Chimbal versátil com resposta rápida'
    },
    
    // Baquetas Wincent
    {
        id: 5,
        name: 'Baqueta Wincent 5BXL Hickory',
        category: 'baquetas',
        brand: 'wincent',
        price: 120.00,
        oldPrice: 149.90,
        image: 'images/produtos/47b1f7aa-3b70-417c-b779-783b59328c49.jpg',
        badge: 'Promoção',
        description: 'Baqueta profissional 5B extra longa'
    },
    {
        id: 6,
        name: 'Baqueta Wincent 7A Maple',
        category: 'baquetas',
        brand: 'wincent',
        price: 110.00,
        oldPrice: null,
        image: 'images/produtos/180ea6af-fd5c-4fcc-adf8-2598db3e8c01.jpg',
        badge: null,
        description: 'Baqueta leve e rápida em maple'
    },
    {
        id: 7,
        name: 'Baqueta Wincent 5A Hickory',
        category: 'baquetas',
        brand: 'wincent',
        price: 115.00,
        oldPrice: null,
        image: 'images/produtos/0f84e39e-fc21-4192-81d0-76796cf87b78.jpg',
        badge: null,
        description: 'Modelo clássico 5A em hickory'
    },
    {
        id: 8,
        name: 'Baqueta Wincent 2B Oak',
        category: 'baquetas',
        brand: 'wincent',
        price: 125.00,
        oldPrice: null,
        image: 'images/produtos/dynabeat-2b.jpg',
        badge: null,
        description: 'Baqueta pesada para som potente'
    },
    
    // Caixas
    {
        id: 9,
        name: 'Caixa Pinguim Real Alumínio 14x6,5"',
        category: 'caixas',
        brand: 'pinguim',
        price: 2099.00,
        oldPrice: null,
        image: '📦',
        badge: 'Destaque',
        description: 'Caixa profissional em alumínio com som definido'
    },
    {
        id: 10,
        name: 'Caixa Yamaha Stage Custom Steel 14x5,5"',
        category: 'caixas',
        brand: 'yamaha',
        price: 1899.00,
        oldPrice: null,
        image: '📦',
        badge: null,
        description: 'Caixa em aço com resposta versátil'
    },
    {
        id: 11,
        name: 'Caixa Pearl Export Wood 14x6"',
        category: 'caixas',
        brand: 'pearl',
        price: 1699.00,
        oldPrice: 1999.00,
        image: '📦',
        badge: 'Oferta',
        description: 'Caixa em madeira com som quente'
    },
    
    // Baterias
    {
        id: 12,
        name: 'Bateria Tama Superstar Classic 5 Peças',
        category: 'baterias',
        brand: 'tama',
        price: 8999.00,
        oldPrice: null,
        image: '🥁',
        badge: 'Novo',
        description: 'Kit completo profissional 5 peças'
    },
    {
        id: 13,
        name: 'Bateria Pearl Export EXX 5 Peças',
        category: 'baterias',
        brand: 'pearl',
        price: 7499.00,
        oldPrice: null,
        image: '🥁',
        badge: null,
        description: 'Kit intermediário de alta qualidade'
    },
    {
        id: 14,
        name: 'Bateria Yamaha Stage Custom 5 Peças',
        category: 'baterias',
        brand: 'yamaha',
        price: 9999.00,
        oldPrice: null,
        image: '🥁',
        badge: 'Destaque',
        description: 'Kit profissional versátil'
    },
    
    // Ferragens
    {
        id: 15,
        name: 'Pedal Duplo DW 9002',
        category: 'ferragens',
        brand: 'dw',
        price: 4999.00,
        oldPrice: null,
        image: '🔧',
        badge: 'Premium',
        description: 'Pedal duplo profissional de alta performance'
    },
    {
        id: 16,
        name: 'Estante Para Prato Tama HC83BLS',
        category: 'ferragens',
        brand: 'tama',
        price: 899.00,
        oldPrice: null,
        image: '🔧',
        badge: null,
        description: 'Estante robusta e ajustável'
    },
    {
        id: 17,
        name: 'Pedal Simples Pearl P930',
        category: 'ferragens',
        brand: 'pearl',
        price: 1299.00,
        oldPrice: 1499.00,
        image: '🔧',
        badge: 'Promoção',
        description: 'Pedal simples com corrente'
    },
    
    // Peles
    {
        id: 18,
        name: 'Pele Remo Pinstripe 14"',
        category: 'peles',
        brand: 'remo',
        price: 189.00,
        oldPrice: null,
        image: '🎯',
        badge: null,
        description: 'Pele dupla para caixa com som controlado'
    },
    {
        id: 19,
        name: 'Pele Evans EMAD 22" Bumbo',
        category: 'peles',
        brand: 'evans',
        price: 299.00,
        oldPrice: null,
        image: '🎯',
        badge: null,
        description: 'Pele de bumbo com controle de ataque'
    },
    {
        id: 20,
        name: 'Pele Aquarian Super 2 Clear 12"',
        category: 'peles',
        brand: 'aquarian',
        price: 169.00,
        oldPrice: null,
        image: '🎯',
        badge: null,
        description: 'Pele dupla transparente para tons'
    },
    
    // Acessórios
    {
        id: 21,
        name: 'Abafador de Bumbo Moongel',
        category: 'acessorios',
        brand: 'rtom',
        price: 79.00,
        oldPrice: null,
        image: '⚙️',
        badge: null,
        description: 'Gel abafador reutilizável'
    },
    {
        id: 22,
        name: 'Chave de Afinação Gibraltar',
        category: 'acessorios',
        brand: 'gibraltar',
        price: 49.00,
        oldPrice: null,
        image: '⚙️',
        badge: null,
        description: 'Chave profissional para afinação'
    },
    {
        id: 23,
        name: 'Bag Para Pratos Ahead Armor 22"',
        category: 'acessorios',
        brand: 'ahead',
        price: 599.00,
        oldPrice: null,
        image: '⚙️',
        badge: null,
        description: 'Bag acolchoado para transporte de pratos'
    },
    {
        id: 24,
        name: 'Banqueta Tama 1st Chair HT741B',
        category: 'acessorios',
        brand: 'tama',
        price: 1499.00,
        oldPrice: null,
        image: '⚙️',
        badge: 'Destaque',
        description: 'Banco profissional com regulagem de altura'
    }
];

// Função para formatar preço
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para criar card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    const oldPriceHTML = product.oldPrice 
        ? `<span class="product-old-price">${formatPrice(product.oldPrice)}</span>` 
        : '';
    
    const badgeHTML = product.badge 
        ? `<span class="product-badge">${product.badge}</span>` 
        : '';
    
    // Verifica se é URL ou emoji
    const isUrl = product.image && (product.image.startsWith('http') || product.image.startsWith('/') || product.image.startsWith('./'));
    const imageHTML = isUrl
        ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">` 
        : `<div class="product-emoji">${product.image}</div>`;
    
    card.innerHTML = `
        <div class="product-image">
            ${imageHTML}
            ${badgeHTML}
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">
                ${oldPriceHTML}
                ${formatPrice(product.price)}
            </div>
            <div class="product-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    Adicionar ao Carrinho
                </button>
                <button class="btn-favorite" onclick="toggleFavorite(${product.id})">
                    ♡
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Renderizar produtos na página
function renderProducts(productsToRender = products, containerId = 'productsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    productsToRender.slice(0, 8).forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// Buscar produto por ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Filtrar produtos
function filterProducts(category = null, brand = null) {
    let filtered = products;
    
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }
    
    if (brand) {
        filtered = filtered.filter(p => p.brand === brand);
    }
    
    return filtered;
}