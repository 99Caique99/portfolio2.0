        gsap.registerPlugin(ScrollTrigger);

        const rolagemSuave = new Lenis({ 
            duration: 1.5, 
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
        
        rolagemSuave.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((tempo) => rolagemSuave.raf(tempo * 1000));
        gsap.ticker.lagSmoothing(0);

        if(window.innerWidth >= 1024) {
            const elementoCursor = document.querySelector('.cursor-ponto');
            const elementoSeguidor = document.querySelector('.cursor-aura');
            
            let posicaoMouseX = window.innerWidth / 2;
            let posicaoMouseY = window.innerHeight / 2;
            let posicaoSeguidorX = posicaoMouseX;
            let posicaoSeguidorY = posicaoMouseY;
            let cursorEstaVisivel = false;

            document.addEventListener('mousemove', (evento) => {
                if (!cursorEstaVisivel) {
                    elementoCursor.classList.remove('oculto');
                    elementoSeguidor.classList.remove('oculto');
                    cursorEstaVisivel = true;
                }
                posicaoMouseX = evento.clientX; 
                posicaoMouseY = evento.clientY;
                gsap.to(elementoCursor, { x: posicaoMouseX, y: posicaoMouseY, duration: 0, ease: "none" });
            });

            gsap.ticker.add(() => {
                posicaoSeguidorX += (posicaoMouseX - posicaoSeguidorX) * 0.15;
                posicaoSeguidorY += (posicaoMouseY - posicaoSeguidorY) * 0.15;
                gsap.set(elementoSeguidor, { x: posicaoSeguidorX, y: posicaoSeguidorY });
            });

            document.addEventListener('mouseover', (evento) => {
                if (evento.target.closest('.elemento-com-interacao') || evento.target.closest('a') || evento.target.closest('button')) {
                    elementoCursor.classList.add('hover-ativo');
                    elementoSeguidor.classList.add('hover-ativo');
                } else {
                    elementoCursor.classList.remove('hover-ativo');
                    elementoSeguidor.classList.remove('hover-ativo');
                }
            });

            document.addEventListener('mouseleave', () => {
                elementoCursor.classList.add('oculto');
                elementoSeguidor.classList.add('oculto');
                cursorEstaVisivel = false;
            });
        }

        let animacoesMidia = gsap.matchMedia();

        animacoesMidia.add("(min-width: 1025px)", () => {
            
            gsap.fromTo(".texto-cinetico", 
                { opacity: 0, scale: 1.5, filter: "blur(20px)" }, 
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2.5, ease: "power3.out", stagger: 0.2 }
            );

            gsap.fromTo(".animacao-entrada-esq-mobile", 
                { y: 100, opacity: 0, filter: "blur(15px)", rotationX: -15 }, 
                { y: 0, opacity: 1, filter: "blur(0px)", rotationX: 0, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: "#secao-inicio", start: "top 80%" } }
            );

            gsap.fromTo(".animacao-entrada-dir-mobile", 
                { x: 100, opacity: 0, filter: "blur(20px)", scale: 0.8 }, 
                { x: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 2, ease: "expo.out", delay: 0.2, scrollTrigger: { trigger: "#secao-inicio", start: "top 80%" } }
            );

            gsap.utils.toArray("#secao-manifesto .animacao-revelar-manifesto").forEach((elemento, indice) => {
                gsap.fromTo(elemento, 
                    { y: 100, opacity: 0, filter: "blur(15px)", scale: 0.95 }, 
                    { y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 1.5, delay: indice * 0.2, ease: "power4.out", scrollTrigger: { trigger: "#secao-manifesto", start: "top 75%" } }
                );
            });
            
            gsap.fromTo(".animacao-entrada-cartao", 
                { y: 150, opacity: 0, rotationY: 20, rotationX: 20, scale: 0.8, filter: "blur(10px)" }, 
                { y: 0, opacity: 1, rotationY: 0, rotationX: 0, scale: 1, filter: "blur(0px)", duration: 1.5, stagger: 0.2, ease: "expo.out", scrollTrigger: { trigger: "#secao-grade-projetos", start: "top 80%" } }
            );
            
            gsap.fromTo(".titulo-animado-rodape", 
                { y: 80, opacity: 0, scale: 0.8, rotationX: 30, filter: "blur(15px)" }, 
                { scrollTrigger: { trigger: "footer", start: "top 90%" }, y: 0, opacity: 1, scale: 1, rotationX: 0, filter: "blur(0px)", duration: 1.5, ease: "back.out(1.2)", stagger: 0.1 }
            );
            
            gsap.fromTo(".botao-animado-rodape", 
                { y: 100, scale: 0.5, rotationX: 60, opacity: 0, filter: "blur(10px)" }, 
                { scrollTrigger: { trigger: "footer", start: "top 95%" }, y: 0, scale: 1, rotationX: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, stagger: 0.15, ease: "elastic.out(1, 0.7)", clearProps: "all" }
            );
        });

        animacoesMidia.add("(max-width: 1024px)", () => {
            
            gsap.fromTo(".texto-cinetico", 
                { opacity: 0, scale: 1.2, filter: "blur(15px)" }, 
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "power3.out", stagger: 0.2 }
            );

            gsap.fromTo(".animacao-entrada-esq-mobile",
                { x: -100, opacity: 0, filter: "blur(15px)", rotationY: -20 },
                { x: 0, opacity: 1, filter: "blur(0px)", rotationY: 0, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: "#secao-inicio", start: "top 85%" } }
            );
            
            gsap.fromTo(".animacao-entrada-dir-mobile",
                { x: 100, opacity: 0, filter: "blur(15px)", rotationY: 20 },
                { x: 0, opacity: 1, filter: "blur(0px)", rotationY: 0, duration: 1.5, ease: "expo.out", delay: 0.2, scrollTrigger: { trigger: "#secao-inicio", start: "top 85%" } }
            );

            gsap.utils.toArray("#secao-manifesto .animacao-revelar-manifesto").forEach((elemento, indice) => {
                let direcaoX = indice === 0 ? -100 : 100;
                let rotacaoY = indice === 0 ? -20 : 20;
                gsap.fromTo(elemento,
                    { x: direcaoX, opacity: 0, filter: "blur(15px)", rotationY: rotacaoY },
                    { x: 0, opacity: 1, filter: "blur(0px)", rotationY: 0, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: "#secao-manifesto", start: "top 80%" } }
                );
            });

            gsap.utils.toArray(".animacao-entrada-cartao").forEach((cartao, indice) => {
                let direcaoX = indice % 2 === 0 ? -100 : 100;
                let rotacaoY = indice % 2 === 0 ? -15 : 15;
                gsap.fromTo(cartao,
                    { x: direcaoX, opacity: 0, filter: "blur(10px)", rotationY: rotacaoY },
                    { x: 0, opacity: 1, filter: "blur(0px)", rotationY: 0, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: cartao, start: "top 85%" } }
                );
            });

            gsap.fromTo(".titulo-animado-rodape",
                { y: 50, opacity: 0, filter: "blur(10px)", scale: 0.9 },
                { y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 1.2, ease: "power4.out", stagger: 0.1, scrollTrigger: { trigger: "footer", start: "top 95%" } }
            );

            gsap.utils.toArray(".botao-animado-rodape").forEach((botao, indice) => {
                let direcaoX = indice % 2 === 0 ? 100 : -100;
                gsap.fromTo(botao,
                    { x: direcaoX, opacity: 0, filter: "blur(10px)" },
                    { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: botao, start: "top 95%" } }
                );
            });
        });

        gsap.to(".t-esquerda", { xPercent: -30, ease: "none", scrollTrigger: { trigger: "#secao-inicio", start: "top top", end: "bottom top", scrub: 1 } });
        gsap.to(".t-direita", { xPercent: 30, ease: "none", scrollTrigger: { trigger: "#secao-inicio", start: "top top", end: "bottom top", scrub: 1 } });

        gsap.to(".conteiner-imagem-manifesto", {
            yPercent: 15, ease: "none",
            scrollTrigger: { trigger: "#secao-manifesto", start: "top bottom", end: "bottom top", scrub: true }
        });

        /* EFEITO DE LUZ (REVELAÇÃO BRANCA) NO TEXTO DO MANIFESTO */
        const textoManifesto = document.querySelector(".texto-revelacao-scroll");
        if (textoManifesto) {
            gsap.to(textoManifesto, { 
                backgroundPosition: "0% 0%", ease: "none", 
                scrollTrigger: { trigger: "#secao-manifesto", start: "top 70%", end: "center center", scrub: true } 
            });
        }

        if(window.innerWidth >= 1024) {
            
            document.querySelectorAll('[data-mouse-magnetico]').forEach(botao => {
                botao.addEventListener('mousemove', (evento) => {
                    const retangulo = botao.getBoundingClientRect();
                    const calculoX = (evento.clientX - retangulo.left - retangulo.width / 2) * 0.4;
                    const calculoY = (evento.clientY - retangulo.top - retangulo.height / 2) * 0.4;
                    gsap.to(botao, { x: calculoX, y: calculoY, duration: 0.3, ease: "power2.out" });
                });
                botao.addEventListener('mouseleave', () => { 
                    gsap.to(botao, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" }); 
                });
            });

            document.querySelectorAll('[data-efeito-inclinacao]').forEach(cartao => {
                cartao.addEventListener('mousemove', (evento) => {
                    const retangulo = cartao.getBoundingClientRect();
                    const posicaoX = evento.clientX - retangulo.left;
                    const posicaoY = evento.clientY - retangulo.top;
                    const centroX = retangulo.width / 2;
                    const centroY = retangulo.height / 2;
                    
                    const rotacaoX = ((posicaoY - centroY) / centroY) * -8; 
                    const rotacaoY = ((posicaoX - centroX) / centroX) * 8;
                    
                    gsap.to(cartao, { rotateX: rotacaoX, rotateY: rotacaoY, duration: 0.5, ease: "power2.out" });
                });
                cartao.addEventListener('mouseleave', () => {
                    gsap.to(cartao, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
                });
            });
        }

        const elementoCanvas = document.getElementById('canvas-rede-neural');
        const contextoCanvas = elementoCanvas.getContext('2d');
        let larguraJanela, alturaJanela, tempoCorrido = 0;
        
        function redimensionarCanvas() { 
            larguraJanela = elementoCanvas.width = window.innerWidth; 
            alturaJanela = elementoCanvas.height = window.innerHeight; 
        }
        window.addEventListener('resize', redimensionarCanvas); 
        redimensionarCanvas();

        function desenharOndasNeurais() {
            contextoCanvas.clearRect(0, 0, larguraJanela, alturaJanela);
            
            for(let nivel = 0; nivel < 5; nivel++) {
                contextoCanvas.beginPath(); 
                contextoCanvas.lineWidth = 2;
                
                let opacidadeCalculada = 0.1 - (nivel * 0.01);
                contextoCanvas.strokeStyle = nivel % 2 === 0 
                    ? `rgba(74, 147, 198, ${opacidadeCalculada})` 
                    : `rgba(184, 217, 245, ${opacidadeCalculada})`;
                
                for(let eixoX = 0; eixoX < larguraJanela; eixoX += 20) {
                    let eixoY = (alturaJanela / 2) 
                              + Math.sin((eixoX * 0.005) + tempoCorrido + nivel) * 150 
                              + Math.sin((eixoX * 0.01) - tempoCorrido + nivel) * 100;
                    
                    if(eixoX === 0) contextoCanvas.moveTo(eixoX, eixoY); 
                    else contextoCanvas.lineTo(eixoX, eixoY);
                }
                contextoCanvas.stroke();
            }
            
            tempoCorrido += 0.02; 
            requestAnimationFrame(desenharOndasNeurais);
        }
        
        desenharOndasNeurais();