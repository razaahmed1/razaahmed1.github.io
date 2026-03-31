const init = () => {
    console.log("Diamond Tier: JavaScript Initializing...");

    // Register Plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ==========================================
    // 2. SCROLL PROGRESS
    // ==========================================
    const scrollProgress = document.getElementById('v2-scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        });
    }

    // ==========================================
    // 3. MAGNETIC BUTTONS (ENHANCED)
    // ==========================================
    const magneticElements = document.querySelectorAll('.v2-hero-cta a, .v2-filter-btn, .glass-card');
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            }
        });
    });

    // ==========================================
    // 4. PRELOADER (DIAMOND UPGRADE)
    // ==========================================
    const preloader = document.getElementById('v2-preloader');
    const progress = document.querySelector('.loader-progress');
    const progressText = document.querySelector('.loader-percent');
    
    if (preloader) {
        if (typeof gsap !== 'undefined') {
            gsap.set('.v2-preloader-logo', { y: 20, opacity: 0 });
            gsap.set('.v2-preloader-student-tag', { opacity: 0, y: 10 });
            
            const mainTl = gsap.timeline();
            mainTl.to('.v2-preloader-logo', { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 })
                  .to('.v2-preloader-student-tag', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.5");
                  
            gsap.to('.v2-preloader-glow', { opacity: 1, duration: 2, repeat: -1, yoyo: true });
        }

        const preloaderStatus = document.querySelector('.v2-preloader-status');
        const statuses = [
            "Initialising System",
            "Loading Assets",
            "Checking Biometrics",
            "Accessing Diamond Core",
            "Ahmed Raza: UG SE"
        ];

        let loadProgress = 0;
        const interval = setInterval(() => {
            loadProgress += Math.random() * 15;
            
            const statusIdx = Math.min(Math.floor((loadProgress / 100) * statuses.length), statuses.length - 1);
            if(preloaderStatus) preloaderStatus.textContent = statuses[statusIdx];

            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(interval);
                setTimeout(hidePreloader, 500);
            }
            if(progress) progress.style.width = `${loadProgress}%`;
            if(progressText) progressText.textContent = `${Math.floor(loadProgress)}%`;
        }, 150);
    }

    function hidePreloader() {
        if (!preloader) return;
        
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({
                onComplete: () => {
                    preloader.style.display = 'none';
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                    }
                    initHeroAnimations();
                }
            });

            tl.to('.loader-line, .loader-percent', { opacity: 0, y: -10, duration: 0.5 })
              .to('.v2-preloader-logo', { scale: 1.2, opacity: 0, filter: 'blur(20px)', duration: 1, ease: 'power4.inOut' })
              .to(preloader, { 
                    opacity: 0, 
                    duration: 1.5, 
                    ease: 'power2.inOut',
                    backdropFilter: 'blur(0px)'
              }, "-=0.5");
        } else {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        }
    }

    // ==========================================
    // 5. THREE.JS HERO (SCROLL PARALLAX)
    // ==========================================
    let scene, camera, renderer, cubes = [];
    function initThreeHero() {
        try {
            const container = document.getElementById('three-container');
            if (!container || typeof THREE === 'undefined') return;

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const pointLight = new THREE.PointLight(0x6366f1, 2);
            pointLight.position.set(2, 3, 4);
            scene.add(pointLight);

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x6366f1,
                roughness: 0.2,
                metalness: 0.8
            });

            for (let i = 0; i < 12; i++) {
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(
                    (Math.random() - 0.5) * 12,
                    (Math.random() - 0.5) * 12,
                    (Math.random() - 0.5) * 5
                );
                cube.rotation.set(Math.random(), Math.random(), Math.random());
                scene.add(cube);
                cubes.push(cube);
            }

            camera.position.z = 6;

            let isVisible = true;
            const observer = new IntersectionObserver(([entry]) => {
                isVisible = entry.isIntersecting;
            }, { threshold: 0.1 });
            observer.observe(container);

            function animate() {
                requestAnimationFrame(animate);
                if (!isVisible) return;

                cubes.forEach((cube, i) => {
                    cube.rotation.x += 0.005;
                    cube.rotation.y += 0.005;
                    cube.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
                });
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                camera.position.y = -scrollY * 0.002;
            });

        } catch (e) {
            console.error('Three.js Error:', e);
        }
    }
    initThreeHero();

    // ==========================================
    // 6. GSAP REVEALS (SMART)
    // ==========================================
    function initHeroAnimations() {
        if (typeof gsap === 'undefined') return;
        try {
            gsap.from('.v2-hero-title span span', {
                y: 200, opacity: 0, duration: 1.5, stagger: 0.2, ease: 'power4.out'
            });
            gsap.from('.v2-hero-subtitle, .v2-hero-cta', {
                opacity: 0, y: 30, duration: 1.2, stagger: 0.2, delay: 1, ease: 'power3.out'
            });
        } catch (e) {
            console.error("Hero Anim Error:", e);
        }
    }

    // Reveal Logic (Refined)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        document.querySelectorAll('.v2-reveal').forEach(el => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            });
        });
    }

    // Physics Skills
    function initPhysicsSkills() {
        try {
            const container = document.getElementById('skills-container');
            if (!container || typeof Matter === 'undefined') return;

            const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse, Composite } = Matter;
            const engine = Engine.create();
            engine.world.gravity.y = 0;
            
            const width = container.offsetWidth;
            const height = container.offsetHeight;

            const bgCanvas = document.getElementById('skills-canvas-bg');
            if (bgCanvas) {
                const ctx = bgCanvas.getContext('2d');
                bgCanvas.width = width;
                bgCanvas.height = height;

                let particles = [];
                for(let i=0; i<30; i++) {
                    particles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        size: Math.random() * 2 + 0.5,
                        speedX: Math.random() * 0.3 - 0.15,
                        speedY: Math.random() * 0.3 - 0.15
                    });
                }

                let isSkillsVisible = false;
                const skillsObserver = new IntersectionObserver(([entry]) => {
                    isSkillsVisible = entry.isIntersecting;
                }, { threshold: 0.1 });
                skillsObserver.observe(container);

                function drawParticles() {
                    if (!isSkillsVisible) { requestAnimationFrame(drawParticles); return; }
                    ctx.clearRect(0, 0, width, height);
                    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
                    ctx.beginPath();
                    particles.forEach(p => {
                        p.x += p.speedX; p.y += p.speedY;
                        if(p.x < 0) p.x = width; if(p.x > width) p.x = 0;
                        if(p.y < 0) p.y = height; if(p.y > height) p.y = 0;
                        ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    });
                    ctx.fill();
                    requestAnimationFrame(drawParticles);
                }
                drawParticles();
            }

            const skillsData = [
                { name: 'HTML', icon: 'fab fa-html5', color: '#f06529', glow: 'rgba(240, 101, 41, 0.5)', progress: '95%' },
                { name: 'CSS', icon: 'fab fa-css3-alt', color: '#2965f1', glow: 'rgba(41, 101, 241, 0.5)', progress: '90%' },
                { name: 'JS', icon: 'fab fa-js', color: '#f0db4f', glow: 'rgba(240, 219, 79, 0.5)', progress: '85%' },
                { name: 'PHP', icon: 'fab fa-php', color: '#8993be', glow: 'rgba(137, 147, 190, 0.5)', progress: '88%' },
                { name: 'Laravel', icon: 'fab fa-laravel', color: '#ff2d20', glow: 'rgba(255, 45, 32, 0.5)', progress: '80%' },
                { name: 'MySQL', icon: 'fas fa-database', color: '#00758f', glow: 'rgba(0, 117, 143, 0.5)', progress: '82%' },
                { name: 'Git', icon: 'fab fa-git-alt', color: '#f1502f', glow: 'rgba(241, 80, 47, 0.5)', progress: '78%' },
                { name: 'Python', icon: 'fab fa-python', color: '#3776ab', glow: 'rgba(55, 118, 171, 0.5)', progress: '92%' },
                { name: 'AI/ML', icon: 'fas fa-brain', color: '#00ffff', glow: 'rgba(0, 255, 255, 0.5)', progress: '86%' }
            ];

            const wallThickness = 100;
            const walls = [
                Bodies.rectangle(width/2, -wallThickness/2, width, wallThickness, { isStatic: true }),
                Bodies.rectangle(width/2, height + wallThickness/2, width, wallThickness, { isStatic: true }),
                Bodies.rectangle(-wallThickness/2, height/2, wallThickness, height, { isStatic: true }),
                Bodies.rectangle(width + wallThickness/2, height/2, wallThickness, height, { isStatic: true })
            ];
            World.add(engine.world, walls);

            const balls = [];
            const ballSize = 110;

            skillsData.forEach((skill, i) => {
                const ball = Bodies.circle(Math.random()*width, Math.random()*height, ballSize/2, {
                    restitution: 0.8, friction: 0.005, frictionAir: 0.012, render: { fillStyle: 'transparent' }
                });
                const el = document.createElement('div');
                el.className = 'skill-ball';
                el.style.setProperty('--skill-color', skill.color);
                el.style.setProperty('--glow-color', skill.glow);
                el.innerHTML = `
                    <div class="skill-inner-glow"></div>
                    <i class="${skill.icon}"></i>
                    <div class="skill-badge">${skill.progress}</div>
                    <div class="skill-tooltip">${skill.name}</div>
                `;
                container.appendChild(el);
                ball.element = el;
                balls.push(ball);
            });

            World.add(engine.world, balls);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: Mouse.create(container),
                constraint: { stiffness: 0.2, render: { visible: false } }
            });
            World.add(engine.world, mouseConstraint);

            (function update() {
                balls.forEach(ball => {
                    const { x, y } = ball.position;
                    const { angle } = ball;
                    ball.element.style.transform = `translate(${x - ballSize/2}px, ${y - ballSize/2}px) rotate(${angle}rad)`;
                });
                Engine.update(engine);
                requestAnimationFrame(update);
            })();

        } catch (e) {
            console.error('Physics Error:', e);
        }
    }
    setTimeout(initPhysicsSkills, 2000);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}