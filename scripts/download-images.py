#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import os
import time
from urllib.parse import urljoin

# URLs dos produtos
produtos_urls = [
    # Pratos
    ("crash-19-xist-dry-dark", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-dry-dark-brilliant-crash-19-polegadas/"),
    ("crash-22-xist-dry-dark-brilliant", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-dry-dark-brilliant-crash-22-polegadas/"),
    ("crash-21-xist-dry-dark-brilliant", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-dry-dark-brilliant-crash-21-polegadas/"),
    ("crash-17-xist-power", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-power-crash-17-polegadas/"),
    ("crash-18-xist-brilliant", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-brilliant-crash-18-polegadas/"),
    ("crash-16-xist-brilliant", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-brilliant-crash-16-polegadas/"),
    ("crash-22-xist", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-crash-22-polegadas/"),
    ("crash-16-xist", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-crash-16-polegadas/"),
    ("crash-19-xist-ion-dark", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-ion-dark-crash-19-polegadas/"),
    ("crash-22-xist-dry-dark", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-dry-dark-crash-22-polegadas/"),
    ("crash-20-xist-dry-dark", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-dry-dark-crash-20-polegadas/"),
    ("hihat-15-xist-dry-dark-brilliant", "https://zonasoul.com.br/produtos/chimbal-istanbul-agop-xist-dry-dark-brilliant-hi-hat-15-xddbh15/"),
    ("ride-24-joey-waronker", "https://zonasoul.com.br/produtos/prato-istanbul-agop-joey-waronker-signature-ride-24-jwr24/"),
    ("ride-24-special-jazz", "https://zonasoul.com.br/produtos/prato-istanbul-agop-special-jazz-edition-ride-24/"),
    ("hihat-14-special-jazz", "https://zonasoul.com.br/produtos/chimbal-istanbul-agop-special-jazz-edition-hi-hat-14/"),
    ("hihat-15-traditional-jazz", "https://zonasoul.com.br/produtos/chimbal-istanbul-agop-traditional-jazz-hi-hats-15/"),
    ("hihat-14-traditional-jazz", "https://zonasoul.com.br/produtos/chimbal-istanbul-agop-traditional-jazz-hi-hats-14/"),
    ("ride-22-mel-lewis", "https://zonasoul.com.br/produtos/prato-istanbul-agop-mel-lewis-signature-ride-22-bt8k2/"),
    ("ride-22-traditional-dark", "https://zonasoul.com.br/produtos/prato-istanbul-agop-traditional-dark-ride-22/"),
    ("ride-21-traditional-dark", "https://zonasoul.com.br/produtos/prato-istanbul-agop-traditional-dark-ride-21/"),
    ("clap-stack-set", "https://zonasoul.com.br/produtos/istanbul-agop-traditional-clap-stack-set-11-13-15-csfx/"),
    ("trash-19-xist-ion-dark", "https://zonasoul.com.br/produtos/prato-istanbul-agop-xist-ion-dark-trash-19-xidt19/"),
]

baquetas_urls = [
    ("5a-hickory", "https://zonasoul.com.br/produtos/wincent-baqueta-5a-w-5a/"),
    ("5a-black", "https://zonasoul.com.br/produtos/wincent-baqueta-5a-black-w-5acb-hickory/"),
    ("5axl", "https://zonasoul.com.br/produtos/wincent-baqueta-5axl-w-5axl/"),
    ("5a-precision", "https://zonasoul.com.br/produtos/wincent-baqueta-5a-precision-w-5ap/"),
    ("5a-jazz", "https://zonasoul.com.br/produtos/wincent-baqueta-5a-jazz-w-5aj/"),
    ("5b-hickory", "https://zonasoul.com.br/produtos/wincent-baqueta-5b-w-5b-hickory/"),
    ("55f-hickory", "https://zonasoul.com.br/produtos/wincent-baqueta-55f-w-55f-hickory/"),
    ("7a-hickory", "https://zonasoul.com.br/produtos/wincent-baqueta-7a-w-7a/"),
    ("rock-hickory", "https://zonasoul.com.br/produtos/wincent-baqueta-rock-w-rock-hickory/"),
    ("daniel-erlandsson", "https://zonasoul.com.br/produtos/daniel-erlandsson-signature-w-des/"),
    ("mikkey-dee", "https://zonasoul.com.br/produtos/mikkey-dee-signature-w-mds/"),
    ("el-pana-timbale", "https://zonasoul.com.br/produtos/el-pana-timbale-sticks-w-tbep-2-pares-hickory/"),
]

def download_product_image(filename, url, output_dir):
    """Baixa a imagem principal de um produto"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, timeout=10, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Procura pela imagem principal do produto
        img = soup.find('img', {'class': 'wp-post-image'})
        if not img:
            img = soup.find('img', {'itemprop': 'image'})
        if not img:
            # Tenta qualquer imagem grande
            img = soup.find('img')
        
        if img and img.get('src'):
            img_url = urljoin(url, img['src'])
            print(f"Baixando {filename}: {img_url}")
            
            img_response = requests.get(img_url, timeout=10, headers=headers)
            img_response.raise_for_status()
            
            # Salva a imagem
            ext = img_url.split('.')[-1].split('?')[0]
            filepath = os.path.join(output_dir, f"{filename}.{ext}")
            
            with open(filepath, 'wb') as f:
                f.write(img_response.content)
            
            print(f"✓ Salvo: {filepath}")
            return True
        else:
            print(f"✗ Imagem não encontrada em {url}")
            return False
            
    except Exception as e:
        print(f"✗ Erro ao baixar {filename}: {e}")
        return False

# Criar diretórios
os.makedirs('/home/jonathan/vintage-drumshop/public/produtos/pratos', exist_ok=True)
os.makedirs('/home/jonathan/vintage-drumshop/public/produtos/baquetas', exist_ok=True)

print("=== BAIXANDO IMAGENS DOS PRATOS ===")
for filename, url in produtos_urls:
    download_product_image(filename, url, '/home/jonathan/vintage-drumshop/public/produtos/pratos')
    time.sleep(1)  # Pausa para não sobrecarregar o servidor

print("\n=== BAIXANDO IMAGENS DAS BAQUETAS ===")
for filename, url in baquetas_urls:
    download_product_image(filename, url, '/home/jonathan/vintage-drumshop/public/produtos/baquetas')
    time.sleep(1)

print("\n✓ Download concluído!")
