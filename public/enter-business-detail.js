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
    const cityInput = document.getElementById('add-city');
    const stateInput = document.getElementById('add-state');
    
    if (cityInput && stateInput) {
        createAutocomplete(cityInput, cities);
        createAutocomplete(stateInput, states);
    }
});

async function addBusinessDetails() {
    let businessName = document.getElementById('business-name').value;
    businessName = capitalizeFirstLetter(businessName); // Capitalize business name

    const address = document.getElementById('address').value;
    const category = document.getElementById('business-category').value;
    const phone = document.getElementById('phone').value;
    const state = document.getElementById('add-state').value;
    const city = document.getElementById('add-city').value;
    const website = document.getElementById('website').value;
    const evCharging = document.getElementById('ev-charging').value;
    const womenOwned = document.getElementById('women-owned').value;

    // Capitalizing fields
    const capitalizedState = state;
    const capitalizedCity = city;
    const capitalizedCategory = capitalizeFirstLetter(category);
    const capitalizedPhone = phone.trim();
    const capitalizedAddress = capitalizeFirstLetter(address);
    const capitalizedEvCharging = capitalizeFirstLetter(evCharging);
    const capitalizedWomenOwned = capitalizeFirstLetter(womenOwned);

    if (!businessName || !capitalizedCity || !capitalizedState || !capitalizedAddress || !capitalizedPhone || !capitalizedCategory || !capitalizedEvCharging || !capitalizedWomenOwned) {
        enterBusinessDetailsShowModal('All fields are required except website', false); // Show error popup
        return;
    }

    const formData = new FormData();
    formData.append('businessName', businessName);
    formData.append('address', capitalizedAddress);
    formData.append('category', capitalizedCategory);
    formData.append('phone', capitalizedPhone);
    formData.append('evCharging', capitalizedEvCharging);
    formData.append('womenOwned', capitalizedWomenOwned);
    formData.append('city', capitalizedCity);
    formData.append('state', capitalizedState);

    if (website) {
        formData.append('website', website);
    }

    console.log(formData);

    const url = '/list-business';
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            enterBusinessDetailsShowModal('Business details added successfully!', true); // Success popup

            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = data.redirectUrl;
            }, 3000);
        } else {
            const errorData = await res.json();
            enterBusinessDetailsShowModal(`Failed to add business: ${errorData.message}`, false); // Error popup
        }
    } catch (error) {
        console.error('Error:', error);
        enterBusinessDetailsShowModal('An error occurred while adding business details', false); // Error popup
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".enter-business-detail-dropdown-btn");
    const dropdownList = document.querySelector(".enter-business-detail-dropdown-list");
    const hiddenInput = document.querySelector("#business-category");
    
    // Toggle dropdown on button click
    dropdownBtn.addEventListener("click", function () {
        dropdownList.style.display = dropdownList.style.display === "block" ? "none" : "block";
    });

    // Select an option
    dropdownList.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", function () {
            dropdownBtn.textContent = this.textContent; // Change button text
            hiddenInput.value = this.dataset.value; // Store value in hidden input
            dropdownList.style.display = "none"; // Hide dropdown
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!dropdownBtn.contains(event.target) && !dropdownList.contains(event.target)) {
            dropdownList.style.display = "none";
        }
    });
});

function enterBusinessDetailsShowModal(message, isSuccess = true) {
    const modal = document.getElementById('enter-business-details-successModal');
    const messageElement = document.getElementById('enter-business-details-modalMessage');
    const iconElement = document.getElementById('enter-business-details-modalIcon');

    if (messageElement) {
        messageElement.innerHTML = `<strong>Enter Business Details -</strong> ${message}`;
    }

    // Set success or error icon
    if (iconElement) {
        if (isSuccess) {
            iconElement.innerHTML = "✔"; // Green tick for success
            iconElement.style.color = "#4CAF50"; // Green color
        } else {
            iconElement.innerHTML = "Error!"; // Red cross for error
            iconElement.style.color = "#F44336"; // Red color
        }
    }

    modal.style.display = 'block';

    // Close modal when clicking on "X"
    document.querySelector('.enter-business-details-close').onclick = function () {
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
