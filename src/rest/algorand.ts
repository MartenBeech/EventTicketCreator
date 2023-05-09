import algosdk, {
  TransactionLike,
  secretKeyToMnemonic,
  OnApplicationComplete,
  TransactionType,
  signTransaction,
} from "algosdk";
import axios from "axios";
import { getRandomBytes } from "expo-crypto";
import { Buffer } from "buffer";
import { sha512_256 } from "js-sha512";
import { getStoreValue, setStorePair } from "../store";
import { key_address, key_mnemonic } from "../constants";
import {
  appId,
  indexerUrl,
  purestakeAPIKey,
  purestakeBaseServer,
  walletAddress,
  walletMnemonic,
} from "../../env";
import { convertStringToUint8Array } from "../service/encode";

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

  const hash = sha512_256(
    "create_asset(string,string,uint64,address,byte[32])void"
  );
  const methodSelector = Buffer.from(hash.slice(0, 8), "hex");

  const assetNameEncoded = convertStringToUint8Array(assetName);
  const assetUrlEncoded = convertStringToUint8Array(assetUrl);
  const assetTotalEncoded = algosdk.encodeUint64(assetTotal);
  const creatorAddressEncoded =
    algosdk.decodeAddress(algorandAddress).publicKey;
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
      creatorAddressEncoded,
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
    console.log("createAssetTransaction:");
    console.log(txId);
    return true;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Failed in create Asset Transaction")
      console.log("Axios request failed", err.response?.data, err.toJSON());
    } else {
      console.error(err);
    }
    return false;
  }
};

export const getAlgoTransaction = async () => {
  const transactionParams = await getTransactionParams();
  const algorandAddress = await getStoreValue(key_address);
  const mnemonic = walletMnemonic;

  const txn: TransactionLike = {
    flatFee: true,
    from: walletAddress,
    to: algorandAddress,
    fee: transactionParams["min-fee"],
    amount: 200000,
    firstRound: transactionParams["last-round"] + 1,
    lastRound: transactionParams["last-round"] + 1000,
    genesisID: transactionParams["genesis-id"],
    genesisHash: transactionParams["genesis-hash"],
  };

  const account = algosdk.mnemonicToSecretKey(mnemonic);

  const signedTxn = signTransaction(txn, account.sk);
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
    console.log(`getAlgoTransaction:`);
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

interface Asset {
  amount: number;
  "asset-id": number;
  deleted: boolean;
  "is-frozen": boolean;
  "opted-in-at-round": number;
}

const getAssetDataFromAccount = async (accountAddr: string) => {
  try {
    const response = await axios.get(
      `${indexerUrl}/accounts/${accountAddr}/assets`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const assets: Asset[] = response.data.assets;

    return assets;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Axios request failed", err.response?.data, err.toJSON());
    } else {
      console.error(err);
    }
    return [];
  }
};

export const getAssetIdsFromAccount = async (accountAddr: string) => {
  const assets = await getAssetDataFromAccount(accountAddr);
  const assetIds = assets.map((asset) => {
    return asset["asset-id"];
  });
  return assetIds;
};

export const getAssetAmountFromAccount = async (
  accountAddr: string,
  assetId: number
) => {
  const assets = await getAssetDataFromAccount(accountAddr);

  const asset = assets.find((asset) => asset["asset-id"] === assetId);
  if (asset) {
    return asset.amount;
  }
  return -1;
};

export const getAssetParams = async (assetId: number) => {
  try {
    const response = await axios.get(`${indexerUrl}/assets/${assetId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.asset.params;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Axios request failed", err.response?.data, err.toJSON());
    } else {
      console.error(err);
    }
    return "";
  }
};

export const getUrlFromAssetId = async (assetId: number): Promise<string> => {
  const assetParams = await getAssetParams(assetId);
  if (assetParams) {
    return assetParams.url;
  }
  return "";
};

export const getManagerFromAssetId = async (
  assetId: number
): Promise<string> => {
  const assetParams = await getAssetParams(assetId);
  if (assetParams) {
    return assetParams.manager;
  }
  return "";
};

export const getTotalFromAsset = async (assetId: number): Promise<number> => {
  const assetParams = await getAssetParams(assetId);
  if (assetParams) {
    return assetParams.total;
  }
  return -1;
};
