import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const header = document.querySelector("#site-header");
const progress = document.querySelector("#scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

function updateScrollState() {
    const scrollTop = window.scrollY;
    const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
        header.classList.toggle("is-scrolled", scrollTop > 24);
    }

    if (progress && pageHeight > 0) {
        progress.style.transform = `scaleX(${scrollTop / pageHeight})`;
    }
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
        });
    });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const delay = entry.target.dataset.delay || 0;
                entry.target.style.transitionDelay = `${delay}ms`;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
}

if (!reducedMotion) {
    document.querySelectorAll(".magnetic").forEach((element) => {
        element.addEventListener("pointermove", (event) => {
            const bounds = element.getBoundingClientRect();
            const x = event.clientX - bounds.left - bounds.width / 2;
            const y = event.clientY - bounds.top - bounds.height / 2;

            element.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });

        element.addEventListener("pointerleave", () => {
            element.style.transform = "";
        });
    });

    document.querySelectorAll("[data-tilt]").forEach((element) => {
        element.addEventListener("pointermove", (event) => {
            const bounds = element.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;

            const rotateX = ((y / bounds.height) - 0.5) * -5;
            const rotateY = ((x / bounds.width) - 0.5) * 5;

            element.style.transform =
                `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        element.addEventListener("pointerleave", () => {
            element.style.transform = "";
        });
    });
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".site-nav a");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "is-active",
                    link.getAttribute("href") === `#${entry.target.id}`
                );
            });
        });
    },
    {
        rootMargin: "-35% 0px -55% 0px",
    }
);

sections.forEach((section) => sectionObserver.observe(section));

function createThreeScene() {
    const canvas = document.querySelector("#scene-canvas");

    if (!canvas) {
        return;
    }

    try {
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.z = 7;

        const group = new THREE.Group();
        scene.add(group);

        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xd7fa4a,
            wireframe: true,
            transparent: true,
            opacity: 0.48,
        });

        const core = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.45, 2),
            coreMaterial
        );

        group.add(core);

        const innerCore = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.92, 1),
            new THREE.MeshBasicMaterial({
                color: 0x6ae4ff,
                wireframe: true,
                transparent: true,
                opacity: 0.25,
            })
        );

        group.add(innerCore);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(2.15, 0.014, 8, 160),
            new THREE.MeshBasicMaterial({
                color: 0xff6b35,
                transparent: true,
                opacity: 0.72,
            })
        );

        ring.rotation.x = Math.PI / 2.2;
        ring.rotation.y = Math.PI / 6;
        group.add(ring);

        const secondRing = new THREE.Mesh(
            new THREE.TorusGeometry(2.55, 0.009, 8, 160),
            new THREE.MeshBasicMaterial({
                color: 0x6ae4ff,
                transparent: true,
                opacity: 0.36,
            })
        );

        secondRing.rotation.x = -Math.PI / 3;
        secondRing.rotation.z = Math.PI / 5;
        group.add(secondRing);

        const particleCount = 850;
        const particlePositions = new Float32Array(particleCount * 3);

        for (let index = 0; index < particleCount; index += 1) {
            const radius = 3.2 + Math.random() * 2.8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            particlePositions[index * 3] =
                radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[index * 3 + 1] =
                radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[index * 3 + 2] =
                radius * Math.cos(phi);
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(particlePositions, 3)
        );

        const particles = new THREE.Points(
            particleGeometry,
            new THREE.PointsMaterial({
                color: 0xb6c6bc,
                size: 0.018,
                transparent: true,
                opacity: 0.7,
                sizeAttenuation: true,
            })
        );

        scene.add(particles);

        const floatingNodes = new THREE.Group();

        [
            [2.2, 1.35, 0.2],
            [-2.1, -0.9, 0.4],
            [1.8, -1.55, -0.2],
            [-1.7, 1.6, -0.7],
        ].forEach(([x, y, z]) => {
            const node = new THREE.Mesh(
                new THREE.SphereGeometry(0.06, 12, 12),
                new THREE.MeshBasicMaterial({
                    color: 0xff6b35,
                    transparent: true,
                    opacity: 0.9,
                })
            );

            node.position.set(x, y, z);
            floatingNodes.add(node);
        });

        scene.add(floatingNodes);

        let pointerX = 0;
        let pointerY = 0;

        window.addEventListener("pointermove", (event) => {
            pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
            pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
        });

        function resize() {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            if (!width || !height) {
                return;
            }

            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        window.addEventListener("resize", resize);
        resize();

        const clock = new THREE.Clock();

        function render() {
            const elapsed = clock.getElapsedTime();

            group.rotation.y = elapsed * 0.12 + pointerX * 0.08;
            group.rotation.x = Math.sin(elapsed * 0.25) * 0.08 + pointerY * 0.05;

            core.rotation.z = elapsed * 0.08;
            innerCore.rotation.y = -elapsed * 0.18;
            ring.rotation.z = elapsed * 0.08;
            secondRing.rotation.y = -elapsed * 0.05;

            particles.rotation.y = elapsed * 0.015;
            particles.rotation.x = pointerY * 0.03;

            floatingNodes.rotation.y = elapsed * 0.08;

            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        render();
    } catch (error) {
        document.body.classList.add("scene-fallback");
    }
}

if (!reducedMotion) {
    createThreeScene();
} else {
    document.body.classList.add("reduced-motion");
}