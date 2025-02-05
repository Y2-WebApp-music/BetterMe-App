import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';

type PageNumProps = {
    currentIndex: number;
    total: number;
};

const PageNum: React.FC<PageNumProps> = ({ currentIndex, total }) => {
    return (
        <View style={styles.counterContainer}>
          <View style={{ transform: [{ translateY: 1 }]}}>
            <Text className='text-white text-detail font-notoMedium py-1'>
              {currentIndex + 1}/{total}
            </Text>
          </View>
        </View>
      )
    }

export default PageNum;

const styles = StyleSheet.create({
    counterContainer: {
        position: 'absolute',
        top: 10,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 8,
        borderRadius: 20,
      },
    
});
