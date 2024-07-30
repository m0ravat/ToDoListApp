import { Card } from "./card";

const container1 = document.getElementById("c1");
const container2 = document.getElementById("c2");

export class ToDo {
    constructor() {
        this.title = "New To Do";
        this.desc = "Description of ToDo";
        this.myToDos = [new Card()];
        this.doneToDos = [];
    }

    // Create a new ToDo list item in the UI
    CreateToDo() {
        const list = document.getElementById("list");
        const newProject = document.createElement("li");
        newProject.innerHTML = `
            <button><i class="fas fa-home"></i>${this.title}</button>
        `;
        list.appendChild(newProject);
    }

    // Load cards from localStorage
    loadFromLocalStorage() {
        const myToDosData = localStorage.getItem('myToDos');
        const doneToDosData = localStorage.getItem('doneToDos');

        if (myToDosData) {
            const myToDosArray = JSON.parse(myToDosData);
            this.myToDos = myToDosArray.map(todo => new Card(
                todo.title,
                todo.desc.replace(/\\n/g, '\n'), // Replace special sequence with line breaks
                new Date(todo.date),
                todo.done
            ));
        }

        if (doneToDosData) {
            const doneToDosArray = JSON.parse(doneToDosData);
            this.doneToDos = doneToDosArray.map(todo => new Card(
                todo.title,
                todo.desc.replace(/\\n/g, '\n'), // Replace special sequence with line breaks
                new Date(todo.date),
                todo.done
            ));
        }
    }

    // Add new card button functionality
    addNewCard() {
        Card.addCard(this.myToDos); // Add a new card to myToDos
        this.updateAndRender();
    }

    // Method to update local storage and render cards
    updateAndRender() {
        Card.saveToLocalStorage(this.myToDos, this.doneToDos);
        Card.printCards(this.myToDos, this.doneToDos, container1, container2);
    }
}
