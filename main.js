const bookContainer = document.querySelector('.book-container');
const addBookCard = document.querySelector('.add-book-card');
const addBookModal = document.querySelector('.book-form-modal');
const submitBookModal = document.querySelector('#book-form-submit');
const bookForm = document.querySelector('.book-form');
const addBookButton = document.querySelector('#add-book-button');
let inputTitleField = bookForm.querySelector('#book-title');
let inputAuthorField = bookForm.querySelector('#book-author');
let inputPageField = bookForm.querySelector('#book-page');
let inputBookStatus = bookForm.querySelector('#book-status');


submitBookModal.addEventListener('mousedown', () => {
    if (isInputFieldEmpty()) return;
    setNewBook();
    clearInputField();
});

document.addEventListener('mousedown', (e) => {
    if (!e.target.contains(addBookModal)) return;
    addBookModal.close();
});

addBookButton.addEventListener('mousedown', () => {
    addBookModal.showModal();
});

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
});


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

const userLibrary = {
    numberOfBooks: 0,
    books: [],
};

function Book(title, author, numberOfPages, readingStatus) {
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.readingStatus = readingStatus;
    this.bookPosition;
}

Book.prototype.setReadingStatus = function(isChecked, bookInstance, firstCall) {
    let currentBookInstance;
    let currentBook;
    bookNodes.forEach(book => {
        currentBookInstance =  book.getAttribute('data-instance')
        if (bookInstance != currentBookInstance) return;
        currentBook = book
    });

    if (firstCall && isChecked) {
        currentBook.childNodes[5].lastChild.checked = true;
        currentBook.childNodes[2].classList.add('finish')
        return;
    }

    if (firstCall && !isChecked) {
        currentBook.childNodes[5].lastChild.checked = false;
        currentBook.childNodes[2].classList.add('pending')
        return;
    }

    if (isChecked) {
        this.readingStatus = true;
        currentBook.childNodes[2].classList.add('finish')
        currentBook.childNodes[2].classList.remove('pending')
        return;
    }

    this.readingStatus = false;
    currentBook.childNodes[2].classList.add('pending')
    currentBook.childNodes[2].classList.remove('finish')
}

function setNewBook() {
    const userNewBook = new Book(inputTitleField.value, 
                        inputAuthorField.value, 
                        inputPageField.value,
                        inputBookStatus.checked);

    userLibrary.numberOfBooks++;
    addNewBookToLibrary(userNewBook);
}
 
function addNewBookToLibrary(userNewBook) {
    userLibrary.books.push(userNewBook)
    userLibrary.books.map((book, currentInstance) => {
        
        if (userLibrary.books.indexOf(userNewBook) != currentInstance) return;

        setElement();
        setBookNodeContent(book, currentInstance)
        setNodeList();
        setNodeListener();  
        book.bookPosition = currentInstance;
        book.setReadingStatus(book.readingStatus, currentInstance, true);

     });
}

function setBookNodeContent(book, currentInstance) {
    bookDetails.book.setAttribute('data-instance', currentInstance);
    bookDetails.title.textContent = book.title;
    bookDetails.author.textContent = book.author;
    bookDetails.numberOfPages.textContent = `${book.numberOfPages} page/s`;
    bookDetails.markAsRead = createElement.markAsRead(currentInstance);
    bookDetails.book.appendChild(bookDetails.markAsRead);
    bookContainer.insertBefore(bookDetails.book, addBookCard);
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

let bookNodes, markAsReadButton, deleteButton;
function setNodeList() {
    markAsReadButton = document.querySelectorAll('.mark-as-read > input');
    deleteButton = document.querySelectorAll('.delete-book-button')
    bookNodes = document.querySelectorAll('.book');
}

function setNodeListener() {
    markAsReadButton.forEach(element => {
        element.addEventListener('input', (e) => {
            let bookInstance = parseInt(e.target.closest('.book').getAttribute('data-instance'))
            let isChecked = e.target.checked;
        
            userLibrary.books.map(currentBook => {
               if (userLibrary.books.indexOf(currentBook) != bookInstance) return;
               currentBook.setReadingStatus(isChecked, bookInstance);
            })

        })
    });

    deleteButton.forEach(button => button.addEventListener('mousedown',removeBook));
}

function removeBook(e) {
    let bookInstance = parseInt(e.target.parentNode.getAttribute('data-instance'));

    userLibrary.books.map((book, bookNumber) => {
        if (book.bookPosition != bookInstance) return;
        userLibrary.books.splice(bookNumber, 1);
    })

    bookNodes.forEach(bookNode => {
        let currentBookNode =  parseInt(bookNode.getAttribute('data-instance'))
        if (bookInstance != currentBookNode) return;
        bookContainer.removeChild(bookNode);
    })

    setNewDataInstance();
}

function setNewDataInstance() {
    setNodeList()
    userLibrary.books.map(book => book.bookPosition = userLibrary.books.indexOf(book));
    bookNodes.forEach((bookNode, index) => {
        let book = userLibrary.books[index];
        bookNode.setAttribute('data-instance', book.bookPosition);
        bookNode.childNodes[5].firstChild.setAttribute('for', book.bookPosition);
        bookNode.childNodes[5].lastChild.id = book.bookPosition;
    });
    setNodeListener()
}

function isInputFieldEmpty() {
    return !inputTitleField.value || !inputAuthorField.value || !inputPageField.value
}

function clearInputField() {
    inputTitleField.value = '';
    inputAuthorField.value = '';
    inputPageField.value = '';
    inputBookStatus.checked = false;
}