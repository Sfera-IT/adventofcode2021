import Cuboid from "./Cuboid";

export default class Utils {
    static cuboidOverlaps(cubeA: Cuboid, cubeB: Cuboid) : boolean {
        const overlapX = (cubeA.x2 >= cubeB.x1) && (cubeA.x1 <= cubeB.x2);
        const overlapY = (cubeA.y2 >= cubeB.y1) && (cubeA.y1 <= cubeB.y2);
        const overlapZ = (cubeA.z2 >= cubeB.z1) && (cubeA.z1 <= cubeB.z2);

        return overlapX && overlapY && overlapZ;
    }

    static getOverlappingCuboid(cubeA: Cuboid, cubeB: Cuboid) : Cuboid | undefined {
        if (!Utils.cuboidOverlaps(cubeA, cubeB))
            return undefined;

        let isOn = cubeB.isOn;

        const x1 = (cubeA.x1 >= cubeB.x1) ? cubeA.x1 : cubeB.x1;
        const x2 = (cubeA.x2 <= cubeB.x2) ? cubeA.x2 : cubeB.x2;

        const y1 = (cubeA.y1 >= cubeB.y1) ? cubeA.y1 : cubeB.y1;
        const y2 = (cubeA.y2 <= cubeB.y2) ? cubeA.y2 : cubeB.y2;

        const z1 = (cubeA.z1 >= cubeB.z1) ? cubeA.z1 : cubeB.z1;
        const z2 = (cubeA.z2 <= cubeB.z2) ? cubeA.z2 : cubeB.z2;

        return new Cuboid(isOn, x1, x2, y1, y2, z1, z2);

    }
}