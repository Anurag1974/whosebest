document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("images");
    const errorMsg = document.getElementById("error-msg");
    const remainingCount = document.getElementById("remaining-count");
    const maxFiles = parseInt(remainingCount.dataset.remainingImages, 10); // Get remaining images from the backend

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > maxFiles) {
            errorMsg.textContent = `You can only select up to ${maxFiles} images.`;
            fileInput.value = ""; // Reset input
        } else {
            errorMsg.textContent = ""; // Clear error message if valid
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const imageInput = document.getElementById('images');
    const remainingCountElem = document.getElementById('remaining-count');

    // Fetch the initial value from the data attribute
    let remainingImages = parseInt(remainingCountElem.getAttribute('data-remaining-images'), 10);

    console.log(remainingImages);  // Verify the initial value

    // Function to update the remaining images count
    const updateRemainingCount = () => {
        remainingCountElem.textContent = `Remaining images: ${remainingImages}`;
    };

    // Update the remaining count when new images are selected
    imageInput.addEventListener('change', function () {
        // Get the number of selected files
        const selectedFiles = this.files.length;

        if (selectedFiles > 0 && remainingImages > 0) {
            // Ensure the remaining images don't go negative
            const filesToUpload = Math.min(remainingImages, selectedFiles);

            // Decrease the remaining count based on how many files are selected
            remainingImages -= filesToUpload;

            // Update the text content dynamically
            updateRemainingCount();

            // Set the input to readonly when no more images can be uploaded
            if (remainingImages <= 0) {
                imageInput.setAttribute('readonly', true);
                imageInput.style.pointerEvents = 'none';  // Prevent interaction
            }
        }
    });

    // Initial update of the remaining count when the page loads
    updateRemainingCount();
});

document.getElementById('thumbnail').addEventListener('change', checkFileSize);
document.getElementById('images').addEventListener('change', checkFileSize);

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

document.addEventListener("DOMContentLoaded", async () => {
    setupTabNavigation();
    // setupBusinessHoursForm();
    await fetchAndPopulateBusinessHours();
});

/**
 * Handles tab navigation between Business Details, Reviews, and Business Hours.
 */
function setupTabNavigation() {
    const tabs = document.querySelectorAll(".tab-button");
    const contents = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            const targetTab = this.getAttribute("data-tab");

            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            this.classList.add("active");
            document.getElementById(`${targetTab}-tab`).classList.add("active");
        });
    });
}

/**
 * Handles the submission of business hours.
 */
document.getElementById("businessHoursForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Collect the form data
    const opening_time = document.getElementById("opening_time").value;
    const closing_time = document.getElementById("closing_time").value;

    // Define all the days
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Collect selected days from the checked checkboxes
    const selectedDays = [];
    document.querySelectorAll('input[name="days"]:checked').forEach(checkbox => {
        selectedDays.push(checkbox.value);
        console.log(selectedDays);
    });

    // Prepare the schedule with days and times
    const schedule = allDays.map(day => {
        const isSelected = selectedDays.includes(day); // Check if the day is selected
        return {
            day: day,
            openingTime: isSelected ? opening_time : "CLOSED", // If selected, use opening time
            closingTime: isSelected ? closing_time : "CLOSED" // If selected, use closing time
        };
    });

    // Prepare the formData object to send to the backend
    const formData = {
        businessId: document.getElementById('businessId').value, // Add businessId to formData
        schedule: schedule
    };

    // Check if we need to POST (insert) or PUT (update)
    const existingHoursValue = document.getElementById("existing_hours").value;
    const method = "POST"; // Use PUT for update, POST for new

    // Send the request to the backend
    fetch("/business-hours", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData) // Send the formData as JSON
    })
        .then(response => response.json())
        .then(result => {
            manageBusinessDetailsShowModal('Business Hours updated successfully!', true);
        })
        .catch(error => {
            manageBusinessDetailsShowModal('Failed to Update Business Hours! ', false);
        });
});


/**
 * Fetches business hours and populates the form.
 */
