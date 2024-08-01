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
        const target = event.target.closest('#pen');
        if (target) {
            if (currentProjectIndex !== null && projectsArray[currentProjectIndex]) {
                projectsArray[currentProjectIndex].addNewCard();
                saveProjectsToLocalStorage();
            }
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
            Welcome to MyNotesToDo!
        </header>
        <div class="para">
        Hi, this is my multi functional and easy to use notes/to do app. It can be used to keep track of tasks you need to do, but 
        its functionality means you can also use it for notes! Do you have multiple projects with tasks or need to split up your notes?
        Don't worry because we have allowed you to make multiple cards and projects, all stored on your local device storage.
        </div>
        <header> How This Works </header>
        <div class = "para">
        So how does the app work? Well to create a new project refer to the vertical navbar on the left and press the create a new project
        button, which generates a new project environment for you. You can insert a title or description for the project in case you come back
        to it later on and forget what it was for. To get started you can generate new card using the pen button at the bottom right of the project screen. 
        The cards have their own respective titles and descriptions which can be altered at any stage, 
        and the tick button changes it from an active task to finished and vice versa, but fret not because you can edit the contents of a finished card
        to make any last minute changes. To delete a card press the bin button on the card, and the bin button next to the pen will delete the project, so please be careful. 
        </div>
        <header> What are the colours on the cards for? </header>
        <div class = "para"> 
        Well that is a good question, since this was originally a simple to do list program the date at the bottom of each card is designed 
        as a due date, but for notes can be changed for colour scheming if you wish. It works as follows: <br> <br>
        Green - You still have plenty of time to do your task (8+ days left to get it done) <br>
        Yellow - The task is apporaching but you still have time (7 days) <br>
        Orange - The tasks due date is almost there (You have 2 days from today) <br>
        Red - The task should've been done (The date was set before today) <br>
        Blue - This means the task has been put in the finished section, indicating the task has been completed. 
        </div>
        <header> What to do if you encounter a bug </header> 
        <div class="para">
        Since I am the sole creator of this website there may be problems in functionality, <br> whether its specific to a browser or otherwise, feel free to get in touch with the form below:
        <div id="form">
            <form action="mailto:moravat763@gmail.com" method="post" enctype="text/plain" id="ff">
                <fieldset class="form one">
                    <legend>Positive Feedback</legend>
                    <label for="name1">Name: </label>
                    <input type="text" id="name1" placeholder="Your name" required minlength="3"> <br> <br>

                    <label for="email1">Email address: </label>
                    <input type="email" id="email1" name="email" placeholder="youremail@email.com"><br> <br                    
                    
                    <label for="extraP1">Comments:</label>
                    <textarea name="extraP" id="extraP1" cols="100" rows="7"></textarea> <br>
                    <input type="submit" value="Submit" class="buttons">
                    <input type="reset" value="Reset" class="buttons">
                </fieldset>
            
            </form>
        </div>
        </div>
    `;
}



