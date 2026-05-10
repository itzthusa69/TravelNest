


// Destination of day
let places = [];
let destinations = [];


// Newsletter

function saveEmail() {
    var emailEl = document.getElementById("email");
    if (!emailEl) return;

    var email = emailEl.value;

    if (email == "") {
        alert("Enter Email");
    } else {
        localStorage.setItem("newsletter", email);
        alert("Subscribed Successfully");
    }
}

// Data Management
function getTravelData() {
    var data = localStorage.getItem("travelData");
    if (data) {
        return JSON.parse(data);
    }
    return { budget: [], wishlist: [], mood: [] };
}

function saveTravelData(data) {
    localStorage.setItem("travelData", JSON.stringify(data));
}

//Budget Planner
let finalTotal = 0;
let finalPlace = "";

function calculateBudget() {

    var placeEl = document.getElementById("destination");
    var daysEl = document.getElementById("days");
    var dailyEl = document.getElementById("dailyBudget");

    if (!placeEl || !daysEl || !dailyEl) return;

    var place = placeEl.value;
    var days = Number(daysEl.value);
    var daily = Number(dailyEl.value);

    if (place == "" || days <= 0 || daily <= 0) {
        alert("Please complete all fields.");
        return;
    }

    finalTotal = days * daily;
    finalPlace = place;

    document.getElementById("tripText").innerText =
        "Trip to " + place + " for " + days + " days";

    document.getElementById("totalCost").innerText = "$" + finalTotal;

    let status = "";
    let width = 0;

    if (daily < 80) {
        status = "Low Budget";
        width = 35;
    }
    else if (daily >= 80 && daily < 180) {
        status = "Moderate Budget";
        width = 65;
    }
    else {
        status = "Luxury Budget";
        width = 100;
    }

    document.getElementById("budgetStatus").innerText =
        "Status: " + status;

    document.getElementById("progressBar").style.width = width + "%";

}



function saveTrip() {

    if (finalTotal == 0) {
        alert("Calculate a budget first.");
        return;
    }

    var data = getTravelData();

    var newTrip = {
        destination: finalPlace,
        total: finalTotal
    };

    data.budget.push(newTrip);
    saveTravelData(data);

    showSavedTrips(data.budget);

    alert("Trip budget saved!");

}

// Display all saved trips
function showSavedTrips(trips) {

    var box = document.getElementById("savedTrip");
    if (!box) return;

    if (trips.length == 0) {
        box.innerText = "No saved trips yet.";
        return;
    }

    var text = "";
    for (var i = 0; i < trips.length; i++) {
        text = text + (i + 1) + ". " + trips[i].destination + " - $" + trips[i].total + "\n";
    }

    box.innerText = text;

}

// Load all data when page opens
window.addEventListener("load", function () {
    var data = getTravelData();
    showSavedTrips(data.budget);
    showWishlist(data.wishlist);
    showTravelStatus(data.mood);

    // Fetch country data from JSON
    fetch("countries.json")
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            places = data.places;
            tripList = data.tripList;
            destinations = data.destinations || [];

            // Set daily destination if element exists
            var today = new Date().getDate();
            var destEl = document.getElementById("dailyDestination");
            if (destEl && places.length > 0) {
                destEl.innerText = places[today % places.length];
            }

            // If on explorer page, display destination cards
            var cardContainer = document.getElementById("cardContainer");
            if (cardContainer && destinations.length > 0) {
                displayCards(destinations);
            }

            // Start slideshow if on home page
            if (document.getElementById("slideImg")) {
                slideTimer = setInterval(nextSlide, 5000);
            }
        })
        .catch(function (err) {
            console.error("Error loading JSON:", err);
        });
});

// Mobile menu toggle
function toggleMenu() {
    var nav = document.querySelector(".nav-links");
    if (nav) {
        nav.classList.toggle("active");
    }
}

// --- Home Page Functions ---

var quotes = [
    "Travel is the only thing you buy that makes you richer.",
    "The world is a book and those who do not travel read only one page.",
    "Adventure is worthwhile.",
    "Travel far enough, you meet yourself.",
    "Jobs fill your pocket, adventures fill your soul."
];