async function fetchAndPopulateBusinessHours() {
    const businessId = document.getElementById("businessId").value;

    try {
        const response = await fetch(`/business-hours/${businessId}`);
        const businessHours = await response.json();

        if (businessHours.businessHours) {
            populateForm(businessHours.businessHours);
        }
    } catch (error) {
        console.error("Error fetching business hours:", error);
    }
}

/**
 * Populates the business hours form with fetched data.
 * @param {Array} businessHours - List of business hours from backend
 */
function populateForm(businessHours) {
    businessHours.forEach(hour => {
        const day = hour.day_of_week;
        const openingTime = hour.opening_time;
        const closingTime = hour.closing_time;

        const checkbox = document.querySelector(`input[name="days"][value="${day}"]`);
        if (checkbox) {
            checkbox.checked = openingTime !== "00:00:00" && closingTime !== "00:00:00";
        }

        if (openingTime !== "00:00:00" && closingTime !== "00:00:00") {
            document.getElementById("opening_time").value = openingTime;
            document.getElementById("closing_time").value = closingTime;
        }
    });
}


const cities = [
    "Adilabad", "Agar-Malwa", "Agra", "Ahilyanagar", "Ahmedabad", "Aizawl", "Ajmer", "Akola", "Alappuzha", "Aligarh", "Alipurduar", "Alirajpur", "Alluri Sitharama Raju", "Almora", "Alwar", "Ambala", "Ambedkar Nagar", "Amethi", "Amravati", "Amreli", "Amritsar", "Amroha", "Anakapalli", "Anand", "Ananthapuramu", "Anantnag", "Anjaw", "Annamayya", "Anugul", "Anupgarh", "Anuppur", "Araria", "Ariyalur", "Arvalli", "Arwal", "Ashoknagar", "Auraiya", "Aurangabad", "Ayodhya", "Azamgarh", "Bagalkote", "Bageshwar", "Baghpat", "Bahraich", "Bajali", "Baksa", "Balaghat", "Balangir", "Baleshwar", "Ballari", "Ballia", "Balod", "Balodabazar-Bhatapara", "Balotra", "Balrampur", "Balrampur-Ramanujganj", "Banas Kantha", "Banda", "Bandipora", "Banka", "Bankura", "Banswara", "Bapatla", "Bara Banki", "Baramulla", "Baran", "Bareilly", "Bargarh", "Barmer", "Barnala", "Barpeta", "Barwani", "Bastar", "Basti", "Bathinda", "Beawar", "Beed", "Begusarai", "Belagavi", "Bemetara", "Bengaluru Rural", "Bengaluru Urban", "Betul", "Bhadohi", "Bhadradri Kothagudem", "Bhadrak", "Bhagalpur", "Bhandara", "Bharatpur", "Bharuch", "Bhavnagar", "Bhilwara", "Bhind", "Bhiwani", "Bhojpur", "Bhopal", "Bichom", "Bidar", "Bijapur", "Bijnor", "Bikaner", "Bilaspur", "Birbhum", "Bishnupur", "Biswanath", "Bokaro", "Bongaigaon", "Botad", "Boudh", "Budaun", "Budgam", "Bulandshahr", "Buldhana", "Bundi", "Burhanpur", "Buxar", "Cachar", "Central", "Chamarajanagar", "Chamba", "Chamoli", "Champawat", "Champhai", "Chandauli", "Chandel", "Chandigarh", "Chandrapur", "Changlang", "Charaideo", "Charkhi Dadri", "Chatra", "Chengalpattu", "Chennai", "Chhatarpur", "Chhatrapati Sambhajinagar", "Chhindwara", "Chhotaudepur", "Chikkaballapura", "Chikkamagaluru", "Chirang", "Chitradurga", "Chitrakoot", "Chittoor", "Chittorgarh", "Chumoukedima", "Churachandpur", "Churu", "Coimbatore", "Cooch Behar", "Cuddalore", "Cuttack", "Dadra And Nagar Haveli", "Dahod", "Dakshin Bastar Dantewada", "Dakshin Dinajpur", "Dakshina Kannada", "Daman", "Damoh", "Dangs", "Darbhanga", "Darjeeling", "Darrang", "Datia", "Dausa", "Davanagere", "Deeg", "Dehradun", "Deogarh", "Deoghar", "Deoria", "Devbhumi Dwarka", "Dewas", "Dhalai", "Dhamtari", "Dhanbad", "Dhar", "Dharashiv", "Dharmapuri", "Dharwad", "Dhemaji", "Dhenkanal", "Dholpur", "Dhubri", "Dhule", "Dibang Valley", "Dibrugarh", "Didwana-Kuchaman", "Dima Hasao", "Dimapur", "Dindigul", "Dindori", "Diu", "Doda", "Dr. B.R. Ambedkar Konaseema", "Dudu", "Dumka", "Dungarpur", "Durg", "East", "East Garo Hills", "East Godavari", "East Jaintia Hills", "East Kameng", "East Khasi Hills", "East Siang", "East Singhbum", "Eastern West Khasi Hills", "Eluru", "Ernakulam", "Erode", "Etah", "Etawah", "Faridabad", "Faridkot", "Farrukhabad", "Fatehabad", "Fatehgarh Sahib", "Fatehpur", "Fazilka", "Ferozepur", "Firozabad", "Gadag", "Gadchiroli", "Gajapati", "Ganderbal", "Gandhinagar", "Ganganagar", "Gangapurcity", "Gangtok", "Ganjam", "Garhwa", "Gariyaband", "Gaurela-Pendra-Marwahi", "Gautam Buddha Nagar", "Gaya", "Ghaziabad", "Ghazipur", "Gir Somnath", "Giridih", "Goalpara", "Godda", "Golaghat", "Gomati", "Gonda", "Gondia", "Gopalganj", "Gorakhpur", "Gumla", "Guna", "Guntur", "Gurdaspur", "Gurugram", "Gwalior", "Gyalshing", "Hailakandi", "Hamirpur", "Hanumakonda", "Hanumangarh", "Hapur", "Harda", "Hardoi", "Haridwar", "Hassan", "Hathras", "Haveri", "Hazaribagh", "Hingoli", "Hisar", "Hnahthial", "Hojai", "Hooghly", "Hoshiarpur", "Howrah", "Hyderabad", "Idukki", "Imphal East", "Imphal West", "Indore", "Jabalpur", "Jagatsinghapur", "Jagitial", "Jaipur", "Jaipur (Gramin)", "Jaisalmer", "Jajapur", "Jalandhar", "Jalaun", "Jalgaon", "Jalna", "Jalore", "Jalpaiguri", "Jammu", "Jamnagar", "Jamtara", "Jamui", "Jangoan", "Janjgir-Champa", "Jashpur", "Jaunpur", "Jayashankar Bhupalapally", "Jehanabad", "Jhabua", "Jhajjar", "Jhalawar", "Jhansi", "Jhargram", "Jharsuguda", "Jhunjhunu", "Jind", "Jiribam", "Jodhpur", "Jodhpur (Gramin)", "Jogulamba Gadwal", "Jorhat", "Junagadh", "Kabeerdham", "Kachchh", "Kaimur (Bhabua)", "Kaithal", "Kakching", "Kakinada", "Kalaburagi", "Kalahandi", "Kalimpong", "Kallakurichi", "Kamareddy", "Kamjong", "Kamle", "Kamrup", "Kamrup Metro", "Kancheepuram", "Kandhamal", "Kangpokpi", "Kangra", "Kannauj", "Kanniyakumari", "Kannur", "Kanpur Dehat", "Kanpur Nagar", "Kapurthala", "Karaikal", "Karauli", "Karbi Anglong", "Kargil", "Karimganj", "Karimnagar", "Karnal", "Karur", "Kasaragod", "Kasganj", "Kathua", "Katihar", "Katni", "Kaushambi", "Kekri", "Kendrapara", "Kendujhar", "Keyi Panyor", "Khagaria", "Khairagarh-Chhuikhadan-Gandai", "Khairthal-Tijara", "Khammam", "Khandwa (East Nimar)", "Khargone (West Nimar)", "Khawzawl", "Kheda", "Kheri", "Khordha", "Khowai", "Khunti", "Kinnaur", "Kiphire", "Kishanganj", "Kishtwar", "Kodagu", "Koderma", "Kohima", "Kokrajhar", "Kolar", "Kolasib", "Kolhapur", "Kolkata", "Kollam", "Kondagaon", "Koppal", "Koraput", "Korba", "Korea", "Kota", "Kotputli-Behror", "Kottayam", "Kozhikode", "Kra Daadi", "Krishna", "Krishnagiri", "Kulgam", "Kullu", "Kumuram Bheem Asifabad", "Kupwara", "Kurnool", "Kurukshetra", "Kurung Kumey", "Kushinagar", "Lahaul And Spiti", "Lakhimpur", "Lakhisarai", "Lakshadweep District", "Lalitpur", "Latehar", "Latur", "Lawngtlai", "Leh Ladakh", "Leparada", "Lohardaga", "Lohit", "Longding", "Longleng", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Lucknow", "Ludhiana", "Lunglei", "Machilipatnam", "Madhepura", "Madhubani", "Madurai", "Mahabubabad", "Mahabubnagar", "Mahasamund", "Mahendragarh", "Mahisagar", "Mahoba", "Mainpuri", "Malappuram", "Malda", "Malerkotla", "Malkangiri", "Mamit", "Mandi", "Mandla", "Mandsaur", "Mandya", "Mansa", "Marigaon", "Mathura", "Mau", "Mayiladuthurai", "Mayurbhanj", "Meerut", "Mehsana", "Mewat (Nuh)", "Mirzapur", "Mithila", "Mizoram", "Modasa", "Moga", "Mokokchung", "Mon", "Moradabad", "Morbi", "Morena", "Mulugu", "Mumbai City", "Mumbai Suburban", "Munger", "Murshidabad", "Muzaffarnagar", "Muzaffarpur", "Mysuru", "Nagapattinam", "Nagaur", "Nagpur", "Nainital", "Nalanda", "Nalbari", "Namakkal", "Namsai", "Nanded", "Nandurbar", "Narayanpet", "Narmada", "Narsinghpur", "Nashik", "Navsari", "Nawada", "Nayagarh", "Neemuch", "Nellore", " Delhi", "Neyveli", "Nirmal", "Nizamabad", "North", "North Bastar Kanker", "North Dinajpur", "North Garo Hills", "North Goa", "North Lakhimpur", "North Sikkim", "North Tripura", "Nuapada", "Nuh", "Nuwakot", "Ongole", "Osmanabad", "Pakur", "Palakkad", "Palamu", "Pali", "Palwal", "Panchkula", "Panchmahal", "Panipat", "Panna", "Parbhani", "Parganas North", "Parganas South", "Parvathipuram Manyam", "Patan", "Pathanamthitta", "Pathankot", "Patiala", "Patna", "Pauri Garhwal", "Perambalur", "Peren", "Phek", "Pilibhit", "Pithoragarh", "Pondicherry", "Poonch", "Porbandar", "Prakasam", "Pratapgarh", "Prayagraj", "Pudukkottai", "Pulwama", "Pune", "Purba Bardhaman", "Purbi Singhbhum", "Puri", "Purnia", "Puttur", "Raebareli", "Raichur", "Raigad", "Raigarh", "Raipur", "Raisen", "Rajanna Sircilla", "Rajgarh", "Rajkot", "Rajnandgaon", "Rajouri", "Rajsamand", "Ramanagara", "Ramanathapuram", "Ramban", "Ramgarh", "Rampur", "Ranchi", "Ranipet", "Ratlam", "Ratnagiri", "Raver", "Rayagada", "Reasi", "Rewa", "Rewari", "Ribhoi", "Rohtak", "Rohtas", "Rudraprayag", "Rupnagar", "Sabarkantha", "Sagar", "Saharanpur", "Saharsa", "Sahibganj", "Saiha", "Salem", "Samastipur", "Samba", "Sambalpur", "Sangli", "Sangrur", "Sant Kabir Nagar", "Sant Ravidas Nagar", "Saran", "Satara", "Satna", "Sawai Madhopur", "Sehore", "Senapati", "Seoni", "Seraikela-Kharsawan", "Serchhip", "Shahdara", "Shahdol", "Shahjahanpur", "Shajapur", "Shamli", "Sheikhpura", "Sheohar", "Sheopur", "Shimla", "Shimoga", "Shivamogga", "Shivpuri", "Shravasti", "Siddharthnagar", "Siddipet", "Sidhi", "Sikar", "Simdega", "Sindhudurg", "Singrauli", "Sirmaur", "Sirohi", "Sirsa", "Sitamarhi", "Sitapur", "Sivaganga", "Siwan", "Solan", "Solapur", "Sonbhadra", "Sonipat", "South", "South Andaman", "South Bastar Dantewada", "South Dinajpur", "South Garo Hills", "South Goa", "South Sikkim", "South Tripura", "Srikakulam", "Srinagar", "Sri Ganganagar", "Sri Muktsar Sahib", "Sultanpur", "Sundargarh", "Supaul", "Surajpur", "Surat", "Surendranagar", "Surguja", "Suryapet", "Tawang", "Tehri Garhwal", "Tenkasi", "Thane", "Thanjavur", "Theni", "Thiruvananthapuram", "Thoothukudi", "Thoubal", "Thrissur", "Tikamgarh", "Tinsukia", "Tirap", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tirupati", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Tonk", "Tuensang", "Tumakuru", "Udaipur", "Udalguri", "Udham Singh Nagar", "Udhampur", "Udupi", "Ujjain", "Ukhrul", "Umaria", "Una", "Unakoti", "Unnao", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "Uttar Bastar Kanker", "Uttar Dinajpur", "Uttarkashi", "Vadodara", "Vaishali", "Valsad", "Varanasi", "Vellore", "Vidisha", "Viluppuram", "Virudhunagar", "Visakhapatnam", "Vizianagaram", "Warangal", "Wardha", "Washim", "Wayanad", "West", "West Champaran", "West Garo Hills", "West Godavari", "West Jaintia Hills", "West Kameng", "West Khasi Hills", "West Siang", "West Singhbhum", "West Sikkim", "West Tripura", "Wokha", "Yadgir", "Yadgiri", "Yamunanagar", "Yanam", "Yavatmal", "Zhemgang", "Zunheboto",
];

