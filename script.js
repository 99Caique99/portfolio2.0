        gsap.registerPlugin(ScrollTrigger);

        const rolagemSuave = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        rolagemSuave.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((tempo) => rolagemSuave.raf(tempo * 1000));
        gsap.ticker.lagSmoothing(0);

        let c = 45;
        
        function drawMask(){
            document.documentElement.style.setProperty('--direction', c++ + 'deg');
            requestAnimationFrame(drawMask);
        }
        requestAnimationFrame(drawMask);

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
            gsap.fromTo(".animacao-entrada-textos", 
                { x: -80, opacity: 0, rotateY: 10 }, 
                { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: "power4.out", clearProps: "all", scrollTrigger: { trigger: "#secao-inicio", start: "top 80%" } }
            );
            gsap.fromTo(".animacao-entrada-imagem", 
                { x: 80, opacity: 0, rotateY: -10 }, 
                { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: "power4.out", delay: 0.1, clearProps: "all", scrollTrigger: { trigger: "#secao-inicio", start: "top 80%" } }
            );
            
            gsap.fromTo(".animacao-revelar-manifesto", 
                { x: -80, opacity: 0, rotateY: 10 }, 
                { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: "power4.out", clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 85%" } }
            );
            gsap.fromTo(".animacao-revelar-manifesto-dir", 
                { x: 80, opacity: 0, rotateY: -10 }, 
                { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: "power4.out", delay: 0.1, clearProps: "all", scrollTrigger: { trigger: "#secao-manifesto", start: "top 85%" } }
            );

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
   
    
    function sanitizeUrl(url) {
      if (typeof url !== 'string') return '';
      const trimmedUrl = url.trim().toLowerCase();
      if (trimmedUrl.startsWith('javascript:') || trimmedUrl.startsWith('data:') || trimmedUrl.startsWith('vbscript:')) { return '#'; }
      return url;
    }
    
    const getBrowserLanguage = () => {
      if (!window?.navigator?.language?.split('-')[1]) { return window?.navigator?.language?.toUpperCase(); }
      return window?.navigator?.language?.split('-')[1];
    };
    
    function getDefaultCountryProgram(defaultCountryCode, smsProgramData) {
      if (!smsProgramData || smsProgramData.length === 0) { return null; }
      const browserLanguage = getBrowserLanguage();
      if (browserLanguage) {
        const foundProgram = smsProgramData.find((program) => program?.countryCode === browserLanguage);
        if (foundProgram) { return foundProgram; }
      }
      if (defaultCountryCode) {
        const foundProgram = smsProgramData.find((program) => program?.countryCode === defaultCountryCode);
        if (foundProgram) { return foundProgram; }
      }
      return smsProgramData[0];
    }
    
    function updateSmsLegalText(countryCode, fieldName) {
      if (!countryCode || !fieldName) { return; }
      const programs = window?.MC?.smsPhoneData?.programs;
      if (!programs || !Array.isArray(programs)) { return; }
      const program = programs.find(program => program?.countryCode === countryCode);
      if (!program || !program.requiredTemplate) { return; }
      const legalTextElement = document.querySelector('#legal-text-' + fieldName);
      if (!legalTextElement) { return; }
      
      const divRegex = new RegExp('</?[div][^>]*>', 'gi');
      const template = program.requiredTemplate.replace(divRegex, '');
      
      legalTextElement.textContent = '';
      const parts = template.split(/(<a href=".*?" target=".*?">.*?<\/a>)/g);
      parts.forEach(function(part) {
        if (!part) { return; }
        const anchorMatch = part.match(/<a href="(.*?)" target="(.*?)">(.*?)<\/a>/);
        if (anchorMatch) {
          const linkElement = document.createElement('a');
          linkElement.href = sanitizeUrl(anchorMatch[1]);
          linkElement.target = sanitizeHtml(anchorMatch[2]);
          linkElement.textContent = sanitizeHtml(anchorMatch[3]);
          legalTextElement.appendChild(linkElement);
        } else {
          legalTextElement.appendChild(document.createTextNode(part));
        }
      });
    }
    
    function generateDropdownOptions(smsProgramData) {
      if (!smsProgramData || smsProgramData.length === 0) { return ''; }
      var programs = false ? smsProgramData.filter(function(p, i, arr) { return arr.findIndex(function(q) { return q.countryCode === p.countryCode; }) === i; }) : smsProgramData;
      return programs.map(program => {
        const countryName = getCountryName(program.countryCode);
        const callingCode = program.countryCallingCode || '';
        const sanitizedCountryCode = sanitizeHtml(program.countryCode || '');
        const sanitizedCountryName = sanitizeHtml(countryName || '');
        const sanitizedCallingCode = sanitizeHtml(callingCode || '');
        return '<option value="' + sanitizedCountryCode + '">' + sanitizedCountryName + ' ' + sanitizedCallingCode + '</option>';
      }).join('');
    }
    
    function getCountryName(countryCode) {
      if (window.MC?.smsPhoneData?.smsProgramDataCountryNames && Array.isArray(window.MC.smsPhoneData.smsProgramDataCountryNames)) {
        for (let i = 0; i < window.MC.smsPhoneData.smsProgramDataCountryNames.length; i++) {
          if (window.MC.smsPhoneData.smsProgramDataCountryNames[i].code === countryCode) {
            return window.MC.smsPhoneData.smsProgramDataCountryNames[i].name;
          }
        }
      }
      return countryCode;
    }
    
    function getDefaultPlaceholder(countryCode) {
      if (!countryCode || typeof countryCode !== 'string') { return '+1 000 000 0000'; }
      var mockPlaceholders = [
        { countryCode: 'US', placeholder: '+1 000 000 0000', helpText: 'Include the US country code +1 before the phone number' },
        { countryCode: 'GB', placeholder: '+44 0000 000000', helpText: 'Include the GB country code +44 before the phone number' },
        { countryCode: 'BR', placeholder: '+55 00 00000-0000', helpText: 'Inclua o código BR +55 antes do número' }
      ];
      const selectedPlaceholder = mockPlaceholders.find(function(item) { return item && item.countryCode === countryCode; });
      return selectedPlaceholder ? selectedPlaceholder.placeholder : mockPlaceholders[0].placeholder;
    }
    
    function updatePlaceholder(countryCode, fieldName) {
      if (!countryCode || !fieldName) { return; }
      const phoneInput = document.querySelector('#mce-' + fieldName);
      if (!phoneInput) { return; }
      const placeholder = getDefaultPlaceholder(countryCode);
      if (placeholder) { phoneInput.placeholder = placeholder; }
    }
    
    function updateCountryCodeInstruction(countryCode, fieldName) {
      updatePlaceholder(countryCode, fieldName);
    }
    
    function initializeSmsPhoneDropdown(fieldName) {
      if (!fieldName || typeof fieldName !== 'string') { return; }
      const dropdown = document.querySelector('#country-select-' + fieldName);
      const displayFlag = document.querySelector('#flag-display-' + fieldName);
      if (!dropdown || !displayFlag) { return; }
    
      const smsPhoneData = window.MC?.smsPhoneData;
      if (smsPhoneData && smsPhoneData.programs && Array.isArray(smsPhoneData.programs)) {
        dropdown.innerHTML = generateDropdownOptions(smsPhoneData.programs);
      }
    
      const defaultProgram = getDefaultCountryProgram(smsPhoneData?.defaultCountryCode, smsPhoneData?.programs);
      if (defaultProgram && defaultProgram.countryCode) {
        dropdown.value = defaultProgram.countryCode;
        const flagSpan = displayFlag?.querySelector('#flag-emoji-' + fieldName);
        if (flagSpan) {
          flagSpan.textContent = getCountryUnicodeFlag(defaultProgram.countryCode);
          flagSpan.setAttribute('aria-label', sanitizeHtml(defaultProgram.countryCode) + ' flag');
        }
        updateSmsLegalText(defaultProgram.countryCode, fieldName);
        updatePlaceholder(defaultProgram.countryCode, fieldName);
        updateCountryCodeInstruction(defaultProgram.countryCode, fieldName);
      }
      
      var smsField = Object.values({"EMAIL":{"name":"EMAIL","label":"Endereço de e-mail","type":"email","required":true},"FNAME":{"name":"FNAME","label":"Nome","type":"text","required":false},"LNAME":{"name":"LNAME","label":"Sobrenome","type":"text","required":false},"PHONE":{"name":"PHONE","label":"Telefone","type":"phone","required":false}}).find(function(f) { return f.name === fieldName && f.type === 'smsphone'; });
      var isRequired = smsField ? smsField.required : false;
      var shouldAppendCountryCode = true;
      
      var phoneInput = document.querySelector('#mce-' + fieldName);
      if (phoneInput && defaultProgram.countryCallingCode && shouldAppendCountryCode) {
        phoneInput.value = defaultProgram.countryCallingCode;
      }
    
      displayFlag?.addEventListener('click', function(e) { dropdown.focus(); });
    
      dropdown?.addEventListener('change', function() {
        const selectedCountry = this.value;
        if (!selectedCountry || typeof selectedCountry !== 'string') { return; }
        const flagSpan = displayFlag?.querySelector('#flag-emoji-' + fieldName);
        if (flagSpan) {
          flagSpan.textContent = getCountryUnicodeFlag(selectedCountry);
          flagSpan.setAttribute('aria-label', sanitizeHtml(selectedCountry) + ' flag');
        }
        const selectedProgram = window.MC?.smsPhoneData?.programs.find(function(program) { return program && program.countryCode === selectedCountry; });
        if (phoneInput && selectedProgram.countryCallingCode && shouldAppendCountryCode) {
          phoneInput.value = selectedProgram.countryCallingCode;
        }
        updateSmsLegalText(selectedCountry, fieldName);
        updatePlaceholder(selectedCountry, fieldName);
        updateCountryCodeInstruction(selectedCountry, fieldName);
      });
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      const smsPhoneFields = document.querySelectorAll('[id^="country-select-"]');
      smsPhoneFields.forEach(function(dropdown) {
        const fieldName = dropdown?.id.replace('country-select-', '');
        initializeSmsPhoneDropdown(fieldName);
      });
    });
