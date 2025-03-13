
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, TextInput, FlatList } from 'react-native';
import { AddIcon, GalleryIcon, FoodIcon, CloseIcon } from '../../../constants/icon';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheetModal } from '@gorhom/bottom-sheet/src';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { useRoute } from "@react-navigation/native";
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/authContext';
import { useTheme } from '../../../context/themeContext';
import BackButton from '../../../components/Back';
import AddTagBottomModal from '../../../components/modal/AddTagBottomModal';
import WarningModal from '../../../components/modal/WarningModal';

const screenWidth = Dimensions.get('window').width;


const PostCreate = () => {

  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { colors } = useTheme();


  const [form, setForm] = useState(() => ({
    post_id: '',
    date: new Date().toISOString(),
    content: '',
    tag: [],
    like: 0,
    comment: 0,
    photo: [],
  }));
  const [photos, setPhotos] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<{ id: number; text: string }[]>([]);

  const [err, setErr] = useState('')
  const [warning, setWarning] = useState(false)

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


  const handlePost = async () => {
    // console.log('handlePost');
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
          updatePost();
        }
      }, 1000);
  
      setCountdownInterval(interval);
    } else {
      setErr('Post content is empty');
      setWarning(true);
      console.log('Post content is empty');
    }
  };

  const updatePost = async () => {
    try {
      const response = await axios.put(`${SERVER_URL}/community/post/update/${form.post_id}`, {
        content: form.content,
        image_url: form.photo,
        tag: form.tag,
        post_date: form.date,
        create_by: user?._id,
        like:form.like,
        Comment:form.comment
      });
  
      const data = response.data;

      if (data.message === "Post not found") {
        console.error(":::Post not found:::");
      }
      if (data.message === "Update post success") {
        return router.back();
      }

    } catch (error) {
      console.error("Can not create post:", error);
    }
  };
  
  const getPostDetail = async (postId: string) => {
    try {
      const response = await axios.get(`${SERVER_URL}/community/post/${postId}`);
      const data = response.data;
  
      console.log('getPostDetail response \n', response.data);
  
      if (data.message === "Post not found") {
        return;
      }
  
      setForm({
        post_id:data.post_id,
        date:data.date,
        content:data.content,
        tag: data.tag,
        like: data.like,
        comment: data.comment,
        photo: data.photo || [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    if (id !== "blank") {
      console.log('get post',id);
      getPostDetail(id.toString())
    } else {
      console.log('create post id',id);
    }
  },[id])


  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
        <View className="w-[92%]">
          <View className="max-w-[14vw] my-4">
            <BackButton goto={'/menu'} />
          </View>
        </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
        <View className="w-full h-full items-center">

        <ScrollView className="w-[92%] h-auto " contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop: 6 }} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
          <View className="flex flex-row items-center">
            <View className="grow">
              <Text className="text-subTitle text-primary font-noto">Create post</Text>
            </View>
            <View>
              <TouchableOpacity onPress={handlePost} className="bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full">
                <Text className="text-heading2 text-white font-notoMedium ">Post</Text>
                <AddIcon width={24} height={24} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-row items-start mt-3 gap-2">
            <Image
              style={styles.image}
              source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../assets/maleAvatar.png') : require('../../../assets/femaleAvatar.png')}
              contentFit="cover"
              transition={1000}
            />
            <TextInput style={{color:colors.text}} className="w-[85%] text-body " placeholder="write something..." multiline={true}  value={content} onChangeText={setContent}/>
          </View>


          <View className="flex-row flex-wrap mt-2">
            {selectedTags.map((tag) => (
              <View key={tag.id} className="flex-row bg-primary gap-2 p-1 px-2 justify-start items-center rounded-normal mr-2 mb-2">
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
                  <TouchableOpacity style={[styles.deleteButton,{backgroundColor:colors.primary}]} onPress={() => removePhoto(index)}>
                    <CloseIcon width={26} height={26} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </ScrollView>
        <View style={{backgroundColor:colors.background, borderColor:colors.gray}} className="absolute bottom-0 left-0 right-0 p-4 border-t ">
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
        </View>
      </KeyboardAvoidingView>
      <AddTagBottomModal ref={bottomSheetModalRef} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <WarningModal
        title={'Please complete detail'}
        detail={err}
        isOpen={warning}
        setIsOpen={()=>setWarning(!warning)}
      />
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
    width: 28,
    height: 28,
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