import { Modal as RNmodal, View, ModalProps, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'

type DatePickerProp = ModalProps & {
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  withInput?:boolean
}

const BottomModal = ({isOpen, setIsOpen, withInput, children, ...rest}:DatePickerProp) => {

  const content = withInput ? (
    <KeyboardAvoidingView
      className='items-center justify-center flex-1 px-2'
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  ):(
    <View className='w-full h-full items-end justify-end'>
      <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
        <View className="w-full h-full justify-end items-center">
          <View className='w-full bg-pink-300 border border-gray  justify-end items-center'
            style={{
              borderTopLeftRadius:12,
              borderTopRightRadius:12,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 10,
            }}
          >
            <SafeAreaView
              className="w-[92%] px-2 rounded-lg shadow-lg"
              onStartShouldSetResponder={() => true}
            >
              {children}
            </SafeAreaView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )

  return (
    <RNmodal
      visible={isOpen}
      transparent={true}
      animationType='slide'
      statusBarTranslucent
      {...rest}
    >
      {content}
    </RNmodal>
  )
}

export default BottomModal