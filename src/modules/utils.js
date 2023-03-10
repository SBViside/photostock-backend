export const getRandom = (min, max) => {
    const id = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(id);
}

export const bytesToMegabytes = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(2);
}