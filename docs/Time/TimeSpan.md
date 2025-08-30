<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / TimeSpan

# Class: TimeSpan

Defined in: [time-span.ts:19](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L19)

Store and manipulate a duration of time

## Constructors

### Constructor

```ts
new TimeSpan(): TimeSpan;
```

Defined in: [src/time-span.ts:23](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L23)

Create a new TimeSpan

#### Returns

`TimeSpan`

### Constructor

```ts
new TimeSpan(ticks: number): TimeSpan;
```

Defined in: [src/time-span.ts:28](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L28)

Create a new TimeSpan from ticks (milliseconds)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ticks` | `number` | the number of ticks (milliseconds) |

#### Returns

`TimeSpan`

### Constructor

```ts
new TimeSpan(
   h: number, 
   m: number, 
   s: number): TimeSpan;
```

Defined in: [src/time-span.ts:35](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L35)

Create a new TimeSpan from hours, minutes, and seconds

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `h` | `number` | Hours |
| `m` | `number` | minutes |
| `s` | `number` | seconds |

#### Returns

`TimeSpan`

### Constructor

```ts
new TimeSpan(
   d: number, 
   h: number, 
   m: number, 
   s: number): TimeSpan;
```

Defined in: [src/time-span.ts:43](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L43)

Create a new TimeSpan from days, hours, minutes, and seconds

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `d` | `number` | Days |
| `h` | `number` | Hours |
| `m` | `number` | minutes |
| `s` | `number` | seconds |

#### Returns

`TimeSpan`

### Constructor

```ts
new TimeSpan(
   d: number, 
   h: number, 
   m: number, 
   s: number, 
   ms: number): TimeSpan;
```

Defined in: [src/time-span.ts:52](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L52)

Create a new TimeSpan from days, hours, minutes, seconds, and milliseconds

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `d` | `number` | Days |
| `h` | `number` | Hours |
| `m` | `number` | minutes |
| `s` | `number` | seconds |
| `ms` | `number` | milliseconds |

#### Returns

`TimeSpan`

### Constructor

```ts
new TimeSpan(text: string): TimeSpan;
```

Defined in: [src/time-span.ts:57](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L57)

Create a new TimeSpan from a formatted string

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | formatted timespan (dd:hh:mm:ss.fff) leading zero fields can be omitted |

#### Returns

`TimeSpan`

## Accessors

### days

#### Get Signature

```ts
get days(): number;
```

Defined in: [src/time-span.ts:150](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L150)

Get the days portion

##### Returns

`number`

***

### hours

#### Get Signature

```ts
get hours(): number;
```

Defined in: [src/time-span.ts:157](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L157)

Get the hours portion

##### Returns

`number`

***

### milliseconds

#### Get Signature

```ts
get milliseconds(): number;
```

Defined in: [src/time-span.ts:185](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L185)

Get the milliseconds portion

##### Returns

`number`

***

### minutes

#### Get Signature

```ts
get minutes(): number;
```

Defined in: [src/time-span.ts:166](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L166)

Get the minutes portion

##### Returns

`number`

***

### seconds

#### Get Signature

```ts
get seconds(): number;
```

Defined in: [src/time-span.ts:175](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L175)

Get the seconds portion

##### Returns

`number`

***

### ticks

#### Get Signature

```ts
get ticks(): number;
```

Defined in: [src/time-span.ts:192](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L192)

Get the total number of ticks (milliseconds)

##### Returns

`number`

***

### totalDays

#### Get Signature

```ts
get totalDays(): number;
```

Defined in: [src/time-span.ts:199](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L199)

Get the total number of days

##### Returns

`number`

***

### totalHours

#### Get Signature

```ts
get totalHours(): number;
```

Defined in: [src/time-span.ts:206](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L206)

Get the total number of hours

##### Returns

`number`

***

### totalMilliseconds

#### Get Signature

```ts
get totalMilliseconds(): number;
```

Defined in: [src/time-span.ts:227](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L227)

Get the total number of milliseconds

##### Returns

`number`

***

### totalMinutes

#### Get Signature

```ts
get totalMinutes(): number;
```

Defined in: [src/time-span.ts:213](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L213)

Get the total number of minutes

##### Returns

`number`

***

### totalSeconds

#### Get Signature

```ts
get totalSeconds(): number;
```

Defined in: [src/time-span.ts:220](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L220)

Get the total number of seconds

##### Returns

`number`

## Methods

### add()

```ts
add(other: TimeSpan): TimeSpan;
```

Defined in: [src/time-span.ts:297](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L297)

Add two timespans

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `TimeSpan` | TimeSpan to add to this |

#### Returns

`TimeSpan`

a TimeSpan that is the sum of two timespans

***

### format()

```ts
format(mask?: string): string;
```

Defined in: [src/time-span.ts:237](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L237)

Format the timespan using a mask

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mask?` | `string` | The mask |

#### Returns

`string`

the formatted TimeSpan

***

### toString()

```ts
toString(): string;
```

Defined in: [src/time-span.ts:287](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L287)

Convert the TimeSpan to a string

#### Returns

`string`

formatted string

***

### compare()

```ts
static compare(t1: TimeSpan, t2: TimeSpan): number;
```

Defined in: [src/time-span.ts:308](https://github.com/technobuddha/library/blob/main/src/time-span.ts#L308)

Compare two TimeSpans

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `t1` | `TimeSpan` | First TimeSpan |
| `t2` | `TimeSpan` | Second TimeSpan |

#### Returns

`number`

-1 if the first time span is less then the second, 0 if they are equal, 1 if the first is greater

