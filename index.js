const userTab = document.querySelector("[data-userWeather]");
const searchTab =document.querySelector("[data-searchWeather]"); 
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForms]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
//initially variables needed??
let currentTab = userTab;
const api_key = "d1845658f92b31c64bd94f06f7188c9c";
const API_KEY ="b78de9d7f83ce7d4aa962c3f50ac145f";
currentTab.classList.add("current-tab");
//ek kaam or pending hai
getfromSessionStorage();
function switchTab(clickedTab){
 if(clickedTab != currentTab){
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        //main phle search wale tab pr tha,ab your weather tab visible karna hai
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        //ab main your weather tab mai aa gya hu,toh weather bhi display karna padega,so lets check local storage first
        //for co-ordinates,if we have saved them there
        getfromSessionStorage();
    }
 }

}


userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});
//check if co-ordinates are already present in session storage
function getfromSessionStorage(){
   const localCoordinates = sessionStorage.getItem("user-coordinates");
   if(!localCoordinates){
    //agar local co-ordinates nahi mile
    grantAccessContainer.classList.add("active");
   }
   else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
   }
} 
 async function fetchUserWeatherInfo(coordinates){
    const{lat,lon} =coordinates;
    //make grantContainer invisible and loading section visible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    //Api call
    try{
     const response = await fetch(
       `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
     );
     const data = await response.json();
     loadingScreen.classList.remove("active");
     userInfoContainer.classList.add("active");
     renderWeatherInfo(data);
    }
    catch(err){
     loadingScreen.classList.remove("active");
     console.log("Error generated" , err);
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc =document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    //fetch values from weatherinfo and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =`${ weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
   
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //send an alert
    }
}
function showPosition(position){
    const userCoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
    return;
    else
    fetchSearchWeatherInfo(cityName);
})
async function fetchSearchWeatherInfo(city){
loadingScreen.classList.add("active");
userInfoContainer.classList.remove("active");
grantAccessContainer.classList.remove("active");
try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}
catch(err){
    console.log("Error generated", err);
}
}