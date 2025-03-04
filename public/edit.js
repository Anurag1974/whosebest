
// document.getElementById('thumbnail').addEventListener('change', checkFileSize);
document.getElementById('profileImage').addEventListener('change', checkFileSize);

function checkFileSize(event) {
    const file = event.target.files[0];
    if (file && file.size > 3 * 1024 * 1024) { // 3MB in bytes
        // Prevent form submission if file is too large
        event.preventDefault();

        // Show toast message
        const toast = document.getElementById('toast');
        toast.style.display = 'block';

        // Hide the toast message after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);

        // Manually reload the page after 3 seconds to allow the toast to show
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
}


async function updateUserInformation() {
    const formData = new FormData();

    const userId = document.getElementById('updateUserId').value;
    const name = capitalizeFirstLetter(document.getElementById('user-name').value);
    const phoneNumber = document.getElementById('phone-number').value;
    const email = document.getElementById('user-email').value;

    formData.append('userId', userId);
    formData.append('name', name);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);

    const fileInput = document.getElementById('profileImage');
    if (fileInput.files.length > 0) {
        formData.append('profileImage', fileInput.files[0]);
    }

    try {
        const response = await fetch('/update-user', {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Success:', data);
        updateUserShowModal('User information updated successfully', true);
        setTimeout(() => window.location.reload(), 3000);

    } catch (error) {
        console.error('Error updating user:', error);
        updateUserShowModal('Failed to update user information', false);
    }
}

function updateUserShowModal(message, isSuccess = true) {
    const modal = document.getElementById('update-user-successModal');
    const messageElement = document.getElementById('update-user-modalMessage');
    const iconElement = document.getElementById('update-user-modalIcon');

    if (messageElement) {
        messageElement.innerHTML = message;
    }

    if (iconElement) {
        if (isSuccess) {
            iconElement.innerHTML = "✔";
            iconElement.style.color = "#4CAF50";
        } else {
            iconElement.innerHTML = "Error!";
            iconElement.style.color = "#F44336";
        }
    }

    modal.style.display = 'block';

    document.querySelector('.update-user-close').onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}




