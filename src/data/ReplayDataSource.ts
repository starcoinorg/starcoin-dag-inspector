import DataSource from "./DataSource";
import {BlocksAndEdgesAndHeightGroups} from "../model/BlocksAndEdgesAndHeightGroups";
import {BlockHashById} from "../model/BlockHashById";
import {Block} from "../model/Block";
import {Edge} from "../model/Edge";
import {HeightGroup} from "../model/HeightGroup";
import {BlockColor} from "../model/BlockColor";
import {AppConfig, getDefaultAppConfig} from "../model/AppConfig";

export type ReplayData = {
    blocks: ReplayDataBlock[],
    blockInterval: number,
};

export type ReplayDataBlock = {
    // id: number,
    blockHash: string,
    parentIds: string[],
    selectedParentHash: string | null,
    color: BlockColor,
    isInVirtualSelectedParentChain: boolean,
    mergeSetRedIds: string[],
    mergeSetBlueIds: string[],
};

type DatumAtHeight = {
    height: number,
    blocks: Block[],
    edges: Edge[],
}

export default class ReplayDataSource implements DataSource {
    private readonly resetAfterInterval: number = 5000;

    private readonly replayData: ReplayData;

    private currentReplayBlockIndex: number = 0;

    private blockHashsToHeights: { [hash: string]: number } = {};
    private dataAtHeight: { [height: number]: DatumAtHeight } = {};
    //private blockHashesByIds: { [id: number]: string } = {};
    // private blockIdsByHashes: { [hash: string]: number } = {};
    private blockHashsByDAAScores: { [daaScore: number]: string } = {};

    constructor(replayData: ReplayData) {
        this.replayData = replayData;

        this.addNextBlockAndReschedule();
    }

    private addNextBlockAndReschedule = () => {
        this.addNextBlock();

        if (this.currentReplayBlockIndex < this.replayData.blocks.length) {
            window.setTimeout(this.addNextBlockAndReschedule, this.replayData.blockInterval)
        } else {
            window.setTimeout(() => {
                this.reset();
                this.addNextBlockAndReschedule();
            }, this.resetAfterInterval);
        }
    }

    private addNextBlock = () => {
        const nextReplayBlock = this.replayData.blocks[this.currentReplayBlockIndex];

        let maxParentHeight = -1;
        for (let parentId of nextReplayBlock.parentIds) {
            const parentHeight = this.blockHashsToHeights[parentId];
            if (parentHeight > maxParentHeight) {
                maxParentHeight = parentHeight;
            }
        }
        const height = maxParentHeight + 1;

        let dataAtHeight = this.dataAtHeight[height];
        if (!dataAtHeight) {
            dataAtHeight = {
                height: height,
                blocks: [],
                edges: [],
            };
        }

        // const blockId = nextReplayBlock.id;
        // const blockHash = `${blockId}`.repeat(8);
        const blockHash = nextReplayBlock.blockHash;
        const heightGroupIndex = dataAtHeight.blocks.length;

        this.dataAtHeight[height] = dataAtHeight;
        this.blockHashsToHeights[blockHash] = height;

        dataAtHeight.blocks.push({
            // id: blockId,
            blockHash: blockHash,
            timestamp: this.currentReplayBlockIndex * this.replayData.blockInterval,
            parentIds: nextReplayBlock.parentIds,
            height: height,
            daaScore: height,
            heightGroupIndex: heightGroupIndex,
            selectedParentHash: nextReplayBlock.selectedParentHash,
            color: nextReplayBlock.color,
            isInVirtualSelectedParentChain: nextReplayBlock.isInVirtualSelectedParentChain,
            mergeSetRedIds: nextReplayBlock.mergeSetRedIds,
            mergeSetBlueIds: nextReplayBlock.mergeSetBlueIds,
        });

        for (let parentHash of nextReplayBlock.parentIds) {
            const parentHeight = this.blockHashsToHeights[parentHash];
            const parentDataAtHeight = this.dataAtHeight[parentHeight];
            const parentHeightGroupIndex = parentDataAtHeight.blocks.findIndex(block => block.blockHash === parentHash);

            const nextEdge: Edge = {
                fromBlockHash: blockHash,
                toBlockHash: parentHash,
                fromHeight: height,
                toHeight: parentHeight,
                fromHeightGroupIndex: heightGroupIndex,
                toHeightGroupIndex: parentHeightGroupIndex,
            };

            for (let i = height; i >= parentHeight; i--) {
                const dataAtHeight = this.dataAtHeight[i];
                dataAtHeight.edges.push(nextEdge);
            }
        }

        // this.blockHashesByIds[blockId] = blockHash;
        // this.blockIdsByHashes[blockHash] = blockId;

        this.currentReplayBlockIndex ++;
    }

    private reset = () => {
        this.currentReplayBlockIndex = 0;
        this.blockHashsToHeights = {};
        this.dataAtHeight = {};
        // this.blockHashesByIds = {};
        // this.blockIdsByHashes = {};
    }

