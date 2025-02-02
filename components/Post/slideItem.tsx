import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('screen');

type SlideItemProps = {
    item: { img: any };
  }

const SlideItem = ({item} : SlideItemProps) =>{
    return (
        <View style = {styles.container} >
            <Image source={item.img}
            resizeMode="cover"
            style={styles.image}
            />
        </View>
    )
}

export default SlideItem

const styles = StyleSheet.create({
    container: {
        width,
        height : width,
        alignItems: 'center',
        overflow: 'hidden',
    },
    image:{
        flex:0.9,
        width:'92%',
        borderRadius: 15
    }
});