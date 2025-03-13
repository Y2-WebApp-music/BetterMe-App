import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions, StyleSheet, TextInput, Alert } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import BackButton from '../../../components/Back';
import { LeftArrowIcon, PenIcon } from '../../../constants/icon';
import { router, useNavigation } from 'expo-router';
import { Image } from 'expo-image';
import ActivityModal from '../../../components/modal/ActivityModal';
import GenderModal from '../../../components/modal/GenderModal';
import FormInput from '../../../components/FormInput';
import PickDateModal from '../../../components/modal/PickDateModal';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { activity, gender, UserData } from '../../../types/user';
import PickNumberModal from '../../../components/modal/PickNumberModal';
import WarningModal from '../../../components/modal/WarningModal';
import axios from 'axios';
import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile } from 'firebase/auth';
import { auth, firebaseStorage } from '../../../components/auth/firebaseConfig';
import Modal from '../../../components/modal/Modal';
import PickImageModal from '../../../components/modal/PickImageModal';
import { getDownloadURL, ref, uploadBytes, deleteObject } from '@firebase/storage';
import ChangePasswordModal from '../../../components/modal/ChangePasswordModal';

type UserProp = {
  username:string,
  email:string,
  password:string,
  confirmPassword:string,
  birth:Date,
  gender:number,
  weight:number,
  height:number,
  activity:number,
}

const screenWidth = Dimensions.get('window').width;
import { ArrowIcon } from '../../../constants/icon';
import { useTheme } from '../../../context/themeContext';


