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
            <button>${this.title}</button>
        `;
        list.appendChild(newProject);
    }

    PrintToDo() {
        const content = document.getElementById("content");
        content.innerHTML = `
            <header contenteditable="true" data-index="${this.index}">${this.title}</header>
            <div id="para" contenteditable="true">${this.desc}</div>
            <button id="pen">
                <span class="material-symbols-outlined">stylus</span>
            </button>
            <button id="delete">
                <span class="material-symbols-outlined">delete</span>
            </button>
            <h1> > Active To Dos </h1>
            <div class="container" id="c1"></div>
            <h1> > Finished To Dos </h1>
            <div class="container" id="c2"></div>
        `;

        this.updateAndRender(); // Ensure cards are printed after content is set


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

