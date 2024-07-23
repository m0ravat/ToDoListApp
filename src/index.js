import './style.css';

const container = document.getElementById("container");

class ToDo {
    constructor(title = "Title", desc = "Details of task to be done", date = new Date(), done = false) {
        this.title = title;
        this.desc = desc;
        this.date = date;
        this.done = done;
    }
    static formatDate(date) {
        const formatter = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZoneName: 'short' // This includes the timezone
        });
        return formatter.format(date);
    }
    static printCards() {
        container.innerHTML = ""; // Clear previous entries
        for (let x = 0; x < myToDos.length; x++) {
            const newCard = document.createElement("div");
            newCard.classList.add("projectBox");
            newCard.innerHTML = `
                <div id="title">${myToDos[x].title} - ${ToDo.formatDate(myToDos[x].date)}</div>
                <div id="notes">
                    <div>${myToDos[x].desc}</div>
                    <button id = "delete"><span class="material-symbols-outlined small">delete</span></button>
                    <button id = "tick"><span class="material-symbols-outlined small">check</span></button>
                </div>
            `;
            container.appendChild(newCard);
        }
        for (let y = 0; y < doneToDos.length; y++) {
            const newDone = document.createElement("div");
            newDone.classList.add("projectBox");
            newDone.classList.add("done");
            newDone.innerHTML = `
                <div id="title">${doneToDos[y].title} - ${doneToDos[y].date}</div>
                <div id="notes">
                    <div>${doneToDos[y].desc}</div>
                </div>
            `;
            container.appendChild(newDone);
        }
    }

    static addCard() {
        const newToDo = new ToDo();
        myToDos.push(newToDo);
        ToDo.printCards();
    }
}

const myToDos = [
    new ToDo(),
    new ToDo(),
    new ToDo()
];

const doneToDos = [
    // Add any done ToDos here
];

document.addEventListener('DOMContentLoaded', ToDo.printCards); // Use ToDo.printCards to call the static method
document.getElementById("pen").addEventListener("click", ToDo.addCard);


