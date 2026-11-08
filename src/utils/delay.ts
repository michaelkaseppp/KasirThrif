// File: src/utils/delay.ts
// Author: Mekell

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
