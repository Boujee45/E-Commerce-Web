//Mobile menu toggle

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
})

//search toggle Functionality 

const searchToggle = document.getElementById('search-toggle');
const searchContainer = document.getElementById('search-container');

searchToggle.addEventListener('click', () => {
    searchContainer.classList.toggle('active');
})