function hasDuplicateValues(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        return true; // Found a match, there are duplicate values
      }
    }
  }
  return false; // No duplicate values found
}

module.exports = hasDuplicateValues;
