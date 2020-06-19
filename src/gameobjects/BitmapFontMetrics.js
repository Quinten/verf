/**
 * A helper config object for calculating the positions of a BitmapFont.
 * @memberof module:gameobjects~
 */
class BitmapFontMetrics {

    /**
     * @param {object} config - A configuration object that describes how the bitmap is structured.
     * @param {number} [config.width=8] - The width in pixels of a single character.
     * @param {number} [config.height=8] - The height in pixels of a single character.
     * @param {string} [config.chars=See source code] - Which character is in which position.
     * @param {number} [config.charsPerRow=16] - The number of characters in a row in the bitmap.
     */
    constructor ({
        width = 8,
        height = 8,
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ .,!?#abcdefghijklmnopqrstuvwxyz@:;^%&1234567890*\'"`[]/\\~+-=<>(){}_|$',
        charsPerRow = 16
    } = {})
    {
        this.width = width;
        this.height = height;
        this.map = {};
        let i = 0;
        let x = 0;
        let y = 0;
        while(i < chars.length) {
            let char = chars.charAt(i);
            this.map[char] = {x: x * width, y: y * width};
            x++;
            if (x >= charsPerRow) {
                x = 0;
                y++;
            }
            i++;
        }
    }

    /**
     * Get the position data of a character.
     *
     * @param {string} char - A string with exactly one character.
     * @returns {object} pos - The characters position data. {x, y}
     */
    getCharData(char)
    {
        return this.map[char];
    }

}
export default BitmapFontMetrics;
