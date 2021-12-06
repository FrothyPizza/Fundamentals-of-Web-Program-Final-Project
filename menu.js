
class MenuPage {
    constructor(name, container, isRoot) {
        this.container = document.createElement("div");
        this.container.classList.add("menuPage");
        this.container.id = name;
        this.hide();

        container.appendChild(this.container);

        this.name = name;
        this.buttons = [];

        if(!isRoot) {
            this.addButton("Back");
            this.previousPage = null;
        }
    }

    addButton(buttonName, callback) {
        let button = document.createElement("button");
        button.innerHTML = buttonName;
        button.classList.add("menuButton");
        button.onclick = callback;
        this.buttons.push(button);
        this.container.appendChild(button);
    }

    show(previousPage) {
        this.container.classList.remove("hidden");
        this.previousPage = previousPage;

        for (let i = 0; i < this.buttons.length; i++) {
            if(this.buttons[i].innerHTML == "Back") {
                this.buttons[i].onclick = () => {
                    this.hide();
                    this.previousPage.show();
                }
            }
        }

    }

    hide() {
        this.container.classList.add("hidden");
    }

}



class Menu {
    constructor() {
        this.container = document.createElement("div");
        this.container.classList.add("menuContainer");


        this.pages = {
            main: new MenuPage("mainMenu", this.container, true),
            settings: new MenuPage("settingsMenu", this.container),
            gameSelect: new MenuPage("gameSelectMenu", this.container),
        };


        this.pages.main.addButton("Select Game", () => {
            this.setCurrentPage(this.pages.gameSelect);
        });
        this.pages.main.addButton("Settings", () => {
            this.setCurrentPage(this.pages.settings);
        });




        this.currentPage = this.pages.main;
        this.setCurrentPage(this.currentPage);


        document.body.appendChild(this.container);
    }


    setCurrentPage(page) {
        this.currentPage.hide();
        page.show(this.currentPage);
    }

}


new Menu();