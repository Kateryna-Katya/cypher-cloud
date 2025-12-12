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
        // Проверяем, загрузилась ли библиотека SplitType
        try {
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
        } catch (e) {
            console.warn("SplitType not loaded or error:", e);
        }
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
    const policyCheckbox = document.getElementById('policy');
    const policyLabel = document.querySelector('label[for="policy"]');

    // Разрешаем вводить только цифры в телефон
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Убираем ошибку чекбокса при клике
    policyCheckbox.addEventListener('change', () => {
        if (policyCheckbox.checked) {
            policyLabel.parentElement.style.color = ''; // Сброс цвета
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        // Очистка классов ошибок
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
        policyLabel.parentElement.style.color = '';

        // --- ВАЛИДАЦИЯ ПОЛЕЙ ---
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const captcha = document.getElementById('captcha');

        // Имя
        if (name.value.trim().length < 2) {
            name.parentElement.classList.add('error');
            isValid = false;
        }
        
        // Email
        if (!email.value.includes('@') || !email.value.includes('.')) {
            email.parentElement.classList.add('error');
            isValid = false;
        }

        // Телефон (минимум 10 цифр)
        if (phoneInput.value.length < 10) {
            phoneInput.parentElement.classList.add('error');
            isValid = false;
        }

        // Капча (5 + 3 = 8)
        if (captcha.value.trim() !== '8') {
            captcha.parentElement.classList.add('error');
            alert('Неверный ответ в примере'); // Доп. уведомление
            isValid = false;
        }

        // Чекбокс (Самое важное!)
        if (!policyCheckbox.checked) {
            isValid = false;
            // Подсвечиваем текст красным
            policyLabel.parentElement.style.color = '#ef4444'; 
            // Можно добавить легкую анимацию тряски, если нужно, но цвет достаточно заметен
        }

        // --- ОТПРАВКА ---
        if (isValid) {
            // Имитация отправки
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            // Блокируем кнопку
            btn.innerHTML = '<span>Отправка...</span><i data-lucide="loader-2" class="spin"></i>';
            btn.disabled = true;
            lucide.createIcons(); // Обновляем иконку загрузки

            setTimeout(() => {
                form.reset();
                btn.innerHTML = '<span>Отправлено!</span><i data-lucide="check"></i>';
                lucide.createIcons();
                
                statusDiv.innerHTML = '<span style="color: #4ade80">Заявка принята. Мы свяжемся с вами.</span>';
                
                // Возврат кнопки в исходное состояние
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    statusDiv.innerHTML = '';
                    lucide.createIcons(); // Возвращаем иконку send
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