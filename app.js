// SEO Report Presentation Controller
class SEOPresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 6;
        this.slides = document.querySelectorAll('.slide');
        
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
        this.initializeChart();
    }
    
    initializeElements() {
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.progressFill = document.getElementById('progressFill');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        // Verify elements exist
        if (!this.prevBtn || !this.nextBtn) {
            console.error('Navigation buttons not found!');
            console.error('prevBtn:', this.prevBtn);
            console.error('nextBtn:', this.nextBtn);
            return;
        }
        
        // Set total slides
        if (this.totalSlidesSpan) {
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
        
        console.log('Elements initialized successfully');
    }
    
    initializeChart() {
        // Initialize performance chart on slide 3
        const ctx = document.getElementById('performanceChart');
        if (ctx) {
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['May', 'June', 'July', 'August'],
                    datasets: [{
                        label: 'Clicks',
                        data: [25, 32, 35, 39],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Impressions',
                        data: [1200, 1350, 1420, 1530],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Clicks'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Impressions'
                            },
                            grid: {
                                drawOnChartArea: false,
                            },
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'SEO Performance Over Time'
                        },
                        legend: {
                            display: true
                        }
                    }
                }
            });
        }
    }
    
    bindEvents() {
        console.log('Binding events...');
        
        // Navigation button events using addEventListener for better reliability
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                this.goToPrevSlide();
            });
            console.log('Previous button event bound');
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked');
                this.goToNextSlide();
            });
            console.log('Next button event bound');
        }
        
        // Export button event
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exportToPDF();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Touch/swipe navigation for mobile
        this.bindTouchEvents();
        
        console.log('Events bound successfully');
    }
    
    bindTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const slideContainer = document.getElementById('slideContainer');
        if (!slideContainer) return;
        
        slideContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.goToNextSlide();
            } else {
                // Swipe right - previous slide
                this.goToPrevSlide();
            }
        }
    }
    
    handleKeyNavigation(e) {
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.goToPrevSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Spacebar
                e.preventDefault();
                this.goToNextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                e.preventDefault();
                this.exitFullscreen();
                break;
        }
    }
    
    goToNextSlide() {
        console.log('Next slide called, current:', this.currentSlide);
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    goToPrevSlide() {
        console.log('Previous slide called, current:', this.currentSlide);
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        console.log('Going to slide:', slideNumber);
        
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            console.log('Invalid slide number:', slideNumber);
            return;
        }
        
        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Update current slide
        this.currentSlide = slideNumber;
        
        // Activate new slide
        const newActiveSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (newActiveSlide) {
            newActiveSlide.classList.add('active');
            console.log('Activated slide:', slideNumber);
        } else {
            console.error('Slide not found:', slideNumber);
        }
        
        // Update UI elements
        this.updateUI();
        
        // Trigger slide-specific animations
        setTimeout(() => {
            this.animateSlideContent(slideNumber);
        }, 100);
    }
    
    updateUI() {
        // Update progress bar
        if (this.progressFill) {
            const progressPercent = (this.currentSlide / this.totalSlides) * 100;
            this.progressFill.style.width = `${progressPercent}%`;
        }
        
        // Update slide counter
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide;
        }
        
        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
            if (this.currentSlide === 1) {
                this.prevBtn.style.opacity = '0.5';
            } else {
                this.prevBtn.style.opacity = '1';
            }
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            if (this.currentSlide === this.totalSlides) {
                this.nextBtn.innerHTML = '<span>Finish</span>';
                this.nextBtn.style.opacity = '0.5';
            } else {
                this.nextBtn.innerHTML = '<span>Next →</span>';
                this.nextBtn.style.opacity = '1';
            }
        }
    }
    
    animateSlideContent(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (!slide) return;
        
        // Add entrance animations based on slide type
        switch (slideNumber) {
            case 2: // Executive Summary
                this.animateMetricCards();
                break;
            case 3: // Current Performance
                this.animateChart();
                break;
            case 4: // Work Completed
                this.animateWorkItems();
                break;
            case 6: // Backlink Profile
                this.animateBacklinkItems();
                break;
        }
    }
    
    animateMetricCards() {
        const metricCards = document.querySelectorAll('.slide.active .metric-card');
        metricCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    animateChart() {
        if (this.chart) {
            this.chart.update('active');
        }
    }
    
    animateWorkItems() {
        const workItems = document.querySelectorAll('.slide.active .work-item');
        workItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 80);
        });
    }
    
    animateBacklinkItems() {
        const backlinkItems = document.querySelectorAll('.slide.active .backlink-source');
        backlinkItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, index * 100);
        });
    }
    
    exportToPDF() {
        // Show export notification
        this.showNotification('Preparing PDF export...', 'info');
        
        // Use browser's print functionality with specific styles
        const originalTitle = document.title;
        document.title = 'SEO Performance Report - Tetravue Superspeciality Eye Centre';
        
        // Add print-specific styles
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .presentation-nav, .slide-navigation { display: none !important; }
                .slide { 
                    position: static !important; 
                    opacity: 1 !important; 
                    transform: none !important; 
                    page-break-after: always !important;
                    padding: 20px !important;
                    height: auto !important;
                    overflow: visible !important;
                }
                .slide:last-child { page-break-after: avoid !important; }
                body { font-size: 12px !important; }
                h1 { font-size: 24px !important; }
                h2 { font-size: 20px !important; }
                h3 { font-size: 18px !important; }
                .metric-card, .work-item, .keyword-card, .backlink-source {
                    page-break-inside: avoid !important;
                }
                .performance-chart {
                    max-width: 100% !important;
                    height: auto !important;
                }
            }
        `;
        document.head.appendChild(printStyles);
        
        // Trigger print dialog
        setTimeout(() => {
            window.print();
            
            // Clean up
            document.head.removeChild(printStyles);
            document.title = originalTitle;
            
            this.showNotification('PDF export ready!', 'success');
        }, 500);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // Set base styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-base);
            padding: var(--space-12) var(--space-16);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform var(--duration-normal) var(--ease-standard);
            display: flex;
            align-items: center;
            gap: var(--space-8);
            color: var(--color-text);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            max-width: 300px;
        `;
        
        // Set content
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        notification.innerHTML = `<span>${icon}</span><span>${message}</span>`;
        
        // Add to DOM and animate in
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    // Public method to enable fullscreen mode
    enterFullscreen() {
        const container = document.querySelector('.presentation-container');
        if (container && container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container && container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container && container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    }
    
    // Reset presentation to first slide
    reset() {
        this.goToSlide(1);
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    // Wait a bit longer to ensure all elements are fully rendered
    setTimeout(() => {
        console.log('Starting initialization...');
        const presentation = new SEOPresentation();
        
        // Make presentation globally accessible for debugging
        window.seoPresentation = presentation;
        
        console.log('SEO Report Presentation initialized successfully!');
        console.log('Total slides:', presentation.totalSlides);
        console.log('Navigation should now work with both buttons and keyboard.');
        
        // Additional verification
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        console.log('Button verification - prevBtn:', !!prevBtn, 'nextBtn:', !!nextBtn);
        
        // Add some global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // F11 for fullscreen toggle
            if (e.key === 'F11') {
                e.preventDefault();
                if (!document.fullscreenElement) {
                    presentation.enterFullscreen();
                } else {
                    presentation.exitFullscreen();
                }
            }
            
            // R for reset
            if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
                e.preventDefault();
                presentation.reset();
            }
        });
        
        // Handle window resize to ensure responsive behavior
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Force UI update on resize
                presentation.updateUI();
            }, 250);
        });
        
    }, 200); // Increased delay to ensure full DOM rendering
});