import React, { useState } from "react";
import { StyleSheet, Button, View, Image } from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";

interface Props {}

const GET_IMAGES = gql`
  query GetImages {
    uploads {
      filename
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: Upload!) {
    singleUpload(file: $file)
  }
`;

const Landing = ({}: Props) => {
  const [image, setImage] = (useState < string) | (undefined > undefined);
  const { data, loading } = useQuery(GET_IMAGES, {
    fetchPolicy: "cache-and-network",
  });
  const getFileName = (image: string) => {
    return image.substring(image.lastIndexOf("/") + 1);
  };
  let file;
  if (image) {
    file = new ReactNativeFile({
      uri: image,
      name: "a.jpg",
      type: "image/jpeg",
    });
  }
  const [upload, { loading: uploding }] = useMutation(UPLOAD_IMAGE, {
    variables: {
      file,
    },
  });
  const getImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (loading || uploding) {
    return <View />;
  }
  if (data) {
    console.log(data);
  }
  return (
    <View style={styles.container}>
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            height: 100,
            width: 100,
          }}
        />
      )}
      <Button title="Select Image" onPress={getImages} />
      <Button title="Upload Image" onPress={() => upload()} />
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
