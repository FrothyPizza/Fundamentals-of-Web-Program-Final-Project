 
class MenuPage { 
    constructor(name, parentMenu, isRoot) {
        this.parentMenu = parentMenu;

        this.container = document.createElement("div");
        this.container.classList.add("menuPage");
        this.container.id = name;
        this.hide();

        parentMenu.container.appendChild(this.container);

        this.name = name;
        this.buttons = [];

        if(!isRoot) {
            this.addButton("Back");
            this.previousPage = null;
        }
    }

	setBackButtonPage(page) {
		this.backButtonPage = page;
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
        sliderContainer.id = name;

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

    show() {
        this.container.classList.remove("hidden");

        for (let i = 0; i < this.buttons.length; i++) {
            if(this.buttons[i].innerHTML == "Back") {
                this.buttons[i].onclick = () => {
                    this.parentMenu.setCurrentPage(this.backButtonPage);
                }
            }
        }

    }

    hide() {
        this.container.classList.add("hidden");
        console.log("Hiding " + this.name + " page");
    }

}



class Menu {
    constructor() {
        this.container = document.createElement("div");
        this.container.classList.add("menuContainer");


        this.pages = {
            main: new MenuPage("mainMenu", this, true),
            settings: new MenuPage("settingsMenu", this),
            gameSelect: new MenuPage("gameSelectMenu", this),
            colors: new MenuPage("colorsMenu", this),
            about: new MenuPage("aboutMenu", this),
        };

		this.pages.settings.setBackButtonPage(this.pages.main);
		this.pages.gameSelect.setBackButtonPage(this.pages.main);
		this.pages.colors.setBackButtonPage(this.pages.settings);
		this.pages.about.setBackButtonPage(this.pages.main);

        this.pages.main.addButton("Settings", () => {
            this.setCurrentPage(this.pages.settings);
        });
        this.pages.main.addButton("Select Game", () => {
            this.setCurrentPage(this.pages.gameSelect);
        });
        this.pages.main.addButton("About", () => {
            this.setCurrentPage(this.pages.about);
        });



        this.pages.gameSelect.addButton("Hal's Tower 2", () => {
            window.location.href = "Hal's Tower 2/index.html";
        });
        this.pages.gameSelect.addButton("Tetrainer", () => {
            window.location.href = "Tetris/index.html";
        });
        this.pages.gameSelect.addButton("Asteroids", () => {
            window.location.href = "Asteroids/index.html";
        });



        this.pages.settings.addButton("Colors", () => {
            this.setCurrentPage(this.pages.colors);
        });

        this.pages.settings.addSliderValue("Border Radius", 10, 0, 30, 0.1, (e) => {
            this.container.querySelectorAll("*").forEach(element => {
                element.style.borderRadius = e + "px";
            });
        });

        this.pages.settings.addSliderValue("Size", 20, 10, 30, 0.1, (e) => {
            this.container.style.fontSize = e + "px";
        });
        this.pages.settings.addSliderValue("Border Width", 1, 0, 10, 0.1, (e) => {
            this.container.querySelectorAll("*").forEach(element => {
                element.style.borderWidth = e + "px";
            });
        });
        this.pages.settings.addSliderValue("Hover Speed", 0.75, 0, 2, 0.01, (e) => {
            this.container.querySelectorAll("button").forEach(element => {
                element.style.animationDuration = 2.01-e + "s";
                if(e == 0) {
                    element.style.animationDuration = "0s";
                }
            });
        });

        this.pages.settings.addButton("Save Settings", () => {
            this.saveValues();
        });
        this.pages.settings.addButton("Load Settings", () => {
            this.loadValues();
        });



        this.pages.colors.addSliderValue("Red", 255, 0, 255, 1, (e) => {
            this.container.querySelectorAll("*").forEach(element => {
                let rgb = element.style.color;
                rgb = rgb.substring(4, rgb.length - 1);
                rgb = rgb.split(", ");
                rgb[0] = e;
                element.style.color = "rgb(" + rgb.join(", ") + ")";
            });
        });

        this.pages.colors.addSliderValue("Green", 255, 0, 255, 1, (e) => {
            this.container.querySelectorAll("*").forEach(element => {
                let rgb = element.style.color;
                rgb = rgb.substring(4, rgb.length - 1);
                rgb = rgb.split(", ");
                rgb[1] = e;
                element.style.color = "rgb(" + rgb.join(", ") + ")";
            });
        });

        this.pages.colors.addSliderValue("Blue", 255, 0, 255, 1, (e) => {
            this.container.querySelectorAll("*").forEach(element => {
                let rgb = element.style.color;
                rgb = rgb.substring(4, rgb.length - 1);
                rgb = rgb.split(", ");
                rgb[2] = e;
                element.style.color = "rgb(" + rgb.join(", ") + ")";
            });
        });
        this.container.querySelectorAll("*").forEach(element => {
            if(element.tagName == "BUTTON") {
                element.onmouseover = () => {
                    if(element.style.color == "rgb(255, 255, 255)") {
                        element.style.color = "rgb(0, 0, 0)";
                    }
                }
                element.onmouseout = () => {
                    if(element.style.color == "rgb(0, 0, 0)") {
                        element.style.color = "rgb(255, 255, 255)";
                    }
                }
            }
            element.style.color = "rgb(255, 255, 255)";
        });



        this.container.querySelectorAll("*").forEach(element => {
            if(element.classList.contains("sliderValue")) {
                element.oninput();
            }
        });

        this.currentPage = this.pages.main;
        this.setCurrentPage(this.currentPage);

        
        document.body.appendChild(this.container);
    }


    setCurrentPage(page) {
        console.log("Setting current page to " + page.name + " from " + this.currentPage.name);
        this.currentPage.hide();
        page.show(this.currentPage);
        this.currentPage = page;
    }

    saveValues() {
        let values = {};
        this.container.querySelectorAll("*").forEach(element => {
            if(element.classList.contains("sliderValue")) {
                values[element.parentElement.id] = element.value;
            }
        });
        console.log(values);
        localStorage.setItem("settings", JSON.stringify(values));
    }

    loadValues() {
        let values = JSON.parse(localStorage.getItem("settings"));
        if(values == null) {
            return;
        }
        this.container.querySelectorAll("*").forEach(element => {
            if(element.classList.contains("sliderValue")) {
                element.value = values[element.parentElement.id];
                element.oninput();
            }
        });
    }

}
let menu = new Menu();