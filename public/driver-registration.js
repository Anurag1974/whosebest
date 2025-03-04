// Sample data for cities and states
const cities = [
    "Adilabad", "Agar-Malwa", "Agra", "Ahilyanagar", "Ahmedabad", "Aizawl", "Ajmer", "Akola", "Alappuzha", "Aligarh", "Alipurduar", "Alirajpur", "Alluri Sitharama Raju", "Almora", "Alwar", "Ambala", "Ambedkar Nagar", "Amethi", "Amravati", "Amreli", "Amritsar", "Amroha", "Anakapalli", "Anand", "Ananthapuramu", "Anantnag", "Anjaw", "Annamayya", "Anugul", "Anupgarh", "Anuppur", "Araria", "Ariyalur", "Arvalli", "Arwal", "Ashoknagar", "Auraiya", "Aurangabad", "Ayodhya", "Azamgarh", "Bagalkote", "Bageshwar", "Baghpat", "Bahraich", "Bajali", "Baksa", "Balaghat", "Balangir", "Baleshwar", "Ballari", "Ballia", "Balod", "Balodabazar-Bhatapara", "Balotra", "Balrampur", "Balrampur-Ramanujganj", "Banas Kantha", "Banda", "Bandipora", "Banka", "Bankura", "Banswara", "Bapatla", "Bara Banki", "Baramulla", "Baran", "Bareilly", "Bargarh", "Barmer", "Barnala", "Barpeta", "Barwani", "Bastar", "Basti", "Bathinda", "Beawar", "Beed", "Begusarai", "Belagavi", "Bemetara", "Bengaluru Rural", "Bengaluru Urban", "Betul", "Bhadohi", "Bhadradri Kothagudem", "Bhadrak", "Bhagalpur", "Bhandara", "Bharatpur", "Bharuch", "Bhavnagar", "Bhilwara", "Bhind", "Bhiwani", "Bhojpur", "Bhopal", "Bichom", "Bidar", "Bijapur", "Bijnor", "Bikaner", "Bilaspur", "Birbhum", "Bishnupur", "Biswanath", "Bokaro", "Bongaigaon", "Botad", "Boudh", "Budaun", "Budgam", "Bulandshahr", "Buldhana", "Bundi", "Burhanpur", "Buxar", "Cachar", "Central", "Chamarajanagar", "Chamba", "Chamoli", "Champawat", "Champhai", "Chandauli", "Chandel", "Chandigarh", "Chandrapur", "Changlang", "Charaideo", "Charkhi Dadri", "Chatra", "Chengalpattu", "Chennai", "Chhatarpur", "Chhatrapati Sambhajinagar", "Chhindwara", "Chhotaudepur", "Chikkaballapura", "Chikkamagaluru", "Chirang", "Chitradurga", "Chitrakoot", "Chittoor", "Chittorgarh", "Chumoukedima", "Churachandpur", "Churu", "Coimbatore", "Cooch Behar", "Cuddalore", "Cuttack", "Dadra And Nagar Haveli", "Dahod", "Dakshin Bastar Dantewada", "Dakshin Dinajpur", "Dakshina Kannada", "Daman", "Damoh", "Dangs", "Darbhanga", "Darjeeling", "Darrang", "Datia", "Dausa", "Davanagere", "Deeg", "Dehradun", "Deogarh", "Deoghar", "Deoria", "Devbhumi Dwarka", "Dewas", "Dhalai", "Dhamtari", "Dhanbad", "Dhar", "Dharashiv", "Dharmapuri", "Dharwad", "Dhemaji", "Dhenkanal", "Dholpur", "Dhubri", "Dhule", "Dibang Valley", "Dibrugarh", "Didwana-Kuchaman", "Dima Hasao", "Dimapur", "Dindigul", "Dindori", "Diu", "Doda", "Dr. B.R. Ambedkar Konaseema", "Dudu", "Dumka", "Dungarpur", "Durg", "East", "East Garo Hills", "East Godavari", "East Jaintia Hills", "East Kameng", "East Khasi Hills", "East Siang", "East Singhbum", "Eastern West Khasi Hills", "Eluru", "Ernakulam", "Erode", "Etah", "Etawah", "Faridabad", "Faridkot", "Farrukhabad", "Fatehabad", "Fatehgarh Sahib", "Fatehpur", "Fazilka", "Ferozepur", "Firozabad", "Gadag", "Gadchiroli", "Gajapati", "Ganderbal", "Gandhinagar", "Ganganagar", "Gangapurcity", "Gangtok", "Ganjam", "Garhwa", "Gariyaband", "Gaurela-Pendra-Marwahi", "Gautam Buddha Nagar", "Gaya", "Ghaziabad", "Ghazipur", "Gir Somnath", "Giridih", "Goalpara", "Godda", "Golaghat", "Gomati", "Gonda", "Gondia", "Gopalganj", "Gorakhpur", "Gumla", "Guna", "Guntur", "Gurdaspur", "Gurugram", "Gwalior", "Gyalshing", "Hailakandi", "Hamirpur", "Hanumakonda", "Hanumangarh", "Hapur", "Harda", "Hardoi", "Haridwar", "Hassan", "Hathras", "Haveri", "Hazaribagh", "Hingoli", "Hisar", "Hnahthial", "Hojai", "Hooghly", "Hoshiarpur", "Howrah", "Hyderabad", "Idukki", "Imphal East", "Imphal West", "Indore", "Jabalpur", "Jagatsinghapur", "Jagitial", "Jaipur", "Jaipur (Gramin)", "Jaisalmer", "Jajapur", "Jalandhar", "Jalaun", "Jalgaon", "Jalna", "Jalore", "Jalpaiguri", "Jammu", "Jamnagar", "Jamtara", "Jamui", "Jangoan", "Janjgir-Champa", "Jashpur", "Jaunpur", "Jayashankar Bhupalapally", "Jehanabad", "Jhabua", "Jhajjar", "Jhalawar", "Jhansi", "Jhargram", "Jharsuguda", "Jhunjhunu", "Jind", "Jiribam", "Jodhpur", "Jodhpur (Gramin)", "Jogulamba Gadwal", "Jorhat", "Junagadh", "Kabeerdham", "Kachchh", "Kaimur (Bhabua)", "Kaithal", "Kakching", "Kakinada", "Kalaburagi", "Kalahandi", "Kalimpong", "Kallakurichi", "Kamareddy", "Kamjong", "Kamle", "Kamrup", "Kamrup Metro", "Kancheepuram", "Kandhamal", "Kangpokpi", "Kangra", "Kannauj", "Kanniyakumari", "Kannur", "Kanpur Dehat", "Kanpur Nagar", "Kapurthala", "Karaikal", "Karauli", "Karbi Anglong", "Kargil", "Karimganj", "Karimnagar", "Karnal", "Karur", "Kasaragod", "Kasganj", "Kathua", "Katihar", "Katni", "Kaushambi", "Kekri", "Kendrapara", "Kendujhar", "Keyi Panyor", "Khagaria", "Khairagarh-Chhuikhadan-Gandai", "Khairthal-Tijara", "Khammam", "Khandwa (East Nimar)", "Khargone (West Nimar)", "Khawzawl", "Kheda", "Kheri", "Khordha", "Khowai", "Khunti", "Kinnaur", "Kiphire", "Kishanganj", "Kishtwar", "Kodagu", "Koderma", "Kohima", "Kokrajhar", "Kolar", "Kolasib", "Kolhapur", "Kolkata", "Kollam", "Kondagaon", "Koppal", "Koraput", "Korba", "Korea", "Kota", "Kotputli-Behror", "Kottayam", "Kozhikode", "Kra Daadi", "Krishna", "Krishnagiri", "Kulgam", "Kullu", "Kumuram Bheem Asifabad", "Kupwara", "Kurnool", "Kurukshetra", "Kurung Kumey", "Kushinagar", "Lahaul And Spiti", "Lakhimpur", "Lakhisarai", "Lakshadweep District", "Lalitpur", "Latehar", "Latur", "Lawngtlai", "Leh Ladakh", "Leparada", "Lohardaga", "Lohit", "Longding", "Longleng", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Lucknow", "Ludhiana", "Lunglei", "Machilipatnam", "Madhepura", "Madhubani", "Madurai", "Mahabubabad", "Mahabubnagar", "Mahasamund", "Mahendragarh", "Mahisagar", "Mahoba", "Mainpuri", "Malappuram", "Malda", "Malerkotla", "Malkangiri", "Mamit", "Mandi", "Mandla", "Mandsaur", "Mandya", "Mansa", "Marigaon", "Mathura", "Mau", "Mayiladuthurai", "Mayurbhanj", "Meerut", "Mehsana", "Mewat (Nuh)", "Mirzapur", "Mithila", "Mizoram", "Modasa", "Moga", "Mokokchung", "Mon", "Moradabad", "Morbi", "Morena", "Mulugu", "Mumbai City", "Mumbai Suburban", "Munger", "Murshidabad", "Muzaffarnagar", "Muzaffarpur", "Mysuru", "Nagapattinam", "Nagaur", "Nagpur", "Nainital", "Nalanda", "Nalbari", "Namakkal", "Namsai", "Nanded", "Nandurbar", "Narayanpet", "Narmada", "Narsinghpur", "Nashik", "Navsari", "Nawada", "Nayagarh", "Neemuch", "Nellore", "Delhi", "Neyveli", "Nirmal", "Nizamabad", "North", "North Bastar Kanker", "North Dinajpur", "North Garo Hills", "North Goa", "North Lakhimpur", "North Sikkim", "North Tripura", "Nuapada", "Nuh", "Nuwakot", "Ongole", "Osmanabad", "Pakur", "Palakkad", "Palamu", "Pali", "Palwal", "Panchkula", "Panchmahal", "Panipat", "Panna", "Parbhani", "Parganas North", "Parganas South", "Parvathipuram Manyam", "Patan", "Pathanamthitta", "Pathankot", "Patiala", "Patna", "Pauri Garhwal", "Perambalur", "Peren", "Phek", "Pilibhit", "Pithoragarh", "Pondicherry", "Poonch", "Porbandar", "Prakasam", "Pratapgarh", "Prayagraj", "Pudukkottai", "Pulwama", "Pune", "Purba Bardhaman", "Purbi Singhbhum", "Puri", "Purnia", "Puttur", "Raebareli", "Raichur", "Raigad", "Raigarh", "Raipur", "Raisen", "Rajanna Sircilla", "Rajgarh", "Rajkot", "Rajnandgaon", "Rajouri", "Rajsamand", "Ramanagara", "Ramanathapuram", "Ramban", "Ramgarh", "Rampur", "Ranchi", "Ranipet", "Ratlam", "Ratnagiri", "Raver", "Rayagada", "Reasi", "Rewa", "Rewari", "Ribhoi", "Rohtak", "Rohtas", "Rudraprayag", "Rupnagar", "Sabarkantha", "Sagar", "Saharanpur", "Saharsa", "Sahibganj", "Saiha", "Salem", "Samastipur", "Samba", "Sambalpur", "Sangli", "Sangrur", "Sant Kabir Nagar", "Sant Ravidas Nagar", "Saran", "Satara", "Satna", "Sawai Madhopur", "Sehore", "Senapati", "Seoni", "Seraikela-Kharsawan", "Serchhip", "Shahdara", "Shahdol", "Shahjahanpur", "Shajapur", "Shamli", "Sheikhpura", "Sheohar", "Sheopur", "Shimla", "Shimoga", "Shivamogga", "Shivpuri", "Shravasti", "Siddharthnagar", "Siddipet", "Sidhi", "Sikar", "Simdega", "Sindhudurg", "Singrauli", "Sirmaur", "Sirohi", "Sirsa", "Sitamarhi", "Sitapur", "Sivaganga", "Siwan", "Solan", "Solapur", "Sonbhadra", "Sonipat", "South", "South Andaman", "South Bastar Dantewada", "South Dinajpur", "South Garo Hills", "South Goa", "South Sikkim", "South Tripura", "Srikakulam", "Srinagar", "Sri Ganganagar", "Sri Muktsar Sahib", "Sultanpur", "Sundargarh", "Supaul", "Surajpur", "Surat", "Surendranagar", "Surguja", "Suryapet", "Tawang", "Tehri Garhwal", "Tenkasi", "Thane", "Thanjavur", "Theni", "Thiruvananthapuram", "Thoothukudi", "Thoubal", "Thrissur", "Tikamgarh", "Tinsukia", "Tirap", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tirupati", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Tonk", "Tuensang", "Tumakuru", "Udaipur", "Udalguri", "Udham Singh Nagar", "Udhampur", "Udupi", "Ujjain", "Ukhrul", "Umaria", "Una", "Unakoti", "Unnao", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "Uttar Bastar Kanker", "Uttar Dinajpur", "Uttarkashi", "Vadodara", "Vaishali", "Valsad", "Varanasi", "Vellore", "Vidisha", "Viluppuram", "Virudhunagar", "Visakhapatnam", "Vizianagaram", "Warangal", "Wardha", "Washim", "Wayanad", "West", "West Champaran", "West Garo Hills", "West Godavari", "West Jaintia Hills", "West Kameng", "West Khasi Hills", "West Siang", "West Singhbhum", "West Sikkim", "West Tripura", "Wokha", "Yadgir", "Yadgiri", "Yamunanagar", "Yanam", "Yavatmal", "Zhemgang", "Zunheboto",
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
    const cityInput = document.getElementById('cab-taxi-driver-forms-city');
    const stateInput = document.getElementById('cab-taxi-driver-forms-state');
    
    if (cityInput && stateInput) {
        createAutocomplete(cityInput, cities);
        createAutocomplete(stateInput, states);
    }
});



