import { LotoNumbersValidationResult } from "./types";

const MIN_NUM = 1;
const MAX_NUM = 45;

export const validateLotoNumbersInput = (nums: number[]): LotoNumbersValidationResult => {
    if (nums.length < 6 || nums.length > 10) {
        return {
            message: 'Brojevi moraju biti između 6 i 10',
            isValid: false
        };
    } else if (new Set(nums).size !== nums.length) {
        return {
            message: 'Svi brojevi moraju biti različiti',
            isValid: false
        };
    } else if (nums.some(n => isNaN(Number(n)) || Number(n) < MIN_NUM || Number(n) > MAX_NUM)) {
        return {
            message: `Svi brojevi moraju biti između ${MIN_NUM} i ${MAX_NUM}`,
            isValid: false
        }
    }

    return {
        message: 'OK',
        isValid: true
    }
};

export const validateDocument = (doc: string): boolean => {
    if (!doc || doc.trim().length === 0 || doc.length > 20 || !/^\d+$/.test(doc)) {
        return false;
    }
    return true;
};