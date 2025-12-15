document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ИНИЦИАЛИЗАЦИЯ БИБЛИОТЕК
    // ==========================================

    // Иконки Lucide
    lucide.createIcons();

    // Плавный скролл (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Подключение плагина ScrollTrigger для GSAP
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 2. МОБИЛЬНОЕ МЕНЮ
    // ==========================================
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    const headerBurgerIcon = burger.querySelector('i');

    function toggleMenu() {
        const isActive = mobileMenu.classList.contains('is-active');
        
        if (isActive) {
            // Закрываем
            mobileMenu.classList.remove('is-active');
            headerBurgerIcon.setAttribute('data-lucide', 'menu');
            document.body.style.overflow = ''; // Возвращаем скролл
        } else {
            // Открываем
            mobileMenu.classList.add('is-active');
            headerBurgerIcon.setAttribute('data-lucide', 'x');
            document.body.style.overflow = 'hidden'; // Блокируем скролл
        }
        lucide.createIcons(); // Обновляем иконку (меню/крестик)
    }

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    // Закрываем меню при клике на любую ссылку
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // ==========================================
    // 3. АНИМАЦИИ HERO (SplitType + GSAP)
    // ==========================================
    
    // Разбиваем заголовок на буквы для анимации
    // Проверка на существование элемента, чтобы не было ошибок
    const heroTitleElement = document.querySelector('#heroTitle');
    if (heroTitleElement) {
        const heroTitle = new SplitType('#heroTitle', { types: 'words, chars' });
        
        const tl = gsap.timeline();

        // 1. Анимация букв (вылет снизу с поворотом)
        tl.from(heroTitle.chars, {
            opacity: 0,
            y: 80,
            rotateX: -90,
            stagger: 0.03, // Задержка между буквами
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.2
        })
        // 2. Появление подзаголовка
        .from('.hero__subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6")
        // 3. Появление кнопок
        .from('.hero__btns', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4");
    }

    // Эффект Параллакса для видео-фона
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        gsap.to('.parallax-bg', {
            scrollTrigger: {
                trigger: '.hero',
                start: "top top",
                end: "bottom top",
                scrub: true // Анимация привязана к скроллу
            },
            yPercent: 30, // Сдвигаем видео вниз на 30% медленнее контента
            ease: "none"
        });
    }

    // ==========================================
    // 4. АНИМАЦИИ СЕКЦИЙ (ScrollTrigger)
    // ==========================================
    
    // Общая анимация появления элементов при скролле (Заголовки, карточки)
    const revealElements = document.querySelectorAll('.section-title, .section-desc, .card, .innovation__content, .blog-card');
    
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Начинаем, когда верх элемента на 85% высоты экрана
                toggleActions: "play none none reverse" // Играть при появлении, реверс при уходе вверх
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Специальная анимация для картинки в секции Инноваций (Glitch/Scale)
    const innovationImg = document.querySelector('.innovation__image img');
    if (innovationImg) {
        gsap.from(innovationImg, {
            scrollTrigger: {
                trigger: '.innovation__image',
                start: "top 75%",
            },
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out"
        });
    }

    // ==========================================
    // 5. КОНТАКТНАЯ ФОРМА
    // ==========================================
    const form = document.getElementById('leadForm');
    
    if (form) {
        const phoneInput = document.getElementById('phone');
        const formStatus = document.getElementById('formStatus');
        
        // Генерация капчи (простая математика)
        const captchaLabel = document.getElementById('captchaLabel');
        const captchaInput = document.getElementById('captchaInput');
        
        // Генерируем два случайных числа от 1 до 9
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status'; // Сброс классов

            // 1. Валидация телефона (только цифры, минимум 8 знаков)
            // Разрешаем пробелы, плюсы, скобки, дефисы
            const phoneVal = phoneInput.value.replace(/[^0-9]/g, ''); // Оставляем только цифры для проверки длины
            if (phoneVal.length < 8) {
                phoneInput.closest('.form-group').classList.add('error');
                isValid = false;
            } else {
                phoneInput.closest('.form-group').classList.remove('error');
            }

            // 2. Валидация Капчи
            if (parseInt(captchaInput.value) !== (num1 + num2)) {
                alert('Ошибка в ответе на пример! Пожалуйста, посчитайте снова.');
                captchaInput.value = '';
                captchaInput.focus();
                isValid = false;
            }

            if (isValid) {
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                
                // Визуализация отправки
                btn.textContent = 'Отправка...';
                btn.disabled = true;
                btn.style.opacity = '0.7';

                // Имитация AJAX запроса (1.5 секунды)
                setTimeout(() => {
                    formStatus.textContent = 'Спасибо! Ваша заявка успешно отправлена.';
                    formStatus.classList.add('success');
                    
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    
                    form.reset();
                    
                    // Генерируем новую капчу после отправки
                    const n1 = Math.floor(Math.random() * 9) + 1;
                    const n2 = Math.floor(Math.random() * 9) + 1;
                    captchaLabel.textContent = `Сколько будет ${n1} + ${n2}?`;
                    
                }, 1500);
            }
        });
    }

    // ==========================================
    // 6. COOKIE POPUP
    // ==========================================
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookie');

    if (cookiePopup && acceptBtn) {
        // Проверяем, было ли уже согласие
        if (!localStorage.getItem('cookiesAccepted')) {
            // Показываем через 2 секунды
            setTimeout(() => {
                cookiePopup.style.display = 'block';
                gsap.fromTo(cookiePopup, 
                    { y: 50, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.5 }
                );
            }, 2000);
        }

        acceptBtn.addEventListener('click', () => {
            // Сохраняем согласие
            localStorage.setItem('cookiesAccepted', 'true');
            
            // Анимируем исчезновение
            gsap.to(cookiePopup, {
                y: 50, 
                opacity: 0, 
                duration: 0.5, 
                onComplete: () => {
                    cookiePopup.style.display = 'none';
                }
            });
        });
    }
});