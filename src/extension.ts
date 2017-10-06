"use strict";

import { ExtensionContext, commands, window, workspace } from "vscode";

// Values from common editor config:
// https://github.com/Microsoft/vscode/blob/master/src/vs/editor/common/config/commonEditorConfig.ts#L521
const minFontSize = 1;
const maxFontSize = 100;

export function activate(context: ExtensionContext) {
  const increaseSizeCommand = commands.registerCommand(
    "fontshortcuts.increaseFontSize",
    () => {
      const config = workspace.getConfiguration();
      const fontSize = config.get<number>("editor.fontSize");
      const step = config.get<number>("fontshortcuts.step");
      const newSize = Math.min(maxFontSize, fontSize + step);
      if (newSize !== fontSize) {
        config.update("terminal.integrated.fontSize", newSize, true);
        return config.update("editor.fontSize", newSize, true);
      }
    }
  );
  const decreaseSizeCommand = commands.registerCommand(
    "fontshortcuts.decreaseFontSize",
    () => {
      const config = workspace.getConfiguration();
      const fontSize = config.get<number>("editor.fontSize");
      const step = config.get<number>("fontshortcuts.step");
      const newSize = Math.max(minFontSize, fontSize - step);
      if (newSize !== fontSize) {
        config.update("terminal.integrated.fontSize", newSize, true);
        return config.update("editor.fontSize", newSize, true);
      }
    }
  );
  const resetSizeCommand = commands.registerCommand(
    "fontshortcuts.resetFontSize",
    async () => {
      // Check whether an override for the default font size exists
      const defaultFontSize = workspace
        .getConfiguration("fontshortcuts")
        .get("defaultFontSize") as number;
      console.log(defaultFontSize);
      if (defaultFontSize) {
        // Check whether the setting is a valid value
        if (
          Number.isSafeInteger(defaultFontSize) &&
          defaultFontSize >= minFontSize &&
          defaultFontSize <= maxFontSize
        ) {
          try {
            await workspace
              .getConfiguration()
              .update("terminal.integrated.fontSize", defaultFontSize, true);
            return workspace
              .getConfiguration()
              .update("editor.fontSize", defaultFontSize, true);
          } catch (exception) {
            return false;
          }
        } else {
          window.showErrorMessage(
            `Cannot set default font size to "${defaultFontSize}". Please set it to an integer between ${minFontSize} and ${maxFontSize} in your user settings.`
          );
        }
      } else {
        // No override is set, remove the fontSize setting to let VSCode set the default font size
        try {
          await workspace
            .getConfiguration()
            .update("terminal.integrated.fontSize", undefined, true);
          return (
            workspace
              .getConfiguration()
              .update("editor.fontSize", undefined, true)
              // Swallow exceptions if fontSize has already been reset
              .then(() => {}, () => {})
          );
        } catch (exception) {
          return false;
        }
      }
    }
  );

  context.subscriptions.push(increaseSizeCommand);
  context.subscriptions.push(decreaseSizeCommand);
  context.subscriptions.push(resetSizeCommand);
}

export function deactivate() {}
