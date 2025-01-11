import './IncomingReq.css';

const margin = 16;

const IncomingRequest = (title: string, msg: string, notificationPosition: HTMLDivElement, onAccept: () => void, onReject: () => void): void => {
    const notification = document.createElement("div");
    notification.classList.add("notification");

    notification.innerHTML = `
        <div class="content">
            <h4 class="title open-sans-500">${title}</h4>
            <p class="description open-sans-300">${msg}</p>
        </div>
        <div class="actions">
            <button class="accept open-sans-300" aria-label="Accept request">Accept</button>
            <button class="reject open-sans-300" aria-label="Reject request">Reject</button>
        </div>
    `;

    const acceptButton = notification.querySelector(".accept") as HTMLButtonElement;
    const rejectButton = notification.querySelector(".reject") as HTMLButtonElement;

    acceptButton.addEventListener("click", () => {
        onAccept();
        removeNotification(notification);
    });

    rejectButton.addEventListener("click", () => {
        onReject();
        removeNotification(notification);
    });

    notification.style.top = `${margin}px`;
    notificationPosition?.prepend(notification);

    const currentHeight = notification.offsetHeight;
    const restNotifications = Array.from(document.querySelectorAll(".notification")).slice(1);

    restNotifications.forEach((item) => {
        const container = item as HTMLDivElement;
        container.style.top = `${parseInt(container.style.top) + currentHeight + margin}px`;
    });
};

const removeNotification = (notification: HTMLDivElement): void => {
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

export { IncomingRequest };