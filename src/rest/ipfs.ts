import axios from "axios";
import { IPFSJwt, IPFSUrlPrefix } from "../../env";
import { readAsStringAsync, EncodingType } from "expo-file-system";

export const uploadFileToPinata = async (imageUri: string) => {
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
    console.log(res.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Axios request failed", err.response?.data, err.toJSON());
    } else {
      console.error(err);
    }
  }
};

export const getFileFromPinata = async (IpfsHash: string) => {
  const response = await fetch(`${IPFSUrlPrefix}/ipfs/${IpfsHash}`);
  const data = await response.json();
  const file = `data:image;base64,${data.file}`;
  return file;
};
