import sharp from 'sharp';

const getRandom = (min, max) => {
    const id = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(id);
}

export default class imageService {
    static createDefaultAvatar(username) {
        const letters = username.slice(0, 2).toUpperCase();
        const size = parseInt(process.env.AVATAR_SIZE);

        const avatar = sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        }).resize(size, size)
            .webp();

        const text = sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            }
        }).resize(size, size)
            .flatten({ background: { r: getRandom(30, 210), g: getRandom(30, 210), b: getRandom(30, 210), alpha: 1 } })
            .sharpen()
            .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><text x="50%" y="67%" dominant-baseline="middle" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${size / 2}" fill="#fff">${letters}</text></svg>`), gravity: 'centre' }])
            .webp();


        Promise.all([avatar.toBuffer(), text.toBuffer()])
            .then(([avatarBuffer, textBuffer]) => sharp(avatarBuffer)
                .composite([{ input: textBuffer }])
                .webp()
                .toFile(`src/public/avatars/${username}.webp`)
            ).then(() => {
                console.log("Avatar was successfully saved!");
            }).catch((error) => {
                console.log("Avatar saving error:", error);
            });

        return `/avatars/${username}.webp`;
    }
}