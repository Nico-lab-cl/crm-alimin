
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Lot
 * 
 */
export type Lot = $Result.DefaultSelection<Prisma.$LotPayload>
/**
 * Model Contact
 * 
 */
export type Contact = $Result.DefaultSelection<Prisma.$ContactPayload>
/**
 * Model Note
 * 
 */
export type Note = $Result.DefaultSelection<Prisma.$NotePayload>
/**
 * Model CallLog
 * 
 */
export type CallLog = $Result.DefaultSelection<Prisma.$CallLogPayload>
/**
 * Model ContactFile
 * 
 */
export type ContactFile = $Result.DefaultSelection<Prisma.$ContactFilePayload>
/**
 * Model Reservation
 * 
 */
export type Reservation = $Result.DefaultSelection<Prisma.$ReservationPayload>
/**
 * Model LotLock
 * 
 */
export type LotLock = $Result.DefaultSelection<Prisma.$LotLockPayload>
/**
 * Model WebpayTransaction
 * 
 */
export type WebpayTransaction = $Result.DefaultSelection<Prisma.$WebpayTransactionPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  USER: 'USER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const ActionType: {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  OTHER: 'OTHER'
};

export type ActionType = (typeof ActionType)[keyof typeof ActionType]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type ActionType = $Enums.ActionType

