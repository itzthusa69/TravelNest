


// Destination of day
let places = [];


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

function calculateBudget(){

var placeEl = document.getElementById("destination");
var daysEl = document.getElementById("days");
var dailyEl = document.getElementById("dailyBudget");

if(!placeEl || !daysEl || !dailyEl) return;

var place = placeEl.value;
var days = Number(daysEl.value);
var daily = Number(dailyEl.value);

if(place == "" || days <= 0 || daily <= 0){
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

if(daily < 80){
    status = "Low Budget";
    width = 35;
}
else if(daily >= 80 && daily < 180){
    status = "Moderate Budget";
    width = 65;
}
else{
    status = "Luxury Budget";
    width = 100;
}

document.getElementById("budgetStatus").innerText =
"Status: " + status;

document.getElementById("progressBar").style.width = width + "%";

}



function saveTrip(){

if(finalTotal == 0){
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
function showSavedTrips(trips){

var box = document.getElementById("savedTrip");
if(!box) return;

if(trips.length == 0){
    box.innerText = "No saved trips yet.";
    return;
}

var text = "";
for(var i = 0; i < trips.length; i++){
    text = text + (i + 1) + ". " + trips[i].destination + " - $" + trips[i].total + "\n";
}

box.innerText = text;

}

// Load all data when page opens
window.addEventListener("load", function(){
    var data = getTravelData();
    showSavedTrips(data.budget);
    showWishlist(data.wishlist);
    showTravelStatus(data.mood);

    // Fetch country data from JSON
    fetch("countries.json")
        .then(res => res.json())
        .then(data => {
            places = data.places;
            tripList = data.tripList;

            // Set daily destination if element exists
            let today = new Date().getDate();
            var destEl = document.getElementById("dailyDestination");
            if (destEl && places.length > 0) {
                destEl.innerText = places[today % places.length];
            }
        })
        .catch(err => console.error("Error loading JSON:", err));
});

// Mobile menu toggle
function toggleMenu() {
    var nav = document.getElementById("navLinks");
    if (nav.classList.contains("active")) {
        nav.classList.remove("active");
    } else {
        nav.classList.add("active");
    }
}

//random 
let tripList = [];

function generateTrip(){

var typeEl = document.getElementById("travelType");
var budgetEl = document.getElementById("budgetRange");

if(!typeEl || !budgetEl) return;

var type = typeEl.value;
var budget = budgetEl.value;

if(type == "" || budget == ""){
    alert("Please select travel type and budget.");
    return;
}

var filtered = [];
for(var i = 0; i < tripList.length; i++){
    if(tripList[i].type == type && tripList[i].budget == budget){
        filtered.push(tripList[i]);
    }
}

if(filtered.length == 0){
    document.getElementById("tripResult").innerText = "No Match Found";
    return;
}

var random = Math.floor(Math.random() * filtered.length);
var result = filtered[random].name;

document.getElementById("tripResult").innerText = result;

}

function surpriseMe(){
    var random = Math.floor(Math.random() * tripList.length);
    var result = tripList[random].name;
    document.getElementById("tripResult").innerText = result;
}

function saveWishlist(){

var place = document.getElementById("tripResult").innerText;

if(place == "Click Generate" || place == "No Match Found"){
    alert("Generate a trip first.");
    return;
}

var data = getTravelData();

// Don't add duplicates
var alreadySaved = false;
for(var i = 0; i < data.wishlist.length; i++){
    if(data.wishlist[i] == place){
        alreadySaved = true;
    }
}

if(alreadySaved){
    alert(place + " is already in your wishlist.");
    return;
}

data.wishlist.push(place);
saveTravelData(data);

showWishlist(data.wishlist);
alert("Saved to wishlist!");

}

function showWishlist(list){

var box = document.getElementById("wishlistText");
if(!box) return;

if(list.length == 0){
    box.innerText = "No saved destination yet.";
    return;
}

var text = "";
for(var i = 0; i < list.length; i++){
    text = text + (i + 1) + ". " + list[i] + "\n";
}

box.innerText = text;

}

//mood
function stopSounds(){

let beach = document.getElementById("beachSound");
let forest = document.getElementById("forestSound");

if(beach){
beach.pause();
beach.currentTime = 0;
}

if(forest){
forest.pause();
forest.currentTime = 0;
}

}

function playBeach(){
stopSounds();

let beach = document.getElementById("beachSound");
if(beach){
beach.play();
}
}

function playForest(){
stopSounds();

let forest = document.getElementById("forestSound");
if(forest){
forest.play();
}
}



function saveTravelStatus(){

var placeEl = document.getElementById("placeName");
var statusEl = document.getElementById("travelStatus");
if(!placeEl || !statusEl) return;

var place = placeEl.value;
var status = statusEl.value;

if(place == "" || status == ""){
    alert("Please complete all fields.");
    return;
}

var item = place + " - " + status;

var data = getTravelData();

// Check duplicates
var alreadySaved = false;
for(var i = 0; i < data.mood.length; i++){
    if(data.mood[i] == item){
        alreadySaved = true;
    }
}

if(alreadySaved){
    alert("This location is already saved.");
    return;
}

data.mood.push(item);
saveTravelData(data);

showTravelStatus(data.mood);

alert("Saved successfully.");

}

function showTravelStatus(list){

var box = document.getElementById("travelResult");
if(!box) return;

if(list.length == 0){
    box.innerText = "No places added yet.";
    return;
}

var text = "";
for(var i = 0; i < list.length; i++){
    text = text + (i + 1) + ". " + list[i] + "\n";
}

box.innerText = text;

}

function submitFeedback(){

let nameEl = document.getElementById("userName");
let emailEl = document.getElementById("userEmail");
let messageEl = document.getElementById("userMessage");

if (!nameEl || !emailEl || !messageEl) return;

let name = nameEl.value.trim();
let email = emailEl.value.trim();
let message = messageEl.value.trim();

if(name == "" || email == "" || message == ""){
alert("Please fill all fields.");
return;
}

if(!email.includes("@") || !email.includes(".")){
alert("Enter a valid email.");
return;
}

let feedbackData = {
name:name,
email:email,
message:message
};

localStorage.setItem(
"userFeedback",
JSON.stringify(feedbackData)
);

document.getElementById("formResult").innerText =
"Thank you! Your feedback was submitted.";

document.getElementById("userName").value = "";
document.getElementById("userEmail").value = "";
document.getElementById("userMessage").value = "";

}

function toggleFAQ(index){

let answers = document.querySelectorAll(".faq-answer");

answers.forEach(function(item,i){

if(i == index){

if(item.style.display == "block"){
item.style.display = "none";
}else{
item.style.display = "block";
}

}else{
item.style.display = "none";
}

});

}