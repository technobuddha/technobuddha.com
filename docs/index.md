<!-- markdownlint-disable -->
<!-- cspell: disable -->

# Index

## Array

### Creation

| Function | Description |
| ------ | ------ |
| [create2DArray](Array/create2DArray.md) | Create a two dimensional array with all elements initialized |

### Iteration

| Name | Description |
| ------ | ------ |
| [LookAheadOptions](Array/LookAheadOptions.md) | Options for [lookAhead](Array/lookAhead.md) operations. |
| [lookAhead](Array/lookAhead.md) | Generates pairs of consecutive elements from the input array, with optional handling for the last element. |

### Methods

| Name | Description |
| ------ | ------ |
| [Collapsible](Array/Collapsible.md) | Represents a value that can be "collapsed" into a flat sequence of values of type `T`. |
| [CollapsiblePrimitive](Array/CollapsiblePrimitive.md) | Represents a primitive type that excludes `null` and `undefined`. |
| [CollapsibleValue](Array/CollapsibleValue.md) | A `CollapsibleValue<T>` |
| [LongestCommonSubsequenceOptions](Array/LongestCommonSubsequenceOptions.md) | Options for configuring the [longestCommonSubsequence](Array/longestCommonSubsequence.md) calculation. |
| [collapse](Array/collapse.md) | Collapses an array of values into a flat array with `null` and `undefined` elements removed. |
| [longestCommonSubsequence](Array/longestCommonSubsequence.md) | Determine the longest possible array that is subsequence of both of given arrays. |
| [zipperMerge](Array/zipperMerge.md) | Merges multiple arrays into a single array by interleaving their elements at each index. |

## Encoding

### Binary

