import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { Button } from "./Button";

interface Props {
  setImageUri: React.Dispatch<React.SetStateAction<string>>;
}

export const ImageUploader = (props: Props) => {
  const selectImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
    });
    if (result && result.assets) {
      const asset = result.assets[0];
      props.setImageUri(asset.uri);
    }
  };

  return <Button onPress={() => selectImage()} title="Upload Image *" />;
};
