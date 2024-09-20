# APOG Node Image Optimizations

A Node.js tool for bulk optimizing JPG images with resizing and optional WebP conversion.

## Features

- Bulk image processing
- Resizing of images with customizable maximum dimensions
- Optional conversion to WebP format
- Configurable output options

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/apog-node-image-optimizations.git
   cd apog-node-image-optimizations
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To run the image optimization tool, use the following command:

```bash
npm run nio -- /path/to/your/images
```

### Options

You can customize the behavior of the tool by modifying the `src/config.js` file, where you can set:

- `directory` (string): Default directory to scan for images. Defaults to a local 'images' folder.
- `maxWidth` (number): Maximum width for resizing images. Default is `1920`.
- `maxHeight` (number): Maximum height for resizing images. Default is `1920`.
- `saveLocation` (string): Save location options: `'same'` or `'resized'`. Default is `'resized'`.
- `suffix` (string): Suffix for resized images when not overwriting. Default is `'_resized'`.
- `overwriteOriginal` (boolean): If true, replaces the original file. Default is `false`.
- `quality` (number): JPEG output quality. Default is `85`.
- `convertToWebp` (boolean): Whether to save images as `.webp`. Default is `true`.
- `webpQuality` (number): WebP output quality. Default is `85`.
- `excludeDirs` (array): Array of directory names to exclude from scanning. Default is an empty array.
- `recursive` (boolean): Whether to scan directories recursively. Default is `false`.
- `fileExtToOptim` (array): File extensions to optimize. Default is `['.jpg', '.jpeg']`.

## Example

To optimize images located in the `images` folder, run:

```bash
npm run nio
```

or for a custom path

```bash
npm run nio -- /full/path/to/unoptimized/images/folder
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