// Ensure reset button properly resets the form and disables the submit button
function resetForm() {
    setTimeout(() => {
        document.getElementById("register-btn").disabled = true;
        document.getElementById("register-btn").style.backgroundColor = "grey";
        document.getElementById("register-btn").style.cursor = "not-allowed";
        document.getElementById("register-btn").style.opacity = "0.6";
    }, 10);
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form"); // Selects the form
    const submitBtn = document.getElementById("register-btn");
    const requiredFields = form.querySelectorAll("[required]");

    function checkFormValidity() {
        let isValid = true;

        requiredFields.forEach(field => {
            if ((field.type === "checkbox" && !field.checked) || (field.type !== "checkbox" && !field.value.trim())) {
                isValid = false;
            }
        });

        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = "#2196F3"; 
            submitBtn.style.cursor = "pointer";
            submitBtn.style.opacity = "1";
        } else {
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = "grey"; 
            submitBtn.style.cursor = "not-allowed";
            submitBtn.style.opacity = "0.6";
        }
    }

    requiredFields.forEach(field => {
        field.addEventListener("input", checkFormValidity);
        field.addEventListener("change", checkFormValidity);
    });

    document.querySelector(".cab-taxi-driver-forms-reset-btn").addEventListener("click", function () {
        setTimeout(() => {
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = "grey";
            submitBtn.style.cursor = "not-allowed";
            submitBtn.style.opacity = "0.6";
        }, 10);
    });

    checkFormValidity();
});

