
//Acces All The Elements Throush Their id , class, attribute

const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer =document.querySelector('.weather-container');


const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");

const loadingScreen =document.querySelector(".loading-container");

const userInfoContainer=document.querySelector(".user-info-container");



//Now here i create the 2 tab 1 is for user own weather Information tab and Another is for searching Tab

 let  currentTab=userTab;
 
 const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

 currentTab.classList.add("current-tab");

 getfromSessionStorage();

 function switchTab(clickedTab){
    if(clickedTab !=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab =clickedTab;
        currentTab.classList.add("current-tab"); 



        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            
            getfromSessionStorage();

        }
          
    }
 }


 //Switch tab Functionlity

 userTab.addEventListener("click",()=> {

    //pass clicked tab as input parameter 

    switchTab(userTab);
   
 });
 

searchTab.addEventListener("click",() => {
    switchTab(searchTab);
})

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if (!localCoordinates) {
        // If no coordinates are found, show the grant location container
        grantAccessContainer.classList.add("active");
    } else {
        // Parse and fetch weather info
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//User Weather Iformation Fetch Through The API

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    // Hide grant access container, search form, and show loading
    grantAccessContainer.classList.remove("active");
    searchForm.classList.remove("active");  // 🔥 HIDE SEARCH FORM
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        const data = await response.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    } catch (err) {
        loadingScreen.classList.remove("active");
        console.log("Error fetching user location weather:", err);
    }
}



//Searching tab Weather Iformation Fetch Through The API


async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        
        renderWeatherInfo(data);
    } catch (error) { // FIXED!
        console.log("Error fetching weather info:", error);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        userInfoContainer.innerHTML = `<p>Unable to fetch weather info</p>`;
    }
}


function  renderWeatherInfo(weatherInfo){
    //firstly we have to fetch element

    const cityName= document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");

    const desc  =document.querySelector("[data-weatherDesc]");
    
    const weatherIcon= document.querySelector("[data-weatherIcon]");


    const temp =  document.querySelector("[data-temp]");
    const windspeed= document.querySelector(" [data-windspeed]");
    const  humidity= document.querySelector(" [data-humidity]");
    const cloudiness= document.querySelector(" [data-cloudiness]");

console.log(weatherInfo);

//now we have to render data
//fetch  data from api and render it on the page

cityName.innerText = weatherInfo?.name;
countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText = weatherInfo?.weather?.[0]?.description;
weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;



temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
 
function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition) ;
}



else{
    //show an alert for no geolocation support available

    alert("geolocation is not supported by this browser");
}
}




function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

    // 🔥 Hide search form after location is granted
    searchForm.classList.remove("active"); 
}



const grantAccessBtn =document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click",getLocation);


const searchInput  =document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName= searchInput.value;

    if(cityName === "")
        return;
    else
    fetchSearchWeatherInfo(cityName);


});