const AccountSetting = () => {

  const { colors } = useTheme();
  const { user, setUser, signOut } = useAuth();
  const [warning, setWarning] = useState(false)
  const [editing, setEditing] = useState(false)

  const [photo, setPhoto] = useState<string | null>(null);
  const [form, setForm] = useState<UserProp>({
    username: user?.displayName || '',
    email: user?.email || '',
    password: "",
    confirmPassword: "",
    birth: new Date(user?.birth_date || 0),
    gender: user?.gender || 0,
    weight: user?.weight || 0,
    height: user?.height || 0,
    activity: user?.activity || 0,
  });

  const [imageModal, setImageModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)

  // console.log('user?.providerData[0].providerId ',user?.providerData[0].providerId);
  

  const [dateModal,setDateModal] = useState(false)
  const updateDate = (date: Date) => {
    setForm((prevForm) => ({
      ...prevForm,
      birth: date,
    }));
    setChanged(true)
  };

  const [weightModal,setWeightModal] = useState(false)
  const updateWeight = (weight: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      weight: weight,
    }));
    setChanged(true)
  };

  const [heightModal,setHeightModal] = useState(false)
  const updateHeight = (height: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      height: height,
    }));
    setChanged(true)
  };

  const [activityModal,setActivityModal] = useState(false)
  const updateActivity = (id:number) => {
    setForm((prevForm) => ({
      ...prevForm,
      activity: id,
    }));
    setActivityModal(false)
    setChanged(true)
  }

  const [genderModal,setGenderModal] = useState(false)
  const updateGender = (id:number) => {
    setForm((prevForm) => ({
      ...prevForm,
      gender: id,
    }));
    setGenderModal(false)
    setChanged(true)
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const navigation = useNavigation()

  const [changed, setChanged] = useState(false)
  const buttonClickedRef = useRef(false);

  const handleBack = () => {
    buttonClickedRef.current = true;
    router.back()
  }

  useEffect(() => {
    const beforeRemoveHandler = (e: any) => {
      const action = e.data.action;
      console.log('changed:', changed, ' buttonClickedRef.current:', buttonClickedRef.current);
  
      if (!editing) return; // If not editing, allow navigation normally
  
      if (!changed && buttonClickedRef.current) {
        buttonClickedRef.current = false;
        return;
      }
  
      e.preventDefault(); // Prevent navigation
  
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure to discard them and leave the screen?',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => {} },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setEditing(false);
              buttonClickedRef.current = false; // Reset ref to avoid multiple triggers
              navigation.dispatch(action);
            },
          },
        ]
      );
    };
  
    const unsubscribe = navigation.addListener('beforeRemove', beforeRemoveHandler);
    return () => unsubscribe(); // Always clean up listener
  
  }, [editing, changed, navigation]);

  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const uploadToFirebase = async () => {
    const metadata = {
      contentType: 'image/png',
    };

    try {
      if (photo && user) {
        console.log('Uploading to Firebase....');

        const storageRef = ref(firebaseStorage, `avatar/${user.uid}.png`);

        const resPhoto = await fetch(photo);
        const blob = await resPhoto.blob();

        const extension = photo.split('.').pop();
        const mimeType = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : 'image/png';

        const uploadTask = await uploadBytes(storageRef, blob, { ...metadata, contentType: mimeType });
        console.log('uploadTask ',uploadTask);

        const url = await getDownloadURL(uploadTask.ref);
        setDownloadURL(url);
        console.log('Upload Complete', url);

        await updateProfile(auth.currentUser || user, {
          photoURL:url,
        })

        setImageModal(false)
        return url

      }
    } catch (error) {
      console.error('Upload failed', error);
    }
  }

  const checkFireBase = async () => {

    if (!photo || !user) {
      console.log('!photo || !user || !form.meal_date ');
      return null
    }

    if (user.photoURL) {
      console.log('photoURL :',user.photoURL);
      const url = new URL(user.photoURL);
      const allowedHosts = ["lh3.googleusercontent.com"];
      if (allowedHosts.includes(url.host)) {
        console.log('Photo from google No in firebase');
        uploadToFirebase()

      } else {
        console.log('Photo is in firebase delete first');

        const desertRef = ref(firebaseStorage, `${user.photoURL}`);
        console.log(' desertRef', desertRef);

        if (desertRef) {
          console.log('=== Have in Firebase Storage ===');
          // Delete the file
          deleteObject(desertRef).then(() => {
            // File deleted successfully
          }).catch((error) => {
            console.error('Delete Failed',error);
          });
        } else {
          console.warn('=== No image in Firebase Storage ===');
        }
        uploadToFirebase()
      }
    }
  }

  const handleImageUpload = async () => {
    if (!downloadURL) {
      console.log('downloadURL is empty try to upload and get URl');
      const url = await checkFireBase();
      if (url !== undefined) {
        setDownloadURL(url)
        return url
      }
      console.warn('Fail to get Image URL')
    }
    return downloadURL;
  };

  const [updatePhoto, setUpdatePhoto] = useState(false)
  const updateUser = async(newPhotoUrl: string | null) => {
    try {
      if (user) {

        console.log('updatePhoto? ',updatePhoto);
        const url = newPhotoUrl || user.photoURL;

        console.log('updateUser : downloadURL ',url);

        await updateProfile(auth.currentUser || user, {
          displayName:form.username,
        })
        
        const response = await axios.put(`${SERVER_URL}/user/update/${user?._id}`, {
          username: form.username,
          profile_img: url,
          birth_date: form.birth,
          gender: form.gender,
          weight: form.weight,
          height: form.height,
          activity: form.activity,
        });

        setEditing(false)
        setImageModal(false)
        setUpdatePhoto(false)

        await AsyncStorage.removeItem('@user');

        const { _id, birth_date, gender, weight, height, activity, calorie_need } = response.data.user;

        const extendedUser: UserData = {
          ...user,
          displayName:form.username,
          photoURL: url || user.photoURL,
          _id,
          birth_date,
          gender,
          weight,
          height,
          activity,
          calorie_need,
        };
        setUser(extendedUser)
        await AsyncStorage.setItem('@user', JSON.stringify(extendedUser));
      }
    } catch(error) {
      console.error('Fail to update :',error)
    }
  }

  const updatePhotoUrl = async () => {
    try {
      setUpdatePhoto(true);
      const newPhotoUrl = await handleImageUpload() || user?.photoURL;
      if (newPhotoUrl) {
        await updateUser(newPhotoUrl);
      }
    } catch (error) {
      console.error('Fail to upload photo:', error);
    }
  };

  return (
      <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width:"100%",alignItems:'center' }}
        >
          <ScrollView
              className='w-[92%] h-auto'
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode='on-drag'
            >
              <View className='w-full'>
              <TouchableOpacity onPress={handleBack} className='will-change-contents w-fit flex flex-row items-center justify-start'>
                <View>
                  <LeftArrowIcon width={14} height={14} color={colors.text} />
                </View>
                <Text style={{color:colors.text}}>Back</Text>
              </TouchableOpacity>
              </View>
              <View className='mt-2'>
                <View className='flex flex-row gap-2 items-center'>
                  <View className='grow'>
                    <Text className='text-subTitle text-primary font-notoMedium'>Account Setting</Text>
                  </View>
                  <View>
                    {editing ? (
                      <TouchableOpacity activeOpacity={0.6} onPress={() => {user && updateUser(user.photoURL || null)}} className=' bg-primary flex-row gap-2 p-2 px-6 justify-center items-center rounded-full'>
                        <Text className='text-heading2 text-white font-notoMedium'>Save</Text>
                      </TouchableOpacity>
                    ):(
                      <TouchableOpacity activeOpacity={0.6} onPress={()=>{setEditing(true)}} className=' bg-primary flex-row gap-2 p-2 px-6 justify-center items-center rounded-full'>
                        <Text className='text-heading2 text-white font-notoMedium'>Edit</Text>
                        <PenIcon width={20} height={20} color={'white'}/>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
              <View className='mb-4 flex flex-row gap-2 items-center'>
                <TouchableOpacity onPress={()=>{editing && setImageModal(!imageModal)}} activeOpacity={0.9} className=' relative'>
                  <View style={styles.imageContainer} className='border border-gray'>
                    <Image
                      style={styles.image}
                      source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../assets/maleAvatar.png') : require('../../../assets/femaleAvatar.png')}
                      contentFit="cover"
                      transition={1000}
                    />
                  </View>
                  {editing ? (
                    <View className=' absolute top-1 right-1 bg-primary rounded-full p-1'>
                      <PenIcon width={16} height={16} color={'white'}/>
                    </View>
                  ):(<></>)}
                </TouchableOpacity>
                <View className='grow'>
                  {editing ? (
                    <FormInput
                      name='username'
                      value={form.username}
                      handleChange={(e:string) =>(
                        setForm({ ...form,username: e}),
                        setChanged(true)
                        )
                      }
                      keyboardType="default"
                    />
                  ):(
                    <View style={{borderColor:colors.gray}} className='w-full mt-2 flex justify-center border focus:border-primary rounded-normal'>
                      <Text
                        className='flex-1 text-text text-heading2 font-noto'
                        style={{ width:"94%", textAlignVertical: "center", paddingHorizontal:10, paddingVertical:6,color:colors.text }}
                      >
                        {form.username}
                      </Text>
                    </View>
                  )}
                  <View className='w-full' style={{marginTop: 6}}>
                    <View style={{borderColor:colors.gray}} className='w-full flex justify-center border rounded-normal'>
                      <Text
                        className='flex-1 text-detail font-noto'
                        style={{ width:"94%", textAlignVertical: "center", paddingHorizontal:10, paddingVertical:6,color:colors.subText }}
                      >
                        {form.email}
                      </Text>
                    </View>
                  </View>
                  {user?.providerData[0].providerId === 'password' &&
                    <View className='w-full' style={{marginTop: 6}}>
                      <TouchableOpacity onPress={()=>setPasswordModal(!passwordModal)} activeOpacity={0.4} style={{borderColor:colors.gray}} className='w-full flex justify-center border focus:border-primary rounded-normal'>
                        <Text
                          className='flex-1 text-body font-noto text-center'
                          style={{ width:"94%", textAlignVertical: "center", paddingHorizontal:10, paddingVertical:6, color:colors.subText }}
                        >
                          change password
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                </View>
              </View>
              {/* personal data */}
              <View className='mt-2 flex-col gap-2 items-center'>
                <View className='w-full'>
                  <Text style={{color:colors.text}} className='text-body font-noto'>personal data</Text>
                </View>
                {editing? (
                  <View className='w-[92%]'>
                    <Text style={{color:colors.subText}} className='text-detail'>date of birth</Text>
                    <TouchableOpacity
                      onPress={()=>{setDateModal(true)}}
                      className='mt-1 w-full h-[5vh] p-2 flex justify-center border border-primary rounded-normal'
                    >
                      <Text className='flex-1 text-primary text-center font-notoMedium text-heading2'>
                        {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(form.birth)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ):(
                  <View className='w-[92%]'>
                    <Text style={{color:colors.subText}} className=' text-detail'>date of birth</Text>
                    <View style={{borderColor:colors.gray}} className='w-full mt-2 flex justify-center border rounded-normal'>
                      <Text
                        className='flex-1 text-heading2 font-noto text-center'
                        style={{ width:"94%", textAlignVertical: "center", paddingHorizontal:10, paddingVertical:6, color:colors.text }}
                      >
                        {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(form.birth)}
                      </Text>
                    </View>
                  </View>
                )}

                  <View className='flex flex-row gap-2 h-max w-[92%] justify-center'>
                    <View className='w-[36%]'>
                      <Text style={{color:colors.subText}} className=' text-detail text-center'>gender</Text>
                      {editing? (
                        <TouchableOpacity
                          onPress={()=>{setGenderModal(true)}}
                          className={`border mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                          style={{borderColor:form.gender === 0?colors.gray:colors.primary}}
                        >
                          <Text style={{color:form.gender === 0?colors.subText:colors.primary}} className={` flex-1 text-center font-notoMedium text-heading2`}>
                            {form.gender ? gender.find(a => a.id === form.gender)?.gender : ''}
                          </Text>
                        </TouchableOpacity>
                      ):(
                        <View style={{borderColor:colors.gray}} className={`border mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}>
                          <Text style={{color:colors.text}} className={` flex-1 text-center font-notoMedium text-heading2`}>
                            {form.gender ? gender.find(a => a.id === form.gender)?.gender : ''}
                          </Text>
                        </View>
                      )}

                    </View>
                    <View className='w-[30%] '>
                      <Text style={{color:colors.subText}} className='text-detail text-center'>weight</Text>
                      {editing? (
                        <TouchableOpacity
                          onPress={()=>{setWeightModal(true)}}
                          className={`border mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                          style={{borderColor:form.weight === 0?colors.gray:colors.primary}}
                        >
                          <Text style={{color:form.weight === 0?colors.subText:colors.primary}} className={`flex-1 text-center font-notoMedium text-heading2`}>
                            {form.weight}
                          </Text>
                          <Text style={{color:colors.subText}} className=' -translate-y-1'>kg</Text>
                        </TouchableOpacity>
                      ):(
                        <View style={{borderColor:colors.gray}} className={`border mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}>
                          <Text style={{color:colors.text}} className={` flex-1 text-center font-notoMedium text-heading2`}>
                            {form.weight}
                          </Text>
                          <View style={{ transform: [{ translateY: -2 }]}}>
                            <Text style={{color:colors.subText}}>kg</Text>
                          </View>
                        </View>
                      )}
                    </View>

                    <View className='w-[30%] '>
                      <Text style={{color:colors.subText}} className=' text-detail text-center'>height</Text>
                      {editing? (
                        <TouchableOpacity
                          onPress={()=>{setHeightModal(true)}}
                          className={`border mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                          style={{borderColor:form.height === 0?colors.gray:colors.primary}}
                        >
                          <Text style={{color:form.height === 0?colors.subText:colors.primary}} className={` flex-1 text-center font-notoMedium text-heading2`}>
                            {form.height}
                          </Text>
                          <Text style={{color:colors.subText}} className=' -translate-y-1'>cm</Text>
                        </TouchableOpacity>
                      ):(
                        <View style={{borderColor:colors.gray}} className={`border mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}>
                          <Text style={{color:colors.text}} className={` flex-1 text-center font-notoMedium text-heading2`}>
                            {form.height}
                          </Text>
                          <View style={{ transform: [{ translateY: -2 }]}}>
                            <Text style={{color:colors.subText}}>cm</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                <View className='w-[92%]'>
                  <Text style={{color:colors.subText}} className='text-detail'>your activity</Text>
                  {editing?(
                    <TouchableOpacity
                      onPress={()=>{setActivityModal(true)}}
                      className={`mt-1 w-fit p-2 flex flex-row justify-center items-end border rounded-normal`}
                      style={{borderColor:form.activity===0 ?colors.gray:colors.primary}}
                    >
                      <Text style={{color:form.activity===0 ? colors.subText: colors.primary}} className={`flex-1  text-center font-notoMedium text-heading2`}>
                        {form.activity ? activity.find(a => a.id === form.activity)?.title : 'Select an Activity'}
                      </Text>
                    </TouchableOpacity>
                  ):(
                    <View
                      className={` mt-1 w-fit p-2 flex flex-row justify-center items-end border rounded-normal`}
                      style={{borderColor:colors.gray}}
                    >
                      <Text style={{color:colors.text}} className={`flex-1  text-center font-notoMedium text-heading2`}>
                        {form.activity ? activity.find(a => a.id === form.activity)?.title : 'Select an Activity'}
                      </Text>
                    </View>
                  )}
                  <Text style={{color:colors.subText}} className=' text-detail pl-2 mt-1'>
                    {form.activity ? activity.find(a => a.id === form.activity)?.description : ''}
                  </Text>
                </View>

                <View className='w-full mt-2'>
                  <Text style={{color:colors.subText}} className='text-xs font-noto'>We collect gender, weight, height, and activity level to calculate your daily caloric needs accurately.</Text>
                  <View className="items-start ml-6 mt-3">
                    <View style={{backgroundColor:colors.white, borderColor:colors.gray}} className="flex-col p-1 px-4 rounded-normal border items-center justify-center">
                      <Text style={{color:colors.subText}} className="text-detail font-noto">Your daily calorie needs</Text>
                      <View className="flex-row items-baseline">
                        <Text className="text-subTitle font-notoMedium text-green">{Math.floor(user?.calorie_need || 0)}</Text>
                        <Text className="text-detail font-noto text-green ml-1">cal</Text>
                      </View>
                    </View>
                  </View>
                </View>


              </View>
              {!editing && 
              <>
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.darkGray,
                    marginVertical: 20,
                    width: '100%',
                  }}
                />
                <View className=' pb-20'>
                  <TouchableOpacity
                    onPress={handleSignOut}
                    className="flex flex-row items-center justify-center rounded-normal border p-1 px-4 bg-red-500"
                    style={{borderColor:colors.gray}}
                  >
                    <Text style={{color:colors.subText}} className="text-heading2 font-notoMedium">Sign Out</Text>
                  </TouchableOpacity>
                </View>
              </>}
          </ScrollView>

          <ChangePasswordModal isOpen={passwordModal} setIsOpen={setPasswordModal}/>
          <PickImageModal isOpen={imageModal} setIsOpen={setImageModal} photo={photo} setPhoto={setPhoto} update={updatePhotoUrl}/>
          <WarningModal title={'Something had changed'} detail={'Please save before leave page'} isOpen={warning} setIsOpen={setWarning}/>
          <ActivityModal userActivity={form.activity} update={updateActivity} activityModal={activityModal} setActivityModal={setActivityModal}/>
          <GenderModal userGender={form.gender} update={updateGender} genderModal={genderModal} setGenderModal={setGenderModal}/>
          <PickNumberModal setNumber={updateWeight} isOpen={weightModal} setIsOpen={setWeightModal} title={'Select Weight'} unit={'kg'} min={28} max={150} start={40} dotMax={10} />
          <PickNumberModal setNumber={updateHeight} isOpen={heightModal} setIsOpen={setHeightModal} title={'Select Height'} unit={'cm'} min={126} max={210} start={150} dotMax={10} />
          {Platform.OS === "android" ?(
            dateModal &&
              <RNDateTimePicker
                display="spinner"
                mode="date"
                value={form.birth}
                minimumDate={new Date('1950, 0, 1')}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setDateModal(!dateModal);
                    updateDate(selectedDate);
                  }
                }}
                style={{}}
                locale="en-Gn"
                themeVariant='light'
              />
            ):(
              <PickDateModal value={form.birth} isOpen={dateModal} setIsOpen={setDateModal} setDate={updateDate} maximumDate={true} minimumDate={false}/>
            )}
        </KeyboardAvoidingView>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: (screenWidth * 0.3) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    width: "100%",
  },
});

export default AccountSetting