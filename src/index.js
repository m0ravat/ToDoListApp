import './style.css';
import { Card } from './card.js';
import { ToDo } from './todo.js';

const projectsArray = [];
let currentProjectIndex = null;

export function updateProjectDisplay() {
    loadHomePage();
    const list = document.getElementById("list");
    if (list) {
        list.innerHTML = '';
        projectsArray.forEach(project => {
            project.CreateToDo();
        });
    } else {
        console.error("Element with ID 'list' not found.");
    }
}

export function saveProjectsToLocalStorage() {
    const projectsToSave = projectsArray.map(project => ({
        title: project.title,
        desc: project.desc,
        myToDos: project.myToDos.map(card => ({
            title: card.title,
            desc: card.desc,
            date: card.date.toISOString(),
            done: card.done
        })),
        doneToDos: project.doneToDos.map(card => ({
            title: card.title,
            desc: card.desc,
            date: card.date.toISOString(),
            done: card.done
        }))
    }));
    localStorage.setItem('projectsArray', JSON.stringify(projectsToSave));
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjectsFromLocalStorage();
    loadHomePage();

    document.getElementById("create").addEventListener('click', () => {
        const index = projectsArray.length;
        const newToDo = new ToDo(index, projectsArray);
        newToDo.CreateToDo();
        projectsArray.push(newToDo);
        saveProjectsToLocalStorage();
    });

    document.getElementById("list").addEventListener('click', (event) => {
        const target = event.target.closest('.projects');
        if (target) {
            const index = parseInt(target.getAttribute('data-index'), 10);
            const selectedProject = projectsArray[index];
            if (selectedProject) {
                selectedProject.PrintToDo();
                currentProjectIndex = index;
            }
        }
    });

    document.getElementById("home").addEventListener('click', loadHomePage);

    document.getElementById('content').addEventListener('click', (event) => {
        const target = event.target.closest('#delete');
        if (target) {
            if (currentProjectIndex !== null && projectsArray[currentProjectIndex]) {
                projectsArray[currentProjectIndex].DeleteProject();
                updateProjectDisplay();
                saveProjectsToLocalStorage();
            }
        }
    });

    document.getElementById('content').addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (target) {
            const index = parseInt(target.getAttribute('data-index'), 10);
            const list = target.getAttribute('data-list');
            if (target.classList.contains('delete')) {
                if (list === 'active') {
                    Card.removeCard(projectsArray[currentProjectIndex].myToDos, index);
                } else if (list === 'done') {
                    Card.removeCard(projectsArray[currentProjectIndex].doneToDos, index);
                }
            } else if (target.classList.contains('tick')) {
                if (list === 'active') {
                    Card.changeDone(projectsArray[currentProjectIndex].myToDos, index, projectsArray[currentProjectIndex].doneToDos);
                } else if (list === 'done') {
                    Card.changeDone(projectsArray[currentProjectIndex].doneToDos, index, projectsArray[currentProjectIndex].myToDos);
                }
            }
            if (projectsArray[currentProjectIndex]) {
                projectsArray[currentProjectIndex].updateAndRender();
            }
            saveProjectsToLocalStorage();
        }
    });
});

function loadProjectsFromLocalStorage() {
    const storedProjects = JSON.parse(localStorage.getItem('projectsArray'));
    if (storedProjects) {
        storedProjects.forEach((projectData, index) => {
            const newToDo = new ToDo(index, projectsArray);
            newToDo.title = projectData.title;
            newToDo.desc = projectData.desc;
            newToDo.myToDos = projectData.myToDos.map(cardData => 
                new Card(cardData.title, cardData.desc, new Date(cardData.date), cardData.done)
            );
            newToDo.doneToDos = projectData.doneToDos.map(cardData => 
                new Card(cardData.title, cardData.desc, new Date(cardData.date), cardData.done)
            );
            projectsArray.push(newToDo);
        });
        updateProjectDisplay();
    }
}

function loadHomePage() {
    document.getElementById("content").innerHTML = `
        <header>
            To Do List App
        </header>
        <div id="para">
            Hi, this is my to do list app, made using HTML, CSS, JS on VS Code and webpack. It is designed for you to set activities, or
            even make notes. You can press the pen icon to create a new card, delete an existing one using the trash can icon, or press
            the tick to indicate when an activity is finished. Once a task is finished it goes to the finished section and it can be edited
            in case. Note: The title is designed to be on one line only so if you start a new 
            line, refresh the page so it functions normally. 
        </div>
    `;
}


