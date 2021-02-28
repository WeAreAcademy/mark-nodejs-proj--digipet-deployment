/**
 * The core Digipet functions.
 *
 * These are encapsulated over in controller.ts
 */

export interface Digipet {
  happiness: number;
  nutrition: number;
  discipline: number;
}

const initialDigipet: Digipet = {
  happiness: 50,
  nutrition: 50,
  discipline: 50,
};
/**
 * The default state of a new digipet.
 * Frozen to prevent accidental mutations.
 */
export const INITIAL_DIGIPET = Object.freeze(initialDigipet);

/**
 * The user's digipet (if they have one).
 *
 * Avoid directly manipulating this - you should access it through the getter (getDigipet) and update it through the setter (setDigipet).
 *
 * (This is encapsulation: https://refactoring.guru/encapsulate-field)
 *
 * The variable is exported purely to _test_ `setDigipet`.
 */
export let _userDigipet: Digipet | undefined;

/**
 * Get the data for the user digipet (if it exists) - but not the underlying object reference (to protect the data from accidental changes)
 */
export function getDigipet(): Digipet | null {
  // spread to create a shallow copy to avoid mutation
  return _userDigipet ? { ..._userDigipet } : null;
}

/**
 * Set the user's digipet to a new object (or `undefined`)
 *
 * @param newDigipet The new digipet data; pass `undefined` to effectively remove the digipet
 */
export function setDigipet(newDigipet?: Digipet | undefined): void {
  // spread to avoid mutation
  _userDigipet = newDigipet ? { ...newDigipet } : undefined;
}

/**
 * Makes a bounded update to the user's digipet - increases and decreases up to a maximum of 100 and a minimum of 0
 *
 * @param digipetKey the digipet measure to update
 * @param netUpdate the intended change - e.g. `12` to increase by 12, `-4` to decrease by 4
 */
export function updateDigipetBounded(
  digipetKey: keyof Digipet,
  netUpdate: number
): void {
  const digipetData = getDigipet(); // is a shallow copy
  if (digipetData) {
    const valueToBound = digipetData[digipetKey] + netUpdate;
    if (valueToBound > 100) {
      digipetData[digipetKey] = 100;
    } else if (valueToBound < 0) {
      digipetData[digipetKey] = 0;
    } else {
      digipetData[digipetKey] = valueToBound;
    }
    // shallow copy has updated values to set
    setDigipet(digipetData);
  }
}
