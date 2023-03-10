import sharp from 'sharp';
import { v4 } from 'uuid';
import { getRandom } from '../modules/utils.js';

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

    static createCustomAvatar(username, avatar) {
        const size = parseInt(process.env.AVATAR_SIZE);

        sharp(avatar)
            .resize({
                width: size,
                height: size,
                fit: 'cover',
            })
            .webp()
            .toBuffer()
            .then(resizedAvatar => {
                sharp(resizedAvatar).toFile(`src/public/avatars/${username}.webp`)
            })
            .catch((error) => {
                console.log("Avatar saving error:", error);
            });

        return `/avatars/${username}.webp`;
    }

    static async handleNewImage(image) {
        const imageBuffer = image.data;
        const middleSize = parseInt(process.env.IMAGE_MIDDLE_SIZE);
        const smallSize = parseInt(process.env.IMAGE_SMALL_SIZE);
        const randomName = v4();

        const pathes = {
            full: `/images/${randomName}_100.png`,
            middle: `/images/${randomName}_${middleSize}.png`,
            small: `/images/${randomName}_${smallSize}.png`,
        };
        const webpPathes = {
            full: `/images/${randomName}_100.webp`,
            preview: `/images/${randomName}_${smallSize}.webp`,
        };

        // DEFAULT IMAGE
        sharp(imageBuffer).png().toFile('src/public' + pathes.full);
        sharp(imageBuffer).webp().toFile('src/public' + webpPathes.full);

        // MIDDLE IMAGE
        let meta = await sharp(imageBuffer).metadata()
        let width = Math.round(meta.width * middleSize / 100);
        let height = Math.round(meta.height * middleSize / 100);
        sharp(imageBuffer).resize(width, height).png().toFile('src/public' + pathes.middle);

        // SMALL IMAGE
        meta = await sharp(imageBuffer).metadata();
        width = Math.round(meta.width * smallSize / 100);
        height = Math.round(meta.height * smallSize / 100);
        sharp(imageBuffer).resize(width, height).png().toFile('src/public' + pathes.small);
        sharp(imageBuffer).resize(width, height).webp().toFile('src/public' + webpPathes.preview);

        return { pathes, webpPathes };
    }
}