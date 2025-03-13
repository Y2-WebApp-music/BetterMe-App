import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, TextInput, FlatList } from 'react-native';
import { AddIcon, GalleryIcon, FoodIcon, CloseIcon } from '../constants/icon';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import BackButton from '../components/Back';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/authContext';
import AddTagBottomModal from '../components/modal/AddTagBottomModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet/src';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { useRoute } from "@react-navigation/native";
import { router } from 'expo-router';
import { useTheme } from '../context/themeContext';

const screenWidth = Dimensions.get('window').width;


const PostCreate = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [photos, setPhotos] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<{ id: number; text: string }[]>([]); 
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 4],
      quality: 1,
      selectionLimit: 10,
      allowsMultipleSelection: true,
      allowsEditing: false,
      orderedSelection: true,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index)); 
  };


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleOpenPress = () => {
    bottomSheetModalRef.current?.present();
  };

  
  const [form, setForm] = useState(() => ({
    post_id: Date.now().toString(),
    date: new Date().toISOString(),
    content: '',
    tag: [],
    like: 0,
    comment: 0,
    photo: [],
  }));


  const handlePost = async () => {
    if (content.trim() !== '') {
      if (selectedTags.length === 0) {
        console.log('At least one tag is required');
        setWarning(true);
        setErr('At least one tag is required');
        return;
      }
  
      let counter = 3;
      setCountdown(counter);
      setIsConfirming(true);
  
      const interval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);
  
        if (counter <= 0) {
          clearInterval(interval);
          postToDB();
        }
      }, 1000);
  
      setCountdownInterval(interval);
    } else {
      setErr('Post content is empty');
      setWarning(true);
      console.log('Post content is empty');
    }
  };

  const postToDB = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/community/create`, { //ช่วยดูให้หน่อยคับ
        content: form.content,
        date: form.date,
        tags: form.tag,
        photos: form.photo,
      });
  
      const data = response.data;
      console.log("=============== ::: Post Data ::: ===============\n", data);
  
      if (data.message === "Post content is empty") {
        return setErr("Post content is empty");
      }
  
      router.replace(`community/${data.post._id}`); //ช่วยดูให่หน่อยคับ
  
    } catch (error) {
      console.error("Can not create post:", error);
    }
  };
  


  const getPostDetail = async (postId: string) => {  //ลองพิมพ์ล้อจากของgoalแต่ยังไม่ค่อยเข้าใจเท่าไหร่
    if (!postId || postId === "blank") {
      return;
    }
    try {
      const response = await axios.get(`${SERVER_URL}/post/${postId}`);
      const data = response.data; 
  
      console.log('getPostDetail response \n', response.data);
  
      if (data.message === "Post not found") {
        return;
      }
  
      setForm({
        post_id: data.post_id,
        date: data.date,
        content: data.content,
        tag: data.tag,
        like: data.like,
        comment: data.comment,
        photo: data.photo || [],
      });
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
        <View className="w-[92%]">
          <View className="max-w-[14vw] my-4">
            <BackButton goto={'/menu'} />
          </View>
        </View>

        <ScrollView className="w-[92%] h-auto " contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop: 6 }} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
          <View className="flex flex-row items-center">
            <View className="grow">
              <Text className="text-subTitle text-primary font-noto">Create post</Text>
            </View>
            <View>
              <TouchableOpacity className="bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full" onPress={handlePost}>
                <Text className="text-heading2 text-white font-notoMedium ">Post</Text>
                <AddIcon width={24} height={24} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-row items-start mt-3">
            <Image
              style={styles.image}
              source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../assets/maleAvatar.png') : require('../assets/femaleAvatar.png')}
              contentFit="cover"
              transition={1000}
            />
            <TextInput className="w-[85%] text-body " placeholder="write something..." multiline={true}  value={content} onChangeText={setContent}/>
          </View>


          <View className="flex-row flex-wrap mt-2">
            {selectedTags.map((tag) => (
              <View key={tag.id} className="flex-row bg-primary gap-2 p-1 px-4 justify-start items-center rounded-full mr-2 mb-2">
                <Text className="text-white font-notoMedium">{tag.text}</Text>
                <TouchableOpacity onPress={() => setSelectedTags(selectedTags.filter(t => t.id !== tag.id))}>
                  <CloseIcon width={20} height={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          {photos.length > 0 && (
            <FlatList
              data={photos}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item }} style={styles.selectedImage} contentFit="cover" />
                  <TouchableOpacity style={styles.deleteButton} onPress={() => removePhoto(index)}>
                    <CloseIcon width={20} height={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </ScrollView>
        <View className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray bg-Background">
            <View className="flex-row gap-4">
              <TouchableOpacity className="flex flex-row items-center gap-1" onPress={pickImage}>
                <GalleryIcon width={24} height={24} color={colors.nonFocus} />
                <Text className="text-subText  ">Add photo</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex flex-row items-center gap-1" onPress={handleOpenPress}>
                <FoodIcon width={24} height={24} color={colors.nonFocus}  />
                <Text className="text-subText">Add tag</Text> 
              </TouchableOpacity>
            </View>
          </View>
      </KeyboardAvoidingView>
      <AddTagBottomModal ref={bottomSheetModalRef} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    width: screenWidth * 0.11,
    height: screenWidth * 0.11,
    alignContent: 'center',
    borderRadius: 40,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    
  },
  selectedImage: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostCreate;
function setWarning(arg0: boolean) {
  throw new Error('Function not implemented.');
}

function setErr(arg0: string) {
  throw new Error('Function not implemented.');
}

function setCountdown(counter: number) {
  throw new Error('Function not implemented.');
}

function setIsConfirming(arg0: boolean) {
  throw new Error('Function not implemented.');
}

function setCountdownInterval(interval: NodeJS.Timeout) {
  throw new Error('Function not implemented.');
}