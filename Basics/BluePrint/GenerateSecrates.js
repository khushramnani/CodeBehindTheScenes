// const crypto = require('crypto-js');
import CryptoJS from "crypto-js";

const secret = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
console.log(secret);