// async function registerDriver() {
//     const formData = new FormData();

//     // Capitalize name and location fields
//     const driverUserId = document.getElementById('cab-taxi-driver-forms-user-id').value;
//     const name = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-name').value);
//     const phoneNumber = document.getElementById('cab-taxi-driver-forms-phone').value;
//     const email = document.getElementById('cab-taxi-driver-forms-email').value;
//     const age = document.getElementById('cab-taxi-driver-forms-age').value;
//     const gender = document.getElementById('cab-taxi-driver-forms-gender').value;
//     const experience = document.getElementById('cab-taxi-driver-forms-experience').value;
//     const city = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-city').value);
//     const state = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-state').value);
    
//     const vehicleType = document.getElementById('cab-taxi-driver-forms-vehicle-type').value;
//     const vehicleName = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-vehicle-name').value);
//     const licensePlate = document.getElementById('cab-taxi-driver-forms-license-plate').value;
    
//     const currentAddress = document.getElementById('cab-taxi-driver-forms-current-address').value;
//     const licenseAddress = document.getElementById('cab-taxi-driver-forms-license-address').value;
//     const licenseNumber = document.getElementById('cab-taxi-driver-forms-license-number').value;
    
//     // Append basic info
//     formData.append('driverUserId', driverUserId);
//     formData.append('name', name);
//     formData.append('phoneNumber', phoneNumber);
//     formData.append('email', email);
//     formData.append('age', age);
//     formData.append('gender', gender);
//     formData.append('experience', experience);
//     formData.append('city', city);
//     formData.append('state', state);

