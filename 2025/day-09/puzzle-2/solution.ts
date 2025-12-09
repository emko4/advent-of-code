type Position = [number, number];
type Segment = [Position, Position];

export const processData = (data: Buffer): Position[] => {
    return data
        .toString()
        .split('\n')
        .map((line) => {
            const [y, x] = line.split(',');
            return [Number(x), Number(y)];
        });
};

const isInside = (position: Position, edges: Position[][]): boolean => {
    const [x, y] = position;

    let intersectionCount = 0;

    for (let i = 0; i < edges.length; i += 1) {
        const [[x1, y1], [x2, y2]] = edges[i];

        // is inside if position is on vertical edge
        if (y1 === y2 && y === y1 && y === y2 && ((x >= x1 && x <= x2) || (x >= x2 && x <= x1))) return true;
        // is inside if position is on horizontal edge
        if (x1 === x2 && x === x1 && x === x2 && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1))) return true;

        // add intersection for intersection with vertical edge
        if (y1 === y2 && y < y1 && y < y2 && ((x > x1 && x < x2) || (x > x2 && x < x1))) intersectionCount += 1;
        // horizontal edge
        if (x1 === x2 && x === x1 && x === x2 && y < Math.min(y1, y2)) {
            const [[pX]] = edges[(i - 1 + edges.length) % edges.length];
            const [, [nX]] = edges[(i + 1) % edges.length];

            // add intersection only if previous and next vertical edges are in same direction
            if ((pX > x1 && nX < x2) || (pX < x1 && nX > x2)) intersectionCount += 1;
        }
    }

    // position is inside if intersectionCount is an odd number
    return intersectionCount % 2 === 1;
};

const isHorizontal = ([[x1], [x2]]: Segment) => x1 === x2;
const isVertical = ([[, y1], [, y2]]: Segment) => y1 === y2;

const hasIntersection = (edge1: Segment, edge2: Segment): boolean => {
    if (isHorizontal(edge1) && isHorizontal(edge2)) return false;
    if (isVertical(edge1) && isVertical(edge2)) return false;

    const [[hx1, hy1], [, hy2]] = isHorizontal(edge1) ? edge1 : edge2;
    const [[vx1, vy1], [vx2]] = isVertical(edge1) ? edge1 : edge2;

    return hx1 > Math.min(vx1, vx2) && hx1 < Math.max(vx1, vx2) && vy1 > Math.min(hy1, hy2) && vy1 < Math.max(hy1, hy2);
};

// probably not a perfect solution, because I think a lot of edge cases are missed,
// but it works for the given input data
export const solution = (input: Position[]): number => {
    let result = 0;

    const edges = input.map((position, index) => [position, input[(index + 1) % input.length]] as Segment);

    for (let i = 0; i < input.length; i += 1) {
        const [x1, y1] = input[i];
        for (let j = i + 1; j < input.length; j += 1) {
            const [x2, y2] = input[j];

            const rectangleCorners: Position[] = [
                [x1, y1],
                [x1, y2],
                [x2, y2],
                [x2, y1],
            ];

            // check if rectangle corners are inside polygon edges
            const areInside = rectangleCorners.every((corner) => isInside(corner, edges));

            // if any corner is not inside polygon, skip rectangle
            if (!areInside) continue;

            // create rectangle edges
            const rectangleEdges = rectangleCorners.map(
                (corner, index) => [corner, rectangleCorners[(index + 1) % rectangleCorners.length]] as Segment,
            );

            // check if rectangle edges intersect with polygon edges (only horizontal with verticals and vice versa)
            let isIntersection = false;
            for (const rectangleEdge of rectangleEdges) {
                for (const edge of edges) {
                    if (hasIntersection(rectangleEdge, edge)) {
                        isIntersection = true;
                        break;
                    }
                }
                if (isIntersection) break;
            }

            // if any rectangle edge intersects with a polygon edge, skip rectangle
            if (isIntersection) continue;

            // count area of rectangle
            const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
            if (area > result) result = area;
        }
    }

    return result;
};
