// Modal Functionality
function openImageModal(imageSrc) {
    const modal = document.getElementById('pink-drivers-profile-for-viewers-image-modal');
    const modalImg = document.getElementById('pink-drivers-profile-for-viewers-modal-image');
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('pink-drivers-profile-for-viewers-image-modal');
    const modalImg = document.getElementById('pink-drivers-profile-for-viewers-modal-image');
    modal.style.display = 'none';
    modalImg.src = '';
    document.body.style.overflow = '';
}

// Event Listeners for Modal
document.addEventListener('DOMContentLoaded', function() {
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const imageModal = document.getElementById('pink-drivers-profile-for-viewers-image-modal');
        if (e.target === imageModal || e.target.classList.contains('pink-drivers-profile-for-viewers-close-modal')) {
            closeImageModal();
        }
    });

    // Close modals with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });

    // Search and Filter Functionality Setup
    const searchInput = document.getElementById('pink-drivers-profile-for-viewers-searchInput');
    const experienceFilter = document.getElementById('pink-drivers-profile-for-viewers-experienceFilter');
    const ratingFilter = document.getElementById('pink-drivers-profile-for-viewers-ratingFilter');
    const driversGrid = document.getElementById('pink-drivers-profile-for-viewers-driversGrid');

    // Show loading state
    function showLoading() {
        driversGrid.innerHTML = '';
        const template = document.getElementById('pink-drivers-profile-for-viewers-skeletonTemplate');
        for (let i = 0; i < 6; i++) {
            driversGrid.appendChild(template.content.cloneNode(true));
        }
    }

    // Filter drivers
    function filterDrivers() {
        const searchTerm = searchInput.value.toLowerCase();
        const expValue = experienceFilter.value;
        const ratingValue = parseFloat(ratingFilter.value) || 0;

        const cards = document.querySelectorAll('.pink-drivers-profile-for-viewers-driver-profile-card');
        cards.forEach(card => {
            const name = card.querySelector('.pink-drivers-profile-for-viewers-driver-name').textContent.toLowerCase();
            const vehicleNum = card.querySelector('.pink-drivers-profile-for-viewers-detail-item:nth-child(3) span').textContent.toLowerCase();
            const experience = parseInt(card.querySelector('.pink-drivers-profile-for-viewers-detail-item:nth-child(2) span').textContent);
            const rating = parseFloat(card.querySelector('.pink-drivers-profile-for-viewers-rating-value').textContent);

            const matchesSearch = name.includes(searchTerm) || vehicleNum.includes(searchTerm);
            const matchesExp = !expValue || 
                (expValue === '0-2' && experience <= 2) ||
                (expValue === '3-5' && experience > 2 && experience <= 5) ||
                (expValue === '5+' && experience > 5);
            const matchesRating = rating >= ratingValue;

            card.style.display = matchesSearch && matchesExp && matchesRating ? 'block' : 'none';
        });
    }

    // Add event listeners for filters
    searchInput.addEventListener('input', filterDrivers);
    experienceFilter.addEventListener('change', filterDrivers);
    ratingFilter.addEventListener('change', filterDrivers);

    // Initialize with loading state
    showLoading();
    setTimeout(() => {
        driversGrid.innerHTML = driversGrid.getAttribute('data-original-content');
    }, 1000);
});