    getTickIntervalInMilliseconds = (): number => {
        return this.replayData.blockInterval;
    };

    getBlocksBetweenHeights = async (startHeight: number, endHeight: number): Promise<BlocksAndEdgesAndHeightGroups | void> => {
        if (startHeight < 0) {
            startHeight = 0;
        }
        if (endHeight > Object.keys(this.dataAtHeight).length) {
            endHeight = Object.keys(this.dataAtHeight).length;
        }

        const blocks: Block[] = [];
        const edges: Edge[] = [];
        const heightGroups: HeightGroup[] = [];

        const seenEdges: { [edgeKey: string]: boolean } = {};
        const pushEdge = (edge: Edge) => {
            const edgeKey = `${edge.fromBlockHash}-${edge.toBlockHash}`;
            if (seenEdges[edgeKey]) {
                return;
            }
            seenEdges[edgeKey] = true;
            edges.push(edge);
        }

        const seenHeightGroups: { [height: number]: boolean } = {};
        const pushHeightGroup = (height: number) => {
            if (seenHeightGroups[height]) {
                return;
            }
            seenHeightGroups[height] = true;
            heightGroups.push({
                height: height,
                size: this.dataAtHeight[height].blocks.length,
            });
        };

        for (let height = startHeight; height <= endHeight; height++) {
            const dataAtHeight = this.dataAtHeight[height];
            if (!dataAtHeight) {
                continue;
            }

            blocks.push(...dataAtHeight.blocks);

            for (let edge of dataAtHeight.edges) {
                pushEdge(edge);
                pushHeightGroup(edge.fromHeight);
                pushHeightGroup(edge.toHeight);
            }

            pushHeightGroup(height);
        }

        return {
            blocks: blocks,
            edges: edges,
            heightGroups: heightGroups,
        };
    };

    getBlockHash = async (targetHash: string, heightDifference: number): Promise<BlocksAndEdgesAndHeightGroups | void> => {
        // const targetId = this.blockIdsByHashes[targetHash];
        // const startHeight = targetId - heightDifference;
        // const endHeight = targetId + heightDifference;
        const targetHeight = this.blockHashsToHeights[targetHash];
        const startHeight = targetHeight - heightDifference;
        const endHeight = targetHeight + heightDifference;
        return this.getBlocksBetweenHeights(startHeight, endHeight);
    };

    getBlockDAAScore = async (targetDAAScore: number, heightDifference: number): Promise<BlocksAndEdgesAndHeightGroups | void> => {
        // const targetId = this.blockHashsByDAAScores[targetDAAScore];
        // const startHeight = targetId - heightDifference;
        // const endHeight = targetId + heightDifference;
        const targetHash = this.blockHashsByDAAScores[targetDAAScore];
        const targetHeight = this.blockHashsToHeights[targetHash];
        const startHeight = targetHeight - heightDifference;
        const endHeight = targetHeight + heightDifference;
        return this.getBlocksBetweenHeights(startHeight, endHeight);

        return this.getBlocksBetweenHeights(startHeight, endHeight);
    };

    getHead = async (heightDifference: number): Promise<BlocksAndEdgesAndHeightGroups | void> => {
        const dataLength = Object.keys(this.dataAtHeight).length;
        return this.getBlocksBetweenHeights(dataLength - heightDifference, dataLength);
    };

    getBlockHashesByIds = async (_blockIdsString: string): Promise<BlockHashById[] | void> => {
        // const blockIdStrings = blockIdsString.split(",");
        // const blockHashesByIds: BlockHashById[] = [];
        // for (let blockIdString of blockIdStrings) {
        //     const blockId = parseInt(blockIdString);
        //     blockHashesByIds.push({
        //         id: blockId,
        //         hash: this.blockHashesByIds[blockId],
        //     });
        // }
        // return blockHashesByIds;
        return []
    };

    getAppConfig = async (): Promise<AppConfig | void> => {
        return getDefaultAppConfig();
    };
};

const registerReplayData = (name: string) => {
    replayDataGenerators[name] = () => fetch(`replay/${name}.json`).then(response => response.json());
}

const replayDataGenerators: { [name: string]: () => Promise<ReplayData> } = {};
registerReplayData("ghostdag-5bps-k18");
registerReplayData("ghostdag-10bps-k18");
registerReplayData("ghostdag-10bps-k102");
registerReplayData("ghostdag-20bps-k18");
registerReplayData("ghostdag-20bps-k196");
registerReplayData("ghostdag-50bps-k18");
registerReplayData("ghostdag-50bps-k469");
registerReplayData("ghostdag-100bps-k18");
registerReplayData("ghostdag-100bps-k402");

export const buildReplayDataSource = async (name: string | null): Promise<ReplayDataSource> => {
    if (!name || !replayDataGenerators[name]) {
        name = "ghostdag-5bps-k18";
    }
    const replayData = await replayDataGenerators[name]();
    return Promise.resolve(new ReplayDataSource(replayData));
};
