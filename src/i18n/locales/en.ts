/**
 * English UI strings. Keys are dotted and flat on purpose.
 * A Bangla dictionary (bn.ts) is added in Module 13.
 */
export const en = {
  'app.name': 'DailyKit',
  'app.skipToContent': 'Skip to main content',

  'privacy.badge': 'Your files never leave your device',

  'header.searchLabel': 'Search tools',
  'header.searchPlaceholder': 'Search tools…',

  'home.heroTitle': 'Free tools that run in your browser',
  'home.heroSubtitle':
    'Images, PDFs and text — with your files never leaving your device.',
  'home.searchPlaceholder': 'What do you want to do?',
  'home.recentlyUsed': 'Recently used',
  'home.noTools': 'Tools are on the way. Check back soon.',

  'search.clear': 'Clear search',
  'search.resultsHeading': 'Search results',
  'search.noResultsTitle': 'No tools found',
  'search.noResultsBody': 'Nothing matches “{query}”. Try a different word.',
  'search.clearAction': 'Clear search',

  'category.Image': 'Image',
  'category.PDF': 'PDF',
  'category.Text': 'Text',
  'category.Utilities': 'Utilities',

  'theme.toggleToDark': 'Switch to dark mode',
  'theme.toggleToLight': 'Switch to light mode',

  'footer.privacy':
    'Your files are processed on your device and never uploaded anywhere.',
  'footer.tagline': 'Works on any phone, even on a slow connection.',

  'notFound.title': 'Page not found',
  'notFound.body':
    'We could not find that page. It may have moved, or the link might be wrong.',
  'notFound.action': 'Back to all tools',

  'tool.backToTools': 'All tools',
  'tool.loading': 'Loading tool…',
  'tool.aiBadge': 'AI',

  'dropzone.title': 'Drag & drop files here',
  'dropzone.dropNow': 'Drop your files to add them',
  'dropzone.or': 'or',
  'dropzone.browse': 'browse files',
  'dropzone.pasteHint': 'You can also paste with Ctrl+V (⌘V on Mac).',

  'error.unsupportedType': "This file type isn't supported. Try {types}.",
  'error.fileTooLarge': '“{name}” is too large ({size}). The limit is {limit}.',

  'common.tryAgain': 'Try again',
  'download.button': 'Download',
  'options.advanced': 'Advanced options',

  'size.smaller': '{percent}% smaller',
  'size.larger': '{percent}% larger',
  'size.same': 'same size',

  'compare.ariaLabel': 'Drag to compare before and after',
  'compare.before': 'Before',
  'compare.after': 'After',

  'img.original': 'Original',
  'img.result': 'Result',
  'img.processing': 'Processing image…',
  'img.reset': 'Choose another image',
  'img.largeImage':
    'This is a large image ({megapixels} megapixels). It may take a while on a phone.',
  'img.error.decode':
    'This image could not be opened. It may be damaged, or in a format this browser cannot read.',
  'img.error.process':
    'Something went wrong while processing this image. Please try another one.',
  'img.progress.quality': 'Finding the best quality…',
  'img.progress.scale': 'Making it smaller…',
  'img.target.missed':
    'We could not get under {size}. This is the smallest version we could make.',
  'img.unit.kb': 'KB',
  'img.unit.mb': 'MB',

  'img.compress.mode': 'How should we make it smaller?',
  'img.compress.byQuality': 'Set quality',
  'img.compress.bySize': 'Set a size limit',
  'img.compress.quality': 'Quality',
  'img.compress.qualityHint': 'Lower is smaller. 80% is a good default.',
  'img.compress.targetSize': 'Target size',
  'img.compress.targetHint':
    'We will find the best quality that fits under this size.',
  'img.compress.process': 'Make smaller',
  'img.compress.formatNote': 'Output format: {format}',

  'img.resize.mode': 'Resize by',
  'img.resize.byPixels': 'Pixels',
  'img.resize.byPercent': 'Percentage',
  'img.resize.width': 'Width (px)',
  'img.resize.height': 'Height (px)',
  'img.resize.lock': 'Keep shape (aspect ratio)',
  'img.resize.percent': 'Scale',
  'img.resize.preset': 'Preset',
  'img.resize.presetCustom': 'Custom',
  'img.resize.process': 'Resize image',

  'img.convert.format': 'Convert to',
  'img.convert.current': 'This file is {format}.',
  'img.convert.background': 'Background colour',
  'img.convert.backgroundHint': 'Fills transparent areas when saving as JPG.',
  'img.convert.process': 'Convert image',

  'crop.aspect': 'Aspect ratio',
  'crop.selection': 'Crop selection',
  'crop.hint': 'Drag the selection or its corners to choose the part to keep.',
  'crop.resetSelection': 'Reset selection',
  'crop.handle.nw': 'Resize from the top-left corner',
  'crop.handle.ne': 'Resize from the top-right corner',
  'crop.handle.sw': 'Resize from the bottom-left corner',
  'crop.handle.se': 'Resize from the bottom-right corner',
  'crop.moveHandle': 'Move the crop selection',
  'crop.output': 'Crop size: {width} × {height} px',
  'crop.process': 'Crop image',
  'crop.preset.free': 'Free',
  'crop.preset.original': 'Original',
  'crop.preset.square': 'Square (1:1)',
  'crop.preset.landscape': 'Landscape (4:3)',
  'crop.preset.portrait': 'Portrait (3:4)',
  'crop.preset.wide': 'Wide (16:9)',
  'crop.preset.tall': 'Tall (9:16)',
  'crop.preset.photo': 'Photo (3:2)',
  'crop.preset.photoPortrait': 'Photo portrait (2:3)',

  'rotate.heading': 'Rotate & flip',
  'rotate.hint':
    'Rotate in 90° steps and mirror the image. The preview shows the result.',
  'rotate.left': 'Rotate left',
  'rotate.right': 'Rotate right',
  'rotate.flipH': 'Flip horizontal',
  'rotate.flipV': 'Flip vertical',
  'rotate.resetTransforms': 'Reset',
  'rotate.output': 'Result size: {width} × {height} px',
  'rotate.process': 'Save image',

  'wm.type': 'Watermark type',
  'wm.type.text': 'Text',
  'wm.type.image': 'Logo',
  'wm.preview': 'Watermark preview',
  'wm.text': 'Text',
  'wm.textPlaceholder': '© Your name 2026',
  'wm.font': 'Font',
  'wm.font.sans': 'Sans-serif',
  'wm.font.serif': 'Serif',
  'wm.font.mono': 'Monospace',
  'wm.bold': 'Bold',
  'wm.italic': 'Italic',
  'wm.color': 'Colour',
  'wm.logo': 'Logo image',
  'wm.logoPick': 'Choose a logo',
  'wm.logoChange': 'Change logo',
  'wm.logoHint': 'A PNG with a transparent background works best.',
  'wm.size': 'Size',
  'wm.scale': 'Size',
  'wm.opacity': 'Opacity',
  'wm.rotation': 'Rotation',
  'wm.margin': 'Margin',
  'wm.position': 'Position',
  'wm.position.topLeft': 'Top left',
  'wm.position.topCenter': 'Top centre',
  'wm.position.topRight': 'Top right',
  'wm.position.middleLeft': 'Middle left',
  'wm.position.center': 'Centre',
  'wm.position.middleRight': 'Middle right',
  'wm.position.bottomLeft': 'Bottom left',
  'wm.position.bottomCenter': 'Bottom centre',
  'wm.position.bottomRight': 'Bottom right',
  'wm.hint': 'Drag the sliders — the preview shows exactly how it will look.',
  'wm.process': 'Add watermark',

  'preset.hd': 'HD',
  'preset.fullHd': 'Full HD',
  'preset.instagramPost': 'Instagram post',
  'preset.instagramStory': 'Instagram story',
  'preset.facebookCover': 'Facebook cover',
  'preset.whatsappProfile': 'WhatsApp profile',
} as const

export type TranslationKey = keyof typeof en
