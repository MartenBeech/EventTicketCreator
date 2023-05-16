import algosdk from "algosdk";
import { SignedMessage } from "../entities/SignedMessage";


export const verifyMessage = (props: SignedMessage): boolean => {
    const isValid = algosdk.verifyBytes(
      props.message,
      props.signature,
      props.publicKey
    );
    return isValid
  };