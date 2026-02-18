/* Back to Top Button & Sticky Header */
const header = document.querySelector('header');
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        backToTopButton.classList.add('active');
    } else {
        header.classList.remove('scrolled');
        backToTopButton.classList.remove('active');
    }
}, { passive: true });


/* Mobile Menu */
function toggleMenu(){
    document.getElementById("nav-links").classList.toggle("active");
    const overlay = document.querySelector(".menu-overlay");
    if (overlay) {
        overlay.classList.toggle("active");
    }
}

/* Counter Animation */
const counters = document.querySelectorAll('.counter');
const speed = 200; // The lower the #, the faster the count

const runCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const updateCount = () => {
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 10);
        } else {
            counter.innerText = target;
        }
    };
    updateCount();
};

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

/* Testimonial Slider */
const slider = document.querySelector('.testimonial-slider');
if (slider) {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

/* Scroll Reveal Animation */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});


/* Form Validation & Popup */
const successPopup = document.getElementById('success-popup');
const closePopupButton = document.querySelector('.close-popup');

if (closePopupButton) {
    closePopupButton.addEventListener('click', () => {
        successPopup.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target == successPopup) {
        successPopup.style.display = 'none';
    }
});

function showSuccessPopup(message) {
    const popupMessage = successPopup.querySelector('p');
    popupMessage.textContent = message;
    successPopup.style.display = 'flex';
}

function validateBookingForm() {
    const form = document.getElementById('booking-form');
    const dateInput = document.getElementById('booking-date');
    
    // Basic validation
    if (form.checkValidity()) {
        // Date validation: should not be in the past
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0,0,0,0); // Reset time part

        if (selectedDate < today) {
            alert('Please select a future date.');
            return false;
        }

        // Gather form data
        const serviceType = document.getElementById('service-type').value;
        const date = dateInput.value;
        const timeSlotElement = document.querySelector('input[name="time-slot"]:checked');
        const timeSlot = timeSlotElement ? timeSlotElement.value : 'Not selected';
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const imageInput = document.getElementById('reference-image');
        const hasImage = imageInput && imageInput.files.length > 0 ? 'Yes (Please attach in WhatsApp)' : 'No';

        // WhatsApp Integration
        const whatsAppNumber = '919662755375';
        const message = `*New Booking Request*\n\n` +
                        `*Service:* ${serviceType}\n` +
                        `*Date:* ${date}\n` +
                        `*Time:* ${timeSlot}\n` +
                        `*Name:* ${name}\n` +
                        `*Email:* ${email}\n` +
                        `*Phone:* ${phone}\n` +
                        `*Address:* ${address}\n` +
                        `*Reference Image:* ${hasImage}`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsAppUrl, '_blank');

        showSuccessPopup('Thank you! Please send the pre-filled message on WhatsApp to confirm your booking.');
        form.reset(); // Clear the form
    } else {
        // This will trigger browser's default validation messages
        form.reportValidity();
    }
    
    return false; // Prevent actual form submission
}

function validateContactForm() {
    const form = document.getElementById('contact-form');

    if (form.checkValidity()) {
        // Gather form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const messageText = document.getElementById('message').value;

        // WhatsApp Integration
        const whatsAppNumber = '919662755375';
        const message = `*New Contact Inquiry*\n\n` +
                        `*Name:* ${name}\n` +
                        `*Email:* ${email}\n` +
                        `*Subject:* ${subject}\n` +
                        `*Message:* ${messageText}`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsAppUrl, '_blank');

        showSuccessPopup('Thank you! Please send the message on WhatsApp to connect with us.');
        form.reset();
    } else {
        form.reportValidity();
    }

    return false; // Prevent actual form submission
}

