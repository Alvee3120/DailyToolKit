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

  'preset.hd': 'HD',
  'preset.fullHd': 'Full HD',
  'preset.instagramPost': 'Instagram post',
  'preset.instagramStory': 'Instagram story',
  'preset.facebookCover': 'Facebook cover',
  'preset.whatsappProfile': 'WhatsApp profile',
} as const

export type TranslationKey = keyof typeof en
