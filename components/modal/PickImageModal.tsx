import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import { CaptureIcon, CloseIcon, GalleryIcon } from '../../constants/icon'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

type PickImageModalProp = {
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  photo:string | null
  setPhoto:(photo:string | null) => void
  update:() => void
}

const screenWidth = Dimensions.get('window').width;

const PickImageModal = ({isOpen, setIsOpen, photo, setPhoto, update}:PickImageModalProp) => {

  // const [photo, setPhoto] = useState<string | null>(null);
  const [isOpenCamera, setIsOpenCamera] = useState(false)

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    if (permission === null || !permission.granted) {
      const timer = setTimeout(() => {
        requestPermission();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [permission, requestPermission]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      selectionLimit: 10,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync()
        if (data) {
          setPhoto(data.uri);
        }
      } catch(error) {

      }
    }
  };

  const handleClose = () => {
    setIsOpenCamera(false)
    setPhoto(null)
    setIsOpen(false)
  }

  const removeImage = () =>{
    setPhoto(null)
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={handleClose}>
      <View className='p-2'>
        <View className='w-full items-center'>
          <Text className='text-heading2 font-noto'>Change Profile Image</Text>
        </View>
        {(!isOpenCamera && !photo) &&
          <View className='w-full flex-row  justify-center gap-4 mt-2'>
            <TouchableOpacity activeOpacity={0.6} onPress={()=> setIsOpenCamera(!isOpenCamera)} style={{backgroundColor:'#f5f5f5', width:'48%'}} className='w-[48%] p-2 bg-neutral-100  rounded-normal justify-center items-center'>
              <CaptureIcon width={44} height={44} color={'#CFCFCF'}/>
              <Text className=' font-noto'>Take a photo</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6} onPress={pickImage} style={{backgroundColor:'#f5f5f5' , width:'48%'}} className='w-[48%] p-2 bg-neutral-100  rounded-normal justify-center items-center'>
              <GalleryIcon width={44} height={44} color={'#CFCFCF'}/>
              <Text className=' font-noto'>Choose from gallery</Text>
            </TouchableOpacity>
          </View>
        }

        {(isOpenCamera && !photo) &&
        <>
          <View style={{width:screenWidth*0.84, height:screenWidth*0.84}} className='mt-2 relative'>
            <View style={{height:screenWidth*0.84}} className='rounded-full overflow-hidden'>
              {(permission && permission.granted) &&
                <CameraView
                  style={styles.camera}
                  facing={'front'}
                  ref={cameraRef}
                >
                  <View className='w-full h-full p-2 justify-end items-end'><Text>Text</Text></View>
                </CameraView>
              }
            </View>
            <View style={{ transform: [{ translateY: 20 }]}} className=' absolute bottom-0 right-0 p-2 justify-end items-end'>
              <TouchableOpacity onPress={pickImage} className='h-12 w-12 rounded-normal bg-primary justify-center items-center'>
                <GalleryIcon width={30} height={30} color={'white'}/>
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full mt-4 justify-center items-center">
            <TouchableOpacity onPress={takePicture} className="bg-primary w-32 h-32 flex justify-center items-center rounded-full" >
              <Text className="text-heading2 text-white font-notoMedium">Capture</Text>
            </TouchableOpacity>
          </View>
        </>
        }
        {photo &&
          <>
            <View style={{width:screenWidth*0.84, height:screenWidth*0.84}} className='mt-2'>
              <View className=' overflow-hidden rounded-full'>
                <Image
                  source={{ uri: photo }}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
              <TouchableOpacity
                onPress={removeImage}
                className="h-11 w-11 rounded-full bg-primary justify-center items-center"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  padding: 8,
                  borderRadius: 99,
                }}
              >
                <CloseIcon width={36} height={36} color={'#FFFFFF'} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={update} className='w-full p-2 px-4 rounded-full bg-primary items-center mt-2'>
              <Text className='text-white font-noto text-heading2'>Update Profile</Text>
            </TouchableOpacity>
          </>
        }

      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: screenWidth * 0.84,
    height: screenWidth * 0.84,
    borderRadius: 12,
  },
});

export default PickImageModal