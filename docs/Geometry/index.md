<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / Geometry

# Geometry

### Angle

| Name | Description |
| ------ | ------ |
| [AngleUnit](AngleUnit.md) | Types of angle units |
| [OriginOptions](OriginOptions.md) | Options for origin-related functions |
| [UnitOptions](UnitOptions.md) | Options for angle-related functions |
| [angleUnits](angleUnits.md) | Number of units in a circle |
| [angleBetweenPoints](angleBetweenPoints.md) | Computes the angle between two points (x1,y1) and (x2,y2). Angle zero points in the +X direction, π/2 radians points in the +Y direction (down) and from there we grow clockwise towards π*2 radians. |
| [angleDifference](angleDifference.md) | Computes the difference between startAngle and endAngle. |
| [angleOfLine](angleOfLine.md) | Calculates the angle of a given line segment, relative to the horizontal axis |
| [angleReflection](angleReflection.md) | Calculates the reflection of an angle across a specified axis. |
| [normalizeAngle](normalizeAngle.md) | Normalizes an angle to be in range 0-1 turns. |
| [toAngle](toAngle.md) | Converts an angle from one unit to another. |
| [toDegrees](toDegrees.md) | Convert an angle from radians to degrees |
| [toRadians](toRadians.md) | Converts degrees to radians. |

### Coordinates

| Name | Description |
| ------ | ------ |
| [Cartesian](Cartesian.md) | Represents a point in 2D Cartesian coordinate space. |
| [Polar](Polar.md) | Polar coordinate (angle, radius) |
| [XY](XY.md) | Represents a two-dimensional amount `x` and `y` aspects. |
| [Origin](Origin.md) | The origin of cartesian coordinates (0, 0) |
| [isCartesian](isCartesian.md) | Determines if the provided value is a Cartesian point. |
| [isPolar](isPolar.md) | Determines if the provided value is a Polar point. |
| [toCartesian](toCartesian.md) | Convert polar coordinates to cartesian |
| [toPolar](toPolar.md) | Convert cartesian coordinates to polar |

### Line Segment

| Name | Description |
| ------ | ------ |
| [LineSegment](LineSegment.md) | Represents a line segment in 2D space, defined by its start and end points. |
| [OnLineOptions](OnLineOptions.md) | Options for the [isOnLine](isOnLine.md) function |
| [angleOfLine](angleOfLine.md) | Calculates the angle of a given line segment, relative to the horizontal axis |
| [isIntersecting](isIntersecting.md) | Determines whether a given shape (either a LineSegment or a Polygon) intersects with a polygon. |
| [isLeftOfLine](isLeftOfLine.md) | Determines whether a given point lies to the left of a specified line segment. |
| [isOnLine](isOnLine.md) | Determines whether a given point lies on a specified line segment or its extension. |
| [isRightOfLine](isRightOfLine.md) | Determines whether a given point lies to the right of a specified line segment. |
| [lineIntersection](lineIntersection.md) | Calculates the intersection point of two line segments. |
| [lineLength](lineLength.md) | Calculates the length of a line segment. |
| [midpoint](midpoint.md) | Calculates a point at a given fraction (`part`) along a line segment. By default it returns the true midpoint of the line segment |
| [normalizeLineSegment](normalizeLineSegment.md) | Returns a [LineSegment](LineSegment.md) where the point with the higher y-coordinate is always the starting point (x0, y0). If the original line's y1 is greater than y0, the line is returned as-is. Otherwise, the start and end points are swapped. |
| [polygonSides](polygonSides.md) | Generate line segments for each side of the polygon. |
| [toLineSegment](toLineSegment.md) | Converts two Cartesian points into a `LineSegment` object. |

### Point