| Name | Description |
| ------ | ------ |
| [BinaryEncoding](Encoding/BinaryEncoding.md) | Formats for binary encoding |
| [BinaryObject](Encoding/BinaryObject.md) | A type that represents various binary object types in JavaScript. |
| [dataURL](Encoding/dataURL.md) | Convert any binary object into a data URL |
| [decodeBase64](Encoding/decodeBase64.md) | Decodes a string of data which has been encoded using [Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64) encoding. |
| [decodeBase64Url](Encoding/decodeBase64Url.md) | Decodes a string of data which has been encoded using [Base64Url](https://developer.mozilla.org/en-US/docs/Glossary/Base64) encoding. |
| [decodeBinary](Encoding/decodeBinary.md) | Decode a string into a binary object |
| [encodeBase64](Encoding/encodeBase64.md) | Creates a encoded ASCII string from a [BinaryObject](Encoding/BinaryObject.md) or `string` using [Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64). |
| [encodeBase64Url](Encoding/encodeBase64Url.md) | Creates a encoded ASCII string from a [BinaryObject](Encoding/BinaryObject.md) or `string` using [Base64Url](https://developer.mozilla.org/en-US/docs/Glossary/Base64). |
| [encodeBinary](Encoding/encodeBinary.md) | Encode an [BinaryObject](Encoding/BinaryObject.md) into a string |
| [normalizeBinary](Encoding/normalizeBinary.md) | Normalizes [BinaryObject](Encoding/BinaryObject.md) to a `Uint8Array`. |

### Escaping

| Name | Description |
| ------ | ------ |
| [EscapeHtmlOptions](Encoding/EscapeHtmlOptions.md) | Options for [escapeHTML](Encoding/escapeHTML.md) |
| [escapeC](Encoding/escapeC.md) | Escape a string for use in C/C++ |
| [escapeGraphQL](Encoding/escapeGraphQL.md) | Escape a string for use in GraphQL |
| [escapeHTML](Encoding/escapeHTML.md) | Escape a string for use in HTML |
| [escapeJava](Encoding/escapeJava.md) | Escape a string for use in Java |
| [escapeJS](Encoding/escapeJS.md) | Escape a string for use in Javascript |
| [escapePython](Encoding/escapePython.md) | Escape a string for use in Python |
| [unescapeC](Encoding/unescapeC.md) | Unescape a string encoded in C style |
| [unescapeHTML](Encoding/unescapeHTML.md) | Unescape a string encoded in HTML |
| [unescapeJava](Encoding/unescapeJava.md) | Unescape a string encoded in Java style |
| [unescapeJS](Encoding/unescapeJS.md) | Unescape a string encoded in Javascript style |
| [unescapePython](Encoding/unescapePython.md) | Unescape a string encoded in Python style |

### Hash

| Class | Description |
| ------ | ------ |
| [Crc32](Encoding/Crc32.md) | Compute the CRC32 checksum of a binary object |
| [HashBase](Encoding/HashBase.md) | Abstract base class for hash algorithm implementations. |
| [Sha1](Encoding/Sha1.md) | Secure Hash Algorithm, SHA-1 |
| [Sha224](Encoding/Sha224.md) | Secure Hash Algorithm, SHA2 SHA-224 |
| [Sha256](Encoding/Sha256.md) | Secure Hash Algorithm, SHA2 SHA-256 |
| [Sha384](Encoding/Sha384.md) | Secure Hash Algorithm, SHA2 SHA-384 |
| [Sha512](Encoding/Sha512.md) | Secure Hash Algorithm, SHA2 SHA-512 |
| [ShaBase](Encoding/ShaBase.md) | The base class for sha based cryptographic hash functions |

## English

### Analysis

| Name | Description |
| ------ | ------ |
| [SplitWordsOptions](English/SplitWordsOptions.md) | Options for the [splitWords](English/splitWords.md) function |
| [readability](English/readability.md) | Calculates the Flesch-Kincaid readability score for a given text. |
| [splitSentences](English/splitSentences.md) | Splits the input string into an array of sentences. |
| [splitWords](English/splitWords.md) | Split a string into an array of words |
| [syllables](English/syllables.md) | Approximate the number of syllables in a string |

### Parts of Speech

| Name | Description |
| ------ | ------ |
| [ConjoinOptions](English/ConjoinOptions.md) | Options for creating a coordinated list with [conjoin](English/conjoin.md) |
| [IndefiniteArticleOptions](English/IndefiniteArticleOptions.md) | Options for [indefiniteArticle](English/indefiniteArticle.md) to determine the indefinite article to use with a word. |
| [conjoin](English/conjoin.md) | Create a list from an array, separating values and inserting a conjunction |
| [indefiniteArticle](English/indefiniteArticle.md) | Determine the appropriate indefinite article to use with a word. |
| [plural](English/plural.md) | Return the plural version of the input string |
| [possessive](English/possessive.md) | Determine the possessive form of a word |

## Geometry

### Angle

| Name | Description |
| ------ | ------ |
| [AngleUnit](Geometry/AngleUnit.md) | Types of angle units |
| [OriginOptions](Geometry/OriginOptions.md) | Options for origin-related functions |
| [UnitOptions](Geometry/UnitOptions.md) | Options for angle-related functions |
| [angleUnits](Geometry/angleUnits.md) | Number of units in a circle |
| [angleBetweenPoints](Geometry/angleBetweenPoints.md) | Computes the angle between two points (x1,y1) and (x2,y2). Angle zero points in the +X direction, π/2 radians points in the +Y direction (down) and from there we grow clockwise towards π*2 radians. |
| [angleDifference](Geometry/angleDifference.md) | Computes the difference between startAngle and endAngle. |
| [angleOfLine](Geometry/angleOfLine.md) | Calculates the angle of a given line segment, relative to the horizontal axis |
| [angleReflection](Geometry/angleReflection.md) | Calculates the reflection of an angle across a specified axis. |
| [normalizeAngle](Geometry/normalizeAngle.md) | Normalizes an angle to be in range 0-1 turns. |
| [toAngle](Geometry/toAngle.md) | Converts an angle from one unit to another. |
| [toDegrees](Geometry/toDegrees.md) | Convert an angle from radians to degrees |
| [toRadians](Geometry/toRadians.md) | Converts degrees to radians. |

### Coordinates

| Name | Description |
| ------ | ------ |
| [Cartesian](Geometry/Cartesian.md) | Represents a point in 2D Cartesian coordinate space. |
| [Polar](Geometry/Polar.md) | Polar coordinate (angle, radius) |
| [XY](Geometry/XY.md) | Represents a two-dimensional amount `x` and `y` aspects. |
| [Origin](Geometry/Origin.md) | The origin of cartesian coordinates (0, 0) |
| [isCartesian](Geometry/isCartesian.md) | Determines if the provided value is a Cartesian point. |
| [isPolar](Geometry/isPolar.md) | Determines if the provided value is a Polar point. |
| [toCartesian](Geometry/toCartesian.md) | Convert polar coordinates to cartesian |
| [toPolar](Geometry/toPolar.md) | Convert cartesian coordinates to polar |

### Line Segment

| Name | Description |
| ------ | ------ |
| [LineSegment](Geometry/LineSegment.md) | Represents a line segment in 2D space, defined by its start and end points. |
| [OnLineOptions](Geometry/OnLineOptions.md) | Options for the [isOnLine](Geometry/isOnLine.md) function |
| [angleOfLine](Geometry/angleOfLine.md) | Calculates the angle of a given line segment, relative to the horizontal axis |
| [isIntersecting](Geometry/isIntersecting.md) | Determines whether a given shape (either a LineSegment or a Polygon) intersects with a polygon. |
| [isLeftOfLine](Geometry/isLeftOfLine.md) | Determines whether a given point lies to the left of a specified line segment. |
| [isOnLine](Geometry/isOnLine.md) | Determines whether a given point lies on a specified line segment or its extension. |
| [isRightOfLine](Geometry/isRightOfLine.md) | Determines whether a given point lies to the right of a specified line segment. |
| [lineIntersection](Geometry/lineIntersection.md) | Calculates the intersection point of two line segments. |
| [lineLength](Geometry/lineLength.md) | Calculates the length of a line segment. |
| [midpoint](Geometry/midpoint.md) | Calculates a point at a given fraction (`part`) along a line segment. By default it returns the true midpoint of the line segment |
| [normalizeLineSegment](Geometry/normalizeLineSegment.md) | Returns a [LineSegment](Geometry/LineSegment.md) where the point with the higher y-coordinate is always the starting point (x0, y0). If the original line's y1 is greater than y0, the line is returned as-is. Otherwise, the start and end points are swapped. |
| [polygonSides](Geometry/polygonSides.md) | Generate line segments for each side of the polygon. |
| [toLineSegment](Geometry/toLineSegment.md) | Converts two Cartesian points into a `LineSegment` object. |

### Point

| Function | Description |
| ------ | ------ |
| [isInPolygon](Geometry/isInPolygon.md) | Determines whether a given point or rectangle is inside or on the edge of a polygon. |
| [isLeftOfLine](Geometry/isLeftOfLine.md) | Determines whether a given point lies to the left of a specified line segment. |
| [isOnLine](Geometry/isOnLine.md) | Determines whether a given point lies on a specified line segment or its extension. |
| [isOnPolygon](Geometry/isOnPolygon.md) | Determines whether a given point lies exactly on the boundary of a polygon. |
| [isRightOfLine](Geometry/isRightOfLine.md) | Determines whether a given point lies to the right of a specified line segment. |
| [manhattanDistance](Geometry/manhattanDistance.md) | Calculates the Manhattan Distance between two points in Cartesian coordinates. |
| [rotate](Geometry/rotate.md) | Rotates a point or a polygon around a given origin by a specified angle. |
| [scale](Geometry/scale.md) | Scales a point or a polygon of points around a given origin by a specified amount. |
| [translate](Geometry/translate.md) | Translate a point or polygon by a specified amount. |

### Polygon

| Name | Description |
| ------ | ------ |
| [Polygon](Geometry/Polygon.md) | A polygon (a set of cartesian coordinates) |
| [area](Geometry/area.md) | Calculates the area of a polygon given its vertices. |
| [bounds](Geometry/bounds.md) | Calculates the axis-aligned bounding rectangle for a given polygon. |
| [centroid](Geometry/centroid.md) | Calculates the centroid (geometric center) of a polygon. |
| [convexHull](Geometry/convexHull.md) | Computes the convex hull of a set of 2D points using the Monotone Chain algorithm. |
| [edgeAngles](Geometry/edgeAngles.md) | Generate normalized edge angles from polygon edges. |
| [isClosed](Geometry/isClosed.md) | Determines whether a given polygon is closed. |
| [isInPolygon](Geometry/isInPolygon.md) | Determines whether a given point or rectangle is inside or on the edge of a polygon. |
| [isIntersecting](Geometry/isIntersecting.md) | Determines whether a given shape (either a LineSegment or a Polygon) intersects with a polygon. |
| [isOnPolygon](Geometry/isOnPolygon.md) | Determines whether a given point lies exactly on the boundary of a polygon. |
| [isPolygon](Geometry/isPolygon.md) | Determines if the provided object is a `Polygon`. |
| [largestInscribedRectangle](Geometry/largestInscribedRectangle.md) | Computes the largest rectangle that can be inscribed within the given polygon. |
| [perimeter](Geometry/perimeter.md) | Calculates the perimeter of a polygon. |
| [polygonSides](Geometry/polygonSides.md) | Generate line segments for each side of the polygon. |
| [regularPolygon](Geometry/regularPolygon.md) | Generates a regular polygon. |
| [rotate](Geometry/rotate.md) | Rotates a point or a polygon around a given origin by a specified angle. |
| [scale](Geometry/scale.md) | Scales a point or a polygon of points around a given origin by a specified amount. |
| [star](Geometry/star.md) | Generates a star-shaped polygon. |
| [toClosed](Geometry/toClosed.md) | Ensures that a given polygon is closed by checking if the first and last points are the same. If the polygon is not closed, it appends the first point to the end of the array. |
| [toPolygon](Geometry/toPolygon.md) | Converts two [Cartesian](Geometry/Cartesian.md) points or a [Rect](Geometry/Rect.md) into a [Polygon](Geometry/Polygon.md). |
| [translate](Geometry/translate.md) | Translate a point or polygon by a specified amount. |

### Rectangle

| Name | Description |
| ------ | ------ |
| [LargestInscribedRectUnitOptions](Geometry/LargestInscribedRectUnitOptions.md) | Configuration options for the largest inscribed rectangle algorithm. |
| [Rect](Geometry/Rect.md) | A rectangle (defined by its top-left corner, width and height) |
| [RotatedRect](Geometry/RotatedRect.md) | Represents a rectangle that has been rotated by a certain angle. Extends the `Rect` type with additional properties for the area and rotation angle. const hull = convexHull(points); |
| [isInPolygon](Geometry/isInPolygon.md) | Determines whether a given point or rectangle is inside or on the edge of a polygon. |
| [isRect](Geometry/isRect.md) | Determines if the provided value is a [Rect](Geometry/Rect.md)e. |
| [largestInscribedRectangle](Geometry/largestInscribedRectangle.md) | Computes the largest rectangle that can be inscribed within the given polygon. |
| [toSquare](Geometry/toSquare.md) | Converts a [Rect](Geometry/Rect.md) to the largest possible square that fits within it, centered along the longer dimension. If the rectangle is already a square, it returns the original rectangle. |

## JSON

### Data Structures

| Class | Description |
| ------ | ------ |
| [JSONMap](JSON/JSONMap.md) | A [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) that allows serializable objects keys. |
| [JSONSet](JSON/JSONSet.md) | A Set-like collection for objects that can be serialized to JSON. |

### Serialization

| Name | Description |
| ------ | ------ |
| [TBJsonArray](JSON/TBJsonArray.md) | Matches a JSON array. |
| [TBJsonObject](JSON/TBJsonObject.md) | Matches a JSON object. |
| [TBJsonPrimitive](JSON/TBJsonPrimitive.md) | Matches any valid JSON primitive value. |
| [TBJsonValue](JSON/TBJsonValue.md) | Matches any valid JSON value. |
| [specialBegin](JSON/specialBegin.md) | The beginning of a special JSON value |
| [specialFinish](JSON/specialFinish.md) | The end of a special JSON value |
| [replacer](JSON/replacer.md) | Used with JSON.stringify to encode a wider range of objects into strings that can later be decoded with [reviver](JSON/reviver.md) |
| [reviver](JSON/reviver.md) | Used with JSON.parse to decode objected encoded by [replacer](JSON/replacer.md) |

## Math

### Comparison

| Name | Description |
| ------ | ------ |
| [ApproximatelyEqualsOptions](Math/ApproximatelyEqualsOptions.md) | Options for the [approximatelyEquals](Math/approximatelyEquals.md) function |
| [approximatelyEquals](Math/approximatelyEquals.md) | Tests whether the two values are equal to each other, within a certain tolerance, taking into account floating point errors (numbers within EPSILON). |
| [compareNumbers](Math/compareNumbers.md) | Compare two numbers |
| [isEven](Math/isEven.md) | Tests to see if the specified value is an even integer |
| [isMultipleOf](Math/isMultipleOf.md) | Tests to see if the specified value is an multiple of *multiplier* |
| [isNegativeZero](Math/isNegativeZero.md) | Tests to see if the specified value is negative zero |
| [isOdd](Math/isOdd.md) | Tests to see if the specified value is an odd integer |

### Constants

| Variable | Description |
| ------ | ------ |
| [cardinalOnes](Math/cardinalOnes.md) | Words for unit numbers 0-19 |
| [cardinalTens](Math/cardinalTens.md) | Words for tens 20-90 |
| [negativeZero](Math/negativeZero.md) | Negative Zero |
| [ordinalOnes](Math/ordinalOnes.md) | Words for ordinal numbers 0-19 |
| [ordinalTens](Math/ordinalTens.md) | Words for ordinal tens 20-90 |

### Number

| Name | Description |
| ------ | ------ |
| [DeconstructedNumber](Math/DeconstructedNumber.md) | Represents a number that has been deconstructed into its mathematical components. |
| [constructNumber](Math/constructNumber.md) | Reconstructs a number from its deconstructed representation. |
| [deconstructNumber](Math/deconstructNumber.md) | Deconstructs a number into its sign, value, mantissa, and exponent, and separates its whole and fractional parts. |

### Operations

| Name | Description |
| ------ | ------ |
| [CeilOptions](Math/CeilOptions.md) | Options for the [ceil](Math/ceil.md) function |
| [FloorOptions](Math/FloorOptions.md) | Options for the [floor](Math/floor.md) function |
| [RoundOptions](Math/RoundOptions.md) | Options for the [round](Math/round.md) function |
| [ceil](Math/ceil.md) | Returns the smallest integer greater than or equal to the given number, with optional tolerance and precision adjustments. |
| [clamp](Math/clamp.md) | Clamps a number within the inclusive range specified by `min` and `max`. |
| [crossProduct](Math/crossProduct.md) | Calculates the cross product of vectors OA and OB, where O, A, and B are points in 2D Cartesian space. The result is positive if the sequence OAB makes a counter-clockwise turn, negative for a clockwise turn, and zero if the points are collinear. |
| [floor](Math/floor.md) | Returns the largest integer less than or equal to the given number, with optional tolerance and precision adjustments. |
| [lerp](Math/lerp.md) | Performs linear interpolation between values a and b. Returns the value between a and b proportional to x (when x is between 0 and 1. When x is outside this range, the return value is a linear extrapolation). |
| [modulo](Math/modulo.md) | The % operator in JavaScript returns the remainder of a / b, but differs from some other languages in that the result will have the same sign as the dividend. For example, -1 % 8 == -1, whereas in some other languages (such as Python) the result would be 7. This function emulates the more correct modulo behavior, which is useful for certain applications such as calculating an offset index in a circular list. |
| [round](Math/round.md) | Returns the nearest integer to the given number, with optional precision adjustments. |

### Roman Numerals

| Name | Description |
| ------ | ------ |
| [RomanOptions](Math/RomanOptions.md) | Options for converting numbers to Roman numerals. |
| [deromanize](Math/deromanize.md) | Parse a roman numeral string into its integer value. |
| [romanize](Math/romanize.md) | Convert a number into a roman numeral string |

### Statistics

| Function | Description |
| ------ | ------ |
| [mean](Math/mean.md) | Calculates the Operations mean (average) of an array of numbers. |
| [median](Math/median.md) | Calculates the median value of an array of numbers. |
| [mode](Math/mode.md) | Returns the mode (the most frequently occurring element) of the given array. If multiple elements have the same highest frequency, the first encountered is returned. Returns `undefined` if the array is empty. |
| [standardDeviation](Math/standardDeviation.md) | Returns the sample [Standard Deviation](https://en.wikipedia.org/wiki/Standard_deviation) of the arguments. |
| [sum](Math/sum.md) | Calculates the sum of an array of numbers. |
| [variance](Math/variance.md) | Returns the unbiased sample [Variance](https://en.wikipedia.org/wiki/Variance) of the arguments. |

### Verbalization

| Name | Description |
| ------ | ------ |
| [BinaryUnitsOptions](Math/BinaryUnitsOptions.md) | Options for the [binaryUnits](Math/binaryUnits.md) function |
| [CardinalOptions](Math/CardinalOptions.md) | Configuration options for cardinal number conversion. |
| [FractionOptions](Math/FractionOptions.md) | Options for customizing the output and behavior of fraction number representations. |
| [MetricUnitsOptions](Math/MetricUnitsOptions.md) | Options for the [metricUnits](Math/metricUnits.md) function w |
| [Numbering](Math/Numbering.md) | Options for controlling how numbers are converted to words or symbols. |
| [OrdinalOptions](Math/OrdinalOptions.md) | Options for formatting ordinal numbers. |
| [binaryUnits](Math/binaryUnits.md) | Abbreviate a binary number by adding a suffix for metric units (i.e. 1024 =\> 1KiB) |
| [cardinal](Math/cardinal.md) | Convert a number into text (the cardinal number) |
| [formatNumber](Math/formatNumber.md) | Formats a number according to the specified mask. |
| [fraction](Math/fraction.md) | Converts a numeric input into a formatted fraction string, either in numeric or alphabetic form. |
| [metricUnits](Math/metricUnits.md) | Abbreviate a number by adding a suffix for metric units (i.e. 1000 =\> 1K, .0001 = 1m) |
| [orderOfMagnitude](Math/orderOfMagnitude.md) | Get the spelled out word for an exponent |
| [ordinal](Math/ordinal.md) | Convert a number into an ordinal number string (1st, 2nd, 3rd, etc). |
| [pad](Math/pad.md) | Add leading zeros to a number to ensure a string of a minimum length |
| [summarize](Math/summarize.md) | Get a short description of a number |

## Object

### Comparison

| Function | Description |
| ------ | ------ |
| [compare](Object/compare.md) | Compare two objects |
| [shallowEquals](Object/shallowEquals.md) | Compare two object for equality. Testing goes one level deep. |

### Conversion

| Function | Description |
| ------ | ------ |
| [toError](Object/toError.md) | Convert the entity to an Error object. |
| [toInteger](Object/toInteger.md) | Convert an entity to a integer number. |
| [toNumber](Object/toNumber.md) | Convert an entity to a number. |
| [toPrimitive](Object/toPrimitive.md) | Convert an object into its primitive (string, number, etc.) value |

### Operations

| Function | Description |
| ------ | ------ |
| [clear](Object/clear.md) | Delete all own enumerable string properties from an object |
| [sortKeys](Object/sortKeys.md) | Recursively sorts the keys of an object in lexicographical order. |

### Type Guards

| Function | Description |
| ------ | ------ |
| [isArrayLike](Object/isArrayLike.md) | Determines whether the provided value is array-like. |
| [isBoolean](Object/isBoolean.md) | Determines whether the provided value is a boolean or a Boolean object. |
| [isFunction](Object/isFunction.md) | Determines whether the provided value is a function. |
| [isIterable](Object/isIterable.md) | Determines if the provided object is iterable. |
| [isIterator](Object/isIterator.md) | Determines whether the provided object conforms to the Iterator interface. |
| [isNumber](Object/isNumber.md) | Determines whether the provided value is a number or a Number object. |
| [isObject](Object/isObject.md) | Determines whether the provided value is a non-null object. |
| [isPrimitive](Object/isPrimitive.md) | Check to see if an object is a primitive |
| [isRegExp](Object/isRegExp.md) | Determines whether the provided value is a `RegExp` object. |
| [isString](Object/isString.md) | Determines whether the provided value is a string. |

## Programming

### GraphQl

| Name | Description |
| ------ | ------ |
| [GraphQLArray](Programming/GraphQLArray.md) | A GraphQL Array, similar to a JSONArray |
| [GraphQLObject](Programming/GraphQLObject.md) | A GraphQL Object, similar to a JSONObject |
| [GraphQLValue](Programming/GraphQLValue.md) | A GraphQL Value, similar to a JSONValue |
| [graphQL](Programming/graphQL.md) | Tagged template function for constructing GraphQL queries or mutations. |

### Variables

| Function | Description |
| ------ | ------ |
| [camelCase](Programming/camelCase.md) | Convert an identifier string to a camel case |
| [dotCase](Programming/dotCase.md) | Convert an identifier string to a dot form |
| [humanCase](Programming/humanCase.md) | Convert an identifier string to a human case |
| [kebabCase](Programming/kebabCase.md) | Convert an identifier string to a kebab-case form |
| [macroCase](Programming/macroCase.md) | Convert an identifier string to macro case |
| [pascalCase](Programming/pascalCase.md) | Convert an identifier string to pascal case |
| [snakeCase](Programming/snakeCase.md) | Convert an identifier string to snake case |
| [tokenize](Programming/tokenize.md) | Splits the input string into an array of words. |

## Random

### Number Generation

| Class | Description |
| ------ | ------ |
| [MersenneTwister](Random/MersenneTwister.md) | Implements the Mersenne Twister pseudorandom number generator (MT19937). |

### Pick

| Name | Description |
| ------ | ------ |
| [Weighted](Random/Weighted.md) | Represents an object with an associated weight value. |
| [randomDraw](Random/randomDraw.md) | Draw a random item from a list. Returning both the item and the list without the drawn item. |
| [randomPick](Random/randomPick.md) | Pick a random items from a list. |
| [randomWeightedPick](Random/randomWeightedPick.md) | Selects a random item from a list, where each item has an associated weight that determines its likelihood of being picked. |

### Shuffle

| Function | Description |
| ------ | ------ |
| [randomShuffle](Random/randomShuffle.md) | Returns a new array with the elements of the input array shuffled in random order. |

## RegExp

### Construction

| Function | Description |
| ------ | ------ |
| [re](RegExp/re.md) | Constructs a new `RegExp` by interpolating template strings and provided regular expressions. |

### Operations

| Function | Description |
| ------ | ------ |
| [matches](RegExp/matches.md) | Determines if the given `text` matches the provided `match` criteria. |

### Validation

| Variable | Description |
| ------ | ------ |
| [domain](RegExp/domain.md) | Regular expression for matching a domain name composed of a host and a top-level domain (TLD). |
| [email](RegExp/email.md) | validate an valid email address |
| [ipV4](RegExp/ipV4.md) | validate an IPv4 address |
| [ipV4Local](RegExp/ipV4Local.md) | determine if Ipv4 address is local |
| [isoDate](RegExp/isoDate.md) | Validate a ISO formatted date |
| [numeric](RegExp/numeric.md) | Validate a valid number |

## String

### Affix

| Name | Description |
| ------ | ------ |
| [RootOptions](String/RootOptions.md) | Options for the [root](String/root.md) function |
| [ensurePrefix](String/ensurePrefix.md) | Add a prefix to a string, if it does not already have the prefix |
| [ensureSuffix](String/ensureSuffix.md) | Add a suffix to a string, if it does not already have the suffix |
| [root](String/root.md) | Extract the root word, removing a prefix and/or suffix |

### Build

| Function | Description |
| ------ | ------ |
| [build](String/build.md) | Concatenates strings and/or arrays of strings |

### Case Conversion

| Function | Description |
| ------ | ------ |
| [capitalize](String/capitalize.md) | Capitalize the first word in a sentence, or capitalize a single word. |
| [matchCase](String/matchCase.md) | Attempt to convert the input string into the same case as the target string |
| [startCase](String/startCase.md) | Converts a given string to start case, capitalizing the first letter of each word and converting the rest to lowercase. |
| [titleCase](String/titleCase.md) | Convert a string to a title, capitalizing each word, except for the small words |
| [uncapitalize](String/uncapitalize.md) | Capitalize the first word in a sentence, or capitalize a single word. |

### Categorization

| Function | Description |
| ------ | ------ |
| [isAlpha](String/isAlpha.md) | Test a string for all alphabetic characters |
| [isAlphaNumeric](String/isAlphaNumeric.md) | Test a string for all alphanumeric characters |
| [isLowerCase](String/isLowerCase.md) | Test a string for all lower case characters |
| [isNumeric](String/isNumeric.md) | Test an object to see if it a number, or a string which can be converted into a number |
| [isPunctuation](String/isPunctuation.md) | Test a string for all punctuation characters |
| [isUpperCase](String/isUpperCase.md) | Test a string for all upper case characters |
| [isWhitespace](String/isWhitespace.md) | Test a string for all white space characters |

### Chop

| Name | Description |
| ------ | ------ |
| [ChopOptions](String/ChopOptions.md) | Options for the [chop](String/chop.md) function |
| [chop](String/chop.md) | Break a string into equal sized segments of characters |

### Clean

| Function | Description |
| ------ | ------ |
| [clean](String/clean.md) | Remove all occurrences of characters from the beginning and end of the string |
| [cleanEnd](String/cleanEnd.md) | Remove all occurrences of characters from the end of the string |
| [cleanStart](String/cleanStart.md) | Remove all occurrences of characters from the start of the string |

### Collapse

| Name | Description |
| ------ | ------ |
| [CollapseBreakingSpaceOptions](String/CollapseBreakingSpaceOptions.md) | Options for the [collapseBreakingSpace](String/collapseBreakingSpace.md) function |
| [CollapseWhitespaceOptions](String/CollapseWhitespaceOptions.md) | Options for the [collapseWhitespace](String/collapseWhitespace.md) function |
| [collapseBreakingSpace](String/collapseBreakingSpace.md) | Replace all breaking space (space, tab, carriage return, new line) with a single space |
| [collapseWhitespace](String/collapseWhitespace.md) | Replace all whitespace within a string with a single space |

### Comparison

| Name | Description |
| ------ | ------ |
| [CompareStringsOptions](String/CompareStringsOptions.md) | Options for the [compareStrings](String/compareStrings.md) function |
| [compareStrings](String/compareStrings.md) | Compare two strings |

### Constants

| Variable | Description |
| ------ | ------ |
| [trimEquivalent](String/trimEquivalent.md) | Regular expression that matches any whitespace character, including standard spaces, non-breaking spaces (`\u00A0`), and zero-width no-break spaces (`\uFEFF`). Useful for trimming or identifying whitespace-equivalent characters in strings. |

### Conversion

| Name | Description |
| ------ | ------ |
| [BooleanOptions](String/BooleanOptions.md) | Options for the [toBoolean](String/toBoolean.md) function |
| [FilenameOptions](String/FilenameOptions.md) | Options for the [toFilename](String/toFilename.md) function |
| [toBoolean](String/toBoolean.md) | Convert a string to a boolean value |
| [toEnumeration](String/toEnumeration.md) | Convert a string to a numeric value |
| [toFilename](String/toFilename.md) | Convert a string so that it can be used as a filename |
| [toString](String/toString.md) | Converts an unknown value to its string representation. |

### Correction

| Function | Description |
| ------ | ------ |
| [correctMSWord](String/correctMSWord.md) | Correct character sequences that Microsoft Word changes to make it look prettier |

### Delimited

| Name | Description |
| ------ | ------ |
| [CountOptions](String/CountOptions.md) | Options for the [count](String/count.md) function |
| [count](String/count.md) | Compute the number of times a substring occurs within a string |
| [delimited](String/delimited.md) | Return a field from a delimited string |

### Extraction

| Function | Description |
| ------ | ------ |
| [extractDigits](String/extractDigits.md) | Remove all non-digit characters from a string |
| [toASCII](String/toASCII.md) | Change a string to be all from the basic latin unicode plane |

### Fuzzy Match

| Name | Description |
| ------ | ------ |
| [DiceCoefficientOptions](String/DiceCoefficientOptions.md) | Options for the [diceCoefficient](String/diceCoefficient.md) function |
| [FuzzyMatchOptions](String/FuzzyMatchOptions.md) | Options for the [fuzzyMatch](String/fuzzyMatch.md) function |
| [LevenshteinDistanceOptions](String/LevenshteinDistanceOptions.md) | Options for the [levenshteinDistance](String/levenshteinDistance.md) function |
| [LongestCommonSubstringOptions](String/LongestCommonSubstringOptions.md) | Options for configuring the longest common substring calculation. |
| [diceCoefficient](String/diceCoefficient.md) | Compute the dice coefficient measure of similarity between two strings |
| [fuzzyMatch](String/fuzzyMatch.md) | Computes a fuzzy similarity score between two strings using a weighted combination of Levenshtein distance, Dice coefficient, and longest common substring metrics. |
| [levenshteinDistance](String/levenshteinDistance.md) | Compute the levenshtein distance between two strings (similarity) |
| [longestCommonSubstring](String/longestCommonSubstring.md) | Implementation of [Longest Common Substring](https://en.wikipedia.org/wiki/Longest_common_substring_problem) algorithm. |

### HTML

| Function | Description |
| ------ | ------ |
| [tag](String/tag.md) | Surround text with an HTML tag |

### Indentation

| Name | Description |
| ------ | ------ |
| [IndentOptions](String/IndentOptions.md) | Options for the indentation functions: [getIndent](String/getIndent.md), [indent](String/indent.md), and [unindent](String/unindent.md) |
| [getIndent](String/getIndent.md) | Determine the indentation level of text |
| [indent](String/indent.md) | Indent each line of a string |
| [unindent](String/unindent.md) | Remove indentation from text |

### Mask

| Name | Description |
| ------ | ------ |
| [MaskOptions](String/MaskOptions.md) | Options for the [mask](String/mask.md) function |
| [mask](String/mask.md) | Use a simple mask to display a string |

### Operations

| Function | Description |
| ------ | ------ |
| [singleLine](String/singleLine.md) | Joins a template literal into a single line string by removing line breaks and leading whitespace, then interleaving the provided arguments. The result is a trimmed, single-line string. |

### Quoting

| Name | Description |
| ------ | ------ |
| [QuoteOptions](String/QuoteOptions.md) | Options for the [quote](String/quote.md) and [unquote](String/unquote.md) function |
| [quote](String/quote.md) | Surround text with quotes |
| [unquote](String/unquote.md) | Remove surrounding quotes from text |

### Sorting

| Name | Description |
| ------ | ------ |
| [NumberToLetterOptions](String/NumberToLetterOptions.md) | Options for the [numberToLetter](String/numberToLetter.md) function |
| [SortOrderOptions](String/SortOrderOptions.md) | Options for the [sortOrder](String/sortOrder.md) function |
| [groupCode](String/groupCode.md) | Determine the group code (A-Z, [] or #) to place an item under |
| [numberToLetter](String/numberToLetter.md) | Convert a number to a letter, using the alphabet (default: A-Z) |
| [sortOrder](String/sortOrder.md) | Convert a string into a sortable string |

### Split

| Function | Description |
| ------ | ------ |
| [splitChars](String/splitChars.md) | Split a string into an array of characters |
| [splitLines](String/splitLines.md) | Split a string into an array of lines |

### Templates

| Name | Description |
| ------ | ------ |
| [FillTemplateOptions](String/FillTemplateOptions.md) | Options for the [fillTemplate](String/fillTemplate.md) function |
| [fillTemplate](String/fillTemplate.md) | Fill a template with supplied values |

### Word Wrapping

| Name | Description |
| ------ | ------ |
| [WordwrapOptions](String/WordwrapOptions.md) | Options for the [wordwrap](String/wordwrap.md) function |
| [wordwrap](String/wordwrap.md) | Wrap text so that it fits within a area of fixed width |

## Time

### Alteration

| Name | Description |
| ------ | ------ |
| [TimeIncrement](Time/TimeIncrement.md) | Represents amount of time to use for [addTime](Time/addTime.md) |
| [addTime](Time/addTime.md) | Add units of time to a Date |

### Constants

| Variable | Description |
| ------ | ------ |
| [daysPerWeek](Time/daysPerWeek.md) | Number of days in a week [7] |
| [hoursPerDay](Time/hoursPerDay.md) | Number of hours in a day [24] |
| [hoursPerWeek](Time/hoursPerWeek.md) | Number of hours in a week [168] |
| [minutesPerDay](Time/minutesPerDay.md) | Number of minutes in a day [1440] |
| [minutesPerHour](Time/minutesPerHour.md) | Number of minutes in an hour [60] |
| [minutesPerWeek](Time/minutesPerWeek.md) | Number of minutes in a week [10080] |
| [secondsPerDay](Time/secondsPerDay.md) | Number of seconds in a day [86400] |
| [secondsPerHour](Time/secondsPerHour.md) | Number of seconds in an hour [3600] |
| [secondsPerMinute](Time/secondsPerMinute.md) | Number of seconds in a minute [60] |
| [secondsPerWeek](Time/secondsPerWeek.md) | Number of seconds in a week [604800] |
| [ticksPerDay](Time/ticksPerDay.md) | Number of ticks in a day [86400000] |
| [ticksPerHour](Time/ticksPerHour.md) | Number of ticks in an hour [3600000] |
| [ticksPerMinute](Time/ticksPerMinute.md) | Number of ticks in a minute [60000] |
| [ticksPerSecond](Time/ticksPerSecond.md) | Number of ticks in a second [1000] |
| [ticksPerWeek](Time/ticksPerWeek.md) | Number of ticks in a week [604800000] |

### Conversion

| Function | Description |
| ------ | ------ |
| [toDate](Time/toDate.md) | Converts an unknown entity to a `Date` object. |

### Day

| Name | Description |
| ------ | ------ |
| [BeginningOfDayOptions](Time/BeginningOfDayOptions.md) | Options for [beginningOfDay](Time/beginningOfDay.md) |
| [GetOccurrenceInMonthOptions](Time/GetOccurrenceInMonthOptions.md) | Options for [occurrenceInMonth](Time/occurrenceInMonth.md) |
| [MidnightOptions](Time/MidnightOptions.md) | Options for the [isMidnight](Time/isMidnight.md) function |
| [SameDayOptions](Time/SameDayOptions.md) | Options for the [isSameDay](Time/isSameDay.md) function |
| [beginningOfDay](Time/beginningOfDay.md) | Determine the start of the day for a date |
| [isMidnight](Time/isMidnight.md) | Determine if a date is at midnight |
| [isSameDay](Time/isSameDay.md) | Determine if two dates occur on the same day |
| [occurrenceInMonth](Time/occurrenceInMonth.md) | Determine the date of an occurrence of a weekday within a month |

### Enumerations

| Name | Description |
| ------ | ------ |
| [DayOfWeek](Time/DayOfWeek.md) | Days of the week |
| [MonthOfYear](Time/MonthOfYear.md) | Months of the year |
| [day](Time/day.md) | Translation object for name of day to day number. |
| [month](Time/month.md) | Translation object for name of month to month number |

### Formatting

| Name | Description |
| ------ | ------ |
| [FormatDateOptions](Time/FormatDateOptions.md) | Options for formatting a date |
| [formatDate](Time/formatDate.md) | Format a date |

### Julian

| Function | Description |
| ------ | ------ |
| [julian](Time/julian.md) | Get the Julian date (number of days since noon on Monday, January 1 4713 BCE) |

### Month

| Name | Description |
| ------ | ------ |
| [BeginningOfMonthOptions](Time/BeginningOfMonthOptions.md) | Options for the [beginningOfMonth](Time/beginningOfMonth.md) function |
| [DaysInMonthOptions](Time/DaysInMonthOptions.md) | Options for the [daysInMonth](Time/daysInMonth.md) function |
| [EndOfMonthOptions](Time/EndOfMonthOptions.md) | Options for the [endOfMonth](Time/endOfMonth.md) function |
| [SameMonthOptions](Time/SameMonthOptions.md) | Options for the [isSameMonth](Time/isSameMonth.md) function |
| [beginningOfMonth](Time/beginningOfMonth.md) | Determine the start of the month for a dateDetermine the start of the month for a date |
| [daysInMonth](Time/daysInMonth.md) | Determine the number of days in the month for a date |
| [endOfMonth](Time/endOfMonth.md) | Determine the last day of the month containing the input date |
| [isSameMonth](Time/isSameMonth.md) | Determine if two dates occur in the same month |

### Parsing

| Function | Description |
| ------ | ------ |
| [isValidDate](Time/isValidDate.md) | Determine if a date is valid |
| [parseDate](Time/parseDate.md) | Parse a string into a Date object |

### Relative Time

| Name | Description |
| ------ | ------ |
| [RelativeTimeOptions](Time/RelativeTimeOptions.md) | Options for the [relativeTime](Time/relativeTime.md) function |
| [relativeTime](Time/relativeTime.md) | Describe the difference between two dates in a simple format |

### Time Span

| Class | Description |
| ------ | ------ |
| [TimeSpan](Time/TimeSpan.md) | Store and manipulate a duration of time |

### Time Zone

| Name | Description |
| ------ | ------ |
| [TimezoneOptions](Time/TimezoneOptions.md) | Options for the [timezone](Time/timezone.md) function |
| [timezone](Time/timezone.md) | Determine the correct timezone string for a specified date using a local timezone, or an offset in minutes |

### Type Check

| Function | Description |
| ------ | ------ |
| [isDate](Time/isDate.md) | Determines whether the provided value is a `Date` object. |

### Week

| Name | Description |
| ------ | ------ |
| [BeginningOfWeekOptions](Time/BeginningOfWeekOptions.md) | Options for the [beginningOfWeek](Time/beginningOfWeek.md) function |
| [DayOfWeekOptions](Time/DayOfWeekOptions.md) | Options for the [dayOfWeek](Time/dayOfWeek-1.md) function |
| [EndOfWeekOptions](Time/EndOfWeekOptions.md) | Options for the [endOfWeek](Time/endOfWeek.md) function |
| [ISOWeekOfYearOptions](Time/ISOWeekOfYearOptions.md) | Options for the [isoWeekOfYear](Time/isoWeekOfYear.md) function |
| [ISOWeeksInYearOptions](Time/ISOWeeksInYearOptions.md) | Options for the [isoWeeksInYear](Time/isoWeeksInYear.md) function |
| [SameWeekOptions](Time/SameWeekOptions.md) | Options for the [isSameWeek](Time/isSameWeek.md) function |
| [beginningOfWeek](Time/beginningOfWeek.md) | Determine the start of the week for a date |
| [dayOfWeek](Time/dayOfWeek-1.md) | Determine the day of the week for a specific date |
| [endOfWeek](Time/endOfWeek.md) | Determine the last day of the week containing a date |
| [isoWeekOfYear](Time/isoWeekOfYear.md) | Determine the ISO week number for a given date |
| [isoWeeksInYear](Time/isoWeeksInYear.md) | Determine the number of ISO weeks within a year |
| [isSameWeek](Time/isSameWeek.md) | Determine if two dates occur in the same week |

### Year

| Name | Description |
| ------ | ------ |
| [BeginningOfYearOptions](Time/BeginningOfYearOptions.md) | Options for the [beginningOfYear](Time/beginningOfYear.md) function |
| [DayOfYearOptions](Time/DayOfYearOptions.md) | Options for the [dayOfYear](Time/dayOfYear.md) function |
| [EndOfYearOptions](Time/EndOfYearOptions.md) | Options for the [endOfYear](Time/endOfYear.md) function |
| [LeapYearOptions](Time/LeapYearOptions.md) | Options for the [isLeapYear](Time/isLeapYear.md) function |
| [SameYearOptions](Time/SameYearOptions.md) | Options for the [isSameYear](Time/isSameYear.md) function |
| [beginningOfYear](Time/beginningOfYear.md) | Determine the start of the year for a date |
| [dayOfYear](Time/dayOfYear.md) | Calculates the day of the year for a given date. |
| [endOfYear](Time/endOfYear.md) | Determine the last day of the year containing a date |
| [isLeapYear](Time/isLeapYear.md) | Determine if a year is a leap year |
| [isSameYear](Time/isSameYear.md) | Determine if two dates occur in the same year |

## Unicode

### Characters

| Variable | Description |
| ------ | ------ |
| [fractionSlash](Unicode/fractionSlash.md) | Fraction Slash |
| [hyphen](Unicode/hyphen.md) | Hyphen |
| [invisiblePlus](Unicode/invisiblePlus.md) | Invisible Plus sign |
| [negativeSign](Unicode/negativeSign.md) | Negative Sign |
| [nonBreakingHyphen](Unicode/nonBreakingHyphen.md) | Non-Breaking Hyphen |
| [positiveSign](Unicode/positiveSign.md) | Positive Sign |
| [softHyphen](Unicode/softHyphen.md) | Soft Hyphen |
| [subNegative](Unicode/subNegative.md) | Subscript Negative |
| [subPositive](Unicode/subPositive.md) | Subscript Positive |
| [supNegative](Unicode/supNegative.md) | Superscript Negative |
| [supPositive](Unicode/supPositive.md) | Superscript Positive |

### Constants

| Variable | Description |
| ------ | ------ |
| [empty](Unicode/empty.md) | The empty string |
| [nbsp](Unicode/nbsp.md) | Non-breaking space |
| [replacementCharacter](Unicode/replacementCharacter.md) | Unicode replacement character (U+FFFD), used to represent an unknown, unrecognized, or unrepresentable character. |
| [space](Unicode/space.md) | Space |
| [zwsp](Unicode/zwsp.md) | Zero-width space |

### Encoding

| Name | Description |
| ------ | ------ |
| [TextEncoding](Unicode/TextEncoding.md) | Valid Text Encoding Types |
| [decodeText](Unicode/decodeText.md) | Decode a UTF8 encoded string into unicode |
| [encodeText](Unicode/encodeText.md) | Encode a unicode (UTF-16 encoded javascript) string into UTF8 |

### Is Surrogate

| Name | Description |
| ------ | ------ |
| [IsSurrogateOptions](Unicode/IsSurrogateOptions.md) | Options for [isSurrogate](Unicode/isSurrogate.md) |
| [isSurrogate](Unicode/isSurrogate.md) | Determine is a character is a surrogate |

### Normalization

| Function | Description |
| ------ | ------ |
| [removeDiacritics](Unicode/removeDiacritics.md) | Remove all diacritics from a string |

### String Length

| Function | Description |
| ------ | ------ |
| [unicodeLength](Unicode/unicodeLength.md) | Return the number of unicode code points in a string |

## Utility

### Classes

| Class | Description |
| ------ | ------ |
| [PriorityQueue](Utility/PriorityQueue.md) | A simple priority queue |

### Global Types

| Type Alias | Description |
| ------ | ------ |
| [TypedArray](Utility/TypedArray.md) | Any of the built-in typed array types in JavaScript. |

