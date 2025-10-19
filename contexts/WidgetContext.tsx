
import * as React from "react";
import { createContext, useCallback, useContext } from "react";

// Try to import ExtensionStorage, but handle if it's not available
let ExtensionStorage: any = null;
let storage: any = null;

try {
  const AppleTargets = require("@bacons/apple-targets");
  ExtensionStorage = AppleTargets.ExtensionStorage;
  // Initialize storage with your group ID
  storage = new ExtensionStorage("group.com.<user_name>.<app_name>");
} catch (error) {
  console.log("ExtensionStorage not available (this is normal on Android/Web):", error);
}

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  // Update widget state whenever what we want to show changes
  React.useEffect(() => {
    if (ExtensionStorage) {
      try {
        // set widget_state to null if we want to reset the widget
        // storage.set("widget_state", null);

        // Refresh widget
        ExtensionStorage.reloadWidget();
      } catch (error) {
        console.log("Error refreshing widget:", error);
      }
    }
  }, []);

  const refreshWidget = useCallback(() => {
    if (ExtensionStorage) {
      try {
        ExtensionStorage.reloadWidget();
      } catch (error) {
        console.log("Error refreshing widget:", error);
      }
    }
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
