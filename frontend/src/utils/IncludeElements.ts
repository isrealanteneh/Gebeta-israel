export function selectElement(elements: string[] | string) {
    if (Array.isArray(elements)) {
        let selectedElements: Record<string, HTMLElement> = {};

        elements.forEach((eachElm: string) => {
            const selectedElement = document.querySelector(eachElm) as HTMLElement;
            if (selectedElement === null) throw new Error(`Javascript could not find html element ${eachElm}`);

            selectedElements[eachElm] = selectedElement;
        })

        return selectedElements;
    }

    if (typeof elements === "string") {
        const elm = document.querySelector(elements) as HTMLElement;
        if (elm === null) throw new Error(`Javascript could not find html element ${elements}`);
        return elm;
    }


    throw new Error(`Invalid input element`);
}