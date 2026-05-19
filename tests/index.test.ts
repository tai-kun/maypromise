// oxlint-disable unicorn/no-thenable

import { test, describe, expectTypeOf } from "vitest";

import { isThenable, type Thenable } from "../src/index.js";

describe("Promise または Thenable な値の場合", () => {
  test("ネイティブな Promise インスタンスを渡したとき、true を返す", ({ expect }) => {
    // Arrange
    const value = Promise.resolve();

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(true);
  });

  test("then メソッドを持つプレーンなオブジェクトを渡したとき、true を返す", ({ expect }) => {
    // Arrange
    const value = { then: () => {} };

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(true);
  });

  test("then メソッドをプロパティとして持つ関数を渡したとき、true を返す", ({ expect }) => {
    // Arrange
    const fn = () => {};
    const value = Object.assign(fn, { then: () => {} });

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(true);
  });

  test("then メソッドがクラスのメンバーとして定義されているインスタンスを渡したとき、true を返す", ({
    expect,
  }) => {
    // Arrange
    class CustomThenable {
      then() {}
    }
    const value = new CustomThenable();

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(true);
  });

  test("プロトタイプチェーン上に then メソッドを持つオブジェクトを渡したとき、true を返す", ({
    expect,
  }) => {
    // Arrange
    const proto = { then: () => {} };
    const value = Object.create(proto);

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(true);
  });
});

describe("Thenable ではない値の場合", () => {
  test("null を渡したとき、false を返す", ({ expect }) => {
    // Arrange
    const value = null;

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(false);
  });

  test("symbol を渡したとき、false を返す", ({ expect }) => {
    // Arrange
    const value = Symbol();

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(false);
  });

  test("then プロパティが関数ではないオブジェクトを渡したとき、false を返す", ({ expect }) => {
    // Arrange
    const value = { then: "not a function" };

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(false);
  });

  test("then プロパティを持たない空のオブジェクトを渡したとき、false を返す", ({ expect }) => {
    // Arrange
    const value = {};

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(false);
  });

  test("通常の配列を渡したとき、false を返す", ({ expect }) => {
    // Arrange
    const value: unknown[] = [];

    // Act
    const result = isThenable(value);

    // Assert
    expect(result).toBe(false);
  });
});

describe("型推論", () => {
  test("isThenable 関数で真と判定されたとき、値の型が Thenable に絞り込まれる", ({ expect }) => {
    // Arrange
    const value: unknown = Promise.resolve(42);

    // Act & Assert
    if (isThenable(value)) {
      expectTypeOf(value).toEqualTypeOf<Thenable>();
      expectTypeOf(value).not.toEqualTypeOf<PromiseLike<any>>();
    } else {
      expect.unreachable();
    }
  });

  test("isThenable 関数に型引数を指定して真と判定されたとき、値の型が PromiseLike に絞り込まれる", ({
    expect,
  }) => {
    // Arrange
    const value: unknown = Promise.resolve(42);

    // Act & Assert
    if (isThenable<number>(value)) {
      expectTypeOf(value).not.toEqualTypeOf<Thenable>();
      expectTypeOf(value).toEqualTypeOf<PromiseLike<number>>();
    } else {
      expect.unreachable();
    }
  });
});
