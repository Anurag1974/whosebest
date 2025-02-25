

$(document).ready(function () {
    $(".testimonial-slider").slick({
        infinite: true,
        centerMode: true,
        autoplay: true,
        slidesToShow: 5,
        slidesToScroll: 3,
        autoplaySpeed: 1500,
        prevArrow: '<button type="button" class="slick-prev">←</button>',
        nextArrow: '<button type="button" class="slick-next">→</button>',
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    centerMode: false
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
});

// search placement to the top 
window.onload = () => {
    const heroSearchBar = document.querySelector(".welcome-hero-search-box");
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    let hasTriggered = false;
    const navSearchBar = document.querySelector('.input-search-container');

    window.addEventListener("scroll", () => {

        console.log(`the navbar height is ${navbarHeight}`);
        const heroSearchBarPosition = heroSearchBar.getBoundingClientRect().top;
        const navbarPosition = navbar.getBoundingClientRect().bottom;


        if (heroSearchBarPosition <= navbarPosition && !hasTriggered) {
            console.log("Search bar has hit the navigation bar!");
            hasTriggered = true;
            heroSearchBar.style.visibility = "hidden"
            navSearchBar.style.display = 'flex';
        }
        if (heroSearchBarPosition > navbarPosition && hasTriggered) {
            console.log('appreared again')
            hasTriggered = false;
            heroSearchBar.style.visibility = "visible"
            navSearchBar.style.display = 'none';
        }
    });


};


// Animate Number Function
function animateNumber(element, start, end, duration) {
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const progress = currentTime - startTime;
        const rate = Math.min(progress / duration, 1);
        const value = Math.floor(rate * (end - start) + start);
        element.textContent = value.toLocaleString();

        if (progress < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Apply Animation on Scroll
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetValue = parseInt(counter.getAttribute("data-target"));
                    animateNumber(counter, 0, targetValue, 2000); // 2000ms duration
                    observer.unobserve(counter); // Stop observing after animating
                }
            });
        },
        { threshold: 0.5 } // Trigger when 50% visible
    );

    counters.forEach((counter) => observer.observe(counter));
});

// ***************
// list business js
// const pincodeInput = document.getElementById('pincode');
// const additionalFields = document.getElementById('additionalFields');
// const cityInput = document.getElementById('city');
// const stateInput = document.getElementById('state');
// const latitudeInput = document.getElementById('latitude');
// const longitudeInput = document.getElementById('longitude');

// const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

// async function fetchLocationDetails(pincode) {
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${GOOGLE_API_KEY}`;
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         if (data.status === 'OK') {
//             const result = data.results[0];
//             const addressComponents = result.address_components;
//             const location = result.geometry.location;

//             const city = addressComponents.find(component => component.types.includes('locality'))?.long_name || '';
//             const state = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '';
//             const latitude = location.lat;
//             const longitude = location.lng;

//             return { city, state, latitude, longitude };
//         } else {
//             console.error('Error:', data.status);
//             return { city: 'Unknown', state: 'Unknown', latitude: '', longitude: '' };
//         }
//     } catch (error) {
//         console.error('Error fetching location:', error);
//         return { city: 'Unknown', state: 'Unknown', latitude: '', longitude: '' };
//     }
// }

async function addName() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const userType = 'customer';


    if (!name || !phone || !userType) {
        alert('All fields are required');
        return;
    }
    const url = '/enter-your-details';
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone, userType })
        });

        if (res.ok) {
            const data = await res.json();
            alert('Name added successfully');
            window.location.href = '/enter-business-details';
        } else {
            const errorData = await res.json();
            alert(`Failed to add name: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding name');
    }

}


// Function to capitalize the first letter of each word
function capitalizeFirstLetter(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}



function submitSort() {
    const form = document.getElementById('sortForm');
    const sortBy = document.getElementById('sortBy').value;
    const category = new URLSearchParams(window.location.search).get('category');
    const query = new URLSearchParams({ category, sortBy }).toString();
    window.location.href = `/search-category?${query}`;
}

//  image in click
function setModalImage(imageSrc) {
    document.getElementById('modalImage').src = imageSrc;
}



// Function to set current location
function setCurrentLocation() {
    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    } catch (error) {
        alert("Error getting geolocation: " + error.message);
    }
}

// Success callback for geolocation
function onSuccess(position) {
    try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Set latitude and longitude fields
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;

        // Get the address from the latitude and longitude using OpenCage API
        getAddressFromLatLng(latitude, longitude);
    } catch (error) {
        alert("Error in processing geolocation data: " + error.message);
    }
}

// Error callback for geolocation
function onError(error) {
    try {
        alert(`Error getting location: ${error.message}`);
    } catch (error) {
        alert("Error in handling geolocation error: " + error.message);
    }
}

