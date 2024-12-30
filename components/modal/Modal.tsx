import { Modal as RNmodal, View, ModalProps, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'

type DatePickerProp = ModalProps & {
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  withInput?:boolean
}

const Modal = ({isOpen, setIsOpen, withInput, children, ...rest}:DatePickerProp) => {

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
    <SafeAreaView className='w-full h-full items-center justify-center' style={{ backgroundColor: "rgba(24, 24, 27, 0.5)" }}>
      <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
        <View className="w-full h-full justify-center items-center">
          <View
            className="w-[92%] px-2 rounded-lg shadow-lg"
            onStartShouldSetResponder={() => true}
          >
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )

  return (
    <RNmodal
      visible={isOpen}
      transparent={true}
      // animationType='fade'
      statusBarTranslucent
      {...rest}
    >
      {content}
    </RNmodal>
  )
}

export default Modal