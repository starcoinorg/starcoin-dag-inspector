import { BlockColor } from "./BlockColor";

export type Block = {
    // id: number,
    blockHash: string,
    timestamp: number,
    parentHashs: string[],
    height: number,
    daaScore: number,
    heightGroupIndex: number,
    selectedParentHash: string | null,
    color: BlockColor,
    isInVirtualSelectedParentChain: boolean,
    mergeSetRedIds: string[],
    mergeSetBlueIds: string[],
};

export function areBlocksEqual(left: Block, right: Block): boolean {
    if (left.parentHashs.length !== right.parentHashs.length) {
        return false;
    }
    if (left.mergeSetRedIds.length !== right.mergeSetRedIds.length) {
        return false;
    }
    if (left.mergeSetBlueIds.length !== right.mergeSetBlueIds.length) {
        return false;
    }
    for (let i = 0; i < left.parentHashs.length; i++) {
        if (left.parentHashs[i] !== right.parentHashs[i]) {
            return false;
        }
    }
    for (let i = 0; i < left.mergeSetRedIds.length; i++) {
        if (left.mergeSetRedIds[i] !== right.mergeSetRedIds[i]) {
            return false;
        }
    }
    for (let i = 0; i < right.mergeSetBlueIds.length; i++) {
        if (left.mergeSetBlueIds[i] !== right.mergeSetBlueIds[i]) {
            return false;
        }
    }
    return left.blockHash === right.blockHash
        && left.timestamp === right.timestamp
        && left.height === right.height
        && left.daaScore === right.daaScore
        && left.heightGroupIndex === right.heightGroupIndex
        && left.selectedParentHash === right.selectedParentHash
        && left.color === right.color
        && left.isInVirtualSelectedParentChain === right.isInVirtualSelectedParentChain;
}
