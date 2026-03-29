        gsap.registerPlugin(ScrollTrigger);

        const rolagemSuave = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        rolagemSuave.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((tempo) => rolagemSuave.raf(tempo * 1000));
        gsap.ticker.lagSmoothing(0);

        /* --------------------------------------------------------------------------
           1. CURSOR LIQUID TRAIL E INTERATIVIDADE (DESKTOP)
           -------------------------------------------------------------------------- */
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

            let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX; mouseY = e.clientY;
                gsap.to(cursorPrincipal, { x: mouseX, y: mouseY, duration: 0 });
                
                // Movimento do Fundo Interativo
                const orbesFundo = document.querySelector('.orbes-luminosos-fundo');
                if (orbesFundo) {
                    const xPercent = (mouseX / window.innerWidth) * 100;
                    const yPercent = (mouseY / window.innerHeight) * 100;
                    orbesFundo.style.setProperty('--bg-x', `${xPercent}%`);
                    orbesFundo.style.setProperty('--bg-y', `${yPercent}%`);
                }
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
                if (e.target.closest('.elemento-com-interacao') || e.target.closest('a') || e.target.closest('button')) {
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
                    
                    const rotX = ((y - (rect.height / 2)) / (rect.height / 2)) * -10; 
                    const rotY = ((x - (rect.width / 2)) / (rect.width / 2)) * 10;
                    
                    gsap.to(cartao, {
                        "--rot-x": `${rotX}deg`,
                        "--rot-y": `${rotY}deg`,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                cartao.addEventListener('mouseenter', () => cartao.style.setProperty('--hover-opacity', `1`));
                cartao.addEventListener('mouseleave', () => {
                    cartao.style.setProperty('--hover-opacity', `0`);
                    gsap.to(cartao, {
                        "--rot-x": `0deg`,
                        "--rot-y": `0deg`,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.3)"
                    });
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
           2. ANIMAÇÕES GSAP PREMIUM E ENTRADAS EM ZIGUEZAGUE
           -------------------------------------------------------------------------- */
        let animacoesMidia = gsap.matchMedia();

        animacoesMidia.add("(min-width: 1025px)", () => {
            // Hero: Texto da esquerda, Imagem da direita
            gsap.fromTo(".animacao-entrada-textos", 
                { x: -100, opacity: 0, filter: "blur(10px)" }, 
                { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power4.out", clearProps: "all" }
            );
            gsap.fromTo(".animacao-entrada-imagem", 
                { x: 100, opacity: 0, filter: "blur(10px)" }, 
                { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power4.out", delay: 0.2, clearProps: "all" }
            );
            
            // Manifesto: Texto e Imagem em Ziguezague
            gsap.fromTo(".animacao-revelar-manifesto", 
                { x: -100, opacity: 0, filter: "blur(10px)" }, 
                { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power4.out", clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 75%" } }
            );
            gsap.fromTo(".animacao-revelar-manifesto-dir", 
                { x: 100, opacity: 0, filter: "blur(10px)" }, 
                { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power4.out", delay: 0.2, clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 75%" } }
            );
            
            // Portfólio Cartões (Ziguezague: Esquerda, Direita, Esquerda)
            gsap.utils.toArray(".animacao-entrada-cartao").forEach((cartao, indice) => {
                let direcaoX = indice % 2 === 0 ? -120 : 120; // 0 = esq, 1 = dir, 2 = esq
                gsap.fromTo(cartao, 
                    { x: direcaoX, y: 50, opacity: 0, rotationY: direcaoX > 0 ? 15 : -15, filter: "blur(10px)" }, 
                    { x: 0, y: 0, opacity: 1, rotationY: 0, filter: "blur(0px)", duration: 1.5, ease: "power4.out", clearProps: "all", scrollTrigger: { trigger: cartao, start: "top 80%" } }
                );
            });
            
            gsap.fromTo(".titulo-animado-rodape, .botao-animado-rodape", 
                { y: 80, opacity: 0 }, 
                { scrollTrigger: { trigger: "footer", start: "top 90%" }, y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.1, clearProps: "all" }
            );

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
            // Hero Mobile: Esquerda e Direita
            gsap.fromTo(".animacao-entrada-textos", { x: -80, opacity: 0, filter: "blur(10px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power4.out", clearProps: "all" });
            gsap.fromTo(".animacao-entrada-imagem", { x: 80, opacity: 0, filter: "blur(10px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power4.out", delay: 0.2, clearProps: "all" });
            
            gsap.fromTo(".animacao-revelar-manifesto", { x: -80, opacity: 0, filter: "blur(10px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power4.out", clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 80%" } });
            gsap.fromTo(".animacao-revelar-manifesto-dir", { x: 80, opacity: 0, filter: "blur(10px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power4.out", delay: 0.2, clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 80%" } });

            // Cartões Mobile em Ziguezague: Esquerda, Direita, Esquerda
            gsap.utils.toArray(".animacao-entrada-cartao").forEach((cartao, indice) => {
                let direcaoX = indice % 2 === 0 ? -100 : 100;
                gsap.fromTo(cartao, 
                    { x: direcaoX, opacity: 0, filter: "blur(10px)", rotationY: direcaoX > 0 ? 10 : -10 }, 
                    { x: 0, opacity: 1, filter: "blur(0px)", rotationY: 0, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity,filter", scrollTrigger: { trigger: cartao, start: "top 85%" } }
                );
            });

            gsap.fromTo(".titulo-animado-rodape, .botao-animado-rodape", { y: 50, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out", stagger: 0.1, clearProps: "all", scrollTrigger: { trigger: "footer", start: "top 95%" } });
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

        /* --------------------------------------------------------------------------
           3. WEBGL/CANVAS: REDE NEURAL REATIVA
           -------------------------------------------------------------------------- */
        const elementoCanvas = document.getElementById('canvas-rede-neural');
        const contextoCanvas = elementoCanvas.getContext('2d');
        let larguraJanela, alturaJanela;
        
        let particulasCanvas = [];
        const maxParticulas = window.innerWidth > 768 ? 80 : 40;
        const distanciaConexao = 150;
        
        let mouseXCanvas = -1000, mouseYCanvas = -1000;

        function redimensionarCanvas() { 
            larguraJanela = elementoCanvas.width = window.innerWidth; 
            alturaJanela = elementoCanvas.height = window.innerHeight; 
        }
        window.addEventListener('resize', redimensionarCanvas); 
        redimensionarCanvas();

        document.addEventListener('mousemove', (e) => {
            mouseXCanvas = e.clientX; mouseYCanvas = e.clientY;
        });

        class ParticulaNeural {
            constructor() {
                this.x = Math.random() * larguraJanela;
                this.y = Math.random() * alturaJanela;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.tamanho = Math.random() * 1.5 + 0.5;
            }
            atualizar() {
                this.x += this.vx; this.y += this.vy;
                let dx = mouseXCanvas - this.x, dy = mouseYCanvas - this.y;
                let distanciaParaMouse = Math.sqrt(dx * dx + dy * dy);
                if (distanciaParaMouse < 150) { this.x -= dx * 0.015; this.y -= dy * 0.015; }
                if (this.x < 0) this.x = larguraJanela;
                if (this.x > larguraJanela) this.x = 0;
                if (this.y < 0) this.y = alturaJanela;
                if (this.y > alturaJanela) this.y = 0;
            }
            desenhar() {
                contextoCanvas.beginPath();
                contextoCanvas.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
                contextoCanvas.fillStyle = 'rgba(0, 240, 255, 0.5)';
                contextoCanvas.fill();
            }
        }

        function iniciarParticulas() {
            particulasCanvas = [];
            for (let i = 0; i < maxParticulas; i++) particulasCanvas.push(new ParticulaNeural());
        }

        function animarRedeNeural() {
            contextoCanvas.clearRect(0, 0, larguraJanela, alturaJanela);
            for (let i = 0; i < particulasCanvas.length; i++) {
                particulasCanvas[i].atualizar(); particulasCanvas[i].desenhar();
                for (let j = i; j < particulasCanvas.length; j++) {
                    let dx = particulasCanvas[i].x - particulasCanvas[j].x;
                    let dy = particulasCanvas[i].y - particulasCanvas[j].y;
                    let distancia = Math.sqrt(dx * dx + dy * dy);
                    if (distancia < distanciaConexao) {
                        contextoCanvas.beginPath();
                        contextoCanvas.strokeStyle = `rgba(0, 240, 255, ${0.15 - distancia / distanciaConexao * 0.15})`;
                        contextoCanvas.lineWidth = 1;
                        contextoCanvas.moveTo(particulasCanvas[i].x, particulasCanvas[i].y);
                        contextoCanvas.lineTo(particulasCanvas[j].x, particulasCanvas[j].y);
                        contextoCanvas.stroke();
                    }
                }
                let dxMouse = particulasCanvas[i].x - mouseXCanvas;
                let dyMouse = particulasCanvas[i].y - mouseYCanvas;
                let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distMouse < 200) {
                    contextoCanvas.beginPath();
                    contextoCanvas.strokeStyle = `rgba(112, 0, 255, ${0.3 - distMouse / 200 * 0.3})`;
                    contextoCanvas.lineWidth = 1.5;
                    contextoCanvas.moveTo(particulasCanvas[i].x, particulasCanvas[i].y);
                    contextoCanvas.lineTo(mouseXCanvas, mouseYCanvas);
                    contextoCanvas.stroke();
                }
            }
            requestAnimationFrame(animarRedeNeural);
        }

        iniciarParticulas(); animarRedeNeural();
