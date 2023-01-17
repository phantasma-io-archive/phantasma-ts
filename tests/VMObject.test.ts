import { BinaryWriter } from "csharp-binary-stream";
import { Type } from "typescript";
import {
  PBinaryWriter,
  PollChoice,
  Serialization,
  Transaction,
  VMObject,
} from "../core";
import { phantasmaJS } from "../index";

describe("VM index file", () => {
  test("empty string should result in zero", () => {
    let vm = new phantasmaJS.VMObject();

    expect(vm).toBeInstanceOf(phantasmaJS.VMObject);
    expect(vm.Type).toBe(phantasmaJS.VMType.None);
  });

  test("String VM", () => {
    let vm = new phantasmaJS.VMObject();
    let myNewVM = VMObject.FromObject("MyString");

    expect(myNewVM).toBeInstanceOf(phantasmaJS.VMObject);
    expect(myNewVM.Type).toBe(phantasmaJS.VMType.String);
    let result = myNewVM.AsString();
    expect(result).toBe("MyString");
  });

  test("Number VM", () => {
    let vm = new phantasmaJS.VMObject();
    let myNewVM = VMObject.FromObject(5);

    expect(myNewVM).toBeInstanceOf(phantasmaJS.VMObject);
    expect(myNewVM.Type).toBe(phantasmaJS.VMType.Number);
    let result = myNewVM.AsString();
    expect(result).toBe("5");
    expect(myNewVM.AsNumber()).toBe(5);
  });

  /*test("Bool VM", () => {
    let vm = new phantasmaJS.VMObject();
    let myNewVM = VMObject.FromObject(true);

    expect(myNewVM).toBeInstanceOf(phantasmaJS.VMObject);
    expect(myNewVM.Type).toBe(phantasmaJS.VMType.Bool);
    expect(myNewVM.AsString()).toBe("true");
    expect(myNewVM.AsBool()).toBe(true);
  });

  test("Struct VM", () => {
    let vm = new phantasmaJS.VMObject();
    let choice = new phantasmaJS.PollChoice("myChoice");
    let myNewVM = VMObject.FromStruct(choice);

    expect(myNewVM).toBeInstanceOf(phantasmaJS.VMObject);
    expect(myNewVM.Type).toBe(phantasmaJS.VMType.Struct);
    let result = myNewVM.ToStruct(PollChoice) as PollChoice;
    expect(result).toStrictEqual(choice);
  });

  test("TestTypes", () => {
    let vm = new phantasmaJS.VMObject();
    let choice = new phantasmaJS.PollChoice("myChoice");
    let myNewVM = VMObject.FromStruct(choice);

    expect(VMObject.isPrimitive(PollChoice)).toBe(false);
    expect(VMObject.isValueType(PollChoice)).toBe(false);
    expect(VMObject.isClass(PollChoice)).toBe(true);
    expect(VMObject.isEnum(PollChoice)).toBe(false);
    expect(VMObject.isSerializable(PollChoice)).toBe(true);
    expect(VMObject.isInterface(PollChoice)).toBe(false);
    expect(VMObject.isStructOrClass(PollChoice as unknown as Type)).toBe(true);
    expect(myNewVM.Type).toBe(phantasmaJS.VMType.Struct);
  });*/

  test("PollChoices", () => {
    let vm = new phantasmaJS.VMObject();
    let choice = new phantasmaJS.PollChoice("myChoice");
    let choice2 = new phantasmaJS.PollChoice("myChoice");
    let choices: PollChoice[] = [choice, choice2];
    let myNewVM = VMObject.FromArray(choices);

    expect(myNewVM).toBeInstanceOf(phantasmaJS.VMObject);
    expect(myNewVM.Type).toBe(phantasmaJS.VMType.Struct);
    let result = myNewVM.ToArray(PollChoice) as PollChoice[];
    expect(result).toStrictEqual(choices);
  });

  test("Serialization", () => {
    let vm = new phantasmaJS.VMObject();
    let choice = new phantasmaJS.PollChoice("myChoice");
    let choice2 = new phantasmaJS.PollChoice("myChoice");
    let choices: PollChoice[] = [choice, choice2];
    let myNewVM = VMObject.FromArray(choices);

    expect(myNewVM).toBeInstanceOf(phantasmaJS.VMObject);
    expect(myNewVM.Type).toBe(phantasmaJS.VMType.Struct);
    let bytes = Buffer.alloc(0);
    let writer = new PBinaryWriter(bytes);
    //let result = myNewVM.SerializeData(writer);
    //expect(result).toStrictEqual(choices);
  });
});
