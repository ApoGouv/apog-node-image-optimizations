const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const { formatFileSize, normalizeBasename } = require('../utils/stringUtils');

class ImageProcessor {
  constructor(options) {
    this.options = options;
    this.totalImagesProcessed = 0;
    this.totalSavings = 0;
  }

  /**
   * Resize and optimize an image file.
   * @param {string} filePath - Path to the image file.
   */
  async resizeAndOptimizeImage(filePath) {
    try {
      // Get the original file size
      const originalStats = await fs.stat(filePath);
      const originalSize = originalStats.size;

      const image = sharp(filePath);
      const metadata = await image.metadata();

      // Determine new dimensions while maintaining aspect ratio
      const newDimensions = {
        width:
          metadata.width > this.options.maxWidth
            ? this.options.maxWidth
            : undefined,
        height:
          metadata.height > this.options.maxHeight
            ? this.options.maxHeight
            : undefined,
      };

      // Generate output file path based on options
      const ext = path.extname(filePath);
      const extLower = ext.toLowerCase();
      const baseName = this.options.normalizeBasename
        ? normalizeBasename(path.basename(filePath, ext))
        : path.basename(filePath, ext);
      let outputFilePath = filePath;

      if (this.options.saveLocation === 'resized') {
        const outputDir = path.join(path.dirname(filePath), 'resized');
        await fs.ensureDir(outputDir);
        outputFilePath = path.join(
          outputDir,
          baseName + this.options.suffix + extLower
        );
      } else if (this.options.saveLocation === 'same') {
        outputFilePath = this.options.overwriteOriginal
          ? filePath
          : path.join(
              path.dirname(filePath),
              baseName + this.options.suffix + extLower
            );
      }

      // // DEBUG
      // console.log('Debug ImageProcessor info: ', {
      //   filePath,
      //   baseNameNorm: baseName,
      //   baseName: path.basename(filePath, ext),
      //   ext,
      //   extLower,
      //   outputFilePath,
      // });
      // throw 'Deliberate Error!';

      // Resize the image while maintaining aspect ratio and output to buffer
      let buffer = await image
        .resize({
          width: newDimensions.width,
          height: newDimensions.height,
          fit: sharp.fit.inside,
          withoutEnlargement: true, // Prevent enlargement if image is smaller than max dimensions
        })
        .toBuffer();

      // Save/Convert as JPEG format and apply appropriate format and quality settings
      const jpgSaveResult = await sharp(buffer)
        .jpeg({ quality: this.options.quality })
        .toFile(outputFilePath);

      // console.log(
      //   `- JPG File saved: ${outputFilePath}, Size: ${jpgSaveResult.size}`
      // );

      if (this.options.convertToWebp) {
        // Convert to WebP format
        const webpSaveResult = await sharp(buffer)
          .webp({ quality: this.options.webpQuality })
          .toFile(outputFilePath.replace(extLower, '.webp'));

        // console.log(
        //   `- WEBP File saved: ${outputFilePath}, Size: ${webpSaveResult.size}`
        // );
      }

      // Get the new file size
      const newStats = await fs.stat(outputFilePath);

      const newSize = newStats.size;

      // Calculate size difference
      const sizeDifference = originalSize - newSize;

      // Accumulate total savings
      this.totalSavings += sizeDifference;

      const savingsMessage =
        sizeDifference > 0 ? ` (Saved ${formatFileSize(sizeDifference)})` : '';

      // Increment image count
      this.totalImagesProcessed += 1;

      // Log the processing details including original and new file sizes
      console.log(
        `Processed: ${filePath} (${formatFileSize(
          originalSize
        )}) -> ${outputFilePath} (${formatFileSize(newSize)}) ${
          newDimensions.width || newDimensions.height ? ' (resized)' : ''
        }${savingsMessage}`
      );

      // Preserve original creation date
      await fs.utimes(outputFilePath, originalStats.atime, originalStats.mtime);

      if (this.options.overwriteOriginal && outputFilePath !== filePath) {
        await fs.remove(filePath); // Delete the original file
        await fs.rename(outputFilePath, filePath); // Rename optimized file to original name
        console.log(`Replaced original image: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  /**
   * Scans a directory and its subdirectories (if enabled) for images to resize and optimize.
   *
   * @param {string} directory - The directory path to scan.
   */
  async scanDirectory(directory = null) {
    if (!directory) {
      directory = this.options.directory;
    }

    // Resolve and normalize the directory path
    directory = path.resolve(directory);

    // Read the contents of the directory
    const files = await fs.readdir(directory);

    // Iterate through each item in the directory
    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = await fs.stat(fullPath);

      // Check if the item is a directory and recursive scanning is enabled
      if (stat.isDirectory() && this.options.recursive) {
        // Exclude directories that match the exclusion list
        if (this.options.excludeDirs.includes(file)) {
          console.log(`Skipping excluded directory: ${fullPath}`);
          continue;
        }

        // Recursively scan subdirectories
        await this.scanDirectory(fullPath);
      } else if (
        stat.isFile() &&
        this.options.fileExtToOptim.includes(
          path.extname(fullPath).toLowerCase()
        )
      ) {
        await this.resizeAndOptimizeImage(fullPath);
      }
    }
  }

  logTotalStats() {
    console.log(`Total images processed: ${this.totalImagesProcessed}`);
    console.log(`Total space saved: ${formatFileSize(this.totalSavings)}`);
  }
}

module.exports = ImageProcessor;
