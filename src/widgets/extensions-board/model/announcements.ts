export const toggledMessage = (name: string, isActive: boolean): string =>
  `${name} ${isActive ? "enabled" : "disabled"}.`;

export const removedMessage = (name: string): string => `${name} removed.`;
