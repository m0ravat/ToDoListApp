// Card.js
const container1 = document.getElementById("c1");
const container2 = document.getElementById("c2");
export class Card {
    constructor(title = 'Untitled', desc = '', date = new Date(), done = false) {
        this.title = title;
        this.desc = desc;
        this.date = date;
        this.done = done;
    }

    // Function to format the date
    static formatDate(date) {
        return date.toLocaleDateString();
    }

    // Method to add a new card to the list
    static addCard(cardsArray, title = 'Untitled', desc = '', date = new Date()) {
        const newCard = new Card(title, desc, date);
        cardsArray.push(newCard);
    }

    // Method to remove a card from the list
    static removeCard(cardsArray, index) {
        if (index >= 0 && index < cardsArray.length) {
            cardsArray.splice(index, 1);
        }
    }

    // Method to toggle the done state of a card
    static changeDone(sourceArray, index, targetArray) {
        if (index >= 0 && index < sourceArray.length) {
            const [card] = sourceArray.splice(index, 1); // Remove the card from its current list
            card.done = !card.done; // Toggle the done status
            targetArray.push(card); // Add the card to the target list
        }
    }

    // Method to update card data
    static updateToDoData(cardsArray, index, title, desc, date) {
        if (index >= 0 && index < cardsArray.length) {
            const card = cardsArray[index];
            card.title = title;
            card.desc = desc;
            card.date = new Date(date); // Update the date
        }
    }

    // Method to save cards to localStorage
    static saveToLocalStorage(cardsArray, doneCardsArray = []) {
        localStorage.setItem('myToDos', JSON.stringify(cardsArray.map(card => ({
            ...card,
            desc: card.desc.replace(/\n/g, '\\n'), // Replace line breaks with a special sequence
            date: card.date.toISOString()
        }))));
        localStorage.setItem('doneToDos', JSON.stringify(doneCardsArray.map(card => ({
            ...card,
            desc: card.desc.replace(/\n/g, '\\n'), // Replace line breaks with a special sequence
            date: card.date.toISOString()
        }))));
    }

    static determineBackgroundColor(dueDate) {
        const today = new Date();
        // Remove time information from today's date for accurate day comparison
        today.setHours(0, 0, 0, 0);
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert time difference to days
        console.log(daysDiff);
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

    // Method to print all cards to the containers
    static printCards(cardsArray, doneCardsArray, container1, container2) {
        container1.innerHTML = ""; // Clear previous entries
        container2.innerHTML = "";

        // Render active to-dos
        cardsArray.forEach((card, index) => {
            const newCard = document.createElement("div");
            newCard.classList.add("projectBox");
            newCard.style.backgroundColor = Card.determineBackgroundColor(card.date);
            newCard.innerHTML = `
                <div class="title" contenteditable="true" data-index="${index}" data-list="active">
                    ${card.title}
                </div>
                <div class="notes" contenteditable="true" data-index="${index}" data-list="active">
                    ${card.desc.replace(/\n/g, '<br>')} <!-- Convert \n to <br> -->
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
        });

        // Render done to-dos
        doneCardsArray.forEach((card, index) => {
            const newDone = document.createElement("div");
            newDone.classList.add("projectBox", "done");
            newDone.innerHTML = `
                <div class="title" contenteditable="true" data-index="${index}" data-list="done">
                    ${card.title}
                </div>
                <div class="notes" contenteditable="true" data-index="${index}" data-list="done">
                    ${card.desc.replace(/\n/g, '<br>')} <!-- Convert \n to <br> -->
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
        });
    }
}










