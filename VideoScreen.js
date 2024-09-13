import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  SafeAreaView,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const screenwidth = Dimensions.get("screen").width;

const VideoScreen = ({ route, navigation }) => {
  const { videoData } = route.params; // Receiving video data

  const video = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false); // Video load status
  const [playbackStatus, setPlaybackStatus] = useState({}); // Video playback status
  const heightCal = (width, height) => {
    if (!width || !height) return 0;
    const aspectRatio = width / height;
    const calculatedHeight = screenwidth / aspectRatio;
    return calculatedHeight;
  };

  // This useEffect runs once when the component mounts and whenever `video` changes
  useEffect(() => {
    if (video) {
      setTimeout(() => {
        setIsLoaded(true); // Simulate data loading delay
      }, 500);
    } else {
      console.log("Failed to set data");
    }
  }, [video]);

  // Handle video playback status updates
  const handlePlaybackStatusUpdate = useCallback((status) => {
    setPlaybackStatus(status);
  }, []); // Memoized to avoid unnecessary re-renders

  // Clear all states when navigating back
  useFocusEffect(
    useCallback(() => {
      // On screen focus, do nothing
      return () => {
        // When screen is unfocused, clear states
        setIsLoaded(false);
        setPlaybackStatus({});
        console.log("State cleared");
      };
    }, []) // Empty dependency array, only run once on focus/unfocus
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoaded ? (
        <>
          <Video
            ref={video}
            style={{
              width: screenwidth,
              height: heightCal(videoData.videos.small.width, videoData.videos.small.height),
              backgroundColor:'black'
            }}
            source={{
              uri: videoData.videos.small.url, // Video URL from data
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate} // Updating video status
          />
        </>
      ) : (
        <Image
          style={[
            styles.tumbNailImage,
            {
              width: screenwidth,
              height: heightCal(videoData?.videos?.small?.width, videoData?.videos?.small?.height),
            },
          ]}
          contentFit="contain"
          source={videoData?.videos?.large?.thumbnail}
        />
      )}
      <View style={styles.HomeScreenVideosDetailsContainer}>
        <View>
          <Text style={styles.VideoName}>{videoData?.tags}</Text>
          <View style={{ display: "flex", flexDirection: "row",paddingHorizontal:10 }}>
            <Text style={styles.VidosTypeAndViews}>
              Views: {videoData?.views}
            </Text>
            <Text style={styles.VidosTypeAndViews}>
              Type: {videoData?.type}
            </Text>
          </View>
          <View style={styles.channelNameImageWrapper}>
            <Image
              source={videoData?.userImageURL}
              contentFit="fill"
              style={{
                width: 40,
                height: 40,
                borderRadius: 30,
                backgroundColor: "#fff",
                marginRight: 10,
              }}
            />
            <Text style={styles.ChannelName}>{videoData?.user}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#001122",
  },
  HomeScreenVideosDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 10,
  },
  VideoName: {
    color: "#aaa",
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 5,
    paddingHorizontal:10
  },
  VidosTypeAndViews: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 20,
    marginRight: 10,
  },
  channelNameImageWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth:1,
    borderTopColor:'#fff2',
    borderBottomWidth:1,
    borderBottomColor:'#fff2',
    width:screenwidth,
    paddingHorizontal:20,
    paddingVertical:20
  },
  ChannelName: {
    color: "#aaa",
    fontSize: 20,
    fontWeight: "400",
    marginLeft:5
  },
});
