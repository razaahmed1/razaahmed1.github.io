const init = () => {
    console.log("Diamond Tier: JavaScript Initializing...");

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    const scrollProgress = document.getElementById('v2-scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        });
    }

    const magneticElements = document.querySelectorAll('.v2-hero-cta a, .v2-filter-btn, .glass-card');
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            if (typeof gsap !== 'undefined') gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
    });

    const preloader = document.getElementById('v2-preloader');
    if (preloader) {
        const progress = document.querySelector('.loader-progress');
        const progressText = document.querySelector('.loader-percent');
        const preloaderStatus = document.querySelector('.v2-preloader-status');
        const statuses = ["Initialising System", "Loading Assets", "Searching for Diamonds", "Ahmed Raza: UG SE"];
        let loadProgress = 0;
        const interval = setInterval(() => {
            loadProgress += Math.random() * 15;
            const statusIdx = Math.min(Math.floor((loadProgress/100)*statuses.length), statuses.length-1);
            if(preloaderStatus) preloaderStatus.textContent = statuses[statusIdx];
            if(progress) progress.style.width = `${loadProgress}%`;
            if(progressText) progressText.textContent = `${Math.floor(loadProgress)}%`;
            if (loadProgress >= 100) { clearInterval(interval); setTimeout(hidePreloader, 500); }
        }, 150);
    }

    function hidePreloader() {
        if (!preloader) return;
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({ onComplete: () => { 
                preloader.style.display = 'none'; 
                if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
                initHeroAnimations();
            }});
            tl.to('.loader-line, .loader-percent', { opacity: 0, y: -10, duration: 0.5 })
              .to('.v2-preloader-logo', { scale: 1.2, opacity: 0, filter: 'blur(20px)', duration: 1, ease: 'power4.inOut' })
              .to(preloader, { opacity: 0, duration: 1.5, ease: 'power2.inOut' }, "-=0.5");
        } else {
            preloader.style.display = 'none';
        }
    }

    function initThreeHero() {
        try {
            const container = document.getElementById('three-container');
            if (!container || typeof THREE === 'undefined') return;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            const cubes = [];
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.8, roughness: 0.2 });
            for(let i=0; i<12; i++) {
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*12, (Math.random()-0.5)*5);
                scene.add(cube);
                cubes.push(cube);
            }
            scene.add(new THREE.PointLight(0x6366f1, 2).set(2, 3, 4));
            scene.add(new THREE.AmbientLight(0xffffff, 0.5));
            camera.position.z = 6;
            function animate() {
                requestAnimationFrame(animate);
                cubes.forEach(c => { c.rotation.x += 0.005; c.rotation.y += 0.005; });
                renderer.render(scene, camera);
            }
            animate();
            window.addEventListener('scroll', () => { camera.position.y = -window.scrollY * 0.002; });
        } catch(e) { console.error("Three.js error:", e); }
    }
    initThreeHero();

    function initHeroAnimations() {
        if (typeof gsap === 'undefined') return;
        gsap.from('.v2-hero-title span span', { y: 200, opacity: 0, duration: 1.5, stagger: 0.2, ease: 'power4.out' });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        document.querySelectorAll('.v2-reveal').forEach(el => {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
                opacity: 1, y: 0, duration: 1, ease: 'power2.out'
            });
        });
    }

    function initPhysicsSkills() {
        const container = document.getElementById('skills-container');
        if (!container || typeof Matter === 'undefined') return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && container.offsetWidth > 0) {
                observer.disconnect();
                startPhysics();
            }
        }, { threshold: 0.1 });
        observer.observe(container);

        function startPhysics() {
            try {
                const { Engine, World, Bodies, Events, Mouse, MouseConstraint, Runner } = Matter;
                const engine = Engine.create({ gravity: { x: 0, y: 0 } });
                const width = container.offsetWidth;
                const height = container.offsetHeight;

                const skillsData = [
                    { name: 'HTML', icon: 'fab fa-html5', color: '#f06529', glow: 'rgba(240, 101, 41, 0.2)' },
                    { name: 'CSS', icon: 'fab fa-css3-alt', color: '#2965f1', glow: 'rgba(41, 101, 241, 0.2)' },
                    { name: 'JS', icon: 'fab fa-js', color: '#f0db4f', glow: 'rgba(240, 219, 79, 0.2)' },
                    { name: 'PHP', icon: 'fab fa-php', color: '#8993be', glow: 'rgba(137, 147, 190, 0.2)' },
                    { name: 'Laravel', icon: 'fab fa-laravel', color: '#ff2d20', glow: 'rgba(255, 45, 32, 0.2)' },
                    { name: 'MySQL', icon: 'fas fa-database', color: '#00758f', glow: 'rgba(0, 117, 143, 0.2)' },
                    { name: 'Git', icon: 'fab fa-git-alt', color: '#f1502f', glow: 'rgba(241, 80, 47, 0.2)' },
                    { name: 'Python', icon: 'fab fa-python', color: '#3776ab', glow: 'rgba(55, 118, 171, 0.2)' },
                    { name: 'AI', icon: 'fas fa-brain', color: '#00ffff', glow: 'rgba(0, 255, 255, 0.2)' },
                    { name: 'OS', icon: 'fas fa-laptop-code', color: '#526cf4', glow: 'rgba(82, 108, 244, 0.2)' },
                    { name: 'Crypto', icon: 'fas fa-key', color: '#c0c0c0', glow: 'rgba(192, 192, 192, 0.2)' },
                    { name: 'Security', icon: 'fas fa-shield-halved', color: '#00ff41', glow: 'rgba(0, 255, 65, 0.2)' }
                ];

                const walls = [
                    Bodies.rectangle(width/2, -50, width, 100, { isStatic: true }),
                    Bodies.rectangle(width/2, height+50, width, 100, { isStatic: true }),
                    Bodies.rectangle(-50, height/2, 100, height, { isStatic: true }),
                    Bodies.rectangle(width+50, height/2, 100, height, { isStatic: true })
                ];
                World.add(engine.world, walls);

                const ballSize = 95;
                const balls = skillsData.map(skill => {
                    const ball = Bodies.circle(Math.random()*width, Math.random()*height, ballSize/2, {
                        restitution: 0.9, friction: 0.005, frictionAir: 0.012
                    });
                    const el = document.createElement('div');
                    el.className = 'skill-ball';
                    el.style.setProperty('--skill-color', skill.color);
                    el.style.setProperty('--glow-color', skill.glow);
                    el.innerHTML = `<div class="skill-inner-glow"></div><i class="${skill.icon}"></i><div class="skill-tooltip">${skill.name}</div>`;
                    container.appendChild(el);
                    ball.element = el;
                    return ball;
                });
                World.add(engine.world, balls);

                Events.on(engine, 'afterUpdate', () => {
                    balls.forEach(ball => {
                        const { x, y } = ball.position;
                        const v = ball.velocity;
                        // 3D Tilt calculation based on velocity
                        const tiltX = v.y * 3;
                        const tiltY = -v.x * 3;
                        ball.element.style.transform = `translate(${x - ballSize/2}px, ${y - ballSize/2}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                    });
                });

                const mouseConstraint = MouseConstraint.create(engine, {
                    mouse: Mouse.create(container),
                    constraint: { stiffness: 0.2, render: { visible: false } }
                });
                World.add(engine.world, mouseConstraint);
                Runner.run(Runner.create(), engine);
            } catch (e) { console.error("Physics Error:", e); }
        }
    }
    initPhysicsSkills();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}