function changeQuote() {
    var quoteEl = document.getElementById("quote");
    if (!quoteEl) return;
    var random = Math.floor(Math.random() * quotes.length);
    quoteEl.innerText = quotes[random];
}

var currentSlide = 0;
var slideTimer;

function nextSlide() {
    currentSlide++;
    if (currentSlide >= destinations.length) {
        currentSlide = 0;
    }
    updateSlide();
}

function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = destinations.length - 1;
    }
    updateSlide();
}

function updateSlide() {
    var item = destinations[currentSlide];
    if (!item) return;

    var imgEl = document.getElementById("slideImg");
    var titleEl = document.getElementById("slideTitle");
    var descEl = document.getElementById("slideDesc");

    if (imgEl && titleEl && descEl) {
        var imgName = item.image ? item.image : item.name + ".png";
        imgEl.src = "pictures/" + imgName;
        titleEl.innerText = item.name;
        descEl.innerText = item.description;
    }

    // Reset timer
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 5000);
}

// --- Explorer Page Functions ---

function displayCards(list) {
    var container = document.getElementById("cardContainer");
    if (!container) return;

    var output = "";
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var index = i;
        
        // Use custom image name if it exists, otherwise use the default name.png
        var imgName = item.image ? item.image : item.name + ".png";

        output += "<div class=\"destination-card\" onclick=\"openModal(" + index + ")\">" +
            "<div class=\"card-img-wrapper\">" +
            "<img src=\"pictures/" + imgName + "\" alt=\"" + item.name + "\" onerror=\"this.style.display='none'; this.parentElement.style.background='#334155';\">" +
            "</div>" +
            "<div class=\"card-info\">" +
            "<h3>" + item.name + "</h3>" +
            "<p>" + item.continent + "</p>" +
            "</div>" +
            "</div>";
    }

    container.innerHTML = output;
}

function filterDestinations() {
    var text = document.getElementById("searchInput").value.toLowerCase();
    var continent = document.getElementById("continentFilter").value;

    var filtered = [];
    for (var i = 0; i < destinations.length; i++) {
        var item = destinations[i];
        var matchName = item.name.toLowerCase().includes(text);
        var matchContinent = (continent == "all" || item.continent == continent);
        
        if (matchName && matchContinent) {
            filtered.push(item);
        }
    }

    displayCards(filtered);
}

