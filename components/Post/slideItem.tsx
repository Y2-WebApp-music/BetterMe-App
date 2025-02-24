import {Image, StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';

type SlideItemProps = {
    item: any
}

const SlideItem = ({item} : SlideItemProps) =>{
    
    return (
            <View style = {styles.container} >
                <Image source={item}
                resizeMode="cover"
                style={styles.image}
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