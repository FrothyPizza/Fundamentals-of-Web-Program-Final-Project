
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

    addSliderValue(name, number, min, max, step, callback) {
        let sliderContainer = document.createElement("div");
        sliderContainer.classList.add("sliderContainer");

        let text = document.createElement("div");
        text.classList.add("sliderText");
        text.innerHTML = name;
        sliderContainer.appendChild(text);

        let slider = document.createElement("input");
        slider.classList.add("slider");
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = number;
        sliderContainer.appendChild(slider);

        let value = document.createElement("input");
        value.type = "number";
        value.value = number;
        value.classList.add("sliderValue");
        sliderContainer.appendChild(value);
        this.container.appendChild(sliderContainer);

        value.oninput = () => {
            slider.value = value.value;
            callback(slider.value);
        };
        slider.oninput = () => {
            value.value = slider.value;
            callback(slider.value);
        };

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

        this.pages.settings.addSliderValue("Volume", 10, 0, 100, 1, (e) => {

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