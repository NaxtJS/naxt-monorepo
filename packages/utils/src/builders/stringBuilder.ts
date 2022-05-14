export class StringBuilder {
  private strings: string[] = [];

  prepend(string = "", condition = true) {
    if (condition) {
      this.strings.unshift(string);
    }

    return this;
  }

  append(string = "", condition = true) {
    if (condition) {
      this.strings.push(string);
    }

    return this;
  }

  appendGroup<T>(callback: (value: T) => string, values: T[]) {
    values.forEach(value => {
      this.append(callback(value));
    });

    return this;
  }

  build() {
    return this.strings.join("\n");
  }
}