/* Service Catalog Filter, Search, and WhatsApp Integration */
document.addEventListener('DOMContentLoaded', () => {
    const serviceGrid = document.querySelector('.service-grid');

    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('service-search');
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Data for services with selectable options
    const serviceData = {
        'Full Home Cleaning': {
            description: 'A complete top-to-bottom cleaning for your entire home. Perfect for a 1BHK, 2BHK, or 3BHK house, ensuring a fresh and healthy environment.',
            options: [
                { name: '1 BHK', price: 1499 },
                { name: '2 BHK', price: 1999 },
                { name: '3 BHK', price: 2499 },
                { name: '4 BHK', price: 2999 },
            ]
        },
        'Apartment Cleaning': {
            description: 'Specialized cleaning services tailored for apartments and flats of all sizes.',
            options: [
                { name: '1 BHK', price: 999 },
                { name: '2 BHK', price: 1299 },
                { name: '3 BHK', price: 1599 },
            ]
        },
        'Sofa Cleaning': {
            description: 'Revitalize your furniture with our professional sofa shampoo cleaning. We remove tough stains and restore freshness to your upholstery.',
            options: [
                { name: 'Single Seater', price: 299 },
                { name: '2 Seater', price: 499 },
                { name: '3 Seater', price: 699 },
                { name: 'L-Shape (up to 5 seats)', price: 999 }
            ]
        },
        'Bathroom Deep Cleaning': {
            description: 'Intensive cleaning and sanitization for a hygienic and sparkling bathroom.',
            options: [
                { name: '1 Bathroom', price: 399 },
                { name: '2 Bathrooms', price: 699 },
            ]
        },
        'Kitchen Deep Cleaning': {
            description: 'Our kitchen deep cleaning includes complete grease removal, modular kitchen cleaning, and chimney cleaning for a spotless, hygienic space.',
            options: [
                { name: 'Standard Kitchen', price: 599 },
                { name: 'Large Kitchen', price: 899 },
            ]
        },
        'Office Cleaning': {
            description: 'Professional cleaning for offices to ensure a productive environment.',
            options: [
                { name: 'Small Office (up to 500 sqft)', price: 1999 },
                { name: 'Medium Office (500-1000 sqft)', price: 3499 },
                { name: 'Large Office (1000+ sqft)', price: 5999 },
            ]
        },
        'Bungalow Cleaning': {
            description: 'Comprehensive cleaning for bungalows including all rooms and exterior areas.',
            options: [
                { name: '2 BHK Bungalow', price: 2999 },
                { name: '3 BHK Bungalow', price: 3999 },
                { name: '4 BHK Bungalow', price: 4999 },
            ]
        },
        'Villa Cleaning': {
            description: 'Premium cleaning services for luxury villas.',
            options: [
                { name: '3 BHK Villa', price: 3499 },
                { name: '4 BHK Villa', price: 4999 },
                { name: '5 BHK Villa', price: 6499 },
            ]
        },
        'Room-Wise Cleaning': {
            description: 'Flexible cleaning for specific rooms.',
            options: [
                { name: '1 Room', price: 299 },
                { name: '2 Rooms', price: 549 },
                { name: '3 Rooms', price: 799 },
            ]
        },
        'Balcony Cleaning': {
            description: 'Cleaning of balcony areas.',
            options: [
                { name: 'Small Balcony', price: 199 },
                { name: 'Large Balcony', price: 299 },
            ]
        },
        'Terrace Cleaning': {
            description: 'High pressure washing for terraces.',
            options: [
                { name: 'Up to 500 sqft', price: 499 },
                { name: '500-1000 sqft', price: 899 },
            ]
        },
        'Fan Cleaning': {
            description: 'Cleaning of ceiling and exhaust fans.',
            options: [
                { name: 'Ceiling Fan', price: 99 },
                { name: 'Exhaust Fan', price: 149 },
            ]
        },
        'Carpet Cleaning': {
            description: 'Deep cleaning for carpets to remove dust and allergens.',
            options: [
                { name: 'Small Carpet (4x6)', price: 399 },
                { name: 'Medium Carpet (6x9)', price: 599 },
                { name: 'Large Carpet (9x12)', price: 799 },
            ]
        },
        'Chimney Cleaning': {
            description: 'Deep cleaning of kitchen chimney.',
            options: [
                { name: 'Standard Chimney', price: 299 },
                { name: 'Island Chimney', price: 499 },
            ]
        },
        'Shop Cleaning': {
            description: 'Cleaning services for retail shops.',
            options: [
                { name: 'Small Shop', price: 1499 },
                { name: 'Medium Shop', price: 2499 },
            ]
        },
        'Showroom Cleaning': {
            description: 'Detailed cleaning for showrooms.',
            options: [
                { name: 'Standard Showroom', price: 2499 },
                { name: 'Large Showroom', price: 4999 },
            ]
        },
        'Restaurant Cleaning': {
            description: 'Hygiene maintenance for restaurants.',
            options: [
                { name: 'Small Restaurant', price: 3999 },
                { name: 'Large Restaurant', price: 6999 },
            ]
        },
        'Hotel Cleaning': {
            description: 'Cleaning solutions for hotels.',
            options: [
                { name: 'Guest House', price: 4999 },
                { name: 'Small Hotel', price: 9999 },
            ]
        },
        'Warehouse Cleaning': {
            description: 'Industrial cleaning for warehouses.',
            options: [
                { name: 'Per Sq Ft', price: 5 },
            ]
        },
        // Default fallback for other services
        'default': {
            description: 'Please contact us for more details about this service.',
            options: [
                { name: 'Service Booking', price: 0 } // Price 0 indicates "Contact for Price" logic if needed
            ]
        }
    };

    // --- Service Details Page Logic ---
    const detailsPage = document.getElementById('service-details-page');
    if (detailsPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceName = urlParams.get('name');
        const serviceImg = urlParams.get('img');

        if (serviceName) {
            document.getElementById('detail-name').textContent = serviceName;
            if (serviceImg) document.getElementById('detail-img').src = serviceImg;

            const data = serviceData[serviceName] || serviceData['default'];
            
            document.getElementById('detail-desc').textContent = data.description;

            const optionsContainer = document.getElementById('detail-options');
            data.options.forEach(opt => {
                const priceDisplay = opt.price > 0 ? `₹${opt.price}` : 'Contact for Price';
                const html = `
                    <div class="service-option-row" data-price="${opt.price}" data-name="${opt.name}">
                        <div class="option-info">
                            <h4>${opt.name}</h4>
                            <span>${priceDisplay}</span>
                        </div>
                        <div class="quantity-selector">
                            <button class="minus">-</button>
                            <span class="quantity">0</span>
                            <button class="plus">+</button>
                        </div>
                    </div>
                `;
                optionsContainer.insertAdjacentHTML('beforeend', html);
            });
        }

        // Calculate Total
        const updatePageTotal = () => {
            let total = 0;
            document.querySelectorAll('.service-option-row').forEach(row => {
                const price = parseFloat(row.dataset.price);
                const qty = parseInt(row.querySelector('.quantity').textContent);
                total += price * qty;
            });
            document.getElementById('detail-total').textContent = total;
        };

        // Event Delegation for Plus/Minus
        detailsPage.addEventListener('click', (e) => {
            if (e.target.matches('.plus, .minus')) {
                const quantityEl = e.target.closest('.quantity-selector');
                const quantitySpan = quantityEl.querySelector('.quantity');
                let quantity = parseInt(quantitySpan.textContent);
                
                if (e.target.classList.contains('plus')) quantity++;
                else quantity = Math.max(0, quantity - 1);
                
                quantitySpan.textContent = quantity;
                updatePageTotal();
            }
        });

        // Book Button Logic
        document.getElementById('book-now-btn').addEventListener('click', () => {
            const whatsAppNumber = '919662755375';
            const date = document.getElementById('service-date').value;
            const time = document.getElementById('service-time').value;
            let message = `Hello DN Cleaning Service,\nI am interested in *${serviceName}*.\n\n*My Selection:*\n`;
            let hasSelection = false;
            
            document.querySelectorAll('.service-option-row').forEach(row => {
                const qty = parseInt(row.querySelector('.quantity').textContent);
                if (qty > 0) {
                    const name = row.dataset.name;
                    const price = row.dataset.price;
                    message += `- ${name} (x${qty}) = ₹${price * qty}\n`;
                    hasSelection = true;
                }
            });

            if (date) message += `\n*Date:* ${date}`;
            if (time) message += `\n*Time:* ${time}`;

            const total = document.getElementById('detail-total').textContent;
            
            if (hasSelection) {
                message += `\n*Total Estimate: ₹${total}*\n\nPlease confirm availability.`;
            } else {
                message = `Hello DN Cleaning Service,\nI am interested in *${serviceName}*. Please provide more details.`;
            }
            
            window.open(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`, '_blank');
        });
    }

    // --- Filter Functionality ---
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;

                serviceCards.forEach(card => {
                    card.classList.add('hide'); // Hide all cards initially
                    setTimeout(() => { // Use timeout for fade-out effect
                        if (filter === 'all' || card.dataset.category === filter) {
                            card.style.display = 'flex';
                            setTimeout(() => card.classList.remove('hide'), 10); // Fade in
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });
    }

    // --- Search Functionality ---
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase();
            serviceCards.forEach(card => {
                const serviceName = card.dataset.name.toLowerCase();
                if (serviceName.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- WhatsApp Booking Functionality ---
    if (serviceGrid) {
        serviceGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.service-card');
            if (!card) return;

            // 1. Handle "Book on WhatsApp" button click (Direct WhatsApp)
            if (e.target.closest('.btn-whatsapp')) {
                const serviceName = card.dataset.name;
                const servicePrice = card.dataset.price;
                const whatsAppNumber = '919662755375';
                const message = `Hello DN Cleaning Service,\nI am interested in ${serviceName} (₹${servicePrice} onwards).\nPlease share available time slots and details.`;
                const encodedMessage = encodeURIComponent(message);
                const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
                window.open(whatsAppUrl, '_blank');
                return;
            }

            // 2. Handle Click on Image, Title, or "View Details" button (Open Details Page)
            // Prevent default behavior if it's a link to avoid double navigation or reload
            if (e.target.closest('a')) {
                e.preventDefault();
            }

            const serviceName = card.dataset.name;
            const imgSrc = card.querySelector('img').src;
            
            // Redirect to service-details.html with parameters
            window.location.href = `service-details.html?name=${encodeURIComponent(serviceName)}&img=${encodeURIComponent(imgSrc)}`;
        });
    }

    /* Make Service Request Section - WhatsApp Integration */
    const requestSection = document.querySelector('.make-request-section');
    if (requestSection) {
        requestSection.addEventListener('click', (e) => {
            const targetCard = e.target.closest('.large-card, .small-service-box');
            if (!targetCard) return;

            const serviceName = targetCard.dataset.service;
            if (!serviceName) return;

            const whatsAppNumber = '919662755375'; // Using the number from the footer
            const message = `Hello, I want to book ${serviceName} service. Please share details.`;
            const encodedMessage = encodeURIComponent(message);
            const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;

            window.open(whatsAppUrl, '_blank');
        });
    }

    /* --- Mobile Bottom Navigation Logic --- */
    const moreBtn = document.getElementById('mobile-more-btn');
    const moreMenu = document.getElementById('mobile-more-menu');
    
    if (moreBtn && moreMenu) {
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreMenu.classList.toggle('active');
            moreBtn.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!moreMenu.contains(e.target) && !moreBtn.contains(e.target)) {
                moreMenu.classList.remove('active');
                moreBtn.classList.remove('active');
            }
        });
    }

    // Highlight active link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else if (href && !link.id) {
            link.classList.remove('active');
        }
    });
});