import axios from "axios";
import dotenv from "dotenv";
// import pinataSDK from "@pinata/sdk";
import { TicketEvent } from "../entities/ticketEvent";
import { IPFSApiKey, IPFSApiSecret, IPFSJwt } from "../../env";
import { readAsStringAsync } from "expo-file-system";
import { Buffer } from "buffer";
import FormData from "form-data";

// const pinata = new pinataSDK(IPFSApiKey, IPFSApiSecret);

export const pinImage = async (imagePath: string) => {
  const options = {
    pinataMetadata: {
      name: "bearImage",
    },
  };

  const fileStreamData = await readAsStringAsync(imagePath, {
    encoding: "base64",
  });
  // const bufferArray = new Uint8Array(Buffer.from(fileStreamData, "base64"));

  const data = new FormData();
  data.append("file", fileStreamData, "FILENAME.png");

  try {
    const response = await axios.post(
      `https://api.pinata.cloud/pinning/pinFileToIPFS`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${IPFSJwt}`,
        },
      }
    );
    console.log("Image pinned");
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

export const uploadToPinata = async (sourceUrl: string) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const data = new FormData();
  data.append("file", readAsStringAsync(sourceUrl));

  try {
    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${IPFSJwt}`,
      },
    });
    console.log(res.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Axios request failed", err.response?.data, err.toJSON());
    } else {
      console.error(err);
    }
  }
};