const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
    "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function createAutocomplete(input, suggestions) {
    // Create container for suggestions
    const container = document.createElement('div');
    container.className = 'cab-taxi-driver-forms-suggestions-container';
    input.parentNode.insertBefore(container, input);
    container.appendChild(input);

    // Create suggestions list
    const suggestionsList = document.createElement('ul');
    suggestionsList.className = 'cab-taxi-driver-forms-suggestions-list';
    container.appendChild(suggestionsList);

    // Function to highlight matching text
    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    // Function to show suggestions
    function showSuggestions(query) {
        suggestionsList.innerHTML = '';
        if (!query) {
            suggestionsList.classList.remove('active');
            return;
        }

        // Convert query to lowercase for case-insensitive comparison
        const queryLower = query.toLowerCase();

        // Separate matches into two arrays: starting matches and contains matches
        const startsWithMatches = [];
        const containsMatches = [];

        suggestions.forEach(item => {
            const itemLower = item.toLowerCase();
            if (itemLower.startsWith(queryLower)) {
                startsWithMatches.push(item);
            } else if (itemLower.includes(queryLower)) {
                containsMatches.push(item);
            }
        });

        startsWithMatches.sort();
        containsMatches.sort();

        const matches = [...startsWithMatches, ...containsMatches];

        if (matches.length > 0) {
            matches.forEach(match => {
                const li = document.createElement('li');
                li.className = 'cab-taxi-driver-forms-suggestion-item';
                li.innerHTML = highlightMatch(match, query);
                li.addEventListener('click', () => {
                    input.value = match;
                    suggestionsList.classList.remove('active');
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.classList.add('active');
        } else {
            suggestionsList.classList.remove('active');
        }
    }

    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            showSuggestions(input.value);
        }, 150); 
    });

    let selectedIndex = -1;
    input.addEventListener('keydown', (e) => {
        const items = suggestionsList.getElementsByClassName('cab-taxi-driver-forms-suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
            updateSelection(items);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            if (items[selectedIndex]) {
                input.value = items[selectedIndex].textContent;
                suggestionsList.classList.remove('active');
                selectedIndex = -1;
            }
        } else if (e.key === 'Escape') {
            suggestionsList.classList.remove('active');
            selectedIndex = -1;
        }
    });

    function updateSelection(items) {
        Array.from(items).forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            suggestionsList.classList.remove('active');
            selectedIndex = -1;
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('businessCity');
    const stateInput = document.getElementById('businessState');
    
    if (cityInput && stateInput) {
        createAutocomplete(cityInput, cities);
        createAutocomplete(stateInput, states);
    }
});
function updateBusinessDetails(event) {
    if (event) event.preventDefault(); // Prevent form submission if inside <form>

    const formData = new FormData();

    const businessId = document.getElementById('businessId').value;
    if (!businessId) {
        alert('Business ID is missing!');
        return;
    }

    const ownerId = document.getElementById('ownerId').value;

    // Capitalize the business name, address, category, state, city, overview, and usp
    const businessName = capitalizeFirstLetter(document.getElementById('businessName').value);
    const address = capitalizeFirstLetter(document.getElementById('businessAddress').value);
    const category = capitalizeFirstLetter(document.getElementById('businessCategory').value);
    const phone = document.getElementById('businessPhone').value; // Phone usually remains as it is
    const website = document.getElementById('businessWebsite').value;
    const city = capitalizeFirstLetter(document.getElementById('businessCity').value);
    const state = capitalizeFirstLetter(document.getElementById('businessState').value);
    const overview = capitalizeFirstLetter(document.getElementById('businessOverview').value);
    const usp = capitalizeFirstLetter(document.getElementById('businessUsp').value);

    formData.append('businessId', businessId);
    formData.append('ownerId', ownerId);
    formData.append('businessName', businessName);
    formData.append('address', address);
    formData.append('category', category);
    formData.append('phone', phone);
    formData.append('website', website);
    formData.append('city', city.trim());
    formData.append('state', state.trim());
    formData.append('overview', overview);
    formData.append('usp', usp);

    // Append services and explicitly set them to empty string if removed
    const services = ['businessService1', 'businessService2', 'businessService3', 'businessService4'];
    services.forEach(service => {
        const serviceValue = document.getElementById(service).value.trim();
        if (serviceValue) {
            formData.append(service, serviceValue);
        } else {
            formData.append(service, ''); // Explicitly set to empty string if service is removed/empty
        }
    });

    // Append thumbnail image to FormData (single image)
    const thumbnail = document.getElementById('thumbnail').files[0];
    if (thumbnail) {
        formData.append('thumbnail', thumbnail);
    }

    // Append other images to FormData
    const images = document.getElementById('images').files;
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    // Send the PUT request to update business details
    fetch('/update-business', {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            manageBusinessDetailsShowModal('Business details updated successfully!', true);
            setTimeout(() => {
                window.location.reload();
            }, 3000); // Reload after 3 seconds for better UX
        } else {
            manageBusinessDetailsShowModal(`Failed to update business: ${data.message}`, false);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        manageBusinessDetailsShowModal('An error occurred while updating business details', false);
    });
    
    
}

function manageBusinessDetailsShowModal(message, isSuccess = true) {
    const modal = document.getElementById('manage-business-details-successModal');
    const messageElement = document.getElementById('manage-business-details-modalMessage');
    const iconElement = document.getElementById('manage-business-details-modalIcon');

    if (messageElement) {
        messageElement.innerHTML = message; // Set dynamic message
    }

    // Change icon based on success or error
    if (iconElement) {
        if (isSuccess) {
            iconElement.innerHTML = "✔"; // Success checkmark
            iconElement.style.color = "#4CAF50"; // Green color for success
        } else {
            iconElement.innerHTML = "Error!"; // Error cross mark
            iconElement.style.color = "#F44336"; // Red color for errors
        }
    }

    modal.style.display = 'block';

    // Close modal when clicking on "X"
    document.querySelector('.manage-business-details-close').onclick = function () {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Auto-hide modal after 3 seconds
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

