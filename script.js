// GLOBAL OBJECT //
const myLibrary = [];




const displayPopup = () => {
    const popup = document.querySelector('.popup-background');
    popup.style.display = 'block';
    document.getElementById('popup').classList.add('scale-up-center');
}

const hidePopup = () => {
    const popup = document.querySelector('.popup-background');
    popup.style.display = 'none';
    document.getElementById('popup').classList.remove('scale-up-center');
}

const validateInput = (title, author, pages) => {
    if (title === '' || author === '' || pages === '') return 'invalid';
    return 'valid';
};

const restoreForm = () => {
    const title = document.querySelector('#title');
    const author = document.querySelector('#author');
    const pages = document.querySelector('#pages');
    const read = document.querySelector('#popup-read');

    title.value = '';
    author.value = '';
    pages.value = '';
    read.checked = false;
    hidePopup(); // Hides popup after the form is restored
};


const generateBook = (bookTitle, bookAuthor, bookPages, readingStatus) => {
    let bookDiv = document.createElement('div');
    bookDiv.classList.add('book');
    bookDiv.setAttribute('data-book', `${myLibrary.length}`);

    let title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = bookTitle;
    bookDiv.appendChild(title);

    let author = document.createElement('p');
    author.classList.add('author');
    author.textContent = bookAuthor;
    bookDiv.appendChild(author);

    let pages = document.createElement('p');
    pages.classList.add('pages');
    pages.textContent = `${bookPages} pages`;
    bookDiv.appendChild(pages);

    let checkBoxDiv = document.createElement('div');
    let checkboxInput = document.createElement('input');
    checkboxInput.setAttribute('type', 'checkbox');
    checkboxInput.setAttribute('id', `read${myLibrary.length}`);
    checkBoxDiv.appendChild(checkboxInput);

    let checkboxLabel = document.createElement('label');
    checkboxLabel.setAttribute('for', `read${myLibrary.length}`);

    if (readingStatus) {
        checkboxLabel.textContent = 'Read';
        checkboxInput.checked = true;
    } else {
        checkboxLabel.textContent = 'Not Read';
        checkboxInput.checked = false;
    }

    checkBoxDiv.appendChild(checkboxLabel);
    bookDiv.appendChild(checkBoxDiv);

    let removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.setAttribute('type', 'button');
    removeButton.textContent = 'Remove';
    bookDiv.appendChild(removeButton);

    return bookDiv;
};

const removeBook = (bookNum, element) => {
    let num = Number(bookNum);
    myLibrary.splice(num, 1);

    const shelf = document.querySelector('#shelf');
    shelf.removeChild(element);
}



function render() {

    const shelf = document.querySelector('#shelf');
    const books = document.querySelectorAll('.book');
    books.forEach(book => {
        shelf.removeChild(book);
    });

    for (let i = 0; i < myLibrary.length; i++) {

        const shelf = document.querySelector('#shelf');

        let bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        bookDiv.setAttribute('data-book', `${i}`);

        let title = document.createElement('h2');
        title.classList.add('title');
        title.textContent = myLibrary[i].title;
        bookDiv.appendChild(title);

        let author = document.createElement('p');
        author.classList.add('author');
        author.textContent = myLibrary[i].author;
        bookDiv.appendChild(author);

        let pages = document.createElement('p');
        pages.classList.add('pages');
        pages.textContent = `${myLibrary[i].pages} pages`;
        bookDiv.appendChild(pages);

        let checkBoxDiv = document.createElement('div');

        let checkboxInput = document.createElement('input');
        checkboxInput.setAttribute('type', 'checkbox');
        checkboxInput.setAttribute('id', `read${i}`);
        checkBoxDiv.appendChild(checkboxInput);

        let checkboxLabel = document.createElement('label');
        checkboxLabel.setAttribute('for', `read${i}`);

        if (myLibrary[i].read) {
            checkboxLabel.textContent = 'Read';
            checkboxInput.checked = true;
        } else {
            checkboxLabel.textContent = 'Not Read';
            checkboxInput.checked = false;
        }

        checkBoxDiv.appendChild(checkboxLabel);
        bookDiv.appendChild(checkBoxDiv);

        let removeButton = document.createElement('button');
        removeButton.classList.add('remove');
        removeButton.setAttribute('type', 'button');
        removeButton.textContent = 'Remove';
        bookDiv.appendChild(removeButton);

        shelf.appendChild(bookDiv);
    }
};

// Fill myLibrary using localStorage on page load or refresh
function populateMyLibrary(myStoredLibrary) {
    for (let i = 0; i < myStoredLibrary.length; i++) {
        myLibrary.push(new Book(myStoredLibrary[i].title, myStoredLibrary[i].author, myStoredLibrary[i].pages, myStoredLibrary[i].read));
    }
}

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    toggleReadingStatus() {
        if (this.read) {
            this.read = false;
        } else {
            this.read = true;
        }
    }
}


function addBookToLibrary() {
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const read = document.querySelector('#popup-read').checked;

    if (validateInput(title, author, pages) === 'invalid') return;

    // update shelf
    const shelf = document.querySelector('#shelf');
    const generatedBook = generateBook(title, author, pages, read);
    shelf.appendChild(generatedBook);

    // update myLibrary
    myLibrary.push(new Book(title, author, pages, read));

    // update local storage
    populateStorage(myLibrary);

    // restores form to its original state after the book is submitted
    restoreForm();

}

// Store myLibrary in localStorage
function populateStorage(myLibrary) {
    localStorage.setItem('myStoredLibrary', JSON.stringify(myLibrary));
}






/* ========================================== */
/*                EVENT LISTENERS             */
/* ========================================== */

const formSubmit = document.querySelector('#form-submit');
formSubmit.addEventListener('click', addBookToLibrary);

const addButton = document.querySelector('#add');
addButton.addEventListener('click', displayPopup);

const closeFormButton = document.querySelector('#close');
closeFormButton.addEventListener('click', hidePopup);

// Remove book button
document.addEventListener('click', (e) => {

    if (e.target.nodeName === 'BUTTON' && e.target.parentNode.hasAttribute('data-book')) {
        removeBook(e.target.parentNode.getAttribute('data-book'), e.target.parentNode);
        render();
        // update localStorage
        populateStorage(myLibrary);
    }
});

// Toggle reading
document.addEventListener('click', (e) => {

    if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'LABEL') {
        if (e.target.parentNode.parentNode.hasAttribute('data-book')) {
            let bookNum = Number(e.target.parentNode.parentNode.getAttribute('data-book'))
            myLibrary[bookNum].toggleReadingStatus();
            render();
            // update localStorage
            populateStorage(myLibrary);
        }
    }

})

// On page load
window.onload = () => {

    if (!localStorage.getItem('myStoredLibrary')) {
        myLibrary.push(new Book('The Time Machine', 'H.G. Wells', '118', false));
        myLibrary.push(new Book('Treasure Island', 'Robert Louis Stevenson', '311', true));
        render();
    } else {
        populateMyLibrary(JSON.parse(localStorage.getItem('myStoredLibrary')));
        render();
    }

}
