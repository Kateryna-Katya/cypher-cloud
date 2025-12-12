document.addEventListener("DOMContentLoaded", () => {
    // 1. Инициализация Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP Setup
    gsap.registerPlugin(ScrollTrigger);

    // 2. Мобильное меню
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const links = document.querySelectorAll('.header__link');

    const toggleMenu = () => {
        nav.classList.toggle('is-open');
        burger.classList.toggle('is-active');
    };

    burger.addEventListener('click', toggleMenu);
    links.forEach(link => link.addEventListener('click', () => {
        if(nav.classList.contains('is-open')) toggleMenu();
    }));

    // 3. Анимации (GSAP)
    
    // HERO: Split Type Animation
    if (document.querySelector('#hero-text')) {
        const typeSplit = new SplitType('#hero-text', { types: 'lines, words, chars' });
        
        const tl = gsap.timeline();
        
        tl.from(typeSplit.chars, {
            y: 100,
            opacity: 0,
            rotation: 10,
            duration: 0.8,
            stagger: 0.02,
            ease: "back.out(1.7)"
        })
        .from('.hero__desc', { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from('.hero__actions', { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from('.hero__visual', { opacity: 0, scale: 0.8, duration: 0.8 }, "-=0.6");
    }

    // GENERAL: Fade Up Sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.fromTo(section.children, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                }
            }
        );
    });

    // 4. Форма контактов (Валидация + AJAX)
    const form = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    const statusDiv = document.getElementById('formStatus');

    // Разрешаем вводить только цифры в телефон
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        // Очистка ошибок
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

        // Простая валидация
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const captcha = document.getElementById('captcha');

        if (name.value.length < 2) {
            name.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (!email.value.includes('@') || !email.value.includes('.')) {
            email.parentElement.classList.add('error');
            isValid = false;
        }

        if (phoneInput.value.length < 10) {
            phoneInput.parentElement.classList.add('error');
            isValid = false;
        }

        // Проверка капчи (5 + 3 = 8)
        if (captcha.value !== '8') {
            alert('Ошибка в решении примера');
            captcha.parentElement.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            // Имитация отправки
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                form.reset();
                btn.innerHTML = 'Отправлено!';
                statusDiv.innerHTML = '<span style="color: #4ade80">Спасибо! Мы свяжемся с вами.</span>';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    statusDiv.innerHTML = '';
                }, 3000);
            }, 1500);
        }
    });

    // 5. Cookie Popup
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookie');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('is-visible');
        }, 2000);
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookiePopup.classList.remove('is-visible');
    });

    // 6. Инициализация иконок
    lucide.createIcons();
});