document.addEventListener('DOMContentLoaded', () => {

    // SCRIPT PARA AS CAIXAS DE ACESSO RÁPIDO (Mantido da versão anterior)
    const caixasAcesso = document.querySelectorAll('.acesso-rapido');
    caixasAcesso.forEach(caixa => {
        caixa.addEventListener('mouseover', () => {
            caixa.style.transform = 'scale(1.1)';
            caixa.style.transition = 'transform 0.2s ease-in-out';
            caixa.style.cursor = 'pointer';
        });
        caixa.addEventListener('mouseout', () => {
            caixa.style.transform = 'scale(1)';
            caixa.style.transition = 'transform 0.2s ease-in-out';
        });
        caixa.addEventListener('click', () => {
            const link = caixa.getAttribute('data-link');
            if (link) {
                window.location.href = link;
            }
        });
    });

    // SCRIPT PARA MÚLTIPLOS CARROSSÉIS DE IMAGENS E PRODUTOS
    // Esta função inicializa um carrossel específico
    function initializeCarousel(carouselContainer) {
        const carouselSlide = carouselContainer.querySelector('.carousel-slide');
        const items = Array.from(carouselSlide.children); // Pega todos os filhos (img ou div.produto)
        const prevBtn = carouselContainer.querySelector('.nav-button.prev');
        const nextBtn = carouselContainer.querySelector('.nav-button.next');
        const dotsContainer = carouselContainer.querySelector('.dot-indicators');

        let counter = 0;
        let itemSize = 0; // O tamanho de UM item do carrossel (pode ser imagem ou produto)

        // Função para obter o tamanho do item do carrossel
        function setCarouselItemSize() {
            if (items.length > 0) {
                // Se for o carrossel principal (#events-carousel), o item é a largura total do slide
                if (carouselContainer.classList.contains('main-carousel')) {
                    itemSize = carouselSlide.offsetWidth;
                } else {
                    // Se for um carrossel de produtos (.product-carousel), o item é a div.produto (width + margin)
                    const firstProduct = items[0];
                    const productStyle = window.getComputedStyle(firstProduct);
                    const productWidth = firstProduct.offsetWidth;
                    const productMarginLeft = parseFloat(productStyle.marginLeft);
                    const productMarginRight = parseFloat(productStyle.marginRight);
                    itemSize = productWidth + productMarginLeft + productMarginRight;
                }
                updateCarousel(); // Posiciona o carrossel na imagem/item inicial
            }
        }

        // Criar os pontos de navegação dinamicamente
        if (dotsContainer && items.length > 1) { // Só cria pontos se tiver mais de um item
            dotsContainer.innerHTML = ''; // Limpa pontos existentes antes de recriar
            items.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.dataset.index = index;
                dotsContainer.appendChild(dot);

                dot.addEventListener('click', () => {
                    counter = index;
                    updateCarousel();
                    updateDots();
                });
            });
        }

        const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot')) : [];

        // Função para atualizar a posição do carrossel
        function updateCarousel() {
            if (carouselSlide && itemSize > 0) {
                carouselSlide.style.transform = `translateX(${-itemSize * counter}px)`;
            }
        }

        // Função para atualizar os pontos (marcar o ativo)
        function updateDots() {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[counter]) {
                dots[counter].classList.add('active');
            }
        }

        // Event Listeners para os botões de navegação
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (counter >= items.length - 1) {
                    counter = 0; // Volta para o início (loop infinito)
                } else {
                    counter++;
                }
                updateCarousel();
                updateDots();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (counter <= 0) {
                    counter = items.length - 1; // Vai para o final (loop infinito)
                } else {
                    counter--;
                }
                updateCarousel();
                updateDots();
            });
        }

        // Autoplay (opcional para o carrossel principal, remova ou comente se não quiser)
        // if (carouselContainer.classList.contains('main-carousel') && items.length > 1) {
        //     setInterval(() => {
        //         if (nextBtn) nextBtn.click();
        //     }, 5000); // Muda a cada 5 segundos
        // }

        // Atualiza o tamanho do carrossel ao redimensionar a janela
        window.addEventListener('resize', () => {
            setCarouselItemSize(); // Recalcula o tamanho dos itens
            updateCarousel(); // Reposiciona o carrossel
            updateDots(); // Atualiza os pontos caso a visibilidade mude
        });

        // Chama setCarouselItemSize inicialmente após o DOM carregar e talvez após imagens carregarem
        // Para garantir que o tamanho esteja correto, especialmente para imagens
        const firstItem = items[0];
        if (firstItem && firstItem.tagName === 'IMG' && !firstItem.complete) {
             firstItem.addEventListener('load', setCarouselItemSize);
        } else {
             setCarouselItemSize();
        }

        // Inicializa os pontos na primeira carga
        if (items.length > 0) {
            updateDots();
        }
    }

    // Inicializa TODOS os carrosséis na página
    const allCarousels = document.querySelectorAll('.carousel-container');
    allCarousels.forEach(carousel => {
        initializeCarousel(carousel);
    });

});