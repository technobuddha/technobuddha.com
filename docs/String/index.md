<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / String

# String

### Affix

| Name | Description |
| ------ | ------ |
| [RootOptions](RootOptions.md) | Options for the [root](root.md) function |
| [ensurePrefix](ensurePrefix.md) | Add a prefix to a string, if it does not already have the prefix |
| [ensureSuffix](ensureSuffix.md) | Add a suffix to a string, if it does not already have the suffix |
| [root](root.md) | Extract the root word, removing a prefix and/or suffix |

### Build

| Function | Description |
| ------ | ------ |
| [build](build.md) | Concatenates strings and/or arrays of strings |

### Case Conversion

| Function | Description |
| ------ | ------ |
| [capitalize](capitalize.md) | Capitalize the first word in a sentence, or capitalize a single word. |
| [matchCase](matchCase.md) | Attempt to convert the input string into the same case as the target string |
| [startCase](startCase.md) | Converts a given string to start case, capitalizing the first letter of each word and converting the rest to lowercase. |
| [titleCase](titleCase.md) | Convert a string to a title, capitalizing each word, except for the small words |
| [uncapitalize](uncapitalize.md) | Capitalize the first word in a sentence, or capitalize a single word. |

### Categorization

| Function | Description |
| ------ | ------ |
| [isAlpha](isAlpha.md) | Test a string for all alphabetic characters |
| [isAlphaNumeric](isAlphaNumeric.md) | Test a string for all alphanumeric characters |
| [isLowerCase](isLowerCase.md) | Test a string for all lower case characters |
| [isNumeric](isNumeric.md) | Test an object to see if it a number, or a string which can be converted into a number |
| [isPunctuation](isPunctuation.md) | Test a string for all punctuation characters |
| [isUpperCase](isUpperCase.md) | Test a string for all upper case characters |
| [isWhitespace](isWhitespace.md) | Test a string for all white space characters |

### Chop

| Name | Description |
| ------ | ------ |
| [ChopOptions](ChopOptions.md) | Options for the [chop](chop.md) function |
| [chop](chop.md) | Break a string into equal sized segments of characters |

### Clean

| Function | Description |
| ------ | ------ |
| [clean](clean.md) | Remove all occurrences of characters from the beginning and end of the string |
| [cleanEnd](cleanEnd.md) | Remove all occurrences of characters from the end of the string |
| [cleanStart](cleanStart.md) | Remove all occurrences of characters from the start of the string |

### Collapse

| Name | Description |
| ------ | ------ |
| [CollapseBreakingSpaceOptions](CollapseBreakingSpaceOptions.md) | Options for the [collapseBreakingSpace](collapseBreakingSpace.md) function |
| [CollapseWhitespaceOptions](CollapseWhitespaceOptions.md) | Options for the [collapseWhitespace](collapseWhitespace.md) function |
| [collapseBreakingSpace](collapseBreakingSpace.md) | Replace all breaking space (space, tab, carriage return, new line) with a single space |
| [collapseWhitespace](collapseWhitespace.md) | Replace all whitespace within a string with a single space |

### Comparison

| Name | Description |
| ------ | ------ |
| [CompareStringsOptions](CompareStringsOptions.md) | Options for the [compareStrings](compareStrings.md) function |
| [compareStrings](compareStrings.md) | Compare two strings |

### Constants

| Variable | Description |
| ------ | ------ |
| [trimEquivalent](trimEquivalent.md) | Regular expression that matches any whitespace character, including standard spaces, non-breaking spaces (`\u00A0`), and zero-width no-break spaces (`\uFEFF`). Useful for trimming or identifying whitespace-equivalent characters in strings. |

### Conversion

| Name | Description |
| ------ | ------ |
| [BooleanOptions](BooleanOptions.md) | Options for the [toBoolean](toBoolean.md) function |
| [FilenameOptions](FilenameOptions.md) | Options for the [toFilename](toFilename.md) function |
| [toBoolean](toBoolean.md) | Convert a string to a boolean value |
| [toEnumeration](toEnumeration.md) | Convert a string to a numeric value |
| [toFilename](toFilename.md) | Convert a string so that it can be used as a filename |
| [toString](toString.md) | Converts an unknown value to its string representation. |

### Correction

| Function | Description |
| ------ | ------ |
| [correctMSWord](correctMSWord.md) | Correct character sequences that Microsoft Word changes to make it look prettier |