| Function | Description |
| ------ | ------ |
| [isInPolygon](isInPolygon.md) | Determines whether a given point or rectangle is inside or on the edge of a polygon. |
| [isLeftOfLine](isLeftOfLine.md) | Determines whether a given point lies to the left of a specified line segment. |
| [isOnLine](isOnLine.md) | Determines whether a given point lies on a specified line segment or its extension. |
| [isOnPolygon](isOnPolygon.md) | Determines whether a given point lies exactly on the boundary of a polygon. |
| [isRightOfLine](isRightOfLine.md) | Determines whether a given point lies to the right of a specified line segment. |
| [manhattanDistance](manhattanDistance.md) | Calculates the Manhattan Distance between two points in Cartesian coordinates. |
| [rotate](rotate.md) | Rotates a point or a polygon around a given origin by a specified angle. |
| [scale](scale.md) | Scales a point or a polygon of points around a given origin by a specified amount. |
| [translate](translate.md) | Translate a point or polygon by a specified amount. |

### Polygon

| Name | Description |
| ------ | ------ |
| [Polygon](Polygon.md) | A polygon (a set of cartesian coordinates) |
| [area](area.md) | Calculates the area of a polygon given its vertices. |
| [bounds](bounds.md) | Calculates the axis-aligned bounding rectangle for a given polygon. |
| [centroid](centroid.md) | Calculates the centroid (geometric center) of a polygon. |
| [convexHull](convexHull.md) | Computes the convex hull of a set of 2D points using the Monotone Chain algorithm. |
| [edgeAngles](edgeAngles.md) | Generate normalized edge angles from polygon edges. |
| [isClosed](isClosed.md) | Determines whether a given polygon is closed. |
| [isInPolygon](isInPolygon.md) | Determines whether a given point or rectangle is inside or on the edge of a polygon. |
| [isIntersecting](isIntersecting.md) | Determines whether a given shape (either a LineSegment or a Polygon) intersects with a polygon. |
| [isOnPolygon](isOnPolygon.md) | Determines whether a given point lies exactly on the boundary of a polygon. |
| [isPolygon](isPolygon.md) | Determines if the provided object is a `Polygon`. |
| [largestInscribedRectangle](largestInscribedRectangle.md) | Computes the largest rectangle that can be inscribed within the given polygon. |
| [perimeter](perimeter.md) | Calculates the perimeter of a polygon. |
| [polygonSides](polygonSides.md) | Generate line segments for each side of the polygon. |
| [regularPolygon](regularPolygon.md) | Generates a regular polygon. |
| [rotate](rotate.md) | Rotates a point or a polygon around a given origin by a specified angle. |
| [scale](scale.md) | Scales a point or a polygon of points around a given origin by a specified amount. |
| [star](star.md) | Generates a star-shaped polygon. |
| [toClosed](toClosed.md) | Ensures that a given polygon is closed by checking if the first and last points are the same. If the polygon is not closed, it appends the first point to the end of the array. |
| [toPolygon](toPolygon.md) | Converts two [Cartesian](Cartesian.md) points or a [Rect](Rect.md) into a [Polygon](Polygon.md). |
| [translate](translate.md) | Translate a point or polygon by a specified amount. |

### Rectangle

| Name | Description |
| ------ | ------ |
| [LargestInscribedRectUnitOptions](LargestInscribedRectUnitOptions.md) | Configuration options for the largest inscribed rectangle algorithm. |
| [Rect](Rect.md) | A rectangle (defined by its top-left corner, width and height) |
| [RotatedRect](RotatedRect.md) | Represents a rectangle that has been rotated by a certain angle. Extends the `Rect` type with additional properties for the area and rotation angle. const hull = convexHull(points); |
| [isInPolygon](isInPolygon.md) | Determines whether a given point or rectangle is inside or on the edge of a polygon. |
| [isRect](isRect.md) | Determines if the provided value is a [Rect](Rect.md)e. |
| [largestInscribedRectangle](largestInscribedRectangle.md) | Computes the largest rectangle that can be inscribed within the given polygon. |
| [toSquare](toSquare.md) | Converts a [Rect](Rect.md) to the largest possible square that fits within it, centered along the longer dimension. If the rectangle is already a square, it returns the original rectangle. |