// City Search and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cities = [
        "Adilabad", "Agar-Malwa", "Agra", "Ahilyanagar", "Ahmedabad", "Aizawl", "Ajmer", "Akola", "Alappuzha", "Aligarh", "Alipurduar", "Alirajpur", "Alluri Sitharama Raju", "Almora", "Alwar", "Ambala", "Ambedkar Nagar", "Amethi", "Amravati", "Amreli", "Amritsar", "Amroha", "Anakapalli", "Anand", "Ananthapuramu", "Anantnag", "Anjaw", "Annamayya", "Anugul", "Anupgarh", "Anuppur", "Araria", "Ariyalur", "Arvalli", "Arwal", "Ashoknagar", "Auraiya", "Aurangabad", "Ayodhya", "Azamgarh", "Bagalkote", "Bageshwar", "Baghpat", "Bahraich", "Bajali", "Baksa", "Balaghat", "Balangir", "Baleshwar", "Ballari", "Ballia", "Balod", "Balodabazar-Bhatapara", "Balotra", "Balrampur", "Balrampur-Ramanujganj", "Banas Kantha", "Banda", "Bandipora", "Banka", "Bankura", "Banswara", "Bapatla", "Bara Banki", "Baramulla", "Baran", "Bareilly", "Bargarh", "Barmer", "Barnala", "Barpeta", "Barwani", "Bastar", "Basti", "Bathinda", "Beawar", "Beed", "Begusarai", "Belagavi", "Bemetara", "Bengaluru Rural", "Bengaluru Urban", "Betul", "Bhadohi", "Bhadrak", "Bhagalpur", "Bhandara", "Bharatpur", "Bharuch", "Bhavnagar", "Bhavnagar", "Bhilwara", "Bhind", "Bhiwani", "Bhojpur", "Bhopal", "Bichom", "Bidar", "Bijapur", "Bijnor", "Bikaner", "Bilaspur", "Birbhum", "Bishnupur", "Biswanath", "Bokaro", "Bongaigaon", "Botad", "Boudh", "Budaun", "Budgam", "Bulandshahr", "Buldhana", "Bundi", "Burhanpur", "Buxar", "Cachar", "Central", "Chamarajanagar", "Chamba", "Chamoli", "Champawat", "Champhai", "Chandauli", "Chandel", "Chandigarh", "Chandrapur", "Changlang", "Charaideo", "Charkhi Dadri", "Chatra", "Chengalpattu", "Chennai", "Chhatarpur", "Chhatrapati Sambhajinagar", "Chhindwara", "Chhotaudepur", "Chikkaballapura", "Chikkamagaluru", "Chirang", "Chitradurga", "Chitrakoot", "Chittoor", "Chittorgarh", "Chumoukedima", "Churachandpur", "Churu", "Coimbatore", "Cooch Behar", "Cuddalore", "Cuttack", "Dadra And Nagar Haveli", "Dahod", "Dakshin Bastar Dantewada", "Dakshin Dinajpur", "Dakshina Kannada", "Daman", "Damoh", "Dangs", "Darbhanga", "Darjeeling", "Darrang", "Datia", "Dausa", "Davanagere", "Deeg", "Dehradun", "Deogarh", "Deoghar", "Deoria", "Devbhumi Dwarka", "Dewas", "Dhalai", "Dhamtari", "Dhanbad", "Dhar", "Dharashiv", "Dharmapuri", "Dharwad", "Dhemaji", "Dhenkanal", "Dholpur", "Dhubri", "Dhule", "Dibang Valley", "Dibrugarh", "Didwana-Kuchaman", "Dima Hasao", "Dimapur", "Dindigul", "Dindori", "Diu", "Doda", "Dr. B.R. Ambedkar Konaseema", "Dudu", "Dumka", "Dungarpur", "Durg", "East", "East Garo Hills", "East Godavari", "East Jaintia Hills", "East Kameng", "East Khasi Hills", "East Siang", "East Singhbum", "Eastern West Khasi Hills", "Eluru", "Ernakulam", "Erode", "Etah", "Etawah", "Faridabad", "Faridkot", "Farrukhabad", "Fatehabad", "Fatehgarh Sahib", "Fatehpur", "Fazilka", "Ferozepur", "Firozabad", "Gadag", "Gadchiroli", "Gajapati", "Ganderbal", "Gandhinagar", "Ganganagar", "Gangapurcity", "Gangtok", "Ganjam", "Garhwa", "Gariyaband", "Gaurela-Pendra-Marwahi", "Gautam Buddha Nagar", "Gaya", "Ghaziabad", "Ghazipur", "Gir Somnath", "Giridih", "Goalpara", "Godda", "Golaghat", "Gomati", "Gonda", "Gondia", "Gopalganj", "Gorakhpur", "Gumla", "Guna", "Guntur", "Gurdaspur", "Gurugram", "Gwalior", "Gyalshing", "Hailakandi", "Hamirpur", "Hanumakonda", "Hanumangarh", "Hapur", "Harda", "Hardoi", "Haridwar", "Hassan", "Hathras", "Haveri", "Hazaribagh", "Hingoli", "Hisar", "Hnahthial", "Hojai", "Hooghly", "Hoshiarpur", "Howrah", "Hyderabad", "Idukki", "Imphal East", "Imphal West", "Indore", "Jabalpur", "Jagatsinghapur", "Jagitial", "Jaipur", "Jaipur (Gramin)", "Jaisalmer", "Jajapur", "Jalandhar", "Jalaun", "Jalgaon", "Jalna", "Jalore", "Jalpaiguri", "Jammu", "Jamnagar", "Jamtara", "Jamui", "Jangoan", "Janjgir-Champa", "Jashpur", "Jaunpur", "Jayashankar Bhupalapally", "Jehanabad", "Jhabua", "Jhajjar", "Jhalawar", "Jhansi", "Jhargram", "Jharsuguda", "Jhunjhunu", "Jind", "Jiribam", "Jodhpur", "Jodhpur (Gramin)", "Jogulamba Gadwal", "Jorhat", "Junagadh", "Kabeerdham", "Kachchh", "Kaimur (Bhabua)", "Kaithal", "Kakching", "Kakinada", "Kalaburagi", "Kalahandi", "Kalimpong", "Kallakurichi", "Kamareddy", "Kamjong", "Kamle", "Kamrup", "Kamrup Metro", "Kancheepuram", "Kandhamal", "Kangpokpi", "Kangra", "Kannauj", "Kanniyakumari", "Kannur", "Kanpur Dehat", "Kanpur Nagar", "Kapurthala", "Karaikal", "Karauli", "Karbi Anglong", "Kargil", "Karimganj", "Karimnagar", "Karnal", "Karur", "Kasaragod", "Kasganj", "Kathua", "Katihar", "Katni", "Kaushambi", "Kekri", "Kendrapara", "Kendujhar", "Keyi Panyor", "Khagaria", "Khairagarh-Chhuikhadan-Gandai", "Khairthal-Tijara", "Khammam", "Khandwa (East Nimar)", "Khargone (West Nimar)", "Khawzawl", "Kheda", "Kheri", "Khordha", "Khowai", "Khunti", "Kinnaur", "Kiphire", "Kishanganj", "Kishtwar", "Kodagu", "Koderma", "Kohima", "Kokrajhar", "Kolar", "Kolasib", "Kolhapur", "Kolkata", "Kollam", "Kondagaon", "Koppal", "Koraput", "Korba", "Korea", "Kota", "Kotputli-Behror", "Kottayam", "Kozhikode", "Kra Daadi", "Krishna", "Krishnagiri", "Kulgam", "Kullu", "Kumuram Bheem Asifabad", "Kupwara", "Kurnool", "Kurukshetra", "Kurung Kumey", "Kushinagar", "Lahaul And Spiti", "Lakhimpur", "Lakhisarai", "Lakshadweep District", "Lalitpur", "Latehar", "Latur", "Lawngtlai", "Leh Ladakh", "Leparada", "Lohardaga", "Lohit", "Longding", "Longleng", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Lucknow", "Ludhiana", "Lunglei", "Machilipatnam", "Madhepura", "Madhubani", "Madurai", "Mahabubabad", "Mahabubnagar", "Mahasamund", "Mahendragarh", "Mahisagar", "Mahoba", "Mainpuri", "Malappuram", "Malda", "Malerkotla", "Malkangiri", "Mamit", "Mandi", "Mandla", "Mandsaur", "Mandya", "Mansa", "Marigaon", "Mathura", "Mau", "Mayiladuthurai", "Mayurbhanj", "Meerut", "Mehsana", "Mewat (Nuh)", "Mirzapur", "Mithila", "Mizoram", "Modasa", "Moga", "Mokokchung", "Mon", "Moradabad", "Morbi", "Morena", "Mulugu", "Mumbai City", "Mumbai Suburban", "Munger", "Murshidabad", "Muzaffarnagar", "Muzaffarpur", "Mysuru", "Nagapattinam", "Nagaur", "Nagpur", "Nainital", "Nalanda", "Nalbari", "Namakkal", "Namsai", "Nanded", "Nandurbar", "Narayanpet", "Narmada", "Narsinghpur", "Nashik", "Navsari", "Nawada", "Nayagarh", "Neemuch", "Nellore", "New Delhi", "Neyveli", "Nirmal", "Nizamabad", "North", "North Bastar Kanker", "North Dinajpur", "North Garo Hills", "North Goa", "North Lakhimpur", "North Sikkim", "North Tripura", "Nuapada", "Nuh", "Nuwakot", "Ongole", "Osmanabad", "Pakur", "Palakkad", "Palamu", "Pali", "Palwal", "Panchkula", "Panchmahal", "Panipat", "Panna", "Parbhani", "Parganas North", "Parganas South", "Parvathipuram Manyam", "Patan", "Pathanamthitta", "Pathankot", "Patiala", "Patna", "Pauri Garhwal", "Perambalur", "Peren", "Phek", "Pilibhit", "Pithoragarh", "Pondicherry", "Poonch", "Porbandar", "Prakasam", "Pratapgarh", "Prayagraj", "Pudukkottai", "Pulwama", "Pune", "Purba Bardhaman", "Purbi Singhbhum", "Puri", "Purnia", "Puttur", "Raebareli", "Raichur", "Raigad", "Raigarh", "Raipur", "Raisen", "Rajanna Sircilla", "Rajgarh", "Rajkot", "Rajnandgaon", "Rajouri", "Rajsamand", "Ramanagara", "Ramanathapuram", "Ramban", "Ramgarh", "Rampur", "Ranchi", "Ranipet", "Ratlam", "Ratnagiri", "Raver", "Rayagada", "Reasi", "Rewa", "Rewari", "Ribhoi", "Rohtak", "Rohtas", "Rudraprayag", "Rupnagar", "Sabarkantha", "Sagar", "Saharanpur", "Saharsa", "Sahibganj", "Saiha", "Salem", "Samastipur", "Samba", "Sambalpur", "Sangli", "Sangrur", "Sant Kabir Nagar", "Sant Ravidas Nagar", "Saran", "Satara", "Satna", "Sawai Madhopur", "Sehore", "Senapati", "Seoni", "Seraikela-Kharsawan", "Serchhip", "Shahdara", "Shahdol", "Shahjahanpur", "Shajapur", "Shamli", "Sheikhpura", "Sheohar", "Sheopur", "Shimla", "Shimoga", "Shivamogga", "Shivpuri", "Shravasti", "Siddharthnagar", "Siddipet", "Sidhi", "Sikar", "Simdega", "Sindhudurg", "Singrauli", "Sirmaur", "Sirohi", "Sirsa", "Sitamarhi", "Sitapur", "Sivaganga", "Siwan", "Solan", "Solapur", "Sonbhadra", "Sonipat", "South", "South Andaman", "South Bastar Dantewada", "South Dinajpur", "South Garo Hills", "South Goa", "South Sikkim", "South Tripura", "Srikakulam", "Srinagar", "Sri Ganganagar", "Sri Muktsar Sahib", "Sultanpur", "Sundargarh", "Supaul", "Surajpur", "Surat", "Surendranagar", "Surguja", "Suryapet", "Tawang", "Tehri Garhwal", "Tenkasi", "Thane", "Thanjavur", "Theni", "Thiruvananthapuram", "Thoothukudi", "Thoubal", "Thrissur", "Tikamgarh", "Tinsukia", "Tirap", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tirupati", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Tonk", "Tuensang", "Tumakuru", "Udaipur", "Udalguri", "Udham Singh Nagar", "Udhampur", "Udupi", "Ujjain", "Ukhrul", "Umaria", "Una", "Unakoti", "Unnao", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "Uttar Bastar Kanker", "Uttar Dinajpur", "Uttarkashi", "Vadodara", "Vaishali", "Valsad", "Varanasi", "Vellore", "Vidisha", "Viluppuram", "Virudhunagar", "Visakhapatnam", "Vizianagaram", "Warangal", "Wardha", "Washim", "Wayanad", "West", "West Champaran", "West Garo Hills", "West Godavari", "West Jaintia Hills", "West Kameng", "West Khasi Hills", "West Siang", "West Singhbum", "West Sikkim", "West Tripura", "Wokha", "Yadgir", "Yadgiri", "Yamunanagar", "Yanam", "Yavatmal", "Zhemgang", "Zunheboto",
    ];

    const citySearch = document.getElementById('pink-drivers-profile-for-viewers-city-search');
    const suggestionsContainer = document.getElementById('pink-drivers-profile-for-viewers-city-suggestions');
    
    function highlightMatch(city, inputValue) {
        if (!inputValue) return city;
        
        const lowerCity = city.toLowerCase();
        const lowerInput = inputValue.toLowerCase();
        let result = '';
        let lastIndex = 0;
        
        // Find all matches (case-insensitive)
        const matches = [...lowerCity.matchAll(new RegExp(lowerInput.split('').join('|'), 'gi'))];
        
        // Sort matches by index to process them in order
        matches.sort((a, b) => a.index - b.index);
        
        // Build the highlighted string
        matches.forEach(match => {
            const matchIndex = match.index;
            // Add non-matching text before this match
            result += city.slice(lastIndex, matchIndex);
            // Add the matching character with highlighting
            result += `<span class="pink-drivers-profile-for-viewers-highlight">${city[matchIndex]}</span>`;
            lastIndex = matchIndex + 1;
        });
        
        // Add any remaining text after the last match
        result += city.slice(lastIndex);
        
        return result;
    }

    function showSuggestions(inputValue) {
        const matchingCities = cities.filter(city => 
            city.toLowerCase().includes(inputValue.toLowerCase())
        ).sort((a, b) => {
            // Prioritize cities that start with the input value
            const aStartsWith = a.toLowerCase().startsWith(inputValue.toLowerCase());
            const bStartsWith = b.toLowerCase().startsWith(inputValue.toLowerCase());
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return a.localeCompare(b);
        });

        if (matchingCities.length > 0 && inputValue.length > 0) {
            suggestionsContainer.innerHTML = matchingCities
                .map(city => `<div class="pink-drivers-profile-for-viewers-suggestion-item">${highlightMatch(city, inputValue)}</div>`)
                .join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    function filterDrivers(selectedCity) {
        const cards = document.querySelectorAll('.pink-drivers-profile-for-viewers-driver-profile-card');
        cards.forEach(card => {
            const cityElement = card.querySelector('.pink-drivers-profile-for-viewers-city');
            if (cityElement) {
                const cardCity = cityElement.textContent;
                if (!selectedCity || cardCity.toLowerCase().includes(selectedCity.toLowerCase())) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    // Event Listeners
    citySearch.addEventListener('input', (e) => {
        showSuggestions(e.target.value);
        filterDrivers(e.target.value);
    });

    suggestionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('pink-drivers-profile-for-viewers-suggestion-item')) {
            citySearch.value = e.target.textContent;
            suggestionsContainer.style.display = 'none';
            filterDrivers(citySearch.value);
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && e.target !== citySearch) {
            suggestionsContainer.style.display = 'none';
        }
    });

    // Vehicle type filter functionality
    const vehicleTypeSelect = document.getElementById('pink-drivers-profile-for-viewers-vehicle-type');
    
    function updateVehicleIcon(vehicleType) {
        const icon = vehicleType === 'bike' ? 'fa-motorcycle' : 'fa-car';
        return `<i class="fas ${icon}"></i>`;
    }

    vehicleTypeSelect.addEventListener('change', () => {
        const selectedVehicle = vehicleTypeSelect.value;
        const drivers = document.querySelectorAll('.pink-drivers-profile-for-viewers-driver-profile-card');
        
        drivers.forEach(driver => {
            const vehicleTypeElement = driver.querySelector('.pink-drivers-profile-for-viewers-vehicle-type');
            if (!selectedVehicle || vehicleTypeElement.textContent.toLowerCase() === selectedVehicle) {
                driver.style.display = '';
            } else {
                driver.style.display = 'none';
            }
        });
    });
});
