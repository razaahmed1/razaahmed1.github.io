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
        if (typeof gsap !== 'undefined') {
            gsap.set('.v2-preloader-logo', { y: 20, opacity: 0 });
            gsap.set('.v2-preloader-student-tag', { opacity: 0, y: 10 });
            
            const mainTl = gsap.timeline();
            mainTl.to('.v2-preloader-logo', { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 })
                  .to('.v2-preloader-student-tag', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.5");
                  
            gsap.to('.v2-preloader-glow', { opacity: 1, duration: 2, scale: 1.2, repeat: -1, yoyo: true });
        }

        const progress = document.querySelector('.loader-progress');
        const progressText = document.querySelector('.loader-percent');
        const preloaderStatus = document.querySelector('.v2-preloader-status');
        const statuses = [
            "Accessing Core Architecture",
            "Initialising Neural Pathways",
            "Synthesizing Diamond Particles",
            "Syncing Bio-Metric Handlers",
            "Ahmed Raza: Verification Final"
        ];
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
            const pl = new THREE.PointLight(0x6366f1, 3);
            pl.position.set(5, 5, 5);
            scene.add(pl);
            scene.add(new THREE.AmbientLight(0xffffff, 0.6));
            camera.position.z = 6;

            let isVisible = true;
            const observer = new IntersectionObserver(([entry]) => {
                isVisible = entry.isIntersecting;
            }, { threshold: 0.1 });
            observer.observe(container);

            function animate() {
                requestAnimationFrame(animate);
                if (!isVisible) return;
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
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}