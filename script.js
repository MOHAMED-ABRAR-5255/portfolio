document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 2. Sticky Navbar & Active Link highlighting on Scroll
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Set CSS variable for scroll-based parallax
        document.documentElement.style.setProperty('--scroll-y', window.scrollY);

        // Sticky Navbar effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Scroll Animations using Intersection Observer
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animating once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // 4. Custom Cursor Logic
    const cursorDot = document.querySelector('[data-cursor-dot]');
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Parallax variables for background shapes
        const x = (posX / window.innerWidth) - 0.5;
        const y = (posY / window.innerHeight) - 0.5;
        document.documentElement.style.setProperty('--mouse-x', x);
        document.documentElement.style.setProperty('--mouse-y', y);
    });


    // 5. Modal and Slideshow Logic
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.view-project-btn');
    const slideshowImg = document.getElementById('slideshow-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const slideIndicatorsContainer = document.getElementById('slide-indicators');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');

    let currentImages = [];
    let currentSlideIndex = 0;

    function updateSlideshow() {
        if(currentImages.length === 0) return;
        // Fade out
        slideshowImg.classList.add('fade');
        
        setTimeout(() => {
            slideshowImg.src = currentImages[currentSlideIndex];
            slideshowImg.classList.remove('fade');
        }, 300);

        // Update indicators
        const indicators = slideIndicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((ind, index) => {
            if (index === currentSlideIndex) ind.classList.add('active');
            else ind.classList.remove('active');
        });
    }

    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get data
            const imagesStr = btn.getAttribute('data-images');
            currentImages = imagesStr ? imagesStr.split(',') : [];
            currentSlideIndex = 0;
            
            // Get project title and description from the card
            const card = btn.closest('.project-card');
            const title = card.querySelector('h3').innerText;
            const descHtml = card.querySelector('.project-list').outerHTML;
            
            // Populate modal
            modalTitle.innerText = title;
            modalDesc.innerHTML = descHtml;
            
            // Setup indicators
            slideIndicatorsContainer.innerHTML = '';
            currentImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('indicator');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentSlideIndex = index;
                    updateSlideshow();
                });
                slideIndicatorsContainer.appendChild(dot);
            });

            if (currentImages.length > 0) {
                slideshowImg.src = currentImages[0];
            } else {
                slideshowImg.src = '';
                slideshowImg.alt = 'No images provided yet. Name images projX-imgY.jpg';
            }

            modal.classList.add('active');
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentImages.length === 0) return;
        currentSlideIndex = (currentSlideIndex - 1 + currentImages.length) % currentImages.length;
        updateSlideshow();
    });

    nextBtn.addEventListener('click', () => {
        if (currentImages.length === 0) return;
        currentSlideIndex = (currentSlideIndex + 1) % currentImages.length;
        updateSlideshow();
    });

    // 6. 3D Tilt Effect for Project Cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; 
        });
    });

});
