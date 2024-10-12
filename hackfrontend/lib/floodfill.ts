export function floodfill(data: number[][], x: number, y: number, v: number, visited: Set<number>) {
    if (x < 0 || x >= data.length || y < 0 || y >= data[0].length)
        return;

    if (Math.abs(v) <= 0.25)
        return;

    if (visited.has(x * data[0].length + y))
        return;

    visited.add(x * data[0].length + y);

    data[x][y] += v;
    floodfill(data, x + 1, y, v - (0.22 * Math.sign(v)), visited);
    floodfill(data, x - 1, y, v - (0.22 * Math.sign(v)), visited);
    floodfill(data, x, y + 1, v - (0.22 * Math.sign(v)), visited);
    floodfill(data, x, y - 1, v - (0.22 * Math.sign(v)), visited);
}
