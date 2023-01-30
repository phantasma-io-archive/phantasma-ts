export class Describer {
  private static FRegEx = new RegExp(/(?:this\.)(.+?(?= ))/g);
  static describe(val: Function, parent = false): string[] {
    var result = [];
    if (parent) {
      var proto = Object.getPrototypeOf(val.prototype);
      if (proto) {
        result = result.concat(this.describe(proto.constructor, parent));
      }
    }
    result = result.concat(val.toString().match(this.FRegEx) || []);
    /*.filter((x) => {
        x.replace("this.", "");
      })*/
    return result;
  }
}