// Function to get address from latitude and longitude using OpenCage API
function getAddressFromLatLng(latitude, longitude) {
    try {
        const apiKey = 'a1ccc097b7de4e0cb0a15bcd6e1364c2'; // Replace with your OpenCage API key
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en&pretty=1`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                try {
                    if (data.results.length > 0) {
                        const address = data.results[0].formatted;
                        // Set address field with the formatted address
                        document.getElementById('address').value = address;
                    } else {
                        alert('No address found for this location.');
                    }
                } catch (error) {
                    alert('Error processing API response: ' + error.message);
                }
            })
            .catch(error => {
                alert('Error fetching address: ' + error.message);
            });
    } catch (error) {
        alert("Error in the geocode API request: " + error.message);
    }
}


// business details , review delete code ==============================================================
function deleteReview() {
    const deleteButton = document.getElementById("delete-review-button");
    const reviewId = deleteButton.getAttribute("data-id");

    console.log('Delete review button clicked ==========================');
    console.log('Review ID:', reviewId);

    if (!confirm("Are you sure you want to delete this review?")) return;

    fetch(`/delete/${reviewId}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        location.reload(); // Refresh the page after deletion
      })
      .catch(error => {
        console.error("Error:", error);
      });
}

// vaibhav typing container js 

const words = ['Categories', 'Services', 'Places'];
const typingText = document.querySelector('.typing-text');

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => {
            isDeleting = true;
        }, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }

    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(type, typingSpeed);
}

document.addEventListener('DOMContentLoaded', type);

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.all-user-reviews-cards');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scroll speed
        slider.scrollLeft = scrollLeft - walk;
    });

    // Touch support for mobile devices
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const topRatedBusinessSlider = document.querySelector('.top-rated-business-all-cards');
    let isDown = false;
    let startX;
    let scrollLeft;

    topRatedBusinessSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        topRatedBusinessSlider.classList.add('active');
        startX = e.pageX - topRatedBusinessSlider.offsetLeft;
        scrollLeft = topRatedBusinessSlider.scrollLeft;
    });

    topRatedBusinessSlider.addEventListener('mouseleave', () => {
        isDown = false;
        topRatedBusinessSlider.classList.remove('active');
    });

    topRatedBusinessSlider.addEventListener('mouseup', () => {
        isDown = false;
        topRatedBusinessSlider.classList.remove('active');
    });

    topRatedBusinessSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - topRatedBusinessSlider.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scroll speed
        topRatedBusinessSlider.scrollLeft = scrollLeft - walk;
    });

    // Touch support for mobile devices
    topRatedBusinessSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - topRatedBusinessSlider.offsetLeft;
        scrollLeft = topRatedBusinessSlider.scrollLeft;
    });

    topRatedBusinessSlider.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - topRatedBusinessSlider.offsetLeft;
        const walk = (x - startX) * 2;
        topRatedBusinessSlider.scrollLeft = scrollLeft - walk;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const businessCards = document.querySelectorAll('.top-rated-business-card');

    businessCards.forEach(card => {
        const cardImg = card.querySelector('.top-rated-business-card-all-imgs');
        const navLeft = card.querySelector('.business-image-nav-left');
        const navRight = card.querySelector('.business-image-nav-right');

        // Predefined list of images
        const images = [
            'pexels-elevate-1267320.jpg',
            'pexels-rebrand-cities-581004-1367276.jpg',
            'pexels-italo-melo-881954-2379004.jpg'
        ];

        let currentImageIndex = 0;

        // Function to update image with advanced transition
        function updateImage(direction) {
            // Determine new index
            if (direction === 'next') {
                currentImageIndex = (currentImageIndex + 1) % images.length;
            } else {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            }

            // Apply fade out and slide
            cardImg.style.opacity = '0';
            cardImg.style.transform = direction === 'next' 
                ? 'translateX(20%)' 
                : 'translateX(-20%)';
            
            // After a short delay, change image and slide back
            setTimeout(() => {
                cardImg.src = images[currentImageIndex];
                
                // Trigger reflow to ensure opacity and transform are reset
                void cardImg.offsetWidth;
                
                cardImg.style.opacity = '1';
                cardImg.style.transform = 'translateX(0)';
            }, 300);
        }

        // Add event listeners for navigation
        navLeft.addEventListener('click', () => updateImage('prev'));
        navRight.addEventListener('click', () => updateImage('next'));
    });
});




// vaibhav header js file here 


let lastScrollTop = 0;
const header = document.querySelector('.web-header-bottom-main-content');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.style.transform = 'translateY(-280%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});


document.addEventListener('DOMContentLoaded', () => {
    const categorySearch = document.querySelector('.web-category-search');
    const categoryInput = document.getElementById('categoryInput');
    const categoryValue = document.getElementById('categoryValue');
    const selectWrapper = document.querySelector('.select-wrapper');
    const selectOptions = selectWrapper.querySelectorAll('li');

    categoryInput.addEventListener('click', (e) => {
        e.stopPropagation();
        selectWrapper.classList.toggle('active');
        categorySearch.classList.toggle('active');
    });

    selectOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedValue = option.getAttribute('data-value');
            const selectedText = option.textContent;

            categoryInput.value = selectedText;
            categoryValue.value = selectedValue;

            selectOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            selectWrapper.classList.remove('active');
            categorySearch.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!selectWrapper.contains(e.target) && !categoryInput.contains(e.target)) {
            selectWrapper.classList.remove('active');
            categorySearch.classList.remove('active');
        }
    });
});


