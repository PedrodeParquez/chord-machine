export const menuButtons = document.querySelector('.menu-buttons');

document.getElementById('about').addEventListener('click', openPopUpAbout);
document.getElementById('map').addEventListener('click', openPopUpMap);

function openPopUpAbout() {
    const popUpAboutHTML = `
    <div id="pop-up-about" class="pop-up-background">
        <div class="pop-up-container-about">
            <h1>ABOUT</h1>
            <div class="pop-up-container-about-text">Project made by Kemerovo State University student Egor Mashin as part of educational practice</div>
            <p>GitHub</p>
        </div>
    </div>`;
    
    menuButtons.insertAdjacentHTML('afterend', popUpAboutHTML);

    document.getElementById('pop-up-about').addEventListener('click', closePopUp);
}

function openPopUpMap() {
    const popUpMapHTML = `
    <div id="pop-up-map" class="pop-up-background">
        <div class="pop-up-container-map">
            <div class="map">
                <iframe src="https://yandex.ru/map-widget/v1/?ll=110.826132%2C60.038309&z=3.47"></iframe>
            </div>
        </div>
    </div>`;

    menuButtons.insertAdjacentHTML('afterend', popUpMapHTML);

    document.getElementById('pop-up-map').addEventListener('click', closePopUp);
    
}

export function closePopUp(event) {
    if (event.target.classList.contains('pop-up-background')) {
        event.target.remove();
    }
}