function openModal(index) {
    var item = destinations[index];
    if (!item) return;

    document.getElementById("modal").style.display = "flex";
    document.getElementById("modalTitle").innerText = item.name + ", " + item.continent;
    document.getElementById("modalDescription").innerText = item.description;

    var list = "";
    for (var i = 0; i < item.attractions.length; i++) {
        var place = item.attractions[i];
        list += "<li>" + place + "</li>";
    }
    document.getElementById("attractionList").innerHTML = list;

    document.getElementById("budgetCost").innerText = item.budget;
    document.getElementById("standardCost").innerText = item.standard;
    document.getElementById("luxuryCost").innerText = item.luxury;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// Close modal when clicking outside
window.addEventListener("click", function (event) {
    var modal = document.getElementById("modal");
    if (modal && event.target == modal) {
        modal.style.display = "none";
    }
});

//random 
var tripList = [];

function generateTrip() {

    var typeEl = document.getElementById("travelType");
    var budgetEl = document.getElementById("budgetRange");

    if (!typeEl || !budgetEl) return;

    var type = typeEl.value;
    var budget = budgetEl.value;

    if (type == "" || budget == "") {
        alert("Please select travel type and budget.");
        return;
    }

    var filtered = [];
    for (var i = 0; i < tripList.length; i++) {
        if (tripList[i].type == type && tripList[i].budget == budget) {
            filtered.push(tripList[i]);
        }
    }

    if (filtered.length == 0) {
        document.getElementById("tripResult").innerText = "No Match Found";
        return;
    }

    var random = Math.floor(Math.random() * filtered.length);
    var result = filtered[random].name;

    document.getElementById("tripResult").innerText = result;

}

function surpriseMe() {
    var random = Math.floor(Math.random() * tripList.length);
    var result = tripList[random].name;
    document.getElementById("tripResult").innerText = result;
}

function saveWishlist() {

    var place = document.getElementById("tripResult").innerText;

    if (place == "Click Generate" || place == "No Match Found") {
        alert("Generate a trip first.");
        return;
    }

    var data = getTravelData();

    // Don't add duplicates
    var alreadySaved = false;
    for (var i = 0; i < data.wishlist.length; i++) {
        if (data.wishlist[i] == place) {
            alreadySaved = true;
        }
    }

    if (alreadySaved) {
        alert(place + " is already in your wishlist.");
        return;
    }

    data.wishlist.push(place);
    saveTravelData(data);

    showWishlist(data.wishlist);
    alert("Saved to wishlist!");

}

function showWishlist(list) {

    var box = document.getElementById("wishlistText");
    if (!box) return;

    if (list.length == 0) {
        box.innerText = "No saved destination yet.";
        return;
    }

    var text = "";
    for (var i = 0; i < list.length; i++) {
        text = text + (i + 1) + ". " + list[i] + "\n";
    }

    box.innerText = text;

}

//mood
function stopSounds() {

    var beach = document.getElementById("beachSound");
    var forest = document.getElementById("forestSound");

    if (beach) {
        beach.pause();
        beach.currentTime = 0;
    }

    if (forest) {
        forest.pause();
        forest.currentTime = 0;
    }

}

function playBeach() {
    stopSounds();

    var beach = document.getElementById("beachSound");
    if (beach) {
        beach.play();
    }
}

function playForest() {
    stopSounds();

    var forest = document.getElementById("forestSound");
    if (forest) {
        forest.play();
    }
}



function saveTravelStatus() {

    var placeEl = document.getElementById("placeName");
    var statusEl = document.getElementById("travelStatus");
    if (!placeEl || !statusEl) return;

    var place = placeEl.value;
    var status = statusEl.value;

    if (place == "" || status == "") {
        alert("Please complete all fields.");
        return;
    }

    var item = place + " - " + status;

    var data = getTravelData();

    // Check duplicates
    var alreadySaved = false;
    for (var i = 0; i < data.mood.length; i++) {
        if (data.mood[i] == item) {
            alreadySaved = true;
        }
    }

    if (alreadySaved) {
        alert("This location is already saved.");
        return;
    }

    data.mood.push(item);
    saveTravelData(data);

    showTravelStatus(data.mood);

    alert("Saved successfully.");

}

function showTravelStatus(list) {

    var box = document.getElementById("travelResult");
    if (!box) return;

    if (list.length == 0) {
        box.innerText = "No places added yet.";
        return;
    }

    var text = "";
    for (var i = 0; i < list.length; i++) {
        text = text + (i + 1) + ". " + list[i] + "\n";
    }

    box.innerText = text;

}

function submitFeedback() {

    var nameEl = document.getElementById("userName");
    var emailEl = document.getElementById("userEmail");
    var messageEl = document.getElementById("userMessage");

    if (!nameEl || !emailEl || !messageEl) return;

    var name = nameEl.value.trim();
    var email = emailEl.value.trim();
    var message = messageEl.value.trim();

    if (name == "" || email == "" || message == "") {
        alert("Please fill all fields.");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Enter a valid email.");
        return;
    }

    var feedbackData = {
        name: name,
        email: email,
        message: message
    };

    localStorage.setItem(
        "userFeedback",
        JSON.stringify(feedbackData)
    );

    alert("Thank you! Your feedback was submitted.");

    document.getElementById("userName").value = "";
    document.getElementById("userEmail").value = "";
    document.getElementById("userMessage").value = "";

}

function toggleFAQ(index) {

    var answers = document.querySelectorAll(".faq-answer");

    for (var i = 0; i < answers.length; i++) {
        var item = answers[i];
        if (i == index) {
            if (item.style.display == "block") {
                item.style.display = "none";
            } else {
                item.style.display = "block";
            }
        } else {
            item.style.display = "none";
        }
    }

}