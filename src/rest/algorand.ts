import algosdk, {
  TransactionLike,
  secretKeyToMnemonic,
  OnApplicationComplete,
  TransactionType,
} from "algosdk";
import axios from "axios";
import { getRandomBytes } from "expo-crypto";
import { Buffer } from "buffer";
import { sha512_256 } from "js-sha512";
import { getStoreValue, setStorePair } from "../store";
import { key_address, key_mnemonic } from "../constants";
import { appId, purestakeAPIKey, purestakeBaseServer } from "../../env";
import {
  base64ToArrayBuffer,
  convertStringToUint8Array,
} from "../service/encode";

export const createAccount = async () => {
  const privateKeyBytes = getRandomBytes(32);
  const privateKey = new Uint8Array(privateKeyBytes);
  const mnemonic = secretKeyToMnemonic(privateKey);
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  await setStorePair(key_mnemonic, mnemonic);
  await setStorePair(key_address, account.addr);
  return { mnemonic, addr: account.addr };
};

const getTransactionParams = async () => {
  const url = `${purestakeBaseServer}/transactions/params`;
  const headers = {
    "X-API-key": purestakeAPIKey,
    "Content-Type": "application/json",
  };

  const response = await axios.get(url, { headers });
  return response.data;
};

export const createAssetTransaction = async (
  assetName: string,
  assetUrl: string,
  assetTotal: number
) => {
  const transactionParams = await getTransactionParams();
  const algorandAddress = await getStoreValue(key_address);
  const mnemonic = await getStoreValue(key_mnemonic);

  const hash = sha512_256("create_asset(string,string,uint64,byte[32])void");
  const methodSelector = Buffer.from(hash.slice(0, 8), "hex");

  const assetNameEncoded = convertStringToUint8Array(assetName);
  const assetUrlEncoded = convertStringToUint8Array(assetUrl);
  const assetTotalEncoded = algosdk.encodeUint64(assetTotal);
  const metaData = algosdk.decodeAddress(algorandAddress).publicKey;

  const assetNamePrefix = [0, assetNameEncoded.length];
  const assetUrlPrefix = [0, assetUrlEncoded.length];

  const txn: TransactionLike = {
    appIndex: appId,
    appOnComplete: OnApplicationComplete.NoOpOC,
    fee: Math.max(1000, transactionParams["min-fee"]),
    flatFee: true,
    firstRound: transactionParams["last-round"] + 1,
    from: algorandAddress,
    genesisHash: transactionParams["genesis-hash"],
    genesisID: transactionParams["genesis-id"],
    lastRound: transactionParams["last-round"] + 1000,
    type: TransactionType.appl,
    appArgs: [
      new Uint8Array(methodSelector),
      new Uint8Array([...assetNamePrefix, ...assetNameEncoded]),
      new Uint8Array([...assetUrlPrefix, ...assetUrlEncoded]),
      assetTotalEncoded,
      metaData,
    ],
  };

  const account = algosdk.mnemonicToSecretKey(mnemonic);
  const signedTxn = algosdk.signTransaction(txn, account.sk);
  try {
    const { data: txId } = await axios.post(
      `${purestakeBaseServer}/transactions`,
      signedTxn.blob,
      {
        headers: {
          "Content-Type": "application/x-binary",
          "X-API-key": purestakeAPIKey,
        },
      }
    );
    console.log("Transaction sent:");
    console.log(txId);
    return true;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Axios request failed", err.response?.data, err.toJSON());
    } else {
      console.error(err);
    }
    return false;
  }
};
