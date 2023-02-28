import sharp from 'sharp';

const getRandom = (min, max) => {
    const id = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(id);
}

export class imageConfigurator {
    static async createDefaultAvatar(username) {
        const letters = username.slice(0, 2);
        const size = 200;

        const avatar = sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: getRandom(20, 200), g: getRandom(20, 200), b: getRandom(20, 200), alpha: 1 }
            }
        }).resize(size, size)
            .webp();

        const text = sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        }).resize(size, size)
            .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .sharpen()
            .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${size / 2}" fill="#333">${letters}</text></svg>`), gravity: 'center' }])
            .webp();


        Promise.all([avatar.toBuffer(), text.toBuffer()])
            .then(([avatarBuffer, textBuffer]) => sharp(avatarBuffer)
                .composite([{ input: textBuffer }])
                .webp()
                .toFile(`../public/avatars/${username}.webp`)
            ).then(() => {
                console.log("File was successfully saved!");
            }).catch((error) => {
                console.log("Avatar saving error:", error);
            });

        return `/avatars/${username}.webp`;
    }
}