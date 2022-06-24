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

  appendGroup<T>(callback: (value: T) => string, values: T[]) {
    values.forEach(value => this.append(callback(value)));
    return this;
  }

  build() {
    return this.strings.join("\n");
  }
}
