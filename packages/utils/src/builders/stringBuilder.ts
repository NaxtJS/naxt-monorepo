export class StringBuilder {
  private strings: string[] = [];
  private _length: number = 0;

  get length() {
    return this._length;
  }

  prepend(string = "", condition = true) {
    if (condition) {
      this.strings.unshift(string);
      this._length += string.length;
    }

    return this;
  }

  append(string = "", condition = true) {
    if (condition) {
      this.strings.push(string);
      this._length += string.length;
    }

    return this;
  }

  appendGroup<T>(callback: (value: T, idx: number) => string, values: Set<T> | T[]) {
    let idx = -1;
    values.forEach(value => this.append((idx++, callback(value, idx))));
    return this;
  }

  build() {
    return this.strings.join("\n");
  }
}
