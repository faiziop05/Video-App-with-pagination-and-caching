import {
  FlatList,
  Platform,
  SafeAreaView,
  SafeAreaViewComponent,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import { Dimensions } from "react-native";
import axios from "axios";
import StylesForSafeAreaView from "./StylesForSafeAreaView";
const screenWidth = Dimensions.get("screen").width;
const URI =
  "https://pixabay.com/api/videos/?key=45879582-bc1603d7f0be54f14915d5fbc&q=";

const Home = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const heightCal = (width, height) => {
    if (!width || !height) return 0;
    const aspectRatio = width / height;
    return screenWidth / aspectRatio;
  };
  const handleKeypress = async () => {
    try {
      const res = await axios.get(`${URI}${searchText + "&"}page=${page}`);
      const data = res.data.hits;
      setVideos(data); // Append new data to existing videos
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const handleTextChange = useCallback((value) => {
    setSearchText(value);
  }, []);
  const fetchData = async () => {
    if (isLoading || !hasMore) return; // Avoid multiple fetches at the same time

    try {
      setIsLoading(true); // Set loading state
      const res = await axios.get(`${URI}${searchText + "&"}page=${page}`);
      setTimeout(() => {
        console.log("loading...");
      }, 1000); // Simulate 1-second delay

      if (res) {
        const data = res.data.hits;
        setVideos((prevVideos) => [...prevVideos, ...data]); // Append new data to existing videos
        if (data.length === 0) {
          setHasMore(false); // If no more data, stop further requests
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching data:", error);
      setHasMore(false); // Stop further requests in case of error
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleEndReached = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1); // Increase page number to load next set of data
    }
  };

  const handleVideoPress = (videoData) => {
    const additionalData = {
      comments: videoData?.comments,
      downloads: videoData?.downloads,
      duration: videoData?.duration,
      id: videoData?.id,
      likes: videoData?.likes,
      pageURL: videoData?.pageURL,
      tags: videoData?.tags,
      type: videoData?.type,
      user: videoData?.user,
      userImageURL: videoData?.userImageURL,
      views: videoData?.views,
    };
    const VideoData = videoData.videos;
    navigation.navigate("VideoScreen", { videoData });
    console.log(additionalData);
    
  };

  const RenderItem = memo(({ data }) => {
    const height = heightCal(
      data?.videos?.large?.width,
      data?.videos?.large?.height
    );

    return (
      <View style={{ marginBottom: 20 }}>
        {data?.videos?.large?.thumbnail ? (
          <>
            <Image
              style={[styles.thumbnailImage, { width: screenWidth, height }]}
              contentFit="contain"
              source={data?.videos?.large?.thumbnail}
            />
            <View style={styles.videoDetailsContainer}>
              <Image
                source={data?.userImageURL}
                contentFit="fill"
                style={styles.userImage}
              />
              <View>
                <Text style={styles.videoName}>{data?.tags}</Text>
                <Text style={styles.channelName}>{data?.user}</Text>
              </View>
            </View>
          </>
        ) : (
          <View />
        )}
      </View>
    );
  });

  return (
    <View style={{ height: "100%", backgroundColor: "#001122" }}>
      <SafeAreaView
        style={[styles.container, StylesForSafeAreaView.droidSafeArea]}
      >
        <Text style={styles.homeHeadingText}>Home</Text>
        <View
          style={{
            width: screenWidth,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TextInput
            placeholder="Search Here"
            style={styles.textInput}
            value={searchText}
            onChangeText={handleTextChange}
            //   onKeyPress={handleKeypress}
          />
          <TouchableOpacity
            style={{
              width: "20%",
              height: 40,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
            }}
            onPress={handleKeypress}
          >
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatListWrapper}>
          <FlatList
            data={videos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleVideoPress(item)}>
                <RenderItem data={item} />
              </TouchableOpacity>
            )}
            maxToRenderPerBatch={5}
            initialNumToRender={5}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoading ? <Text>Loading...</Text> : null}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: Dimensions.get("screen").height,
  },
  homeHeadingText: {
    color: "#aaa",
    fontSize: 22,
    fontWeight: "800",
  },
  textInput: {
    width: "70%",
    height: 40,
    backgroundColor: "#fff9",
    color: "#333",
    fontSize: 20,
    fontWeight: "600",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    justifyContent: "center",
  },
  flatListWrapper: {
    marginBottom: Platform.OS === "android" ? 140 : 120,
  },
  thumbnailImage: {
    width: screenWidth,
    height: 250,
  },
  videoDetailsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  videoName: {
    color: "#aaa",
    fontSize: 18,
    fontWeight: "700",
  },
  channelName: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "400",
  },
});
