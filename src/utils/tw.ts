/**
 * Utility function to add prefix to Tailwind classes for Module Federation
 * This prevents CSS conflicts between federated apps
 */
export const tw = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes
    .filter(Boolean)
    .map((cls) =>
      (cls as string)
        .split(" ")
        .filter(Boolean)
        .map((className) => `host-${className}`)
        .join(" ")
    )
    .join(" ");
};

// For conditional classes
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return tw(...classes);
};
