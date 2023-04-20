import axios from "axios";
import dotenv from "dotenv";
import pinataSDK from "@pinata/sdk";
import { TicketEvent } from "../entities/ticketEvent";
import { IPFSApiKey, IPFSApiSecret, IPFSJwt, IPFSUrlPrefix } from "../../env";
import {
  readAsStringAsync,
  getContentUriAsync,
  EncodingType,
} from "expo-file-system";
import { Buffer } from "buffer";
import FormData from "form-data";
import { ImagePickerAsset } from "expo-image-picker";
import RNFS from "react-native-fs";
import RNFetchBlob from "rn-fetch-blob";

// const pinata = new pinataSDK(IPFSApiKey, IPFSApiSecret);

export const pinImage = async (image: ImagePickerAsset) => {
  const options = {
    pinataMetadata: {
      name: "bearImage",
    },
  };

  const response = await fetch(
    "https://features.boats.com/boat-content/files/2022/12/2023-Pearl-72-Yacht.jpeg?w=450&h=450"
  );
  const blob = await response.formData();
  console.log(blob);
  // const stringAsync = await readAsStringAsync(image.uri);
  // const buffer = Buffer.from(stringAsync, "base64");

  const formData = new FormData();
  formData.append("file", blob);

  // try {
  //   const response = await axios.post(
  //     "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //     formData,
  //     {
  //       headers: {
  //         "Content-Type": `multipart/form-data`,
  //         Authorization: `Bearer ${IPFSJwt}`,
  //       },
  //     }
  //   );
  //   console.log("Image pinned");
  //   const cid = response.data.IpfsHash;
  //   console.log("cid: " + cid);
  //   return true;
  // } catch (err) {
  //   if (axios.isAxiosError(err)) {
  //     console.log("Axios request failed", err.response?.data, err.toJSON());
  //   } else {
  //     console.error(err);
  //   }
  //   return false;
  // }
};

export const uploadToPinata = async (image: ImagePickerAsset) => {
  console.log(JSON.stringify(await fetch(image.uri)));

  // const file = await readAsStringAsync(image.uri, {
  //   encoding: EncodingType.Base64,
  // });
  // const data = JSON.stringify({ file: file });
  // try {
  //   const res = await axios.post(
  //     "https://api.pinata.cloud/pinning/pinJSONToIPFS",
  //     data,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${IPFSJwt}`,
  //       },
  //     }
  //   );
  //   console.log(res.data);
  // } catch (err) {
  //   if (axios.isAxiosError(err)) {
  //     console.log("Axios request failed", err.response?.data, err.toJSON());
  //   } else {
  //     console.error(err);
  //   }
  // }
};

export const getFileFromPinata = async (IpfsHash: string) => {
  // const image = `data:image/jpeg;base64,${IPFSUrlPrefix}/${"QmVkTTyAtX55uMtHaxEjovp7PXRrkKxVYzujbE4PiXa9ed"}`;

  // const boat = require("../images/download.jpg");

  const response = await fetch(`${IPFSUrlPrefix}/ipfs/${IpfsHash}`);
  const data = await response.json();
  const file = `data:image;base64,${data.file}`;

  // const blob = await response.blob();
  // const newImage = new File([blob], IpfsHash, {
  //   type: blob.type,
  // });

  return file;
};