export const ActionType: typeof $Enums.ActionType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Lots
 * const lots = await prisma.lot.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Lots
   * const lots = await prisma.lot.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.lot`: Exposes CRUD operations for the **Lot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lots
    * const lots = await prisma.lot.findMany()
    * ```
    */
  get lot(): Prisma.LotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contact`: Exposes CRUD operations for the **Contact** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Contacts
    * const contacts = await prisma.contact.findMany()
    * ```
    */
  get contact(): Prisma.ContactDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.note`: Exposes CRUD operations for the **Note** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notes
    * const notes = await prisma.note.findMany()
    * ```
    */
  get note(): Prisma.NoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.callLog`: Exposes CRUD operations for the **CallLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CallLogs
    * const callLogs = await prisma.callLog.findMany()
    * ```
    */
  get callLog(): Prisma.CallLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contactFile`: Exposes CRUD operations for the **ContactFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContactFiles
    * const contactFiles = await prisma.contactFile.findMany()
    * ```
    */
  get contactFile(): Prisma.ContactFileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reservation`: Exposes CRUD operations for the **Reservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reservations
    * const reservations = await prisma.reservation.findMany()
    * ```
    */
  get reservation(): Prisma.ReservationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lotLock`: Exposes CRUD operations for the **LotLock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LotLocks
    * const lotLocks = await prisma.lotLock.findMany()
    * ```
    */
  get lotLock(): Prisma.LotLockDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.webpayTransaction`: Exposes CRUD operations for the **WebpayTransaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WebpayTransactions
    * const webpayTransactions = await prisma.webpayTransaction.findMany()
    * ```
    */
  get webpayTransaction(): Prisma.WebpayTransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Lot: 'Lot',
    Contact: 'Contact',
    Note: 'Note',
    CallLog: 'CallLog',
    ContactFile: 'ContactFile',
    Reservation: 'Reservation',
    LotLock: 'LotLock',
    WebpayTransaction: 'WebpayTransaction',
    User: 'User',
    AuditLog: 'AuditLog',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "lot" | "contact" | "note" | "callLog" | "contactFile" | "reservation" | "lotLock" | "webpayTransaction" | "user" | "auditLog" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Lot: {
        payload: Prisma.$LotPayload<ExtArgs>
        fields: Prisma.LotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          findFirst: {
            args: Prisma.LotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          findMany: {
            args: Prisma.LotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>[]
          }
          create: {
            args: Prisma.LotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          createMany: {
            args: Prisma.LotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>[]
          }
          delete: {
            args: Prisma.LotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          update: {
            args: Prisma.LotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          deleteMany: {
            args: Prisma.LotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>[]
          }
          upsert: {
            args: Prisma.LotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          aggregate: {
            args: Prisma.LotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLot>
          }
          groupBy: {
            args: Prisma.LotGroupByArgs<ExtArgs>
            result: $Utils.Optional<LotGroupByOutputType>[]
          }
          count: {
            args: Prisma.LotCountArgs<ExtArgs>
            result: $Utils.Optional<LotCountAggregateOutputType> | number
          }
        }
      }
      Contact: {
        payload: Prisma.$ContactPayload<ExtArgs>
        fields: Prisma.ContactFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          findFirst: {
            args: Prisma.ContactFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          findMany: {
            args: Prisma.ContactFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>[]
          }
          create: {
            args: Prisma.ContactCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          createMany: {
            args: Prisma.ContactCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContactCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>[]
          }
          delete: {
            args: Prisma.ContactDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          update: {
            args: Prisma.ContactUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          deleteMany: {
            args: Prisma.ContactDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContactUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>[]
          }
          upsert: {
            args: Prisma.ContactUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          aggregate: {
            args: Prisma.ContactAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContact>
          }
          groupBy: {
            args: Prisma.ContactGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactCountArgs<ExtArgs>
            result: $Utils.Optional<ContactCountAggregateOutputType> | number
          }
        }
      }
      Note: {
        payload: Prisma.$NotePayload<ExtArgs>
        fields: Prisma.NoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          findFirst: {
            args: Prisma.NoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          findMany: {
            args: Prisma.NoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>[]
          }
          create: {
            args: Prisma.NoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          createMany: {
            args: Prisma.NoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>[]
          }
          delete: {
            args: Prisma.NoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          update: {
            args: Prisma.NoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          deleteMany: {
            args: Prisma.NoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>[]
          }
          upsert: {
            args: Prisma.NoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          aggregate: {
            args: Prisma.NoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNote>
          }
          groupBy: {
            args: Prisma.NoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<NoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.NoteCountArgs<ExtArgs>
            result: $Utils.Optional<NoteCountAggregateOutputType> | number
          }
        }
      }
      CallLog: {
        payload: Prisma.$CallLogPayload<ExtArgs>
        fields: Prisma.CallLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CallLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CallLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload>
          }
          findFirst: {
            args: Prisma.CallLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CallLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload>
          }
          findMany: {
            args: Prisma.CallLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload>[]
          }
          create: {
            args: Prisma.CallLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload>
          }
          createMany: {
            args: Prisma.CallLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CallLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload>[]
          }
          delete: {
            args: Prisma.CallLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload>
          }
          update: {
            args: Prisma.CallLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload>
          }
          deleteMany: {
            args: Prisma.CallLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CallLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CallLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload>[]
          }
          upsert: {
            args: Prisma.CallLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallLogPayload>
          }
          aggregate: {
            args: Prisma.CallLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCallLog>
          }
          groupBy: {
            args: Prisma.CallLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<CallLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.CallLogCountArgs<ExtArgs>
            result: $Utils.Optional<CallLogCountAggregateOutputType> | number
          }
        }
      }
      ContactFile: {
        payload: Prisma.$ContactFilePayload<ExtArgs>
        fields: Prisma.ContactFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload>
          }
          findFirst: {
            args: Prisma.ContactFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload>
          }
          findMany: {
            args: Prisma.ContactFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload>[]
          }
          create: {
            args: Prisma.ContactFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload>
          }
          createMany: {
            args: Prisma.ContactFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContactFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload>[]
          }
          delete: {
            args: Prisma.ContactFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload>
          }
          update: {
            args: Prisma.ContactFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload>
          }
          deleteMany: {
            args: Prisma.ContactFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContactFileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload>[]
          }
          upsert: {
            args: Prisma.ContactFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactFilePayload>
          }
          aggregate: {
            args: Prisma.ContactFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContactFile>
          }
          groupBy: {
            args: Prisma.ContactFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactFileCountArgs<ExtArgs>
            result: $Utils.Optional<ContactFileCountAggregateOutputType> | number
          }
        }
      }
      Reservation: {
        payload: Prisma.$ReservationPayload<ExtArgs>
        fields: Prisma.ReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findFirst: {
            args: Prisma.ReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findMany: {
            args: Prisma.ReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          create: {
            args: Prisma.ReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          createMany: {
            args: Prisma.ReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          delete: {
            args: Prisma.ReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          update: {
            args: Prisma.ReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          deleteMany: {
            args: Prisma.ReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReservationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          upsert: {
            args: Prisma.ReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          aggregate: {
            args: Prisma.ReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservation>
          }
          groupBy: {
            args: Prisma.ReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservationCountArgs<ExtArgs>
            result: $Utils.Optional<ReservationCountAggregateOutputType> | number
          }
        }
      }
      LotLock: {
        payload: Prisma.$LotLockPayload<ExtArgs>
        fields: Prisma.LotLockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LotLockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LotLockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload>
          }
          findFirst: {
            args: Prisma.LotLockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LotLockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload>
          }
          findMany: {
            args: Prisma.LotLockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload>[]
          }
          create: {
            args: Prisma.LotLockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload>
          }
          createMany: {
            args: Prisma.LotLockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LotLockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload>[]
          }
          delete: {
            args: Prisma.LotLockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload>
          }
          update: {
            args: Prisma.LotLockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload>
          }
          deleteMany: {
            args: Prisma.LotLockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LotLockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LotLockUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload>[]
          }
          upsert: {
            args: Prisma.LotLockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotLockPayload>
          }
          aggregate: {
            args: Prisma.LotLockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLotLock>
          }
          groupBy: {
            args: Prisma.LotLockGroupByArgs<ExtArgs>
            result: $Utils.Optional<LotLockGroupByOutputType>[]
          }
          count: {
            args: Prisma.LotLockCountArgs<ExtArgs>
            result: $Utils.Optional<LotLockCountAggregateOutputType> | number
          }
        }
      }
      WebpayTransaction: {
        payload: Prisma.$WebpayTransactionPayload<ExtArgs>
        fields: Prisma.WebpayTransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WebpayTransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WebpayTransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload>
          }
          findFirst: {
            args: Prisma.WebpayTransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WebpayTransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload>
          }
          findMany: {
            args: Prisma.WebpayTransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload>[]
          }
          create: {
            args: Prisma.WebpayTransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload>
          }
          createMany: {
            args: Prisma.WebpayTransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WebpayTransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload>[]
          }
          delete: {
            args: Prisma.WebpayTransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload>
          }
          update: {
            args: Prisma.WebpayTransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload>
          }
          deleteMany: {
            args: Prisma.WebpayTransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WebpayTransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WebpayTransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload>[]
          }
          upsert: {
            args: Prisma.WebpayTransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebpayTransactionPayload>
          }
          aggregate: {
            args: Prisma.WebpayTransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWebpayTransaction>
          }
          groupBy: {
            args: Prisma.WebpayTransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<WebpayTransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.WebpayTransactionCountArgs<ExtArgs>
            result: $Utils.Optional<WebpayTransactionCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    lot?: LotOmit
    contact?: ContactOmit
    note?: NoteOmit
    callLog?: CallLogOmit
    contactFile?: ContactFileOmit
    reservation?: ReservationOmit
    lotLock?: LotLockOmit
    webpayTransaction?: WebpayTransactionOmit
    user?: UserOmit
    auditLog?: AuditLogOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LotCountOutputType
   */

  export type LotCountOutputType = {
    reservations: number
    locks: number
    transactions: number
  }

  export type LotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | LotCountOutputTypeCountReservationsArgs
    locks?: boolean | LotCountOutputTypeCountLocksArgs
    transactions?: boolean | LotCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotCountOutputType
     */
    select?: LotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeCountReservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
  }

  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeCountLocksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LotLockWhereInput
  }

  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebpayTransactionWhereInput
  }


  /**
   * Count Type ContactCountOutputType
   */

  export type ContactCountOutputType = {
    reservations: number
    notes: number
    calls: number
    files: number
  }

  export type ContactCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | ContactCountOutputTypeCountReservationsArgs
    notes?: boolean | ContactCountOutputTypeCountNotesArgs
    calls?: boolean | ContactCountOutputTypeCountCallsArgs
    files?: boolean | ContactCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes
  /**
   * ContactCountOutputType without action
   */
  export type ContactCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactCountOutputType
     */
    select?: ContactCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContactCountOutputType without action
   */
  export type ContactCountOutputTypeCountReservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
  }

  /**
   * ContactCountOutputType without action
   */
  export type ContactCountOutputTypeCountNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NoteWhereInput
  }

  /**
   * ContactCountOutputType without action
   */
  export type ContactCountOutputTypeCountCallsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallLogWhereInput
  }

  /**
   * ContactCountOutputType without action
   */
  export type ContactCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactFileWhereInput
  }


  /**
   * Count Type ReservationCountOutputType
   */

  export type ReservationCountOutputType = {
    transactions: number
  }

  export type ReservationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | ReservationCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * ReservationCountOutputType without action
   */
  export type ReservationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationCountOutputType
     */
    select?: ReservationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReservationCountOutputType without action
   */
  export type ReservationCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebpayTransactionWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    notes: number
    calls: number
    sales: number
    purchases: number
    auditLogs: number
    notifications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notes?: boolean | UserCountOutputTypeCountNotesArgs
    calls?: boolean | UserCountOutputTypeCountCallsArgs
    sales?: boolean | UserCountOutputTypeCountSalesArgs
    purchases?: boolean | UserCountOutputTypeCountPurchasesArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NoteWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCallsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPurchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Lot
   */

  export type AggregateLot = {
    _count: LotCountAggregateOutputType | null
    _avg: LotAvgAggregateOutputType | null
    _sum: LotSumAggregateOutputType | null
    _min: LotMinAggregateOutputType | null
    _max: LotMaxAggregateOutputType | null
  }

  export type LotAvgAggregateOutputType = {
    id: number | null
    stage: number | null
    area_m2: number | null
    price_total_clp: number | null
    reservation_amount_clp: number | null
    cuotas: number | null
    pie: number | null
    valor_cuota: number | null
    last_installment_amount: number | null
  }

  export type LotSumAggregateOutputType = {
    id: number | null
    stage: number | null
    area_m2: number | null
    price_total_clp: number | null
    reservation_amount_clp: number | null
    cuotas: number | null
    pie: number | null
    valor_cuota: number | null
    last_installment_amount: number | null
  }

  export type LotMinAggregateOutputType = {
    id: number | null
    number: string | null
    stage: number | null
    area_m2: number | null
    price_total_clp: number | null
    reservation_amount_clp: number | null
    status: string | null
    cuotas: number | null
    pie: number | null
    valor_cuota: number | null
    last_installment_amount: number | null
    reserved_until: Date | null
    reserved_at: Date | null
    reserved_by: string | null
    order_id: string | null
    updated_at: Date | null
  }

  export type LotMaxAggregateOutputType = {
    id: number | null
    number: string | null
    stage: number | null
    area_m2: number | null
    price_total_clp: number | null
    reservation_amount_clp: number | null
    status: string | null
    cuotas: number | null
    pie: number | null
    valor_cuota: number | null
    last_installment_amount: number | null
    reserved_until: Date | null
    reserved_at: Date | null
    reserved_by: string | null
    order_id: string | null
    updated_at: Date | null
  }

  export type LotCountAggregateOutputType = {
    id: number
    number: number
    stage: number
    area_m2: number
    price_total_clp: number
    reservation_amount_clp: number
    status: number
    cuotas: number
    pie: number
    valor_cuota: number
    last_installment_amount: number
    reserved_until: number
    reserved_at: number
    reserved_by: number
    order_id: number
    updated_at: number
    _all: number
  }


  export type LotAvgAggregateInputType = {
    id?: true
    stage?: true
    area_m2?: true
    price_total_clp?: true
    reservation_amount_clp?: true
    cuotas?: true
    pie?: true
    valor_cuota?: true
    last_installment_amount?: true
  }

  export type LotSumAggregateInputType = {
    id?: true
    stage?: true
    area_m2?: true
    price_total_clp?: true
    reservation_amount_clp?: true
    cuotas?: true
    pie?: true
    valor_cuota?: true
    last_installment_amount?: true
  }

  export type LotMinAggregateInputType = {
    id?: true
    number?: true
    stage?: true
    area_m2?: true
    price_total_clp?: true
    reservation_amount_clp?: true
    status?: true
    cuotas?: true
    pie?: true
    valor_cuota?: true
    last_installment_amount?: true
    reserved_until?: true
    reserved_at?: true
    reserved_by?: true
    order_id?: true
    updated_at?: true
  }

  export type LotMaxAggregateInputType = {
    id?: true
    number?: true
    stage?: true
    area_m2?: true
    price_total_clp?: true
    reservation_amount_clp?: true
    status?: true
    cuotas?: true
    pie?: true
    valor_cuota?: true
    last_installment_amount?: true
    reserved_until?: true
    reserved_at?: true
    reserved_by?: true
    order_id?: true
    updated_at?: true
  }

  export type LotCountAggregateInputType = {
    id?: true
    number?: true
    stage?: true
    area_m2?: true
    price_total_clp?: true
    reservation_amount_clp?: true
    status?: true
    cuotas?: true
    pie?: true
    valor_cuota?: true
    last_installment_amount?: true
    reserved_until?: true
    reserved_at?: true
    reserved_by?: true
    order_id?: true
    updated_at?: true
    _all?: true
  }

  export type LotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lot to aggregate.
     */
    where?: LotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lots to fetch.
     */
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lots
    **/
    _count?: true | LotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LotMaxAggregateInputType
  }

  export type GetLotAggregateType<T extends LotAggregateArgs> = {
        [P in keyof T & keyof AggregateLot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLot[P]>
      : GetScalarType<T[P], AggregateLot[P]>
  }




  export type LotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LotWhereInput
    orderBy?: LotOrderByWithAggregationInput | LotOrderByWithAggregationInput[]
    by: LotScalarFieldEnum[] | LotScalarFieldEnum
    having?: LotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LotCountAggregateInputType | true
    _avg?: LotAvgAggregateInputType
    _sum?: LotSumAggregateInputType
    _min?: LotMinAggregateInputType
    _max?: LotMaxAggregateInputType
  }

  export type LotGroupByOutputType = {
    id: number
    number: string | null
    stage: number | null
    area_m2: number | null
    price_total_clp: number | null
    reservation_amount_clp: number | null
    status: string
    cuotas: number | null
    pie: number | null
    valor_cuota: number | null
    last_installment_amount: number | null
    reserved_until: Date | null
    reserved_at: Date | null
    reserved_by: string | null
    order_id: string | null
    updated_at: Date | null
    _count: LotCountAggregateOutputType | null
    _avg: LotAvgAggregateOutputType | null
    _sum: LotSumAggregateOutputType | null
    _min: LotMinAggregateOutputType | null
    _max: LotMaxAggregateOutputType | null
  }

  type GetLotGroupByPayload<T extends LotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LotGroupByOutputType[P]>
            : GetScalarType<T[P], LotGroupByOutputType[P]>
        }
      >
    >


  export type LotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    number?: boolean
    stage?: boolean
    area_m2?: boolean
    price_total_clp?: boolean
    reservation_amount_clp?: boolean
    status?: boolean
    cuotas?: boolean
    pie?: boolean
    valor_cuota?: boolean
    last_installment_amount?: boolean
    reserved_until?: boolean
    reserved_at?: boolean
    reserved_by?: boolean
    order_id?: boolean
    updated_at?: boolean
    reservations?: boolean | Lot$reservationsArgs<ExtArgs>
    locks?: boolean | Lot$locksArgs<ExtArgs>
    transactions?: boolean | Lot$transactionsArgs<ExtArgs>
    _count?: boolean | LotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lot"]>

  export type LotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    number?: boolean
    stage?: boolean
    area_m2?: boolean
    price_total_clp?: boolean
    reservation_amount_clp?: boolean
    status?: boolean
    cuotas?: boolean
    pie?: boolean
    valor_cuota?: boolean
    last_installment_amount?: boolean
    reserved_until?: boolean
    reserved_at?: boolean
    reserved_by?: boolean
    order_id?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["lot"]>

  export type LotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    number?: boolean
    stage?: boolean
    area_m2?: boolean
    price_total_clp?: boolean
    reservation_amount_clp?: boolean
    status?: boolean
    cuotas?: boolean
    pie?: boolean
    valor_cuota?: boolean
    last_installment_amount?: boolean
    reserved_until?: boolean
    reserved_at?: boolean
    reserved_by?: boolean
    order_id?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["lot"]>

  export type LotSelectScalar = {
    id?: boolean
    number?: boolean
    stage?: boolean
    area_m2?: boolean
    price_total_clp?: boolean
    reservation_amount_clp?: boolean
    status?: boolean
    cuotas?: boolean
    pie?: boolean
    valor_cuota?: boolean
    last_installment_amount?: boolean
    reserved_until?: boolean
    reserved_at?: boolean
    reserved_by?: boolean
    order_id?: boolean
    updated_at?: boolean
  }

  export type LotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "number" | "stage" | "area_m2" | "price_total_clp" | "reservation_amount_clp" | "status" | "cuotas" | "pie" | "valor_cuota" | "last_installment_amount" | "reserved_until" | "reserved_at" | "reserved_by" | "order_id" | "updated_at", ExtArgs["result"]["lot"]>
  export type LotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | Lot$reservationsArgs<ExtArgs>
    locks?: boolean | Lot$locksArgs<ExtArgs>
    transactions?: boolean | Lot$transactionsArgs<ExtArgs>
    _count?: boolean | LotCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lot"
    objects: {
      reservations: Prisma.$ReservationPayload<ExtArgs>[]
      locks: Prisma.$LotLockPayload<ExtArgs>[]
      transactions: Prisma.$WebpayTransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      number: string | null
      stage: number | null
      area_m2: number | null
      price_total_clp: number | null
      reservation_amount_clp: number | null
      status: string
      cuotas: number | null
      pie: number | null
      valor_cuota: number | null
      last_installment_amount: number | null
      reserved_until: Date | null
      reserved_at: Date | null
      reserved_by: string | null
      order_id: string | null
      updated_at: Date | null
    }, ExtArgs["result"]["lot"]>
    composites: {}
  }

  type LotGetPayload<S extends boolean | null | undefined | LotDefaultArgs> = $Result.GetResult<Prisma.$LotPayload, S>

  type LotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LotCountAggregateInputType | true
    }

  export interface LotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lot'], meta: { name: 'Lot' } }
    /**
     * Find zero or one Lot that matches the filter.
     * @param {LotFindUniqueArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LotFindUniqueArgs>(args: SelectSubset<T, LotFindUniqueArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LotFindUniqueOrThrowArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LotFindUniqueOrThrowArgs>(args: SelectSubset<T, LotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotFindFirstArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LotFindFirstArgs>(args?: SelectSubset<T, LotFindFirstArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotFindFirstOrThrowArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LotFindFirstOrThrowArgs>(args?: SelectSubset<T, LotFindFirstOrThrowArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lots
     * const lots = await prisma.lot.findMany()
     * 
     * // Get first 10 Lots
     * const lots = await prisma.lot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lotWithIdOnly = await prisma.lot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LotFindManyArgs>(args?: SelectSubset<T, LotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lot.
     * @param {LotCreateArgs} args - Arguments to create a Lot.
     * @example
     * // Create one Lot
     * const Lot = await prisma.lot.create({
     *   data: {
     *     // ... data to create a Lot
     *   }
     * })
     * 
     */
    create<T extends LotCreateArgs>(args: SelectSubset<T, LotCreateArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lots.
     * @param {LotCreateManyArgs} args - Arguments to create many Lots.
     * @example
     * // Create many Lots
     * const lot = await prisma.lot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LotCreateManyArgs>(args?: SelectSubset<T, LotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lots and returns the data saved in the database.
     * @param {LotCreateManyAndReturnArgs} args - Arguments to create many Lots.
     * @example
     * // Create many Lots
     * const lot = await prisma.lot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lots and only return the `id`
     * const lotWithIdOnly = await prisma.lot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LotCreateManyAndReturnArgs>(args?: SelectSubset<T, LotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lot.
     * @param {LotDeleteArgs} args - Arguments to delete one Lot.
     * @example
     * // Delete one Lot
     * const Lot = await prisma.lot.delete({
     *   where: {
     *     // ... filter to delete one Lot
     *   }
     * })
     * 
     */
    delete<T extends LotDeleteArgs>(args: SelectSubset<T, LotDeleteArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lot.
     * @param {LotUpdateArgs} args - Arguments to update one Lot.
     * @example
     * // Update one Lot
     * const lot = await prisma.lot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LotUpdateArgs>(args: SelectSubset<T, LotUpdateArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lots.
     * @param {LotDeleteManyArgs} args - Arguments to filter Lots to delete.
     * @example
     * // Delete a few Lots
     * const { count } = await prisma.lot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LotDeleteManyArgs>(args?: SelectSubset<T, LotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lots
     * const lot = await prisma.lot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LotUpdateManyArgs>(args: SelectSubset<T, LotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lots and returns the data updated in the database.
     * @param {LotUpdateManyAndReturnArgs} args - Arguments to update many Lots.
     * @example
     * // Update many Lots
     * const lot = await prisma.lot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lots and only return the `id`
     * const lotWithIdOnly = await prisma.lot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LotUpdateManyAndReturnArgs>(args: SelectSubset<T, LotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lot.
     * @param {LotUpsertArgs} args - Arguments to update or create a Lot.
     * @example
     * // Update or create a Lot
     * const lot = await prisma.lot.upsert({
     *   create: {
     *     // ... data to create a Lot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lot we want to update
     *   }
     * })
     */
    upsert<T extends LotUpsertArgs>(args: SelectSubset<T, LotUpsertArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotCountArgs} args - Arguments to filter Lots to count.
     * @example
     * // Count the number of Lots
     * const count = await prisma.lot.count({
     *   where: {
     *     // ... the filter for the Lots we want to count
     *   }
     * })
    **/
    count<T extends LotCountArgs>(
      args?: Subset<T, LotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LotAggregateArgs>(args: Subset<T, LotAggregateArgs>): Prisma.PrismaPromise<GetLotAggregateType<T>>

    /**
     * Group by Lot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LotGroupByArgs['orderBy'] }
        : { orderBy?: LotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lot model
   */
  readonly fields: LotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservations<T extends Lot$reservationsArgs<ExtArgs> = {}>(args?: Subset<T, Lot$reservationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    locks<T extends Lot$locksArgs<ExtArgs> = {}>(args?: Subset<T, Lot$locksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactions<T extends Lot$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Lot$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lot model
   */
  interface LotFieldRefs {
    readonly id: FieldRef<"Lot", 'Int'>
    readonly number: FieldRef<"Lot", 'String'>
    readonly stage: FieldRef<"Lot", 'Int'>
    readonly area_m2: FieldRef<"Lot", 'Float'>
    readonly price_total_clp: FieldRef<"Lot", 'Int'>
    readonly reservation_amount_clp: FieldRef<"Lot", 'Int'>
    readonly status: FieldRef<"Lot", 'String'>
    readonly cuotas: FieldRef<"Lot", 'Int'>
    readonly pie: FieldRef<"Lot", 'Int'>
    readonly valor_cuota: FieldRef<"Lot", 'Int'>
    readonly last_installment_amount: FieldRef<"Lot", 'Int'>
    readonly reserved_until: FieldRef<"Lot", 'DateTime'>
    readonly reserved_at: FieldRef<"Lot", 'DateTime'>
    readonly reserved_by: FieldRef<"Lot", 'String'>
    readonly order_id: FieldRef<"Lot", 'String'>
    readonly updated_at: FieldRef<"Lot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Lot findUnique
   */
  export type LotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lot to fetch.
     */
    where: LotWhereUniqueInput
  }

  /**
   * Lot findUniqueOrThrow
   */
  export type LotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lot to fetch.
     */
    where: LotWhereUniqueInput
  }

  /**
   * Lot findFirst
   */
  export type LotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lot to fetch.
     */
    where?: LotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lots to fetch.
     */
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lots.
     */
    cursor?: LotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lots.
     */
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * Lot findFirstOrThrow
   */
  export type LotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lot to fetch.
     */
    where?: LotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lots to fetch.
     */
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lots.
     */
    cursor?: LotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lots.
     */
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * Lot findMany
   */
  export type LotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lots to fetch.
     */
    where?: LotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lots to fetch.
     */
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lots.
     */
    cursor?: LotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lots.
     */
    skip?: number
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * Lot create
   */
  export type LotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * The data needed to create a Lot.
     */
    data?: XOR<LotCreateInput, LotUncheckedCreateInput>
  }

  /**
   * Lot createMany
   */
  export type LotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lots.
     */
    data: LotCreateManyInput | LotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lot createManyAndReturn
   */
  export type LotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * The data used to create many Lots.
     */
    data: LotCreateManyInput | LotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lot update
   */
  export type LotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * The data needed to update a Lot.
     */
    data: XOR<LotUpdateInput, LotUncheckedUpdateInput>
    /**
     * Choose, which Lot to update.
     */
    where: LotWhereUniqueInput
  }

  /**
   * Lot updateMany
   */
  export type LotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lots.
     */
    data: XOR<LotUpdateManyMutationInput, LotUncheckedUpdateManyInput>
    /**
     * Filter which Lots to update
     */
    where?: LotWhereInput
    /**
     * Limit how many Lots to update.
     */
    limit?: number
  }

  /**
   * Lot updateManyAndReturn
   */
  export type LotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * The data used to update Lots.
     */
    data: XOR<LotUpdateManyMutationInput, LotUncheckedUpdateManyInput>
    /**
     * Filter which Lots to update
     */
    where?: LotWhereInput
    /**
     * Limit how many Lots to update.
     */
    limit?: number
  }

  /**
   * Lot upsert
   */
  export type LotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * The filter to search for the Lot to update in case it exists.
     */
    where: LotWhereUniqueInput
    /**
     * In case the Lot found by the `where` argument doesn't exist, create a new Lot with this data.
     */
    create: XOR<LotCreateInput, LotUncheckedCreateInput>
    /**
     * In case the Lot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LotUpdateInput, LotUncheckedUpdateInput>
  }

  /**
   * Lot delete
   */
  export type LotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter which Lot to delete.
     */
    where: LotWhereUniqueInput
  }

  /**
   * Lot deleteMany
   */
  export type LotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lots to delete
     */
    where?: LotWhereInput
    /**
     * Limit how many Lots to delete.
     */
    limit?: number
  }

  /**
   * Lot.reservations
   */
  export type Lot$reservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    cursor?: ReservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Lot.locks
   */
  export type Lot$locksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    where?: LotLockWhereInput
    orderBy?: LotLockOrderByWithRelationInput | LotLockOrderByWithRelationInput[]
    cursor?: LotLockWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LotLockScalarFieldEnum | LotLockScalarFieldEnum[]
  }

  /**
   * Lot.transactions
   */
  export type Lot$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    where?: WebpayTransactionWhereInput
    orderBy?: WebpayTransactionOrderByWithRelationInput | WebpayTransactionOrderByWithRelationInput[]
    cursor?: WebpayTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WebpayTransactionScalarFieldEnum | WebpayTransactionScalarFieldEnum[]
  }

  /**
   * Lot without action
   */
  export type LotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
  }


  /**
   * Model Contact
   */

  export type AggregateContact = {
    _count: ContactCountAggregateOutputType | null
    _min: ContactMinAggregateOutputType | null
    _max: ContactMaxAggregateOutputType | null
  }

  export type ContactMinAggregateOutputType = {
    id: string | null
    email: string | null
    first_name: string | null
    last_name: string | null
    phone: string | null
    rut: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ContactMaxAggregateOutputType = {
    id: string | null
    email: string | null
    first_name: string | null
    last_name: string | null
    phone: string | null
    rut: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ContactCountAggregateOutputType = {
    id: number
    email: number
    first_name: number
    last_name: number
    phone: number
    rut: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ContactMinAggregateInputType = {
    id?: true
    email?: true
    first_name?: true
    last_name?: true
    phone?: true
    rut?: true
    created_at?: true
    updated_at?: true
  }

  export type ContactMaxAggregateInputType = {
    id?: true
    email?: true
    first_name?: true
    last_name?: true
    phone?: true
    rut?: true
    created_at?: true
    updated_at?: true
  }

  export type ContactCountAggregateInputType = {
    id?: true
    email?: true
    first_name?: true
    last_name?: true
    phone?: true
    rut?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ContactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contact to aggregate.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Contacts
    **/
    _count?: true | ContactCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactMaxAggregateInputType
  }

  export type GetContactAggregateType<T extends ContactAggregateArgs> = {
        [P in keyof T & keyof AggregateContact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContact[P]>
      : GetScalarType<T[P], AggregateContact[P]>
  }




  export type ContactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactWhereInput
    orderBy?: ContactOrderByWithAggregationInput | ContactOrderByWithAggregationInput[]
    by: ContactScalarFieldEnum[] | ContactScalarFieldEnum
    having?: ContactScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactCountAggregateInputType | true
    _min?: ContactMinAggregateInputType
    _max?: ContactMaxAggregateInputType
  }

  export type ContactGroupByOutputType = {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    phone: string | null
    rut: string | null
    created_at: Date
    updated_at: Date
    _count: ContactCountAggregateOutputType | null
    _min: ContactMinAggregateOutputType | null
    _max: ContactMaxAggregateOutputType | null
  }

  type GetContactGroupByPayload<T extends ContactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactGroupByOutputType[P]>
            : GetScalarType<T[P], ContactGroupByOutputType[P]>
        }
      >
    >


  export type ContactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    first_name?: boolean
    last_name?: boolean
    phone?: boolean
    rut?: boolean
    created_at?: boolean
    updated_at?: boolean
    reservations?: boolean | Contact$reservationsArgs<ExtArgs>
    notes?: boolean | Contact$notesArgs<ExtArgs>
    calls?: boolean | Contact$callsArgs<ExtArgs>
    files?: boolean | Contact$filesArgs<ExtArgs>
    _count?: boolean | ContactCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contact"]>

  export type ContactSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    first_name?: boolean
    last_name?: boolean
    phone?: boolean
    rut?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["contact"]>

  export type ContactSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    first_name?: boolean
    last_name?: boolean
    phone?: boolean
    rut?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["contact"]>

  export type ContactSelectScalar = {
    id?: boolean
    email?: boolean
    first_name?: boolean
    last_name?: boolean
    phone?: boolean
    rut?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ContactOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "first_name" | "last_name" | "phone" | "rut" | "created_at" | "updated_at", ExtArgs["result"]["contact"]>
  export type ContactInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | Contact$reservationsArgs<ExtArgs>
    notes?: boolean | Contact$notesArgs<ExtArgs>
    calls?: boolean | Contact$callsArgs<ExtArgs>
    files?: boolean | Contact$filesArgs<ExtArgs>
    _count?: boolean | ContactCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContactIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ContactIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ContactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Contact"
    objects: {
      reservations: Prisma.$ReservationPayload<ExtArgs>[]
      notes: Prisma.$NotePayload<ExtArgs>[]
      calls: Prisma.$CallLogPayload<ExtArgs>[]
      files: Prisma.$ContactFilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      first_name: string | null
      last_name: string | null
      phone: string | null
      rut: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["contact"]>
    composites: {}
  }

  type ContactGetPayload<S extends boolean | null | undefined | ContactDefaultArgs> = $Result.GetResult<Prisma.$ContactPayload, S>

  type ContactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContactFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContactCountAggregateInputType | true
    }

  export interface ContactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Contact'], meta: { name: 'Contact' } }
    /**
     * Find zero or one Contact that matches the filter.
     * @param {ContactFindUniqueArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactFindUniqueArgs>(args: SelectSubset<T, ContactFindUniqueArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Contact that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactFindUniqueOrThrowArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Contact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFindFirstArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactFindFirstArgs>(args?: SelectSubset<T, ContactFindFirstArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Contact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFindFirstOrThrowArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Contacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Contacts
     * const contacts = await prisma.contact.findMany()
     * 
     * // Get first 10 Contacts
     * const contacts = await prisma.contact.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactWithIdOnly = await prisma.contact.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactFindManyArgs>(args?: SelectSubset<T, ContactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Contact.
     * @param {ContactCreateArgs} args - Arguments to create a Contact.
     * @example
     * // Create one Contact
     * const Contact = await prisma.contact.create({
     *   data: {
     *     // ... data to create a Contact
     *   }
     * })
     * 
     */
    create<T extends ContactCreateArgs>(args: SelectSubset<T, ContactCreateArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Contacts.
     * @param {ContactCreateManyArgs} args - Arguments to create many Contacts.
     * @example
     * // Create many Contacts
     * const contact = await prisma.contact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactCreateManyArgs>(args?: SelectSubset<T, ContactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Contacts and returns the data saved in the database.
     * @param {ContactCreateManyAndReturnArgs} args - Arguments to create many Contacts.
     * @example
     * // Create many Contacts
     * const contact = await prisma.contact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Contacts and only return the `id`
     * const contactWithIdOnly = await prisma.contact.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContactCreateManyAndReturnArgs>(args?: SelectSubset<T, ContactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Contact.
     * @param {ContactDeleteArgs} args - Arguments to delete one Contact.
     * @example
     * // Delete one Contact
     * const Contact = await prisma.contact.delete({
     *   where: {
     *     // ... filter to delete one Contact
     *   }
     * })
     * 
     */
    delete<T extends ContactDeleteArgs>(args: SelectSubset<T, ContactDeleteArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Contact.
     * @param {ContactUpdateArgs} args - Arguments to update one Contact.
     * @example
     * // Update one Contact
     * const contact = await prisma.contact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactUpdateArgs>(args: SelectSubset<T, ContactUpdateArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Contacts.
     * @param {ContactDeleteManyArgs} args - Arguments to filter Contacts to delete.
     * @example
     * // Delete a few Contacts
     * const { count } = await prisma.contact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactDeleteManyArgs>(args?: SelectSubset<T, ContactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Contacts
     * const contact = await prisma.contact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactUpdateManyArgs>(args: SelectSubset<T, ContactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contacts and returns the data updated in the database.
     * @param {ContactUpdateManyAndReturnArgs} args - Arguments to update many Contacts.
     * @example
     * // Update many Contacts
     * const contact = await prisma.contact.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Contacts and only return the `id`
     * const contactWithIdOnly = await prisma.contact.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContactUpdateManyAndReturnArgs>(args: SelectSubset<T, ContactUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Contact.
     * @param {ContactUpsertArgs} args - Arguments to update or create a Contact.
     * @example
     * // Update or create a Contact
     * const contact = await prisma.contact.upsert({
     *   create: {
     *     // ... data to create a Contact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Contact we want to update
     *   }
     * })
     */
    upsert<T extends ContactUpsertArgs>(args: SelectSubset<T, ContactUpsertArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Contacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactCountArgs} args - Arguments to filter Contacts to count.
     * @example
     * // Count the number of Contacts
     * const count = await prisma.contact.count({
     *   where: {
     *     // ... the filter for the Contacts we want to count
     *   }
     * })
    **/
    count<T extends ContactCountArgs>(
      args?: Subset<T, ContactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Contact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContactAggregateArgs>(args: Subset<T, ContactAggregateArgs>): Prisma.PrismaPromise<GetContactAggregateType<T>>

    /**
     * Group by Contact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContactGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactGroupByArgs['orderBy'] }
        : { orderBy?: ContactGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Contact model
   */
  readonly fields: ContactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Contact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservations<T extends Contact$reservationsArgs<ExtArgs> = {}>(args?: Subset<T, Contact$reservationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notes<T extends Contact$notesArgs<ExtArgs> = {}>(args?: Subset<T, Contact$notesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    calls<T extends Contact$callsArgs<ExtArgs> = {}>(args?: Subset<T, Contact$callsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    files<T extends Contact$filesArgs<ExtArgs> = {}>(args?: Subset<T, Contact$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Contact model
   */
  interface ContactFieldRefs {
    readonly id: FieldRef<"Contact", 'String'>
    readonly email: FieldRef<"Contact", 'String'>
    readonly first_name: FieldRef<"Contact", 'String'>
    readonly last_name: FieldRef<"Contact", 'String'>
    readonly phone: FieldRef<"Contact", 'String'>
    readonly rut: FieldRef<"Contact", 'String'>
    readonly created_at: FieldRef<"Contact", 'DateTime'>
    readonly updated_at: FieldRef<"Contact", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Contact findUnique
   */
  export type ContactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact findUniqueOrThrow
   */
  export type ContactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact findFirst
   */
  export type ContactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contacts.
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contacts.
     */
    distinct?: ContactScalarFieldEnum | ContactScalarFieldEnum[]
  }

  /**
   * Contact findFirstOrThrow
   */
  export type ContactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contacts.
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contacts.
     */
    distinct?: ContactScalarFieldEnum | ContactScalarFieldEnum[]
  }

  /**
   * Contact findMany
   */
  export type ContactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contacts to fetch.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Contacts.
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    distinct?: ContactScalarFieldEnum | ContactScalarFieldEnum[]
  }

  /**
   * Contact create
   */
  export type ContactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * The data needed to create a Contact.
     */
    data: XOR<ContactCreateInput, ContactUncheckedCreateInput>
  }

  /**
   * Contact createMany
   */
  export type ContactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Contacts.
     */
    data: ContactCreateManyInput | ContactCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Contact createManyAndReturn
   */
  export type ContactCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * The data used to create many Contacts.
     */
    data: ContactCreateManyInput | ContactCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Contact update
   */
  export type ContactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * The data needed to update a Contact.
     */
    data: XOR<ContactUpdateInput, ContactUncheckedUpdateInput>
    /**
     * Choose, which Contact to update.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact updateMany
   */
  export type ContactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Contacts.
     */
    data: XOR<ContactUpdateManyMutationInput, ContactUncheckedUpdateManyInput>
    /**
     * Filter which Contacts to update
     */
    where?: ContactWhereInput
    /**
     * Limit how many Contacts to update.
     */
    limit?: number
  }

  /**
   * Contact updateManyAndReturn
   */
  export type ContactUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * The data used to update Contacts.
     */
    data: XOR<ContactUpdateManyMutationInput, ContactUncheckedUpdateManyInput>
    /**
     * Filter which Contacts to update
     */
    where?: ContactWhereInput
    /**
     * Limit how many Contacts to update.
     */
    limit?: number
  }

  /**
   * Contact upsert
   */
  export type ContactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * The filter to search for the Contact to update in case it exists.
     */
    where: ContactWhereUniqueInput
    /**
     * In case the Contact found by the `where` argument doesn't exist, create a new Contact with this data.
     */
    create: XOR<ContactCreateInput, ContactUncheckedCreateInput>
    /**
     * In case the Contact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactUpdateInput, ContactUncheckedUpdateInput>
  }

  /**
   * Contact delete
   */
  export type ContactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter which Contact to delete.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact deleteMany
   */
  export type ContactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contacts to delete
     */
    where?: ContactWhereInput
    /**
     * Limit how many Contacts to delete.
     */
    limit?: number
  }

  /**
   * Contact.reservations
   */
  export type Contact$reservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    cursor?: ReservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Contact.notes
   */
  export type Contact$notesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    where?: NoteWhereInput
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    cursor?: NoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Contact.calls
   */
  export type Contact$callsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    where?: CallLogWhereInput
    orderBy?: CallLogOrderByWithRelationInput | CallLogOrderByWithRelationInput[]
    cursor?: CallLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CallLogScalarFieldEnum | CallLogScalarFieldEnum[]
  }

  /**
   * Contact.files
   */
  export type Contact$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    where?: ContactFileWhereInput
    orderBy?: ContactFileOrderByWithRelationInput | ContactFileOrderByWithRelationInput[]
    cursor?: ContactFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContactFileScalarFieldEnum | ContactFileScalarFieldEnum[]
  }

  /**
   * Contact without action
   */
  export type ContactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
  }


  /**
   * Model Note
   */

  export type AggregateNote = {
    _count: NoteCountAggregateOutputType | null
    _min: NoteMinAggregateOutputType | null
    _max: NoteMaxAggregateOutputType | null
  }

  export type NoteMinAggregateOutputType = {
    id: string | null
    contact_id: string | null
    seller_id: string | null
    content: string | null
    created_at: Date | null
  }

  export type NoteMaxAggregateOutputType = {
    id: string | null
    contact_id: string | null
    seller_id: string | null
    content: string | null
    created_at: Date | null
  }

  export type NoteCountAggregateOutputType = {
    id: number
    contact_id: number
    seller_id: number
    content: number
    created_at: number
    _all: number
  }


  export type NoteMinAggregateInputType = {
    id?: true
    contact_id?: true
    seller_id?: true
    content?: true
    created_at?: true
  }

  export type NoteMaxAggregateInputType = {
    id?: true
    contact_id?: true
    seller_id?: true
    content?: true
    created_at?: true
  }

  export type NoteCountAggregateInputType = {
    id?: true
    contact_id?: true
    seller_id?: true
    content?: true
    created_at?: true
    _all?: true
  }

  export type NoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Note to aggregate.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notes
    **/
    _count?: true | NoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NoteMaxAggregateInputType
  }

  export type GetNoteAggregateType<T extends NoteAggregateArgs> = {
        [P in keyof T & keyof AggregateNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNote[P]>
      : GetScalarType<T[P], AggregateNote[P]>
  }




  export type NoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NoteWhereInput
    orderBy?: NoteOrderByWithAggregationInput | NoteOrderByWithAggregationInput[]
    by: NoteScalarFieldEnum[] | NoteScalarFieldEnum
    having?: NoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NoteCountAggregateInputType | true
    _min?: NoteMinAggregateInputType
    _max?: NoteMaxAggregateInputType
  }

  export type NoteGroupByOutputType = {
    id: string
    contact_id: string
    seller_id: string
    content: string
    created_at: Date
    _count: NoteCountAggregateOutputType | null
    _min: NoteMinAggregateOutputType | null
    _max: NoteMaxAggregateOutputType | null
  }

  type GetNoteGroupByPayload<T extends NoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NoteGroupByOutputType[P]>
            : GetScalarType<T[P], NoteGroupByOutputType[P]>
        }
      >
    >


  export type NoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contact_id?: boolean
    seller_id?: boolean
    content?: boolean
    created_at?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["note"]>

  export type NoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contact_id?: boolean
    seller_id?: boolean
    content?: boolean
    created_at?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["note"]>

  export type NoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contact_id?: boolean
    seller_id?: boolean
    content?: boolean
    created_at?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["note"]>

  export type NoteSelectScalar = {
    id?: boolean
    contact_id?: boolean
    seller_id?: boolean
    content?: boolean
    created_at?: boolean
  }

  export type NoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "contact_id" | "seller_id" | "content" | "created_at", ExtArgs["result"]["note"]>
  export type NoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Note"
    objects: {
      contact: Prisma.$ContactPayload<ExtArgs>
      seller: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      contact_id: string
      seller_id: string
      content: string
      created_at: Date
    }, ExtArgs["result"]["note"]>
    composites: {}
  }

  type NoteGetPayload<S extends boolean | null | undefined | NoteDefaultArgs> = $Result.GetResult<Prisma.$NotePayload, S>

  type NoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NoteCountAggregateInputType | true
    }

  export interface NoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Note'], meta: { name: 'Note' } }
    /**
     * Find zero or one Note that matches the filter.
     * @param {NoteFindUniqueArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NoteFindUniqueArgs>(args: SelectSubset<T, NoteFindUniqueArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Note that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NoteFindUniqueOrThrowArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NoteFindUniqueOrThrowArgs>(args: SelectSubset<T, NoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Note that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteFindFirstArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NoteFindFirstArgs>(args?: SelectSubset<T, NoteFindFirstArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Note that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteFindFirstOrThrowArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NoteFindFirstOrThrowArgs>(args?: SelectSubset<T, NoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notes
     * const notes = await prisma.note.findMany()
     * 
     * // Get first 10 Notes
     * const notes = await prisma.note.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const noteWithIdOnly = await prisma.note.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NoteFindManyArgs>(args?: SelectSubset<T, NoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Note.
     * @param {NoteCreateArgs} args - Arguments to create a Note.
     * @example
     * // Create one Note
     * const Note = await prisma.note.create({
     *   data: {
     *     // ... data to create a Note
     *   }
     * })
     * 
     */
    create<T extends NoteCreateArgs>(args: SelectSubset<T, NoteCreateArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notes.
     * @param {NoteCreateManyArgs} args - Arguments to create many Notes.
     * @example
     * // Create many Notes
     * const note = await prisma.note.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NoteCreateManyArgs>(args?: SelectSubset<T, NoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notes and returns the data saved in the database.
     * @param {NoteCreateManyAndReturnArgs} args - Arguments to create many Notes.
     * @example
     * // Create many Notes
     * const note = await prisma.note.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notes and only return the `id`
     * const noteWithIdOnly = await prisma.note.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NoteCreateManyAndReturnArgs>(args?: SelectSubset<T, NoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Note.
     * @param {NoteDeleteArgs} args - Arguments to delete one Note.
     * @example
     * // Delete one Note
     * const Note = await prisma.note.delete({
     *   where: {
     *     // ... filter to delete one Note
     *   }
     * })
     * 
     */
    delete<T extends NoteDeleteArgs>(args: SelectSubset<T, NoteDeleteArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Note.
     * @param {NoteUpdateArgs} args - Arguments to update one Note.
     * @example
     * // Update one Note
     * const note = await prisma.note.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NoteUpdateArgs>(args: SelectSubset<T, NoteUpdateArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notes.
     * @param {NoteDeleteManyArgs} args - Arguments to filter Notes to delete.
     * @example
     * // Delete a few Notes
     * const { count } = await prisma.note.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NoteDeleteManyArgs>(args?: SelectSubset<T, NoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notes
     * const note = await prisma.note.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NoteUpdateManyArgs>(args: SelectSubset<T, NoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notes and returns the data updated in the database.
     * @param {NoteUpdateManyAndReturnArgs} args - Arguments to update many Notes.
     * @example
     * // Update many Notes
     * const note = await prisma.note.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notes and only return the `id`
     * const noteWithIdOnly = await prisma.note.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NoteUpdateManyAndReturnArgs>(args: SelectSubset<T, NoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Note.
     * @param {NoteUpsertArgs} args - Arguments to update or create a Note.
     * @example
     * // Update or create a Note
     * const note = await prisma.note.upsert({
     *   create: {
     *     // ... data to create a Note
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Note we want to update
     *   }
     * })
     */
    upsert<T extends NoteUpsertArgs>(args: SelectSubset<T, NoteUpsertArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteCountArgs} args - Arguments to filter Notes to count.
     * @example
     * // Count the number of Notes
     * const count = await prisma.note.count({
     *   where: {
     *     // ... the filter for the Notes we want to count
     *   }
     * })
    **/
    count<T extends NoteCountArgs>(
      args?: Subset<T, NoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Note.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NoteAggregateArgs>(args: Subset<T, NoteAggregateArgs>): Prisma.PrismaPromise<GetNoteAggregateType<T>>

    /**
     * Group by Note.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NoteGroupByArgs['orderBy'] }
        : { orderBy?: NoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Note model
   */
  readonly fields: NoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Note.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contact<T extends ContactDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContactDefaultArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    seller<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Note model
   */
  interface NoteFieldRefs {
    readonly id: FieldRef<"Note", 'String'>
    readonly contact_id: FieldRef<"Note", 'String'>
    readonly seller_id: FieldRef<"Note", 'String'>
    readonly content: FieldRef<"Note", 'String'>
    readonly created_at: FieldRef<"Note", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Note findUnique
   */
  export type NoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note findUniqueOrThrow
   */
  export type NoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note findFirst
   */
  export type NoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notes.
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notes.
     */
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Note findFirstOrThrow
   */
  export type NoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notes.
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notes.
     */
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Note findMany
   */
  export type NoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Notes to fetch.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notes.
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Note create
   */
  export type NoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * The data needed to create a Note.
     */
    data: XOR<NoteCreateInput, NoteUncheckedCreateInput>
  }

  /**
   * Note createMany
   */
  export type NoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notes.
     */
    data: NoteCreateManyInput | NoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Note createManyAndReturn
   */
  export type NoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * The data used to create many Notes.
     */
    data: NoteCreateManyInput | NoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Note update
   */
  export type NoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * The data needed to update a Note.
     */
    data: XOR<NoteUpdateInput, NoteUncheckedUpdateInput>
    /**
     * Choose, which Note to update.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note updateMany
   */
  export type NoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notes.
     */
    data: XOR<NoteUpdateManyMutationInput, NoteUncheckedUpdateManyInput>
    /**
     * Filter which Notes to update
     */
    where?: NoteWhereInput
    /**
     * Limit how many Notes to update.
     */
    limit?: number
  }

  /**
   * Note updateManyAndReturn
   */
  export type NoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * The data used to update Notes.
     */
    data: XOR<NoteUpdateManyMutationInput, NoteUncheckedUpdateManyInput>
    /**
     * Filter which Notes to update
     */
    where?: NoteWhereInput
    /**
     * Limit how many Notes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Note upsert
   */
  export type NoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * The filter to search for the Note to update in case it exists.
     */
    where: NoteWhereUniqueInput
    /**
     * In case the Note found by the `where` argument doesn't exist, create a new Note with this data.
     */
    create: XOR<NoteCreateInput, NoteUncheckedCreateInput>
    /**
     * In case the Note was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NoteUpdateInput, NoteUncheckedUpdateInput>
  }

  /**
   * Note delete
   */
  export type NoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter which Note to delete.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note deleteMany
   */
  export type NoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notes to delete
     */
    where?: NoteWhereInput
    /**
     * Limit how many Notes to delete.
     */
    limit?: number
  }

  /**
   * Note without action
   */
  export type NoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
  }


  /**
   * Model CallLog
   */

  export type AggregateCallLog = {
    _count: CallLogCountAggregateOutputType | null
    _avg: CallLogAvgAggregateOutputType | null
    _sum: CallLogSumAggregateOutputType | null
    _min: CallLogMinAggregateOutputType | null
    _max: CallLogMaxAggregateOutputType | null
  }

  export type CallLogAvgAggregateOutputType = {
    duration: number | null
  }

  export type CallLogSumAggregateOutputType = {
    duration: number | null
  }

  export type CallLogMinAggregateOutputType = {
    id: string | null
    contact_id: string | null
    seller_id: string | null
    duration: number | null
    summary: string | null
    date: Date | null
  }

  export type CallLogMaxAggregateOutputType = {
    id: string | null
    contact_id: string | null
    seller_id: string | null
    duration: number | null
    summary: string | null
    date: Date | null
  }

  export type CallLogCountAggregateOutputType = {
    id: number
    contact_id: number
    seller_id: number
    duration: number
    summary: number
    date: number
    _all: number
  }


  export type CallLogAvgAggregateInputType = {
    duration?: true
  }

  export type CallLogSumAggregateInputType = {
    duration?: true
  }

  export type CallLogMinAggregateInputType = {
    id?: true
    contact_id?: true
    seller_id?: true
    duration?: true
    summary?: true
    date?: true
  }

  export type CallLogMaxAggregateInputType = {
    id?: true
    contact_id?: true
    seller_id?: true
    duration?: true
    summary?: true
    date?: true
  }

  export type CallLogCountAggregateInputType = {
    id?: true
    contact_id?: true
    seller_id?: true
    duration?: true
    summary?: true
    date?: true
    _all?: true
  }

  export type CallLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CallLog to aggregate.
     */
    where?: CallLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CallLogs to fetch.
     */
    orderBy?: CallLogOrderByWithRelationInput | CallLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CallLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CallLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CallLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CallLogs
    **/
    _count?: true | CallLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CallLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CallLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CallLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CallLogMaxAggregateInputType
  }

  export type GetCallLogAggregateType<T extends CallLogAggregateArgs> = {
        [P in keyof T & keyof AggregateCallLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCallLog[P]>
      : GetScalarType<T[P], AggregateCallLog[P]>
  }




  export type CallLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallLogWhereInput
    orderBy?: CallLogOrderByWithAggregationInput | CallLogOrderByWithAggregationInput[]
    by: CallLogScalarFieldEnum[] | CallLogScalarFieldEnum
    having?: CallLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CallLogCountAggregateInputType | true
    _avg?: CallLogAvgAggregateInputType
    _sum?: CallLogSumAggregateInputType
    _min?: CallLogMinAggregateInputType
    _max?: CallLogMaxAggregateInputType
  }

  export type CallLogGroupByOutputType = {
    id: string
    contact_id: string
    seller_id: string
    duration: number | null
    summary: string | null
    date: Date
    _count: CallLogCountAggregateOutputType | null
    _avg: CallLogAvgAggregateOutputType | null
    _sum: CallLogSumAggregateOutputType | null
    _min: CallLogMinAggregateOutputType | null
    _max: CallLogMaxAggregateOutputType | null
  }

  type GetCallLogGroupByPayload<T extends CallLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CallLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CallLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CallLogGroupByOutputType[P]>
            : GetScalarType<T[P], CallLogGroupByOutputType[P]>
        }
      >
    >


  export type CallLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contact_id?: boolean
    seller_id?: boolean
    duration?: boolean
    summary?: boolean
    date?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["callLog"]>

  export type CallLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contact_id?: boolean
    seller_id?: boolean
    duration?: boolean
    summary?: boolean
    date?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["callLog"]>

  export type CallLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contact_id?: boolean
    seller_id?: boolean
    duration?: boolean
    summary?: boolean
    date?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["callLog"]>

  export type CallLogSelectScalar = {
    id?: boolean
    contact_id?: boolean
    seller_id?: boolean
    duration?: boolean
    summary?: boolean
    date?: boolean
  }

  export type CallLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "contact_id" | "seller_id" | "duration" | "summary" | "date", ExtArgs["result"]["callLog"]>
  export type CallLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CallLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CallLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CallLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CallLog"
    objects: {
      contact: Prisma.$ContactPayload<ExtArgs>
      seller: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      contact_id: string
      seller_id: string
      duration: number | null
      summary: string | null
      date: Date
    }, ExtArgs["result"]["callLog"]>
    composites: {}
  }

  type CallLogGetPayload<S extends boolean | null | undefined | CallLogDefaultArgs> = $Result.GetResult<Prisma.$CallLogPayload, S>

  type CallLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CallLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CallLogCountAggregateInputType | true
    }

  export interface CallLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CallLog'], meta: { name: 'CallLog' } }
    /**
     * Find zero or one CallLog that matches the filter.
     * @param {CallLogFindUniqueArgs} args - Arguments to find a CallLog
     * @example
     * // Get one CallLog
     * const callLog = await prisma.callLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CallLogFindUniqueArgs>(args: SelectSubset<T, CallLogFindUniqueArgs<ExtArgs>>): Prisma__CallLogClient<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CallLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CallLogFindUniqueOrThrowArgs} args - Arguments to find a CallLog
     * @example
     * // Get one CallLog
     * const callLog = await prisma.callLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CallLogFindUniqueOrThrowArgs>(args: SelectSubset<T, CallLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CallLogClient<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CallLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallLogFindFirstArgs} args - Arguments to find a CallLog
     * @example
     * // Get one CallLog
     * const callLog = await prisma.callLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CallLogFindFirstArgs>(args?: SelectSubset<T, CallLogFindFirstArgs<ExtArgs>>): Prisma__CallLogClient<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CallLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallLogFindFirstOrThrowArgs} args - Arguments to find a CallLog
     * @example
     * // Get one CallLog
     * const callLog = await prisma.callLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CallLogFindFirstOrThrowArgs>(args?: SelectSubset<T, CallLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__CallLogClient<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CallLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CallLogs
     * const callLogs = await prisma.callLog.findMany()
     * 
     * // Get first 10 CallLogs
     * const callLogs = await prisma.callLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const callLogWithIdOnly = await prisma.callLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CallLogFindManyArgs>(args?: SelectSubset<T, CallLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CallLog.
     * @param {CallLogCreateArgs} args - Arguments to create a CallLog.
     * @example
     * // Create one CallLog
     * const CallLog = await prisma.callLog.create({
     *   data: {
     *     // ... data to create a CallLog
     *   }
     * })
     * 
     */
    create<T extends CallLogCreateArgs>(args: SelectSubset<T, CallLogCreateArgs<ExtArgs>>): Prisma__CallLogClient<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CallLogs.
     * @param {CallLogCreateManyArgs} args - Arguments to create many CallLogs.
     * @example
     * // Create many CallLogs
     * const callLog = await prisma.callLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CallLogCreateManyArgs>(args?: SelectSubset<T, CallLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CallLogs and returns the data saved in the database.
     * @param {CallLogCreateManyAndReturnArgs} args - Arguments to create many CallLogs.
     * @example
     * // Create many CallLogs
     * const callLog = await prisma.callLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CallLogs and only return the `id`
     * const callLogWithIdOnly = await prisma.callLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CallLogCreateManyAndReturnArgs>(args?: SelectSubset<T, CallLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CallLog.
     * @param {CallLogDeleteArgs} args - Arguments to delete one CallLog.
     * @example
     * // Delete one CallLog
     * const CallLog = await prisma.callLog.delete({
     *   where: {
     *     // ... filter to delete one CallLog
     *   }
     * })
     * 
     */
    delete<T extends CallLogDeleteArgs>(args: SelectSubset<T, CallLogDeleteArgs<ExtArgs>>): Prisma__CallLogClient<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CallLog.
     * @param {CallLogUpdateArgs} args - Arguments to update one CallLog.
     * @example
     * // Update one CallLog
     * const callLog = await prisma.callLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CallLogUpdateArgs>(args: SelectSubset<T, CallLogUpdateArgs<ExtArgs>>): Prisma__CallLogClient<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CallLogs.
     * @param {CallLogDeleteManyArgs} args - Arguments to filter CallLogs to delete.
     * @example
     * // Delete a few CallLogs
     * const { count } = await prisma.callLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CallLogDeleteManyArgs>(args?: SelectSubset<T, CallLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CallLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CallLogs
     * const callLog = await prisma.callLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CallLogUpdateManyArgs>(args: SelectSubset<T, CallLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CallLogs and returns the data updated in the database.
     * @param {CallLogUpdateManyAndReturnArgs} args - Arguments to update many CallLogs.
     * @example
     * // Update many CallLogs
     * const callLog = await prisma.callLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CallLogs and only return the `id`
     * const callLogWithIdOnly = await prisma.callLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CallLogUpdateManyAndReturnArgs>(args: SelectSubset<T, CallLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CallLog.
     * @param {CallLogUpsertArgs} args - Arguments to update or create a CallLog.
     * @example
     * // Update or create a CallLog
     * const callLog = await prisma.callLog.upsert({
     *   create: {
     *     // ... data to create a CallLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CallLog we want to update
     *   }
     * })
     */
    upsert<T extends CallLogUpsertArgs>(args: SelectSubset<T, CallLogUpsertArgs<ExtArgs>>): Prisma__CallLogClient<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CallLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallLogCountArgs} args - Arguments to filter CallLogs to count.
     * @example
     * // Count the number of CallLogs
     * const count = await prisma.callLog.count({
     *   where: {
     *     // ... the filter for the CallLogs we want to count
     *   }
     * })
    **/
    count<T extends CallLogCountArgs>(
      args?: Subset<T, CallLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CallLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CallLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CallLogAggregateArgs>(args: Subset<T, CallLogAggregateArgs>): Prisma.PrismaPromise<GetCallLogAggregateType<T>>

    /**
     * Group by CallLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CallLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CallLogGroupByArgs['orderBy'] }
        : { orderBy?: CallLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CallLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCallLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CallLog model
   */
  readonly fields: CallLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CallLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CallLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contact<T extends ContactDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContactDefaultArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    seller<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CallLog model
   */
  interface CallLogFieldRefs {
    readonly id: FieldRef<"CallLog", 'String'>
    readonly contact_id: FieldRef<"CallLog", 'String'>
    readonly seller_id: FieldRef<"CallLog", 'String'>
    readonly duration: FieldRef<"CallLog", 'Int'>
    readonly summary: FieldRef<"CallLog", 'String'>
    readonly date: FieldRef<"CallLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CallLog findUnique
   */
  export type CallLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    /**
     * Filter, which CallLog to fetch.
     */
    where: CallLogWhereUniqueInput
  }

  /**
   * CallLog findUniqueOrThrow
   */
  export type CallLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    /**
     * Filter, which CallLog to fetch.
     */
    where: CallLogWhereUniqueInput
  }

  /**
   * CallLog findFirst
   */
  export type CallLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    /**
     * Filter, which CallLog to fetch.
     */
    where?: CallLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CallLogs to fetch.
     */
    orderBy?: CallLogOrderByWithRelationInput | CallLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CallLogs.
     */
    cursor?: CallLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CallLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CallLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CallLogs.
     */
    distinct?: CallLogScalarFieldEnum | CallLogScalarFieldEnum[]
  }

  /**
   * CallLog findFirstOrThrow
   */
  export type CallLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    /**
     * Filter, which CallLog to fetch.
     */
    where?: CallLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CallLogs to fetch.
     */
    orderBy?: CallLogOrderByWithRelationInput | CallLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CallLogs.
     */
    cursor?: CallLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CallLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CallLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CallLogs.
     */
    distinct?: CallLogScalarFieldEnum | CallLogScalarFieldEnum[]
  }

  /**
   * CallLog findMany
   */
  export type CallLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    /**
     * Filter, which CallLogs to fetch.
     */
    where?: CallLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CallLogs to fetch.
     */
    orderBy?: CallLogOrderByWithRelationInput | CallLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CallLogs.
     */
    cursor?: CallLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CallLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CallLogs.
     */
    skip?: number
    distinct?: CallLogScalarFieldEnum | CallLogScalarFieldEnum[]
  }

  /**
   * CallLog create
   */
  export type CallLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    /**
     * The data needed to create a CallLog.
     */
    data: XOR<CallLogCreateInput, CallLogUncheckedCreateInput>
  }

  /**
   * CallLog createMany
   */
  export type CallLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CallLogs.
     */
    data: CallLogCreateManyInput | CallLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CallLog createManyAndReturn
   */
  export type CallLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * The data used to create many CallLogs.
     */
    data: CallLogCreateManyInput | CallLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CallLog update
   */
  export type CallLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    /**
     * The data needed to update a CallLog.
     */
    data: XOR<CallLogUpdateInput, CallLogUncheckedUpdateInput>
    /**
     * Choose, which CallLog to update.
     */
    where: CallLogWhereUniqueInput
  }

  /**
   * CallLog updateMany
   */
  export type CallLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CallLogs.
     */
    data: XOR<CallLogUpdateManyMutationInput, CallLogUncheckedUpdateManyInput>
    /**
     * Filter which CallLogs to update
     */
    where?: CallLogWhereInput
    /**
     * Limit how many CallLogs to update.
     */
    limit?: number
  }

  /**
   * CallLog updateManyAndReturn
   */
  export type CallLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * The data used to update CallLogs.
     */
    data: XOR<CallLogUpdateManyMutationInput, CallLogUncheckedUpdateManyInput>
    /**
     * Filter which CallLogs to update
     */
    where?: CallLogWhereInput
    /**
     * Limit how many CallLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CallLog upsert
   */
  export type CallLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    /**
     * The filter to search for the CallLog to update in case it exists.
     */
    where: CallLogWhereUniqueInput
    /**
     * In case the CallLog found by the `where` argument doesn't exist, create a new CallLog with this data.
     */
    create: XOR<CallLogCreateInput, CallLogUncheckedCreateInput>
    /**
     * In case the CallLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CallLogUpdateInput, CallLogUncheckedUpdateInput>
  }

  /**
   * CallLog delete
   */
  export type CallLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    /**
     * Filter which CallLog to delete.
     */
    where: CallLogWhereUniqueInput
  }

  /**
   * CallLog deleteMany
   */
  export type CallLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CallLogs to delete
     */
    where?: CallLogWhereInput
    /**
     * Limit how many CallLogs to delete.
     */
    limit?: number
  }

  /**
   * CallLog without action
   */
  export type CallLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
  }


  /**
   * Model ContactFile
   */

  export type AggregateContactFile = {
    _count: ContactFileCountAggregateOutputType | null
    _min: ContactFileMinAggregateOutputType | null
    _max: ContactFileMaxAggregateOutputType | null
  }

  export type ContactFileMinAggregateOutputType = {
    id: string | null
    contact_id: string | null
    name: string | null
    url: string | null
    type: string | null
    created_at: Date | null
  }

  export type ContactFileMaxAggregateOutputType = {
    id: string | null
    contact_id: string | null
    name: string | null
    url: string | null
    type: string | null
    created_at: Date | null
  }

  export type ContactFileCountAggregateOutputType = {
    id: number
    contact_id: number
    name: number
    url: number
    type: number
    created_at: number
    _all: number
  }


  export type ContactFileMinAggregateInputType = {
    id?: true
    contact_id?: true
    name?: true
    url?: true
    type?: true
    created_at?: true
  }

  export type ContactFileMaxAggregateInputType = {
    id?: true
    contact_id?: true
    name?: true
    url?: true
    type?: true
    created_at?: true
  }

  export type ContactFileCountAggregateInputType = {
    id?: true
    contact_id?: true
    name?: true
    url?: true
    type?: true
    created_at?: true
    _all?: true
  }

  export type ContactFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactFile to aggregate.
     */
    where?: ContactFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactFiles to fetch.
     */
    orderBy?: ContactFileOrderByWithRelationInput | ContactFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContactFiles
    **/
    _count?: true | ContactFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactFileMaxAggregateInputType
  }

  export type GetContactFileAggregateType<T extends ContactFileAggregateArgs> = {
        [P in keyof T & keyof AggregateContactFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContactFile[P]>
      : GetScalarType<T[P], AggregateContactFile[P]>
  }




  export type ContactFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactFileWhereInput
    orderBy?: ContactFileOrderByWithAggregationInput | ContactFileOrderByWithAggregationInput[]
    by: ContactFileScalarFieldEnum[] | ContactFileScalarFieldEnum
    having?: ContactFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactFileCountAggregateInputType | true
    _min?: ContactFileMinAggregateInputType
    _max?: ContactFileMaxAggregateInputType
  }

  export type ContactFileGroupByOutputType = {
    id: string
    contact_id: string
    name: string
    url: string
    type: string | null
    created_at: Date
    _count: ContactFileCountAggregateOutputType | null
    _min: ContactFileMinAggregateOutputType | null
    _max: ContactFileMaxAggregateOutputType | null
  }

  type GetContactFileGroupByPayload<T extends ContactFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactFileGroupByOutputType[P]>
            : GetScalarType<T[P], ContactFileGroupByOutputType[P]>
        }
      >
    >


  export type ContactFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contact_id?: boolean
    name?: boolean
    url?: boolean
    type?: boolean
    created_at?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contactFile"]>

  export type ContactFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contact_id?: boolean
    name?: boolean
    url?: boolean
    type?: boolean
    created_at?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contactFile"]>

  export type ContactFileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contact_id?: boolean
    name?: boolean
    url?: boolean
    type?: boolean
    created_at?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contactFile"]>

  export type ContactFileSelectScalar = {
    id?: boolean
    contact_id?: boolean
    name?: boolean
    url?: boolean
    type?: boolean
    created_at?: boolean
  }

  export type ContactFileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "contact_id" | "name" | "url" | "type" | "created_at", ExtArgs["result"]["contactFile"]>
  export type ContactFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }
  export type ContactFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }
  export type ContactFileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }

  export type $ContactFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContactFile"
    objects: {
      contact: Prisma.$ContactPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      contact_id: string
      name: string
      url: string
      type: string | null
      created_at: Date
    }, ExtArgs["result"]["contactFile"]>
    composites: {}
  }

  type ContactFileGetPayload<S extends boolean | null | undefined | ContactFileDefaultArgs> = $Result.GetResult<Prisma.$ContactFilePayload, S>

  type ContactFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContactFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContactFileCountAggregateInputType | true
    }

  export interface ContactFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContactFile'], meta: { name: 'ContactFile' } }
    /**
     * Find zero or one ContactFile that matches the filter.
     * @param {ContactFileFindUniqueArgs} args - Arguments to find a ContactFile
     * @example
     * // Get one ContactFile
     * const contactFile = await prisma.contactFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactFileFindUniqueArgs>(args: SelectSubset<T, ContactFileFindUniqueArgs<ExtArgs>>): Prisma__ContactFileClient<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContactFile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactFileFindUniqueOrThrowArgs} args - Arguments to find a ContactFile
     * @example
     * // Get one ContactFile
     * const contactFile = await prisma.contactFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactFileFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactFileClient<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFileFindFirstArgs} args - Arguments to find a ContactFile
     * @example
     * // Get one ContactFile
     * const contactFile = await prisma.contactFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactFileFindFirstArgs>(args?: SelectSubset<T, ContactFileFindFirstArgs<ExtArgs>>): Prisma__ContactFileClient<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFileFindFirstOrThrowArgs} args - Arguments to find a ContactFile
     * @example
     * // Get one ContactFile
     * const contactFile = await prisma.contactFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactFileFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactFileClient<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContactFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContactFiles
     * const contactFiles = await prisma.contactFile.findMany()
     * 
     * // Get first 10 ContactFiles
     * const contactFiles = await prisma.contactFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactFileWithIdOnly = await prisma.contactFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactFileFindManyArgs>(args?: SelectSubset<T, ContactFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContactFile.
     * @param {ContactFileCreateArgs} args - Arguments to create a ContactFile.
     * @example
     * // Create one ContactFile
     * const ContactFile = await prisma.contactFile.create({
     *   data: {
     *     // ... data to create a ContactFile
     *   }
     * })
     * 
     */
    create<T extends ContactFileCreateArgs>(args: SelectSubset<T, ContactFileCreateArgs<ExtArgs>>): Prisma__ContactFileClient<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContactFiles.
     * @param {ContactFileCreateManyArgs} args - Arguments to create many ContactFiles.
     * @example
     * // Create many ContactFiles
     * const contactFile = await prisma.contactFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactFileCreateManyArgs>(args?: SelectSubset<T, ContactFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContactFiles and returns the data saved in the database.
     * @param {ContactFileCreateManyAndReturnArgs} args - Arguments to create many ContactFiles.
     * @example
     * // Create many ContactFiles
     * const contactFile = await prisma.contactFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContactFiles and only return the `id`
     * const contactFileWithIdOnly = await prisma.contactFile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContactFileCreateManyAndReturnArgs>(args?: SelectSubset<T, ContactFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContactFile.
     * @param {ContactFileDeleteArgs} args - Arguments to delete one ContactFile.
     * @example
     * // Delete one ContactFile
     * const ContactFile = await prisma.contactFile.delete({
     *   where: {
     *     // ... filter to delete one ContactFile
     *   }
     * })
     * 
     */
    delete<T extends ContactFileDeleteArgs>(args: SelectSubset<T, ContactFileDeleteArgs<ExtArgs>>): Prisma__ContactFileClient<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContactFile.
     * @param {ContactFileUpdateArgs} args - Arguments to update one ContactFile.
     * @example
     * // Update one ContactFile
     * const contactFile = await prisma.contactFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactFileUpdateArgs>(args: SelectSubset<T, ContactFileUpdateArgs<ExtArgs>>): Prisma__ContactFileClient<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContactFiles.
     * @param {ContactFileDeleteManyArgs} args - Arguments to filter ContactFiles to delete.
     * @example
     * // Delete a few ContactFiles
     * const { count } = await prisma.contactFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactFileDeleteManyArgs>(args?: SelectSubset<T, ContactFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContactFiles
     * const contactFile = await prisma.contactFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactFileUpdateManyArgs>(args: SelectSubset<T, ContactFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactFiles and returns the data updated in the database.
     * @param {ContactFileUpdateManyAndReturnArgs} args - Arguments to update many ContactFiles.
     * @example
     * // Update many ContactFiles
     * const contactFile = await prisma.contactFile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContactFiles and only return the `id`
     * const contactFileWithIdOnly = await prisma.contactFile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContactFileUpdateManyAndReturnArgs>(args: SelectSubset<T, ContactFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContactFile.
     * @param {ContactFileUpsertArgs} args - Arguments to update or create a ContactFile.
     * @example
     * // Update or create a ContactFile
     * const contactFile = await prisma.contactFile.upsert({
     *   create: {
     *     // ... data to create a ContactFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContactFile we want to update
     *   }
     * })
     */
    upsert<T extends ContactFileUpsertArgs>(args: SelectSubset<T, ContactFileUpsertArgs<ExtArgs>>): Prisma__ContactFileClient<$Result.GetResult<Prisma.$ContactFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContactFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFileCountArgs} args - Arguments to filter ContactFiles to count.
     * @example
     * // Count the number of ContactFiles
     * const count = await prisma.contactFile.count({
     *   where: {
     *     // ... the filter for the ContactFiles we want to count
     *   }
     * })
    **/
    count<T extends ContactFileCountArgs>(
      args?: Subset<T, ContactFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContactFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContactFileAggregateArgs>(args: Subset<T, ContactFileAggregateArgs>): Prisma.PrismaPromise<GetContactFileAggregateType<T>>

    /**
     * Group by ContactFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContactFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactFileGroupByArgs['orderBy'] }
        : { orderBy?: ContactFileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContactFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContactFile model
   */
  readonly fields: ContactFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContactFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contact<T extends ContactDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContactDefaultArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContactFile model
   */
  interface ContactFileFieldRefs {
    readonly id: FieldRef<"ContactFile", 'String'>
    readonly contact_id: FieldRef<"ContactFile", 'String'>
    readonly name: FieldRef<"ContactFile", 'String'>
    readonly url: FieldRef<"ContactFile", 'String'>
    readonly type: FieldRef<"ContactFile", 'String'>
    readonly created_at: FieldRef<"ContactFile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContactFile findUnique
   */
  export type ContactFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    /**
     * Filter, which ContactFile to fetch.
     */
    where: ContactFileWhereUniqueInput
  }

  /**
   * ContactFile findUniqueOrThrow
   */
  export type ContactFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    /**
     * Filter, which ContactFile to fetch.
     */
    where: ContactFileWhereUniqueInput
  }

  /**
   * ContactFile findFirst
   */
  export type ContactFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    /**
     * Filter, which ContactFile to fetch.
     */
    where?: ContactFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactFiles to fetch.
     */
    orderBy?: ContactFileOrderByWithRelationInput | ContactFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactFiles.
     */
    cursor?: ContactFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactFiles.
     */
    distinct?: ContactFileScalarFieldEnum | ContactFileScalarFieldEnum[]
  }

  /**
   * ContactFile findFirstOrThrow
   */
  export type ContactFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    /**
     * Filter, which ContactFile to fetch.
     */
    where?: ContactFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactFiles to fetch.
     */
    orderBy?: ContactFileOrderByWithRelationInput | ContactFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactFiles.
     */
    cursor?: ContactFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactFiles.
     */
    distinct?: ContactFileScalarFieldEnum | ContactFileScalarFieldEnum[]
  }

  /**
   * ContactFile findMany
   */
  export type ContactFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    /**
     * Filter, which ContactFiles to fetch.
     */
    where?: ContactFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactFiles to fetch.
     */
    orderBy?: ContactFileOrderByWithRelationInput | ContactFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContactFiles.
     */
    cursor?: ContactFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactFiles.
     */
    skip?: number
    distinct?: ContactFileScalarFieldEnum | ContactFileScalarFieldEnum[]
  }

  /**
   * ContactFile create
   */
  export type ContactFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    /**
     * The data needed to create a ContactFile.
     */
    data: XOR<ContactFileCreateInput, ContactFileUncheckedCreateInput>
  }

  /**
   * ContactFile createMany
   */
  export type ContactFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContactFiles.
     */
    data: ContactFileCreateManyInput | ContactFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactFile createManyAndReturn
   */
  export type ContactFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * The data used to create many ContactFiles.
     */
    data: ContactFileCreateManyInput | ContactFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContactFile update
   */
  export type ContactFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    /**
     * The data needed to update a ContactFile.
     */
    data: XOR<ContactFileUpdateInput, ContactFileUncheckedUpdateInput>
    /**
     * Choose, which ContactFile to update.
     */
    where: ContactFileWhereUniqueInput
  }

  /**
   * ContactFile updateMany
   */
  export type ContactFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContactFiles.
     */
    data: XOR<ContactFileUpdateManyMutationInput, ContactFileUncheckedUpdateManyInput>
    /**
     * Filter which ContactFiles to update
     */
    where?: ContactFileWhereInput
    /**
     * Limit how many ContactFiles to update.
     */
    limit?: number
  }

  /**
   * ContactFile updateManyAndReturn
   */
  export type ContactFileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * The data used to update ContactFiles.
     */
    data: XOR<ContactFileUpdateManyMutationInput, ContactFileUncheckedUpdateManyInput>
    /**
     * Filter which ContactFiles to update
     */
    where?: ContactFileWhereInput
    /**
     * Limit how many ContactFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContactFile upsert
   */
  export type ContactFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    /**
     * The filter to search for the ContactFile to update in case it exists.
     */
    where: ContactFileWhereUniqueInput
    /**
     * In case the ContactFile found by the `where` argument doesn't exist, create a new ContactFile with this data.
     */
    create: XOR<ContactFileCreateInput, ContactFileUncheckedCreateInput>
    /**
     * In case the ContactFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactFileUpdateInput, ContactFileUncheckedUpdateInput>
  }

  /**
   * ContactFile delete
   */
  export type ContactFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
    /**
     * Filter which ContactFile to delete.
     */
    where: ContactFileWhereUniqueInput
  }

  /**
   * ContactFile deleteMany
   */
  export type ContactFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactFiles to delete
     */
    where?: ContactFileWhereInput
    /**
     * Limit how many ContactFiles to delete.
     */
    limit?: number
  }

  /**
   * ContactFile without action
   */
  export type ContactFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactFile
     */
    select?: ContactFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactFile
     */
    omit?: ContactFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactFileInclude<ExtArgs> | null
  }


  /**
   * Model Reservation
   */

  export type AggregateReservation = {
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  export type ReservationAvgAggregateOutputType = {
    lot_id: number | null
    installments_paid: number | null
  }

  export type ReservationSumAggregateOutputType = {
    lot_id: number | null
    installments_paid: number | null
  }

  export type ReservationMinAggregateOutputType = {
    id: string | null
    lot_id: number | null
    name: string | null
    email: string | null
    phone: string | null
    rut: string | null
    address: string | null
    folio: string | null
    status: string | null
    session_id: string | null
    expires_at: Date | null
    created_at: Date | null
    marital_status: string | null
    profession: string | null
    nationality: string | null
    pipeline_stage: string | null
    notes: string | null
    uploaded_contract_url: string | null
    address_street: string | null
    address_number: string | null
    address_commune: string | null
    address_region: string | null
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
    utm_content: string | null
    utm_term: string | null
    pie_status: string | null
    installments_paid: number | null
    signature_otp: string | null
    signature_otp_expires: Date | null
    signed_at: Date | null
    signature_ip: string | null
    promesa_signature_otp: string | null
    promesa_signature_otp_expires: Date | null
    promesa_signed_at: Date | null
    promesa_signature_ip: string | null
    contact_id: string | null
    seller_id: string | null
    buyer_id: string | null
  }

  export type ReservationMaxAggregateOutputType = {
    id: string | null
    lot_id: number | null
    name: string | null
    email: string | null
    phone: string | null
    rut: string | null
    address: string | null
    folio: string | null
    status: string | null
    session_id: string | null
    expires_at: Date | null
    created_at: Date | null
    marital_status: string | null
    profession: string | null
    nationality: string | null
    pipeline_stage: string | null
    notes: string | null
    uploaded_contract_url: string | null
    address_street: string | null
    address_number: string | null
    address_commune: string | null
    address_region: string | null
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
    utm_content: string | null
    utm_term: string | null
    pie_status: string | null
    installments_paid: number | null
    signature_otp: string | null
    signature_otp_expires: Date | null
    signed_at: Date | null
    signature_ip: string | null
    promesa_signature_otp: string | null
    promesa_signature_otp_expires: Date | null
    promesa_signed_at: Date | null
    promesa_signature_ip: string | null
    contact_id: string | null
    seller_id: string | null
    buyer_id: string | null
  }

  export type ReservationCountAggregateOutputType = {
    id: number
    lot_id: number
    name: number
    email: number
    phone: number
    rut: number
    address: number
    folio: number
    status: number
    session_id: number
    expires_at: number
    created_at: number
    marital_status: number
    profession: number
    nationality: number
    pipeline_stage: number
    notes: number
    uploaded_contract_url: number
    address_street: number
    address_number: number
    address_commune: number
    address_region: number
    utm_source: number
    utm_medium: number
    utm_campaign: number
    utm_content: number
    utm_term: number
    pie_status: number
    installments_paid: number
    signature_otp: number
    signature_otp_expires: number
    signed_at: number
    signature_ip: number
    promesa_signature_otp: number
    promesa_signature_otp_expires: number
    promesa_signed_at: number
    promesa_signature_ip: number
    contact_id: number
    seller_id: number
    buyer_id: number
    _all: number
  }


  export type ReservationAvgAggregateInputType = {
    lot_id?: true
    installments_paid?: true
  }

  export type ReservationSumAggregateInputType = {
    lot_id?: true
    installments_paid?: true
  }

  export type ReservationMinAggregateInputType = {
    id?: true
    lot_id?: true
    name?: true
    email?: true
    phone?: true
    rut?: true
    address?: true
    folio?: true
    status?: true
    session_id?: true
    expires_at?: true
    created_at?: true
    marital_status?: true
    profession?: true
    nationality?: true
    pipeline_stage?: true
    notes?: true
    uploaded_contract_url?: true
    address_street?: true
    address_number?: true
    address_commune?: true
    address_region?: true
    utm_source?: true
    utm_medium?: true
    utm_campaign?: true
    utm_content?: true
    utm_term?: true
    pie_status?: true
    installments_paid?: true
    signature_otp?: true
    signature_otp_expires?: true
    signed_at?: true
    signature_ip?: true
    promesa_signature_otp?: true
    promesa_signature_otp_expires?: true
    promesa_signed_at?: true
    promesa_signature_ip?: true
    contact_id?: true
    seller_id?: true
    buyer_id?: true
  }

  export type ReservationMaxAggregateInputType = {
    id?: true
    lot_id?: true
    name?: true
    email?: true
    phone?: true
    rut?: true
    address?: true
    folio?: true
    status?: true
    session_id?: true
    expires_at?: true
    created_at?: true
    marital_status?: true
    profession?: true
    nationality?: true
    pipeline_stage?: true
    notes?: true
    uploaded_contract_url?: true
    address_street?: true
    address_number?: true
    address_commune?: true
    address_region?: true
    utm_source?: true
    utm_medium?: true
    utm_campaign?: true
    utm_content?: true
    utm_term?: true
    pie_status?: true
    installments_paid?: true
    signature_otp?: true
    signature_otp_expires?: true
    signed_at?: true
    signature_ip?: true
    promesa_signature_otp?: true
    promesa_signature_otp_expires?: true
    promesa_signed_at?: true
    promesa_signature_ip?: true
    contact_id?: true
    seller_id?: true
    buyer_id?: true
  }

  export type ReservationCountAggregateInputType = {
    id?: true
    lot_id?: true
    name?: true
    email?: true
    phone?: true
    rut?: true
    address?: true
    folio?: true
    status?: true
    session_id?: true
    expires_at?: true
    created_at?: true
    marital_status?: true
    profession?: true
    nationality?: true
    pipeline_stage?: true
    notes?: true
    uploaded_contract_url?: true
    address_street?: true
    address_number?: true
    address_commune?: true
    address_region?: true
    utm_source?: true
    utm_medium?: true
    utm_campaign?: true
    utm_content?: true
    utm_term?: true
    pie_status?: true
    installments_paid?: true
    signature_otp?: true
    signature_otp_expires?: true
    signed_at?: true
    signature_ip?: true
    promesa_signature_otp?: true
    promesa_signature_otp_expires?: true
    promesa_signed_at?: true
    promesa_signature_ip?: true
    contact_id?: true
    seller_id?: true
    buyer_id?: true
    _all?: true
  }

  export type ReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservation to aggregate.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reservations
    **/
    _count?: true | ReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservationMaxAggregateInputType
  }

  export type GetReservationAggregateType<T extends ReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservation[P]>
      : GetScalarType<T[P], AggregateReservation[P]>
  }




  export type ReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithAggregationInput | ReservationOrderByWithAggregationInput[]
    by: ReservationScalarFieldEnum[] | ReservationScalarFieldEnum
    having?: ReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservationCountAggregateInputType | true
    _avg?: ReservationAvgAggregateInputType
    _sum?: ReservationSumAggregateInputType
    _min?: ReservationMinAggregateInputType
    _max?: ReservationMaxAggregateInputType
  }

  export type ReservationGroupByOutputType = {
    id: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut: string | null
    address: string | null
    folio: string | null
    status: string
    session_id: string | null
    expires_at: Date | null
    created_at: Date
    marital_status: string | null
    profession: string | null
    nationality: string | null
    pipeline_stage: string
    notes: string | null
    uploaded_contract_url: string | null
    address_street: string | null
    address_number: string | null
    address_commune: string | null
    address_region: string | null
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
    utm_content: string | null
    utm_term: string | null
    pie_status: string | null
    installments_paid: number | null
    signature_otp: string | null
    signature_otp_expires: Date | null
    signed_at: Date | null
    signature_ip: string | null
    promesa_signature_otp: string | null
    promesa_signature_otp_expires: Date | null
    promesa_signed_at: Date | null
    promesa_signature_ip: string | null
    contact_id: string | null
    seller_id: string | null
    buyer_id: string | null
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  type GetReservationGroupByPayload<T extends ReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservationGroupByOutputType[P]>
            : GetScalarType<T[P], ReservationGroupByOutputType[P]>
        }
      >
    >


  export type ReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lot_id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    rut?: boolean
    address?: boolean
    folio?: boolean
    status?: boolean
    session_id?: boolean
    expires_at?: boolean
    created_at?: boolean
    marital_status?: boolean
    profession?: boolean
    nationality?: boolean
    pipeline_stage?: boolean
    notes?: boolean
    uploaded_contract_url?: boolean
    address_street?: boolean
    address_number?: boolean
    address_commune?: boolean
    address_region?: boolean
    utm_source?: boolean
    utm_medium?: boolean
    utm_campaign?: boolean
    utm_content?: boolean
    utm_term?: boolean
    pie_status?: boolean
    installments_paid?: boolean
    signature_otp?: boolean
    signature_otp_expires?: boolean
    signed_at?: boolean
    signature_ip?: boolean
    promesa_signature_otp?: boolean
    promesa_signature_otp_expires?: boolean
    promesa_signed_at?: boolean
    promesa_signature_ip?: boolean
    contact_id?: boolean
    seller_id?: boolean
    buyer_id?: boolean
    contact?: boolean | Reservation$contactArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
    transactions?: boolean | Reservation$transactionsArgs<ExtArgs>
    seller?: boolean | Reservation$sellerArgs<ExtArgs>
    buyer?: boolean | Reservation$buyerArgs<ExtArgs>
    _count?: boolean | ReservationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lot_id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    rut?: boolean
    address?: boolean
    folio?: boolean
    status?: boolean
    session_id?: boolean
    expires_at?: boolean
    created_at?: boolean
    marital_status?: boolean
    profession?: boolean
    nationality?: boolean
    pipeline_stage?: boolean
    notes?: boolean
    uploaded_contract_url?: boolean
    address_street?: boolean
    address_number?: boolean
    address_commune?: boolean
    address_region?: boolean
    utm_source?: boolean
    utm_medium?: boolean
    utm_campaign?: boolean
    utm_content?: boolean
    utm_term?: boolean
    pie_status?: boolean
    installments_paid?: boolean
    signature_otp?: boolean
    signature_otp_expires?: boolean
    signed_at?: boolean
    signature_ip?: boolean
    promesa_signature_otp?: boolean
    promesa_signature_otp_expires?: boolean
    promesa_signed_at?: boolean
    promesa_signature_ip?: boolean
    contact_id?: boolean
    seller_id?: boolean
    buyer_id?: boolean
    contact?: boolean | Reservation$contactArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
    seller?: boolean | Reservation$sellerArgs<ExtArgs>
    buyer?: boolean | Reservation$buyerArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lot_id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    rut?: boolean
    address?: boolean
    folio?: boolean
    status?: boolean
    session_id?: boolean
    expires_at?: boolean
    created_at?: boolean
    marital_status?: boolean
    profession?: boolean
    nationality?: boolean
    pipeline_stage?: boolean
    notes?: boolean
    uploaded_contract_url?: boolean
    address_street?: boolean
    address_number?: boolean
    address_commune?: boolean
    address_region?: boolean
    utm_source?: boolean
    utm_medium?: boolean
    utm_campaign?: boolean
    utm_content?: boolean
    utm_term?: boolean
    pie_status?: boolean
    installments_paid?: boolean
    signature_otp?: boolean
    signature_otp_expires?: boolean
    signed_at?: boolean
    signature_ip?: boolean
    promesa_signature_otp?: boolean
    promesa_signature_otp_expires?: boolean
    promesa_signed_at?: boolean
    promesa_signature_ip?: boolean
    contact_id?: boolean
    seller_id?: boolean
    buyer_id?: boolean
    contact?: boolean | Reservation$contactArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
    seller?: boolean | Reservation$sellerArgs<ExtArgs>
    buyer?: boolean | Reservation$buyerArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectScalar = {
    id?: boolean
    lot_id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    rut?: boolean
    address?: boolean
    folio?: boolean
    status?: boolean
    session_id?: boolean
    expires_at?: boolean
    created_at?: boolean
    marital_status?: boolean
    profession?: boolean
    nationality?: boolean
    pipeline_stage?: boolean
    notes?: boolean
    uploaded_contract_url?: boolean
    address_street?: boolean
    address_number?: boolean
    address_commune?: boolean
    address_region?: boolean
    utm_source?: boolean
    utm_medium?: boolean
    utm_campaign?: boolean
    utm_content?: boolean
    utm_term?: boolean
    pie_status?: boolean
    installments_paid?: boolean
    signature_otp?: boolean
    signature_otp_expires?: boolean
    signed_at?: boolean
    signature_ip?: boolean
    promesa_signature_otp?: boolean
    promesa_signature_otp_expires?: boolean
    promesa_signed_at?: boolean
    promesa_signature_ip?: boolean
    contact_id?: boolean
    seller_id?: boolean
    buyer_id?: boolean
  }

  export type ReservationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lot_id" | "name" | "email" | "phone" | "rut" | "address" | "folio" | "status" | "session_id" | "expires_at" | "created_at" | "marital_status" | "profession" | "nationality" | "pipeline_stage" | "notes" | "uploaded_contract_url" | "address_street" | "address_number" | "address_commune" | "address_region" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "pie_status" | "installments_paid" | "signature_otp" | "signature_otp_expires" | "signed_at" | "signature_ip" | "promesa_signature_otp" | "promesa_signature_otp_expires" | "promesa_signed_at" | "promesa_signature_ip" | "contact_id" | "seller_id" | "buyer_id", ExtArgs["result"]["reservation"]>
  export type ReservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | Reservation$contactArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
    transactions?: boolean | Reservation$transactionsArgs<ExtArgs>
    seller?: boolean | Reservation$sellerArgs<ExtArgs>
    buyer?: boolean | Reservation$buyerArgs<ExtArgs>
    _count?: boolean | ReservationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ReservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | Reservation$contactArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
    seller?: boolean | Reservation$sellerArgs<ExtArgs>
    buyer?: boolean | Reservation$buyerArgs<ExtArgs>
  }
  export type ReservationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | Reservation$contactArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
    seller?: boolean | Reservation$sellerArgs<ExtArgs>
    buyer?: boolean | Reservation$buyerArgs<ExtArgs>
  }

  export type $ReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reservation"
    objects: {
      contact: Prisma.$ContactPayload<ExtArgs> | null
      lot: Prisma.$LotPayload<ExtArgs>
      transactions: Prisma.$WebpayTransactionPayload<ExtArgs>[]
      seller: Prisma.$UserPayload<ExtArgs> | null
      buyer: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lot_id: number
      name: string
      email: string
      phone: string
      rut: string | null
      address: string | null
      folio: string | null
      status: string
      session_id: string | null
      expires_at: Date | null
      created_at: Date
      marital_status: string | null
      profession: string | null
      nationality: string | null
      pipeline_stage: string
      notes: string | null
      uploaded_contract_url: string | null
      address_street: string | null
      address_number: string | null
      address_commune: string | null
      address_region: string | null
      utm_source: string | null
      utm_medium: string | null
      utm_campaign: string | null
      utm_content: string | null
      utm_term: string | null
      pie_status: string | null
      installments_paid: number | null
      signature_otp: string | null
      signature_otp_expires: Date | null
      signed_at: Date | null
      signature_ip: string | null
      promesa_signature_otp: string | null
      promesa_signature_otp_expires: Date | null
      promesa_signed_at: Date | null
      promesa_signature_ip: string | null
      contact_id: string | null
      seller_id: string | null
      buyer_id: string | null
    }, ExtArgs["result"]["reservation"]>
    composites: {}
  }

  type ReservationGetPayload<S extends boolean | null | undefined | ReservationDefaultArgs> = $Result.GetResult<Prisma.$ReservationPayload, S>

  type ReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReservationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReservationCountAggregateInputType | true
    }

  export interface ReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reservation'], meta: { name: 'Reservation' } }
    /**
     * Find zero or one Reservation that matches the filter.
     * @param {ReservationFindUniqueArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservationFindUniqueArgs>(args: SelectSubset<T, ReservationFindUniqueArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reservation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReservationFindUniqueOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservationFindFirstArgs>(args?: SelectSubset<T, ReservationFindFirstArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reservations
     * const reservations = await prisma.reservation.findMany()
     * 
     * // Get first 10 Reservations
     * const reservations = await prisma.reservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservationWithIdOnly = await prisma.reservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservationFindManyArgs>(args?: SelectSubset<T, ReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reservation.
     * @param {ReservationCreateArgs} args - Arguments to create a Reservation.
     * @example
     * // Create one Reservation
     * const Reservation = await prisma.reservation.create({
     *   data: {
     *     // ... data to create a Reservation
     *   }
     * })
     * 
     */
    create<T extends ReservationCreateArgs>(args: SelectSubset<T, ReservationCreateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reservations.
     * @param {ReservationCreateManyArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservationCreateManyArgs>(args?: SelectSubset<T, ReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reservations and returns the data saved in the database.
     * @param {ReservationCreateManyAndReturnArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reservations and only return the `id`
     * const reservationWithIdOnly = await prisma.reservation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reservation.
     * @param {ReservationDeleteArgs} args - Arguments to delete one Reservation.
     * @example
     * // Delete one Reservation
     * const Reservation = await prisma.reservation.delete({
     *   where: {
     *     // ... filter to delete one Reservation
     *   }
     * })
     * 
     */
    delete<T extends ReservationDeleteArgs>(args: SelectSubset<T, ReservationDeleteArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reservation.
     * @param {ReservationUpdateArgs} args - Arguments to update one Reservation.
     * @example
     * // Update one Reservation
     * const reservation = await prisma.reservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservationUpdateArgs>(args: SelectSubset<T, ReservationUpdateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reservations.
     * @param {ReservationDeleteManyArgs} args - Arguments to filter Reservations to delete.
     * @example
     * // Delete a few Reservations
     * const { count } = await prisma.reservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservationDeleteManyArgs>(args?: SelectSubset<T, ReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservationUpdateManyArgs>(args: SelectSubset<T, ReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations and returns the data updated in the database.
     * @param {ReservationUpdateManyAndReturnArgs} args - Arguments to update many Reservations.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reservations and only return the `id`
     * const reservationWithIdOnly = await prisma.reservation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReservationUpdateManyAndReturnArgs>(args: SelectSubset<T, ReservationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reservation.
     * @param {ReservationUpsertArgs} args - Arguments to update or create a Reservation.
     * @example
     * // Update or create a Reservation
     * const reservation = await prisma.reservation.upsert({
     *   create: {
     *     // ... data to create a Reservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reservation we want to update
     *   }
     * })
     */
    upsert<T extends ReservationUpsertArgs>(args: SelectSubset<T, ReservationUpsertArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationCountArgs} args - Arguments to filter Reservations to count.
     * @example
     * // Count the number of Reservations
     * const count = await prisma.reservation.count({
     *   where: {
     *     // ... the filter for the Reservations we want to count
     *   }
     * })
    **/
    count<T extends ReservationCountArgs>(
      args?: Subset<T, ReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReservationAggregateArgs>(args: Subset<T, ReservationAggregateArgs>): Prisma.PrismaPromise<GetReservationAggregateType<T>>

    /**
     * Group by Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservationGroupByArgs['orderBy'] }
        : { orderBy?: ReservationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reservation model
   */
  readonly fields: ReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contact<T extends Reservation$contactArgs<ExtArgs> = {}>(args?: Subset<T, Reservation$contactArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    lot<T extends LotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LotDefaultArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    transactions<T extends Reservation$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Reservation$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    seller<T extends Reservation$sellerArgs<ExtArgs> = {}>(args?: Subset<T, Reservation$sellerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    buyer<T extends Reservation$buyerArgs<ExtArgs> = {}>(args?: Subset<T, Reservation$buyerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reservation model
   */
  interface ReservationFieldRefs {
    readonly id: FieldRef<"Reservation", 'String'>
    readonly lot_id: FieldRef<"Reservation", 'Int'>
    readonly name: FieldRef<"Reservation", 'String'>
    readonly email: FieldRef<"Reservation", 'String'>
    readonly phone: FieldRef<"Reservation", 'String'>
    readonly rut: FieldRef<"Reservation", 'String'>
    readonly address: FieldRef<"Reservation", 'String'>
    readonly folio: FieldRef<"Reservation", 'String'>
    readonly status: FieldRef<"Reservation", 'String'>
    readonly session_id: FieldRef<"Reservation", 'String'>
    readonly expires_at: FieldRef<"Reservation", 'DateTime'>
    readonly created_at: FieldRef<"Reservation", 'DateTime'>
    readonly marital_status: FieldRef<"Reservation", 'String'>
    readonly profession: FieldRef<"Reservation", 'String'>
    readonly nationality: FieldRef<"Reservation", 'String'>
    readonly pipeline_stage: FieldRef<"Reservation", 'String'>
    readonly notes: FieldRef<"Reservation", 'String'>
    readonly uploaded_contract_url: FieldRef<"Reservation", 'String'>
    readonly address_street: FieldRef<"Reservation", 'String'>
    readonly address_number: FieldRef<"Reservation", 'String'>
    readonly address_commune: FieldRef<"Reservation", 'String'>
    readonly address_region: FieldRef<"Reservation", 'String'>
    readonly utm_source: FieldRef<"Reservation", 'String'>
    readonly utm_medium: FieldRef<"Reservation", 'String'>
    readonly utm_campaign: FieldRef<"Reservation", 'String'>
    readonly utm_content: FieldRef<"Reservation", 'String'>
    readonly utm_term: FieldRef<"Reservation", 'String'>
    readonly pie_status: FieldRef<"Reservation", 'String'>
    readonly installments_paid: FieldRef<"Reservation", 'Int'>
    readonly signature_otp: FieldRef<"Reservation", 'String'>
    readonly signature_otp_expires: FieldRef<"Reservation", 'DateTime'>
    readonly signed_at: FieldRef<"Reservation", 'DateTime'>
    readonly signature_ip: FieldRef<"Reservation", 'String'>
    readonly promesa_signature_otp: FieldRef<"Reservation", 'String'>
    readonly promesa_signature_otp_expires: FieldRef<"Reservation", 'DateTime'>
    readonly promesa_signed_at: FieldRef<"Reservation", 'DateTime'>
    readonly promesa_signature_ip: FieldRef<"Reservation", 'String'>
    readonly contact_id: FieldRef<"Reservation", 'String'>
    readonly seller_id: FieldRef<"Reservation", 'String'>
    readonly buyer_id: FieldRef<"Reservation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Reservation findUnique
   */
  export type ReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findUniqueOrThrow
   */
  export type ReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findFirst
   */
  export type ReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findFirstOrThrow
   */
  export type ReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findMany
   */
  export type ReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservations to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation create
   */
  export type ReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The data needed to create a Reservation.
     */
    data: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
  }

  /**
   * Reservation createMany
   */
  export type ReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reservation createManyAndReturn
   */
  export type ReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reservation update
   */
  export type ReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The data needed to update a Reservation.
     */
    data: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
    /**
     * Choose, which Reservation to update.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation updateMany
   */
  export type ReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reservations.
     */
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyInput>
    /**
     * Filter which Reservations to update
     */
    where?: ReservationWhereInput
    /**
     * Limit how many Reservations to update.
     */
    limit?: number
  }

  /**
   * Reservation updateManyAndReturn
   */
  export type ReservationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * The data used to update Reservations.
     */
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyInput>
    /**
     * Filter which Reservations to update
     */
    where?: ReservationWhereInput
    /**
     * Limit how many Reservations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reservation upsert
   */
  export type ReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The filter to search for the Reservation to update in case it exists.
     */
    where: ReservationWhereUniqueInput
    /**
     * In case the Reservation found by the `where` argument doesn't exist, create a new Reservation with this data.
     */
    create: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
    /**
     * In case the Reservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
  }

  /**
   * Reservation delete
   */
  export type ReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter which Reservation to delete.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation deleteMany
   */
  export type ReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservations to delete
     */
    where?: ReservationWhereInput
    /**
     * Limit how many Reservations to delete.
     */
    limit?: number
  }

  /**
   * Reservation.contact
   */
  export type Reservation$contactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    where?: ContactWhereInput
  }

  /**
   * Reservation.transactions
   */
  export type Reservation$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    where?: WebpayTransactionWhereInput
    orderBy?: WebpayTransactionOrderByWithRelationInput | WebpayTransactionOrderByWithRelationInput[]
    cursor?: WebpayTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WebpayTransactionScalarFieldEnum | WebpayTransactionScalarFieldEnum[]
  }

  /**
   * Reservation.seller
   */
  export type Reservation$sellerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Reservation.buyer
   */
  export type Reservation$buyerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Reservation without action
   */
  export type ReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
  }


  /**
   * Model LotLock
   */

  export type AggregateLotLock = {
    _count: LotLockCountAggregateOutputType | null
    _avg: LotLockAvgAggregateOutputType | null
    _sum: LotLockSumAggregateOutputType | null
    _min: LotLockMinAggregateOutputType | null
    _max: LotLockMaxAggregateOutputType | null
  }

  export type LotLockAvgAggregateOutputType = {
    lot_id: number | null
  }

  export type LotLockSumAggregateOutputType = {
    lot_id: number | null
  }

  export type LotLockMinAggregateOutputType = {
    lot_id: number | null
    locked_by: string | null
    locked_until: Date | null
    created_at: Date | null
  }

  export type LotLockMaxAggregateOutputType = {
    lot_id: number | null
    locked_by: string | null
    locked_until: Date | null
    created_at: Date | null
  }

  export type LotLockCountAggregateOutputType = {
    lot_id: number
    locked_by: number
    locked_until: number
    created_at: number
    _all: number
  }


  export type LotLockAvgAggregateInputType = {
    lot_id?: true
  }

  export type LotLockSumAggregateInputType = {
    lot_id?: true
  }

  export type LotLockMinAggregateInputType = {
    lot_id?: true
    locked_by?: true
    locked_until?: true
    created_at?: true
  }

  export type LotLockMaxAggregateInputType = {
    lot_id?: true
    locked_by?: true
    locked_until?: true
    created_at?: true
  }

  export type LotLockCountAggregateInputType = {
    lot_id?: true
    locked_by?: true
    locked_until?: true
    created_at?: true
    _all?: true
  }

  export type LotLockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LotLock to aggregate.
     */
    where?: LotLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LotLocks to fetch.
     */
    orderBy?: LotLockOrderByWithRelationInput | LotLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LotLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LotLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LotLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LotLocks
    **/
    _count?: true | LotLockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LotLockAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LotLockSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LotLockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LotLockMaxAggregateInputType
  }

  export type GetLotLockAggregateType<T extends LotLockAggregateArgs> = {
        [P in keyof T & keyof AggregateLotLock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLotLock[P]>
      : GetScalarType<T[P], AggregateLotLock[P]>
  }




  export type LotLockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LotLockWhereInput
    orderBy?: LotLockOrderByWithAggregationInput | LotLockOrderByWithAggregationInput[]
    by: LotLockScalarFieldEnum[] | LotLockScalarFieldEnum
    having?: LotLockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LotLockCountAggregateInputType | true
    _avg?: LotLockAvgAggregateInputType
    _sum?: LotLockSumAggregateInputType
    _min?: LotLockMinAggregateInputType
    _max?: LotLockMaxAggregateInputType
  }

  export type LotLockGroupByOutputType = {
    lot_id: number
    locked_by: string
    locked_until: Date
    created_at: Date
    _count: LotLockCountAggregateOutputType | null
    _avg: LotLockAvgAggregateOutputType | null
    _sum: LotLockSumAggregateOutputType | null
    _min: LotLockMinAggregateOutputType | null
    _max: LotLockMaxAggregateOutputType | null
  }

  type GetLotLockGroupByPayload<T extends LotLockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LotLockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LotLockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LotLockGroupByOutputType[P]>
            : GetScalarType<T[P], LotLockGroupByOutputType[P]>
        }
      >
    >


  export type LotLockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    lot_id?: boolean
    locked_by?: boolean
    locked_until?: boolean
    created_at?: boolean
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lotLock"]>

  export type LotLockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    lot_id?: boolean
    locked_by?: boolean
    locked_until?: boolean
    created_at?: boolean
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lotLock"]>

  export type LotLockSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    lot_id?: boolean
    locked_by?: boolean
    locked_until?: boolean
    created_at?: boolean
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lotLock"]>

  export type LotLockSelectScalar = {
    lot_id?: boolean
    locked_by?: boolean
    locked_until?: boolean
    created_at?: boolean
  }

  export type LotLockOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"lot_id" | "locked_by" | "locked_until" | "created_at", ExtArgs["result"]["lotLock"]>
  export type LotLockInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }
  export type LotLockIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }
  export type LotLockIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }

  export type $LotLockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LotLock"
    objects: {
      lot: Prisma.$LotPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      lot_id: number
      locked_by: string
      locked_until: Date
      created_at: Date
    }, ExtArgs["result"]["lotLock"]>
    composites: {}
  }

  type LotLockGetPayload<S extends boolean | null | undefined | LotLockDefaultArgs> = $Result.GetResult<Prisma.$LotLockPayload, S>

  type LotLockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LotLockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LotLockCountAggregateInputType | true
    }

  export interface LotLockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LotLock'], meta: { name: 'LotLock' } }
    /**
     * Find zero or one LotLock that matches the filter.
     * @param {LotLockFindUniqueArgs} args - Arguments to find a LotLock
     * @example
     * // Get one LotLock
     * const lotLock = await prisma.lotLock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LotLockFindUniqueArgs>(args: SelectSubset<T, LotLockFindUniqueArgs<ExtArgs>>): Prisma__LotLockClient<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LotLock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LotLockFindUniqueOrThrowArgs} args - Arguments to find a LotLock
     * @example
     * // Get one LotLock
     * const lotLock = await prisma.lotLock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LotLockFindUniqueOrThrowArgs>(args: SelectSubset<T, LotLockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LotLockClient<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LotLock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotLockFindFirstArgs} args - Arguments to find a LotLock
     * @example
     * // Get one LotLock
     * const lotLock = await prisma.lotLock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LotLockFindFirstArgs>(args?: SelectSubset<T, LotLockFindFirstArgs<ExtArgs>>): Prisma__LotLockClient<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LotLock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotLockFindFirstOrThrowArgs} args - Arguments to find a LotLock
     * @example
     * // Get one LotLock
     * const lotLock = await prisma.lotLock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LotLockFindFirstOrThrowArgs>(args?: SelectSubset<T, LotLockFindFirstOrThrowArgs<ExtArgs>>): Prisma__LotLockClient<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LotLocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotLockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LotLocks
     * const lotLocks = await prisma.lotLock.findMany()
     * 
     * // Get first 10 LotLocks
     * const lotLocks = await prisma.lotLock.findMany({ take: 10 })
     * 
     * // Only select the `lot_id`
     * const lotLockWithLot_idOnly = await prisma.lotLock.findMany({ select: { lot_id: true } })
     * 
     */
    findMany<T extends LotLockFindManyArgs>(args?: SelectSubset<T, LotLockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LotLock.
     * @param {LotLockCreateArgs} args - Arguments to create a LotLock.
     * @example
     * // Create one LotLock
     * const LotLock = await prisma.lotLock.create({
     *   data: {
     *     // ... data to create a LotLock
     *   }
     * })
     * 
     */
    create<T extends LotLockCreateArgs>(args: SelectSubset<T, LotLockCreateArgs<ExtArgs>>): Prisma__LotLockClient<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LotLocks.
     * @param {LotLockCreateManyArgs} args - Arguments to create many LotLocks.
     * @example
     * // Create many LotLocks
     * const lotLock = await prisma.lotLock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LotLockCreateManyArgs>(args?: SelectSubset<T, LotLockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LotLocks and returns the data saved in the database.
     * @param {LotLockCreateManyAndReturnArgs} args - Arguments to create many LotLocks.
     * @example
     * // Create many LotLocks
     * const lotLock = await prisma.lotLock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LotLocks and only return the `lot_id`
     * const lotLockWithLot_idOnly = await prisma.lotLock.createManyAndReturn({
     *   select: { lot_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LotLockCreateManyAndReturnArgs>(args?: SelectSubset<T, LotLockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LotLock.
     * @param {LotLockDeleteArgs} args - Arguments to delete one LotLock.
     * @example
     * // Delete one LotLock
     * const LotLock = await prisma.lotLock.delete({
     *   where: {
     *     // ... filter to delete one LotLock
     *   }
     * })
     * 
     */
    delete<T extends LotLockDeleteArgs>(args: SelectSubset<T, LotLockDeleteArgs<ExtArgs>>): Prisma__LotLockClient<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LotLock.
     * @param {LotLockUpdateArgs} args - Arguments to update one LotLock.
     * @example
     * // Update one LotLock
     * const lotLock = await prisma.lotLock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LotLockUpdateArgs>(args: SelectSubset<T, LotLockUpdateArgs<ExtArgs>>): Prisma__LotLockClient<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LotLocks.
     * @param {LotLockDeleteManyArgs} args - Arguments to filter LotLocks to delete.
     * @example
     * // Delete a few LotLocks
     * const { count } = await prisma.lotLock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LotLockDeleteManyArgs>(args?: SelectSubset<T, LotLockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LotLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotLockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LotLocks
     * const lotLock = await prisma.lotLock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LotLockUpdateManyArgs>(args: SelectSubset<T, LotLockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LotLocks and returns the data updated in the database.
     * @param {LotLockUpdateManyAndReturnArgs} args - Arguments to update many LotLocks.
     * @example
     * // Update many LotLocks
     * const lotLock = await prisma.lotLock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LotLocks and only return the `lot_id`
     * const lotLockWithLot_idOnly = await prisma.lotLock.updateManyAndReturn({
     *   select: { lot_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LotLockUpdateManyAndReturnArgs>(args: SelectSubset<T, LotLockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LotLock.
     * @param {LotLockUpsertArgs} args - Arguments to update or create a LotLock.
     * @example
     * // Update or create a LotLock
     * const lotLock = await prisma.lotLock.upsert({
     *   create: {
     *     // ... data to create a LotLock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LotLock we want to update
     *   }
     * })
     */
    upsert<T extends LotLockUpsertArgs>(args: SelectSubset<T, LotLockUpsertArgs<ExtArgs>>): Prisma__LotLockClient<$Result.GetResult<Prisma.$LotLockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LotLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotLockCountArgs} args - Arguments to filter LotLocks to count.
     * @example
     * // Count the number of LotLocks
     * const count = await prisma.lotLock.count({
     *   where: {
     *     // ... the filter for the LotLocks we want to count
     *   }
     * })
    **/
    count<T extends LotLockCountArgs>(
      args?: Subset<T, LotLockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LotLockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LotLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotLockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LotLockAggregateArgs>(args: Subset<T, LotLockAggregateArgs>): Prisma.PrismaPromise<GetLotLockAggregateType<T>>

    /**
     * Group by LotLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotLockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LotLockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LotLockGroupByArgs['orderBy'] }
        : { orderBy?: LotLockGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LotLockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLotLockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LotLock model
   */
  readonly fields: LotLockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LotLock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LotLockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lot<T extends LotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LotDefaultArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LotLock model
   */
  interface LotLockFieldRefs {
    readonly lot_id: FieldRef<"LotLock", 'Int'>
    readonly locked_by: FieldRef<"LotLock", 'String'>
    readonly locked_until: FieldRef<"LotLock", 'DateTime'>
    readonly created_at: FieldRef<"LotLock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LotLock findUnique
   */
  export type LotLockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    /**
     * Filter, which LotLock to fetch.
     */
    where: LotLockWhereUniqueInput
  }

  /**
   * LotLock findUniqueOrThrow
   */
  export type LotLockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    /**
     * Filter, which LotLock to fetch.
     */
    where: LotLockWhereUniqueInput
  }

  /**
   * LotLock findFirst
   */
  export type LotLockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    /**
     * Filter, which LotLock to fetch.
     */
    where?: LotLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LotLocks to fetch.
     */
    orderBy?: LotLockOrderByWithRelationInput | LotLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LotLocks.
     */
    cursor?: LotLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LotLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LotLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LotLocks.
     */
    distinct?: LotLockScalarFieldEnum | LotLockScalarFieldEnum[]
  }

  /**
   * LotLock findFirstOrThrow
   */
  export type LotLockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    /**
     * Filter, which LotLock to fetch.
     */
    where?: LotLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LotLocks to fetch.
     */
    orderBy?: LotLockOrderByWithRelationInput | LotLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LotLocks.
     */
    cursor?: LotLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LotLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LotLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LotLocks.
     */
    distinct?: LotLockScalarFieldEnum | LotLockScalarFieldEnum[]
  }

  /**
   * LotLock findMany
   */
  export type LotLockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    /**
     * Filter, which LotLocks to fetch.
     */
    where?: LotLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LotLocks to fetch.
     */
    orderBy?: LotLockOrderByWithRelationInput | LotLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LotLocks.
     */
    cursor?: LotLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LotLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LotLocks.
     */
    skip?: number
    distinct?: LotLockScalarFieldEnum | LotLockScalarFieldEnum[]
  }

  /**
   * LotLock create
   */
  export type LotLockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    /**
     * The data needed to create a LotLock.
     */
    data: XOR<LotLockCreateInput, LotLockUncheckedCreateInput>
  }

  /**
   * LotLock createMany
   */
  export type LotLockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LotLocks.
     */
    data: LotLockCreateManyInput | LotLockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LotLock createManyAndReturn
   */
  export type LotLockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * The data used to create many LotLocks.
     */
    data: LotLockCreateManyInput | LotLockCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LotLock update
   */
  export type LotLockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    /**
     * The data needed to update a LotLock.
     */
    data: XOR<LotLockUpdateInput, LotLockUncheckedUpdateInput>
    /**
     * Choose, which LotLock to update.
     */
    where: LotLockWhereUniqueInput
  }

  /**
   * LotLock updateMany
   */
  export type LotLockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LotLocks.
     */
    data: XOR<LotLockUpdateManyMutationInput, LotLockUncheckedUpdateManyInput>
    /**
     * Filter which LotLocks to update
     */
    where?: LotLockWhereInput
    /**
     * Limit how many LotLocks to update.
     */
    limit?: number
  }

  /**
   * LotLock updateManyAndReturn
   */
  export type LotLockUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * The data used to update LotLocks.
     */
    data: XOR<LotLockUpdateManyMutationInput, LotLockUncheckedUpdateManyInput>
    /**
     * Filter which LotLocks to update
     */
    where?: LotLockWhereInput
    /**
     * Limit how many LotLocks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LotLock upsert
   */
  export type LotLockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    /**
     * The filter to search for the LotLock to update in case it exists.
     */
    where: LotLockWhereUniqueInput
    /**
     * In case the LotLock found by the `where` argument doesn't exist, create a new LotLock with this data.
     */
    create: XOR<LotLockCreateInput, LotLockUncheckedCreateInput>
    /**
     * In case the LotLock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LotLockUpdateInput, LotLockUncheckedUpdateInput>
  }

  /**
   * LotLock delete
   */
  export type LotLockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
    /**
     * Filter which LotLock to delete.
     */
    where: LotLockWhereUniqueInput
  }

  /**
   * LotLock deleteMany
   */
  export type LotLockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LotLocks to delete
     */
    where?: LotLockWhereInput
    /**
     * Limit how many LotLocks to delete.
     */
    limit?: number
  }

  /**
   * LotLock without action
   */
  export type LotLockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotLock
     */
    select?: LotLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotLock
     */
    omit?: LotLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotLockInclude<ExtArgs> | null
  }


  /**
   * Model WebpayTransaction
   */

  export type AggregateWebpayTransaction = {
    _count: WebpayTransactionCountAggregateOutputType | null
    _avg: WebpayTransactionAvgAggregateOutputType | null
    _sum: WebpayTransactionSumAggregateOutputType | null
    _min: WebpayTransactionMinAggregateOutputType | null
    _max: WebpayTransactionMaxAggregateOutputType | null
  }

  export type WebpayTransactionAvgAggregateOutputType = {
    amount_clp: number | null
    response_code: number | null
    installments_number: number | null
    installments_count: number | null
    lot_id: number | null
  }

  export type WebpayTransactionSumAggregateOutputType = {
    amount_clp: number | null
    response_code: number | null
    installments_number: number | null
    installments_count: number | null
    lot_id: number | null
  }

  export type WebpayTransactionMinAggregateOutputType = {
    id: string | null
    token: string | null
    buy_order: string | null
    amount_clp: number | null
    status: string | null
    response_code: number | null
    transaction_date: Date | null
    authorization_code: string | null
    payment_type_code: string | null
    installments_number: number | null
    processed_at: Date | null
    scope: string | null
    installments_count: number | null
    created_at: Date | null
    reservation_id: string | null
    lot_id: number | null
  }

  export type WebpayTransactionMaxAggregateOutputType = {
    id: string | null
    token: string | null
    buy_order: string | null
    amount_clp: number | null
    status: string | null
    response_code: number | null
    transaction_date: Date | null
    authorization_code: string | null
    payment_type_code: string | null
    installments_number: number | null
    processed_at: Date | null
    scope: string | null
    installments_count: number | null
    created_at: Date | null
    reservation_id: string | null
    lot_id: number | null
  }

  export type WebpayTransactionCountAggregateOutputType = {
    id: number
    token: number
    buy_order: number
    amount_clp: number
    status: number
    response_code: number
    transaction_date: number
    authorization_code: number
    payment_type_code: number
    installments_number: number
    processed_at: number
    scope: number
    installments_count: number
    created_at: number
    reservation_id: number
    lot_id: number
    _all: number
  }


  export type WebpayTransactionAvgAggregateInputType = {
    amount_clp?: true
    response_code?: true
    installments_number?: true
    installments_count?: true
    lot_id?: true
  }

  export type WebpayTransactionSumAggregateInputType = {
    amount_clp?: true
    response_code?: true
    installments_number?: true
    installments_count?: true
    lot_id?: true
  }

  export type WebpayTransactionMinAggregateInputType = {
    id?: true
    token?: true
    buy_order?: true
    amount_clp?: true
    status?: true
    response_code?: true
    transaction_date?: true
    authorization_code?: true
    payment_type_code?: true
    installments_number?: true
    processed_at?: true
    scope?: true
    installments_count?: true
    created_at?: true
    reservation_id?: true
    lot_id?: true
  }

  export type WebpayTransactionMaxAggregateInputType = {
    id?: true
    token?: true
    buy_order?: true
    amount_clp?: true
    status?: true
    response_code?: true
    transaction_date?: true
    authorization_code?: true
    payment_type_code?: true
    installments_number?: true
    processed_at?: true
    scope?: true
    installments_count?: true
    created_at?: true
    reservation_id?: true
    lot_id?: true
  }

  export type WebpayTransactionCountAggregateInputType = {
    id?: true
    token?: true
    buy_order?: true
    amount_clp?: true
    status?: true
    response_code?: true
    transaction_date?: true
    authorization_code?: true
    payment_type_code?: true
    installments_number?: true
    processed_at?: true
    scope?: true
    installments_count?: true
    created_at?: true
    reservation_id?: true
    lot_id?: true
    _all?: true
  }

  export type WebpayTransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebpayTransaction to aggregate.
     */
    where?: WebpayTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebpayTransactions to fetch.
     */
    orderBy?: WebpayTransactionOrderByWithRelationInput | WebpayTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WebpayTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebpayTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebpayTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WebpayTransactions
    **/
    _count?: true | WebpayTransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WebpayTransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WebpayTransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WebpayTransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WebpayTransactionMaxAggregateInputType
  }

  export type GetWebpayTransactionAggregateType<T extends WebpayTransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateWebpayTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebpayTransaction[P]>
      : GetScalarType<T[P], AggregateWebpayTransaction[P]>
  }




  export type WebpayTransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebpayTransactionWhereInput
    orderBy?: WebpayTransactionOrderByWithAggregationInput | WebpayTransactionOrderByWithAggregationInput[]
    by: WebpayTransactionScalarFieldEnum[] | WebpayTransactionScalarFieldEnum
    having?: WebpayTransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WebpayTransactionCountAggregateInputType | true
    _avg?: WebpayTransactionAvgAggregateInputType
    _sum?: WebpayTransactionSumAggregateInputType
    _min?: WebpayTransactionMinAggregateInputType
    _max?: WebpayTransactionMaxAggregateInputType
  }

  export type WebpayTransactionGroupByOutputType = {
    id: string
    token: string
    buy_order: string
    amount_clp: number
    status: string | null
    response_code: number | null
    transaction_date: Date | null
    authorization_code: string | null
    payment_type_code: string | null
    installments_number: number | null
    processed_at: Date | null
    scope: string | null
    installments_count: number | null
    created_at: Date
    reservation_id: string
    lot_id: number
    _count: WebpayTransactionCountAggregateOutputType | null
    _avg: WebpayTransactionAvgAggregateOutputType | null
    _sum: WebpayTransactionSumAggregateOutputType | null
    _min: WebpayTransactionMinAggregateOutputType | null
    _max: WebpayTransactionMaxAggregateOutputType | null
  }

  type GetWebpayTransactionGroupByPayload<T extends WebpayTransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WebpayTransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WebpayTransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WebpayTransactionGroupByOutputType[P]>
            : GetScalarType<T[P], WebpayTransactionGroupByOutputType[P]>
        }
      >
    >


  export type WebpayTransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    buy_order?: boolean
    amount_clp?: boolean
    status?: boolean
    response_code?: boolean
    transaction_date?: boolean
    authorization_code?: boolean
    payment_type_code?: boolean
    installments_number?: boolean
    processed_at?: boolean
    scope?: boolean
    installments_count?: boolean
    created_at?: boolean
    reservation_id?: boolean
    lot_id?: boolean
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webpayTransaction"]>

  export type WebpayTransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    buy_order?: boolean
    amount_clp?: boolean
    status?: boolean
    response_code?: boolean
    transaction_date?: boolean
    authorization_code?: boolean
    payment_type_code?: boolean
    installments_number?: boolean
    processed_at?: boolean
    scope?: boolean
    installments_count?: boolean
    created_at?: boolean
    reservation_id?: boolean
    lot_id?: boolean
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webpayTransaction"]>

  export type WebpayTransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    buy_order?: boolean
    amount_clp?: boolean
    status?: boolean
    response_code?: boolean
    transaction_date?: boolean
    authorization_code?: boolean
    payment_type_code?: boolean
    installments_number?: boolean
    processed_at?: boolean
    scope?: boolean
    installments_count?: boolean
    created_at?: boolean
    reservation_id?: boolean
    lot_id?: boolean
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webpayTransaction"]>

  export type WebpayTransactionSelectScalar = {
    id?: boolean
    token?: boolean
    buy_order?: boolean
    amount_clp?: boolean
    status?: boolean
    response_code?: boolean
    transaction_date?: boolean
    authorization_code?: boolean
    payment_type_code?: boolean
    installments_number?: boolean
    processed_at?: boolean
    scope?: boolean
    installments_count?: boolean
    created_at?: boolean
    reservation_id?: boolean
    lot_id?: boolean
  }

  export type WebpayTransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "buy_order" | "amount_clp" | "status" | "response_code" | "transaction_date" | "authorization_code" | "payment_type_code" | "installments_number" | "processed_at" | "scope" | "installments_count" | "created_at" | "reservation_id" | "lot_id", ExtArgs["result"]["webpayTransaction"]>
  export type WebpayTransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }
  export type WebpayTransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }
  export type WebpayTransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }

  export type $WebpayTransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WebpayTransaction"
    objects: {
      reservation: Prisma.$ReservationPayload<ExtArgs>
      lot: Prisma.$LotPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      buy_order: string
      amount_clp: number
      status: string | null
      response_code: number | null
      transaction_date: Date | null
      authorization_code: string | null
      payment_type_code: string | null
      installments_number: number | null
      processed_at: Date | null
      scope: string | null
      installments_count: number | null
      created_at: Date
      reservation_id: string
      lot_id: number
    }, ExtArgs["result"]["webpayTransaction"]>
    composites: {}
  }

  type WebpayTransactionGetPayload<S extends boolean | null | undefined | WebpayTransactionDefaultArgs> = $Result.GetResult<Prisma.$WebpayTransactionPayload, S>

  type WebpayTransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WebpayTransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WebpayTransactionCountAggregateInputType | true
    }

  export interface WebpayTransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WebpayTransaction'], meta: { name: 'WebpayTransaction' } }
    /**
     * Find zero or one WebpayTransaction that matches the filter.
     * @param {WebpayTransactionFindUniqueArgs} args - Arguments to find a WebpayTransaction
     * @example
     * // Get one WebpayTransaction
     * const webpayTransaction = await prisma.webpayTransaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WebpayTransactionFindUniqueArgs>(args: SelectSubset<T, WebpayTransactionFindUniqueArgs<ExtArgs>>): Prisma__WebpayTransactionClient<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WebpayTransaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WebpayTransactionFindUniqueOrThrowArgs} args - Arguments to find a WebpayTransaction
     * @example
     * // Get one WebpayTransaction
     * const webpayTransaction = await prisma.webpayTransaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WebpayTransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, WebpayTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WebpayTransactionClient<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebpayTransaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebpayTransactionFindFirstArgs} args - Arguments to find a WebpayTransaction
     * @example
     * // Get one WebpayTransaction
     * const webpayTransaction = await prisma.webpayTransaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WebpayTransactionFindFirstArgs>(args?: SelectSubset<T, WebpayTransactionFindFirstArgs<ExtArgs>>): Prisma__WebpayTransactionClient<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebpayTransaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebpayTransactionFindFirstOrThrowArgs} args - Arguments to find a WebpayTransaction
     * @example
     * // Get one WebpayTransaction
     * const webpayTransaction = await prisma.webpayTransaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WebpayTransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, WebpayTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__WebpayTransactionClient<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WebpayTransactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebpayTransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WebpayTransactions
     * const webpayTransactions = await prisma.webpayTransaction.findMany()
     * 
     * // Get first 10 WebpayTransactions
     * const webpayTransactions = await prisma.webpayTransaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const webpayTransactionWithIdOnly = await prisma.webpayTransaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WebpayTransactionFindManyArgs>(args?: SelectSubset<T, WebpayTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WebpayTransaction.
     * @param {WebpayTransactionCreateArgs} args - Arguments to create a WebpayTransaction.
     * @example
     * // Create one WebpayTransaction
     * const WebpayTransaction = await prisma.webpayTransaction.create({
     *   data: {
     *     // ... data to create a WebpayTransaction
     *   }
     * })
     * 
     */
    create<T extends WebpayTransactionCreateArgs>(args: SelectSubset<T, WebpayTransactionCreateArgs<ExtArgs>>): Prisma__WebpayTransactionClient<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WebpayTransactions.
     * @param {WebpayTransactionCreateManyArgs} args - Arguments to create many WebpayTransactions.
     * @example
     * // Create many WebpayTransactions
     * const webpayTransaction = await prisma.webpayTransaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WebpayTransactionCreateManyArgs>(args?: SelectSubset<T, WebpayTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WebpayTransactions and returns the data saved in the database.
     * @param {WebpayTransactionCreateManyAndReturnArgs} args - Arguments to create many WebpayTransactions.
     * @example
     * // Create many WebpayTransactions
     * const webpayTransaction = await prisma.webpayTransaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WebpayTransactions and only return the `id`
     * const webpayTransactionWithIdOnly = await prisma.webpayTransaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WebpayTransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, WebpayTransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WebpayTransaction.
     * @param {WebpayTransactionDeleteArgs} args - Arguments to delete one WebpayTransaction.
     * @example
     * // Delete one WebpayTransaction
     * const WebpayTransaction = await prisma.webpayTransaction.delete({
     *   where: {
     *     // ... filter to delete one WebpayTransaction
     *   }
     * })
     * 
     */
    delete<T extends WebpayTransactionDeleteArgs>(args: SelectSubset<T, WebpayTransactionDeleteArgs<ExtArgs>>): Prisma__WebpayTransactionClient<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WebpayTransaction.
     * @param {WebpayTransactionUpdateArgs} args - Arguments to update one WebpayTransaction.
     * @example
     * // Update one WebpayTransaction
     * const webpayTransaction = await prisma.webpayTransaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WebpayTransactionUpdateArgs>(args: SelectSubset<T, WebpayTransactionUpdateArgs<ExtArgs>>): Prisma__WebpayTransactionClient<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WebpayTransactions.
     * @param {WebpayTransactionDeleteManyArgs} args - Arguments to filter WebpayTransactions to delete.
     * @example
     * // Delete a few WebpayTransactions
     * const { count } = await prisma.webpayTransaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WebpayTransactionDeleteManyArgs>(args?: SelectSubset<T, WebpayTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebpayTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebpayTransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WebpayTransactions
     * const webpayTransaction = await prisma.webpayTransaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WebpayTransactionUpdateManyArgs>(args: SelectSubset<T, WebpayTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebpayTransactions and returns the data updated in the database.
     * @param {WebpayTransactionUpdateManyAndReturnArgs} args - Arguments to update many WebpayTransactions.
     * @example
     * // Update many WebpayTransactions
     * const webpayTransaction = await prisma.webpayTransaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WebpayTransactions and only return the `id`
     * const webpayTransactionWithIdOnly = await prisma.webpayTransaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WebpayTransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, WebpayTransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WebpayTransaction.
     * @param {WebpayTransactionUpsertArgs} args - Arguments to update or create a WebpayTransaction.
     * @example
     * // Update or create a WebpayTransaction
     * const webpayTransaction = await prisma.webpayTransaction.upsert({
     *   create: {
     *     // ... data to create a WebpayTransaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WebpayTransaction we want to update
     *   }
     * })
     */
    upsert<T extends WebpayTransactionUpsertArgs>(args: SelectSubset<T, WebpayTransactionUpsertArgs<ExtArgs>>): Prisma__WebpayTransactionClient<$Result.GetResult<Prisma.$WebpayTransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WebpayTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebpayTransactionCountArgs} args - Arguments to filter WebpayTransactions to count.
     * @example
     * // Count the number of WebpayTransactions
     * const count = await prisma.webpayTransaction.count({
     *   where: {
     *     // ... the filter for the WebpayTransactions we want to count
     *   }
     * })
    **/
    count<T extends WebpayTransactionCountArgs>(
      args?: Subset<T, WebpayTransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WebpayTransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WebpayTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebpayTransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WebpayTransactionAggregateArgs>(args: Subset<T, WebpayTransactionAggregateArgs>): Prisma.PrismaPromise<GetWebpayTransactionAggregateType<T>>

    /**
     * Group by WebpayTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebpayTransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WebpayTransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WebpayTransactionGroupByArgs['orderBy'] }
        : { orderBy?: WebpayTransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WebpayTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebpayTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WebpayTransaction model
   */
  readonly fields: WebpayTransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WebpayTransaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WebpayTransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservation<T extends ReservationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReservationDefaultArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lot<T extends LotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LotDefaultArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WebpayTransaction model
   */
  interface WebpayTransactionFieldRefs {
    readonly id: FieldRef<"WebpayTransaction", 'String'>
    readonly token: FieldRef<"WebpayTransaction", 'String'>
    readonly buy_order: FieldRef<"WebpayTransaction", 'String'>
    readonly amount_clp: FieldRef<"WebpayTransaction", 'Int'>
    readonly status: FieldRef<"WebpayTransaction", 'String'>
    readonly response_code: FieldRef<"WebpayTransaction", 'Int'>
    readonly transaction_date: FieldRef<"WebpayTransaction", 'DateTime'>
    readonly authorization_code: FieldRef<"WebpayTransaction", 'String'>
    readonly payment_type_code: FieldRef<"WebpayTransaction", 'String'>
    readonly installments_number: FieldRef<"WebpayTransaction", 'Int'>
    readonly processed_at: FieldRef<"WebpayTransaction", 'DateTime'>
    readonly scope: FieldRef<"WebpayTransaction", 'String'>
    readonly installments_count: FieldRef<"WebpayTransaction", 'Int'>
    readonly created_at: FieldRef<"WebpayTransaction", 'DateTime'>
    readonly reservation_id: FieldRef<"WebpayTransaction", 'String'>
    readonly lot_id: FieldRef<"WebpayTransaction", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * WebpayTransaction findUnique
   */
  export type WebpayTransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    /**
     * Filter, which WebpayTransaction to fetch.
     */
    where: WebpayTransactionWhereUniqueInput
  }

  /**
   * WebpayTransaction findUniqueOrThrow
   */
  export type WebpayTransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    /**
     * Filter, which WebpayTransaction to fetch.
     */
    where: WebpayTransactionWhereUniqueInput
  }

  /**
   * WebpayTransaction findFirst
   */
  export type WebpayTransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    /**
     * Filter, which WebpayTransaction to fetch.
     */
    where?: WebpayTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebpayTransactions to fetch.
     */
    orderBy?: WebpayTransactionOrderByWithRelationInput | WebpayTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebpayTransactions.
     */
    cursor?: WebpayTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebpayTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebpayTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebpayTransactions.
     */
    distinct?: WebpayTransactionScalarFieldEnum | WebpayTransactionScalarFieldEnum[]
  }

  /**
   * WebpayTransaction findFirstOrThrow
   */
  export type WebpayTransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    /**
     * Filter, which WebpayTransaction to fetch.
     */
    where?: WebpayTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebpayTransactions to fetch.
     */
    orderBy?: WebpayTransactionOrderByWithRelationInput | WebpayTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebpayTransactions.
     */
    cursor?: WebpayTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebpayTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebpayTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebpayTransactions.
     */
    distinct?: WebpayTransactionScalarFieldEnum | WebpayTransactionScalarFieldEnum[]
  }

  /**
   * WebpayTransaction findMany
   */
  export type WebpayTransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    /**
     * Filter, which WebpayTransactions to fetch.
     */
    where?: WebpayTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebpayTransactions to fetch.
     */
    orderBy?: WebpayTransactionOrderByWithRelationInput | WebpayTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WebpayTransactions.
     */
    cursor?: WebpayTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebpayTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebpayTransactions.
     */
    skip?: number
    distinct?: WebpayTransactionScalarFieldEnum | WebpayTransactionScalarFieldEnum[]
  }

  /**
   * WebpayTransaction create
   */
  export type WebpayTransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a WebpayTransaction.
     */
    data: XOR<WebpayTransactionCreateInput, WebpayTransactionUncheckedCreateInput>
  }

  /**
   * WebpayTransaction createMany
   */
  export type WebpayTransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WebpayTransactions.
     */
    data: WebpayTransactionCreateManyInput | WebpayTransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebpayTransaction createManyAndReturn
   */
  export type WebpayTransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * The data used to create many WebpayTransactions.
     */
    data: WebpayTransactionCreateManyInput | WebpayTransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WebpayTransaction update
   */
  export type WebpayTransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a WebpayTransaction.
     */
    data: XOR<WebpayTransactionUpdateInput, WebpayTransactionUncheckedUpdateInput>
    /**
     * Choose, which WebpayTransaction to update.
     */
    where: WebpayTransactionWhereUniqueInput
  }

  /**
   * WebpayTransaction updateMany
   */
  export type WebpayTransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WebpayTransactions.
     */
    data: XOR<WebpayTransactionUpdateManyMutationInput, WebpayTransactionUncheckedUpdateManyInput>
    /**
     * Filter which WebpayTransactions to update
     */
    where?: WebpayTransactionWhereInput
    /**
     * Limit how many WebpayTransactions to update.
     */
    limit?: number
  }

  /**
   * WebpayTransaction updateManyAndReturn
   */
  export type WebpayTransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * The data used to update WebpayTransactions.
     */
    data: XOR<WebpayTransactionUpdateManyMutationInput, WebpayTransactionUncheckedUpdateManyInput>
    /**
     * Filter which WebpayTransactions to update
     */
    where?: WebpayTransactionWhereInput
    /**
     * Limit how many WebpayTransactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WebpayTransaction upsert
   */
  export type WebpayTransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the WebpayTransaction to update in case it exists.
     */
    where: WebpayTransactionWhereUniqueInput
    /**
     * In case the WebpayTransaction found by the `where` argument doesn't exist, create a new WebpayTransaction with this data.
     */
    create: XOR<WebpayTransactionCreateInput, WebpayTransactionUncheckedCreateInput>
    /**
     * In case the WebpayTransaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WebpayTransactionUpdateInput, WebpayTransactionUncheckedUpdateInput>
  }

  /**
   * WebpayTransaction delete
   */
  export type WebpayTransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
    /**
     * Filter which WebpayTransaction to delete.
     */
    where: WebpayTransactionWhereUniqueInput
  }

  /**
   * WebpayTransaction deleteMany
   */
  export type WebpayTransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebpayTransactions to delete
     */
    where?: WebpayTransactionWhereInput
    /**
     * Limit how many WebpayTransactions to delete.
     */
    limit?: number
  }

  /**
   * WebpayTransaction without action
   */
  export type WebpayTransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebpayTransaction
     */
    select?: WebpayTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebpayTransaction
     */
    omit?: WebpayTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebpayTransactionInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    emailVerified: Date | null
    password: string | null
    name: string | null
    role: $Enums.Role | null
    mustChangePassword: boolean | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    emailVerified: Date | null
    password: string | null
    name: string | null
    role: $Enums.Role | null
    mustChangePassword: boolean | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    emailVerified: number
    password: number
    name: number
    role: number
    mustChangePassword: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    password?: true
    name?: true
    role?: true
    mustChangePassword?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    password?: true
    name?: true
    role?: true
    mustChangePassword?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    password?: true
    name?: true
    role?: true
    mustChangePassword?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    emailVerified: Date | null
    password: string
    name: string
    role: $Enums.Role
    mustChangePassword: boolean
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    mustChangePassword?: boolean
    createdAt?: boolean
    notes?: boolean | User$notesArgs<ExtArgs>
    calls?: boolean | User$callsArgs<ExtArgs>
    sales?: boolean | User$salesArgs<ExtArgs>
    purchases?: boolean | User$purchasesArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    mustChangePassword?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    mustChangePassword?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    mustChangePassword?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "emailVerified" | "password" | "name" | "role" | "mustChangePassword" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notes?: boolean | User$notesArgs<ExtArgs>
    calls?: boolean | User$callsArgs<ExtArgs>
    sales?: boolean | User$salesArgs<ExtArgs>
    purchases?: boolean | User$purchasesArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      notes: Prisma.$NotePayload<ExtArgs>[]
      calls: Prisma.$CallLogPayload<ExtArgs>[]
      sales: Prisma.$ReservationPayload<ExtArgs>[]
      purchases: Prisma.$ReservationPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      emailVerified: Date | null
      password: string
      name: string
      role: $Enums.Role
      mustChangePassword: boolean
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    notes<T extends User$notesArgs<ExtArgs> = {}>(args?: Subset<T, User$notesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    calls<T extends User$callsArgs<ExtArgs> = {}>(args?: Subset<T, User$callsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sales<T extends User$salesArgs<ExtArgs> = {}>(args?: Subset<T, User$salesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    purchases<T extends User$purchasesArgs<ExtArgs> = {}>(args?: Subset<T, User$purchasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly mustChangePassword: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.notes
   */
  export type User$notesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Note
     */
    omit?: NoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    where?: NoteWhereInput
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    cursor?: NoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * User.calls
   */
  export type User$callsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallLog
     */
    select?: CallLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CallLog
     */
    omit?: CallLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallLogInclude<ExtArgs> | null
    where?: CallLogWhereInput
    orderBy?: CallLogOrderByWithRelationInput | CallLogOrderByWithRelationInput[]
    cursor?: CallLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CallLogScalarFieldEnum | CallLogScalarFieldEnum[]
  }

  /**
   * User.sales
   */
  export type User$salesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    cursor?: ReservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * User.purchases
   */
  export type User$purchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    cursor?: ReservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    action: $Enums.ActionType | null
    entity: string | null
    entity_id: string | null
    details: string | null
    pk: string | null
    user_id: string | null
    user_email: string | null
    ip_address: string | null
    user_agent: string | null
    created_at: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    action: $Enums.ActionType | null
    entity: string | null
    entity_id: string | null
    details: string | null
    pk: string | null
    user_id: string | null
    user_email: string | null
    ip_address: string | null
    user_agent: string | null
    created_at: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    action: number
    entity: number
    entity_id: number
    details: number
    pk: number
    user_id: number
    user_email: number
    ip_address: number
    user_agent: number
    created_at: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    action?: true
    entity?: true
    entity_id?: true
    details?: true
    pk?: true
    user_id?: true
    user_email?: true
    ip_address?: true
    user_agent?: true
    created_at?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    action?: true
    entity?: true
    entity_id?: true
    details?: true
    pk?: true
    user_id?: true
    user_email?: true
    ip_address?: true
    user_agent?: true
    created_at?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    action?: true
    entity?: true
    entity_id?: true
    details?: true
    pk?: true
    user_id?: true
    user_email?: true
    ip_address?: true
    user_agent?: true
    created_at?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    action: $Enums.ActionType
    entity: string
    entity_id: string | null
    details: string | null
    pk: string | null
    user_id: string | null
    user_email: string | null
    ip_address: string | null
    user_agent: string | null
    created_at: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    entity?: boolean
    entity_id?: boolean
    details?: boolean
    pk?: boolean
    user_id?: boolean
    user_email?: boolean
    ip_address?: boolean
    user_agent?: boolean
    created_at?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    entity?: boolean
    entity_id?: boolean
    details?: boolean
    pk?: boolean
    user_id?: boolean
    user_email?: boolean
    ip_address?: boolean
    user_agent?: boolean
    created_at?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    entity?: boolean
    entity_id?: boolean
    details?: boolean
    pk?: boolean
    user_id?: boolean
    user_email?: boolean
    ip_address?: boolean
    user_agent?: boolean
    created_at?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    action?: boolean
    entity?: boolean
    entity_id?: boolean
    details?: boolean
    pk?: boolean
    user_id?: boolean
    user_email?: boolean
    ip_address?: boolean
    user_agent?: boolean
    created_at?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "entity" | "entity_id" | "details" | "pk" | "user_id" | "user_email" | "ip_address" | "user_agent" | "created_at", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: $Enums.ActionType
      entity: string
      entity_id: string | null
      details: string | null
      pk: string | null
      user_id: string | null
      user_email: string | null
      ip_address: string | null
      user_agent: string | null
      created_at: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'ActionType'>
    readonly entity: FieldRef<"AuditLog", 'String'>
    readonly entity_id: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'String'>
    readonly pk: FieldRef<"AuditLog", 'String'>
    readonly user_id: FieldRef<"AuditLog", 'String'>
    readonly user_email: FieldRef<"AuditLog", 'String'>
    readonly ip_address: FieldRef<"AuditLog", 'String'>
    readonly user_agent: FieldRef<"AuditLog", 'String'>
    readonly created_at: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    type: string | null
    title: string | null
    message: string | null
    read: boolean | null
    created_at: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    type: string | null
    title: string | null
    message: string | null
    read: boolean | null
    created_at: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    user_id: number
    type: number
    title: number
    message: number
    read: number
    created_at: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    user_id?: true
    type?: true
    title?: true
    message?: true
    read?: true
    created_at?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    user_id?: true
    type?: true
    title?: true
    message?: true
    read?: true
    created_at?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    user_id?: true
    type?: true
    title?: true
    message?: true
    read?: true
    created_at?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    user_id: string
    type: string
    title: string
    message: string
    read: boolean
    created_at: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    read?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    read?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    read?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    user_id?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    read?: boolean
    created_at?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "type" | "title" | "message" | "read" | "created_at", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      type: string
      title: string
      message: string
      read: boolean
      created_at: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly user_id: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly read: FieldRef<"Notification", 'Boolean'>
    readonly created_at: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LotScalarFieldEnum: {
    id: 'id',
    number: 'number',
    stage: 'stage',
    area_m2: 'area_m2',
    price_total_clp: 'price_total_clp',
    reservation_amount_clp: 'reservation_amount_clp',
    status: 'status',
    cuotas: 'cuotas',
    pie: 'pie',
    valor_cuota: 'valor_cuota',
    last_installment_amount: 'last_installment_amount',
    reserved_until: 'reserved_until',
    reserved_at: 'reserved_at',
    reserved_by: 'reserved_by',
    order_id: 'order_id',
    updated_at: 'updated_at'
  };

  export type LotScalarFieldEnum = (typeof LotScalarFieldEnum)[keyof typeof LotScalarFieldEnum]


  export const ContactScalarFieldEnum: {
    id: 'id',
    email: 'email',
    first_name: 'first_name',
    last_name: 'last_name',
    phone: 'phone',
    rut: 'rut',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ContactScalarFieldEnum = (typeof ContactScalarFieldEnum)[keyof typeof ContactScalarFieldEnum]


  export const NoteScalarFieldEnum: {
    id: 'id',
    contact_id: 'contact_id',
    seller_id: 'seller_id',
    content: 'content',
    created_at: 'created_at'
  };

  export type NoteScalarFieldEnum = (typeof NoteScalarFieldEnum)[keyof typeof NoteScalarFieldEnum]


  export const CallLogScalarFieldEnum: {
    id: 'id',
    contact_id: 'contact_id',
    seller_id: 'seller_id',
    duration: 'duration',
    summary: 'summary',
    date: 'date'
  };

  export type CallLogScalarFieldEnum = (typeof CallLogScalarFieldEnum)[keyof typeof CallLogScalarFieldEnum]


  export const ContactFileScalarFieldEnum: {
    id: 'id',
    contact_id: 'contact_id',
    name: 'name',
    url: 'url',
    type: 'type',
    created_at: 'created_at'
  };

  export type ContactFileScalarFieldEnum = (typeof ContactFileScalarFieldEnum)[keyof typeof ContactFileScalarFieldEnum]


  export const ReservationScalarFieldEnum: {
    id: 'id',
    lot_id: 'lot_id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    rut: 'rut',
    address: 'address',
    folio: 'folio',
    status: 'status',
    session_id: 'session_id',
    expires_at: 'expires_at',
    created_at: 'created_at',
    marital_status: 'marital_status',
    profession: 'profession',
    nationality: 'nationality',
    pipeline_stage: 'pipeline_stage',
    notes: 'notes',
    uploaded_contract_url: 'uploaded_contract_url',
    address_street: 'address_street',
    address_number: 'address_number',
    address_commune: 'address_commune',
    address_region: 'address_region',
    utm_source: 'utm_source',
    utm_medium: 'utm_medium',
    utm_campaign: 'utm_campaign',
    utm_content: 'utm_content',
    utm_term: 'utm_term',
    pie_status: 'pie_status',
    installments_paid: 'installments_paid',
    signature_otp: 'signature_otp',
    signature_otp_expires: 'signature_otp_expires',
    signed_at: 'signed_at',
    signature_ip: 'signature_ip',
    promesa_signature_otp: 'promesa_signature_otp',
    promesa_signature_otp_expires: 'promesa_signature_otp_expires',
    promesa_signed_at: 'promesa_signed_at',
    promesa_signature_ip: 'promesa_signature_ip',
    contact_id: 'contact_id',
    seller_id: 'seller_id',
    buyer_id: 'buyer_id'
  };

  export type ReservationScalarFieldEnum = (typeof ReservationScalarFieldEnum)[keyof typeof ReservationScalarFieldEnum]


  export const LotLockScalarFieldEnum: {
    lot_id: 'lot_id',
    locked_by: 'locked_by',
    locked_until: 'locked_until',
    created_at: 'created_at'
  };

  export type LotLockScalarFieldEnum = (typeof LotLockScalarFieldEnum)[keyof typeof LotLockScalarFieldEnum]


  export const WebpayTransactionScalarFieldEnum: {
    id: 'id',
    token: 'token',
    buy_order: 'buy_order',
    amount_clp: 'amount_clp',
    status: 'status',
    response_code: 'response_code',
    transaction_date: 'transaction_date',
    authorization_code: 'authorization_code',
    payment_type_code: 'payment_type_code',
    installments_number: 'installments_number',
    processed_at: 'processed_at',
    scope: 'scope',
    installments_count: 'installments_count',
    created_at: 'created_at',
    reservation_id: 'reservation_id',
    lot_id: 'lot_id'
  };

  export type WebpayTransactionScalarFieldEnum = (typeof WebpayTransactionScalarFieldEnum)[keyof typeof WebpayTransactionScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    emailVerified: 'emailVerified',
    password: 'password',
    name: 'name',
    role: 'role',
    mustChangePassword: 'mustChangePassword',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    entity: 'entity',
    entity_id: 'entity_id',
    details: 'details',
    pk: 'pk',
    user_id: 'user_id',
    user_email: 'user_email',
    ip_address: 'ip_address',
    user_agent: 'user_agent',
    created_at: 'created_at'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    type: 'type',
    title: 'title',
    message: 'message',
    read: 'read',
    created_at: 'created_at'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ActionType'
   */
  export type EnumActionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionType'>
    


  /**
   * Reference to a field of type 'ActionType[]'
   */
  export type ListEnumActionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionType[]'>
    
  /**
   * Deep Input Types
   */


  export type LotWhereInput = {
    AND?: LotWhereInput | LotWhereInput[]
    OR?: LotWhereInput[]
    NOT?: LotWhereInput | LotWhereInput[]
    id?: IntFilter<"Lot"> | number
    number?: StringNullableFilter<"Lot"> | string | null
    stage?: IntNullableFilter<"Lot"> | number | null
    area_m2?: FloatNullableFilter<"Lot"> | number | null
    price_total_clp?: IntNullableFilter<"Lot"> | number | null
    reservation_amount_clp?: IntNullableFilter<"Lot"> | number | null
    status?: StringFilter<"Lot"> | string
    cuotas?: IntNullableFilter<"Lot"> | number | null
    pie?: IntNullableFilter<"Lot"> | number | null
    valor_cuota?: IntNullableFilter<"Lot"> | number | null
    last_installment_amount?: IntNullableFilter<"Lot"> | number | null
    reserved_until?: DateTimeNullableFilter<"Lot"> | Date | string | null
    reserved_at?: DateTimeNullableFilter<"Lot"> | Date | string | null
    reserved_by?: StringNullableFilter<"Lot"> | string | null
    order_id?: StringNullableFilter<"Lot"> | string | null
    updated_at?: DateTimeNullableFilter<"Lot"> | Date | string | null
    reservations?: ReservationListRelationFilter
    locks?: LotLockListRelationFilter
    transactions?: WebpayTransactionListRelationFilter
  }

  export type LotOrderByWithRelationInput = {
    id?: SortOrder
    number?: SortOrderInput | SortOrder
    stage?: SortOrderInput | SortOrder
    area_m2?: SortOrderInput | SortOrder
    price_total_clp?: SortOrderInput | SortOrder
    reservation_amount_clp?: SortOrderInput | SortOrder
    status?: SortOrder
    cuotas?: SortOrderInput | SortOrder
    pie?: SortOrderInput | SortOrder
    valor_cuota?: SortOrderInput | SortOrder
    last_installment_amount?: SortOrderInput | SortOrder
    reserved_until?: SortOrderInput | SortOrder
    reserved_at?: SortOrderInput | SortOrder
    reserved_by?: SortOrderInput | SortOrder
    order_id?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    reservations?: ReservationOrderByRelationAggregateInput
    locks?: LotLockOrderByRelationAggregateInput
    transactions?: WebpayTransactionOrderByRelationAggregateInput
  }

  export type LotWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LotWhereInput | LotWhereInput[]
    OR?: LotWhereInput[]
    NOT?: LotWhereInput | LotWhereInput[]
    number?: StringNullableFilter<"Lot"> | string | null
    stage?: IntNullableFilter<"Lot"> | number | null
    area_m2?: FloatNullableFilter<"Lot"> | number | null
    price_total_clp?: IntNullableFilter<"Lot"> | number | null
    reservation_amount_clp?: IntNullableFilter<"Lot"> | number | null
    status?: StringFilter<"Lot"> | string
    cuotas?: IntNullableFilter<"Lot"> | number | null
    pie?: IntNullableFilter<"Lot"> | number | null
    valor_cuota?: IntNullableFilter<"Lot"> | number | null
    last_installment_amount?: IntNullableFilter<"Lot"> | number | null
    reserved_until?: DateTimeNullableFilter<"Lot"> | Date | string | null
    reserved_at?: DateTimeNullableFilter<"Lot"> | Date | string | null
    reserved_by?: StringNullableFilter<"Lot"> | string | null
    order_id?: StringNullableFilter<"Lot"> | string | null
    updated_at?: DateTimeNullableFilter<"Lot"> | Date | string | null
    reservations?: ReservationListRelationFilter
    locks?: LotLockListRelationFilter
    transactions?: WebpayTransactionListRelationFilter
  }, "id">

  export type LotOrderByWithAggregationInput = {
    id?: SortOrder
    number?: SortOrderInput | SortOrder
    stage?: SortOrderInput | SortOrder
    area_m2?: SortOrderInput | SortOrder
    price_total_clp?: SortOrderInput | SortOrder
    reservation_amount_clp?: SortOrderInput | SortOrder
    status?: SortOrder
    cuotas?: SortOrderInput | SortOrder
    pie?: SortOrderInput | SortOrder
    valor_cuota?: SortOrderInput | SortOrder
    last_installment_amount?: SortOrderInput | SortOrder
    reserved_until?: SortOrderInput | SortOrder
    reserved_at?: SortOrderInput | SortOrder
    reserved_by?: SortOrderInput | SortOrder
    order_id?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: LotCountOrderByAggregateInput
    _avg?: LotAvgOrderByAggregateInput
    _max?: LotMaxOrderByAggregateInput
    _min?: LotMinOrderByAggregateInput
    _sum?: LotSumOrderByAggregateInput
  }

  export type LotScalarWhereWithAggregatesInput = {
    AND?: LotScalarWhereWithAggregatesInput | LotScalarWhereWithAggregatesInput[]
    OR?: LotScalarWhereWithAggregatesInput[]
    NOT?: LotScalarWhereWithAggregatesInput | LotScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Lot"> | number
    number?: StringNullableWithAggregatesFilter<"Lot"> | string | null
    stage?: IntNullableWithAggregatesFilter<"Lot"> | number | null
    area_m2?: FloatNullableWithAggregatesFilter<"Lot"> | number | null
    price_total_clp?: IntNullableWithAggregatesFilter<"Lot"> | number | null
    reservation_amount_clp?: IntNullableWithAggregatesFilter<"Lot"> | number | null
    status?: StringWithAggregatesFilter<"Lot"> | string
    cuotas?: IntNullableWithAggregatesFilter<"Lot"> | number | null
    pie?: IntNullableWithAggregatesFilter<"Lot"> | number | null
    valor_cuota?: IntNullableWithAggregatesFilter<"Lot"> | number | null
    last_installment_amount?: IntNullableWithAggregatesFilter<"Lot"> | number | null
    reserved_until?: DateTimeNullableWithAggregatesFilter<"Lot"> | Date | string | null
    reserved_at?: DateTimeNullableWithAggregatesFilter<"Lot"> | Date | string | null
    reserved_by?: StringNullableWithAggregatesFilter<"Lot"> | string | null
    order_id?: StringNullableWithAggregatesFilter<"Lot"> | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"Lot"> | Date | string | null
  }

  export type ContactWhereInput = {
    AND?: ContactWhereInput | ContactWhereInput[]
    OR?: ContactWhereInput[]
    NOT?: ContactWhereInput | ContactWhereInput[]
    id?: StringFilter<"Contact"> | string
    email?: StringFilter<"Contact"> | string
    first_name?: StringNullableFilter<"Contact"> | string | null
    last_name?: StringNullableFilter<"Contact"> | string | null
    phone?: StringNullableFilter<"Contact"> | string | null
    rut?: StringNullableFilter<"Contact"> | string | null
    created_at?: DateTimeFilter<"Contact"> | Date | string
    updated_at?: DateTimeFilter<"Contact"> | Date | string
    reservations?: ReservationListRelationFilter
    notes?: NoteListRelationFilter
    calls?: CallLogListRelationFilter
    files?: ContactFileListRelationFilter
  }

  export type ContactOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    first_name?: SortOrderInput | SortOrder
    last_name?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    rut?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    reservations?: ReservationOrderByRelationAggregateInput
    notes?: NoteOrderByRelationAggregateInput
    calls?: CallLogOrderByRelationAggregateInput
    files?: ContactFileOrderByRelationAggregateInput
  }

  export type ContactWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: ContactWhereInput | ContactWhereInput[]
    OR?: ContactWhereInput[]
    NOT?: ContactWhereInput | ContactWhereInput[]
    first_name?: StringNullableFilter<"Contact"> | string | null
    last_name?: StringNullableFilter<"Contact"> | string | null
    phone?: StringNullableFilter<"Contact"> | string | null
    rut?: StringNullableFilter<"Contact"> | string | null
    created_at?: DateTimeFilter<"Contact"> | Date | string
    updated_at?: DateTimeFilter<"Contact"> | Date | string
    reservations?: ReservationListRelationFilter
    notes?: NoteListRelationFilter
    calls?: CallLogListRelationFilter
    files?: ContactFileListRelationFilter
  }, "id" | "email">

  export type ContactOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    first_name?: SortOrderInput | SortOrder
    last_name?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    rut?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ContactCountOrderByAggregateInput
    _max?: ContactMaxOrderByAggregateInput
    _min?: ContactMinOrderByAggregateInput
  }

  export type ContactScalarWhereWithAggregatesInput = {
    AND?: ContactScalarWhereWithAggregatesInput | ContactScalarWhereWithAggregatesInput[]
    OR?: ContactScalarWhereWithAggregatesInput[]
    NOT?: ContactScalarWhereWithAggregatesInput | ContactScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Contact"> | string
    email?: StringWithAggregatesFilter<"Contact"> | string
    first_name?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    last_name?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    rut?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Contact"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Contact"> | Date | string
  }

  export type NoteWhereInput = {
    AND?: NoteWhereInput | NoteWhereInput[]
    OR?: NoteWhereInput[]
    NOT?: NoteWhereInput | NoteWhereInput[]
    id?: StringFilter<"Note"> | string
    contact_id?: StringFilter<"Note"> | string
    seller_id?: StringFilter<"Note"> | string
    content?: StringFilter<"Note"> | string
    created_at?: DateTimeFilter<"Note"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NoteOrderByWithRelationInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    contact?: ContactOrderByWithRelationInput
    seller?: UserOrderByWithRelationInput
  }

  export type NoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NoteWhereInput | NoteWhereInput[]
    OR?: NoteWhereInput[]
    NOT?: NoteWhereInput | NoteWhereInput[]
    contact_id?: StringFilter<"Note"> | string
    seller_id?: StringFilter<"Note"> | string
    content?: StringFilter<"Note"> | string
    created_at?: DateTimeFilter<"Note"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type NoteOrderByWithAggregationInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    _count?: NoteCountOrderByAggregateInput
    _max?: NoteMaxOrderByAggregateInput
    _min?: NoteMinOrderByAggregateInput
  }

  export type NoteScalarWhereWithAggregatesInput = {
    AND?: NoteScalarWhereWithAggregatesInput | NoteScalarWhereWithAggregatesInput[]
    OR?: NoteScalarWhereWithAggregatesInput[]
    NOT?: NoteScalarWhereWithAggregatesInput | NoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Note"> | string
    contact_id?: StringWithAggregatesFilter<"Note"> | string
    seller_id?: StringWithAggregatesFilter<"Note"> | string
    content?: StringWithAggregatesFilter<"Note"> | string
    created_at?: DateTimeWithAggregatesFilter<"Note"> | Date | string
  }

  export type CallLogWhereInput = {
    AND?: CallLogWhereInput | CallLogWhereInput[]
    OR?: CallLogWhereInput[]
    NOT?: CallLogWhereInput | CallLogWhereInput[]
    id?: StringFilter<"CallLog"> | string
    contact_id?: StringFilter<"CallLog"> | string
    seller_id?: StringFilter<"CallLog"> | string
    duration?: IntNullableFilter<"CallLog"> | number | null
    summary?: StringNullableFilter<"CallLog"> | string | null
    date?: DateTimeFilter<"CallLog"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CallLogOrderByWithRelationInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    duration?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    date?: SortOrder
    contact?: ContactOrderByWithRelationInput
    seller?: UserOrderByWithRelationInput
  }

  export type CallLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CallLogWhereInput | CallLogWhereInput[]
    OR?: CallLogWhereInput[]
    NOT?: CallLogWhereInput | CallLogWhereInput[]
    contact_id?: StringFilter<"CallLog"> | string
    seller_id?: StringFilter<"CallLog"> | string
    duration?: IntNullableFilter<"CallLog"> | number | null
    summary?: StringNullableFilter<"CallLog"> | string | null
    date?: DateTimeFilter<"CallLog"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type CallLogOrderByWithAggregationInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    duration?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    date?: SortOrder
    _count?: CallLogCountOrderByAggregateInput
    _avg?: CallLogAvgOrderByAggregateInput
    _max?: CallLogMaxOrderByAggregateInput
    _min?: CallLogMinOrderByAggregateInput
    _sum?: CallLogSumOrderByAggregateInput
  }

  export type CallLogScalarWhereWithAggregatesInput = {
    AND?: CallLogScalarWhereWithAggregatesInput | CallLogScalarWhereWithAggregatesInput[]
    OR?: CallLogScalarWhereWithAggregatesInput[]
    NOT?: CallLogScalarWhereWithAggregatesInput | CallLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CallLog"> | string
    contact_id?: StringWithAggregatesFilter<"CallLog"> | string
    seller_id?: StringWithAggregatesFilter<"CallLog"> | string
    duration?: IntNullableWithAggregatesFilter<"CallLog"> | number | null
    summary?: StringNullableWithAggregatesFilter<"CallLog"> | string | null
    date?: DateTimeWithAggregatesFilter<"CallLog"> | Date | string
  }

  export type ContactFileWhereInput = {
    AND?: ContactFileWhereInput | ContactFileWhereInput[]
    OR?: ContactFileWhereInput[]
    NOT?: ContactFileWhereInput | ContactFileWhereInput[]
    id?: StringFilter<"ContactFile"> | string
    contact_id?: StringFilter<"ContactFile"> | string
    name?: StringFilter<"ContactFile"> | string
    url?: StringFilter<"ContactFile"> | string
    type?: StringNullableFilter<"ContactFile"> | string | null
    created_at?: DateTimeFilter<"ContactFile"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
  }

  export type ContactFileOrderByWithRelationInput = {
    id?: SortOrder
    contact_id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    type?: SortOrderInput | SortOrder
    created_at?: SortOrder
    contact?: ContactOrderByWithRelationInput
  }

  export type ContactFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ContactFileWhereInput | ContactFileWhereInput[]
    OR?: ContactFileWhereInput[]
    NOT?: ContactFileWhereInput | ContactFileWhereInput[]
    contact_id?: StringFilter<"ContactFile"> | string
    name?: StringFilter<"ContactFile"> | string
    url?: StringFilter<"ContactFile"> | string
    type?: StringNullableFilter<"ContactFile"> | string | null
    created_at?: DateTimeFilter<"ContactFile"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
  }, "id">

  export type ContactFileOrderByWithAggregationInput = {
    id?: SortOrder
    contact_id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    type?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: ContactFileCountOrderByAggregateInput
    _max?: ContactFileMaxOrderByAggregateInput
    _min?: ContactFileMinOrderByAggregateInput
  }

  export type ContactFileScalarWhereWithAggregatesInput = {
    AND?: ContactFileScalarWhereWithAggregatesInput | ContactFileScalarWhereWithAggregatesInput[]
    OR?: ContactFileScalarWhereWithAggregatesInput[]
    NOT?: ContactFileScalarWhereWithAggregatesInput | ContactFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContactFile"> | string
    contact_id?: StringWithAggregatesFilter<"ContactFile"> | string
    name?: StringWithAggregatesFilter<"ContactFile"> | string
    url?: StringWithAggregatesFilter<"ContactFile"> | string
    type?: StringNullableWithAggregatesFilter<"ContactFile"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"ContactFile"> | Date | string
  }

  export type ReservationWhereInput = {
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    id?: StringFilter<"Reservation"> | string
    lot_id?: IntFilter<"Reservation"> | number
    name?: StringFilter<"Reservation"> | string
    email?: StringFilter<"Reservation"> | string
    phone?: StringFilter<"Reservation"> | string
    rut?: StringNullableFilter<"Reservation"> | string | null
    address?: StringNullableFilter<"Reservation"> | string | null
    folio?: StringNullableFilter<"Reservation"> | string | null
    status?: StringFilter<"Reservation"> | string
    session_id?: StringNullableFilter<"Reservation"> | string | null
    expires_at?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    created_at?: DateTimeFilter<"Reservation"> | Date | string
    marital_status?: StringNullableFilter<"Reservation"> | string | null
    profession?: StringNullableFilter<"Reservation"> | string | null
    nationality?: StringNullableFilter<"Reservation"> | string | null
    pipeline_stage?: StringFilter<"Reservation"> | string
    notes?: StringNullableFilter<"Reservation"> | string | null
    uploaded_contract_url?: StringNullableFilter<"Reservation"> | string | null
    address_street?: StringNullableFilter<"Reservation"> | string | null
    address_number?: StringNullableFilter<"Reservation"> | string | null
    address_commune?: StringNullableFilter<"Reservation"> | string | null
    address_region?: StringNullableFilter<"Reservation"> | string | null
    utm_source?: StringNullableFilter<"Reservation"> | string | null
    utm_medium?: StringNullableFilter<"Reservation"> | string | null
    utm_campaign?: StringNullableFilter<"Reservation"> | string | null
    utm_content?: StringNullableFilter<"Reservation"> | string | null
    utm_term?: StringNullableFilter<"Reservation"> | string | null
    pie_status?: StringNullableFilter<"Reservation"> | string | null
    installments_paid?: IntNullableFilter<"Reservation"> | number | null
    signature_otp?: StringNullableFilter<"Reservation"> | string | null
    signature_otp_expires?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    signed_at?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    signature_ip?: StringNullableFilter<"Reservation"> | string | null
    promesa_signature_otp?: StringNullableFilter<"Reservation"> | string | null
    promesa_signature_otp_expires?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    promesa_signed_at?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    promesa_signature_ip?: StringNullableFilter<"Reservation"> | string | null
    contact_id?: StringNullableFilter<"Reservation"> | string | null
    seller_id?: StringNullableFilter<"Reservation"> | string | null
    buyer_id?: StringNullableFilter<"Reservation"> | string | null
    contact?: XOR<ContactNullableScalarRelationFilter, ContactWhereInput> | null
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
    transactions?: WebpayTransactionListRelationFilter
    seller?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    buyer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ReservationOrderByWithRelationInput = {
    id?: SortOrder
    lot_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    rut?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    folio?: SortOrderInput | SortOrder
    status?: SortOrder
    session_id?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    marital_status?: SortOrderInput | SortOrder
    profession?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    pipeline_stage?: SortOrder
    notes?: SortOrderInput | SortOrder
    uploaded_contract_url?: SortOrderInput | SortOrder
    address_street?: SortOrderInput | SortOrder
    address_number?: SortOrderInput | SortOrder
    address_commune?: SortOrderInput | SortOrder
    address_region?: SortOrderInput | SortOrder
    utm_source?: SortOrderInput | SortOrder
    utm_medium?: SortOrderInput | SortOrder
    utm_campaign?: SortOrderInput | SortOrder
    utm_content?: SortOrderInput | SortOrder
    utm_term?: SortOrderInput | SortOrder
    pie_status?: SortOrderInput | SortOrder
    installments_paid?: SortOrderInput | SortOrder
    signature_otp?: SortOrderInput | SortOrder
    signature_otp_expires?: SortOrderInput | SortOrder
    signed_at?: SortOrderInput | SortOrder
    signature_ip?: SortOrderInput | SortOrder
    promesa_signature_otp?: SortOrderInput | SortOrder
    promesa_signature_otp_expires?: SortOrderInput | SortOrder
    promesa_signed_at?: SortOrderInput | SortOrder
    promesa_signature_ip?: SortOrderInput | SortOrder
    contact_id?: SortOrderInput | SortOrder
    seller_id?: SortOrderInput | SortOrder
    buyer_id?: SortOrderInput | SortOrder
    contact?: ContactOrderByWithRelationInput
    lot?: LotOrderByWithRelationInput
    transactions?: WebpayTransactionOrderByRelationAggregateInput
    seller?: UserOrderByWithRelationInput
    buyer?: UserOrderByWithRelationInput
  }

  export type ReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    lot_id?: IntFilter<"Reservation"> | number
    name?: StringFilter<"Reservation"> | string
    email?: StringFilter<"Reservation"> | string
    phone?: StringFilter<"Reservation"> | string
    rut?: StringNullableFilter<"Reservation"> | string | null
    address?: StringNullableFilter<"Reservation"> | string | null
    folio?: StringNullableFilter<"Reservation"> | string | null
    status?: StringFilter<"Reservation"> | string
    session_id?: StringNullableFilter<"Reservation"> | string | null
    expires_at?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    created_at?: DateTimeFilter<"Reservation"> | Date | string
    marital_status?: StringNullableFilter<"Reservation"> | string | null
    profession?: StringNullableFilter<"Reservation"> | string | null
    nationality?: StringNullableFilter<"Reservation"> | string | null
    pipeline_stage?: StringFilter<"Reservation"> | string
    notes?: StringNullableFilter<"Reservation"> | string | null
    uploaded_contract_url?: StringNullableFilter<"Reservation"> | string | null
    address_street?: StringNullableFilter<"Reservation"> | string | null
    address_number?: StringNullableFilter<"Reservation"> | string | null
    address_commune?: StringNullableFilter<"Reservation"> | string | null
    address_region?: StringNullableFilter<"Reservation"> | string | null
    utm_source?: StringNullableFilter<"Reservation"> | string | null
    utm_medium?: StringNullableFilter<"Reservation"> | string | null
    utm_campaign?: StringNullableFilter<"Reservation"> | string | null
    utm_content?: StringNullableFilter<"Reservation"> | string | null
    utm_term?: StringNullableFilter<"Reservation"> | string | null
    pie_status?: StringNullableFilter<"Reservation"> | string | null
    installments_paid?: IntNullableFilter<"Reservation"> | number | null
    signature_otp?: StringNullableFilter<"Reservation"> | string | null
    signature_otp_expires?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    signed_at?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    signature_ip?: StringNullableFilter<"Reservation"> | string | null
    promesa_signature_otp?: StringNullableFilter<"Reservation"> | string | null
    promesa_signature_otp_expires?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    promesa_signed_at?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    promesa_signature_ip?: StringNullableFilter<"Reservation"> | string | null
    contact_id?: StringNullableFilter<"Reservation"> | string | null
    seller_id?: StringNullableFilter<"Reservation"> | string | null
    buyer_id?: StringNullableFilter<"Reservation"> | string | null
    contact?: XOR<ContactNullableScalarRelationFilter, ContactWhereInput> | null
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
    transactions?: WebpayTransactionListRelationFilter
    seller?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    buyer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ReservationOrderByWithAggregationInput = {
    id?: SortOrder
    lot_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    rut?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    folio?: SortOrderInput | SortOrder
    status?: SortOrder
    session_id?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    marital_status?: SortOrderInput | SortOrder
    profession?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    pipeline_stage?: SortOrder
    notes?: SortOrderInput | SortOrder
    uploaded_contract_url?: SortOrderInput | SortOrder
    address_street?: SortOrderInput | SortOrder
    address_number?: SortOrderInput | SortOrder
    address_commune?: SortOrderInput | SortOrder
    address_region?: SortOrderInput | SortOrder
    utm_source?: SortOrderInput | SortOrder
    utm_medium?: SortOrderInput | SortOrder
    utm_campaign?: SortOrderInput | SortOrder
    utm_content?: SortOrderInput | SortOrder
    utm_term?: SortOrderInput | SortOrder
    pie_status?: SortOrderInput | SortOrder
    installments_paid?: SortOrderInput | SortOrder
    signature_otp?: SortOrderInput | SortOrder
    signature_otp_expires?: SortOrderInput | SortOrder
    signed_at?: SortOrderInput | SortOrder
    signature_ip?: SortOrderInput | SortOrder
    promesa_signature_otp?: SortOrderInput | SortOrder
    promesa_signature_otp_expires?: SortOrderInput | SortOrder
    promesa_signed_at?: SortOrderInput | SortOrder
    promesa_signature_ip?: SortOrderInput | SortOrder
    contact_id?: SortOrderInput | SortOrder
    seller_id?: SortOrderInput | SortOrder
    buyer_id?: SortOrderInput | SortOrder
    _count?: ReservationCountOrderByAggregateInput
    _avg?: ReservationAvgOrderByAggregateInput
    _max?: ReservationMaxOrderByAggregateInput
    _min?: ReservationMinOrderByAggregateInput
    _sum?: ReservationSumOrderByAggregateInput
  }

  export type ReservationScalarWhereWithAggregatesInput = {
    AND?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    OR?: ReservationScalarWhereWithAggregatesInput[]
    NOT?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reservation"> | string
    lot_id?: IntWithAggregatesFilter<"Reservation"> | number
    name?: StringWithAggregatesFilter<"Reservation"> | string
    email?: StringWithAggregatesFilter<"Reservation"> | string
    phone?: StringWithAggregatesFilter<"Reservation"> | string
    rut?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    address?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    folio?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    status?: StringWithAggregatesFilter<"Reservation"> | string
    session_id?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    expires_at?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    marital_status?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    profession?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    nationality?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    pipeline_stage?: StringWithAggregatesFilter<"Reservation"> | string
    notes?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    uploaded_contract_url?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    address_street?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    address_number?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    address_commune?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    address_region?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    utm_source?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    utm_medium?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    utm_campaign?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    utm_content?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    utm_term?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    pie_status?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    installments_paid?: IntNullableWithAggregatesFilter<"Reservation"> | number | null
    signature_otp?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    signature_otp_expires?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    signed_at?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    signature_ip?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    promesa_signature_otp?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    promesa_signature_otp_expires?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    promesa_signed_at?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    promesa_signature_ip?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    contact_id?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    seller_id?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    buyer_id?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
  }

  export type LotLockWhereInput = {
    AND?: LotLockWhereInput | LotLockWhereInput[]
    OR?: LotLockWhereInput[]
    NOT?: LotLockWhereInput | LotLockWhereInput[]
    lot_id?: IntFilter<"LotLock"> | number
    locked_by?: StringFilter<"LotLock"> | string
    locked_until?: DateTimeFilter<"LotLock"> | Date | string
    created_at?: DateTimeFilter<"LotLock"> | Date | string
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
  }

  export type LotLockOrderByWithRelationInput = {
    lot_id?: SortOrder
    locked_by?: SortOrder
    locked_until?: SortOrder
    created_at?: SortOrder
    lot?: LotOrderByWithRelationInput
  }

  export type LotLockWhereUniqueInput = Prisma.AtLeast<{
    lot_id?: number
    AND?: LotLockWhereInput | LotLockWhereInput[]
    OR?: LotLockWhereInput[]
    NOT?: LotLockWhereInput | LotLockWhereInput[]
    locked_by?: StringFilter<"LotLock"> | string
    locked_until?: DateTimeFilter<"LotLock"> | Date | string
    created_at?: DateTimeFilter<"LotLock"> | Date | string
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
  }, "lot_id">

  export type LotLockOrderByWithAggregationInput = {
    lot_id?: SortOrder
    locked_by?: SortOrder
    locked_until?: SortOrder
    created_at?: SortOrder
    _count?: LotLockCountOrderByAggregateInput
    _avg?: LotLockAvgOrderByAggregateInput
    _max?: LotLockMaxOrderByAggregateInput
    _min?: LotLockMinOrderByAggregateInput
    _sum?: LotLockSumOrderByAggregateInput
  }

  export type LotLockScalarWhereWithAggregatesInput = {
    AND?: LotLockScalarWhereWithAggregatesInput | LotLockScalarWhereWithAggregatesInput[]
    OR?: LotLockScalarWhereWithAggregatesInput[]
    NOT?: LotLockScalarWhereWithAggregatesInput | LotLockScalarWhereWithAggregatesInput[]
    lot_id?: IntWithAggregatesFilter<"LotLock"> | number
    locked_by?: StringWithAggregatesFilter<"LotLock"> | string
    locked_until?: DateTimeWithAggregatesFilter<"LotLock"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"LotLock"> | Date | string
  }

  export type WebpayTransactionWhereInput = {
    AND?: WebpayTransactionWhereInput | WebpayTransactionWhereInput[]
    OR?: WebpayTransactionWhereInput[]
    NOT?: WebpayTransactionWhereInput | WebpayTransactionWhereInput[]
    id?: StringFilter<"WebpayTransaction"> | string
    token?: StringFilter<"WebpayTransaction"> | string
    buy_order?: StringFilter<"WebpayTransaction"> | string
    amount_clp?: IntFilter<"WebpayTransaction"> | number
    status?: StringNullableFilter<"WebpayTransaction"> | string | null
    response_code?: IntNullableFilter<"WebpayTransaction"> | number | null
    transaction_date?: DateTimeNullableFilter<"WebpayTransaction"> | Date | string | null
    authorization_code?: StringNullableFilter<"WebpayTransaction"> | string | null
    payment_type_code?: StringNullableFilter<"WebpayTransaction"> | string | null
    installments_number?: IntNullableFilter<"WebpayTransaction"> | number | null
    processed_at?: DateTimeNullableFilter<"WebpayTransaction"> | Date | string | null
    scope?: StringNullableFilter<"WebpayTransaction"> | string | null
    installments_count?: IntNullableFilter<"WebpayTransaction"> | number | null
    created_at?: DateTimeFilter<"WebpayTransaction"> | Date | string
    reservation_id?: StringFilter<"WebpayTransaction"> | string
    lot_id?: IntFilter<"WebpayTransaction"> | number
    reservation?: XOR<ReservationScalarRelationFilter, ReservationWhereInput>
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
  }

  export type WebpayTransactionOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    buy_order?: SortOrder
    amount_clp?: SortOrder
    status?: SortOrderInput | SortOrder
    response_code?: SortOrderInput | SortOrder
    transaction_date?: SortOrderInput | SortOrder
    authorization_code?: SortOrderInput | SortOrder
    payment_type_code?: SortOrderInput | SortOrder
    installments_number?: SortOrderInput | SortOrder
    processed_at?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    installments_count?: SortOrderInput | SortOrder
    created_at?: SortOrder
    reservation_id?: SortOrder
    lot_id?: SortOrder
    reservation?: ReservationOrderByWithRelationInput
    lot?: LotOrderByWithRelationInput
  }

  export type WebpayTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: WebpayTransactionWhereInput | WebpayTransactionWhereInput[]
    OR?: WebpayTransactionWhereInput[]
    NOT?: WebpayTransactionWhereInput | WebpayTransactionWhereInput[]
    buy_order?: StringFilter<"WebpayTransaction"> | string
    amount_clp?: IntFilter<"WebpayTransaction"> | number
    status?: StringNullableFilter<"WebpayTransaction"> | string | null
    response_code?: IntNullableFilter<"WebpayTransaction"> | number | null
    transaction_date?: DateTimeNullableFilter<"WebpayTransaction"> | Date | string | null
    authorization_code?: StringNullableFilter<"WebpayTransaction"> | string | null
    payment_type_code?: StringNullableFilter<"WebpayTransaction"> | string | null
    installments_number?: IntNullableFilter<"WebpayTransaction"> | number | null
    processed_at?: DateTimeNullableFilter<"WebpayTransaction"> | Date | string | null
    scope?: StringNullableFilter<"WebpayTransaction"> | string | null
    installments_count?: IntNullableFilter<"WebpayTransaction"> | number | null
    created_at?: DateTimeFilter<"WebpayTransaction"> | Date | string
    reservation_id?: StringFilter<"WebpayTransaction"> | string
    lot_id?: IntFilter<"WebpayTransaction"> | number
    reservation?: XOR<ReservationScalarRelationFilter, ReservationWhereInput>
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
  }, "id" | "token">

  export type WebpayTransactionOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    buy_order?: SortOrder
    amount_clp?: SortOrder
    status?: SortOrderInput | SortOrder
    response_code?: SortOrderInput | SortOrder
    transaction_date?: SortOrderInput | SortOrder
    authorization_code?: SortOrderInput | SortOrder
    payment_type_code?: SortOrderInput | SortOrder
    installments_number?: SortOrderInput | SortOrder
    processed_at?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    installments_count?: SortOrderInput | SortOrder
    created_at?: SortOrder
    reservation_id?: SortOrder
    lot_id?: SortOrder
    _count?: WebpayTransactionCountOrderByAggregateInput
    _avg?: WebpayTransactionAvgOrderByAggregateInput
    _max?: WebpayTransactionMaxOrderByAggregateInput
    _min?: WebpayTransactionMinOrderByAggregateInput
    _sum?: WebpayTransactionSumOrderByAggregateInput
  }

  export type WebpayTransactionScalarWhereWithAggregatesInput = {
    AND?: WebpayTransactionScalarWhereWithAggregatesInput | WebpayTransactionScalarWhereWithAggregatesInput[]
    OR?: WebpayTransactionScalarWhereWithAggregatesInput[]
    NOT?: WebpayTransactionScalarWhereWithAggregatesInput | WebpayTransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WebpayTransaction"> | string
    token?: StringWithAggregatesFilter<"WebpayTransaction"> | string
    buy_order?: StringWithAggregatesFilter<"WebpayTransaction"> | string
    amount_clp?: IntWithAggregatesFilter<"WebpayTransaction"> | number
    status?: StringNullableWithAggregatesFilter<"WebpayTransaction"> | string | null
    response_code?: IntNullableWithAggregatesFilter<"WebpayTransaction"> | number | null
    transaction_date?: DateTimeNullableWithAggregatesFilter<"WebpayTransaction"> | Date | string | null
    authorization_code?: StringNullableWithAggregatesFilter<"WebpayTransaction"> | string | null
    payment_type_code?: StringNullableWithAggregatesFilter<"WebpayTransaction"> | string | null
    installments_number?: IntNullableWithAggregatesFilter<"WebpayTransaction"> | number | null
    processed_at?: DateTimeNullableWithAggregatesFilter<"WebpayTransaction"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"WebpayTransaction"> | string | null
    installments_count?: IntNullableWithAggregatesFilter<"WebpayTransaction"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"WebpayTransaction"> | Date | string
    reservation_id?: StringWithAggregatesFilter<"WebpayTransaction"> | string
    lot_id?: IntWithAggregatesFilter<"WebpayTransaction"> | number
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    mustChangePassword?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    notes?: NoteListRelationFilter
    calls?: CallLogListRelationFilter
    sales?: ReservationListRelationFilter
    purchases?: ReservationListRelationFilter
    auditLogs?: AuditLogListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
    notes?: NoteOrderByRelationAggregateInput
    calls?: CallLogOrderByRelationAggregateInput
    sales?: ReservationOrderByRelationAggregateInput
    purchases?: ReservationOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    mustChangePassword?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    notes?: NoteListRelationFilter
    calls?: CallLogListRelationFilter
    sales?: ReservationListRelationFilter
    purchases?: ReservationListRelationFilter
    auditLogs?: AuditLogListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    mustChangePassword?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    action?: EnumActionTypeFilter<"AuditLog"> | $Enums.ActionType
    entity?: StringFilter<"AuditLog"> | string
    entity_id?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    pk?: StringNullableFilter<"AuditLog"> | string | null
    user_id?: StringNullableFilter<"AuditLog"> | string | null
    user_email?: StringNullableFilter<"AuditLog"> | string | null
    ip_address?: StringNullableFilter<"AuditLog"> | string | null
    user_agent?: StringNullableFilter<"AuditLog"> | string | null
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entity_id?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    pk?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    user_email?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    user_agent?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    action?: EnumActionTypeFilter<"AuditLog"> | $Enums.ActionType
    entity?: StringFilter<"AuditLog"> | string
    entity_id?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    pk?: StringNullableFilter<"AuditLog"> | string | null
    user_id?: StringNullableFilter<"AuditLog"> | string | null
    user_email?: StringNullableFilter<"AuditLog"> | string | null
    ip_address?: StringNullableFilter<"AuditLog"> | string | null
    user_agent?: StringNullableFilter<"AuditLog"> | string | null
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entity_id?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    pk?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    user_email?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    user_agent?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: EnumActionTypeWithAggregatesFilter<"AuditLog"> | $Enums.ActionType
    entity?: StringWithAggregatesFilter<"AuditLog"> | string
    entity_id?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    details?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    pk?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    user_id?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    user_email?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    ip_address?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    user_agent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    user_id?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    user_id?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    user_id?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type LotCreateInput = {
    number?: string | null
    stage?: number | null
    area_m2?: number | null
    price_total_clp?: number | null
    reservation_amount_clp?: number | null
    status?: string
    cuotas?: number | null
    pie?: number | null
    valor_cuota?: number | null
    last_installment_amount?: number | null
    reserved_until?: Date | string | null
    reserved_at?: Date | string | null
    reserved_by?: string | null
    order_id?: string | null
    updated_at?: Date | string | null
    reservations?: ReservationCreateNestedManyWithoutLotInput
    locks?: LotLockCreateNestedManyWithoutLotInput
    transactions?: WebpayTransactionCreateNestedManyWithoutLotInput
  }

  export type LotUncheckedCreateInput = {
    id?: number
    number?: string | null
    stage?: number | null
    area_m2?: number | null
    price_total_clp?: number | null
    reservation_amount_clp?: number | null
    status?: string
    cuotas?: number | null
    pie?: number | null
    valor_cuota?: number | null
    last_installment_amount?: number | null
    reserved_until?: Date | string | null
    reserved_at?: Date | string | null
    reserved_by?: string | null
    order_id?: string | null
    updated_at?: Date | string | null
    reservations?: ReservationUncheckedCreateNestedManyWithoutLotInput
    locks?: LotLockUncheckedCreateNestedManyWithoutLotInput
    transactions?: WebpayTransactionUncheckedCreateNestedManyWithoutLotInput
  }

  export type LotUpdateInput = {
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservations?: ReservationUpdateManyWithoutLotNestedInput
    locks?: LotLockUpdateManyWithoutLotNestedInput
    transactions?: WebpayTransactionUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservations?: ReservationUncheckedUpdateManyWithoutLotNestedInput
    locks?: LotLockUncheckedUpdateManyWithoutLotNestedInput
    transactions?: WebpayTransactionUncheckedUpdateManyWithoutLotNestedInput
  }

  export type LotCreateManyInput = {
    id?: number
    number?: string | null
    stage?: number | null
    area_m2?: number | null
    price_total_clp?: number | null
    reservation_amount_clp?: number | null
    status?: string
    cuotas?: number | null
    pie?: number | null
    valor_cuota?: number | null
    last_installment_amount?: number | null
    reserved_until?: Date | string | null
    reserved_at?: Date | string | null
    reserved_by?: string | null
    order_id?: string | null
    updated_at?: Date | string | null
  }

  export type LotUpdateManyMutationInput = {
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LotUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ContactCreateInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    reservations?: ReservationCreateNestedManyWithoutContactInput
    notes?: NoteCreateNestedManyWithoutContactInput
    calls?: CallLogCreateNestedManyWithoutContactInput
    files?: ContactFileCreateNestedManyWithoutContactInput
  }

  export type ContactUncheckedCreateInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    reservations?: ReservationUncheckedCreateNestedManyWithoutContactInput
    notes?: NoteUncheckedCreateNestedManyWithoutContactInput
    calls?: CallLogUncheckedCreateNestedManyWithoutContactInput
    files?: ContactFileUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUpdateManyWithoutContactNestedInput
    notes?: NoteUpdateManyWithoutContactNestedInput
    calls?: CallLogUpdateManyWithoutContactNestedInput
    files?: ContactFileUpdateManyWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUncheckedUpdateManyWithoutContactNestedInput
    notes?: NoteUncheckedUpdateManyWithoutContactNestedInput
    calls?: CallLogUncheckedUpdateManyWithoutContactNestedInput
    files?: ContactFileUncheckedUpdateManyWithoutContactNestedInput
  }

  export type ContactCreateManyInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ContactUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteCreateInput = {
    id?: string
    content: string
    created_at?: Date | string
    contact: ContactCreateNestedOneWithoutNotesInput
    seller: UserCreateNestedOneWithoutNotesInput
  }

  export type NoteUncheckedCreateInput = {
    id?: string
    contact_id: string
    seller_id: string
    content: string
    created_at?: Date | string
  }

  export type NoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneRequiredWithoutNotesNestedInput
    seller?: UserUpdateOneRequiredWithoutNotesNestedInput
  }

  export type NoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteCreateManyInput = {
    id?: string
    contact_id: string
    seller_id: string
    content: string
    created_at?: Date | string
  }

  export type NoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallLogCreateInput = {
    id?: string
    duration?: number | null
    summary?: string | null
    date?: Date | string
    contact: ContactCreateNestedOneWithoutCallsInput
    seller: UserCreateNestedOneWithoutCallsInput
  }

  export type CallLogUncheckedCreateInput = {
    id?: string
    contact_id: string
    seller_id: string
    duration?: number | null
    summary?: string | null
    date?: Date | string
  }

  export type CallLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneRequiredWithoutCallsNestedInput
    seller?: UserUpdateOneRequiredWithoutCallsNestedInput
  }

  export type CallLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallLogCreateManyInput = {
    id?: string
    contact_id: string
    seller_id: string
    duration?: number | null
    summary?: string | null
    date?: Date | string
  }

  export type CallLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactFileCreateInput = {
    id?: string
    name: string
    url: string
    type?: string | null
    created_at?: Date | string
    contact: ContactCreateNestedOneWithoutFilesInput
  }

  export type ContactFileUncheckedCreateInput = {
    id?: string
    contact_id: string
    name: string
    url: string
    type?: string | null
    created_at?: Date | string
  }

  export type ContactFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneRequiredWithoutFilesNestedInput
  }

  export type ContactFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactFileCreateManyInput = {
    id?: string
    contact_id: string
    name: string
    url: string
    type?: string | null
    created_at?: Date | string
  }

  export type ContactFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationCreateInput = {
    id?: string
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact?: ContactCreateNestedOneWithoutReservationsInput
    lot: LotCreateNestedOneWithoutReservationsInput
    transactions?: WebpayTransactionCreateNestedManyWithoutReservationInput
    seller?: UserCreateNestedOneWithoutSalesInput
    buyer?: UserCreateNestedOneWithoutPurchasesInput
  }

  export type ReservationUncheckedCreateInput = {
    id?: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact_id?: string | null
    seller_id?: string | null
    buyer_id?: string | null
    transactions?: WebpayTransactionUncheckedCreateNestedManyWithoutReservationInput
  }

  export type ReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: ContactUpdateOneWithoutReservationsNestedInput
    lot?: LotUpdateOneRequiredWithoutReservationsNestedInput
    transactions?: WebpayTransactionUpdateManyWithoutReservationNestedInput
    seller?: UserUpdateOneWithoutSalesNestedInput
    buyer?: UserUpdateOneWithoutPurchasesNestedInput
  }

  export type ReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact_id?: NullableStringFieldUpdateOperationsInput | string | null
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    buyer_id?: NullableStringFieldUpdateOperationsInput | string | null
    transactions?: WebpayTransactionUncheckedUpdateManyWithoutReservationNestedInput
  }

  export type ReservationCreateManyInput = {
    id?: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact_id?: string | null
    seller_id?: string | null
    buyer_id?: string | null
  }

  export type ReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact_id?: NullableStringFieldUpdateOperationsInput | string | null
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    buyer_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LotLockCreateInput = {
    locked_by: string
    locked_until: Date | string
    created_at?: Date | string
    lot: LotCreateNestedOneWithoutLocksInput
  }

  export type LotLockUncheckedCreateInput = {
    lot_id: number
    locked_by: string
    locked_until: Date | string
    created_at?: Date | string
  }

  export type LotLockUpdateInput = {
    locked_by?: StringFieldUpdateOperationsInput | string
    locked_until?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    lot?: LotUpdateOneRequiredWithoutLocksNestedInput
  }

  export type LotLockUncheckedUpdateInput = {
    lot_id?: IntFieldUpdateOperationsInput | number
    locked_by?: StringFieldUpdateOperationsInput | string
    locked_until?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LotLockCreateManyInput = {
    lot_id: number
    locked_by: string
    locked_until: Date | string
    created_at?: Date | string
  }

  export type LotLockUpdateManyMutationInput = {
    locked_by?: StringFieldUpdateOperationsInput | string
    locked_until?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LotLockUncheckedUpdateManyInput = {
    lot_id?: IntFieldUpdateOperationsInput | number
    locked_by?: StringFieldUpdateOperationsInput | string
    locked_until?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebpayTransactionCreateInput = {
    id?: string
    token: string
    buy_order: string
    amount_clp: number
    status?: string | null
    response_code?: number | null
    transaction_date?: Date | string | null
    authorization_code?: string | null
    payment_type_code?: string | null
    installments_number?: number | null
    processed_at?: Date | string | null
    scope?: string | null
    installments_count?: number | null
    created_at?: Date | string
    reservation: ReservationCreateNestedOneWithoutTransactionsInput
    lot: LotCreateNestedOneWithoutTransactionsInput
  }

  export type WebpayTransactionUncheckedCreateInput = {
    id?: string
    token: string
    buy_order: string
    amount_clp: number
    status?: string | null
    response_code?: number | null
    transaction_date?: Date | string | null
    authorization_code?: string | null
    payment_type_code?: string | null
    installments_number?: number | null
    processed_at?: Date | string | null
    scope?: string | null
    installments_count?: number | null
    created_at?: Date | string
    reservation_id: string
    lot_id: number
  }

  export type WebpayTransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation?: ReservationUpdateOneRequiredWithoutTransactionsNestedInput
    lot?: LotUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type WebpayTransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation_id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
  }

  export type WebpayTransactionCreateManyInput = {
    id?: string
    token: string
    buy_order: string
    amount_clp: number
    status?: string | null
    response_code?: number | null
    transaction_date?: Date | string | null
    authorization_code?: string | null
    payment_type_code?: string | null
    installments_number?: number | null
    processed_at?: Date | string | null
    scope?: string | null
    installments_count?: number | null
    created_at?: Date | string
    reservation_id: string
    lot_id: number
  }

  export type WebpayTransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebpayTransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation_id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteCreateNestedManyWithoutSellerInput
    calls?: CallLogCreateNestedManyWithoutSellerInput
    sales?: ReservationCreateNestedManyWithoutSellerInput
    purchases?: ReservationCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutSellerInput
    calls?: CallLogUncheckedCreateNestedManyWithoutSellerInput
    sales?: ReservationUncheckedCreateNestedManyWithoutSellerInput
    purchases?: ReservationUncheckedCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutSellerNestedInput
    calls?: CallLogUpdateManyWithoutSellerNestedInput
    sales?: ReservationUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutSellerNestedInput
    calls?: CallLogUncheckedUpdateManyWithoutSellerNestedInput
    sales?: ReservationUncheckedUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUncheckedUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action: $Enums.ActionType
    entity: string
    entity_id?: string | null
    details?: string | null
    pk?: string | null
    user_email?: string | null
    ip_address?: string | null
    user_agent?: string | null
    created_at?: Date | string
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    action: $Enums.ActionType
    entity: string
    entity_id?: string | null
    details?: string | null
    pk?: string | null
    user_id?: string | null
    user_email?: string | null
    ip_address?: string | null
    user_agent?: string | null
    created_at?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    entity?: StringFieldUpdateOperationsInput | string
    entity_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    pk?: NullableStringFieldUpdateOperationsInput | string | null
    user_email?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_agent?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    entity?: StringFieldUpdateOperationsInput | string
    entity_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    pk?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_email?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_agent?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    action: $Enums.ActionType
    entity: string
    entity_id?: string | null
    details?: string | null
    pk?: string | null
    user_id?: string | null
    user_email?: string | null
    ip_address?: string | null
    user_agent?: string | null
    created_at?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    entity?: StringFieldUpdateOperationsInput | string
    entity_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    pk?: NullableStringFieldUpdateOperationsInput | string | null
    user_email?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_agent?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    entity?: StringFieldUpdateOperationsInput | string
    entity_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    pk?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_email?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_agent?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    type: string
    title: string
    message: string
    read?: boolean
    created_at?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    user_id: string
    type: string
    title: string
    message: string
    read?: boolean
    created_at?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    user_id: string
    type: string
    title: string
    message: string
    read?: boolean
    created_at?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ReservationListRelationFilter = {
    every?: ReservationWhereInput
    some?: ReservationWhereInput
    none?: ReservationWhereInput
  }

  export type LotLockListRelationFilter = {
    every?: LotLockWhereInput
    some?: LotLockWhereInput
    none?: LotLockWhereInput
  }

  export type WebpayTransactionListRelationFilter = {
    every?: WebpayTransactionWhereInput
    some?: WebpayTransactionWhereInput
    none?: WebpayTransactionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ReservationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LotLockOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WebpayTransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LotCountOrderByAggregateInput = {
    id?: SortOrder
    number?: SortOrder
    stage?: SortOrder
    area_m2?: SortOrder
    price_total_clp?: SortOrder
    reservation_amount_clp?: SortOrder
    status?: SortOrder
    cuotas?: SortOrder
    pie?: SortOrder
    valor_cuota?: SortOrder
    last_installment_amount?: SortOrder
    reserved_until?: SortOrder
    reserved_at?: SortOrder
    reserved_by?: SortOrder
    order_id?: SortOrder
    updated_at?: SortOrder
  }

  export type LotAvgOrderByAggregateInput = {
    id?: SortOrder
    stage?: SortOrder
    area_m2?: SortOrder
    price_total_clp?: SortOrder
    reservation_amount_clp?: SortOrder
    cuotas?: SortOrder
    pie?: SortOrder
    valor_cuota?: SortOrder
    last_installment_amount?: SortOrder
  }

  export type LotMaxOrderByAggregateInput = {
    id?: SortOrder
    number?: SortOrder
    stage?: SortOrder
    area_m2?: SortOrder
    price_total_clp?: SortOrder
    reservation_amount_clp?: SortOrder
    status?: SortOrder
    cuotas?: SortOrder
    pie?: SortOrder
    valor_cuota?: SortOrder
    last_installment_amount?: SortOrder
    reserved_until?: SortOrder
    reserved_at?: SortOrder
    reserved_by?: SortOrder
    order_id?: SortOrder
    updated_at?: SortOrder
  }

  export type LotMinOrderByAggregateInput = {
    id?: SortOrder
    number?: SortOrder
    stage?: SortOrder
    area_m2?: SortOrder
    price_total_clp?: SortOrder
    reservation_amount_clp?: SortOrder
    status?: SortOrder
    cuotas?: SortOrder
    pie?: SortOrder
    valor_cuota?: SortOrder
    last_installment_amount?: SortOrder
    reserved_until?: SortOrder
    reserved_at?: SortOrder
    reserved_by?: SortOrder
    order_id?: SortOrder
    updated_at?: SortOrder
  }

  export type LotSumOrderByAggregateInput = {
    id?: SortOrder
    stage?: SortOrder
    area_m2?: SortOrder
    price_total_clp?: SortOrder
    reservation_amount_clp?: SortOrder
    cuotas?: SortOrder
    pie?: SortOrder
    valor_cuota?: SortOrder
    last_installment_amount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NoteListRelationFilter = {
    every?: NoteWhereInput
    some?: NoteWhereInput
    none?: NoteWhereInput
  }

  export type CallLogListRelationFilter = {
    every?: CallLogWhereInput
    some?: CallLogWhereInput
    none?: CallLogWhereInput
  }

  export type ContactFileListRelationFilter = {
    every?: ContactFileWhereInput
    some?: ContactFileWhereInput
    none?: ContactFileWhereInput
  }

  export type NoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CallLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContactFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContactCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    phone?: SortOrder
    rut?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ContactMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    phone?: SortOrder
    rut?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ContactMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    phone?: SortOrder
    rut?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ContactScalarRelationFilter = {
    is?: ContactWhereInput
    isNot?: ContactWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type NoteCountOrderByAggregateInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
  }

  export type NoteMaxOrderByAggregateInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
  }

  export type NoteMinOrderByAggregateInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
  }

  export type CallLogCountOrderByAggregateInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    duration?: SortOrder
    summary?: SortOrder
    date?: SortOrder
  }

  export type CallLogAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type CallLogMaxOrderByAggregateInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    duration?: SortOrder
    summary?: SortOrder
    date?: SortOrder
  }

  export type CallLogMinOrderByAggregateInput = {
    id?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    duration?: SortOrder
    summary?: SortOrder
    date?: SortOrder
  }

  export type CallLogSumOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type ContactFileCountOrderByAggregateInput = {
    id?: SortOrder
    contact_id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
  }

  export type ContactFileMaxOrderByAggregateInput = {
    id?: SortOrder
    contact_id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
  }

  export type ContactFileMinOrderByAggregateInput = {
    id?: SortOrder
    contact_id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
  }

  export type ContactNullableScalarRelationFilter = {
    is?: ContactWhereInput | null
    isNot?: ContactWhereInput | null
  }

  export type LotScalarRelationFilter = {
    is?: LotWhereInput
    isNot?: LotWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ReservationCountOrderByAggregateInput = {
    id?: SortOrder
    lot_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    rut?: SortOrder
    address?: SortOrder
    folio?: SortOrder
    status?: SortOrder
    session_id?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
    marital_status?: SortOrder
    profession?: SortOrder
    nationality?: SortOrder
    pipeline_stage?: SortOrder
    notes?: SortOrder
    uploaded_contract_url?: SortOrder
    address_street?: SortOrder
    address_number?: SortOrder
    address_commune?: SortOrder
    address_region?: SortOrder
    utm_source?: SortOrder
    utm_medium?: SortOrder
    utm_campaign?: SortOrder
    utm_content?: SortOrder
    utm_term?: SortOrder
    pie_status?: SortOrder
    installments_paid?: SortOrder
    signature_otp?: SortOrder
    signature_otp_expires?: SortOrder
    signed_at?: SortOrder
    signature_ip?: SortOrder
    promesa_signature_otp?: SortOrder
    promesa_signature_otp_expires?: SortOrder
    promesa_signed_at?: SortOrder
    promesa_signature_ip?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    buyer_id?: SortOrder
  }

  export type ReservationAvgOrderByAggregateInput = {
    lot_id?: SortOrder
    installments_paid?: SortOrder
  }

  export type ReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    lot_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    rut?: SortOrder
    address?: SortOrder
    folio?: SortOrder
    status?: SortOrder
    session_id?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
    marital_status?: SortOrder
    profession?: SortOrder
    nationality?: SortOrder
    pipeline_stage?: SortOrder
    notes?: SortOrder
    uploaded_contract_url?: SortOrder
    address_street?: SortOrder
    address_number?: SortOrder
    address_commune?: SortOrder
    address_region?: SortOrder
    utm_source?: SortOrder
    utm_medium?: SortOrder
    utm_campaign?: SortOrder
    utm_content?: SortOrder
    utm_term?: SortOrder
    pie_status?: SortOrder
    installments_paid?: SortOrder
    signature_otp?: SortOrder
    signature_otp_expires?: SortOrder
    signed_at?: SortOrder
    signature_ip?: SortOrder
    promesa_signature_otp?: SortOrder
    promesa_signature_otp_expires?: SortOrder
    promesa_signed_at?: SortOrder
    promesa_signature_ip?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    buyer_id?: SortOrder
  }

  export type ReservationMinOrderByAggregateInput = {
    id?: SortOrder
    lot_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    rut?: SortOrder
    address?: SortOrder
    folio?: SortOrder
    status?: SortOrder
    session_id?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
    marital_status?: SortOrder
    profession?: SortOrder
    nationality?: SortOrder
    pipeline_stage?: SortOrder
    notes?: SortOrder
    uploaded_contract_url?: SortOrder
    address_street?: SortOrder
    address_number?: SortOrder
    address_commune?: SortOrder
    address_region?: SortOrder
    utm_source?: SortOrder
    utm_medium?: SortOrder
    utm_campaign?: SortOrder
    utm_content?: SortOrder
    utm_term?: SortOrder
    pie_status?: SortOrder
    installments_paid?: SortOrder
    signature_otp?: SortOrder
    signature_otp_expires?: SortOrder
    signed_at?: SortOrder
    signature_ip?: SortOrder
    promesa_signature_otp?: SortOrder
    promesa_signature_otp_expires?: SortOrder
    promesa_signed_at?: SortOrder
    promesa_signature_ip?: SortOrder
    contact_id?: SortOrder
    seller_id?: SortOrder
    buyer_id?: SortOrder
  }

  export type ReservationSumOrderByAggregateInput = {
    lot_id?: SortOrder
    installments_paid?: SortOrder
  }

  export type LotLockCountOrderByAggregateInput = {
    lot_id?: SortOrder
    locked_by?: SortOrder
    locked_until?: SortOrder
    created_at?: SortOrder
  }

  export type LotLockAvgOrderByAggregateInput = {
    lot_id?: SortOrder
  }

  export type LotLockMaxOrderByAggregateInput = {
    lot_id?: SortOrder
    locked_by?: SortOrder
    locked_until?: SortOrder
    created_at?: SortOrder
  }

  export type LotLockMinOrderByAggregateInput = {
    lot_id?: SortOrder
    locked_by?: SortOrder
    locked_until?: SortOrder
    created_at?: SortOrder
  }

  export type LotLockSumOrderByAggregateInput = {
    lot_id?: SortOrder
  }

  export type ReservationScalarRelationFilter = {
    is?: ReservationWhereInput
    isNot?: ReservationWhereInput
  }

  export type WebpayTransactionCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    buy_order?: SortOrder
    amount_clp?: SortOrder
    status?: SortOrder
    response_code?: SortOrder
    transaction_date?: SortOrder
    authorization_code?: SortOrder
    payment_type_code?: SortOrder
    installments_number?: SortOrder
    processed_at?: SortOrder
    scope?: SortOrder
    installments_count?: SortOrder
    created_at?: SortOrder
    reservation_id?: SortOrder
    lot_id?: SortOrder
  }

  export type WebpayTransactionAvgOrderByAggregateInput = {
    amount_clp?: SortOrder
    response_code?: SortOrder
    installments_number?: SortOrder
    installments_count?: SortOrder
    lot_id?: SortOrder
  }

  export type WebpayTransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    buy_order?: SortOrder
    amount_clp?: SortOrder
    status?: SortOrder
    response_code?: SortOrder
    transaction_date?: SortOrder
    authorization_code?: SortOrder
    payment_type_code?: SortOrder
    installments_number?: SortOrder
    processed_at?: SortOrder
    scope?: SortOrder
    installments_count?: SortOrder
    created_at?: SortOrder
    reservation_id?: SortOrder
    lot_id?: SortOrder
  }

  export type WebpayTransactionMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    buy_order?: SortOrder
    amount_clp?: SortOrder
    status?: SortOrder
    response_code?: SortOrder
    transaction_date?: SortOrder
    authorization_code?: SortOrder
    payment_type_code?: SortOrder
    installments_number?: SortOrder
    processed_at?: SortOrder
    scope?: SortOrder
    installments_count?: SortOrder
    created_at?: SortOrder
    reservation_id?: SortOrder
    lot_id?: SortOrder
  }

  export type WebpayTransactionSumOrderByAggregateInput = {
    amount_clp?: SortOrder
    response_code?: SortOrder
    installments_number?: SortOrder
    installments_count?: SortOrder
    lot_id?: SortOrder
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumActionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeFilter<$PrismaModel> | $Enums.ActionType
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entity_id?: SortOrder
    details?: SortOrder
    pk?: SortOrder
    user_id?: SortOrder
    user_email?: SortOrder
    ip_address?: SortOrder
    user_agent?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entity_id?: SortOrder
    details?: SortOrder
    pk?: SortOrder
    user_id?: SortOrder
    user_email?: SortOrder
    ip_address?: SortOrder
    user_agent?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entity_id?: SortOrder
    details?: SortOrder
    pk?: SortOrder
    user_id?: SortOrder
    user_email?: SortOrder
    ip_address?: SortOrder
    user_agent?: SortOrder
    created_at?: SortOrder
  }

  export type EnumActionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionTypeFilter<$PrismaModel>
    _max?: NestedEnumActionTypeFilter<$PrismaModel>
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
  }

  export type ReservationCreateNestedManyWithoutLotInput = {
    create?: XOR<ReservationCreateWithoutLotInput, ReservationUncheckedCreateWithoutLotInput> | ReservationCreateWithoutLotInput[] | ReservationUncheckedCreateWithoutLotInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutLotInput | ReservationCreateOrConnectWithoutLotInput[]
    createMany?: ReservationCreateManyLotInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type LotLockCreateNestedManyWithoutLotInput = {
    create?: XOR<LotLockCreateWithoutLotInput, LotLockUncheckedCreateWithoutLotInput> | LotLockCreateWithoutLotInput[] | LotLockUncheckedCreateWithoutLotInput[]
    connectOrCreate?: LotLockCreateOrConnectWithoutLotInput | LotLockCreateOrConnectWithoutLotInput[]
    createMany?: LotLockCreateManyLotInputEnvelope
    connect?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
  }

  export type WebpayTransactionCreateNestedManyWithoutLotInput = {
    create?: XOR<WebpayTransactionCreateWithoutLotInput, WebpayTransactionUncheckedCreateWithoutLotInput> | WebpayTransactionCreateWithoutLotInput[] | WebpayTransactionUncheckedCreateWithoutLotInput[]
    connectOrCreate?: WebpayTransactionCreateOrConnectWithoutLotInput | WebpayTransactionCreateOrConnectWithoutLotInput[]
    createMany?: WebpayTransactionCreateManyLotInputEnvelope
    connect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
  }

  export type ReservationUncheckedCreateNestedManyWithoutLotInput = {
    create?: XOR<ReservationCreateWithoutLotInput, ReservationUncheckedCreateWithoutLotInput> | ReservationCreateWithoutLotInput[] | ReservationUncheckedCreateWithoutLotInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutLotInput | ReservationCreateOrConnectWithoutLotInput[]
    createMany?: ReservationCreateManyLotInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type LotLockUncheckedCreateNestedManyWithoutLotInput = {
    create?: XOR<LotLockCreateWithoutLotInput, LotLockUncheckedCreateWithoutLotInput> | LotLockCreateWithoutLotInput[] | LotLockUncheckedCreateWithoutLotInput[]
    connectOrCreate?: LotLockCreateOrConnectWithoutLotInput | LotLockCreateOrConnectWithoutLotInput[]
    createMany?: LotLockCreateManyLotInputEnvelope
    connect?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
  }

  export type WebpayTransactionUncheckedCreateNestedManyWithoutLotInput = {
    create?: XOR<WebpayTransactionCreateWithoutLotInput, WebpayTransactionUncheckedCreateWithoutLotInput> | WebpayTransactionCreateWithoutLotInput[] | WebpayTransactionUncheckedCreateWithoutLotInput[]
    connectOrCreate?: WebpayTransactionCreateOrConnectWithoutLotInput | WebpayTransactionCreateOrConnectWithoutLotInput[]
    createMany?: WebpayTransactionCreateManyLotInputEnvelope
    connect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ReservationUpdateManyWithoutLotNestedInput = {
    create?: XOR<ReservationCreateWithoutLotInput, ReservationUncheckedCreateWithoutLotInput> | ReservationCreateWithoutLotInput[] | ReservationUncheckedCreateWithoutLotInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutLotInput | ReservationCreateOrConnectWithoutLotInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutLotInput | ReservationUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: ReservationCreateManyLotInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutLotInput | ReservationUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutLotInput | ReservationUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type LotLockUpdateManyWithoutLotNestedInput = {
    create?: XOR<LotLockCreateWithoutLotInput, LotLockUncheckedCreateWithoutLotInput> | LotLockCreateWithoutLotInput[] | LotLockUncheckedCreateWithoutLotInput[]
    connectOrCreate?: LotLockCreateOrConnectWithoutLotInput | LotLockCreateOrConnectWithoutLotInput[]
    upsert?: LotLockUpsertWithWhereUniqueWithoutLotInput | LotLockUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: LotLockCreateManyLotInputEnvelope
    set?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
    disconnect?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
    delete?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
    connect?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
    update?: LotLockUpdateWithWhereUniqueWithoutLotInput | LotLockUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: LotLockUpdateManyWithWhereWithoutLotInput | LotLockUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: LotLockScalarWhereInput | LotLockScalarWhereInput[]
  }

  export type WebpayTransactionUpdateManyWithoutLotNestedInput = {
    create?: XOR<WebpayTransactionCreateWithoutLotInput, WebpayTransactionUncheckedCreateWithoutLotInput> | WebpayTransactionCreateWithoutLotInput[] | WebpayTransactionUncheckedCreateWithoutLotInput[]
    connectOrCreate?: WebpayTransactionCreateOrConnectWithoutLotInput | WebpayTransactionCreateOrConnectWithoutLotInput[]
    upsert?: WebpayTransactionUpsertWithWhereUniqueWithoutLotInput | WebpayTransactionUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: WebpayTransactionCreateManyLotInputEnvelope
    set?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    disconnect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    delete?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    connect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    update?: WebpayTransactionUpdateWithWhereUniqueWithoutLotInput | WebpayTransactionUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: WebpayTransactionUpdateManyWithWhereWithoutLotInput | WebpayTransactionUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: WebpayTransactionScalarWhereInput | WebpayTransactionScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ReservationUncheckedUpdateManyWithoutLotNestedInput = {
    create?: XOR<ReservationCreateWithoutLotInput, ReservationUncheckedCreateWithoutLotInput> | ReservationCreateWithoutLotInput[] | ReservationUncheckedCreateWithoutLotInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutLotInput | ReservationCreateOrConnectWithoutLotInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutLotInput | ReservationUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: ReservationCreateManyLotInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutLotInput | ReservationUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutLotInput | ReservationUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type LotLockUncheckedUpdateManyWithoutLotNestedInput = {
    create?: XOR<LotLockCreateWithoutLotInput, LotLockUncheckedCreateWithoutLotInput> | LotLockCreateWithoutLotInput[] | LotLockUncheckedCreateWithoutLotInput[]
    connectOrCreate?: LotLockCreateOrConnectWithoutLotInput | LotLockCreateOrConnectWithoutLotInput[]
    upsert?: LotLockUpsertWithWhereUniqueWithoutLotInput | LotLockUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: LotLockCreateManyLotInputEnvelope
    set?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
    disconnect?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
    delete?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
    connect?: LotLockWhereUniqueInput | LotLockWhereUniqueInput[]
    update?: LotLockUpdateWithWhereUniqueWithoutLotInput | LotLockUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: LotLockUpdateManyWithWhereWithoutLotInput | LotLockUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: LotLockScalarWhereInput | LotLockScalarWhereInput[]
  }

  export type WebpayTransactionUncheckedUpdateManyWithoutLotNestedInput = {
    create?: XOR<WebpayTransactionCreateWithoutLotInput, WebpayTransactionUncheckedCreateWithoutLotInput> | WebpayTransactionCreateWithoutLotInput[] | WebpayTransactionUncheckedCreateWithoutLotInput[]
    connectOrCreate?: WebpayTransactionCreateOrConnectWithoutLotInput | WebpayTransactionCreateOrConnectWithoutLotInput[]
    upsert?: WebpayTransactionUpsertWithWhereUniqueWithoutLotInput | WebpayTransactionUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: WebpayTransactionCreateManyLotInputEnvelope
    set?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    disconnect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    delete?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    connect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    update?: WebpayTransactionUpdateWithWhereUniqueWithoutLotInput | WebpayTransactionUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: WebpayTransactionUpdateManyWithWhereWithoutLotInput | WebpayTransactionUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: WebpayTransactionScalarWhereInput | WebpayTransactionScalarWhereInput[]
  }

  export type ReservationCreateNestedManyWithoutContactInput = {
    create?: XOR<ReservationCreateWithoutContactInput, ReservationUncheckedCreateWithoutContactInput> | ReservationCreateWithoutContactInput[] | ReservationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutContactInput | ReservationCreateOrConnectWithoutContactInput[]
    createMany?: ReservationCreateManyContactInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type NoteCreateNestedManyWithoutContactInput = {
    create?: XOR<NoteCreateWithoutContactInput, NoteUncheckedCreateWithoutContactInput> | NoteCreateWithoutContactInput[] | NoteUncheckedCreateWithoutContactInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutContactInput | NoteCreateOrConnectWithoutContactInput[]
    createMany?: NoteCreateManyContactInputEnvelope
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
  }

  export type CallLogCreateNestedManyWithoutContactInput = {
    create?: XOR<CallLogCreateWithoutContactInput, CallLogUncheckedCreateWithoutContactInput> | CallLogCreateWithoutContactInput[] | CallLogUncheckedCreateWithoutContactInput[]
    connectOrCreate?: CallLogCreateOrConnectWithoutContactInput | CallLogCreateOrConnectWithoutContactInput[]
    createMany?: CallLogCreateManyContactInputEnvelope
    connect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
  }

  export type ContactFileCreateNestedManyWithoutContactInput = {
    create?: XOR<ContactFileCreateWithoutContactInput, ContactFileUncheckedCreateWithoutContactInput> | ContactFileCreateWithoutContactInput[] | ContactFileUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ContactFileCreateOrConnectWithoutContactInput | ContactFileCreateOrConnectWithoutContactInput[]
    createMany?: ContactFileCreateManyContactInputEnvelope
    connect?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
  }

  export type ReservationUncheckedCreateNestedManyWithoutContactInput = {
    create?: XOR<ReservationCreateWithoutContactInput, ReservationUncheckedCreateWithoutContactInput> | ReservationCreateWithoutContactInput[] | ReservationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutContactInput | ReservationCreateOrConnectWithoutContactInput[]
    createMany?: ReservationCreateManyContactInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type NoteUncheckedCreateNestedManyWithoutContactInput = {
    create?: XOR<NoteCreateWithoutContactInput, NoteUncheckedCreateWithoutContactInput> | NoteCreateWithoutContactInput[] | NoteUncheckedCreateWithoutContactInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutContactInput | NoteCreateOrConnectWithoutContactInput[]
    createMany?: NoteCreateManyContactInputEnvelope
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
  }

  export type CallLogUncheckedCreateNestedManyWithoutContactInput = {
    create?: XOR<CallLogCreateWithoutContactInput, CallLogUncheckedCreateWithoutContactInput> | CallLogCreateWithoutContactInput[] | CallLogUncheckedCreateWithoutContactInput[]
    connectOrCreate?: CallLogCreateOrConnectWithoutContactInput | CallLogCreateOrConnectWithoutContactInput[]
    createMany?: CallLogCreateManyContactInputEnvelope
    connect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
  }

  export type ContactFileUncheckedCreateNestedManyWithoutContactInput = {
    create?: XOR<ContactFileCreateWithoutContactInput, ContactFileUncheckedCreateWithoutContactInput> | ContactFileCreateWithoutContactInput[] | ContactFileUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ContactFileCreateOrConnectWithoutContactInput | ContactFileCreateOrConnectWithoutContactInput[]
    createMany?: ContactFileCreateManyContactInputEnvelope
    connect?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ReservationUpdateManyWithoutContactNestedInput = {
    create?: XOR<ReservationCreateWithoutContactInput, ReservationUncheckedCreateWithoutContactInput> | ReservationCreateWithoutContactInput[] | ReservationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutContactInput | ReservationCreateOrConnectWithoutContactInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutContactInput | ReservationUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: ReservationCreateManyContactInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutContactInput | ReservationUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutContactInput | ReservationUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type NoteUpdateManyWithoutContactNestedInput = {
    create?: XOR<NoteCreateWithoutContactInput, NoteUncheckedCreateWithoutContactInput> | NoteCreateWithoutContactInput[] | NoteUncheckedCreateWithoutContactInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutContactInput | NoteCreateOrConnectWithoutContactInput[]
    upsert?: NoteUpsertWithWhereUniqueWithoutContactInput | NoteUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: NoteCreateManyContactInputEnvelope
    set?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    disconnect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    delete?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    update?: NoteUpdateWithWhereUniqueWithoutContactInput | NoteUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: NoteUpdateManyWithWhereWithoutContactInput | NoteUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: NoteScalarWhereInput | NoteScalarWhereInput[]
  }

  export type CallLogUpdateManyWithoutContactNestedInput = {
    create?: XOR<CallLogCreateWithoutContactInput, CallLogUncheckedCreateWithoutContactInput> | CallLogCreateWithoutContactInput[] | CallLogUncheckedCreateWithoutContactInput[]
    connectOrCreate?: CallLogCreateOrConnectWithoutContactInput | CallLogCreateOrConnectWithoutContactInput[]
    upsert?: CallLogUpsertWithWhereUniqueWithoutContactInput | CallLogUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: CallLogCreateManyContactInputEnvelope
    set?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    disconnect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    delete?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    connect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    update?: CallLogUpdateWithWhereUniqueWithoutContactInput | CallLogUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: CallLogUpdateManyWithWhereWithoutContactInput | CallLogUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: CallLogScalarWhereInput | CallLogScalarWhereInput[]
  }

  export type ContactFileUpdateManyWithoutContactNestedInput = {
    create?: XOR<ContactFileCreateWithoutContactInput, ContactFileUncheckedCreateWithoutContactInput> | ContactFileCreateWithoutContactInput[] | ContactFileUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ContactFileCreateOrConnectWithoutContactInput | ContactFileCreateOrConnectWithoutContactInput[]
    upsert?: ContactFileUpsertWithWhereUniqueWithoutContactInput | ContactFileUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: ContactFileCreateManyContactInputEnvelope
    set?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
    disconnect?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
    delete?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
    connect?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
    update?: ContactFileUpdateWithWhereUniqueWithoutContactInput | ContactFileUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: ContactFileUpdateManyWithWhereWithoutContactInput | ContactFileUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: ContactFileScalarWhereInput | ContactFileScalarWhereInput[]
  }

  export type ReservationUncheckedUpdateManyWithoutContactNestedInput = {
    create?: XOR<ReservationCreateWithoutContactInput, ReservationUncheckedCreateWithoutContactInput> | ReservationCreateWithoutContactInput[] | ReservationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutContactInput | ReservationCreateOrConnectWithoutContactInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutContactInput | ReservationUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: ReservationCreateManyContactInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutContactInput | ReservationUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutContactInput | ReservationUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type NoteUncheckedUpdateManyWithoutContactNestedInput = {
    create?: XOR<NoteCreateWithoutContactInput, NoteUncheckedCreateWithoutContactInput> | NoteCreateWithoutContactInput[] | NoteUncheckedCreateWithoutContactInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutContactInput | NoteCreateOrConnectWithoutContactInput[]
    upsert?: NoteUpsertWithWhereUniqueWithoutContactInput | NoteUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: NoteCreateManyContactInputEnvelope
    set?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    disconnect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    delete?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    update?: NoteUpdateWithWhereUniqueWithoutContactInput | NoteUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: NoteUpdateManyWithWhereWithoutContactInput | NoteUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: NoteScalarWhereInput | NoteScalarWhereInput[]
  }

  export type CallLogUncheckedUpdateManyWithoutContactNestedInput = {
    create?: XOR<CallLogCreateWithoutContactInput, CallLogUncheckedCreateWithoutContactInput> | CallLogCreateWithoutContactInput[] | CallLogUncheckedCreateWithoutContactInput[]
    connectOrCreate?: CallLogCreateOrConnectWithoutContactInput | CallLogCreateOrConnectWithoutContactInput[]
    upsert?: CallLogUpsertWithWhereUniqueWithoutContactInput | CallLogUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: CallLogCreateManyContactInputEnvelope
    set?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    disconnect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    delete?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    connect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    update?: CallLogUpdateWithWhereUniqueWithoutContactInput | CallLogUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: CallLogUpdateManyWithWhereWithoutContactInput | CallLogUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: CallLogScalarWhereInput | CallLogScalarWhereInput[]
  }

  export type ContactFileUncheckedUpdateManyWithoutContactNestedInput = {
    create?: XOR<ContactFileCreateWithoutContactInput, ContactFileUncheckedCreateWithoutContactInput> | ContactFileCreateWithoutContactInput[] | ContactFileUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ContactFileCreateOrConnectWithoutContactInput | ContactFileCreateOrConnectWithoutContactInput[]
    upsert?: ContactFileUpsertWithWhereUniqueWithoutContactInput | ContactFileUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: ContactFileCreateManyContactInputEnvelope
    set?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
    disconnect?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
    delete?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
    connect?: ContactFileWhereUniqueInput | ContactFileWhereUniqueInput[]
    update?: ContactFileUpdateWithWhereUniqueWithoutContactInput | ContactFileUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: ContactFileUpdateManyWithWhereWithoutContactInput | ContactFileUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: ContactFileScalarWhereInput | ContactFileScalarWhereInput[]
  }

  export type ContactCreateNestedOneWithoutNotesInput = {
    create?: XOR<ContactCreateWithoutNotesInput, ContactUncheckedCreateWithoutNotesInput>
    connectOrCreate?: ContactCreateOrConnectWithoutNotesInput
    connect?: ContactWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutNotesInput = {
    create?: XOR<UserCreateWithoutNotesInput, UserUncheckedCreateWithoutNotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotesInput
    connect?: UserWhereUniqueInput
  }

  export type ContactUpdateOneRequiredWithoutNotesNestedInput = {
    create?: XOR<ContactCreateWithoutNotesInput, ContactUncheckedCreateWithoutNotesInput>
    connectOrCreate?: ContactCreateOrConnectWithoutNotesInput
    upsert?: ContactUpsertWithoutNotesInput
    connect?: ContactWhereUniqueInput
    update?: XOR<XOR<ContactUpdateToOneWithWhereWithoutNotesInput, ContactUpdateWithoutNotesInput>, ContactUncheckedUpdateWithoutNotesInput>
  }

  export type UserUpdateOneRequiredWithoutNotesNestedInput = {
    create?: XOR<UserCreateWithoutNotesInput, UserUncheckedCreateWithoutNotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotesInput
    upsert?: UserUpsertWithoutNotesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotesInput, UserUpdateWithoutNotesInput>, UserUncheckedUpdateWithoutNotesInput>
  }

  export type ContactCreateNestedOneWithoutCallsInput = {
    create?: XOR<ContactCreateWithoutCallsInput, ContactUncheckedCreateWithoutCallsInput>
    connectOrCreate?: ContactCreateOrConnectWithoutCallsInput
    connect?: ContactWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCallsInput = {
    create?: XOR<UserCreateWithoutCallsInput, UserUncheckedCreateWithoutCallsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCallsInput
    connect?: UserWhereUniqueInput
  }

  export type ContactUpdateOneRequiredWithoutCallsNestedInput = {
    create?: XOR<ContactCreateWithoutCallsInput, ContactUncheckedCreateWithoutCallsInput>
    connectOrCreate?: ContactCreateOrConnectWithoutCallsInput
    upsert?: ContactUpsertWithoutCallsInput
    connect?: ContactWhereUniqueInput
    update?: XOR<XOR<ContactUpdateToOneWithWhereWithoutCallsInput, ContactUpdateWithoutCallsInput>, ContactUncheckedUpdateWithoutCallsInput>
  }

  export type UserUpdateOneRequiredWithoutCallsNestedInput = {
    create?: XOR<UserCreateWithoutCallsInput, UserUncheckedCreateWithoutCallsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCallsInput
    upsert?: UserUpsertWithoutCallsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCallsInput, UserUpdateWithoutCallsInput>, UserUncheckedUpdateWithoutCallsInput>
  }

  export type ContactCreateNestedOneWithoutFilesInput = {
    create?: XOR<ContactCreateWithoutFilesInput, ContactUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ContactCreateOrConnectWithoutFilesInput
    connect?: ContactWhereUniqueInput
  }

  export type ContactUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<ContactCreateWithoutFilesInput, ContactUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ContactCreateOrConnectWithoutFilesInput
    upsert?: ContactUpsertWithoutFilesInput
    connect?: ContactWhereUniqueInput
    update?: XOR<XOR<ContactUpdateToOneWithWhereWithoutFilesInput, ContactUpdateWithoutFilesInput>, ContactUncheckedUpdateWithoutFilesInput>
  }

  export type ContactCreateNestedOneWithoutReservationsInput = {
    create?: XOR<ContactCreateWithoutReservationsInput, ContactUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: ContactCreateOrConnectWithoutReservationsInput
    connect?: ContactWhereUniqueInput
  }

  export type LotCreateNestedOneWithoutReservationsInput = {
    create?: XOR<LotCreateWithoutReservationsInput, LotUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: LotCreateOrConnectWithoutReservationsInput
    connect?: LotWhereUniqueInput
  }

  export type WebpayTransactionCreateNestedManyWithoutReservationInput = {
    create?: XOR<WebpayTransactionCreateWithoutReservationInput, WebpayTransactionUncheckedCreateWithoutReservationInput> | WebpayTransactionCreateWithoutReservationInput[] | WebpayTransactionUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: WebpayTransactionCreateOrConnectWithoutReservationInput | WebpayTransactionCreateOrConnectWithoutReservationInput[]
    createMany?: WebpayTransactionCreateManyReservationInputEnvelope
    connect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutSalesInput = {
    create?: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSalesInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPurchasesInput = {
    create?: XOR<UserCreateWithoutPurchasesInput, UserUncheckedCreateWithoutPurchasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPurchasesInput
    connect?: UserWhereUniqueInput
  }

  export type WebpayTransactionUncheckedCreateNestedManyWithoutReservationInput = {
    create?: XOR<WebpayTransactionCreateWithoutReservationInput, WebpayTransactionUncheckedCreateWithoutReservationInput> | WebpayTransactionCreateWithoutReservationInput[] | WebpayTransactionUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: WebpayTransactionCreateOrConnectWithoutReservationInput | WebpayTransactionCreateOrConnectWithoutReservationInput[]
    createMany?: WebpayTransactionCreateManyReservationInputEnvelope
    connect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
  }

  export type ContactUpdateOneWithoutReservationsNestedInput = {
    create?: XOR<ContactCreateWithoutReservationsInput, ContactUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: ContactCreateOrConnectWithoutReservationsInput
    upsert?: ContactUpsertWithoutReservationsInput
    disconnect?: ContactWhereInput | boolean
    delete?: ContactWhereInput | boolean
    connect?: ContactWhereUniqueInput
    update?: XOR<XOR<ContactUpdateToOneWithWhereWithoutReservationsInput, ContactUpdateWithoutReservationsInput>, ContactUncheckedUpdateWithoutReservationsInput>
  }

  export type LotUpdateOneRequiredWithoutReservationsNestedInput = {
    create?: XOR<LotCreateWithoutReservationsInput, LotUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: LotCreateOrConnectWithoutReservationsInput
    upsert?: LotUpsertWithoutReservationsInput
    connect?: LotWhereUniqueInput
    update?: XOR<XOR<LotUpdateToOneWithWhereWithoutReservationsInput, LotUpdateWithoutReservationsInput>, LotUncheckedUpdateWithoutReservationsInput>
  }

  export type WebpayTransactionUpdateManyWithoutReservationNestedInput = {
    create?: XOR<WebpayTransactionCreateWithoutReservationInput, WebpayTransactionUncheckedCreateWithoutReservationInput> | WebpayTransactionCreateWithoutReservationInput[] | WebpayTransactionUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: WebpayTransactionCreateOrConnectWithoutReservationInput | WebpayTransactionCreateOrConnectWithoutReservationInput[]
    upsert?: WebpayTransactionUpsertWithWhereUniqueWithoutReservationInput | WebpayTransactionUpsertWithWhereUniqueWithoutReservationInput[]
    createMany?: WebpayTransactionCreateManyReservationInputEnvelope
    set?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    disconnect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    delete?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    connect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    update?: WebpayTransactionUpdateWithWhereUniqueWithoutReservationInput | WebpayTransactionUpdateWithWhereUniqueWithoutReservationInput[]
    updateMany?: WebpayTransactionUpdateManyWithWhereWithoutReservationInput | WebpayTransactionUpdateManyWithWhereWithoutReservationInput[]
    deleteMany?: WebpayTransactionScalarWhereInput | WebpayTransactionScalarWhereInput[]
  }

  export type UserUpdateOneWithoutSalesNestedInput = {
    create?: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSalesInput
    upsert?: UserUpsertWithoutSalesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSalesInput, UserUpdateWithoutSalesInput>, UserUncheckedUpdateWithoutSalesInput>
  }

  export type UserUpdateOneWithoutPurchasesNestedInput = {
    create?: XOR<UserCreateWithoutPurchasesInput, UserUncheckedCreateWithoutPurchasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPurchasesInput
    upsert?: UserUpsertWithoutPurchasesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPurchasesInput, UserUpdateWithoutPurchasesInput>, UserUncheckedUpdateWithoutPurchasesInput>
  }

  export type WebpayTransactionUncheckedUpdateManyWithoutReservationNestedInput = {
    create?: XOR<WebpayTransactionCreateWithoutReservationInput, WebpayTransactionUncheckedCreateWithoutReservationInput> | WebpayTransactionCreateWithoutReservationInput[] | WebpayTransactionUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: WebpayTransactionCreateOrConnectWithoutReservationInput | WebpayTransactionCreateOrConnectWithoutReservationInput[]
    upsert?: WebpayTransactionUpsertWithWhereUniqueWithoutReservationInput | WebpayTransactionUpsertWithWhereUniqueWithoutReservationInput[]
    createMany?: WebpayTransactionCreateManyReservationInputEnvelope
    set?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    disconnect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    delete?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    connect?: WebpayTransactionWhereUniqueInput | WebpayTransactionWhereUniqueInput[]
    update?: WebpayTransactionUpdateWithWhereUniqueWithoutReservationInput | WebpayTransactionUpdateWithWhereUniqueWithoutReservationInput[]
    updateMany?: WebpayTransactionUpdateManyWithWhereWithoutReservationInput | WebpayTransactionUpdateManyWithWhereWithoutReservationInput[]
    deleteMany?: WebpayTransactionScalarWhereInput | WebpayTransactionScalarWhereInput[]
  }

  export type LotCreateNestedOneWithoutLocksInput = {
    create?: XOR<LotCreateWithoutLocksInput, LotUncheckedCreateWithoutLocksInput>
    connectOrCreate?: LotCreateOrConnectWithoutLocksInput
    connect?: LotWhereUniqueInput
  }

  export type LotUpdateOneRequiredWithoutLocksNestedInput = {
    create?: XOR<LotCreateWithoutLocksInput, LotUncheckedCreateWithoutLocksInput>
    connectOrCreate?: LotCreateOrConnectWithoutLocksInput
    upsert?: LotUpsertWithoutLocksInput
    connect?: LotWhereUniqueInput
    update?: XOR<XOR<LotUpdateToOneWithWhereWithoutLocksInput, LotUpdateWithoutLocksInput>, LotUncheckedUpdateWithoutLocksInput>
  }

  export type ReservationCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<ReservationCreateWithoutTransactionsInput, ReservationUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: ReservationCreateOrConnectWithoutTransactionsInput
    connect?: ReservationWhereUniqueInput
  }

  export type LotCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<LotCreateWithoutTransactionsInput, LotUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: LotCreateOrConnectWithoutTransactionsInput
    connect?: LotWhereUniqueInput
  }

  export type ReservationUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<ReservationCreateWithoutTransactionsInput, ReservationUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: ReservationCreateOrConnectWithoutTransactionsInput
    upsert?: ReservationUpsertWithoutTransactionsInput
    connect?: ReservationWhereUniqueInput
    update?: XOR<XOR<ReservationUpdateToOneWithWhereWithoutTransactionsInput, ReservationUpdateWithoutTransactionsInput>, ReservationUncheckedUpdateWithoutTransactionsInput>
  }

  export type LotUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<LotCreateWithoutTransactionsInput, LotUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: LotCreateOrConnectWithoutTransactionsInput
    upsert?: LotUpsertWithoutTransactionsInput
    connect?: LotWhereUniqueInput
    update?: XOR<XOR<LotUpdateToOneWithWhereWithoutTransactionsInput, LotUpdateWithoutTransactionsInput>, LotUncheckedUpdateWithoutTransactionsInput>
  }

  export type NoteCreateNestedManyWithoutSellerInput = {
    create?: XOR<NoteCreateWithoutSellerInput, NoteUncheckedCreateWithoutSellerInput> | NoteCreateWithoutSellerInput[] | NoteUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutSellerInput | NoteCreateOrConnectWithoutSellerInput[]
    createMany?: NoteCreateManySellerInputEnvelope
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
  }

  export type CallLogCreateNestedManyWithoutSellerInput = {
    create?: XOR<CallLogCreateWithoutSellerInput, CallLogUncheckedCreateWithoutSellerInput> | CallLogCreateWithoutSellerInput[] | CallLogUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: CallLogCreateOrConnectWithoutSellerInput | CallLogCreateOrConnectWithoutSellerInput[]
    createMany?: CallLogCreateManySellerInputEnvelope
    connect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
  }

  export type ReservationCreateNestedManyWithoutSellerInput = {
    create?: XOR<ReservationCreateWithoutSellerInput, ReservationUncheckedCreateWithoutSellerInput> | ReservationCreateWithoutSellerInput[] | ReservationUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutSellerInput | ReservationCreateOrConnectWithoutSellerInput[]
    createMany?: ReservationCreateManySellerInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type ReservationCreateNestedManyWithoutBuyerInput = {
    create?: XOR<ReservationCreateWithoutBuyerInput, ReservationUncheckedCreateWithoutBuyerInput> | ReservationCreateWithoutBuyerInput[] | ReservationUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutBuyerInput | ReservationCreateOrConnectWithoutBuyerInput[]
    createMany?: ReservationCreateManyBuyerInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NoteUncheckedCreateNestedManyWithoutSellerInput = {
    create?: XOR<NoteCreateWithoutSellerInput, NoteUncheckedCreateWithoutSellerInput> | NoteCreateWithoutSellerInput[] | NoteUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutSellerInput | NoteCreateOrConnectWithoutSellerInput[]
    createMany?: NoteCreateManySellerInputEnvelope
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
  }

  export type CallLogUncheckedCreateNestedManyWithoutSellerInput = {
    create?: XOR<CallLogCreateWithoutSellerInput, CallLogUncheckedCreateWithoutSellerInput> | CallLogCreateWithoutSellerInput[] | CallLogUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: CallLogCreateOrConnectWithoutSellerInput | CallLogCreateOrConnectWithoutSellerInput[]
    createMany?: CallLogCreateManySellerInputEnvelope
    connect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
  }

  export type ReservationUncheckedCreateNestedManyWithoutSellerInput = {
    create?: XOR<ReservationCreateWithoutSellerInput, ReservationUncheckedCreateWithoutSellerInput> | ReservationCreateWithoutSellerInput[] | ReservationUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutSellerInput | ReservationCreateOrConnectWithoutSellerInput[]
    createMany?: ReservationCreateManySellerInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type ReservationUncheckedCreateNestedManyWithoutBuyerInput = {
    create?: XOR<ReservationCreateWithoutBuyerInput, ReservationUncheckedCreateWithoutBuyerInput> | ReservationCreateWithoutBuyerInput[] | ReservationUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutBuyerInput | ReservationCreateOrConnectWithoutBuyerInput[]
    createMany?: ReservationCreateManyBuyerInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NoteUpdateManyWithoutSellerNestedInput = {
    create?: XOR<NoteCreateWithoutSellerInput, NoteUncheckedCreateWithoutSellerInput> | NoteCreateWithoutSellerInput[] | NoteUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutSellerInput | NoteCreateOrConnectWithoutSellerInput[]
    upsert?: NoteUpsertWithWhereUniqueWithoutSellerInput | NoteUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: NoteCreateManySellerInputEnvelope
    set?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    disconnect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    delete?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    update?: NoteUpdateWithWhereUniqueWithoutSellerInput | NoteUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: NoteUpdateManyWithWhereWithoutSellerInput | NoteUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: NoteScalarWhereInput | NoteScalarWhereInput[]
  }

  export type CallLogUpdateManyWithoutSellerNestedInput = {
    create?: XOR<CallLogCreateWithoutSellerInput, CallLogUncheckedCreateWithoutSellerInput> | CallLogCreateWithoutSellerInput[] | CallLogUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: CallLogCreateOrConnectWithoutSellerInput | CallLogCreateOrConnectWithoutSellerInput[]
    upsert?: CallLogUpsertWithWhereUniqueWithoutSellerInput | CallLogUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: CallLogCreateManySellerInputEnvelope
    set?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    disconnect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    delete?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    connect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    update?: CallLogUpdateWithWhereUniqueWithoutSellerInput | CallLogUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: CallLogUpdateManyWithWhereWithoutSellerInput | CallLogUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: CallLogScalarWhereInput | CallLogScalarWhereInput[]
  }

  export type ReservationUpdateManyWithoutSellerNestedInput = {
    create?: XOR<ReservationCreateWithoutSellerInput, ReservationUncheckedCreateWithoutSellerInput> | ReservationCreateWithoutSellerInput[] | ReservationUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutSellerInput | ReservationCreateOrConnectWithoutSellerInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutSellerInput | ReservationUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: ReservationCreateManySellerInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutSellerInput | ReservationUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutSellerInput | ReservationUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type ReservationUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<ReservationCreateWithoutBuyerInput, ReservationUncheckedCreateWithoutBuyerInput> | ReservationCreateWithoutBuyerInput[] | ReservationUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutBuyerInput | ReservationCreateOrConnectWithoutBuyerInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutBuyerInput | ReservationUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: ReservationCreateManyBuyerInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutBuyerInput | ReservationUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutBuyerInput | ReservationUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NoteUncheckedUpdateManyWithoutSellerNestedInput = {
    create?: XOR<NoteCreateWithoutSellerInput, NoteUncheckedCreateWithoutSellerInput> | NoteCreateWithoutSellerInput[] | NoteUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutSellerInput | NoteCreateOrConnectWithoutSellerInput[]
    upsert?: NoteUpsertWithWhereUniqueWithoutSellerInput | NoteUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: NoteCreateManySellerInputEnvelope
    set?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    disconnect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    delete?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    update?: NoteUpdateWithWhereUniqueWithoutSellerInput | NoteUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: NoteUpdateManyWithWhereWithoutSellerInput | NoteUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: NoteScalarWhereInput | NoteScalarWhereInput[]
  }

  export type CallLogUncheckedUpdateManyWithoutSellerNestedInput = {
    create?: XOR<CallLogCreateWithoutSellerInput, CallLogUncheckedCreateWithoutSellerInput> | CallLogCreateWithoutSellerInput[] | CallLogUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: CallLogCreateOrConnectWithoutSellerInput | CallLogCreateOrConnectWithoutSellerInput[]
    upsert?: CallLogUpsertWithWhereUniqueWithoutSellerInput | CallLogUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: CallLogCreateManySellerInputEnvelope
    set?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    disconnect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    delete?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    connect?: CallLogWhereUniqueInput | CallLogWhereUniqueInput[]
    update?: CallLogUpdateWithWhereUniqueWithoutSellerInput | CallLogUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: CallLogUpdateManyWithWhereWithoutSellerInput | CallLogUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: CallLogScalarWhereInput | CallLogScalarWhereInput[]
  }

  export type ReservationUncheckedUpdateManyWithoutSellerNestedInput = {
    create?: XOR<ReservationCreateWithoutSellerInput, ReservationUncheckedCreateWithoutSellerInput> | ReservationCreateWithoutSellerInput[] | ReservationUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutSellerInput | ReservationCreateOrConnectWithoutSellerInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutSellerInput | ReservationUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: ReservationCreateManySellerInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutSellerInput | ReservationUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutSellerInput | ReservationUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type ReservationUncheckedUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<ReservationCreateWithoutBuyerInput, ReservationUncheckedCreateWithoutBuyerInput> | ReservationCreateWithoutBuyerInput[] | ReservationUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutBuyerInput | ReservationCreateOrConnectWithoutBuyerInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutBuyerInput | ReservationUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: ReservationCreateManyBuyerInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutBuyerInput | ReservationUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutBuyerInput | ReservationUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumActionTypeFieldUpdateOperationsInput = {
    set?: $Enums.ActionType
  }

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumActionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeFilter<$PrismaModel> | $Enums.ActionType
  }

  export type NestedEnumActionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionTypeFilter<$PrismaModel>
    _max?: NestedEnumActionTypeFilter<$PrismaModel>
  }

  export type ReservationCreateWithoutLotInput = {
    id?: string
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact?: ContactCreateNestedOneWithoutReservationsInput
    transactions?: WebpayTransactionCreateNestedManyWithoutReservationInput
    seller?: UserCreateNestedOneWithoutSalesInput
    buyer?: UserCreateNestedOneWithoutPurchasesInput
  }

  export type ReservationUncheckedCreateWithoutLotInput = {
    id?: string
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact_id?: string | null
    seller_id?: string | null
    buyer_id?: string | null
    transactions?: WebpayTransactionUncheckedCreateNestedManyWithoutReservationInput
  }

  export type ReservationCreateOrConnectWithoutLotInput = {
    where: ReservationWhereUniqueInput
    create: XOR<ReservationCreateWithoutLotInput, ReservationUncheckedCreateWithoutLotInput>
  }

  export type ReservationCreateManyLotInputEnvelope = {
    data: ReservationCreateManyLotInput | ReservationCreateManyLotInput[]
    skipDuplicates?: boolean
  }

  export type LotLockCreateWithoutLotInput = {
    locked_by: string
    locked_until: Date | string
    created_at?: Date | string
  }

  export type LotLockUncheckedCreateWithoutLotInput = {
    locked_by: string
    locked_until: Date | string
    created_at?: Date | string
  }

  export type LotLockCreateOrConnectWithoutLotInput = {
    where: LotLockWhereUniqueInput
    create: XOR<LotLockCreateWithoutLotInput, LotLockUncheckedCreateWithoutLotInput>
  }

  export type LotLockCreateManyLotInputEnvelope = {
    data: LotLockCreateManyLotInput | LotLockCreateManyLotInput[]
    skipDuplicates?: boolean
  }

  export type WebpayTransactionCreateWithoutLotInput = {
    id?: string
    token: string
    buy_order: string
    amount_clp: number
    status?: string | null
    response_code?: number | null
    transaction_date?: Date | string | null
    authorization_code?: string | null
    payment_type_code?: string | null
    installments_number?: number | null
    processed_at?: Date | string | null
    scope?: string | null
    installments_count?: number | null
    created_at?: Date | string
    reservation: ReservationCreateNestedOneWithoutTransactionsInput
  }

  export type WebpayTransactionUncheckedCreateWithoutLotInput = {
    id?: string
    token: string
    buy_order: string
    amount_clp: number
    status?: string | null
    response_code?: number | null
    transaction_date?: Date | string | null
    authorization_code?: string | null
    payment_type_code?: string | null
    installments_number?: number | null
    processed_at?: Date | string | null
    scope?: string | null
    installments_count?: number | null
    created_at?: Date | string
    reservation_id: string
  }

  export type WebpayTransactionCreateOrConnectWithoutLotInput = {
    where: WebpayTransactionWhereUniqueInput
    create: XOR<WebpayTransactionCreateWithoutLotInput, WebpayTransactionUncheckedCreateWithoutLotInput>
  }

  export type WebpayTransactionCreateManyLotInputEnvelope = {
    data: WebpayTransactionCreateManyLotInput | WebpayTransactionCreateManyLotInput[]
    skipDuplicates?: boolean
  }

  export type ReservationUpsertWithWhereUniqueWithoutLotInput = {
    where: ReservationWhereUniqueInput
    update: XOR<ReservationUpdateWithoutLotInput, ReservationUncheckedUpdateWithoutLotInput>
    create: XOR<ReservationCreateWithoutLotInput, ReservationUncheckedCreateWithoutLotInput>
  }

  export type ReservationUpdateWithWhereUniqueWithoutLotInput = {
    where: ReservationWhereUniqueInput
    data: XOR<ReservationUpdateWithoutLotInput, ReservationUncheckedUpdateWithoutLotInput>
  }

  export type ReservationUpdateManyWithWhereWithoutLotInput = {
    where: ReservationScalarWhereInput
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyWithoutLotInput>
  }

  export type ReservationScalarWhereInput = {
    AND?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
    OR?: ReservationScalarWhereInput[]
    NOT?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
    id?: StringFilter<"Reservation"> | string
    lot_id?: IntFilter<"Reservation"> | number
    name?: StringFilter<"Reservation"> | string
    email?: StringFilter<"Reservation"> | string
    phone?: StringFilter<"Reservation"> | string
    rut?: StringNullableFilter<"Reservation"> | string | null
    address?: StringNullableFilter<"Reservation"> | string | null
    folio?: StringNullableFilter<"Reservation"> | string | null
    status?: StringFilter<"Reservation"> | string
    session_id?: StringNullableFilter<"Reservation"> | string | null
    expires_at?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    created_at?: DateTimeFilter<"Reservation"> | Date | string
    marital_status?: StringNullableFilter<"Reservation"> | string | null
    profession?: StringNullableFilter<"Reservation"> | string | null
    nationality?: StringNullableFilter<"Reservation"> | string | null
    pipeline_stage?: StringFilter<"Reservation"> | string
    notes?: StringNullableFilter<"Reservation"> | string | null
    uploaded_contract_url?: StringNullableFilter<"Reservation"> | string | null
    address_street?: StringNullableFilter<"Reservation"> | string | null
    address_number?: StringNullableFilter<"Reservation"> | string | null
    address_commune?: StringNullableFilter<"Reservation"> | string | null
    address_region?: StringNullableFilter<"Reservation"> | string | null
    utm_source?: StringNullableFilter<"Reservation"> | string | null
    utm_medium?: StringNullableFilter<"Reservation"> | string | null
    utm_campaign?: StringNullableFilter<"Reservation"> | string | null
    utm_content?: StringNullableFilter<"Reservation"> | string | null
    utm_term?: StringNullableFilter<"Reservation"> | string | null
    pie_status?: StringNullableFilter<"Reservation"> | string | null
    installments_paid?: IntNullableFilter<"Reservation"> | number | null
    signature_otp?: StringNullableFilter<"Reservation"> | string | null
    signature_otp_expires?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    signed_at?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    signature_ip?: StringNullableFilter<"Reservation"> | string | null
    promesa_signature_otp?: StringNullableFilter<"Reservation"> | string | null
    promesa_signature_otp_expires?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    promesa_signed_at?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    promesa_signature_ip?: StringNullableFilter<"Reservation"> | string | null
    contact_id?: StringNullableFilter<"Reservation"> | string | null
    seller_id?: StringNullableFilter<"Reservation"> | string | null
    buyer_id?: StringNullableFilter<"Reservation"> | string | null
  }

  export type LotLockUpsertWithWhereUniqueWithoutLotInput = {
    where: LotLockWhereUniqueInput
    update: XOR<LotLockUpdateWithoutLotInput, LotLockUncheckedUpdateWithoutLotInput>
    create: XOR<LotLockCreateWithoutLotInput, LotLockUncheckedCreateWithoutLotInput>
  }

  export type LotLockUpdateWithWhereUniqueWithoutLotInput = {
    where: LotLockWhereUniqueInput
    data: XOR<LotLockUpdateWithoutLotInput, LotLockUncheckedUpdateWithoutLotInput>
  }

  export type LotLockUpdateManyWithWhereWithoutLotInput = {
    where: LotLockScalarWhereInput
    data: XOR<LotLockUpdateManyMutationInput, LotLockUncheckedUpdateManyWithoutLotInput>
  }

  export type LotLockScalarWhereInput = {
    AND?: LotLockScalarWhereInput | LotLockScalarWhereInput[]
    OR?: LotLockScalarWhereInput[]
    NOT?: LotLockScalarWhereInput | LotLockScalarWhereInput[]
    lot_id?: IntFilter<"LotLock"> | number
    locked_by?: StringFilter<"LotLock"> | string
    locked_until?: DateTimeFilter<"LotLock"> | Date | string
    created_at?: DateTimeFilter<"LotLock"> | Date | string
  }

  export type WebpayTransactionUpsertWithWhereUniqueWithoutLotInput = {
    where: WebpayTransactionWhereUniqueInput
    update: XOR<WebpayTransactionUpdateWithoutLotInput, WebpayTransactionUncheckedUpdateWithoutLotInput>
    create: XOR<WebpayTransactionCreateWithoutLotInput, WebpayTransactionUncheckedCreateWithoutLotInput>
  }

  export type WebpayTransactionUpdateWithWhereUniqueWithoutLotInput = {
    where: WebpayTransactionWhereUniqueInput
    data: XOR<WebpayTransactionUpdateWithoutLotInput, WebpayTransactionUncheckedUpdateWithoutLotInput>
  }

  export type WebpayTransactionUpdateManyWithWhereWithoutLotInput = {
    where: WebpayTransactionScalarWhereInput
    data: XOR<WebpayTransactionUpdateManyMutationInput, WebpayTransactionUncheckedUpdateManyWithoutLotInput>
  }

  export type WebpayTransactionScalarWhereInput = {
    AND?: WebpayTransactionScalarWhereInput | WebpayTransactionScalarWhereInput[]
    OR?: WebpayTransactionScalarWhereInput[]
    NOT?: WebpayTransactionScalarWhereInput | WebpayTransactionScalarWhereInput[]
    id?: StringFilter<"WebpayTransaction"> | string
    token?: StringFilter<"WebpayTransaction"> | string
    buy_order?: StringFilter<"WebpayTransaction"> | string
    amount_clp?: IntFilter<"WebpayTransaction"> | number
    status?: StringNullableFilter<"WebpayTransaction"> | string | null
    response_code?: IntNullableFilter<"WebpayTransaction"> | number | null
    transaction_date?: DateTimeNullableFilter<"WebpayTransaction"> | Date | string | null
    authorization_code?: StringNullableFilter<"WebpayTransaction"> | string | null
    payment_type_code?: StringNullableFilter<"WebpayTransaction"> | string | null
    installments_number?: IntNullableFilter<"WebpayTransaction"> | number | null
    processed_at?: DateTimeNullableFilter<"WebpayTransaction"> | Date | string | null
    scope?: StringNullableFilter<"WebpayTransaction"> | string | null
    installments_count?: IntNullableFilter<"WebpayTransaction"> | number | null
    created_at?: DateTimeFilter<"WebpayTransaction"> | Date | string
    reservation_id?: StringFilter<"WebpayTransaction"> | string
    lot_id?: IntFilter<"WebpayTransaction"> | number
  }

  export type ReservationCreateWithoutContactInput = {
    id?: string
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    lot: LotCreateNestedOneWithoutReservationsInput
    transactions?: WebpayTransactionCreateNestedManyWithoutReservationInput
    seller?: UserCreateNestedOneWithoutSalesInput
    buyer?: UserCreateNestedOneWithoutPurchasesInput
  }

  export type ReservationUncheckedCreateWithoutContactInput = {
    id?: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    seller_id?: string | null
    buyer_id?: string | null
    transactions?: WebpayTransactionUncheckedCreateNestedManyWithoutReservationInput
  }

  export type ReservationCreateOrConnectWithoutContactInput = {
    where: ReservationWhereUniqueInput
    create: XOR<ReservationCreateWithoutContactInput, ReservationUncheckedCreateWithoutContactInput>
  }

  export type ReservationCreateManyContactInputEnvelope = {
    data: ReservationCreateManyContactInput | ReservationCreateManyContactInput[]
    skipDuplicates?: boolean
  }

  export type NoteCreateWithoutContactInput = {
    id?: string
    content: string
    created_at?: Date | string
    seller: UserCreateNestedOneWithoutNotesInput
  }

  export type NoteUncheckedCreateWithoutContactInput = {
    id?: string
    seller_id: string
    content: string
    created_at?: Date | string
  }

  export type NoteCreateOrConnectWithoutContactInput = {
    where: NoteWhereUniqueInput
    create: XOR<NoteCreateWithoutContactInput, NoteUncheckedCreateWithoutContactInput>
  }

  export type NoteCreateManyContactInputEnvelope = {
    data: NoteCreateManyContactInput | NoteCreateManyContactInput[]
    skipDuplicates?: boolean
  }

  export type CallLogCreateWithoutContactInput = {
    id?: string
    duration?: number | null
    summary?: string | null
    date?: Date | string
    seller: UserCreateNestedOneWithoutCallsInput
  }

  export type CallLogUncheckedCreateWithoutContactInput = {
    id?: string
    seller_id: string
    duration?: number | null
    summary?: string | null
    date?: Date | string
  }

  export type CallLogCreateOrConnectWithoutContactInput = {
    where: CallLogWhereUniqueInput
    create: XOR<CallLogCreateWithoutContactInput, CallLogUncheckedCreateWithoutContactInput>
  }

  export type CallLogCreateManyContactInputEnvelope = {
    data: CallLogCreateManyContactInput | CallLogCreateManyContactInput[]
    skipDuplicates?: boolean
  }

  export type ContactFileCreateWithoutContactInput = {
    id?: string
    name: string
    url: string
    type?: string | null
    created_at?: Date | string
  }

  export type ContactFileUncheckedCreateWithoutContactInput = {
    id?: string
    name: string
    url: string
    type?: string | null
    created_at?: Date | string
  }

  export type ContactFileCreateOrConnectWithoutContactInput = {
    where: ContactFileWhereUniqueInput
    create: XOR<ContactFileCreateWithoutContactInput, ContactFileUncheckedCreateWithoutContactInput>
  }

  export type ContactFileCreateManyContactInputEnvelope = {
    data: ContactFileCreateManyContactInput | ContactFileCreateManyContactInput[]
    skipDuplicates?: boolean
  }

  export type ReservationUpsertWithWhereUniqueWithoutContactInput = {
    where: ReservationWhereUniqueInput
    update: XOR<ReservationUpdateWithoutContactInput, ReservationUncheckedUpdateWithoutContactInput>
    create: XOR<ReservationCreateWithoutContactInput, ReservationUncheckedCreateWithoutContactInput>
  }

  export type ReservationUpdateWithWhereUniqueWithoutContactInput = {
    where: ReservationWhereUniqueInput
    data: XOR<ReservationUpdateWithoutContactInput, ReservationUncheckedUpdateWithoutContactInput>
  }

  export type ReservationUpdateManyWithWhereWithoutContactInput = {
    where: ReservationScalarWhereInput
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyWithoutContactInput>
  }

  export type NoteUpsertWithWhereUniqueWithoutContactInput = {
    where: NoteWhereUniqueInput
    update: XOR<NoteUpdateWithoutContactInput, NoteUncheckedUpdateWithoutContactInput>
    create: XOR<NoteCreateWithoutContactInput, NoteUncheckedCreateWithoutContactInput>
  }

  export type NoteUpdateWithWhereUniqueWithoutContactInput = {
    where: NoteWhereUniqueInput
    data: XOR<NoteUpdateWithoutContactInput, NoteUncheckedUpdateWithoutContactInput>
  }

  export type NoteUpdateManyWithWhereWithoutContactInput = {
    where: NoteScalarWhereInput
    data: XOR<NoteUpdateManyMutationInput, NoteUncheckedUpdateManyWithoutContactInput>
  }

  export type NoteScalarWhereInput = {
    AND?: NoteScalarWhereInput | NoteScalarWhereInput[]
    OR?: NoteScalarWhereInput[]
    NOT?: NoteScalarWhereInput | NoteScalarWhereInput[]
    id?: StringFilter<"Note"> | string
    contact_id?: StringFilter<"Note"> | string
    seller_id?: StringFilter<"Note"> | string
    content?: StringFilter<"Note"> | string
    created_at?: DateTimeFilter<"Note"> | Date | string
  }

  export type CallLogUpsertWithWhereUniqueWithoutContactInput = {
    where: CallLogWhereUniqueInput
    update: XOR<CallLogUpdateWithoutContactInput, CallLogUncheckedUpdateWithoutContactInput>
    create: XOR<CallLogCreateWithoutContactInput, CallLogUncheckedCreateWithoutContactInput>
  }

  export type CallLogUpdateWithWhereUniqueWithoutContactInput = {
    where: CallLogWhereUniqueInput
    data: XOR<CallLogUpdateWithoutContactInput, CallLogUncheckedUpdateWithoutContactInput>
  }

  export type CallLogUpdateManyWithWhereWithoutContactInput = {
    where: CallLogScalarWhereInput
    data: XOR<CallLogUpdateManyMutationInput, CallLogUncheckedUpdateManyWithoutContactInput>
  }

  export type CallLogScalarWhereInput = {
    AND?: CallLogScalarWhereInput | CallLogScalarWhereInput[]
    OR?: CallLogScalarWhereInput[]
    NOT?: CallLogScalarWhereInput | CallLogScalarWhereInput[]
    id?: StringFilter<"CallLog"> | string
    contact_id?: StringFilter<"CallLog"> | string
    seller_id?: StringFilter<"CallLog"> | string
    duration?: IntNullableFilter<"CallLog"> | number | null
    summary?: StringNullableFilter<"CallLog"> | string | null
    date?: DateTimeFilter<"CallLog"> | Date | string
  }

  export type ContactFileUpsertWithWhereUniqueWithoutContactInput = {
    where: ContactFileWhereUniqueInput
    update: XOR<ContactFileUpdateWithoutContactInput, ContactFileUncheckedUpdateWithoutContactInput>
    create: XOR<ContactFileCreateWithoutContactInput, ContactFileUncheckedCreateWithoutContactInput>
  }

  export type ContactFileUpdateWithWhereUniqueWithoutContactInput = {
    where: ContactFileWhereUniqueInput
    data: XOR<ContactFileUpdateWithoutContactInput, ContactFileUncheckedUpdateWithoutContactInput>
  }

  export type ContactFileUpdateManyWithWhereWithoutContactInput = {
    where: ContactFileScalarWhereInput
    data: XOR<ContactFileUpdateManyMutationInput, ContactFileUncheckedUpdateManyWithoutContactInput>
  }

  export type ContactFileScalarWhereInput = {
    AND?: ContactFileScalarWhereInput | ContactFileScalarWhereInput[]
    OR?: ContactFileScalarWhereInput[]
    NOT?: ContactFileScalarWhereInput | ContactFileScalarWhereInput[]
    id?: StringFilter<"ContactFile"> | string
    contact_id?: StringFilter<"ContactFile"> | string
    name?: StringFilter<"ContactFile"> | string
    url?: StringFilter<"ContactFile"> | string
    type?: StringNullableFilter<"ContactFile"> | string | null
    created_at?: DateTimeFilter<"ContactFile"> | Date | string
  }

  export type ContactCreateWithoutNotesInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    reservations?: ReservationCreateNestedManyWithoutContactInput
    calls?: CallLogCreateNestedManyWithoutContactInput
    files?: ContactFileCreateNestedManyWithoutContactInput
  }

  export type ContactUncheckedCreateWithoutNotesInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    reservations?: ReservationUncheckedCreateNestedManyWithoutContactInput
    calls?: CallLogUncheckedCreateNestedManyWithoutContactInput
    files?: ContactFileUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactCreateOrConnectWithoutNotesInput = {
    where: ContactWhereUniqueInput
    create: XOR<ContactCreateWithoutNotesInput, ContactUncheckedCreateWithoutNotesInput>
  }

  export type UserCreateWithoutNotesInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    calls?: CallLogCreateNestedManyWithoutSellerInput
    sales?: ReservationCreateNestedManyWithoutSellerInput
    purchases?: ReservationCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotesInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    calls?: CallLogUncheckedCreateNestedManyWithoutSellerInput
    sales?: ReservationUncheckedCreateNestedManyWithoutSellerInput
    purchases?: ReservationUncheckedCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotesInput, UserUncheckedCreateWithoutNotesInput>
  }

  export type ContactUpsertWithoutNotesInput = {
    update: XOR<ContactUpdateWithoutNotesInput, ContactUncheckedUpdateWithoutNotesInput>
    create: XOR<ContactCreateWithoutNotesInput, ContactUncheckedCreateWithoutNotesInput>
    where?: ContactWhereInput
  }

  export type ContactUpdateToOneWithWhereWithoutNotesInput = {
    where?: ContactWhereInput
    data: XOR<ContactUpdateWithoutNotesInput, ContactUncheckedUpdateWithoutNotesInput>
  }

  export type ContactUpdateWithoutNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUpdateManyWithoutContactNestedInput
    calls?: CallLogUpdateManyWithoutContactNestedInput
    files?: ContactFileUpdateManyWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateWithoutNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUncheckedUpdateManyWithoutContactNestedInput
    calls?: CallLogUncheckedUpdateManyWithoutContactNestedInput
    files?: ContactFileUncheckedUpdateManyWithoutContactNestedInput
  }

  export type UserUpsertWithoutNotesInput = {
    update: XOR<UserUpdateWithoutNotesInput, UserUncheckedUpdateWithoutNotesInput>
    create: XOR<UserCreateWithoutNotesInput, UserUncheckedCreateWithoutNotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotesInput, UserUncheckedUpdateWithoutNotesInput>
  }

  export type UserUpdateWithoutNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    calls?: CallLogUpdateManyWithoutSellerNestedInput
    sales?: ReservationUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    calls?: CallLogUncheckedUpdateManyWithoutSellerNestedInput
    sales?: ReservationUncheckedUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUncheckedUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ContactCreateWithoutCallsInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    reservations?: ReservationCreateNestedManyWithoutContactInput
    notes?: NoteCreateNestedManyWithoutContactInput
    files?: ContactFileCreateNestedManyWithoutContactInput
  }

  export type ContactUncheckedCreateWithoutCallsInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    reservations?: ReservationUncheckedCreateNestedManyWithoutContactInput
    notes?: NoteUncheckedCreateNestedManyWithoutContactInput
    files?: ContactFileUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactCreateOrConnectWithoutCallsInput = {
    where: ContactWhereUniqueInput
    create: XOR<ContactCreateWithoutCallsInput, ContactUncheckedCreateWithoutCallsInput>
  }

  export type UserCreateWithoutCallsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteCreateNestedManyWithoutSellerInput
    sales?: ReservationCreateNestedManyWithoutSellerInput
    purchases?: ReservationCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCallsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutSellerInput
    sales?: ReservationUncheckedCreateNestedManyWithoutSellerInput
    purchases?: ReservationUncheckedCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCallsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCallsInput, UserUncheckedCreateWithoutCallsInput>
  }

  export type ContactUpsertWithoutCallsInput = {
    update: XOR<ContactUpdateWithoutCallsInput, ContactUncheckedUpdateWithoutCallsInput>
    create: XOR<ContactCreateWithoutCallsInput, ContactUncheckedCreateWithoutCallsInput>
    where?: ContactWhereInput
  }

  export type ContactUpdateToOneWithWhereWithoutCallsInput = {
    where?: ContactWhereInput
    data: XOR<ContactUpdateWithoutCallsInput, ContactUncheckedUpdateWithoutCallsInput>
  }

  export type ContactUpdateWithoutCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUpdateManyWithoutContactNestedInput
    notes?: NoteUpdateManyWithoutContactNestedInput
    files?: ContactFileUpdateManyWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateWithoutCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUncheckedUpdateManyWithoutContactNestedInput
    notes?: NoteUncheckedUpdateManyWithoutContactNestedInput
    files?: ContactFileUncheckedUpdateManyWithoutContactNestedInput
  }

  export type UserUpsertWithoutCallsInput = {
    update: XOR<UserUpdateWithoutCallsInput, UserUncheckedUpdateWithoutCallsInput>
    create: XOR<UserCreateWithoutCallsInput, UserUncheckedCreateWithoutCallsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCallsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCallsInput, UserUncheckedUpdateWithoutCallsInput>
  }

  export type UserUpdateWithoutCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutSellerNestedInput
    sales?: ReservationUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutSellerNestedInput
    sales?: ReservationUncheckedUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUncheckedUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ContactCreateWithoutFilesInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    reservations?: ReservationCreateNestedManyWithoutContactInput
    notes?: NoteCreateNestedManyWithoutContactInput
    calls?: CallLogCreateNestedManyWithoutContactInput
  }

  export type ContactUncheckedCreateWithoutFilesInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    reservations?: ReservationUncheckedCreateNestedManyWithoutContactInput
    notes?: NoteUncheckedCreateNestedManyWithoutContactInput
    calls?: CallLogUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactCreateOrConnectWithoutFilesInput = {
    where: ContactWhereUniqueInput
    create: XOR<ContactCreateWithoutFilesInput, ContactUncheckedCreateWithoutFilesInput>
  }

  export type ContactUpsertWithoutFilesInput = {
    update: XOR<ContactUpdateWithoutFilesInput, ContactUncheckedUpdateWithoutFilesInput>
    create: XOR<ContactCreateWithoutFilesInput, ContactUncheckedCreateWithoutFilesInput>
    where?: ContactWhereInput
  }

  export type ContactUpdateToOneWithWhereWithoutFilesInput = {
    where?: ContactWhereInput
    data: XOR<ContactUpdateWithoutFilesInput, ContactUncheckedUpdateWithoutFilesInput>
  }

  export type ContactUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUpdateManyWithoutContactNestedInput
    notes?: NoteUpdateManyWithoutContactNestedInput
    calls?: CallLogUpdateManyWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUncheckedUpdateManyWithoutContactNestedInput
    notes?: NoteUncheckedUpdateManyWithoutContactNestedInput
    calls?: CallLogUncheckedUpdateManyWithoutContactNestedInput
  }

  export type ContactCreateWithoutReservationsInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    notes?: NoteCreateNestedManyWithoutContactInput
    calls?: CallLogCreateNestedManyWithoutContactInput
    files?: ContactFileCreateNestedManyWithoutContactInput
  }

  export type ContactUncheckedCreateWithoutReservationsInput = {
    id?: string
    email: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    rut?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutContactInput
    calls?: CallLogUncheckedCreateNestedManyWithoutContactInput
    files?: ContactFileUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactCreateOrConnectWithoutReservationsInput = {
    where: ContactWhereUniqueInput
    create: XOR<ContactCreateWithoutReservationsInput, ContactUncheckedCreateWithoutReservationsInput>
  }

  export type LotCreateWithoutReservationsInput = {
    number?: string | null
    stage?: number | null
    area_m2?: number | null
    price_total_clp?: number | null
    reservation_amount_clp?: number | null
    status?: string
    cuotas?: number | null
    pie?: number | null
    valor_cuota?: number | null
    last_installment_amount?: number | null
    reserved_until?: Date | string | null
    reserved_at?: Date | string | null
    reserved_by?: string | null
    order_id?: string | null
    updated_at?: Date | string | null
    locks?: LotLockCreateNestedManyWithoutLotInput
    transactions?: WebpayTransactionCreateNestedManyWithoutLotInput
  }

  export type LotUncheckedCreateWithoutReservationsInput = {
    id?: number
    number?: string | null
    stage?: number | null
    area_m2?: number | null
    price_total_clp?: number | null
    reservation_amount_clp?: number | null
    status?: string
    cuotas?: number | null
    pie?: number | null
    valor_cuota?: number | null
    last_installment_amount?: number | null
    reserved_until?: Date | string | null
    reserved_at?: Date | string | null
    reserved_by?: string | null
    order_id?: string | null
    updated_at?: Date | string | null
    locks?: LotLockUncheckedCreateNestedManyWithoutLotInput
    transactions?: WebpayTransactionUncheckedCreateNestedManyWithoutLotInput
  }

  export type LotCreateOrConnectWithoutReservationsInput = {
    where: LotWhereUniqueInput
    create: XOR<LotCreateWithoutReservationsInput, LotUncheckedCreateWithoutReservationsInput>
  }

  export type WebpayTransactionCreateWithoutReservationInput = {
    id?: string
    token: string
    buy_order: string
    amount_clp: number
    status?: string | null
    response_code?: number | null
    transaction_date?: Date | string | null
    authorization_code?: string | null
    payment_type_code?: string | null
    installments_number?: number | null
    processed_at?: Date | string | null
    scope?: string | null
    installments_count?: number | null
    created_at?: Date | string
    lot: LotCreateNestedOneWithoutTransactionsInput
  }

  export type WebpayTransactionUncheckedCreateWithoutReservationInput = {
    id?: string
    token: string
    buy_order: string
    amount_clp: number
    status?: string | null
    response_code?: number | null
    transaction_date?: Date | string | null
    authorization_code?: string | null
    payment_type_code?: string | null
    installments_number?: number | null
    processed_at?: Date | string | null
    scope?: string | null
    installments_count?: number | null
    created_at?: Date | string
    lot_id: number
  }

  export type WebpayTransactionCreateOrConnectWithoutReservationInput = {
    where: WebpayTransactionWhereUniqueInput
    create: XOR<WebpayTransactionCreateWithoutReservationInput, WebpayTransactionUncheckedCreateWithoutReservationInput>
  }

  export type WebpayTransactionCreateManyReservationInputEnvelope = {
    data: WebpayTransactionCreateManyReservationInput | WebpayTransactionCreateManyReservationInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutSalesInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteCreateNestedManyWithoutSellerInput
    calls?: CallLogCreateNestedManyWithoutSellerInput
    purchases?: ReservationCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSalesInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutSellerInput
    calls?: CallLogUncheckedCreateNestedManyWithoutSellerInput
    purchases?: ReservationUncheckedCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSalesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
  }

  export type UserCreateWithoutPurchasesInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteCreateNestedManyWithoutSellerInput
    calls?: CallLogCreateNestedManyWithoutSellerInput
    sales?: ReservationCreateNestedManyWithoutSellerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPurchasesInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutSellerInput
    calls?: CallLogUncheckedCreateNestedManyWithoutSellerInput
    sales?: ReservationUncheckedCreateNestedManyWithoutSellerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPurchasesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPurchasesInput, UserUncheckedCreateWithoutPurchasesInput>
  }

  export type ContactUpsertWithoutReservationsInput = {
    update: XOR<ContactUpdateWithoutReservationsInput, ContactUncheckedUpdateWithoutReservationsInput>
    create: XOR<ContactCreateWithoutReservationsInput, ContactUncheckedCreateWithoutReservationsInput>
    where?: ContactWhereInput
  }

  export type ContactUpdateToOneWithWhereWithoutReservationsInput = {
    where?: ContactWhereInput
    data: XOR<ContactUpdateWithoutReservationsInput, ContactUncheckedUpdateWithoutReservationsInput>
  }

  export type ContactUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutContactNestedInput
    calls?: CallLogUpdateManyWithoutContactNestedInput
    files?: ContactFileUpdateManyWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutContactNestedInput
    calls?: CallLogUncheckedUpdateManyWithoutContactNestedInput
    files?: ContactFileUncheckedUpdateManyWithoutContactNestedInput
  }

  export type LotUpsertWithoutReservationsInput = {
    update: XOR<LotUpdateWithoutReservationsInput, LotUncheckedUpdateWithoutReservationsInput>
    create: XOR<LotCreateWithoutReservationsInput, LotUncheckedCreateWithoutReservationsInput>
    where?: LotWhereInput
  }

  export type LotUpdateToOneWithWhereWithoutReservationsInput = {
    where?: LotWhereInput
    data: XOR<LotUpdateWithoutReservationsInput, LotUncheckedUpdateWithoutReservationsInput>
  }

  export type LotUpdateWithoutReservationsInput = {
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locks?: LotLockUpdateManyWithoutLotNestedInput
    transactions?: WebpayTransactionUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateWithoutReservationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locks?: LotLockUncheckedUpdateManyWithoutLotNestedInput
    transactions?: WebpayTransactionUncheckedUpdateManyWithoutLotNestedInput
  }

  export type WebpayTransactionUpsertWithWhereUniqueWithoutReservationInput = {
    where: WebpayTransactionWhereUniqueInput
    update: XOR<WebpayTransactionUpdateWithoutReservationInput, WebpayTransactionUncheckedUpdateWithoutReservationInput>
    create: XOR<WebpayTransactionCreateWithoutReservationInput, WebpayTransactionUncheckedCreateWithoutReservationInput>
  }

  export type WebpayTransactionUpdateWithWhereUniqueWithoutReservationInput = {
    where: WebpayTransactionWhereUniqueInput
    data: XOR<WebpayTransactionUpdateWithoutReservationInput, WebpayTransactionUncheckedUpdateWithoutReservationInput>
  }

  export type WebpayTransactionUpdateManyWithWhereWithoutReservationInput = {
    where: WebpayTransactionScalarWhereInput
    data: XOR<WebpayTransactionUpdateManyMutationInput, WebpayTransactionUncheckedUpdateManyWithoutReservationInput>
  }

  export type UserUpsertWithoutSalesInput = {
    update: XOR<UserUpdateWithoutSalesInput, UserUncheckedUpdateWithoutSalesInput>
    create: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSalesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSalesInput, UserUncheckedUpdateWithoutSalesInput>
  }

  export type UserUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutSellerNestedInput
    calls?: CallLogUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutSellerNestedInput
    calls?: CallLogUncheckedUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUncheckedUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutPurchasesInput = {
    update: XOR<UserUpdateWithoutPurchasesInput, UserUncheckedUpdateWithoutPurchasesInput>
    create: XOR<UserCreateWithoutPurchasesInput, UserUncheckedCreateWithoutPurchasesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPurchasesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPurchasesInput, UserUncheckedUpdateWithoutPurchasesInput>
  }

  export type UserUpdateWithoutPurchasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutSellerNestedInput
    calls?: CallLogUpdateManyWithoutSellerNestedInput
    sales?: ReservationUpdateManyWithoutSellerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPurchasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutSellerNestedInput
    calls?: CallLogUncheckedUpdateManyWithoutSellerNestedInput
    sales?: ReservationUncheckedUpdateManyWithoutSellerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LotCreateWithoutLocksInput = {
    number?: string | null
    stage?: number | null
    area_m2?: number | null
    price_total_clp?: number | null
    reservation_amount_clp?: number | null
    status?: string
    cuotas?: number | null
    pie?: number | null
    valor_cuota?: number | null
    last_installment_amount?: number | null
    reserved_until?: Date | string | null
    reserved_at?: Date | string | null
    reserved_by?: string | null
    order_id?: string | null
    updated_at?: Date | string | null
    reservations?: ReservationCreateNestedManyWithoutLotInput
    transactions?: WebpayTransactionCreateNestedManyWithoutLotInput
  }

  export type LotUncheckedCreateWithoutLocksInput = {
    id?: number
    number?: string | null
    stage?: number | null
    area_m2?: number | null
    price_total_clp?: number | null
    reservation_amount_clp?: number | null
    status?: string
    cuotas?: number | null
    pie?: number | null
    valor_cuota?: number | null
    last_installment_amount?: number | null
    reserved_until?: Date | string | null
    reserved_at?: Date | string | null
    reserved_by?: string | null
    order_id?: string | null
    updated_at?: Date | string | null
    reservations?: ReservationUncheckedCreateNestedManyWithoutLotInput
    transactions?: WebpayTransactionUncheckedCreateNestedManyWithoutLotInput
  }

  export type LotCreateOrConnectWithoutLocksInput = {
    where: LotWhereUniqueInput
    create: XOR<LotCreateWithoutLocksInput, LotUncheckedCreateWithoutLocksInput>
  }

  export type LotUpsertWithoutLocksInput = {
    update: XOR<LotUpdateWithoutLocksInput, LotUncheckedUpdateWithoutLocksInput>
    create: XOR<LotCreateWithoutLocksInput, LotUncheckedCreateWithoutLocksInput>
    where?: LotWhereInput
  }

  export type LotUpdateToOneWithWhereWithoutLocksInput = {
    where?: LotWhereInput
    data: XOR<LotUpdateWithoutLocksInput, LotUncheckedUpdateWithoutLocksInput>
  }

  export type LotUpdateWithoutLocksInput = {
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservations?: ReservationUpdateManyWithoutLotNestedInput
    transactions?: WebpayTransactionUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateWithoutLocksInput = {
    id?: IntFieldUpdateOperationsInput | number
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservations?: ReservationUncheckedUpdateManyWithoutLotNestedInput
    transactions?: WebpayTransactionUncheckedUpdateManyWithoutLotNestedInput
  }

  export type ReservationCreateWithoutTransactionsInput = {
    id?: string
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact?: ContactCreateNestedOneWithoutReservationsInput
    lot: LotCreateNestedOneWithoutReservationsInput
    seller?: UserCreateNestedOneWithoutSalesInput
    buyer?: UserCreateNestedOneWithoutPurchasesInput
  }

  export type ReservationUncheckedCreateWithoutTransactionsInput = {
    id?: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact_id?: string | null
    seller_id?: string | null
    buyer_id?: string | null
  }

  export type ReservationCreateOrConnectWithoutTransactionsInput = {
    where: ReservationWhereUniqueInput
    create: XOR<ReservationCreateWithoutTransactionsInput, ReservationUncheckedCreateWithoutTransactionsInput>
  }

  export type LotCreateWithoutTransactionsInput = {
    number?: string | null
    stage?: number | null
    area_m2?: number | null
    price_total_clp?: number | null
    reservation_amount_clp?: number | null
    status?: string
    cuotas?: number | null
    pie?: number | null
    valor_cuota?: number | null
    last_installment_amount?: number | null
    reserved_until?: Date | string | null
    reserved_at?: Date | string | null
    reserved_by?: string | null
    order_id?: string | null
    updated_at?: Date | string | null
    reservations?: ReservationCreateNestedManyWithoutLotInput
    locks?: LotLockCreateNestedManyWithoutLotInput
  }

  export type LotUncheckedCreateWithoutTransactionsInput = {
    id?: number
    number?: string | null
    stage?: number | null
    area_m2?: number | null
    price_total_clp?: number | null
    reservation_amount_clp?: number | null
    status?: string
    cuotas?: number | null
    pie?: number | null
    valor_cuota?: number | null
    last_installment_amount?: number | null
    reserved_until?: Date | string | null
    reserved_at?: Date | string | null
    reserved_by?: string | null
    order_id?: string | null
    updated_at?: Date | string | null
    reservations?: ReservationUncheckedCreateNestedManyWithoutLotInput
    locks?: LotLockUncheckedCreateNestedManyWithoutLotInput
  }

  export type LotCreateOrConnectWithoutTransactionsInput = {
    where: LotWhereUniqueInput
    create: XOR<LotCreateWithoutTransactionsInput, LotUncheckedCreateWithoutTransactionsInput>
  }

  export type ReservationUpsertWithoutTransactionsInput = {
    update: XOR<ReservationUpdateWithoutTransactionsInput, ReservationUncheckedUpdateWithoutTransactionsInput>
    create: XOR<ReservationCreateWithoutTransactionsInput, ReservationUncheckedCreateWithoutTransactionsInput>
    where?: ReservationWhereInput
  }

  export type ReservationUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: ReservationWhereInput
    data: XOR<ReservationUpdateWithoutTransactionsInput, ReservationUncheckedUpdateWithoutTransactionsInput>
  }

  export type ReservationUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: ContactUpdateOneWithoutReservationsNestedInput
    lot?: LotUpdateOneRequiredWithoutReservationsNestedInput
    seller?: UserUpdateOneWithoutSalesNestedInput
    buyer?: UserUpdateOneWithoutPurchasesNestedInput
  }

  export type ReservationUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact_id?: NullableStringFieldUpdateOperationsInput | string | null
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    buyer_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LotUpsertWithoutTransactionsInput = {
    update: XOR<LotUpdateWithoutTransactionsInput, LotUncheckedUpdateWithoutTransactionsInput>
    create: XOR<LotCreateWithoutTransactionsInput, LotUncheckedCreateWithoutTransactionsInput>
    where?: LotWhereInput
  }

  export type LotUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: LotWhereInput
    data: XOR<LotUpdateWithoutTransactionsInput, LotUncheckedUpdateWithoutTransactionsInput>
  }

  export type LotUpdateWithoutTransactionsInput = {
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservations?: ReservationUpdateManyWithoutLotNestedInput
    locks?: LotLockUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateWithoutTransactionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    number?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: NullableIntFieldUpdateOperationsInput | number | null
    area_m2?: NullableFloatFieldUpdateOperationsInput | number | null
    price_total_clp?: NullableIntFieldUpdateOperationsInput | number | null
    reservation_amount_clp?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    cuotas?: NullableIntFieldUpdateOperationsInput | number | null
    pie?: NullableIntFieldUpdateOperationsInput | number | null
    valor_cuota?: NullableIntFieldUpdateOperationsInput | number | null
    last_installment_amount?: NullableIntFieldUpdateOperationsInput | number | null
    reserved_until?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reserved_by?: NullableStringFieldUpdateOperationsInput | string | null
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservations?: ReservationUncheckedUpdateManyWithoutLotNestedInput
    locks?: LotLockUncheckedUpdateManyWithoutLotNestedInput
  }

  export type NoteCreateWithoutSellerInput = {
    id?: string
    content: string
    created_at?: Date | string
    contact: ContactCreateNestedOneWithoutNotesInput
  }

  export type NoteUncheckedCreateWithoutSellerInput = {
    id?: string
    contact_id: string
    content: string
    created_at?: Date | string
  }

  export type NoteCreateOrConnectWithoutSellerInput = {
    where: NoteWhereUniqueInput
    create: XOR<NoteCreateWithoutSellerInput, NoteUncheckedCreateWithoutSellerInput>
  }

  export type NoteCreateManySellerInputEnvelope = {
    data: NoteCreateManySellerInput | NoteCreateManySellerInput[]
    skipDuplicates?: boolean
  }

  export type CallLogCreateWithoutSellerInput = {
    id?: string
    duration?: number | null
    summary?: string | null
    date?: Date | string
    contact: ContactCreateNestedOneWithoutCallsInput
  }

  export type CallLogUncheckedCreateWithoutSellerInput = {
    id?: string
    contact_id: string
    duration?: number | null
    summary?: string | null
    date?: Date | string
  }

  export type CallLogCreateOrConnectWithoutSellerInput = {
    where: CallLogWhereUniqueInput
    create: XOR<CallLogCreateWithoutSellerInput, CallLogUncheckedCreateWithoutSellerInput>
  }

  export type CallLogCreateManySellerInputEnvelope = {
    data: CallLogCreateManySellerInput | CallLogCreateManySellerInput[]
    skipDuplicates?: boolean
  }

  export type ReservationCreateWithoutSellerInput = {
    id?: string
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact?: ContactCreateNestedOneWithoutReservationsInput
    lot: LotCreateNestedOneWithoutReservationsInput
    transactions?: WebpayTransactionCreateNestedManyWithoutReservationInput
    buyer?: UserCreateNestedOneWithoutPurchasesInput
  }

  export type ReservationUncheckedCreateWithoutSellerInput = {
    id?: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact_id?: string | null
    buyer_id?: string | null
    transactions?: WebpayTransactionUncheckedCreateNestedManyWithoutReservationInput
  }

  export type ReservationCreateOrConnectWithoutSellerInput = {
    where: ReservationWhereUniqueInput
    create: XOR<ReservationCreateWithoutSellerInput, ReservationUncheckedCreateWithoutSellerInput>
  }

  export type ReservationCreateManySellerInputEnvelope = {
    data: ReservationCreateManySellerInput | ReservationCreateManySellerInput[]
    skipDuplicates?: boolean
  }

  export type ReservationCreateWithoutBuyerInput = {
    id?: string
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact?: ContactCreateNestedOneWithoutReservationsInput
    lot: LotCreateNestedOneWithoutReservationsInput
    transactions?: WebpayTransactionCreateNestedManyWithoutReservationInput
    seller?: UserCreateNestedOneWithoutSalesInput
  }

  export type ReservationUncheckedCreateWithoutBuyerInput = {
    id?: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact_id?: string | null
    seller_id?: string | null
    transactions?: WebpayTransactionUncheckedCreateNestedManyWithoutReservationInput
  }

  export type ReservationCreateOrConnectWithoutBuyerInput = {
    where: ReservationWhereUniqueInput
    create: XOR<ReservationCreateWithoutBuyerInput, ReservationUncheckedCreateWithoutBuyerInput>
  }

  export type ReservationCreateManyBuyerInputEnvelope = {
    data: ReservationCreateManyBuyerInput | ReservationCreateManyBuyerInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    action: $Enums.ActionType
    entity: string
    entity_id?: string | null
    details?: string | null
    pk?: string | null
    user_email?: string | null
    ip_address?: string | null
    user_agent?: string | null
    created_at?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    action: $Enums.ActionType
    entity: string
    entity_id?: string | null
    details?: string | null
    pk?: string | null
    user_email?: string | null
    ip_address?: string | null
    user_agent?: string | null
    created_at?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    type: string
    title: string
    message: string
    read?: boolean
    created_at?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    title: string
    message: string
    read?: boolean
    created_at?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NoteUpsertWithWhereUniqueWithoutSellerInput = {
    where: NoteWhereUniqueInput
    update: XOR<NoteUpdateWithoutSellerInput, NoteUncheckedUpdateWithoutSellerInput>
    create: XOR<NoteCreateWithoutSellerInput, NoteUncheckedCreateWithoutSellerInput>
  }

  export type NoteUpdateWithWhereUniqueWithoutSellerInput = {
    where: NoteWhereUniqueInput
    data: XOR<NoteUpdateWithoutSellerInput, NoteUncheckedUpdateWithoutSellerInput>
  }

  export type NoteUpdateManyWithWhereWithoutSellerInput = {
    where: NoteScalarWhereInput
    data: XOR<NoteUpdateManyMutationInput, NoteUncheckedUpdateManyWithoutSellerInput>
  }

  export type CallLogUpsertWithWhereUniqueWithoutSellerInput = {
    where: CallLogWhereUniqueInput
    update: XOR<CallLogUpdateWithoutSellerInput, CallLogUncheckedUpdateWithoutSellerInput>
    create: XOR<CallLogCreateWithoutSellerInput, CallLogUncheckedCreateWithoutSellerInput>
  }

  export type CallLogUpdateWithWhereUniqueWithoutSellerInput = {
    where: CallLogWhereUniqueInput
    data: XOR<CallLogUpdateWithoutSellerInput, CallLogUncheckedUpdateWithoutSellerInput>
  }

  export type CallLogUpdateManyWithWhereWithoutSellerInput = {
    where: CallLogScalarWhereInput
    data: XOR<CallLogUpdateManyMutationInput, CallLogUncheckedUpdateManyWithoutSellerInput>
  }

  export type ReservationUpsertWithWhereUniqueWithoutSellerInput = {
    where: ReservationWhereUniqueInput
    update: XOR<ReservationUpdateWithoutSellerInput, ReservationUncheckedUpdateWithoutSellerInput>
    create: XOR<ReservationCreateWithoutSellerInput, ReservationUncheckedCreateWithoutSellerInput>
  }

  export type ReservationUpdateWithWhereUniqueWithoutSellerInput = {
    where: ReservationWhereUniqueInput
    data: XOR<ReservationUpdateWithoutSellerInput, ReservationUncheckedUpdateWithoutSellerInput>
  }

  export type ReservationUpdateManyWithWhereWithoutSellerInput = {
    where: ReservationScalarWhereInput
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyWithoutSellerInput>
  }

  export type ReservationUpsertWithWhereUniqueWithoutBuyerInput = {
    where: ReservationWhereUniqueInput
    update: XOR<ReservationUpdateWithoutBuyerInput, ReservationUncheckedUpdateWithoutBuyerInput>
    create: XOR<ReservationCreateWithoutBuyerInput, ReservationUncheckedCreateWithoutBuyerInput>
  }

  export type ReservationUpdateWithWhereUniqueWithoutBuyerInput = {
    where: ReservationWhereUniqueInput
    data: XOR<ReservationUpdateWithoutBuyerInput, ReservationUncheckedUpdateWithoutBuyerInput>
  }

  export type ReservationUpdateManyWithWhereWithoutBuyerInput = {
    where: ReservationScalarWhereInput
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyWithoutBuyerInput>
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    action?: EnumActionTypeFilter<"AuditLog"> | $Enums.ActionType
    entity?: StringFilter<"AuditLog"> | string
    entity_id?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    pk?: StringNullableFilter<"AuditLog"> | string | null
    user_id?: StringNullableFilter<"AuditLog"> | string | null
    user_email?: StringNullableFilter<"AuditLog"> | string | null
    ip_address?: StringNullableFilter<"AuditLog"> | string | null
    user_agent?: StringNullableFilter<"AuditLog"> | string | null
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    user_id?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteCreateNestedManyWithoutSellerInput
    calls?: CallLogCreateNestedManyWithoutSellerInput
    sales?: ReservationCreateNestedManyWithoutSellerInput
    purchases?: ReservationCreateNestedManyWithoutBuyerInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutSellerInput
    calls?: CallLogUncheckedCreateNestedManyWithoutSellerInput
    sales?: ReservationUncheckedCreateNestedManyWithoutSellerInput
    purchases?: ReservationUncheckedCreateNestedManyWithoutBuyerInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutSellerNestedInput
    calls?: CallLogUpdateManyWithoutSellerNestedInput
    sales?: ReservationUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUpdateManyWithoutBuyerNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutSellerNestedInput
    calls?: CallLogUncheckedUpdateManyWithoutSellerNestedInput
    sales?: ReservationUncheckedUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUncheckedUpdateManyWithoutBuyerNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteCreateNestedManyWithoutSellerInput
    calls?: CallLogCreateNestedManyWithoutSellerInput
    sales?: ReservationCreateNestedManyWithoutSellerInput
    purchases?: ReservationCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    password: string
    name: string
    role?: $Enums.Role
    mustChangePassword?: boolean
    createdAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutSellerInput
    calls?: CallLogUncheckedCreateNestedManyWithoutSellerInput
    sales?: ReservationUncheckedCreateNestedManyWithoutSellerInput
    purchases?: ReservationUncheckedCreateNestedManyWithoutBuyerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutSellerNestedInput
    calls?: CallLogUpdateManyWithoutSellerNestedInput
    sales?: ReservationUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutSellerNestedInput
    calls?: CallLogUncheckedUpdateManyWithoutSellerNestedInput
    sales?: ReservationUncheckedUpdateManyWithoutSellerNestedInput
    purchases?: ReservationUncheckedUpdateManyWithoutBuyerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ReservationCreateManyLotInput = {
    id?: string
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact_id?: string | null
    seller_id?: string | null
    buyer_id?: string | null
  }

  export type LotLockCreateManyLotInput = {
    locked_by: string
    locked_until: Date | string
    created_at?: Date | string
  }

  export type WebpayTransactionCreateManyLotInput = {
    id?: string
    token: string
    buy_order: string
    amount_clp: number
    status?: string | null
    response_code?: number | null
    transaction_date?: Date | string | null
    authorization_code?: string | null
    payment_type_code?: string | null
    installments_number?: number | null
    processed_at?: Date | string | null
    scope?: string | null
    installments_count?: number | null
    created_at?: Date | string
    reservation_id: string
  }

  export type ReservationUpdateWithoutLotInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: ContactUpdateOneWithoutReservationsNestedInput
    transactions?: WebpayTransactionUpdateManyWithoutReservationNestedInput
    seller?: UserUpdateOneWithoutSalesNestedInput
    buyer?: UserUpdateOneWithoutPurchasesNestedInput
  }

  export type ReservationUncheckedUpdateWithoutLotInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact_id?: NullableStringFieldUpdateOperationsInput | string | null
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    buyer_id?: NullableStringFieldUpdateOperationsInput | string | null
    transactions?: WebpayTransactionUncheckedUpdateManyWithoutReservationNestedInput
  }

  export type ReservationUncheckedUpdateManyWithoutLotInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact_id?: NullableStringFieldUpdateOperationsInput | string | null
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    buyer_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LotLockUpdateWithoutLotInput = {
    locked_by?: StringFieldUpdateOperationsInput | string
    locked_until?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LotLockUncheckedUpdateWithoutLotInput = {
    locked_by?: StringFieldUpdateOperationsInput | string
    locked_until?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LotLockUncheckedUpdateManyWithoutLotInput = {
    locked_by?: StringFieldUpdateOperationsInput | string
    locked_until?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebpayTransactionUpdateWithoutLotInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation?: ReservationUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type WebpayTransactionUncheckedUpdateWithoutLotInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation_id?: StringFieldUpdateOperationsInput | string
  }

  export type WebpayTransactionUncheckedUpdateManyWithoutLotInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation_id?: StringFieldUpdateOperationsInput | string
  }

  export type ReservationCreateManyContactInput = {
    id?: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    seller_id?: string | null
    buyer_id?: string | null
  }

  export type NoteCreateManyContactInput = {
    id?: string
    seller_id: string
    content: string
    created_at?: Date | string
  }

  export type CallLogCreateManyContactInput = {
    id?: string
    seller_id: string
    duration?: number | null
    summary?: string | null
    date?: Date | string
  }

  export type ContactFileCreateManyContactInput = {
    id?: string
    name: string
    url: string
    type?: string | null
    created_at?: Date | string
  }

  export type ReservationUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    lot?: LotUpdateOneRequiredWithoutReservationsNestedInput
    transactions?: WebpayTransactionUpdateManyWithoutReservationNestedInput
    seller?: UserUpdateOneWithoutSalesNestedInput
    buyer?: UserUpdateOneWithoutPurchasesNestedInput
  }

  export type ReservationUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    buyer_id?: NullableStringFieldUpdateOperationsInput | string | null
    transactions?: WebpayTransactionUncheckedUpdateManyWithoutReservationNestedInput
  }

  export type ReservationUncheckedUpdateManyWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    buyer_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NoteUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutNotesNestedInput
  }

  export type NoteUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteUncheckedUpdateManyWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallLogUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutCallsNestedInput
  }

  export type CallLogUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallLogUncheckedUpdateManyWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactFileUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactFileUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactFileUncheckedUpdateManyWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebpayTransactionCreateManyReservationInput = {
    id?: string
    token: string
    buy_order: string
    amount_clp: number
    status?: string | null
    response_code?: number | null
    transaction_date?: Date | string | null
    authorization_code?: string | null
    payment_type_code?: string | null
    installments_number?: number | null
    processed_at?: Date | string | null
    scope?: string | null
    installments_count?: number | null
    created_at?: Date | string
    lot_id: number
  }

  export type WebpayTransactionUpdateWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    lot?: LotUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type WebpayTransactionUncheckedUpdateWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    lot_id?: IntFieldUpdateOperationsInput | number
  }

  export type WebpayTransactionUncheckedUpdateManyWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    buy_order?: StringFieldUpdateOperationsInput | string
    amount_clp?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    response_code?: NullableIntFieldUpdateOperationsInput | number | null
    transaction_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    authorization_code?: NullableStringFieldUpdateOperationsInput | string | null
    payment_type_code?: NullableStringFieldUpdateOperationsInput | string | null
    installments_number?: NullableIntFieldUpdateOperationsInput | number | null
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    installments_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    lot_id?: IntFieldUpdateOperationsInput | number
  }

  export type NoteCreateManySellerInput = {
    id?: string
    contact_id: string
    content: string
    created_at?: Date | string
  }

  export type CallLogCreateManySellerInput = {
    id?: string
    contact_id: string
    duration?: number | null
    summary?: string | null
    date?: Date | string
  }

  export type ReservationCreateManySellerInput = {
    id?: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact_id?: string | null
    buyer_id?: string | null
  }

  export type ReservationCreateManyBuyerInput = {
    id?: string
    lot_id: number
    name: string
    email: string
    phone: string
    rut?: string | null
    address?: string | null
    folio?: string | null
    status: string
    session_id?: string | null
    expires_at?: Date | string | null
    created_at?: Date | string
    marital_status?: string | null
    profession?: string | null
    nationality?: string | null
    pipeline_stage?: string
    notes?: string | null
    uploaded_contract_url?: string | null
    address_street?: string | null
    address_number?: string | null
    address_commune?: string | null
    address_region?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_content?: string | null
    utm_term?: string | null
    pie_status?: string | null
    installments_paid?: number | null
    signature_otp?: string | null
    signature_otp_expires?: Date | string | null
    signed_at?: Date | string | null
    signature_ip?: string | null
    promesa_signature_otp?: string | null
    promesa_signature_otp_expires?: Date | string | null
    promesa_signed_at?: Date | string | null
    promesa_signature_ip?: string | null
    contact_id?: string | null
    seller_id?: string | null
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    action: $Enums.ActionType
    entity: string
    entity_id?: string | null
    details?: string | null
    pk?: string | null
    user_email?: string | null
    ip_address?: string | null
    user_agent?: string | null
    created_at?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    type: string
    title: string
    message: string
    read?: boolean
    created_at?: Date | string
  }

  export type NoteUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneRequiredWithoutNotesNestedInput
  }

  export type NoteUncheckedUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteUncheckedUpdateManyWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallLogUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneRequiredWithoutCallsNestedInput
  }

  export type CallLogUncheckedUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallLogUncheckedUpdateManyWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    contact_id?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: ContactUpdateOneWithoutReservationsNestedInput
    lot?: LotUpdateOneRequiredWithoutReservationsNestedInput
    transactions?: WebpayTransactionUpdateManyWithoutReservationNestedInput
    buyer?: UserUpdateOneWithoutPurchasesNestedInput
  }

  export type ReservationUncheckedUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact_id?: NullableStringFieldUpdateOperationsInput | string | null
    buyer_id?: NullableStringFieldUpdateOperationsInput | string | null
    transactions?: WebpayTransactionUncheckedUpdateManyWithoutReservationNestedInput
  }

  export type ReservationUncheckedUpdateManyWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact_id?: NullableStringFieldUpdateOperationsInput | string | null
    buyer_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReservationUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: ContactUpdateOneWithoutReservationsNestedInput
    lot?: LotUpdateOneRequiredWithoutReservationsNestedInput
    transactions?: WebpayTransactionUpdateManyWithoutReservationNestedInput
    seller?: UserUpdateOneWithoutSalesNestedInput
  }

  export type ReservationUncheckedUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact_id?: NullableStringFieldUpdateOperationsInput | string | null
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    transactions?: WebpayTransactionUncheckedUpdateManyWithoutReservationNestedInput
  }

  export type ReservationUncheckedUpdateManyWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    lot_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    folio?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    marital_status?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    pipeline_stage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_contract_url?: NullableStringFieldUpdateOperationsInput | string | null
    address_street?: NullableStringFieldUpdateOperationsInput | string | null
    address_number?: NullableStringFieldUpdateOperationsInput | string | null
    address_commune?: NullableStringFieldUpdateOperationsInput | string | null
    address_region?: NullableStringFieldUpdateOperationsInput | string | null
    utm_source?: NullableStringFieldUpdateOperationsInput | string | null
    utm_medium?: NullableStringFieldUpdateOperationsInput | string | null
    utm_campaign?: NullableStringFieldUpdateOperationsInput | string | null
    utm_content?: NullableStringFieldUpdateOperationsInput | string | null
    utm_term?: NullableStringFieldUpdateOperationsInput | string | null
    pie_status?: NullableStringFieldUpdateOperationsInput | string | null
    installments_paid?: NullableIntFieldUpdateOperationsInput | number | null
    signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp?: NullableStringFieldUpdateOperationsInput | string | null
    promesa_signature_otp_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    promesa_signature_ip?: NullableStringFieldUpdateOperationsInput | string | null
    contact_id?: NullableStringFieldUpdateOperationsInput | string | null
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    entity?: StringFieldUpdateOperationsInput | string
    entity_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    pk?: NullableStringFieldUpdateOperationsInput | string | null
    user_email?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_agent?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    entity?: StringFieldUpdateOperationsInput | string
    entity_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    pk?: NullableStringFieldUpdateOperationsInput | string | null
    user_email?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_agent?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    entity?: StringFieldUpdateOperationsInput | string
    entity_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    pk?: NullableStringFieldUpdateOperationsInput | string | null
    user_email?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_agent?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}