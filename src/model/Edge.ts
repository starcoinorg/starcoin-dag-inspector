export type Edge = {
    fromBlockHash: string,
    toBlockHash: string,
    fromHeight: number,
    toHeight: number,
    fromHeightGroupIndex: number,
    toHeightGroupIndex: number,
}

export function areEdgesEqual(left: Edge, right: Edge): boolean {
    return left.fromBlockHash === right.fromBlockHash
        && left.toBlockHash === right.toBlockHash
        && left.fromHeight === right.fromHeight
        && left.toHeight === right.toHeight
        && left.fromHeightGroupIndex === right.fromHeightGroupIndex
        && left.toHeightGroupIndex === right.toHeightGroupIndex;
}
