export function floodfill(data: number[][], x: number, y: number, v: number) {
    if (x < 0 || x >= data.length || y < 0 || y >= data[0].length)
        return;

    if (Math.abs(v) <= 0.25)
        return;

    if (Math.abs(v) <= 4)
        return;

    data[x][y] = Math.max(v, data[x][y]);
    floodfill(data, x + 1, y, v - (4 * Math.sign(v)));
    floodfill(data, x - 1, y, v - (4 * Math.sign(v)));
    floodfill(data, x, y + 1, v - (4 * Math.sign(v)));
    floodfill(data, x, y - 1, v - (4 * Math.sign(v)));
}
