import { spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function index() {
    const { Colors } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: Colors.background }]}>
            <Image
                style={styles.logo}
                contentFit='contain'
                source={require("../assets/svgs/logo.svg")}
            />

            <ActivityIndicator size="large" color={Colors.accentDark} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // temp
        gap: spacingY._30
    },
    logo: {
        width: 250,
        aspectRatio: 1,
    }
})