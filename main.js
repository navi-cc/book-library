const bookContainer = document.querySelector('.book-container');
const addBookModal = document.querySelector('.book-form-modal');
const submitBookModal = document.querySelector('#book-form-submit');
const bookForm = document.querySelector('.book-form');
const addBookButton = document.querySelector('#add-book-button');
let inputTitleField = bookForm.querySelector('#book-title');
let inputAuthorField = bookForm.querySelector('#book-author');
let inputPageField = bookForm.querySelector('#book-page');
let inputBookStatus = bookForm.querySelector('#book-status');

const bookDetails = {
    book: null,
    title: null,
    author: null,
    status: null,
    numberOfPages: null,
    deleteButton: null,
    markAsRead: null,
}

const createElement = {
    book: function() {
        let book =  document.createElement('div');
        book.className = 'book';
        return book;
    },

    title: function() {
        let title = document.createElement('span');
        title.className = 'book-title';
        return title;
    },

    author: function() {
        let author = document.createElement('span');
        author.className = 'book-author'
        return author;
    }, 
    
    status: function() {
        let status = document.createElement('span');
        status.className = 'book-status';
        return status;
    },

    numberOfPages: function() {
        let pages = document.createElement('span');
        pages.className = 'number-of-page';
        return pages;
    },

    deleteButton: function() {
        let deleteButton = document.createElement('div')
        deleteButton.className = 'delete-book-button';
        return deleteButton;
    },
    
    markAsRead: function(dataNumber)  {
        let markAsRead = document.createElement('div');
        markAsRead.className = 'mark-as-read';

        let label = document.createElement('label');
        dataNumber = dataNumber.toString();
        label.textContent = 'Mark as read'
        label.setAttribute('for', dataNumber);

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.id = dataNumber;

        markAsRead.appendChild(label)
        markAsRead.appendChild(input)
        return markAsRead;
    },
}

class Library {
    constructor() {
        this.books = [];
        this.bookNode = getBookNode();
    }

    setBook(title, 
            author,
            numberOfPages, 
            readingStatus)
    {
       return {title, author, numberOfPages, readingStatus}
    }

    addBook(book) {
       this.books.push(book);
       render()
    }

    removeBook(target) {
       const removedBookNumber = parseInt(target.parentNode.dataset.instance);
       this.books.splice(removedBookNumber, 1);
       render()
    }

    setReadingStatus(isChecked, bookNumber)  {
        if (isChecked) {
            this.books[bookNumber].readingStatus = true
            this.bookNode[bookNumber].childNodes[5].lastChild.checked = true
            this.bookNode[bookNumber].childNodes[2].classList.add('finish')
            this.bookNode[bookNumber].childNodes[2].classList.remove('pending')
        }

        if (!isChecked) {
            this.books[bookNumber].readingStatus = false
            this.bookNode[bookNumber].childNodes[2].classList.add('pending')
            this.bookNode[bookNumber].childNodes[2].classList.remove('finish')
        }
    }
    
}

const library = new Library();

function addNewBook() {
    const book = library.setBook(inputTitleField.value, 
                                inputAuthorField.value, 
                                inputPageField.value, 
                                inputBookStatus.checked)

    library.addBook(book);
}
 
function render() {
    bookContainer.textContent = ''
    library.books.map((book, bookNumber) => {
        setElement();
        setBookNodeContent(book, bookNumber)
    })
}

function setBookNodeContent(book, bookNumber) {
    bookDetails.book.setAttribute('data-instance', bookNumber);
    bookDetails.title.textContent = book.title;
    bookDetails.author.textContent = book.author;
    bookDetails.numberOfPages.textContent = `${book.numberOfPages} page/s`;
    bookDetails.markAsRead = createElement.markAsRead(bookNumber);
    bookDetails.book.appendChild(bookDetails.markAsRead);
    bookContainer.appendChild(bookDetails.book);
    library.setReadingStatus(book.readingStatus, bookNumber)
}

function setElement() {    
    Object.entries(createElement).map(([key, fn]) => {
        if (key === 'markAsRead') return;
        bookDetails[key] = fn();
    });

    for (const key in bookDetails) {
        if (key === 'book' || key === 'markAsRead') continue;
        bookDetails.book.appendChild(bookDetails[key]);
    }
}

function isInputFieldEmpty() {
    return !inputTitleField.value || !inputAuthorField.value || !inputPageField.value
}

function getBookNode() {
    return document.getElementsByClassName('book'); 
}

function createAddBookCard() {
    addBookCard.node = addBookCard.create()
    bookContainer.appendChild(addBookCard.node)
}

function closeModal(e) {
    if (e.target.contains(addBookModal)) addBookModal.close()
}

function bookFormHandler(e) {
    if (isInputFieldEmpty()) return;
    addNewBook();
    bookForm.reset()
    addBookModal.close()
    e.preventDefault();
}

function libraryHandler(e) {
    const target = e.target;
        
    if (target.className === 'delete-book-button') {
        library.removeBook(target)
        return
    }

    if (target.nodeName === 'INPUT') {
        library.setReadingStatus(target.checked, parseInt(target.parentNode.parentNode.dataset.instance)) 
    }    
}

bookContainer.onclick = libraryHandler;
bookForm.onsubmit = bookFormHandler;
window.onmousedown = closeModal;