//     // Append vehicle details
//     formData.append('vehicleType', vehicleType);
//     formData.append('vehicleName', vehicleName);
//     formData.append('licensePlate', licensePlate);

//     // Append address details
//     formData.append('currentAddress', currentAddress);
//     formData.append('licenseAddress', licenseAddress);
//     formData.append('licenseNumber', licenseNumber);

//     // Append images
//     const vehicleImage = document.getElementById('cab-taxi-driver-forms-vehicle-image').files[0];
//     const licenseFront = document.getElementById('cab-taxi-driver-forms-license-front').files[0];
//     const licenseBack = document.getElementById('cab-taxi-driver-forms-license-back').files[0];
//     const driverPhoto = document.getElementById('cab-taxi-driver-forms-driver-photo').files[0];

//     // Debugging: Log file selection
//     console.log("📸 Vehicle Image:", vehicleImage ? vehicleImage.name : "❌ Not selected");
//     console.log("📜 License Front:", licenseFront ? licenseFront.name : "❌ Not selected");
//     console.log("📜 License Back:", licenseBack ? licenseBack.name : "❌ Not selected");
//     console.log("🧑 Driver Photo:", driverPhoto ? driverPhoto.name : "❌ Not selected");

//     if (vehicleImage) formData.append('vehicleImage', vehicleImage);
//     if (licenseFront) formData.append('licenseFront', licenseFront);
//     if (licenseBack) formData.append('licenseBack', licenseBack);
//     if (driverPhoto) formData.append('driverPhoto', driverPhoto);

