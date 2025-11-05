# Challenge: Implement a Binary Search Algorithm

## Overview

Binary search is a fundamental algorithm used to find a target value within a **sorted array**. It works by repeatedly dividing the search interval in half, making it significantly more efficient than linear search.

## Problem Description

Write a function that implements the binary search algorithm. Your function should:

1. Take a sorted array of integers as input
2. Take a target value to search for
3. Return the **index** of the target value if found
4. Return `-1` if the target value is not in the array

### Function Signature

```javascript
function binarySearch(arr, target) {
    // Your implementation here
}
```

## Examples

### Example 1

```javascript
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
const target = 7;
console.log(binarySearch(arr, target)); // Output: 3
```

### Example 2

```javascript
const arr = [2, 4, 6, 8, 10];
const target = 5;
console.log(binarySearch(arr, target)); // Output: -1
```

### Example 3

```javascript
const arr = [1, 2, 3, 4, 5];
const target = 1;
console.log(binarySearch(arr, target)); // Output: 0
```

## Constraints

- Array length: `1 <= arr.length <= 10^4`
- Array values: `-10^4 <= arr[i] <= 10^4`
- Target value: `-10^4 <= target <= 10^4`
- The array is sorted in **ascending order**
- All elements in the array are **unique**

## Algorithm Steps

The binary search algorithm follows these steps:

1. **Initialize pointers**: Set `left` to 0 and `right` to array length - 1
2. **Calculate middle**: Find the middle index `mid = Math.floor((left + right) / 2)`
3. **Compare with target**:
   - If `arr[mid] === target`, return `mid`
   - If `arr[mid] < target`, search right half (set `left = mid + 1`)
   - If `arr[mid] > target`, search left half (set `right = mid - 1`)
4. **Repeat**: Continue until `left > right`
5. **Not found**: Return `-1` if target is not found

## Time and Space Complexity

| Complexity | Value |
|------------|-------|
| **Time Complexity** | O(log n) |
| **Space Complexity** | O(1) |

> **Why O(log n)?** 
> 
> With each comparison, we eliminate half of the remaining elements. This logarithmic behavior makes binary search extremely efficient for large datasets.

## Hints

💡 **Hint 1**: Remember to handle the case when the array is empty.

💡 **Hint 2**: Be careful with integer overflow when calculating the middle index. Use `left + Math.floor((right - left) / 2)` instead of `Math.floor((left + right) / 2)`.

💡 **Hint 3**: The loop condition should be `left <= right` (not just `left < right`).

## Test Cases

```javascript
// Test Case 1: Target found in middle
assert(binarySearch([1, 2, 3, 4, 5], 3) === 2);

// Test Case 2: Target not found
assert(binarySearch([1, 2, 3, 4, 5], 6) === -1);

// Test Case 3: Target at beginning
assert(binarySearch([1, 2, 3, 4, 5], 1) === 0);

// Test Case 4: Target at end
assert(binarySearch([1, 2, 3, 4, 5], 5) === 4);

// Test Case 5: Single element array - found
assert(binarySearch([42], 42) === 0);

// Test Case 6: Single element array - not found
assert(binarySearch([42], 10) === -1);

// Test Case 7: Large array
const largeArr = Array.from({length: 10000}, (_, i) => i * 2);
assert(binarySearch(largeArr, 1000) === 500);
```

## Related Topics

- **Data Structures**: Arrays, Sorted Arrays
- **Algorithms**: Divide and Conquer, Search Algorithms
- **Techniques**: Two Pointers, Binary Search Variations

## Follow-up Questions

1. How would you modify this to find the **first occurrence** of a target in an array with duplicates?
2. Can you implement this using **recursion** instead of iteration?
3. How would you search for the **insertion position** if the target is not found?

## Resources

- [Binary Search - Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
- [Visualizing Binary Search](https://www.cs.usfca.edu/~galles/visualization/Search.html)

---

**Difficulty**: Easy  
**Category**: Algorithms  
**Tags**: `array`, `binary-search`, `divide-and-conquer`, `search`