// menu icon function 
document.addEventListener("DOMContentLoaded", function () {
    const menubarIcon = document.querySelector(".web-header-menubar i");
    const menuSlider = document.querySelector(".web-menu-header-slider-multi-option-when-clicked");
    if (menubarIcon) {
        menubarIcon.addEventListener("click", () => {
            menuSlider.classList.toggle("menu-open");
        });
    }
        // Close menu when clicking outside
        document.addEventListener("click", (event) => {
            if (
                !menubarIcon?.contains(event.target) &&
                !menuSlider?.contains(event.target)
                // !threeDots?.contains(event.target)
            ) {
                menuSlider?.classList.remove("menu-open");
            }
        });
})

document.addEventListener('DOMContentLoaded', () => {
    const phoneMenuBar = document.querySelector('.phone-header-menubar i');
    const phoneMenuSlider = document.querySelector('.phone-menu-header-slider-multi-option-when-clicked');
    const phoneCloseMenuBtn = document.createElement('button');

    phoneCloseMenuBtn.innerHTML = '&times;';
    phoneCloseMenuBtn.classList.add('phone-close-menu-btn');
    phoneMenuSlider.insertBefore(phoneCloseMenuBtn, phoneMenuSlider.firstChild);

    phoneMenuBar.addEventListener('click', () => {
        phoneMenuSlider.classList.add('active');
    });

    phoneCloseMenuBtn.addEventListener('click', () => {
        phoneMenuSlider.classList.remove('active');
    });

    phoneMenuSlider.addEventListener('click', (e) => {
        if (e.target === phoneMenuSlider) {
            phoneMenuSlider.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const phoneCategorySearch = document.querySelector('.phone-category-search');
    const phoneCategoryInput = document.getElementById('phoneCategoryInput');
    const phoneCategoryValue = document.getElementById('phoneCategoryValue');
    const phoneSelectWrapper = document.querySelector('.phone-select-wrapper');
    const phoneSelectOptions = phoneSelectWrapper.querySelectorAll('li');

    phoneCategoryInput.addEventListener('click', (e) => {
        e.stopPropagation();
        phoneSelectWrapper.classList.toggle('active');
        phoneCategorySearch.classList.toggle('active');
    });

    phoneSelectOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedValue = option.getAttribute('data-value');
            const selectedText = option.textContent;

            phoneCategoryInput.value = selectedText;
            phoneCategoryValue.value = selectedValue;

            phoneSelectOptions.forEach(opt => opt.classList.remove('selected'));

            option.classList.add('selected');

            phoneSelectWrapper.classList.remove('active');
            phoneCategorySearch.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!phoneSelectWrapper.contains(e.target) && !phoneCategoryInput.contains(e.target)) {
            phoneSelectWrapper.classList.remove('active');
            phoneCategorySearch.classList.remove('active');
        }
    });
});



// based on search function when search button is get clicked (search funcationality)
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".web-search-icon").addEventListener("click", function () {
        let category = document.getElementById("categoryValue").value.trim();
        let city = document.querySelector(".web-city-search input").value.trim();

        console.log("Category:", category);
        console.log("City:", city);

        if (!category && !city) {
            alert("Please select a category and enter a city.");
            return;
        }

        // Construct the URL
        let searchUrl = `/show-business?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}`;
        console.log("Redirecting to:", searchUrl);

        // Redirect
        window.location.href = searchUrl;
    });
});

//// phone ====based on search function when search button is get clicked (search funcationality) 
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".phone-city-search-input-icon").addEventListener("click", function () {
        let category = document.getElementById("phoneCategoryValue").value.trim();
        let city = document.querySelector(".phone-city-search input").value.trim();

        console.log("Category:", category);
        console.log("City:", city);

        if (!category && !city) {
            alert("Please select a category and enter a city.");
            return;
        }

        // Construct the URL
        let searchUrl = `/show-business?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}`;
        console.log("Redirecting to:", searchUrl);

        // Redirect
        window.location.href = searchUrl;
    });
});

document.querySelector('.web-header-logo').addEventListener('click', () => {
    window.location.href = '/'; // Redirects to the home page route
});

document.querySelector('.phone-who-best-title').addEventListener('click', () => {
    window.location.href = '/'; // Redirects to the home page route
});


// all categories popper section 
const openPopper = document.getElementById('open-popper');
const closePopper = document.getElementById('close-popper');
const popperOverlay = document.getElementById('popper-overlay');

openPopper.addEventListener('click', (e) => {
    e.preventDefault();
    popperOverlay.classList.add('show');
});

closePopper.addEventListener('click', () => {
    popperOverlay.classList.remove('show');
    popperOverlay.classList.add('hide');
    
    // Remove hide class after animation completes
    setTimeout(() => {
        popperOverlay.classList.remove('hide');
    }, 300);
});

popperOverlay.addEventListener('click', (e) => {
    if (e.target === popperOverlay) {
        popperOverlay.classList.remove('show');
        popperOverlay.classList.add('hide');
        
        // Remove hide class after animation completes
        setTimeout(() => {
            popperOverlay.classList.remove('hide');
        }, 300);
    }
});


