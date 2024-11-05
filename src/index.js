
import '../styles/main.css';
import search from '../assets/search.png';
import shopbag from '../assets/shopbag.png';
import user from '../assets/user.png';
import banner from '../assets/banner.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';


let selectedCategory = 'bestsellers';


const API_KEY = 'AIzaSyDxVoSezBSefTFgbqriNOoI-yJgiKHmV48';


const app = document.getElementById('app');


function clearApp() {
    app.innerHTML = ''; 
}


async function fetchBooks(query = selectedCategory, startIndex = 0, maxResults = 6) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${query}&startIndex=${startIndex}&maxResults=${maxResults}&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            renderBooks(data.items, startIndex > 0); 
        } else {
            renderNoBooksMessage(); 
        }
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}


function renderNoBooksMessage() {
    const booksContainer = document.querySelector('.book-list') || document.createElement('section');
    booksContainer.classList.add('book-list');
    booksContainer.innerHTML = '<p>Нет доступных книг для данной категории.</p>';
    document.querySelector('.books-container').appendChild(booksContainer);
}


function renderBooks(books, append = false) {
    let booksContainer = document.querySelector('.book-list');
    if (!booksContainer || !append) {
        if (booksContainer) booksContainer.remove();
        booksContainer = document.createElement('section');
        booksContainer.classList.add('book-list');
        document.querySelector('.books-container').appendChild(booksContainer);
    }

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'assets/book-placeholder.png'}" alt="${bookInfo.title}">
            <h3>${bookInfo.title}</h3>
            <p>${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author'}</p>
            <div class="price">${book.saleInfo && book.saleInfo.listPrice ? `$${book.saleInfo.listPrice.amount}` : 'Not for sale'}</div>
            <button>Buy now</button>
        `;
        booksContainer.appendChild(bookCard);
    });

   
    const existingLoadMoreButton = document.querySelector('.load-more');
    if (existingLoadMoreButton) {
        existingLoadMoreButton.remove();
    }

  
    const loadMoreButton = document.createElement('button');
    loadMoreButton.classList.add('load-more');
    loadMoreButton.textContent = 'Load more';
    loadMoreButton.addEventListener('click', () => fetchBooks(selectedCategory, booksContainer.childElementCount, 6));
    document.querySelector('.books-container').appendChild(loadMoreButton);
}


function updateCategory(newCategory) {
    selectedCategory = newCategory;
    clearApp();
    renderApp();
    fetchBooks(selectedCategory);
}


function renderSlider() {
    const slider = document.createElement('div');
    slider.classList.add('slider');
    slider.innerHTML = `
        <div class="slider-content">
            <div class="slide"><img src="${banner}" alt="Black Friday Sale"></div>
            <div class="slide"><img src="${banner2}" alt="Top 10 Books"></div>
            <div class="slide"><img src="${banner3}" alt="Cozy Books"></div>
        </div>
        <div class="slider-dots">
            <span class="dot" data-slide="0"></span>
            <span class="dot" data-slide="1"></span>
            <span class="dot" data-slide="2"></span>
        </div>
    `;
    app.insertBefore(slider, document.querySelector('.main-content'));

   
    let currentSlide = 0;
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            dots[i].classList.toggle('active', i === index);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentSlide = parseInt(dot.getAttribute('data-slide'));
            showSlide(currentSlide);
        });
    });


    showSlide(currentSlide);
}


function renderCategories() {
    const categories = document.createElement('div');
    categories.classList.add('categories');
    categories.innerHTML = `
        <ul>
            <li class="category" data-category="bestsellers">Bestsellers</li>
            <li class="category" data-category="art">Art & Fashion</li>
            <li class="category" data-category="biography">Biography</li>
            <li class="category" data-category="business">Business</li>
            <li class="category" data-category="crafts">Crafts & Hobbies</li>
            <li class="category" data-category="drama">Drama</li>
            <li class="category" data-category="fiction">Fiction</li>
            <li class="category" data-category="food">Food & Drink</li>
            <li class="category" data-category="health">Health & Wellbeing</li>
            <li class="category" data-category="history">History & Politics</li>
            <li class="category" data-category="humor">Humor</li>
            <li class="category" data-category="poetry">Poetry</li>
            <li class="category" data-category="psychology">Psychology</li>
            <li class="category" data-category="science">Science</li>
            <li class="category" data-category="technology">Technology</li>
            <li class="category" data-category="travel">Travel & Maps</li>
        </ul>
    `;

    categories.querySelector(`.category[data-category="${selectedCategory}"]`).classList.add('active');

    categories.querySelectorAll('.category').forEach((item) => {
        item.addEventListener('click', () => {
            updateCategory(item.getAttribute('data-category'));
            categories.querySelectorAll('.category').forEach((el) => el.classList.remove('active'));
            item.classList.add('active');
        });
    });

    document.querySelector('.categories-container').appendChild(categories);
}


function initializePage() {
    if (!document.querySelector('header')) {
        const header = document.createElement('header');
        header.innerHTML = `
            <h1>Bookshop</h1>
            <nav>
                <a href="#" class="nav-active">Books</a>
                <a href="#">Audiobooks</a>
                <a href="#">Stationery & Gifts</a>
                <a href="#">Blog</a>
            </nav>
            <div class="header-icons">
                <img src="${search}" alt="Search">
                <img src="${user}" alt="Account">
                <img src="${shopbag}" alt="Cart">
            </div>
        `;
        document.body.insertBefore(header, app);
    }

    if (!document.querySelector('footer')) {
        const footer = document.createElement('footer');
        footer.innerHTML = `<p>© 2024 Bookshop</p>`;
        document.body.appendChild(footer);
    }
}


function renderApp() {
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');
    app.appendChild(mainContent);

    const categoriesContainer = document.createElement('div');
    categoriesContainer.classList.add('categories-container');
    mainContent.appendChild(categoriesContainer);

    const booksContainer = document.createElement('div');
    booksContainer.classList.add('books-container');
    mainContent.appendChild(booksContainer);

    renderSlider();
    renderCategories();
    fetchBooks();
}


initializePage();
clearApp();
renderApp();
