export function httpFileExists(value, { req }) {
    if (!req.files || !req.files.avatar) {
        throw new Error('Avatar not found');
    }
    return true;
}

export function httpFileIsImage(value, { req }) {
    const file = req.files.avatar;
    if (!/^image\/.+/.test(file.mimetype)) {
        throw new Error('The file is not an image')
    }
    return true;
}