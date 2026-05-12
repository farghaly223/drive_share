// All shared types as JSDoc for reference (JS project - no TS)
// Kept as documentation

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {string} email
 * @property {string} role
 * @property {number} userId
 * @property {boolean} isLicenseVerified
 * @property {boolean} isSuspended
 * @property {boolean} canAddCars
 * @property {boolean} canRentCars
 */

/**
 * @typedef {Object} CarListingDTO
 * @property {number} id
 * @property {string} ownerName
 * @property {string} title
 * @property {string} description
 * @property {string} carType
 * @property {string} brand
 * @property {string} model
 * @property {number} year
 * @property {string} transmission
 * @property {string} location
 * @property {number} rentalPrice
 * @property {string} rentalStatus
 * @property {string} mainImageUrl
 */
