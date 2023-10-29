import axios from "axios";
import { IPFSJwt, IPFSUrlPrefix } from "../../env";
import { readAsStringAsync, EncodingType } from "expo-file-system";
import { TicketEvent } from "../entities/ticketEvent";

export const uploadFileToPinata = async (imageUri: string): Promise<string> => {
  const file = await readAsStringAsync(imageUri, {
    encoding: EncodingType.Base64,
  });
  const data = JSON.stringify({ file: file });
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${IPFSJwt}`,
        },
      }
    );
    return res.data.IpfsHash;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(
        "Axios request failed in uploading file to ipfs",
        err.response?.data,
        err.toJSON()
      );
    } else {
      console.error(err);
    }
    return "";
  }
};

export const getFileFromPinata = async (IpfsHash: string) => {
  const response = await fetch(`${IPFSUrlPrefix}ipfs/${IpfsHash}`);
  const data = await response.json();
  const file = `data:image;base64,${data.file}`;
  return file;
};

export const uploadTicketEventToPinata = async (
  ticketEvent: TicketEvent
): Promise<string> => {
  const data = JSON.stringify(ticketEvent);
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${IPFSJwt}`,
        },
      }
    );
    return res.data.IpfsHash;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Axios request failed", err.response?.data, err.toJSON());
    } else {
      console.error(err);
    }
    return "";
  }
};

export const getIPFSEventData = async (url: string) => {
  let returnData: TicketEvent = {
    creatorName: "",
    description: "",
    endDate: "",
    imageUrl: "",
    location: "",
    price: 0,
    startDate: "",
    title: "",
  };
  try {
    const response = await axios.get(`${IPFSUrlPrefix}${url}`);
    const data = response.data;
    if (data) {
      returnData = data;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(
        "Axios request failed for ipfs",
        err.response?.data,
        err.toJSON()
      );
    } else {
      console.error(err);
    }
  }
  return returnData;
};
