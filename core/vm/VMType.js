"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VMType = void 0;
var VMType;
(function (VMType) {
    VMType[VMType["None"] = 0] = "None";
    VMType[VMType["Struct"] = 1] = "Struct";
    VMType[VMType["Bytes"] = 2] = "Bytes";
    VMType[VMType["Number"] = 3] = "Number";
    VMType[VMType["String"] = 4] = "String";
    VMType[VMType["Timestamp"] = 5] = "Timestamp";
    VMType[VMType["Bool"] = 6] = "Bool";
    VMType[VMType["Enum"] = 7] = "Enum";
    VMType[VMType["Object"] = 8] = "Object";
})(VMType = exports.VMType || (exports.VMType = {}));
