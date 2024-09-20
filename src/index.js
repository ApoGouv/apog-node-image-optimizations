const fs = require('fs-extra');
const path = require('path');
const ImageProcessor = require('./image-components/ImageProcessor');
const options = require('./config/config');
const { formatElapsedTime } = require('./utils/stringUtils');

// Check if the initial directory exists and start scanning
async function main() {
  try {
    // Parse command-line arguments
    const args = process.argv.slice(2);
    if (args.length > 0) {
      options.directory = args[0]; // Override directory if provided
    }

    // Start timer
    const startTime = Date.now();

    // Resolve and normalize the directory path
    const directoryPathToScan = path.resolve(options.directory);

    // Check if the directory exists
    const directoryExists = await fs.pathExists(directoryPathToScan);
    if (!directoryExists) {
      console.error(`Directory does not exist: ${directoryPathToScan}`);
      process.exit(1); // Exit the script with an error code
    }

    const imgProcessor = new ImageProcessor(options);

    // Start scanning the directory and processing images
    await imgProcessor.scanDirectory();

    console.log('Image optimization completed.');

    imgProcessor.logTotalStats();

    // Output execution time
    const endTime = Date.now();
    console.log(`Execution Time: ${formatElapsedTime(startTime, endTime)}`);
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1); // Exit the script with an error code if there's an issue during initialization
  }
}

// Execute initialization
// call like:
// node index.js
// node index.js /path/to/your/folder
main();
