const init = () => {
    try {
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

    function initThreeGlobalBackground() {
        try {
            const container = document.getElementById('three-container');
            if (!container || typeof THREE === 'undefined') return;
            
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.innerHTML = '';
            container.appendChild(renderer.domElement);

            const cubes = [];
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x6366f1, 
                metalness: 0.9, 
                roughness: 0.1,
                transparent: true,
                opacity: 0.6
            });

            // Volumetric population (increased for heavy VIP feel)
            const cubeCount = window.innerWidth < 768 ? 25 : 60;
            for(let i = 0; i < cubeCount; i++) {
                const cube = new THREE.Mesh(geometry, material);
                // Wider spread for full-page coverage
                cube.position.set(
                    (Math.random() - 0.5) * 20, 
                    (Math.random() - 0.5) * 30, // Increased Y spread
                    (Math.random() - 0.5) * 10
                );
                cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
                cube.scale.setScalar(Math.random() * 0.5 + 0.2);
                scene.add(cube);
                cubes.push({
                    mesh: cube,
                    speed: Math.random() * 0.005 + 0.002,
                    rotSpeed: Math.random() * 0.01
                });
            }

            const pl = new THREE.PointLight(0x6366f1, 15);
            pl.position.set(10, 10, 10);
            scene.add(pl);
            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            camera.position.z = 8;

            function animate() {
                requestAnimationFrame(animate);
                cubes.forEach(c => {
                    c.mesh.rotation.x += c.rotSpeed;
                    c.mesh.rotation.y += c.rotSpeed;
                    // Subtle floating motion
                    c.mesh.position.y += Math.sin(Date.now() * 0.001 * c.speed) * 0.01;
                });
                renderer.render(scene, camera);
            }
            animate();

            // Smooth Scroll Parallax for "Full Heavy" experience
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                camera.position.y = -scrollY * 0.0015;
                camera.position.x = Math.sin(scrollY * 0.001) * 0.5;
            });

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        } catch(e) { console.error("Three.js Global Error:", e); }
    }
    function initPortrait3D() {
        const container = document.getElementById('portrait-3d-portal');
        const fallback = container ? container.querySelector('.portrait-fallback') : null;
        
        if (!container || typeof THREE === 'undefined') {
            console.warn("Portrait Container or Three.js missing. Showing fallback.");
            if(fallback) fallback.style.opacity = '1';
            return;
        }

        try {
            const width = container.clientWidth || 400; // Default fallback width
            const height = container.clientHeight || 400;
            console.log("Initializing Portrait 3D:", { width, height });

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
            camera.position.z = 2.5;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            // Chroma Key Shader (Improved robust syntax)
            const vertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;

            const fragmentShader = `
                uniform sampler2D map;
                varying vec2 vUv;
                void main() {
                    vec4 color = texture2D(map, vUv);
                    // Blue exclusion logic
                    float blueStrength = color.b - max(color.r, color.g);
                    float alpha = 1.0;
                    if(blueStrength > 0.05) {
                        alpha = clamp(1.0 - (blueStrength * 8.0), 0.0, 1.0);
                    }
                    gl_FragColor = vec4(color.rgb, alpha * color.a);
                }
            `;

            const loader = new THREE.TextureLoader();
            loader.load('ahmed.webp', 
                (texture) => {
                    console.log("Portrait Texture Loaded Successfully.");
                    const material = new THREE.ShaderMaterial({
                        uniforms: { map: { value: texture } },
                        vertexShader,
                        fragmentShader,
                        transparent: true,
                        side: THREE.DoubleSide
                    });

                    // Use Sphere or Plane? Let's stick to Plane with high detail
                    const geometry = new THREE.PlaneGeometry(2, 2);
                    const mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);

                    let targetRotationX = 0;
                    let targetRotationY = 0;

                    window.addEventListener('mousemove', (e) => {
                        const rect = container.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / width - 0.5;
                        const y = (e.clientY - rect.top) / height - 0.5;
                        if (Math.abs(x) < 2 && Math.abs(y) < 2) {
                            targetRotationY = x * 0.4;
                            targetRotationX = y * 0.4;
                        }
                    });

                    function animate() {
                        requestAnimationFrame(animate);
                        mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.1;
                        mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.1;
                        renderer.render(scene, camera);
                    }
                    animate();
                },
                undefined,
                (err) => {
                    console.error("Texture Load Error:", err);
                    if(fallback) fallback.style.opacity = '1';
                }
            );

        } catch(e) { 
            console.error("Critical Portrait 3D Error:", e);
            if(fallback) fallback.style.opacity = '1';
        }
    }

    try { initThreeGlobalBackground(); } catch(e) { console.error("BG Fail:", e); }
    try { initPortrait3D(); } catch(e) { console.error("Portrait Fail:", e); }

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
    } catch(err) {
        console.error("Global Init Error:", err);
        const p = document.querySelector('.preloader');
        if(p) p.style.display = 'none';
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}