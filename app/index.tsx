import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function index() {
    const { Colors } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: Colors.background }]}>
            <Image
                style={styles.logo}
                resizeMode='contain'
                source={require("../assets/images/android-icon-foreground.png")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 300,
        // aspectRatio: 1,
        height: 300,
    }
})