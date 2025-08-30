<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / Math

# Math

### Comparison

| Name | Description |
| ------ | ------ |
| [ApproximatelyEqualsOptions](ApproximatelyEqualsOptions.md) | Options for the [approximatelyEquals](approximatelyEquals.md) function |
| [approximatelyEquals](approximatelyEquals.md) | Tests whether the two values are equal to each other, within a certain tolerance, taking into account floating point errors (numbers within EPSILON). |
| [compareNumbers](compareNumbers.md) | Compare two numbers |
| [isEven](isEven.md) | Tests to see if the specified value is an even integer |
| [isMultipleOf](isMultipleOf.md) | Tests to see if the specified value is an multiple of *multiplier* |
| [isNegativeZero](isNegativeZero.md) | Tests to see if the specified value is negative zero |
| [isOdd](isOdd.md) | Tests to see if the specified value is an odd integer |

### Constants

| Variable | Description |
| ------ | ------ |
| [cardinalOnes](cardinalOnes.md) | Words for unit numbers 0-19 |
| [cardinalTens](cardinalTens.md) | Words for tens 20-90 |
| [negativeZero](negativeZero.md) | Negative Zero |
| [ordinalOnes](ordinalOnes.md) | Words for ordinal numbers 0-19 |
| [ordinalTens](ordinalTens.md) | Words for ordinal tens 20-90 |

### Number

| Name | Description |
| ------ | ------ |
| [DeconstructedNumber](DeconstructedNumber.md) | Represents a number that has been deconstructed into its mathematical components. |
| [constructNumber](constructNumber.md) | Reconstructs a number from its deconstructed representation. |
| [deconstructNumber](deconstructNumber.md) | Deconstructs a number into its sign, value, mantissa, and exponent, and separates its whole and fractional parts. |

### Operations

| Name | Description |
| ------ | ------ |
| [CeilOptions](CeilOptions.md) | Options for the [ceil](ceil.md) function |
| [FloorOptions](FloorOptions.md) | Options for the [floor](floor.md) function |
| [RoundOptions](RoundOptions.md) | Options for the [round](round.md) function |
| [ceil](ceil.md) | Returns the smallest integer greater than or equal to the given number, with optional tolerance and precision adjustments. |
| [clamp](clamp.md) | Clamps a number within the inclusive range specified by `min` and `max`. |
| [crossProduct](crossProduct.md) | Calculates the cross product of vectors OA and OB, where O, A, and B are points in 2D Cartesian space. The result is positive if the sequence OAB makes a counter-clockwise turn, negative for a clockwise turn, and zero if the points are collinear. |
| [floor](floor.md) | Returns the largest integer less than or equal to the given number, with optional tolerance and precision adjustments. |
| [lerp](lerp.md) | Performs linear interpolation between values a and b. Returns the value between a and b proportional to x (when x is between 0 and 1. When x is outside this range, the return value is a linear extrapolation). |
| [modulo](modulo.md) | The % operator in JavaScript returns the remainder of a / b, but differs from some other languages in that the result will have the same sign as the dividend. For example, -1 % 8 == -1, whereas in some other languages (such as Python) the result would be 7. This function emulates the more correct modulo behavior, which is useful for certain applications such as calculating an offset index in a circular list. |
| [round](round.md) | Returns the nearest integer to the given number, with optional precision adjustments. |

### Roman Numerals

| Name | Description |
| ------ | ------ |
| [RomanOptions](RomanOptions.md) | Options for converting numbers to Roman numerals. |
| [deromanize](deromanize.md) | Parse a roman numeral string into its integer value. |
| [romanize](romanize.md) | Convert a number into a roman numeral string |

### Statistics

| Function | Description |
| ------ | ------ |
| [mean](mean.md) | Calculates the Operations mean (average) of an array of numbers. |
| [median](median.md) | Calculates the median value of an array of numbers. |
| [mode](mode.md) | Returns the mode (the most frequently occurring element) of the given array. If multiple elements have the same highest frequency, the first encountered is returned. Returns `undefined` if the array is empty. |
| [standardDeviation](standardDeviation.md) | Returns the sample [Standard Deviation](https://en.wikipedia.org/wiki/Standard_deviation) of the arguments. |
| [sum](sum.md) | Calculates the sum of an array of numbers. |
| [variance](variance.md) | Returns the unbiased sample [Variance](https://en.wikipedia.org/wiki/Variance) of the arguments. |

### Verbalization

| Name | Description |
| ------ | ------ |
| [BinaryUnitsOptions](BinaryUnitsOptions.md) | Options for the [binaryUnits](binaryUnits.md) function |
| [CardinalOptions](CardinalOptions.md) | Configuration options for cardinal number conversion. |
| [FractionOptions](FractionOptions.md) | Options for customizing the output and behavior of fraction number representations. |
| [MetricUnitsOptions](MetricUnitsOptions.md) | Options for the [metricUnits](metricUnits.md) function w |
| [Numbering](Numbering.md) | Options for controlling how numbers are converted to words or symbols. |
| [OrdinalOptions](OrdinalOptions.md) | Options for formatting ordinal numbers. |
| [binaryUnits](binaryUnits.md) | Abbreviate a binary number by adding a suffix for metric units (i.e. 1024 =\> 1KiB) |
| [cardinal](cardinal.md) | Convert a number into text (the cardinal number) |
| [formatNumber](formatNumber.md) | Formats a number according to the specified mask. |
| [fraction](fraction.md) | Converts a numeric input into a formatted fraction string, either in numeric or alphabetic form. |
| [metricUnits](metricUnits.md) | Abbreviate a number by adding a suffix for metric units (i.e. 1000 =\> 1K, .0001 = 1m) |
| [orderOfMagnitude](orderOfMagnitude.md) | Get the spelled out word for an exponent |
| [ordinal](ordinal.md) | Convert a number into an ordinal number string (1st, 2nd, 3rd, etc). |
| [pad](pad.md) | Add leading zeros to a number to ensure a string of a minimum length |
| [summarize](summarize.md) | Get a short description of a number |
