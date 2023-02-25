class Element {
    constructor(tag, attributes, content, color) {
        this.elem = document.createElement(tag);

        for (let attrKey in attributes) {
            if (attrKey === 'class') {
                this.elem.classList.add(attributes[attrKey]);
                continue;
            }

            this.elem.setAttribute(attrKey, attributes[attrKey])
        }

        // for (let handlerKey in handlers) {
        //     this.elem.addEventListener(handlerKey, handlers[handlerKey])
        // }

        if (content) {
            this.elem.textContent = content;
            this.elem.style.color = color;
        }
        
    }

    render(parentSelector) {
        const parent = document.querySelector(parentSelector);
        if (parent) {
            parent.appendChild(this.elem);
        }
    }
}





