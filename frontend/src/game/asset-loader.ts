function loadAsset(name: string) {
    return new Promise<HTMLImageElement>((resolve: any, reject: any) => {
        const img = new Image();
        img.src = '/assets/' + name;
        img.onload = () => { resolve(img) };
        img.onerror = () => { reject(new Error(`Couldn't load the img.`)) };

    })
}
function loadMultiple(name: string[]) {
    return Promise.all(
        name.map(val => loadAsset(val))
    )
}

export { loadAsset, loadMultiple }