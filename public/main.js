
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
const pincodeInput = document.getElementById('pincode');
const additionalFields = document.getElementById('additionalFields');
const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

async function fetchLocationDetails(pincode) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${GOOGLE_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
            const result = data.results[0];
            const addressComponents = result.address_components;
            const location = result.geometry.location;

            const city = addressComponents.find(component => component.types.includes('locality'))?.long_name || '';
            const state = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '';
            const latitude = location.lat;
            const longitude = location.lng;

            return { city, state, latitude, longitude };
        } else {
            console.error('Error:', data.status);
            return { city: 'Unknown', state: 'Unknown', latitude: '', longitude: '' };
        }
    } catch (error) {
        console.error('Error fetching location:', error);
        return { city: 'Unknown', state: 'Unknown', latitude: '', longitude: '' };
    }
}

// pincodeInput.addEventListener('input', async () => {
//     console.log('keuy is pressed')
//     const pincode = pincodeInput.value.trim();
//     if (pincode) {
//         const { city, state, latitude, longitude } = await fetchLocationDetails(pincode);
//         cityInput.value = city;
//         stateInput.value = state;
//         latitudeInput.value = latitude;
//         longitudeInput.value = longitude;
//         additionalFields.classList.remove('d-none');
//     } else {
//         additionalFields.classList.add('d-none');
//     }
// });

// send otp
async function sendOtp() {
    console.log('send otp');
    const verifyOtpBox = document.getElementById('verify-otp-box');

    const otpEmail = document.getElementById('otp-email');
    const email = document.getElementById('email').value;



    if (!email) {
        alert('Email is required');
        return;
    }

    const button = document.getElementById('sendOtpButton');
    button.disabled = true;
    button.textContent = 'Sending...';

    const url = '/send-otp';

    try {
        // Use await to wait for the fetch request to complete
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            const data = await res.json();

            alert('OTP sent successfully');
            otpEmail.textContent = email;
            verifyOtpBox.classList.remove('d-none');
            button.textContent = 'OTP Sent';

            if (data.emailIsPresent) {
                alert('Email is already present');
                // Do nothing as the email already exists
            } else {
                alert('Email is not present');

                // Create input fields for name and phone
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.id = 'user-name';
                nameInput.classList.add('form-control', 'mt-3');
                nameInput.placeholder = 'Enter your name';
                nameInput.required = true;

                const phoneInput = document.createElement('input');
                phoneInput.type = 'tel';
                phoneInput.id = 'user-phone';
                phoneInput.classList.add('form-control', 'mt-3');
                phoneInput.placeholder = 'Enter your phone number';
                phoneInput.pattern = '[0-9]{10}';
                phoneInput.title = 'Phone number should be 10 digits';
                phoneInput.required = true;

                verifyOtpBox.appendChild(nameInput);
                verifyOtpBox.appendChild(phoneInput);
            }
        } else {
            alert('Failed to send OTP. Please try again.');
            button.disabled = false;
            button.textContent = 'Send OTP';
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
        button.disabled = false;
        button.textContent = 'Send OTP';
    }
}
async function sendOtpPopup() {
    console.log('send otp');
    const verifyOtpBox = document.getElementById('verify-otp-box');

    const otpEmail = document.getElementById('otp-email');
    const email = document.getElementById('email').value;



    if (!email) {
        alert('Email is required');
        return;
    }

    const button = document.getElementById('sendOtpButton');
    button.disabled = true;
    button.textContent = 'Sending...';

    const url = '/send-otp';

    try {
        // Use await to wait for the fetch request to complete
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            const data = await res.json();

            alert('OTP sent successfully');
            otpEmail.textContent = email;
            verifyOtpBox.classList.remove('d-none');
            button.textContent = 'OTP Sent';

            if (data.emailIsPresent) {
                alert('Email is already present');
                // Do nothing as the email already exists
            } else {
                alert('Email is not present');

                // Create input fields for name and phone
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.id = 'user-name-pop';
                nameInput.classList.add('form-control', 'mt-3');
                nameInput.placeholder = 'Enter your name';
                nameInput.required = true;

                const phoneInput = document.createElement('input');
                phoneInput.type = 'tel';
                phoneInput.id = 'user-phone-pop';
                phoneInput.classList.add('form-control', 'mt-3');
                phoneInput.placeholder = 'Enter your phone number';
                phoneInput.pattern = '[0-9]{10}';
                phoneInput.title = 'Phone number should be 10 digits';
                phoneInput.required = true;

                verifyOtpBox.appendChild(nameInput);
                verifyOtpBox.appendChild(phoneInput);
            }
        } else {
            alert('Failed to send OTP. Please try again.');
            button.disabled = false;
            button.textContent = 'Send OTP';
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
        button.disabled = false;
        button.textContent = 'Send OTP';
    }
}


