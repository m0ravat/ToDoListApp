import './style.css';
import { Card } from './card.js'; // Import the Card class

const container1 = document.getElementById("c1");
const container2 = document.getElementById("c2");

class Project {
    constructor() {
        this.myToDos = [];
        this.doneToDos = [];
        this.loadFromLocalStorage();
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

const project = new Project(); // Create a new project instance

document.addEventListener('DOMContentLoaded', () => {
    project.updateAndRender();

    // Handle clicks for delete and tick buttons for both containers
    [container1, container2].forEach(container => {
        container.addEventListener('click', (event) => {
            const target = event.target.closest('button');
            if (target) {
                const index = parseInt(target.getAttribute('data-index'), 10);
                const list = target.getAttribute('data-list');
                if (target.classList.contains('delete')) {
                    if (list === 'active') {
                        Card.removeCard(project.myToDos, index);
                    } else if (list === 'done') {
                        Card.removeCard(project.doneToDos, index);
                    }
                } else if (target.classList.contains('tick')) {
                    if (list === 'active') {
                        Card.changeDone(project.myToDos, index, project.doneToDos);
                    } else if (list === 'done') {
                        Card.changeDone(project.doneToDos, index, project.myToDos);
                    }
                }
                project.updateAndRender();
            }
        });
    });

    // Handle blur events to update the title and description
    document.addEventListener('blur', (event) => {
        const target = event.target;
        if (target.classList.contains('title') || target.classList.contains('notes') || target.classList.contains('due-date')) {
            const index = parseInt(target.getAttribute('data-index'), 10);
            const list = target.getAttribute('data-list');
            const titleElement = document.querySelector(`.title[data-index="${index}"][data-list="${list}"]`);
            const descElement = document.querySelector(`.notes[data-index="${index}"][data-list="${list}"]`);
            const dateElement = document.querySelector(`.due-date[data-index="${index}"][data-list="${list}"]`);

            if (titleElement && descElement && dateElement) {
                const title = titleElement.textContent.trim();
                const desc = descElement.innerHTML.replace(/<br>/g, '\n').trim(); // Convert <br> to \n
                const date = dateElement.tagName === 'INPUT' ? dateElement.value : new Date(dateElement.textContent).toISOString();

                if (list === 'active') {
                    Card.updateToDoData(project.myToDos, index, title, desc, date);
                } else if (list === 'done') {
                    Card.updateToDoData(project.doneToDos, index, title, desc, date);
                }
                project.updateAndRender();
            }
        }
    }, true); // Added `true` for useCapture to handle events on child elements

    // Add new card button functionality
    document.getElementById('pen').addEventListener('click', () => {
        project.addNewCard();
    });
});
import { createProject } from './navbar.js';
document.getElementById("create").addEventListener('click',createProject);