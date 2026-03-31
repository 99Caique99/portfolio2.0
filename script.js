        gsap.registerPlugin(ScrollTrigger);

        const rolagemSuave = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        rolagemSuave.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((tempo) => rolagemSuave.raf(tempo * 1000));
        gsap.ticker.lagSmoothing(0);

        /* ==========================================================================
           1. MÁSCARA ROTATIVA (O SEU EFEITO ORIGINAL)
           ========================================================================== */
        let c = 45;
        
        function drawMask(){
            document.documentElement.style.setProperty('--direction', c++ + 'deg');
            requestAnimationFrame(drawMask);
        }
        requestAnimationFrame(drawMask);

        /* ==========================================================================
           2. CURSOR E HOVER CARDS (LÓGICA LIMPA)
           ========================================================================== */
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

        if(window.innerWidth >= 1024) {
            const cursorPrincipal = document.createElement('div');
            cursorPrincipal.className = 'cursor-principal ponto-rastro';
            document.body.appendChild(cursorPrincipal);

            const trilha = [];
            const numeroDePontos = 8;
            for(let i = 0; i < numeroDePontos; i++) {
                let div = document.createElement('div');
                div.className = 'ponto-rastro';
                div.style.opacity = 1 - (i / numeroDePontos);
                div.style.transform = `scale(${1 - (i / numeroDePontos)})`;
                div.style.zIndex = 99990 - i;
                document.body.appendChild(div);
                trilha.push({el: div, x: window.innerWidth/2, y: window.innerHeight/2});
            }

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX; mouseY = e.clientY;
                gsap.to(cursorPrincipal, { x: mouseX, y: mouseY, duration: 0 });
            });

            gsap.ticker.add(() => {
                let currentX = mouseX;
                let currentY = mouseY;
                for(let i = 0; i < numeroDePontos; i++) {
                    trilha[i].x += (currentX - trilha[i].x) * 0.3;
                    trilha[i].y += (currentY - trilha[i].y) * 0.3;
                    gsap.set(trilha[i].el, { x: trilha[i].x, y: trilha[i].y });
                    currentX = trilha[i].x;
                    currentY = trilha[i].y;
                }
            });

            document.addEventListener('mouseover', (e) => {
                if (e.target.closest('.elemento-com-interacao') || e.target.closest('a') || e.target.closest('button') || e.target.closest('.titulo-principal span')) {
                    cursorPrincipal.classList.add('hover-ativo');
                    trilha.forEach(p => p.el.style.display = 'none');
                } else {
                    cursorPrincipal.classList.remove('hover-ativo');
                    trilha.forEach(p => p.el.style.display = 'block');
                }
            });
            
            document.querySelectorAll('.cartao-premium').forEach(cartao => {
                cartao.addEventListener('mousemove', (e) => {
                    const rect = cartao.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const xp = (x / rect.width) * 100;
                    const yp = (y / rect.height) * 100;
                    
                    cartao.style.setProperty('--mouse-x', `${x}px`);
                    cartao.style.setProperty('--mouse-y', `${y}px`);
                    cartao.style.setProperty('--mouse-xp', `${xp}%`);
                    cartao.style.setProperty('--mouse-yp', `${yp}%`);
                    
                    const rotX = ((y - (rect.height / 2)) / (rect.height / 2)) * -8; 
                    const rotY = ((x - (rect.width / 2)) / (rect.width / 2)) * 8;
                    
                    gsap.to(cartao, { "--rot-x": `${rotX}deg`, "--rot-y": `${rotY}deg`, duration: 0.3, ease: "power2.out" });
                });
                
                cartao.addEventListener('mouseenter', () => cartao.style.setProperty('--hover-opacity', `1`));
                cartao.addEventListener('mouseleave', () => {
                    cartao.style.setProperty('--hover-opacity', `0`);
                    gsap.to(cartao, { "--rot-x": `0deg`, "--rot-y": `0deg`, duration: 0.8, ease: "elastic.out(1, 0.3)" });
                });
            });
            
            document.querySelectorAll('.botao-premium').forEach(botao => {
                botao.addEventListener('mousemove', (e) => {
                    const rect = botao.getBoundingClientRect();
                    botao.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    botao.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                });
            });
        }

        /* --------------------------------------------------------------------------
           3. ANIMAÇÕES DE ENTRADA SIMPLES E ESTÁVEIS (GSAP)
           -------------------------------------------------------------------------- */
        let animacoesMidia = gsap.matchMedia();

        animacoesMidia.add("(min-width: 1025px)", () => {
            gsap.fromTo(".animacao-entrada-textos", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", clearProps: "all" });
            gsap.fromTo(".animacao-entrada-imagem", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.2, clearProps: "all" });
            
            gsap.fromTo(".animacao-revelar-manifesto", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 75%" } });
            gsap.fromTo(".animacao-revelar-manifesto-dir", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.2, clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 75%" } });
            
            gsap.fromTo(".animacao-entrada-cartao", { y: 100, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, stagger: 0.15, ease: "power4.out", clearProps: "all", scrollTrigger: { trigger: ".layout-grade-cartoes", start: "top 80%" } });
            
            gsap.fromTo(".titulo-animado-rodape, .botao-animado-rodape", { y: 80, opacity: 0 }, { scrollTrigger: { trigger: "footer", start: "top 90%" }, y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.1, clearProps: "all" });

            let proxy = { skew: 0 }, skewSetter = gsap.quickSetter(".elemento-skew", "skewY", "deg"), clamp = gsap.utils.clamp(-5, 5);
            ScrollTrigger.create({
                onUpdate: (self) => {
                    let skew = clamp(self.getVelocity() / -400);
                    if (Math.abs(skew) > Math.abs(proxy.skew)) {
                        proxy.skew = skew;
                        gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
                    }
                }
            });
        });

        animacoesMidia.add("(max-width: 1024px)", () => {
            // Efeito alternado ESQUERDA/DIREITA ao rolar para hero
            gsap.fromTo(".animacao-entrada-textos", 
                { x: -80, opacity: 0, rotateY: 10 }, 
                { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: "power4.out", clearProps: "all", scrollTrigger: { trigger: "#secao-inicio", start: "top 80%" } }
            );
            gsap.fromTo(".animacao-entrada-imagem", 
                { x: 80, opacity: 0, rotateY: -10 }, 
                { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: "power4.out", delay: 0.1, clearProps: "all", scrollTrigger: { trigger: "#secao-inicio", start: "top 80%" } }
            );
            
            // Efeito alternado ESQUERDA/DIREITA ao rolar para manifesto
            gsap.fromTo(".animacao-revelar-manifesto", 
                { x: -80, opacity: 0, rotateY: 10 }, 
                { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: "power4.out", clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 85%" } }
            );
            gsap.fromTo(".animacao-revelar-manifesto-dir", 
                { x: 80, opacity: 0, rotateY: -10 }, 
                { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: "power4.out", delay: 0.1, clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 85%" } }
            );

            // Efeito alternado ESQUERDA/DIREITA para cards ao rolar
            gsap.fromTo(".animacao-entrada-cartao:nth-child(1)", 
                { x: -80, opacity: 0, rotateY: 10, scale: 0.95 }, 
                { x: 0, opacity: 1, rotateY: 0, scale: 1, duration: 1.2, ease: "power3.out", clearProps: "all", scrollTrigger: { trigger: ".layout-grade-cartoes", start: "top 85%" } }
            );
            gsap.fromTo(".animacao-entrada-cartao:nth-child(2)", 
                { x: 80, opacity: 0, rotateY: -10, scale: 0.95 }, 
                { x: 0, opacity: 1, rotateY: 0, scale: 1, duration: 1.2, delay: 0.15, ease: "power3.out", clearProps: "all", scrollTrigger: { trigger: ".layout-grade-cartoes", start: "top 85%" } }
            );
            gsap.fromTo(".animacao-entrada-cartao:nth-child(3)", 
                { x: -80, opacity: 0, rotateY: 10, scale: 0.95 }, 
                { x: 0, opacity: 1, rotateY: 0, scale: 1, duration: 1.2, delay: 0.3, ease: "power3.out", clearProps: "all", scrollTrigger: { trigger: ".layout-grade-cartoes", start: "top 85%" } }
            );

            gsap.fromTo(".titulo-animado-rodape, .botao-animado-rodape", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.1, clearProps: "all", scrollTrigger: { trigger: "footer", start: "top 95%" } });
        });

        let direcaoAnimacao = 1;
        const trilhaMarquee = document.querySelector(".trilha-marquee");
        if (trilhaMarquee) {
            const widthTexto = trilhaMarquee.offsetWidth / 2;
            gsap.set(trilhaMarquee, { x: 0 });

            const tlMarquee = gsap.to(trilhaMarquee, {
                x: `-=${widthTexto}`, duration: 15, ease: "none", repeat: -1,
                modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % widthTexto) }
            });

            ScrollTrigger.create({
                onUpdate: (self) => {
                    if(self.direction !== direcaoAnimacao) {
                        direcaoAnimacao = self.direction;
                        gsap.to(tlMarquee, { timeScale: direcaoAnimacao * 1.5, duration: 0.5, overwrite: true });
                    }
                }
            });
        }

        const textoManifesto = document.querySelector(".texto-revelacao-scroll");
        if (textoManifesto) {
            gsap.to(textoManifesto, { backgroundPosition: "0% 0%", ease: "none", scrollTrigger: { trigger: "#secao-manifesto", start: "top 70%", end: "center center", scrub: true } });
        }

