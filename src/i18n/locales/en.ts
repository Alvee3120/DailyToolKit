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

  'demo.intro':
    'This is a temporary demo tool. It shows the shared UI pieces working: drop a few images below.',
  'demo.quality': 'Quality',
  'demo.processing': 'Preparing your files…',
  'demo.done': 'Ready',
  'demo.pickedFiles': 'Selected files',
  'demo.downloadOriginal': 'Download original',
  'demo.reset': 'Choose different files',
  'demo.note':
    'Real tools are added in the next modules; this page only proves the registry and shared components work.',
} as const

export type TranslationKey = keyof typeof en
