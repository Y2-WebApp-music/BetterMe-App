import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SlideItemProps = {
    item: any
}

const blurhash = 'UAQ0UC4-0K00TOEdxWjE0WS[xr-q02tlo|S1';


const SlideItem = ({item} : SlideItemProps) =>{
    
    return (
        <View style = {styles.container} >
            <Image source={item}
                contentFit="cover"
                style={styles.image}
                placeholder={{ blurhash }}
                transition={300}
            />
        </View>
    )
}

export default SlideItem

const styles = StyleSheet.create({
    container: {
        width : '100%',
        height : '100%',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image:{
        flex: 1,
        width:'100%',
        borderRadius: 15
    }
});