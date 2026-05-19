/**
 * 同期的な値、または Promise のような非同期的な値のいずれかであることを表す型です。
 *
 * @template T 解決される値の型です。
 */
type MaybePromise<T> = T | PromiseLike<T>;

/**
 * then メソッドを持つオブジェクト（Thenable オブジェクト）のインターフェースです。
 */
interface Thenable {
  /**
   * Promise の連鎖を継続するためのコールバック関数を受け取ります。
   *
   * @param args 任意の引数です。
   * @returns 任意の戻り値です。
   */
  then(...args: any): unknown;
}

/**
 * 指定された値が Thenable（then メソッドを持つオブジェクトまたは関数）であるかどうかを判定します。
 *
 * @param value 判定対象の値です。
 * @returns 値が Thenable であれば true、そうでなければ false を返します。
 */
function isThenable(value: unknown): value is Thenable;

/**
 * 指定された値が PromiseLike であるかどうかを判定します。
 *
 * この関数は、then メソッドが PromiseLike を返すことを前提とする場合に使用されます。判定対象の値が本当に PromiseLike であるかどうか検証するためには、追加の独自検証が必要です。
 *
 * @template T 解決される値の型です。
 * @param value 判定対象の値です。
 * @returns 値が PromiseLike であれば true、そうでなければ false を返します。
 */
function isThenable<T>(value: unknown): value is PromiseLike<T>;

function isThenable(value: unknown): boolean {
  return (
    ((!!value && typeof value === "object") || typeof value === "function") &&
    typeof (value as Record<keyof any, unknown>)["then"] === "function"
  );
}

export type { MaybePromise, Thenable };
export { isThenable };
