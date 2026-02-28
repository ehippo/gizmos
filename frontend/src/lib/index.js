import * as crypto from './crypto';
import * as formatters from './formatters';
import * as converters from './converters';
import * as text from './text';

/**
 * Unified API for Gizmos Tool Set
 * This replaces the previous Wails bridge as the source of truth.
 */
export const API = {
    // Crypto & Auth
    hashAll: crypto.hashAll,
    generatePassword: crypto.generatePassword,
    passwordStrength: crypto.passwordStrength,
    generateUUID: crypto.generateUUID,
    generateUUIDs: crypto.generateUUIDs,
    validateUUID: crypto.validateUUID,
    jwtEncode: crypto.jwtEncode,
    jwtDecode: crypto.jwtDecode,

    // Formatters
    jsonFormat: formatters.jsonFormat,
    jsonMinify: formatters.jsonMinify,
    sqlFormat: formatters.sqlFormat,
    xmlFormat: formatters.xmlFormat,
    cssFormat: formatters.cssFormat,
    cssMinify: formatters.cssMinify,
    htmlFormat: formatters.htmlFormat,

    // Converters
    base64Encode: async (s) => converters.base64.encode(s),
    base64Decode: async (s) => converters.base64.decode(s),
    unixToTime: converters.unixToTime,
    nowTime: converters.nowTime,
    hexToColor: converters.hexToColor,
    convertBase: converters.convertBase,
    urlEncode: async (s) => encodeURIComponent(s),
    urlDecode: async (s) => { try { return decodeURIComponent(s); } catch { return s; } },

    // Text & Regex
    textAnalyze: text.textAnalyze,
    textTransform: text.textTransform,
    textDiff: text.textDiff,
    regexTest: text.regexTest,
    regexExplain: text.regexExplain,
};

export default API;
