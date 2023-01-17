import { Encoding } from "csharp-binary-stream";
import { ISerializable } from "../interfaces";
import { stringToUint8Array, uint8ArrayToBytes } from "../utils";
import { PBinaryReader, PBinaryWriter } from "./Extensions";
import { Timestamp } from "./Timestamp";

export enum ConsensusMode {
  Unanimity,
  Majority,
  Popularity,
  Ranking,
}

export enum PollState {
  Inactive,
  Active,
  Consensus,
  Failure,
}

export class PollChoice implements ISerializable {
  public value: string; // Should be byte[]

  public constructor(value: string) {
    this.value = value;
  }

  SerializeData(writer: PBinaryWriter) {
    writer.writeString(this.value);
  }

  UnserializeData(reader: PBinaryReader) {
    this.value = reader.readString();
  }

  static Unserialize(reader: PBinaryReader): PollChoice {
    let pollChoice = new PollChoice("");
    pollChoice.UnserializeData(reader);
    return pollChoice;
  }
}

export class PollValue implements ISerializable {
  public value: string; // Should be byte[]
  public ranking: BigInt;
  public votes: BigInt;

  SerializeData(writer: PBinaryWriter) {
    writer.writeString(this.value);
    writer.writeBigInteger(this.ranking);
    writer.writeBigInteger(this.votes);
  }

  UnserializeData(reader: PBinaryReader) {
    this.value = reader.readString();
    this.ranking = reader.readBigInteger();
    this.votes = reader.readBigInteger();
  }

  static Unserialize(reader: PBinaryReader): PollValue {
    let pollValue = new PollValue();
    pollValue.UnserializeData(reader);
    return pollValue;
  }
}

export class PollVote implements ISerializable {
  public index: BigInt;
  public percentage: BigInt;

  SerializeData(writer: PBinaryWriter) {
    writer.writeBigInteger(this.index);
    writer.writeBigInteger(this.percentage);
  }
  UnserializeData(reader: PBinaryReader) {
    this.index = reader.readBigInteger();
    this.percentage = reader.readBigInteger();
  }

  static Unserialize(reader: PBinaryReader): PollVote {
    let pollVote = new PollVote();
    pollVote.UnserializeData(reader);
    return pollVote;
  }
}

export class ConsensusPoll implements ISerializable {
  public subject: string;
  public organization: string;
  public mode: ConsensusMode;
  public state: PollState;
  public entries: PollValue[];
  public round: BigInt;
  public startTime: Timestamp;
  public endTime: Timestamp;
  public choicesPerUser: BigInt;
  public totalVotes: BigInt;

  SerializeData(writer: PBinaryWriter) {
    writer.writeString(this.subject);
    writer.writeString(this.organization);
    writer.writeByte(this.mode);
    writer.writeByte(this.state);
    writer.writeByte(this.entries.length);

    this.entries.forEach((entry) => {
      entry.SerializeData(writer);
    });

    writer.writeBigInteger(this.round);
    writer.writeTimestamp(this.startTime);
    writer.writeTimestamp(this.endTime);
    writer.writeBigInteger(this.choicesPerUser);
    writer.writeBigInteger(this.totalVotes);
  }
  UnserializeData(reader: PBinaryReader) {
    this.subject = reader.readString();
    this.organization = reader.readString();
    this.mode = reader.readByte() as ConsensusMode;
    this.state = reader.readByte() as PollState;
    this.entries = [];
    const entriesLength = reader.readByte();
    for (let i = 0; i < entriesLength; i++) {
      this.entries.push(PollValue.Unserialize(reader));
    }

    this.round = reader.readBigInteger();
    this.startTime = reader.readTimestamp();
    this.endTime = reader.readTimestamp();
    this.choicesPerUser = reader.readBigInteger();
    this.totalVotes = reader.readBigInteger();
  }

  static Unserialize(reader: PBinaryReader): ConsensusPoll {
    let consensusPoll = new ConsensusPoll();
    consensusPoll.UnserializeData(reader);
    return consensusPoll;
  }
}

export class PollPresence implements ISerializable {
  public subject: string;
  public round: BigInt;

  SerializeData(writer: PBinaryWriter) {
    writer.writeString(this.subject);
  }

  UnserializeData(reader: PBinaryReader) {
    this.subject = reader.readString();
    this.round = reader.readBigInteger();
  }

  static Unserialize(reader: PBinaryReader): PollPresence {
    let pollPresence = new PollPresence();
    pollPresence.UnserializeData(reader);
    return pollPresence;
  }
}