### Delimited

| Name | Description |
| ------ | ------ |
| [CountOptions](CountOptions.md) | Options for the [count](count.md) function |
| [count](count.md) | Compute the number of times a substring occurs within a string |
| [delimited](delimited.md) | Return a field from a delimited string |

### Extraction

| Function | Description |
| ------ | ------ |
| [extractDigits](extractDigits.md) | Remove all non-digit characters from a string |
| [toASCII](toASCII.md) | Change a string to be all from the basic latin unicode plane |

### Fuzzy Match

| Name | Description |
| ------ | ------ |
| [DiceCoefficientOptions](DiceCoefficientOptions.md) | Options for the [diceCoefficient](diceCoefficient.md) function |
| [FuzzyMatchOptions](FuzzyMatchOptions.md) | Options for the [fuzzyMatch](fuzzyMatch.md) function |
| [LevenshteinDistanceOptions](LevenshteinDistanceOptions.md) | Options for the [levenshteinDistance](levenshteinDistance.md) function |
| [LongestCommonSubstringOptions](LongestCommonSubstringOptions.md) | Options for configuring the longest common substring calculation. |
| [diceCoefficient](diceCoefficient.md) | Compute the dice coefficient measure of similarity between two strings |
| [fuzzyMatch](fuzzyMatch.md) | Computes a fuzzy similarity score between two strings using a weighted combination of Levenshtein distance, Dice coefficient, and longest common substring metrics. |
| [levenshteinDistance](levenshteinDistance.md) | Compute the levenshtein distance between two strings (similarity) |
| [longestCommonSubstring](longestCommonSubstring.md) | Implementation of [Longest Common Substring](https://en.wikipedia.org/wiki/Longest_common_substring_problem) algorithm. |

### HTML

| Function | Description |
| ------ | ------ |
| [tag](tag.md) | Surround text with an HTML tag |

### Indentation

| Name | Description |
| ------ | ------ |
| [IndentOptions](IndentOptions.md) | Options for the indentation functions: [getIndent](getIndent.md), [indent](indent.md), and [unindent](unindent.md) |
| [getIndent](getIndent.md) | Determine the indentation level of text |
| [indent](indent.md) | Indent each line of a string |
| [unindent](unindent.md) | Remove indentation from text |

### Mask

| Name | Description |
| ------ | ------ |
| [MaskOptions](MaskOptions.md) | Options for the [mask](mask.md) function |
| [mask](mask.md) | Use a simple mask to display a string |

### Operations

| Function | Description |
| ------ | ------ |
| [singleLine](singleLine.md) | Joins a template literal into a single line string by removing line breaks and leading whitespace, then interleaving the provided arguments. The result is a trimmed, single-line string. |

### Quoting

| Name | Description |
| ------ | ------ |
| [QuoteOptions](QuoteOptions.md) | Options for the [quote](quote.md) and [unquote](unquote.md) function |
| [quote](quote.md) | Surround text with quotes |
| [unquote](unquote.md) | Remove surrounding quotes from text |

### Sorting

| Name | Description |
| ------ | ------ |
| [NumberToLetterOptions](NumberToLetterOptions.md) | Options for the [numberToLetter](numberToLetter.md) function |
| [SortOrderOptions](SortOrderOptions.md) | Options for the [sortOrder](sortOrder.md) function |
| [groupCode](groupCode.md) | Determine the group code (A-Z, [] or #) to place an item under |
| [numberToLetter](numberToLetter.md) | Convert a number to a letter, using the alphabet (default: A-Z) |
| [sortOrder](sortOrder.md) | Convert a string into a sortable string |

### Split

| Function | Description |
| ------ | ------ |
| [splitChars](splitChars.md) | Split a string into an array of characters |
| [splitLines](splitLines.md) | Split a string into an array of lines |

### Templates

| Name | Description |
| ------ | ------ |
| [FillTemplateOptions](FillTemplateOptions.md) | Options for the [fillTemplate](fillTemplate.md) function |
| [fillTemplate](fillTemplate.md) | Fill a template with supplied values |

### Word Wrapping

| Name | Description |
| ------ | ------ |
| [WordwrapOptions](WordwrapOptions.md) | Options for the [wordwrap](wordwrap.md) function |
| [wordwrap](wordwrap.md) | Wrap text so that it fits within a area of fixed width |
