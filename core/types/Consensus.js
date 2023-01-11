"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollPresence = exports.ConsensusPoll = exports.PollVote = exports.PollValue = exports.PollChoice = exports.PollState = exports.ConsensusMode = void 0;
var ConsensusMode;
(function (ConsensusMode) {
    ConsensusMode[ConsensusMode["Unanimity"] = 0] = "Unanimity";
    ConsensusMode[ConsensusMode["Majority"] = 1] = "Majority";
    ConsensusMode[ConsensusMode["Popularity"] = 2] = "Popularity";
    ConsensusMode[ConsensusMode["Ranking"] = 3] = "Ranking";
})(ConsensusMode = exports.ConsensusMode || (exports.ConsensusMode = {}));
var PollState;
(function (PollState) {
    PollState[PollState["Inactive"] = 0] = "Inactive";
    PollState[PollState["Active"] = 1] = "Active";
    PollState[PollState["Consensus"] = 2] = "Consensus";
    PollState[PollState["Failure"] = 3] = "Failure";
})(PollState = exports.PollState || (exports.PollState = {}));
var PollChoice = /** @class */ (function () {
    function PollChoice(value) {
        this.value = value;
    }
    PollChoice.prototype.SerializeData = function (writer) {
        writer.writeString(this.value);
    };
    PollChoice.prototype.UnserializeData = function (reader) {
        this.value = reader.readString();
    };
    PollChoice.Unserialize = function (reader) {
        var pollChoice = new PollChoice("");
        pollChoice.UnserializeData(reader);
        return pollChoice;
    };
    return PollChoice;
}());
exports.PollChoice = PollChoice;
var PollValue = /** @class */ (function () {
    function PollValue() {
    }
    PollValue.prototype.SerializeData = function (writer) {
        writer.writeString(this.value);
        writer.writeBigInteger(this.ranking);
        writer.writeBigInteger(this.votes);
    };
    PollValue.prototype.UnserializeData = function (reader) {
        this.value = reader.readString();
        this.ranking = reader.readBigInteger();
        this.votes = reader.readBigInteger();
    };
    PollValue.Unserialize = function (reader) {
        var pollValue = new PollValue();
        pollValue.UnserializeData(reader);
        return pollValue;
    };
    return PollValue;
}());
exports.PollValue = PollValue;
var PollVote = /** @class */ (function () {
    function PollVote() {
    }
    PollVote.prototype.SerializeData = function (writer) {
        writer.writeBigInteger(this.index);
        writer.writeBigInteger(this.percentage);
    };
    PollVote.prototype.UnserializeData = function (reader) {
        this.index = reader.readBigInteger();
        this.percentage = reader.readBigInteger();
    };
    PollVote.Unserialize = function (reader) {
        var pollVote = new PollVote();
        pollVote.UnserializeData(reader);
        return pollVote;
    };
    return PollVote;
}());
exports.PollVote = PollVote;
var ConsensusPoll = /** @class */ (function () {
    function ConsensusPoll() {
    }
    ConsensusPoll.prototype.SerializeData = function (writer) {
        writer.writeString(this.subject);
        writer.writeString(this.organization);
        writer.writeByte(this.mode);
        writer.writeByte(this.state);
        writer.writeByte(this.entries.length);
        this.entries.forEach(function (entry) {
            entry.SerializeData(writer);
        });
        writer.writeBigInteger(this.round);
        writer.writeTimestamp(this.startTime);
        writer.writeTimestamp(this.endTime);
        writer.writeBigInteger(this.choicesPerUser);
        writer.writeBigInteger(this.totalVotes);
    };
    ConsensusPoll.prototype.UnserializeData = function (reader) {
        this.subject = reader.readString();
        this.organization = reader.readString();
        this.mode = reader.readByte();
        this.state = reader.readByte();
        this.entries = [];
        var entriesLength = reader.readByte();
        for (var i = 0; i < entriesLength; i++) {
            this.entries.push(PollValue.Unserialize(reader));
        }
        this.round = reader.readBigInteger();
        this.startTime = reader.readTimestamp();
        this.endTime = reader.readTimestamp();
        this.choicesPerUser = reader.readBigInteger();
        this.totalVotes = reader.readBigInteger();
    };
    ConsensusPoll.Unserialize = function (reader) {
        var consensusPoll = new ConsensusPoll();
        consensusPoll.UnserializeData(reader);
        return consensusPoll;
    };
    return ConsensusPoll;
}());
exports.ConsensusPoll = ConsensusPoll;
var PollPresence = /** @class */ (function () {
    function PollPresence() {
    }
    PollPresence.prototype.SerializeData = function (writer) {
        writer.writeString(this.subject);
    };
    PollPresence.prototype.UnserializeData = function (reader) {
        this.subject = reader.readString();
        this.round = reader.readBigInteger();
    };
    PollPresence.Unserialize = function (reader) {
        var pollPresence = new PollPresence();
        pollPresence.UnserializeData(reader);
        return pollPresence;
    };
    return PollPresence;
}());
exports.PollPresence = PollPresence;
