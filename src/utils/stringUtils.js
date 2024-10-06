/**
 * Converts a file size from bytes to a string with the size in kilobytes (KB).
 * If the file size is invalid, returns a string indicating that the size is unformatted.
 *
 * @param {number} fileSize - The file size in bytes.
 * @returns {string} The file size formatted as a string in kilobytes (KB) or [unformatted] if invalid.
 */
function formatFileSize(fileSize) {
  if (typeof fileSize !== 'number' || fileSize < 0) {
    return `${fileSize} [unformatted]`;
  }

  if (fileSize < 1024) {
    return `${fileSize} Bytes`;
  } else if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(2)} KB`;
  } else if (fileSize < 1024 * 1024 * 1024) {
    return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

/**
 * Formats the elapsed time between two timestamps into a human-readable string.
 *
 * @param {number} startTime - The start timestamp in milliseconds.
 * @param {number} endTime - The end timestamp in milliseconds.
 * @return {string} - A formatted string representing the elapsed time.
 */
function formatElapsedTime(startTime, endTime) {
  // Calculate the difference in milliseconds
  const elapsedMilliseconds = endTime - startTime;

  // Calculate hours, minutes, seconds, and milliseconds
  const hours = Math.floor(elapsedMilliseconds / 3600000);
  const minutes = Math.floor((elapsedMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((elapsedMilliseconds % 60000) / 1000);
  const milliseconds = elapsedMilliseconds % 1000;

  // Helper function to format singular or plural
  const pluralize = (value, unit) =>
    value === 1 ? `${value} ${unit}` : `${value} ${unit}s`;

  // Build the result string based on hours, minutes, seconds, and milliseconds
  let result = `${pluralize(milliseconds, 'millisecond')}`;

  if (seconds > 0 || minutes > 0 || hours > 0) {
    result = `${pluralize(seconds, 'second')}, ${result}`;
  }

  if (minutes > 0 || hours > 0) {
    result = `${pluralize(minutes, 'minute')}, ${result}`;
  }

  if (hours > 0) {
    result = `${pluralize(hours, 'hour')}, ${result}`;
  }

  return result;
}

/**
 * Normalizes the basename of a file by replacing spaces with dashes,
 * parentheses with underscores, and other unwanted characters with dashes.
 * This helps create a cleaner, more consistent filename suitable for various
 * file systems while ensuring no consecutive dashes remain.
 *
 * @param {string} basename - The basename of the file to normalize.
 * @returns {string} - The normalized basename.
 */
function normalizeBasename(basename) {
  if (!basename) return basename;

  const dash = '-';
  const underscore = '_';

  // Trim leading and trailing whitespace
  let normalized = basename.trim();

  // Replace spaces with dashes
  normalized = normalized.replace(/\s+/g, dash);

  // Replace parentheses with underscores
  normalized = normalized.replace(/[()]/g, underscore);

  // Replace unwanted characters with dashes
  normalized = normalized.replace(/[^\w]/g, dash);

  // Replace multiple consecutive dashes with a single dash
  normalized = normalized.replace(/-+/g, dash);

  // Replace a dash followed by an underscore with an underscore
  normalized = normalized.replace(/-_/g, underscore);

  // Replace an underscore followed by a dash with an underscore
  normalized = normalized.replace(/_-/g, underscore);

  // Replace multiple consecutive underscores with a single underscore
  normalized = normalized.replace(/_+/g, underscore);

  // Remove any leading or trailing dashes or underscores
  normalized = normalized.replace(/^[-_]+|[-_]+$/g, '');

  return normalized;
}

module.exports = { formatFileSize, formatElapsedTime, normalizeBasename };
