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
        image: 'images/produtos/00550d42-be64-411f-bd94-056299cfded1.jpg',
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
        image: 'images/produtos/0681672d-825c-46ec-a16d-a3c02a9471a8.jpg',
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
        image: 'images/produtos/098d8113-167b-4e7a-95ea-eef021174636.jpg',
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
        image: 'images/produtos/0a8cf347-8e1d-400e-b42f-f91ebb9e3da7.jpg',
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
    {
        id: 25,
        name: 'Wincent Pro Brushes 29 Light (W-29L)',
        category: 'baquetas',
        brand: 'wincent',
        price: 310.00,
        oldPrice: null,
        image: 'images/produtos/d59c1b49-7205-4622-8bc5-51a4b7d35da6.jpg',
        badge: null,
        description: 'Vassoura profissional Wincent 29 Light com cerdas retráteis para sons delicados'
    },
    {
        id: 26,
        name: 'Wincent Pro Brushes 40 Heavy (W-40H)',
        category: 'baquetas',
        brand: 'wincent',
        price: 310.00,
        oldPrice: null,
        image: 'images/produtos/ee2c3565-b2f5-461a-b1ce-e091b82bb3c8.jpg',
        badge: null,
        description: 'Vassoura profissional Wincent 40 Heavy com cerdas retráteis para volume intenso'
    },
    {
        id: 27,
        name: 'Wincent Pro Bamboo Rods 19P (W-19P)',
        category: 'baquetas',
        brand: 'wincent',
        price: 170.00,
        oldPrice: null,
        image: 'images/produtos/wincent-19p-rods.jpg',
        badge: null,
        description: 'Rods de bambu profissionais Wincent 19P com som equilibrado'
    },
    {
        id: 28,
        name: 'Baqueta Dynabeat 7A (W-BD7A)',
        category: 'baquetas',
        brand: 'wincent',
        price: 80.00,
        oldPrice: null,
        image: 'images/produtos/bfcc32f1-5973-4b3a-b503-77f1ac55cc3d.jpg',
        badge: null,
        description: 'Baqueta leve Dynabeat 7A em madeira hickory com ótimo custo-benefício'
    },
    {
        id: 29,
        name: 'Baqueta Wincent 5B Standard (W-5B)',
        category: 'baquetas',
        brand: 'wincent',
        price: 119.00,
        oldPrice: null,
        image: 'images/produtos/caf28eb0-c37a-47cc-ac10-845a5643d501.jpg',
        badge: null,
        description: 'Baqueta profissional 5B Standard em madeira hickory, versátil para todos os estilos'
    },
    {
        id: 30,
        name: 'Baqueta Wincent 5A JAZZ (W-5AJ)',
        category: 'baquetas',
        brand: 'wincent',
        price: 119.00,
        oldPrice: null,
        image: 'images/produtos/c58334f3-7c87-4921-ac1c-271cecf8b655.jpg',
        badge: null,
        description: 'Baqueta profissional 5A JAZZ em madeira hickory para jazz e estilos leves'
    },
    
    // Caixas
    {
        id: 9,
        name: 'Caixa Pinguim Real Alumínio 14x6,5"',
        category: 'caixas',
        brand: 'pinguim',
        price: 2099.00,
        oldPrice: null,
        image: 'images/produtos/0ef82007-88fa-4558-a9fc-324b9b27b9dc.jpg',
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
        image: 'images/produtos/101083e0-bc9a-414c-ae99-6737dc5ae5b4.jpg',
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
        image: 'images/produtos/1a05183a-64b5-46e9-935d-c956df9329bb.jpg',
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
        image: 'images/produtos/215dc4ae-7ea5-4398-8678-b18ce9046c2b.jpg',
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
        image: 'images/produtos/216c9799-6e50-4623-9f9c-6cb417018bea.jpg',
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
        image: 'images/produtos/26aee98c-d7e4-4d1b-8b28-b71690da9715.jpg',
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
        image: 'images/produtos/283f11a6-e986-4693-9f41-39ecdf708908.jpg',
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
        image: 'images/produtos/3c6cfb30-9cdc-4a19-ada0-a4313dd58642.jpg',
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
        image: 'images/produtos/42060f92-16da-45ff-8644-f41ad5fe8877.jpg',
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
        image: 'images/produtos/63d7474e-c04e-43a1-a87b-454cb61a17a7.jpg',
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
        image: 'images/produtos/713a49b0-14e8-48ac-9277-ec180bcf1444.jpg',
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
        image: 'images/produtos/7fa4ed18-677d-4321-b3be-636952e84746.jpg',
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
        image: 'images/produtos/807e765e-e528-4a05-b2b9-9445ef248404.jpg',
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
        image: 'images/produtos/83f697cc-af64-460d-9658-1e2208b808e6.jpg',
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
        image: 'images/produtos/929c37fd-ea71-4714-99b2-cfe909871df7.jpg',
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
        image: 'images/produtos/bb8c64fa-0b08-4032-b2bf-c8646f93e52c.jpg',
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