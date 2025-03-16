
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, TextInput, FlatList } from 'react-native';
import { AddIcon, GalleryIcon, FoodIcon, CloseIcon, PenIcon } from '../../../constants/icon';
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
import { TagCommunity } from '../../../types/community';
import uuid from 'react-native-uuid';
import { firebaseStorage } from '../../../components/auth/firebaseConfig';
import { deleteObject, getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { format } from 'date-fns';
import AntDesign from '@expo/vector-icons/AntDesign';

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
    if (photos.length >= 10) {
      setErr('There are more than 10 photos, please remove some.')
      setWarning(true)
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [4, 4],
      quality: 1,
      selectionLimit: 10 - photos.length,
      allowsMultipleSelection: true,
      allowsEditing: false,
      orderedSelection: true,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const [deleteList, setDeleteList] = useState<string[]>([])
  const removePhoto = (index: number) => {
    setDeleteList((prev) => [...prev, photos[index]]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleOpenPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const [creating, setCreating] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const deleteInFirebase = async (photos: string[]) => {
    try {
      for (const photo of photos) {
        const desertRef = ref(firebaseStorage, photo)
  
        console.log('Deleting from Firebase:')
        await deleteObject(desertRef)
        console.log('Deleted successfully:')
      }
    } catch (error) {
      console.error('Delete Failed', error)
    }
  }

  const uploadToFirebase = async (photos: string[]) => {
    if (photos.length === 0 || !user) {
      console.log("No photos selected or user not found");
      return [];
    }
  
    console.log("Uploading to Firebase...");
    setUploadProgress(0);
  
    try {
      const urls: string[] = [];
      const postID = uuid.v4();
  
      for (const [index, photo] of photos.entries()) {
        const resPhoto = await fetch(photo);
        const blob = await resPhoto.blob();
  
        const extension = photo.split(".").pop();
        const mimeType =
          extension === "jpg" || extension === "jpeg" ? "image/jpeg" : "image/png";
  
        const storageRef = ref(
          firebaseStorage,
          `post/${user.uid}/${postID}/${format(new Date(), "dd-MM-yyyy-H-m")}-${index}.${extension}`
        );
  
        const uploadTask = await uploadBytes(storageRef, blob, { contentType: mimeType });
        const url = await getDownloadURL(uploadTask.ref);
  
        urls.push(url);
        console.log(`Image ${index + 1} uploaded:`, url);
  
        setUploadProgress((prev) => prev + 1);
      }
  
      console.log("All images uploaded:", urls.length);
      return urls;
    } catch (error) {
      console.error("Upload failed", error);
      return [];
    }
  };
  
  const handleNewImage = async () => {
    const allowedHosts = "firebasestorage";
  
    const indexedPhotos = photos.map((item, index) => ({ url: item, index }));
  
    const newImage = indexedPhotos.filter((item) => !item.url.includes(allowedHosts));
    const oldImage = indexedPhotos.filter((item) => item.url.includes(allowedHosts));

    const deleteItem = deleteList.filter((item) => item.includes(allowedHosts))
    console.log('deleteItem ',deleteItem.length);
    await deleteInFirebase(deleteItem)
    
    console.log('newImage ',newImage.length);
    const newUrls = await uploadToFirebase(newImage.map((item) => item.url));
  
    const mergedImages = [...newImage, ...oldImage].map((item, i) => ({
      index: item.index,
      url: newUrls[i] ?? item.url,
    }));
  
    mergedImages.sort((a, b) => a.index - b.index);
  
    return mergedImages.map((item) => item.url);
  };
  
  const updatePost = async () => {
    try {
      const url = await handleNewImage();
      let tagList = selectedTags.map((item)=> item.id) || []
  
      const response = await axios.put(`${SERVER_URL}/community/post/update/${form.post_id}`, {
        content: content,
        image_url: url,
        tag: tagList,
      });
  
      const data = response.data;
  
      if (data.message === "Post not found") {
        console.error(":::Post not found:::");
      } else if (data.message === "Update post success") {
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
        photo: data.image || [],
      });

      setContent(data.content)
      const Tag = TagCommunity.filter((item) => data.tag.includes(item.id));
      setSelectedTags(Tag)
      setPhotos(data.image)
      
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

  const handlePost = async () => {
    if (content.trim() !== '') {

      setCreating(true)
      await updatePost();
      
    } else {
      setErr('Post content is empty');
      setWarning(true);
      console.log('Post content is empty');
    }
  };

  const blurhash = 'UAQ0UC4-0K00TOEdxWjE0WS[xr-q02tlo|S1';

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
      {!creating?(
        <>
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
              <Text className="text-subTitle text-primary font-noto">Edit post</Text>
            </View>
            <View>
              <TouchableOpacity onPress={handlePost} className="bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full">
                <Text className="text-heading3 text-white font-notoMedium ">Update</Text>
                <PenIcon width={20} height={20} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-row items-start mt-3 gap-2">
            <Image
              style={styles.image}
              source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../assets/maleAvatar.png') : require('../../../assets/femaleAvatar.png')}
              contentFit="cover"
              placeholder={{blurhash}}
              transition={300}
            />
            <TextInput style={{color:colors.text}} className="w-[85%] text-heading3 font-noto" placeholder="write something..." multiline={true}  value={content} onChangeText={setContent}/>
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
                  <Image
                    source={{ uri: item }}
                    style={styles.selectedImage}
                    contentFit="cover"
                    placeholder={{blurhash}}
                    transition={300}
                  />
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
                <AntDesign name="tag" size={24} color={colors.nonFocus} />
                <Text className="text-subText">Add tag</Text>
              </TouchableOpacity>
            </View>
        </View>
        </View>
      </KeyboardAvoidingView>
      </>
      ):(
        <View className='flex-1 justify-center items-center'>
          <Text className='text-subTitle text-primary animate-pulse'>Creating...</Text>
          <View className='mt-2'>
            {(uploadProgress > 0)?(
              uploadProgress < 10 ? (
                <Text style={{color:colors.subText}} className='text-body'>upload image {uploadProgress} done</Text>
              ):(
                <Text style={{color:colors.subText}} className='text-body'>updating...</Text>
              )
            ):(
              <Text style={{color:colors.subText}} className='text-body'>uploading new image</Text>
            )}
          </View>
        </View>
      )}
      <AddTagBottomModal ref={bottomSheetModalRef} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <WarningModal
        title={'Warning'}
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
    width: 29,
    height: 29,
    borderRadius: 999,
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