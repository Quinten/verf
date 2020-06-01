class BitmapFontMetrics {

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

    getCharData(char)
    {
        return this.map[char];
    }

}
export default BitmapFontMetrics;
