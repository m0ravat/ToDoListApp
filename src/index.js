import './style.css';
import { Card } from './card.js'; // Import the Card class
import { ToDo } from './todo.js';

const container1 = document.getElementById("c1");
const container2 = document.getElementById("c2");
const project = new ToDo();

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

    // Add new project functionality
    document.getElementById("create").addEventListener('click', function () {
        const NewToDo = new ToDo();
        NewToDo.CreateToDo(); // Corrected method call
    });
});
