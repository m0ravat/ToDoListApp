import { updateProjectDisplay, saveProjectsToLocalStorage } from './index.js';
import { Card } from './card.js';

export class ToDo {
    constructor(index, projectsArray) {
        this.index = index; 
        this.title = "New To Do";
        this.desc = "Description of ToDo";
        this.myToDos = []; 
        this.doneToDos = [];
        this.projectsArray = projectsArray; 
    }

    CreateToDo() {
        const list = document.getElementById("list");
        const newProject = document.createElement("li");
        newProject.classList.add("projects");
        newProject.setAttribute("data-index", this.index);
        newProject.innerHTML = `
            <button><i class="fas fa-home"></i>${this.title}</button>
        `;
        list.appendChild(newProject);
    }

    PrintToDo() {
        const content = document.getElementById("content");
        content.innerHTML = `
            <header contenteditable="true" data-index="${this.index}">${this.title}</header>
            <div id="para" contenteditable="true">${this.desc}</div>
            <h1> > Active To Dos </h1>
            <div class="container" id="c1"></div>
            <h1> > Finished To Dos </h1>
            <div class="container" id="c2"></div>
            <button id="pen">
                <span class="material-symbols-outlined">stylus</span>
            </button>
            <button id="delete">
                <span class="material-symbols-outlined">delete</span>
            </button>
        `;

        this.updateAndRender(); // Ensure cards are printed after content is set

        document.getElementById('pen').addEventListener('click', () => {
            this.addNewCard();
        });

        document.getElementById('delete').addEventListener('click', () => {
            this.DeleteProject();
            updateProjectDisplay();
        });

        this.addCardEventListeners();
        this.addEditEventListeners();
    }

    addEditEventListeners() {
        const header = document.querySelector('header[data-index]');
        const para = document.getElementById('para');

        if (header) {
            header.addEventListener('blur', () => {
                this.title = header.innerText.trim();
                this.saveChanges();
                this.updateSidebar();
            });
        }

        if (para) {
            para.addEventListener('blur', () => {
                this.desc = para.innerText.trim();
                this.saveChanges();
            });
        }
    }

    saveChanges() {
        saveProjectsToLocalStorage();
    }

    updateSidebar() {
        const list = document.getElementById("list");
        const projectItem = list.querySelector(`li[data-index="${this.index}"]`);
        if (projectItem) {
            projectItem.querySelector('button').innerHTML = `<i class="fas fa-home"></i>${this.title}`;
        }
    }

    addCardEventListeners() {
        const c1 = document.getElementById('c1');
        const c2 = document.getElementById('c2');

        if (c1) {
            c1.addEventListener('click', (event) => {
                const target = event.target.closest('button');
                if (target) {
                    const index = parseInt(target.getAttribute('data-index'), 10);
                    const list = target.getAttribute('data-list');
                    if (target.classList.contains('delete')) {
                        Card.removeCard(this.myToDos, index);
                    } else if (target.classList.contains('tick')) {
                        Card.changeDone(this.myToDos, index, this.doneToDos);
                    }
                    this.updateAndRender();
                }
            });
        }

        if (c2) {
            c2.addEventListener('click', (event) => {
                const target = event.target.closest('button');
                if (target) {
                    const index = parseInt(target.getAttribute('data-index'), 10);
                    const list = target.getAttribute('data-list');
                    if (target.classList.contains('delete')) {
                        Card.removeCard(this.doneToDos, index);
                    } else if (target.classList.contains('tick')) {
                        Card.changeDone(this.doneToDos, index, this.myToDos);
                    }
                    this.updateAndRender();
                }
            });
        }
    }

    DeleteProject() {
        if (this.index >= 0 && this.index < this.projectsArray.length) {
            this.projectsArray.splice(this.index, 1);
        }
    }

    addNewCard() {
        Card.addCard(this.myToDos);
        this.updateAndRender();
    }

    updateAndRender() {
        const c1 = document.getElementById("c1");
        const c2 = document.getElementById("c2");

        if (c1) {
            Card.printCards(this.myToDos, this.doneToDos, c1, c2);
        }
    }
}

