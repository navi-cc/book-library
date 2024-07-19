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
    
    markAsRead: function(dataNumber = 0)  {
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
}


function setNewBook() {

    const userNewBook = new Book(inputTitleField.value, 
                        inputAuthorField.value, 
                        inputPageField.value,
                        inputBookStatus.checked);

    userLibrary.numberOfBooks++;
    addNewBookToLibrary(userNewBook);
}

let previousInstance;
function addNewBookToLibrary(userNewBook) {
    userLibrary.books.push(userNewBook)
    userLibrary.books.map((book, currentInstance) => {
        if (currentInstance === previousInstance) return;
        setElement();
      
        bookDetails.book.setAttribute('data-instance', currentInstance);

        bookDetails.title.textContent = book.title;
        bookDetails.author.textContent = book.author;
        bookDetails.numberOfPages.textContent = `${book.numberOfPages} page/s`;

        bookDetails.markAsRead = createElement.markAsRead(currentInstance);
 
        bookDetails.book.appendChild(bookDetails.markAsRead);
        bookContainer.insertBefore(bookDetails.book, addBookCard);
        
        previousInstance = currentInstance;
     });
  
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

function clearInputField() {
    inputTitleField.value = '';
    inputAuthorField.value = '';
    inputPageField.value = '';
    inputBookStatus.checked = false;
}




























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