async function verifyOtp() {
    const otp = document.getElementById('otp').value;
    const nameInput = document.getElementById('user-name');
    const phoneInput = document.getElementById('user-phone');

    const userName = nameInput ? nameInput.value : null;
    const userPhone = phoneInput ? phoneInput.value : null;

    if (!otp) {
        alert('Please enter the OTP');
        return;
    }

    const url = '/verify-otp';
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp, userName, userPhone })

        })
        if (res.ok) {
            const data = await res.json();
            alert('OTP verified successfully');
            // Redirect to the appropriate page based on the response
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;


            } else {
                const errorData = await res.json();
                alert(`Failed to verify OTP: ${errorData.message}`);
            }

        }
    }

    catch (error) {
        console.error('Error:', error);
        alert('An error occurred while verifying OTP');
    }



}
async function verifyOtpPopup() {
    const otp = document.getElementById('otp-pop').value;
    const nameInput = document.getElementById('user-name-pop');
    const phoneInput = document.getElementById('user-phone-pop');

    const userName = nameInput ? nameInput.value : null;
    const userPhone = phoneInput ? phoneInput.value : null;


    if (!otp) {
        alert('Please enter the OTP');
        return;
    }

    const url = '/verify-otp-pop';
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp, userName, userPhone })

        })
        if (res.ok) {
            const data = await res.json();
            alert('OTP verified successfully');
            // Redirect to the appropriate page based on the response
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;


            } else {
                const errorData = await res.json();
                alert(`Failed to verify OTP: ${errorData.message}`);
            }
        }
    }

    catch (error) {
        console.error('Error:', error);
        alert('An error occurred while verifying OTP');
    }

}
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
async function addBusinessDetails() {
    const businessName = document.getElementById('business-name').value;


    const address = document.getElementById('address').value;

    const category = document.getElementById('business-category').value;

    const phone = document.getElementById('phone').value;
    // const email = document.getElementById('email').value;



    const latitudeInput = document.getElementById('latitude').value;
    const longitudeInput = document.getElementById('longitude').value;
    const state = document.getElementById('add-state').value;
    const city = document.getElementById('add-city').value;
    const website = document.getElementById('website').value;
    const evCharging = document.getElementById('ev-charging').value;
    // const images = document.getElementById('images').files;

    


    console.log('latitude================')

    if (!businessName || !latitudeInput || !longitudeInput|| !city || !state || !address || !phone || !category || !evCharging ) {
        alert('All fields are required except website');
        return;
    }
    const formData = new FormData();
    formData.append('businessName', businessName);

    formData.append('address', address);
    formData.append('category', category);
    formData.append('phone', phone);
    formData.append('latitudeInput', latitudeInput);
    formData.append('longitudeInput', longitudeInput);
    formData.append('evCharging', evCharging)
    formData.append('city', city)
    formData.append('state', state)

    if (website) {
        formData.append('website', website);
    }

    // for (let i = 0; i < images.length; i++) {
    //     formData.append('images', images[i]);
    // }


    const url = '/list-business';
    try {
        const res = await fetch(url, {
            method: 'POST',

            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            alert('Business details added successfully');
            window.location.href = data.redirectUrl;
        } else {
            const errorData = await res.json();
            alert(`Failed to add business: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding business details');

    }


}

function updateBusinessDetails(event) {
    if (event) event.preventDefault(); // Prevent form submission if inside <form>

    const formData = new FormData();

    // Get business ID
    const businessId = document.getElementById('businessId').value;
    if (!businessId) {
        alert('Business ID is missing!');
        return;
    }

    // Append text fields to FormData
    formData.append('businessId', businessId);
    formData.append('businessName', document.getElementById('businessName').value);
    formData.append('address', document.getElementById('businessAddress').value);
    formData.append('category', document.getElementById('businessCategory').value);
    formData.append('phone', document.getElementById('businessPhone').value);
    formData.append('website', document.getElementById('businessWebsite').value);
    formData.append('city', document.getElementById('businessCity').value);
    formData.append('state', document.getElementById('businessState').value);

    // Append images to FormData
    const images = document.getElementById('images').files;
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    // Send the PUT request to update business details
    fetch('/update-business', {
        method: 'PUT',  // Use PUT for updating
        body: formData  // FormData for files
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Business details updated successfully');
            window.location.reload(); // Refresh page to show updated details
        } else {
            alert(`Failed to update business: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating business details.');
    });
}





    // document.getElementById('updateBusinessForm').addEventListener('submit', async function (event) {
    //     event.preventDefault(); // Prevent default form submission

    //     // Get business ID (Ensure it's being retrieved correctly)
    //     const businessId = document.getElementById('businessId').value;
    //     if (!businessId) {
    //         alert('Business ID is missing!');
    //         return;
    //     }

    //     // Get form data
    //     const businessName = document.getElementById('businessName').value;
    //     const address = document.getElementById('businessAddress').value;
    //     const category = document.getElementById('businessCategory').value;
    //     const phone = document.getElementById('businessPhone').value;
    //     const website = document.getElementById('businessWebsite').value;
    //     const city = document.getElementById('businessCity').value;
    //     const state = document.getElementById('businessState').value;

    //     // Validate required fields
    //     if (!businessName || !address || !category || !phone || !city || !state) {
    //         alert('All fields are required except website.');
    //         return;
    //     }

    //     const requestBody = {
    //         businessId, // Ensure businessId is passed
    //         businessName,
    //         address,
    //         category,
    //         phone,
    //         city,
    //         state,
    //         website
    //     };

    //     console.log('Sending Update Request:', requestBody);

    //     try {
    //         const response = await fetch('/update-business', {
    //             method: 'PUT',  // Use PUT method for updating
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(requestBody)
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             alert('Business details updated successfully');
    //             window.location.reload(); // Refresh page to show updated details
    //         } else {
    //             alert(`Failed to update business: ${data.message}`);
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('An error occurred while updating business details.');
    //     }
    // });




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

//set current location 

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



// Update fetch api

async function updateUserInformation() {
    const formData = new FormData();
    formData.append('name', document.getElementById('user-name').value);
    formData.append('phoneNumber', document.getElementById('phone-number').value);

    const fileInput = document.getElementById('profileImage');
    if (fileInput.files.length > 0) {
        formData.append('profileImage', fileInput.files[0]); // Append image file
    }

    try {
        const response = await fetch('/update-user', {
            method: 'PUT',
            body: formData // Send as multipart/form-data (no need for Content-Type)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Success:', data);
        alert('User information updated successfully');
        window.location.reload();

    } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user information');
    }
}


// business details , review delete code ==============================================================
function deleteReview() {
    const deleteButton = document.getElementById("delete-review-btn");
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

