/** 
 * @module cryptoJs
 * @description 加密解密
 *  */
import CryptoJS from 'crypto-js';

/**
 * DES - 加密
 * @param {String} word 需要加密的串
 * @param {String} keyStr key
 * @return {String} 加密结果
 * @example this.$ljsCryptoJs.setDES('需要加密的串', key)
 */
export function setDES(word, keyStr) {
	word = word.toString();
	var keyHex = CryptoJS.enc.Utf8.parse(keyStr);
	var ivHex = CryptoJS.enc.Utf8.parse(keyStr);
	const encrypted = CryptoJS.DES.encrypt(word, keyHex, {
		iv: ivHex,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.ciphertext.toString();
}

/**
 * DES - 解密，CBC模式解密
 * @param {String} word 需要解密的内容
 * @param {String} keyStr key
 * @return {String} 解密结果
 * @example this.$ljsCryptoJs.getDES('需要解密的串', key)
 */
export function getDES(word, keyStr) {
	var keyHex = CryptoJS.enc.Utf8.parse(keyStr);
	var ivHex = CryptoJS.enc.Utf8.parse(keyStr);
	// direct decrypt ciphertext
	var decrypted = CryptoJS.DES.decrypt({
		ciphertext: CryptoJS.enc.Hex.parse(word)
	}, keyHex, {
		iv: ivHex,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * sha256 - 加密
 * @param {String} word 需要加密的串
 * @return {String} 加密结果
 * @example this.$ljsCryptoJs.setSha256('需要加密的串')
 */
export function setSha256(word) {
	return CryptoJS.SHA256(word).toString();
}

/**
 * MD5 - 加密
 * @param {String} word 需要加密的内容
 * @return {String} 加密结果
 * @example this.$ljsCryptoJs.setMD5('需要加密的内容')
 */
export function setMD5(word) {
	return CryptoJS.MD5(word).toString();
}

export default {
	setDES,
	getDES,
	setSha256,
	setMD5,
};