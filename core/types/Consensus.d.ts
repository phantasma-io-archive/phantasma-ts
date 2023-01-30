import { ISerializable } from "../interfaces";
import { PBinaryReader, PBinaryWriter } from "./Extensions";
import { Timestamp } from "./Timestamp";
export declare enum ConsensusMode {
    Unanimity = 0,
    Majority = 1,
    Popularity = 2,
    Ranking = 3
}
export declare enum PollState {
    Inactive = 0,
    Active = 1,
    Consensus = 2,
    Failure = 3
}
export declare class PollChoice implements ISerializable {
    value: string;
    constructor(value: string | number[]);
    SerializeData(writer: PBinaryWriter): void;
    UnserializeData(reader: PBinaryReader): void;
    static Unserialize(reader: PBinaryReader): PollChoice;
}
export declare class PollValue implements ISerializable {
    value: string;
    ranking: BigInt;
    votes: BigInt;
    SerializeData(writer: PBinaryWriter): void;
    UnserializeData(reader: PBinaryReader): void;
    static Unserialize(reader: PBinaryReader): PollValue;
}
export declare class PollVote implements ISerializable {
    index: BigInt;
    percentage: BigInt;
    SerializeData(writer: PBinaryWriter): void;
    UnserializeData(reader: PBinaryReader): void;
    static Unserialize(reader: PBinaryReader): PollVote;
}
export declare class ConsensusPoll implements ISerializable {
    subject: string;
    organization: string;
    mode: ConsensusMode;
    state: PollState;
    entries: PollValue[];
    round: BigInt;
    startTime: Timestamp;
    endTime: Timestamp;
    choicesPerUser: BigInt;
    totalVotes: BigInt;
    constructor();
    SerializeData(writer: PBinaryWriter): void;
    UnserializeData(reader: PBinaryReader): void;
    static Unserialize(reader: PBinaryReader): ConsensusPoll;
}
export declare class PollPresence implements ISerializable {
    subject: string;
    round: BigInt;
    SerializeData(writer: PBinaryWriter): void;
    UnserializeData(reader: PBinaryReader): void;
    static Unserialize(reader: PBinaryReader): PollPresence;
}
//# sourceMappingURL=Consensus.d.ts.map