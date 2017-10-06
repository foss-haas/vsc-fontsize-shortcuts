"use strict";

import {
  ExtensionContext,
  WorkspaceConfiguration,
  commands,
  window,
  workspace,
} from "vscode";

const minFontSize = 1;
const maxFontSize = Number.MAX_SAFE_INTEGER;

export function activate(context: ExtensionContext) {
  async function increaseFontSize(terminal: boolean) {
    const config = workspace.getConfiguration();
    const fontSizeType = terminal
      ? "terminal.integrated.fontSize"
      : "editor.fontSize";
    const fontSize = config.get<number>(fontSizeType);
    const step = config.get<number>("fontshortcuts.step");
    const newSize = Math.min(maxFontSize, Math.round(fontSize + step));
    if (newSize === fontSize) return;
    return config.update(fontSizeType, newSize, true);
  }

  async function decreaseFontSize(terminal: boolean) {
    const config = workspace.getConfiguration();
    const fontSizeType = terminal
      ? "terminal.integrated.fontSize"
      : "editor.fontSize";
    const fontSize = config.get<number>(fontSizeType);
    const step = config.get<number>("fontshortcuts.step");
    const newSize = Math.max(minFontSize, Math.round(fontSize - step));
    if (newSize === fontSize) return;
    return config.update(fontSizeType, newSize, true);
  }

  async function resetFontSize(terminal: boolean) {
    const config = workspace.getConfiguration();
    const fontSizeType = terminal
      ? "terminal.integrated.fontSize"
      : "editor.fontSize";
    const defaultFontSizeType = terminal
      ? "fontshortcuts.defaultFontSize"
      : "fontshortcuts.defaultTerminalFontSize";
    const defaultFontSize = config.get<number>(defaultFontSizeType);

    if (defaultFontSize === null) {
      try {
        return await config.update(fontSizeType, undefined, true);
      } catch (e) {
        // swallow errors
        return;
      }
    }

    if (
      Number.isSafeInteger(defaultFontSize) &&
      defaultFontSize >= minFontSize &&
      defaultFontSize <= maxFontSize
    ) {
      return config.update(fontSizeType, defaultFontSize, true);
    }

    window.showErrorMessage(
      `Cannot set font size to "${defaultFontSize}". Please set "${defaultFontSizeType}" to an integer between ${minFontSize} and ${maxFontSize} in your user settings.`
    );
  }

  context.subscriptions.push(
    commands.registerCommand("fontshortcuts.increaseEditorFontSize", () =>
      increaseFontSize(false)
    ),

    commands.registerCommand("fontshortcuts.increaseTerminalFontSize", () =>
      increaseFontSize(true)
    ),

    commands.registerCommand("fontshortcuts.increaseFontSize", () =>
      Promise.all([increaseFontSize(false), increaseFontSize(true)])
    ),

    commands.registerCommand("fontshortcuts.decreaseEditorFontSize", () =>
      decreaseFontSize(false)
    ),

    commands.registerCommand("fontshortcuts.decreaseTerminalFontSize", () =>
      decreaseFontSize(true)
    ),

    commands.registerCommand("fontshortcuts.decreaseFontSize", () =>
      Promise.all([decreaseFontSize(false), decreaseFontSize(true)])
    ),

    commands.registerCommand("fontshortcuts.resetEditorFontSize", () =>
      resetFontSize(false)
    ),

    commands.registerCommand("fontshortcuts.resetTerminalFontSize", () =>
      resetFontSize(true)
    ),

    commands.registerCommand("fontshortcuts.resetFontSize", () =>
      Promise.all([resetFontSize(false), resetFontSize(true)])
    )
  );
}

export function deactivate() {}
