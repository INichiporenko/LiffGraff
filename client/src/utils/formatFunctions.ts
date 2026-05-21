export const formatDate = (date: Date | null | undefined ) => {
    const now = Date.now();
    if (date) {
        const diffTime = Math.abs(now - date.getTime());
        const diffSeconds = Math.floor(diffTime/1000);
        if (diffSeconds <= 60) {
            return `${diffSeconds}s`;
        }

        const diffMinutes = Math.floor(diffTime/(1000*60));
        if (diffMinutes <= 60) {
            return `${diffMinutes}m`;
        }

        const diffHours = Math.floor(diffTime/(1000*60 * 60));
        if (diffHours <= 24) {
            return `${diffHours}h`;
        }

        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 6) {
            return `${diffDays}d`;
        }

        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        return `${diffWeeks}w`;
    }
    return;
};

export const formatMessageTime = (date: string | Date): string => {
    const d = new Date(date);
    const now = new Date();

    const hours = d.getHours();
    const minutes = d.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    const isToday = d.toDateString() === now.toDateString();
    const isThisWeek = now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;

    if (isToday) {
        // Format: "13:40"
        return `${formattedHours}:${formattedMinutes}`;
    } else if (isThisWeek) {
        // Format: "Сб 14:43"
        const day = daysOfWeek[d.getDay()];
        return `${day} ${formattedHours}:${formattedMinutes}`;
    } else {
        // Format: "28.12.2024, 18:22"
        const day = d.getDate();
        const month = d.getMonth() + 1; // Months are zero-based
        const year = d.getFullYear();
        return `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${year}, ${formattedHours}:${formattedMinutes}`;
    }
};