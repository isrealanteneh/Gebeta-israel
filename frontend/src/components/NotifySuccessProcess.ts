import './NotifySuccessProcess.css';

const margin = 16;

const Notification = (title: string, msg: string, notificationPosition: HTMLDivElement): void => {
    const notification = document.createElement("div");
    notification.classList.add("notification");

    notification.innerHTML = `
        <div class="content">
            <h4 class="title open-sans-500">${title}</h4>
            <p class="description open-sans-300">${msg}</p>
        </div>
        <button class="close open-sans-300" aria-label="Dismiss notification">Close</button>
    `;

    const closeButton = notification.querySelector(".close") as HTMLButtonElement;
    closeButton.addEventListener("click", removeNotification);

    notification.style.top = `${margin}px`;
    notificationPosition?.prepend(notification);

    const currentHeight = notification.offsetHeight;
    const restNotifications = Array.from(document.querySelectorAll(".notification")).slice(1);

    restNotifications.forEach((item) => {
        const container = item as HTMLDivElement;
        container.style.top = `${parseInt(container.style.top) + currentHeight + margin}px`;
    });
};

const removeNotification = (event: MouseEvent): void => {
    const closeButton = event.currentTarget as HTMLButtonElement;
    const notification = closeButton.parentNode as HTMLDivElement;
    const currentHeight = notification.offsetHeight;

    const restNotifications: HTMLDivElement[] = [];
    let next = notification.nextElementSibling;

    while (next && next.matches(".notification")) {
        restNotifications.push(next as HTMLDivElement);
        next = next.nextElementSibling;
    }

    restNotifications.forEach((item) => {
        const container = item as HTMLDivElement;
        container.style.top = `${parseInt(container.style.top) - currentHeight - margin}px`;
    });

    notification.classList.add("animate-out");
    notification.addEventListener("animationend", () => {
        notification.remove();
    });
};

export { Notification };