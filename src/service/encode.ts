import { Buffer } from "buffer";

export const convertStringToUint8Array = (message: string) => {
  const uint8Array = new Uint8Array(message.length);
  for (let i = 0; i < message.length; i++) {
    uint8Array[i] = message.charCodeAt(i);
  }
  return uint8Array;
};

export const convertUint8ArrayToString = (uint8: Uint8Array) => {
  let message = "";
  for (let i = 0; i < uint8.length; i++) {
    message += String.fromCharCode(uint8[i]);
  }
  return message;
};

export function base64ToArrayBuffer(base64: string) {
  const myBuffer = Buffer.from(base64, "base64");

  return new Uint8Array(myBuffer);
}
