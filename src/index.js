import './style.css';

const container1 = document.getElementById("c1");
const container2 = document.getElementById("c2");

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
        console.log('Saving to localStorage');
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
        console.log('Loading from localStorage');
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
        container1.innerHTML = ""; // Clear previous entries
        container2.innerHTML = "";
        // Render active to-dos
        myToDos.forEach((todo, index) => {
            const newCard = document.createElement("div");
            newCard.classList.add("projectBox");
            newCard.innerHTML = `
                    <div class="title" contenteditable="true" data-index="${index}" data-list="active">
                        ${todo.title}
                    </div>
                    <div class="notes" contenteditable="true" data-index="${index}" data-list="active">
                        ${todo.desc}
                    </div>
                    <button class="delete" data-index="${index}" data-list="active">
                        <span class="material-symbols-outlined small">delete</span>
                    </button>
                    <button class="tick" data-index="${index}">
                        <span class="material-symbols-outlined small">check</span>
                    </button>
                    <div class="date">${ToDo.formatDate(todo.date)}</div>
            `;
            container1.appendChild(newCard);
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
                    <button class="tick" data-index="${index}">
                        <span class="material-symbols-outlined small">check</span>
                    </button>
                    <div class="date">${ToDo.formatDate(todo.date)}</div>
                </div>
            `;
            container2.appendChild(newDone);
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

    static changeDone2(index) {
        if (index >= 0 && index < doneToDos.length) {
            const todo = doneToDos[index];
            todo.done = false;
            myToDos.push(todo);
            doneToDos.splice(index, 1);
            ToDo.saveToLocalStorage(); // Save to localStorage
            ToDo.printCards();
        }
    }

    static updateToDoData(index, list, title, desc) {
        console.log(`Updating ToDo: index=${index}, list=${list}, title=${title}, desc=${desc}`);
        if (list === 'active') {
            if (index >= 0 && index < myToDos.length) {
                const todo = myToDos[index];
                todo.title = title;
                todo.desc = desc;
                console.log(`Updated ToDo in myToDos:`, todo);
            }
        } else if (list === 'done') {
            if (index >= 0 && index < doneToDos.length) {
                const todo = doneToDos[index];
                todo.title = title;
                todo.desc = desc;
                console.log(`Updated ToDo in doneToDos:`, todo);
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

    // Handle clicks for delete and tick buttons
    container1.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (target) {
            const index = parseInt(target.getAttribute('data-index'), 10);
            const list = target.getAttribute('data-list');
            if (target.classList.contains('delete')) {
                ToDo.removeCard(index, list);
            } else if (target.classList.contains('tick')) {
                ToDo.changeDone(index);
            }
        }
    });

    // Handle blur events to update the title and description
    document.addEventListener('blur', (event) => {
        const target = event.target;
        if (target.classList.contains('title') || target.classList.contains('notes')) {
            const index = parseInt(target.getAttribute('data-index'), 10);
            const list = target.getAttribute('data-list');
            const titleElement = document.querySelector(`.title[data-index="${index}"][data-list="${list}"]`);
            const descElement = document.querySelector(`.notes[data-index="${index}"][data-list="${list}"]`);

            if (titleElement && descElement) {
                const title = titleElement.textContent.trim();
                const desc = descElement.textContent.trim();
                console.log(`Blur event: index=${index}, list=${list}, title=${title}, desc=${desc}`);
                ToDo.updateToDoData(index, list, title, desc);
            } else {
                console.error('Could not find title or description element');
            }
        }
    }, true);

    // Handle clicks in the done container
    container2.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (target) {
            const index = parseInt(target.getAttribute('data-index'), 10);
            const list = target.getAttribute('data-list');
            if (target.classList.contains('delete')) {
                ToDo.removeCard(index, list);
            } else if (target.classList.contains('tick')) {
                ToDo.changeDone2(index);
            }
        }
    });

    document.getElementById("pen").addEventListener("click", ToDo.addCard);
});
