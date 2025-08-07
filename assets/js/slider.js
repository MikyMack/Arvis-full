let lastScroll = 0;
const whatsappIcon = document.getElementById('whatsappIcon');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  

  if (currentScroll <= 0) {
    whatsappIcon.classList.remove('show');
    return;
  }


  if (currentScroll > lastScroll) {
    whatsappIcon.classList.add('show');
  } 

  else {
    whatsappIcon.classList.remove('show');
  }
  
  lastScroll = currentScroll;
});



        class ArchiBannerSlider {
            constructor() {
                this.currentSlide = 0;
                this.totalSlides = 4;
                this.autoSlideInterval = 2000;
                this.sliderWrapper = document.getElementById('archiSliderWrapper');
                this.prevBtn = document.getElementById('archiPrevBtn');
                this.nextBtn = document.getElementById('archiNextBtn');
                this.navDots = document.querySelectorAll('.archi-dot-indicator');
                this.progressBar = document.getElementById('archiProgressBar');
                this.autoSlideTimer = null;
                this.progressTimer = null;
                
                this.init();
            }
            
            init() {
                this.bindEvents();
                this.startAutoSlide();
                this.updateProgressBar();
            }
            
            bindEvents() {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());
                
                this.navDots.forEach((dot, index) => {
                    dot.addEventListener('click', () => this.goToSlide(index));
                });
                
                // Pause auto-slide on hover
                this.sliderWrapper.parentElement.addEventListener('mouseenter', () => {
                    this.stopAutoSlide();
                });
                
                this.sliderWrapper.parentElement.addEventListener('mouseleave', () => {
                    this.startAutoSlide();
                });
                
                // Touch/swipe support
                let startX = 0;
                let endX = 0;
                
                this.sliderWrapper.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });
                
                this.sliderWrapper.addEventListener('touchend', (e) => {
                    endX = e.changedTouches[0].clientX;
                    this.handleSwipe(startX, endX);
                });
                
                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.prevSlide();
                    if (e.key === 'ArrowRight') this.nextSlide();
                });
            }
            
            handleSwipe(startX, endX) {
                const threshold = 50;
                const diff = startX - endX;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            }
            
            updateSlider() {
                const translateX = -this.currentSlide * 100;
                this.sliderWrapper.style.transform = `translateX(${translateX}%)`;
                
                // Update navigation dots
                this.navDots.forEach((dot, index) => {
                    dot.classList.toggle('archi-active-dot', index === this.currentSlide);
                });
                
                // Trigger animation for content
                const currentPanel = this.sliderWrapper.children[this.currentSlide];
                const content = currentPanel.querySelector('.archi-content-overlay');
                content.style.animation = 'none';
                setTimeout(() => {
                    content.style.animation = 'archi-slide-up 1s ease-out';
                }, 50);
            }
            
            nextSlide() {
                this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
                this.updateSlider();
                this.resetAutoSlide();
            }
            
            prevSlide() {
                this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
                this.updateSlider();
                this.resetAutoSlide();
            }
            
            goToSlide(index) {
                this.currentSlide = index;
                this.updateSlider();
                this.resetAutoSlide();
            }
            
            startAutoSlide() {
                this.stopAutoSlide();
                this.autoSlideTimer = setInterval(() => {
                    this.nextSlide();
                }, this.autoSlideInterval);
                this.startProgressBar();
            }
            
            stopAutoSlide() {
                if (this.autoSlideTimer) {
                    clearInterval(this.autoSlideTimer);
                    this.autoSlideTimer = null;
                }
                this.stopProgressBar();
            }
            
            resetAutoSlide() {
                this.startAutoSlide();
            }
            
            startProgressBar() {
                this.stopProgressBar();
                let progress = 0;
                const increment = 100 / (this.autoSlideInterval / 100);
                
                this.progressTimer = setInterval(() => {
                    progress += increment;
                    if (progress >= 100) {
                        progress = 0;
                    }
                    this.progressBar.style.width = progress + '%';
                }, 100);
            }
            
            stopProgressBar() {
                if (this.progressTimer) {
                    clearInterval(this.progressTimer);
                    this.progressTimer = null;
                }
                this.progressBar.style.width = '0%';
            }
            
            updateProgressBar() {
                this.progressBar.style.width = '0%';
            }
        }
        
        // Initialize slider when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new ArchiBannerSlider();
        });
  class ProjectSliderManager {
            constructor() {
                this.sliders = new Map();
                this.initializeSliders();
                this.bindEvents();
            }

            initializeSliders() {
                const sliderContainers = document.querySelectorAll('.image-slider-container');
                sliderContainers.forEach(container => {
                    const sliderId = container.getAttribute('data-slider');
                    this.sliders.set(sliderId, {
                        currentSlide: 0,
                        totalSlides: container.children.length,
                        container: container
                    });
                });
            }

            bindEvents() {
                // Navigation buttons
                document.querySelectorAll('.slider-nav-buttons').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const targetSlider = e.target.getAttribute('data-target');
                        const isNext = e.target.classList.contains('slider-next');
                        this.navigateSlider(targetSlider, isNext);
                    });
                });

                // Indicator dots
                document.querySelectorAll('.indicator-dot').forEach(dot => {
                    dot.addEventListener('click', (e) => {
                        const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                        const indicatorContainer = e.target.parentElement;
                        const sliderId = indicatorContainer.getAttribute('data-indicators');
                        this.goToSlide(sliderId, slideIndex);
                    });
                });

                // Auto-play functionality
                this.startAutoPlay();
            }

            navigateSlider(sliderId, isNext) {
                const slider = this.sliders.get(sliderId);
                if (!slider) return;

                if (isNext) {
                    slider.currentSlide = (slider.currentSlide + 1) % slider.totalSlides;
                } else {
                    slider.currentSlide = slider.currentSlide === 0 ? 
                        slider.totalSlides - 1 : slider.currentSlide - 1;
                }

                this.updateSliderPosition(sliderId);
                this.updateIndicators(sliderId);
            }

            goToSlide(sliderId, slideIndex) {
                const slider = this.sliders.get(sliderId);
                if (!slider) return;

                slider.currentSlide = slideIndex;
                this.updateSliderPosition(sliderId);
                this.updateIndicators(sliderId);
            }

            updateSliderPosition(sliderId) {
                const slider = this.sliders.get(sliderId);
                if (!slider) return;

                const translateX = -slider.currentSlide * 100;
                slider.container.style.transform = `translateX(${translateX}%)`;
            }

            updateIndicators(sliderId) {
                const indicatorContainer = document.querySelector(`[data-indicators="${sliderId}"]`);
                if (!indicatorContainer) return;

                const dots = indicatorContainer.querySelectorAll('.indicator-dot');
                const slider = this.sliders.get(sliderId);

                dots.forEach((dot, index) => {
                    dot.classList.toggle('active-indicator', index === slider.currentSlide);
                });
            }

            startAutoPlay() {
                setInterval(() => {
                    this.sliders.forEach((slider, sliderId) => {
                        this.navigateSlider(sliderId, true);
                    });
                }, 4000); // Change slide every 4 seconds
            }
        }

        // Initialize the slider manager when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new ProjectSliderManager();
        });

        // Add touch/swipe support for mobile
        document.querySelectorAll('.image-slider-wrapper').forEach(wrapper => {
            let startX = 0;
            let startY = 0;
            let distX = 0;
            let distY = 0;

            wrapper.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            wrapper.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });

            wrapper.addEventListener('touchend', (e) => {
                if (!startX || !startY) return;

                distX = e.changedTouches[0].clientX - startX;
                distY = e.changedTouches[0].clientY - startY;

                const sliderId = wrapper.querySelector('.image-slider-container').getAttribute('data-slider');
                
                if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 50) {
                    if (distX > 0) {
                        // Swipe right - previous slide
                        document.querySelector(`[data-target="${sliderId}"].slider-prev`).click();
                    } else {
                        // Swipe left - next slide
                        document.querySelector(`[data-target="${sliderId}"].slider-next`).click();
                    }
                }

                startX = 0;
                startY = 0;
            });
        });