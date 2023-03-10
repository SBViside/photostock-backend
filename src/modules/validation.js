export function httpFileExists(value, { req }) {
    if (!req.files || !req.files.image) {
        throw new Error('Image not found');
    }
    return true;
}

export function httpFileIsImage(value, { req }) {
    const file = req.files.image;
    if (!/^image\/.+/.test(file.mimetype)) {
        throw new Error('The file is not an image')
    }
    return true;
}