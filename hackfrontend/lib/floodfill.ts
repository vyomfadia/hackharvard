export function floodfill(data: number[][], x: number, y: number, v: number) {
    const rows = data.length;
    const cols = data[0].length;
    
    // Use a stack for iterative flood fill
    const stack: [number, number, number][] = [[x, y, v]];

    while (stack.length > 0) {
        const [currX, currY, currV] = stack.pop()!;

        // Boundary checks
        if (currX < 0 || currX >= rows || currY < 0 || currY >= cols) continue;

        // Skip if value is below thresholds
        if (Math.abs(currV) <= 0.25 || Math.abs(currV) <= 4) continue;

        // Update the value only if it's higher
        if (data[currX][currY] < currV) {
            data[currX][currY] = currV;

            // Push adjacent cells onto the stack
            stack.push([currX + 1, currY, currV - 4 * Math.sign(currV)]);
            stack.push([currX - 1, currY, currV - 4 * Math.sign(currV)]);
            stack.push([currX, currY + 1, currV - 4 * Math.sign(currV)]);
            stack.push([currX, currY - 1, currV - 4 * Math.sign(currV)]);
        }
    }
}
