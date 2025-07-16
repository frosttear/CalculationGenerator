(function() {
    const UnitConverter = {
        generateResult(num, unit, usedUnits, unitsInBase, unitNames, minVal, maxVal, targetUnit) {
            const numInBase = num * unitsInBase[unit];

            if (!targetUnit) {
                const availableUnits = unitNames.filter(u => !usedUnits.has(u) && u !== unit); // Ensure target unit is different from source unit
                if (availableUnits.length === 0) return null;
                targetUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
            }
            
            let conversion = [];

            if (unitsInBase[targetUnit] < unitsInBase[unit]) { // Simple conversion
                const val = numInBase / unitsInBase[targetUnit];
                if (Number.isInteger(val) && val >= minVal && val <= maxVal) {
                    conversion.push({ value: val, unit: targetUnit });
                }
            } else { // Compound conversion
                let remainingInBase = numInBase;
                const startIndex = unitNames.indexOf(targetUnit);

                for (let i = startIndex; i < unitNames.length; i++) {
                    const currentUnitName = unitNames[i];
                    const currentUnitInBase = unitsInBase[currentUnitName];
                    
                    if (remainingInBase >= currentUnitInBase) {
                        const value = Math.floor(remainingInBase / currentUnitInBase);
                        if (value > 0) {
                            if (value > maxVal) { // Individual part value check
                                conversion = []; // Invalidate conversion
                                break;
                            }
                            conversion.push({ value: value, unit: currentUnitName });
                        }
                        remainingInBase %= currentUnitInBase;
                    }
                }
            }

            if (conversion.length > 0) {
                return { conversion: conversion, targetUnit: targetUnit };
            }
            return null;
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = UnitConverter;
    } else {
        window.UnitConverter = UnitConverter; // Expose to global scope for browser
    }
})();