//     // Debugging: Log form data values before sending
//     console.log("📤 Sending FormData:", [...formData.entries()]);

//     try {
//         console.log("📤 Sending request to /update-driver...");
        
//         const res = await fetch('/update-driver', {
//             method: 'PUT',
//             body: formData, // Do NOT add headers for FormData
//         });

//         console.log("🌍 API Response Status:", res.status);
//         console.log("📥 Response Headers:", res.headers.get("content-type"));

//         // Read response as text first
//         const text = await res.text();
//         console.log("📝 Raw Response:", text);
    
//         let data;
//         try {
//             data = JSON.parse(text);
//         } catch (error) {
//             console.error("❌ JSON Parse Error:", error, "Raw Text:", text);
//             return;
//         }

//         console.log("✅ API Response Data:", data);
//         alert(JSON.stringify(data, null, 2)); // Fix alert showing [object Object]

//         if (res.status === 201 && data.success) {
//             alert('Driver registered successfully!');
//             window.location.href = data.redirectUrl;
//         } else {
//             console.error("❌ API Error:", data);
//         }
//     } catch (error) {
//         console.error("❌ Fetch Error:", error);
//     }
// }

async function registerDriver(event) {
    event.preventDefault();

    const driverUserId= document.getElementById('cab-taxi-driver-forms-user-id').value;
    const name = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-name').value);
    const phone = document.getElementById('cab-taxi-driver-forms-phone').value.trim();
    const email = document.getElementById('cab-taxi-driver-forms-email').value.trim();
    const age = document.getElementById('cab-taxi-driver-forms-age').value;
    const gender = document.getElementById('cab-taxi-driver-forms-gender').value;
    const experience = document.getElementById('cab-taxi-driver-forms-experience').value;
    const city = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-city').value);
    const state = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-state').value);
    const vehicleType = document.getElementById('cab-taxi-driver-forms-vehicle-type').value;
    const vehicleName = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-vehicle-name').value);
    const licensePlate = document.getElementById('cab-taxi-driver-forms-license-plate').value;
    const currentAddress = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-current-address').value);
    const licenseAddress = capitalizeFirstLetter(document.getElementById('cab-taxi-driver-forms-license-address').value);
    const licenseNumber = document.getElementById('cab-taxi-driver-forms-license-number').value;

    const vehicleImage = document.getElementById('cab-taxi-driver-forms-vehicle-image').files[0];
    const licenseFront = document.getElementById('cab-taxi-driver-forms-license-front').files[0];
    const licenseBack = document.getElementById('cab-taxi-driver-forms-license-back').files[0];
    const driverPhoto = document.getElementById('cab-taxi-driver-forms-driver-photo').files[0];

    if (!name || !phone || !email || !age || !gender || !experience || !city || !state ||
        !vehicleType || !vehicleName || !licensePlate || !currentAddress || !licenseAddress ||
        !licenseNumber || !vehicleImage || !licenseFront || !licenseBack || !driverPhoto) {
        registerDriverShowModal('All fields are required.', false);
        return;
    }

    const formData = new FormData();
    formData.append('driverUserId', driverUserId);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('experience', experience);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('vehicleType', vehicleType);
    formData.append('vehicleName', vehicleName);
    formData.append('licensePlate', licensePlate);
    formData.append('currentAddress', currentAddress);
    formData.append('licenseAddress', licenseAddress);
    formData.append('licenseNumber', licenseNumber);
    formData.append('vehicleImage', vehicleImage);
    formData.append('licenseFront', licenseFront);
    formData.append('licenseBack', licenseBack);
    formData.append('driverPhoto', driverPhoto);

    const submitButton = document.getElementById('register-btn');
    submitButton.disabled = true;

    try {
        const res = await fetch('/update-driver', {
            method: 'PUT',
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            registerDriverShowModal('Driver registered successfully', true);
            setTimeout(() => {
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                } else {
                    location.reload();
                }
            }, 3000);
        } else {
            const errorData = await res.json();
            registerDriverShowModal(`Failed to register driver: ${errorData.message}`, false);
        }
    } catch (error) {
        console.error('Error:', error);
        registerDriverShowModal('An error occurred while registering the driver', false);
    } finally {
        submitButton.disabled = false;
    }
}

