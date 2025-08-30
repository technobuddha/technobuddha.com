<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / JSON

# JSON

### Data Structures

| Class | Description |
| ------ | ------ |
| [JSONMap](JSONMap.md) | A [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) that allows serializable objects keys. |
| [JSONSet](JSONSet.md) | A Set-like collection for objects that can be serialized to JSON. |

### Serialization

| Name | Description |
| ------ | ------ |
| [TBJsonArray](TBJsonArray.md) | Matches a JSON array. |
| [TBJsonObject](TBJsonObject.md) | Matches a JSON object. |
| [TBJsonPrimitive](TBJsonPrimitive.md) | Matches any valid JSON primitive value. |
| [TBJsonValue](TBJsonValue.md) | Matches any valid JSON value. |
| [specialBegin](specialBegin.md) | The beginning of a special JSON value |
| [specialFinish](specialFinish.md) | The end of a special JSON value |
| [replacer](replacer.md) | Used with JSON.stringify to encode a wider range of objects into strings that can later be decoded with [reviver](reviver.md) |
| [reviver](reviver.md) | Used with JSON.parse to decode objected encoded by [replacer](replacer.md) |
