import { Prisma } from '@prisma/client';

type ValueOf<T> = T[keyof T];

type NonEmptyArray<T> = [T, ...T[]];

type NonEmptyObject<T> = {} extends T ? never : T;

type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never;

type AtLeastOne<Obj, Keys = keyof Obj> = Keys extends keyof Obj ? Pick<Obj, Keys> : never;

type NonEmpty<T> = Partial<T> & AtLeastOne<T>

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

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type ReplaceType<Type, FromType, ToType> =
    Type extends object
    ? ReplaceTypes<Type, FromType, ToType>
    : Type extends FromType
        ? ToType
        : Type;

type ReplaceTypes<ObjType extends object, FromType, ToType> = {
    [KeyType in keyof ObjType]: ReplaceType<ObjType[KeyType], FromType, ToType>;
}

type ReplaceDecimal<T> = {
  [K in keyof T]: T[K] extends Prisma.Decimal
    ? number
    : T[K] extends Record<string, unknown>
    ? ReplaceDecimal<T[K]>
    : T[K] extends Record<string, unknown>[]
    ? ReplaceDecimal<T[K][0]>[]
    : T[K]
}

function isNonEmptyArray<A>(arr: Array<A>): arr is NonEmptyArray<A> {
  return arr.length > 0;
}

function isType<T>(obj: unknown, key: keyof T): obj is T {
  return (obj as T)[key] !== undefined;
}

export {
  type NonEmptyArray,
  type NonEmptyObject,
  type MustInclude,
  type ValueOf,
  type AtLeastOne,
  type NonEmpty,
  type Without,
  type XOR,
  type WithRequiredProperty,
  type PartialBy,
  type ReplaceTypes,
  type ReplaceDecimal,
  isNonEmptyArray,
  isType,
};