// Attach the function to the form submission event
document.querySelector('.cab-taxi-driver-forms-registration-form').addEventListener('submit', registerDriver);


// Enable submit button when terms are agreed
// document.getElementById('register-driver-term-and-condition').addEventListener('change', function () {
//     document.getElementById('register-btn').disabled = !this.checked;
// });

function registerDriverShowModal(message, isSuccess = true) {
    const modal = document.getElementById('register-driver-successModal');
    const messageElement = document.getElementById('register-driver-modalMessage');
    const iconElement = document.getElementById('register-driver-modalIcon');

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

    document.querySelector('.register-driver-close').onclick = function () {
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

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById('cab-taxi-driver-forms-vehicle-image');
    
    const wrapper = document.querySelector('.cab-taxi-driver-forms-file-input-wrapper');
    const fileNameSpan = document.getElementById('file-name');

    // Open file picker only when clicking the wrapper (not the input itself)
    wrapper.addEventListener("click", function (event) {
        if (event.target !== input) {
            input.value = ''; // Reset input to allow re-selecting the same file
            input.click(); // Open file picker
        }
    });

    // Display selected file name
    input.addEventListener("change", function () {
        if (input.files.length > 0) {
            fileNameSpan.textContent = input.files[0].name; // Show selected file name
        } else {
            fileNameSpan.textContent = "Choose File"; // Reset text if no file selected
        }
    });

    // Prevent double-click issue by stopping event propagation
    input.addEventListener("click", function (event) {
        event.stopPropagation(); // Stop the click from bubbling up to the wrapper
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById('cab-taxi-driver-forms-license-front');
    
    const wrapper = document.querySelector('.cab-taxi-driver-forms-file-input-wrapper');
    const fileNameSpan = document.getElementById('file-name-license');

    // Open file picker only when clicking the wrapper (not the input itself)
    wrapper.addEventListener("click", function (event) {
        if (event.target !== input) {
            input.value = ''; // Reset input to allow re-selecting the same file
            input.click(); // Open file picker
        }
    });

    // Display selected file name
    input.addEventListener("change", function () {
        if (input.files.length > 0) {
            fileNameSpan.textContent = input.files[0].name; // Show selected file name
        } else {
            fileNameSpan.textContent = "Choose File"; // Reset text if no file selected
        }
    });

    // Prevent double-click issue by stopping event propagation
    input.addEventListener("click", function (event) {
        event.stopPropagation(); // Stop the click from bubbling up to the wrapper
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById('cab-taxi-driver-forms-license-back');
    
    const wrapper = document.querySelector('.cab-taxi-driver-forms-file-input-wrapper');
    const fileNameSpan = document.getElementById('file-name-license-back');

    // Open file picker only when clicking the wrapper (not the input itself)
    wrapper.addEventListener("click", function (event) {
        if (event.target !== input) {
            input.value = ''; // Reset input to allow re-selecting the same file
            input.click(); // Open file picker
        }
    });

    // Display selected file name
    input.addEventListener("change", function () {
        if (input.files.length > 0) {
            fileNameSpan.textContent = input.files[0].name; // Show selected file name
        } else {
            fileNameSpan.textContent = "Choose File"; // Reset text if no file selected
        }
    });

    // Prevent double-click issue by stopping event propagation
    input.addEventListener("click", function (event) {
        event.stopPropagation(); // Stop the click from bubbling up to the wrapper
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById('cab-taxi-driver-forms-driver-photo');
    
    const wrapper = document.querySelector('.cab-taxi-driver-forms-file-input-wrapper');
    const fileNameSpan = document.getElementById('file-name-driver-photo');

    // Open file picker only when clicking the wrapper (not the input itself)
    wrapper.addEventListener("click", function (event) {
        if (event.target !== input) {
            input.value = ''; // Reset input to allow re-selecting the same file
            input.click(); // Open file picker
        }
    });

    // Display selected file name
    input.addEventListener("change", function () {
        if (input.files.length > 0) {
            fileNameSpan.textContent = input.files[0].name; // Show selected file name
        } else {
            fileNameSpan.textContent = "Choose File"; // Reset text if no file selected
        }
    });

    // Prevent double-click issue by stopping event propagation
    input.addEventListener("click", function (event) {
        event.stopPropagation(); // Stop the click from bubbling up to the wrapper
    });
});



document.getElementById('cab-taxi-driver-forms-vehicle-image').addEventListener('change', checkFileSize);
document.getElementById('cab-taxi-driver-forms-license-back').addEventListener('change', checkFileSize3);
document.getElementById('cab-taxi-driver-forms-license-front').addEventListener('change', checkFileSize2);
document.getElementById('cab-taxi-driver-forms-driver-photo').addEventListener('change', checkFileSize4);

function checkFileSize(event) {
    const file = event.target.files[0];
    if (file && file.size > 3 * 1024 * 1024) { // 3MB in bytes
        // Prevent form submission if file is too large
        event.preventDefault();

        // Show toast message
        const toast = document.getElementById('toast1');
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
function checkFileSize2(event) {
    const file = event.target.files[0];
    if (file && file.size > 3 * 1024 * 1024) { // 3MB in bytes
        // Prevent form submission if file is too large
        event.preventDefault();

        // Show toast message
        const toast = document.getElementById('toast2');
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
function checkFileSize3(event) {
    const file = event.target.files[0];
    if (file && file.size > 3 * 1024 * 1024) { // 3MB in bytes
        // Prevent form submission if file is too large
        event.preventDefault();

        // Show toast message
        const toast = document.getElementById('toast3');
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
function checkFileSize4(event) {
    const file = event.target.files[0];
    if (file && file.size > 3 * 1024 * 1024) { // 3MB in bytes
        // Prevent form submission if file is too large
        event.preventDefault();

        // Show toast message
        const toast = document.getElementById('toast4');
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