export class Card {
    constructor(title = 'Untitled', desc = '', date = new Date(), done = false) {
        this.title = title;
        this.desc = desc;
        this.date = date;
        this.done = done;
    }

    static formatDate(date) {
        return date.toLocaleDateString();
    }

    static addCard(cardsArray, title = 'Untitled', desc = '', date = new Date()) {
        const newCard = new Card(title, desc, date);
        cardsArray.push(newCard);
        Card.saveToLocalStorage(cardsArray); // Save changes immediately
    }

    static removeCard(cardsArray, index) {
        if (index >= 0 && index < cardsArray.length) {
            cardsArray.splice(index, 1);
            Card.saveToLocalStorage(cardsArray); // Save changes immediately
        }
    }

    static changeDone(sourceArray, index, targetArray) {
        if (index >= 0 && index < sourceArray.length) {
            const [card] = sourceArray.splice(index, 1); // Remove the card from its current list
            card.done = !card.done; // Toggle the done status
            targetArray.push(card); // Add the card to the target list
            Card.saveToLocalStorage(sourceArray, targetArray); // Save changes immediately
        }
    }

    static updateToDoData(cardsArray, index, title, desc, date) {
        if (index >= 0 && index < cardsArray.length) {
            const card = cardsArray[index];
            card.title = title;
            card.desc = desc;
            card.date = new Date(date); // Update the date
            Card.saveToLocalStorage(cardsArray); // Save changes immediately
        }
    }

    static saveToLocalStorage(cardsArray, doneCardsArray = []) {
        localStorage.setItem('myToDos', JSON.stringify(cardsArray.map(card => ({
            ...card,
            desc: card.desc.replace(/\n/g, '\\n'),
            date: card.date.toISOString()
        }))));
        localStorage.setItem('doneToDos', JSON.stringify(doneCardsArray.map(card => ({
            ...card,
            desc: card.desc.replace(/\n/g, '\\n'),
            date: card.date.toISOString()
        }))));
    }

    static loadFromLocalStorage() {
        const myToDos = JSON.parse(localStorage.getItem('myToDos') || '[]').map(card => ({
            ...card,
            desc: card.desc.replace(/\\n/g, '\n'),
            date: new Date(card.date)
        }));
        const doneToDos = JSON.parse(localStorage.getItem('doneToDos') || '[]').map(card => ({
            ...card,
            desc: card.desc.replace(/\\n/g, '\n'),
            date: new Date(card.date)
        }));
        return { myToDos, doneToDos };
    }

    static determineBackgroundColor(dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        if (daysDiff < -8) {
            return 'lime';
        } else if (daysDiff <= -3 && daysDiff >= -7) {
            return 'yellow';
        } else if (daysDiff <= 0 && daysDiff >= -2) {
            return 'orange';
        } else if (daysDiff > 0) {
            return '#FF4545';
        }
    }

    static printCards(cardsArray, doneCardsArray, container1, container2) {
        if (!container1 || !container2) {
            console.error("One or both containers are missing.");
            return;
        }

        container1.innerHTML = ""; // Clear previous entries
        container2.innerHTML = "";

        cardsArray.forEach((card, index) => {
            const newCard = document.createElement("div");
            newCard.classList.add("projectBox");
            newCard.style.backgroundColor = Card.determineBackgroundColor(card.date);
            newCard.innerHTML = `
                <div class="title" contenteditable="true" data-index="${index}" data-list="active">
                    ${card.title}
                </div>
                <div class="notes" contenteditable="true" data-index="${index}" data-list="active">
                    ${card.desc.replace(/\n/g, '<br>')}
                </div>
                <input type="date" class="due-date" value="${card.date.toISOString().split('T')[0]}" data-index="${index}" data-list="active">
                <button class="delete" data-index="${index}" data-list="active">
                    <span class="material-symbols-outlined small">delete</span>
                </button>
                <button class="tick" data-index="${index}" data-list="active">
                    <span class="material-symbols-outlined small">check</span>
                </button>
            `;
            container1.appendChild(newCard);

            // Add event listeners for content changes
            const titleDiv = newCard.querySelector('.title');
            const notesDiv = newCard.querySelector('.notes');
            const dateInput = newCard.querySelector('.due-date');

            // Update title on blur
            titleDiv.addEventListener('blur', (event) => {
                cardsArray[index].title = event.target.textContent.trim();
                Card.saveToLocalStorage(cardsArray, doneCardsArray);
            });

            // Update description on blur
            notesDiv.addEventListener('blur', (event) => {
                cardsArray[index].desc = event.target.innerHTML.replace(/<br>/g, '\n').trim();
                Card.saveToLocalStorage(cardsArray, doneCardsArray);
            });

            // Update due date
            dateInput.addEventListener('change', (event) => {
                const newDate = new Date(event.target.value);
                cardsArray[index].date = newDate;
                const newColor = Card.determineBackgroundColor(newDate);
                newCard.style.backgroundColor = newColor;
                Card.saveToLocalStorage(cardsArray, doneCardsArray);
            });
        });

        doneCardsArray.forEach((card, index) => {
            const newDone = document.createElement("div");
            newDone.classList.add("projectBox", "done");
            newDone.innerHTML = `
                <div class="title" contenteditable="true" data-index="${index}" data-list="done">
                    ${card.title}
                </div>
                <div class="notes" contenteditable="true" data-index="${index}" data-list="done">
                    ${card.desc.replace(/\n/g, '<br>')}
                </div>
                <div class="due-date" data-index="${index}" data-list="done">
                    ${Card.formatDate(card.date)}
                </div>
                <button class="delete" data-index="${index}" data-list="done">
                    <span class="material-symbols-outlined small">delete</span>
                </button>
                <button class="tick" data-index="${index}" data-list="done">
                    <span class="material-symbols-outlined small">check</span>
                </button>
            `;
            container2.appendChild(newDone);

            // Update title on blur
            const titleDiv = newDone.querySelector('.title');
            const notesDiv = newDone.querySelector('.notes');

            titleDiv.addEventListener('blur', (event) => {
                doneCardsArray[index].title = event.target.textContent.trim();
                Card.saveToLocalStorage(cardsArray, doneCardsArray);
            });

            notesDiv.addEventListener('blur', (event) => {
                doneCardsArray[index].desc = event.target.innerHTML.replace(/<br>/g, '\n').trim();
                Card.saveToLocalStorage(cardsArray, doneCardsArray);
            });
        });
    }
}



  












