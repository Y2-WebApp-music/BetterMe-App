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
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
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


const AccountSetting = () => {

  const { user, setUser } = useAuth();
  const { signOut } = useAuth();
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
  const updatePhotoUrl = async () => {
    handleImageUpload()
  }

  const uploadToFirebase = async () => {
    const metadata = {
      contentType: 'image/png',
    };

    if (!photo || !user) {
      console.log('!photo || !user || !form.meal_date ');
      return null
    }

    console.log('uploadToFirebase()');
    console.log('photoURL', user.photoURL);

    const desertRef = ref(firebaseStorage, `${user.photoURL}`);
    console.log(' desertRef', desertRef);

    if (desertRef) {
      console.log('=== Have in Firebase Storage ===');
    } else {
      console.warn('=== No image in Firebase Storage ===');
    }

    // try {
    //   if (photo && user) {
    //     console.log('Uploading to Firebase....');

    //     const storageRef = ref(firebaseStorage, `avatar/${user.uid}.png`);

    //     const resPhoto = await fetch(photo);
    //     const blob = await resPhoto.blob();

    //     const extension = photo.split('.').pop();
    //     const mimeType = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : 'image/png';

    //     const uploadTask = await uploadBytes(storageRef, blob, { ...metadata, contentType: mimeType });
    //     console.log('uploadTask ',uploadTask);

    //     const url = await getDownloadURL(uploadTask.ref);
    //     setDownloadURL(url);
    //     console.log('Upload Complete', url);
    //     return url

    //   }
    // } catch (error) {
    //   console.error('Upload failed', error);
    // }
  }

  const handleImageUpload = async () => {
    if (!downloadURL) {
      console.log('downloadURL is empty try to upload and get URl');
      const url = await uploadToFirebase();
      if (url !== undefined) {
        setDownloadURL(url)
        return url
      }
      console.error('Fail to get Image URL')
    }
    return downloadURL;
  };

  const updateUser = async() => {
    try {
      if (user) {

        await updateProfile(auth.currentUser || user, {
          displayName:form.username,
        })
        
        const response = await axios.put(`${SERVER_URL}/user/update/${user?._id}`, {
          username: form.username,
          // profile_img: downloadURL,
          birth_date: form.birth,
          gender: form.gender,
          weight: form.weight,
          height: form.height,
          activity: form.activity,
        });

        setEditing(false)

        await AsyncStorage.removeItem('@user');

        const { _id, birth_date, gender, weight, height, activity, calorie_need } = response.data.user;

        const extendedUser: UserData = {
          ...user,
          displayName:form.username,
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

  const [imageModal, setImageModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(true)

  return (
      <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
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
                  <LeftArrowIcon width={14} height={14} color={"black"} />
                </View>
                <Text>Back</Text>
              </TouchableOpacity>
              </View>
              <View className='mt-2'>
                <View className='flex flex-row gap-2 items-center'>
                  <View className='grow'>
                    <Text className='text-subTitle text-primary font-notoMedium'>Account Setting</Text>
                  </View>
                  <View>
                    {editing ? (
                      <TouchableOpacity activeOpacity={0.6} onPress={updateUser} className=' bg-primary flex-row gap-2 p-2 px-6 justify-center items-center rounded-full'>
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
                <TouchableOpacity onPress={()=>setImageModal(!imageModal)} activeOpacity={0.7} className=' relative'>
                  <View style={styles.imageContainer} className='border border-gray'>
                    <Image
                      style={styles.image}
                      source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../assets/maleAvatar.png') : require('../../../assets/femaleAvatar.png')}
                      contentFit="cover"
                      transition={1000}
                    />
                  </View>
                  <View className=' absolute top-1 right-1 bg-primary rounded-full p-1'>
                    <PenIcon width={16} height={16} color={'white'}/>
                  </View>
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
                    <View className='w-full mt-2 flex justify-center border border-gray focus:border-primary rounded-normal'>
                      <Text
                        className='flex-1 text-text text-heading2 font-noto'
                        style={{ width:"94%", textAlignVertical: "center", paddingHorizontal:10, paddingVertical:6, }}
                      >
                        {form.username}
                      </Text>
                    </View>
                  )}
                  <View className='w-full' style={{marginTop: 6}}>
                    {/* <View style={{marginBottom: 4}}>
                      <Text className='text-subText text-detail'>email</Text>
                    </View> */}
                    <View className='w-full flex justify-center border border-gray focus:border-primary rounded-normal'>
                      <Text
                        className='flex-1 text-subText text-body font-noto'
                        style={{ width:"94%", textAlignVertical: "center", paddingHorizontal:10, paddingVertical:6, }}
                      >
                        {form.email}
                      </Text>
                    </View>
                  </View>
                  <View className='w-full' style={{marginTop: 6}}>
                    <TouchableOpacity onPress={()=>setPasswordModal(!passwordModal)} activeOpacity={0.4} className='w-full flex justify-center border border-gray focus:border-primary rounded-normal'>
                      <Text
                        className='flex-1 text-subText text-body font-noto text-center'
                        style={{ width:"94%", textAlignVertical: "center", paddingHorizontal:10, paddingVertical:6, }}
                      >
                        change password
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* personal data */}
              <View className='mt-2 flex-col gap-2 items-center'>
                <View className='w-full'>
                  <Text className='text-body font-noto'>personal data</Text>
                </View>
                {editing? (
                  <View className='w-[92%]'>
                    <Text className='text-subText text-detail'>date of birth</Text>
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
                    <Text className='text-subText text-detail'>date of birth</Text>
                    <View className='w-full mt-2 flex justify-center border border-gray rounded-normal'>
                      <Text
                        className='flex-1 text-text text-heading2 font-noto text-center'
                        style={{ width:"94%", textAlignVertical: "center", paddingHorizontal:10, paddingVertical:6, }}
                      >
                        {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(form.birth)}
                      </Text>
                    </View>
                  </View>
                )}

                  <View className='flex flex-row gap-2 h-max w-[92%] justify-center'>
                    <View className='w-[36%]'>
                      <Text className='text-subText text-detail text-center'>gender</Text>
                      {editing? (
                        <TouchableOpacity
                          onPress={()=>{setGenderModal(true)}}
                          className={`border ${form.gender === 0? 'border-gray':'border-primary'} mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                        >
                          <Text className={`${form.gender === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                            {form.gender ? gender.find(a => a.id === form.gender)?.gender : ''}
                          </Text>
                        </TouchableOpacity>
                      ):(
                        <View className={`border border-gray mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}>
                          <Text className={`text-text flex-1 text-center font-notoMedium text-heading2`}>
                            {form.gender ? gender.find(a => a.id === form.gender)?.gender : ''}
                          </Text>
                        </View>
                      )}

                    </View>
                    <View className='w-[30%] '>
                      <Text className='text-subText text-detail text-center'>weight</Text>
                      {editing? (
                        <TouchableOpacity
                          onPress={()=>{setWeightModal(true)}}
                          className={`border ${form.weight === 0? 'border-gray':'border-primary'} mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                        >
                          <Text className={`${form.weight === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                            {form.weight}
                          </Text>
                          <Text className='text-subText -translate-y-1'>kg</Text>
                        </TouchableOpacity>
                      ):(
                        <View className={`border border-gray mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}>
                          <Text className={`text-text flex-1 text-center font-notoMedium text-heading2`}>
                            {form.weight}
                          </Text>
                          <View style={{ transform: [{ translateY: -2 }]}}>
                            <Text className='text-subText'>kg</Text>
                          </View>
                        </View>
                      )}
                    </View>

                    <View className='w-[30%] '>
                      <Text className='text-subText text-detail text-center'>height</Text>
                      {editing? (
                        <TouchableOpacity
                          onPress={()=>{setHeightModal(true)}}
                          className={`border ${form.height === 0? 'border-gray':'border-primary'} mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                        >
                          <Text className={`${form.height === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                            {form.height}
                          </Text>
                          <Text className='text-subText -translate-y-1'>cm</Text>
                        </TouchableOpacity>
                      ):(
                        <View className={`border border-gray mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}>
                          <Text className={`text-text flex-1 text-center font-notoMedium text-heading2`}>
                            {form.height}
                          </Text>
                          <View style={{ transform: [{ translateY: -2 }]}}>
                            <Text className='text-subText'>cm</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                <View className='w-[92%]'>
                  <Text className='text-subText text-detail'>your activity</Text>
                  {editing?(
                    <TouchableOpacity
                      onPress={()=>{setActivityModal(true)}}
                      className={`${form.activity===0 ? 'border-gray' : 'border-primary'} mt-1 w-fit p-2 flex flex-row justify-center items-end border rounded-normal`}
                    >
                      <Text className={`${form.activity===0 ? 'text-subText' : 'text-primary'} flex-1  text-center font-notoMedium text-heading2`}>
                        {form.activity ? activity.find(a => a.id === form.activity)?.title : 'Select an Activity'}
                      </Text>
                    </TouchableOpacity>
                  ):(
                    <View
                      className={`border-gray mt-1 w-fit p-2 flex flex-row justify-center items-end border rounded-normal`}
                    >
                      <Text className={` text-text flex-1  text-center font-notoMedium text-heading2`}>
                        {form.activity ? activity.find(a => a.id === form.activity)?.title : 'Select an Activity'}
                      </Text>
                    </View>
                  )}
                  <Text className='text-subText text-detail pl-2 mt-1'>
                    {form.activity ? activity.find(a => a.id === form.activity)?.description : ''}
                  </Text>
                </View>

                <View className='w-full mt-2'>
                  <Text className='text-xs font-noto text-subText'>We collect gender, weight, height, and activity level to calculate your daily caloric needs accurately.</Text>
                  <View className="items-start ml-6 mt-3">
                    <View className="flex-col p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center">
                      <Text className="text-detail font-noto text-subText">Your daily calorie needs</Text>
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
                    backgroundColor: '#CFCFCF',
                    marginVertical: 20,
                    width: '100%',
                  }}
                />
                <View className=' pb-20'>
                  <TouchableOpacity
                    onPress={handleSignOut}
                    className="flex flex-row items-center justify-center rounded-normal border border-gray p-1 px-4 bg-red-500"
                  >
                    <Text className="text-subText text-heading2 font-notoMedium">Sign Out</Text>
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