export class Timestamp {
  public value: number;

  constructor(value: number) {
    this.value = value;
  }

  public toString() {
    return new Date(this.value * 1000).toUTCString();
  }

  public toStringFormat(format: string) {
    return new Date(this.value * 1000).toUTCString();
  }

  public static now = Date.now();
  public static null = new Timestamp(0);

  public compareTo(other: Timestamp) {
    if (other.value === this.value) {
      return 0;
    }

    if (this.value < other.value) {
      return -1;
    }

    return 1;
  }

  public equals(obj: any) {
    if (!(obj instanceof Timestamp)) {
      return false;
    }

    return this.value === obj.value;
  }

  public getHashCode() {
    return this.value;
  }

  public getSize() {
    return 4;
  }

  public static equal(A: Timestamp, B: Timestamp) {
    return A.value === B.value;
  }

  public static notEqual(A: Timestamp, B: Timestamp) {
    return !(A.value === B.value);
  }

  public static lessThan(A: Timestamp, B: Timestamp) {
    return A.value < B.value;
  }

  public static greaterThan(A: Timestamp, B: Timestamp) {
    return A.value > B.value;
  }

  public static lessThanOrEqual(A: Timestamp, B: Timestamp) {
    return A.value <= B.value;
  }

  public static greaterThanOrEqual(A: Timestamp, B: Timestamp) {
    return A.value >= B.value;
  }

  public static subtract(A: Timestamp, B: Timestamp) {
    return A.value - B.value;
  }

  public static fromNumber(ticks: number) {
    return new Timestamp(ticks);
  }

  public static fromDate(time: Date) {
    return new Timestamp(time.getTime() / 1000);
  }

  public static addTimeSpan(A: Timestamp, B: number) {
    return A.value + B;
  }
  public static subtractTimeSpan(A: Timestamp, B: number) {
    return A.value - B;
  }

  public static Serialize() {}

  public static Unserialize() {}
}
