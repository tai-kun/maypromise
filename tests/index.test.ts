// oxlint-disable unicorn/no-thenable

import { test, describe } from "vitest";

import { isThenable } from "../src/index.js";

describe("isThenable", () => {
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

    test("undefined を渡したとき、false を返す", ({ expect }) => {
      // Arrange
      const value = undefined;

      // Act
      const result = isThenable(value);

      // Assert
      expect(result).toBe(false);
    });

    test("数値の 123 を渡したとき、false を返す", ({ expect }) => {
      // Arrange
      const value = 123;

      // Act
      const result = isThenable(value);

      // Assert
      expect(result).toBe(false);
    });

    test("文字列の then を渡したとき、false を返す", ({ expect }) => {
      // Arrange
      const value = "then";

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

    test("偽の値（0, 空文字, false）を渡したとき、すべて false を返す", ({ expect }) => {
      // Arrange & Act & Assert
      expect(isThenable(0)).toBe(false);
      expect(isThenable("")).toBe(false);
      expect(isThenable(false)).toBe(false);
    });
  });
});
