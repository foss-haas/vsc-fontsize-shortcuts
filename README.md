# FontSize Shortcuts

## Introduction

Change the font size with keyboard shortcuts.

![Example](https://i.imgur.com/Gs7KqPG.gif)

## Features

You can use the following shortcuts to adjust the font size:

- Increase font size: `Ctrl/Cmd` and `+`
- Decrease font size: `Ctrl/Cmd` and `-`
- Reset font size to default: `Ctrl/Cmd` and `0`

### Settings

You can configure the following settings:

- **fontshortcuts.defaultFontSize**: The default font size used for a reset. (default: 15)
- **fontshortcuts.step**: The step for each font size increment/decrement. (default: 1)

```json
{
  "fontshortcuts.defaultFontSize": 15,
  "fontshortcuts.step": 1
}
```

## Requirements

Visual Studio Code 1.6 or higher

## Release Notes

#### 1.3.0

- Added `fontshortcuts.step` setting to configure the step for each font size increment/decrement.

#### 1.2.0

- The integrated terminal font size is now adjusted as well.

#### 1.1.0

- Added `fontshortcuts.defaultFontSize` setting to configure the font size set on a reset.

### 1.0.0

Initial release
