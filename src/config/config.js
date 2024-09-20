const path = require('path');

/**
 * Configuration options for the image optimization process.
 *
 * @module config
 * @type {Object}
 * @property {string} directory - Default directory to scan for images. Defaults to a local 'images' folder.
 * @property {number} maxWidth - Maximum width for resizing images. Default is 1920 pixels.
 * @property {number} maxHeight - Maximum height for resizing images. Default is 1920 pixels.
 * @property {string} saveLocation - Specifies where to save the processed images. Options are 'same' (overwrite original) or 'resized' (save in a separate folder).
 * @property {string} suffix - Suffix to append to resized images when not overwriting. Default is '_resized'.
 * @property {boolean} overwriteOriginal - If true, the original file will be replaced with the optimized file. Default is false.
 * @property {boolean} normalizeBasename - If true, the output basenames will be normalized. Default is true.
 * @property {number} quality - JPEG output quality (1-100). Default is 85.
 * @property {boolean} convertToWebp - If true, images will also be saved in WebP format. Default is true.
 * @property {number} webpQuality - Quality setting for the WebP format (1-100). Default is 85.
 * @property {string[]} excludeDirs - Array of directory names to exclude from processing.
 * @property {boolean} recursive - If true, the scan will include subdirectories. Default is false.
 * @property {string[]} fileExtToOptim - Array of file extensions to optimize. Default includes '.jpg' and '.jpeg'.
 */
module.exports = {
  directory: path.join(process.cwd(), 'images'), // Default directory to a local 'images' folder
  maxWidth: 1920, // Maximum width for resizing
  maxHeight: 1920, // Maximum height for resizing
  saveLocation: 'resized', // Options: 'same', 'resized'
  suffix: '_resized', // Suffix for resized images when not overwriting
  overwriteOriginal: false, // If true, replace the original file
  normalizeBasename: true, // Normalize output basenames
  quality: 85, // JPEG output quality (default: 85)
  convertToWebp: true, // Whether to save as .webp
  webpQuality: 85, // WebP output quality (default: 85)
  excludeDirs: [], // Array of directory names to exclude
  recursive: false, // Whether to scan directories recursively
  fileExtToOptim: ['.jpg', '.jpeg'], // File extentions to optimize
};
