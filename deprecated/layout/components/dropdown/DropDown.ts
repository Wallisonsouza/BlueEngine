import "./style.css";

class DropDownOption {
    public readonly key: string;
    public value: any;
    public readonly element: HTMLDivElement;

    constructor(key: string, value: any, onSelect: (key: string, value: any) => void) {
        this.key = key;
        this.value = value;

        this.element = document.createElement("div");
        this.element.className = "dropdown-option";
        this.element.textContent = key;

        this.element.addEventListener("click", () => onSelect(this.key, this.value));
    }
}

export default class DropDown {
    public readonly element: HTMLDivElement;
    private readonly dropdownTitle: HTMLDivElement;
    private readonly dropdownContent: HTMLDivElement;
    private options: Map<string, DropDownOption> = new Map();

    public key?: string;
    public value?: any;
    public onClick?: (e: { key: string; value: any }) => void;

    constructor(title: string = "New Dropdown") {
        this.element = document.createElement("div");
        this.dropdownTitle = document.createElement("div");
        this.dropdownContent = document.createElement("div");

        this.element.className = "dropdown";
        this.dropdownTitle.className = "dropdown-title";
        this.dropdownContent.className = "dropdown-content";

        this.dropdownTitle.textContent = title;
        this.element.append(this.dropdownTitle, this.dropdownContent);

        this.dropdownContent.style.display = "none";

        this.dropdownTitle.addEventListener("click", (event) => {
            event.stopPropagation();
            this.toggleDropdown();
        });

        // Fechar dropdowns ao clicar fora
        document.addEventListener("click", (event) => {
            if (!this.element.contains(event.target as Node)) {
                this.closeDropdown();
            }
        });
    }

    private toggleDropdown(): void {
        const isVisible = this.dropdownContent.style.display === "block";
        this.closeAllDropdowns(); // Fecha outros antes de abrir o atual
        this.dropdownContent.style.display = isVisible ? "none" : "block";
    }

    private closeDropdown(): void {
        this.dropdownContent.style.display = "none";
    }

    private closeAllDropdowns(): void {
        document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
            (dropdown as HTMLElement).style.display = "none";
        });
    }

    public setTitle(title: string): void {
        this.dropdownTitle.textContent = title;
    }

    public addOption(key: string, value: any): void {
        if (this.options.has(key)) return;

        const option = new DropDownOption(key, value, (selectedKey, selectedValue) => {
            this.key = selectedKey;
            this.value = selectedValue;

            this.onClick?.({ key: this.key, value: this.value });

            this.setTitle(this.key);
            this.closeDropdown();
        });

        this.dropdownContent.append(option.element);
        this.options.set(key, option);
    }

    public updateOption(key: string, newValue: any): void {
        const option = this.options.get(key);
        if (!option) return;

        option.value = newValue;
    }

    public removeOption(key: string): void {
        const option = this.options.get(key);
        if (!option) return;

        this.dropdownContent.removeChild(option.element);
        this.options.delete(key);
    }

    public clearOptions(): void {
        this.dropdownContent.innerHTML = "";
        this.options.clear();
    }
}
