import './style.css';

const container = document.getElementById("container");

class ToDo {
    constructor(title = "Title", desc = "Details of task to be done", date = new Date(), done = false) {
        this.title = title;
        this.desc = desc;
        this.date = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
        this.done = done;
    }

    static formatDate(date) {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return "Invalid Date";
        }
        const formatter = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
            hour12: false
        });
        return formatter.format(date);
    }

    static saveToLocalStorage() {
        localStorage.setItem('myToDos', JSON.stringify(myToDos.map(todo => ({
            ...todo,
            date: todo.date.toISOString() // Convert date to string for storage
        }))));
        localStorage.setItem('doneToDos', JSON.stringify(doneToDos.map(todo => ({
            ...todo,
            date: todo.date.toISOString() // Convert date to string for storage
        }))));
    }

    static loadFromLocalStorage() {
        const myToDosData = localStorage.getItem('myToDos');
        const doneToDosData = localStorage.getItem('doneToDos');

        if (myToDosData) {
            const myToDosArray = JSON.parse(myToDosData);
            myToDos.length = 0; // Clear the existing array
            myToDosArray.forEach(todo => myToDos.push(new ToDo(
                todo.title,
                todo.desc,
                new Date(todo.date), // Convert back to Date object
                todo.done
            )));
        }

        if (doneToDosData) {
            const doneToDosArray = JSON.parse(doneToDosData);
            doneToDos.length = 0; // Clear the existing array
            doneToDosArray.forEach(todo => doneToDos.push(new ToDo(
                todo.title,
                todo.desc,
                new Date(todo.date), // Convert back to Date object
                todo.done
            )));
        }
    }

    static printCards() {
        container.innerHTML = ""; // Clear previous entries

        // Render active to-dos
        myToDos.forEach((todo, index) => {
            const newCard = document.createElement("div");
            newCard.classList.add("projectBox");
            newCard.innerHTML = `
                <div class="title" contenteditable="true" data-index="${index}" data-list="active">
                    ${todo.title}
                </div>
                <div class="notes">
                    <div contenteditable="true" data-index="${index}" data-list="active">${todo.desc}</div>
                    <button class="delete" data-index="${index}" data-list="active">
                        <span class="material-symbols-outlined small">delete</span>
                    </button>
                    <button class="tick" data-index="${index}">
                        <span class="material-symbols-outlined small">check</span>
                    </button>
                    <div class = "date">${ToDo.formatDate(todo.date)}</div>
                </div>
            `;
            container.appendChild(newCard);
        });

        // Render done to-dos
        doneToDos.forEach((todo, index) => {
            const newDone = document.createElement("div");
            newDone.classList.add("projectBox", "done");
            newDone.innerHTML = `
                <div class="title" contenteditable="true" data-index="${index}" data-list="done">
                    ${todo.title}
                </div>
                <div class="notes">
                    <div contenteditable="true" data-index="${index}" data-list="done">${todo.desc}</div>
                    <button class="delete" data-index="${index}" data-list="done">
                        <span class="material-symbols-outlined small">delete</span>
                    </button>
                    <div class = "date">${ToDo.formatDate(todo.date)}</div>
                </div>
            `;
            container.appendChild(newDone);
        });
    }

    static addCard() {
        const newToDo = new ToDo();
        myToDos.push(newToDo);
        ToDo.saveToLocalStorage(); // Save to localStorage
        ToDo.printCards();
    }

    static removeCard(index, list) {
        if (list === 'active') {
            if (index >= 0 && index < myToDos.length) {
                myToDos.splice(index, 1);
            }
        } else if (list === 'done') {
            if (index >= 0 && index < doneToDos.length) {
                doneToDos.splice(index, 1);
            }
        }
        ToDo.saveToLocalStorage(); // Save to localStorage
        ToDo.printCards();
    }

    static changeDone(index) {
        if (index >= 0 && index < myToDos.length) {
            const todo = myToDos[index];
            todo.done = true;
            doneToDos.push(todo);
            myToDos.splice(index, 1);
            ToDo.saveToLocalStorage(); // Save to localStorage
            ToDo.printCards();
        }
    }

    static updateToDoData(index, list, title, desc) {
        if (list === 'active') {
            if (index >= 0 && index < myToDos.length) {
                myToDos[index].title = title;
                myToDos[index].desc = desc;
            }
        } else if (list === 'done') {
            if (index >= 0 && index < doneToDos.length) {
                doneToDos[index].title = title;
                doneToDos[index].desc = desc;
            }
        }
        ToDo.saveToLocalStorage(); // Save to localStorage
    }
}

const myToDos = [];
const doneToDos = [];

document.addEventListener('DOMContentLoaded', () => {
    ToDo.loadFromLocalStorage(); // Load data from localStorage
    ToDo.printCards();

    container.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (target) {
            const index = target.getAttribute('data-index');
            const list = target.getAttribute('data-list');
            if (target.classList.contains('delete')) {
                ToDo.removeCard(index, list);
            } else if (target.classList.contains('tick')) {
                ToDo.changeDone(index);
            }
        }
    });

    container.addEventListener('blur', (event) => {
        const target = event.target;
        if (target.classList.contains('title') || target.classList.contains('notes')) {
            const index = target.getAttribute('data-index');
            const list = target.getAttribute('data-list');
            const titleElement = container.querySelector(`.title[data-index="${index}"]`);
            const descElement = container.querySelector(`.notes > div[data-index="${index}"]`);
            const title = titleElement ? titleElement.textContent : "";
            const desc = descElement ? descElement.textContent : "";
            ToDo.updateToDoData(index, list, title, desc);
        }
    }, true);

    document.getElementById("pen").addEventListener("click", ToDo.addCard);
});
