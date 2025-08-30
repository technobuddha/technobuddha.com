<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [English](./index.md) / readability

# Function: readability()

```ts
function readability(text: string): number;
```

Defined in: [readability.ts:28](https://github.com/technobuddha/library/blob/main/src/readability.ts#L28)

Calculates the Flesch-Kincaid readability score for a given text.

The Flesch-Kincaid readability score estimates how easy a text is to read,
with higher scores indicating easier readability. The formula considers the
average number of words per sentence and the average number of syllables per word.

| Score        | School Level       | Notes                                                                    |
| ------------ | ------------------ | ------------------------------------------------------------------------ |
| 100.00–90.00 | 5ᵗʰ grade          | Very easy to read. Easily understood by an average 11-year-old student.  |
| 90.0–80.0	  | 6ᵗʰ grade	         | Easy to read. Conversational English for consumers.                      |
| 80.0–70.0	  | 7ᵗʰ grade	         | Fairly easy to read.                                                     |
| 70.0–60.0	  | 8ᵗʰ & 9ᵗʰ grade	   | Plain English. Easily understood by 13-15 year-old students.             |
| 60.0–50.0	  | 10ᵗʰ to 12ᵗʰ grade | Fairly difficult to read.                                                |
| 50.0–30.0    | College            | Difficult to read.                                                       |
| 30.0–10.0    | College graduate   | Very difficult to read. Best understood by university graduates.         |
| 10.0–0.0     | Professional       | Extremely difficult to read. Best understood by university graduates.    |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The input text to analyze. |

## Returns

`number`

The Flesch-Kincaid readability score as a number.

## See

https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests

