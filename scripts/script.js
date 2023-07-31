let modal = document.querySelector('.header__content-modal')
let modalStatus = false

function chengeHeaderMenu() {
    modalStatus ? modal.style.display = 'none' : modal.style.display = 'flex';
    modalStatus = !modalStatus
}