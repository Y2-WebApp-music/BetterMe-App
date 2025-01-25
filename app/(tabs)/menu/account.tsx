import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Dimensions, StyleSheet, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import BackButton from '../../../components/Back';
import { LeftArrowIcon } from '../../../constants/icon';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowIcon } from '../../../constants/icon';
import ActivityModal from '../../../components/modal/ActivityModal';
import GenderModal from '../../../components/modal/GenderModal';
import FormInput from '../../../components/FormInput';
import PickDateModal from '../../../components/modal/PickDateModal';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { activity, gender } from '../../../types/user';
import PickNumberModal from '../../../components/modal/PickNumberModal';

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

const AccountSetting = () => {

  const { user } = useAuth();
  const { signOut } = useAuth();

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
  };

  const [weightModal,setWeightModal] = useState(false)
  const updateWeight = (weight: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      weight: weight,
    }));
  };

  const [heightModal,setHeightModal] = useState(false)
  const updateHeight = (height: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      height: height,
    }));
  };

  const [activityModal,setActivityModal] = useState(false)
  const updateActivity = (id:number) => {
    setForm((prevForm) => ({
      ...prevForm,
      activity: id,
    }));
    setActivityModal(false)
  }

  const [genderModal,setGenderModal] = useState(false)
  const updateGender = (id:number) => {
    setForm((prevForm) => ({
      ...prevForm,
      gender: id,
    }));
    setGenderModal(false)
  }

  const handleSignOut = async () => {
    await signOut();
  };

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
                <View className='max-w-[14vw]'>
                  <BackButton goto={'/menu'}/>
                </View>
              </View>
              <View className='mt-2'>
                <View className='flex flex-row gap-2 items-center'>
                  <View className='grow'>
                    <Text className='text-subTitle text-primary font-notoMedium'>Account Setting</Text>
                  </View>
                  <View>
                    <TouchableOpacity className=' bg-primary flex-row gap-2 p-2 px-6 justify-center items-center rounded-full'>
                      <Text className='text-heading2 text-white font-notoMedium'>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View className='mb-4 flex flex-row gap-2 items-center'>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={require('../../../assets/maleAvatar.png')}
                    contentFit="cover"
                    transition={1000}
                  />
                </View>
                <View className='grow'>
                  <FormInput
                    name='username'
                    value={form.username}
                    handleChange={(e:string)=>setForm({ ...form,username: e})}
                    keyboardType="default"
                  />
                  <View className='w-full' style={{marginTop: 6}}>
                    <View style={{marginBottom: 4}}>
                      <Text className='text-subText text-detail'>email</Text>
                    </View>
                    <View className='w-full flex justify-center border border-gray focus:border-primary rounded-normal'>
                      <Text
                        className='flex-1 text-subText text-body font-noto'
                        style={{ width:"94%", textAlignVertical: "center", paddingHorizontal:10, paddingVertical:6, }}
                      >
                        {form.email}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* personal data */}
              <View className='mt-2 flex-col gap-2 items-center'>
                <View className='w-full'>
                  <Text className='text-body font-noto'>personal data</Text>
                </View>
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

                <View className='flex flex-row gap-2 h-max w-[92%] justify-center'>
                  <View className='w-[36%]'>
                    <Text className='text-subText text-detail text-center'>gender</Text>
                    <TouchableOpacity
                      onPress={()=>{setGenderModal(true)}}
                      className={`border ${form.gender === 0? 'border-gray':'border-primary'} mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                    >
                      <Text className={`${form.gender === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                        {form.gender ? gender.find(a => a.id === form.gender)?.gender : ''}
                      </Text>
                    </TouchableOpacity>

                  </View>
                  <View className='w-[30%] '>
                    <Text className='text-subText text-detail text-center'>weight</Text>
                    <TouchableOpacity
                      onPress={()=>{setWeightModal(true)}}
                      className={`border ${form.weight === 0? 'border-gray':'border-primary'} mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                    >
                      <Text className={`${form.weight === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                        {form.weight}
                      </Text>
                      <Text className='text-subText -translate-y-1'>kg</Text>
                    </TouchableOpacity>
                  </View>

                  <View className='w-[30%] '>
                    <Text className='text-subText text-detail text-center'>height</Text>
                    <TouchableOpacity
                      onPress={()=>{setHeightModal(true)}}
                      className={`border ${form.height === 0? 'border-gray':'border-primary'} mt-1 w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                    >
                      <Text className={`${form.height === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                        {form.height}
                      </Text>
                      <Text className='text-subText -translate-y-1'>cm</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                  {/* <View className='mt-3 w-full flex-row gap-2 items-center ml-6'>
                    <View className='items-center'>
                      <Text className='grow text-xs text-subText pb-2'>gender</Text>
                      <View className="flex-row p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center">
                        <Text className="text-body font-notoMedium">Female</Text>
                      </View>
                    </View>
                    <View className='items-center'>
                      <Text className='grow text-xs text-subText pb-2'>weight</Text>
                      <View className="flex-row p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center">
                        <Text className="text-body font-notoMedium">333</Text>
                        <Text className="text-xs text-subText ml-1">kg</Text>
                      </View>
                    </View>
                    <View className='items-center'>
                      <Text className='grow text-xs text-subText pb-2'>height</Text>
                      <View className="flex-row p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center">
                        <Text className="text-body font-notoMedium">333</Text>
                        <Text className="text-xs text-subText ml-1">cm</Text>
                      </View>
                    </View>
                  </View> */}

                <View className='w-[92%]'>
                  <Text className='text-subText text-detail'>your activity</Text>
                  <TouchableOpacity
                    onPress={()=>{setActivityModal(true)}}
                    className={`${form.activity===0 ? 'border-gray' : 'border-primary'} mt-1 w-fit p-2 flex flex-row justify-center items-end border rounded-normal`}
                  >
                    <Text className={`${form.activity===0 ? 'text-subText' : 'text-primary'} flex-1  text-center font-notoMedium text-heading2`}>
                      {form.activity ? activity.find(a => a.id === form.activity)?.title : 'Select an Activity'}
                    </Text>
                  </TouchableOpacity>
                  <Text className='text-subText text-detail pl-2 mt-1'>
                    {form.activity ? activity.find(a => a.id === form.activity)?.description : ''}
                  </Text>
                </View>
                  {/* <View className='ml-6'>
                    <Text className='text-subText'>your activity</Text>
                    <View className="flex-row p-1 px-4 rounded-normal bg-white border border-gray" style={[styles.input, { justifyContent: 'space-between' }]}>
                      <Text>Moderately active</Text>
                      <ArrowIcon width={16} height={16} color={'#626262'}/>
                    </View>
                    <Text className='text-xs text-subText'>Regular moderate exercise 3-5 days a week.</Text>
                  </View> */}

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
          </ScrollView>

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