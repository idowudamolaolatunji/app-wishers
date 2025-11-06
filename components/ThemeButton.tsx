import { radius, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { ThemeButtonProps } from '@/utils/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Typography from './Typography';

export default function ThemeButton({ title, icon, onPress, isActive }: ThemeButtonProps) {
    const isIOS = Platform.OS === "ios";
    const { Colors } = useTheme();

    return (
        <TouchableOpacity activeOpacity={0.9} style={[styles.themeButton, { backgroundColor: Colors.cardBackground }]} onPress={onPress}>
            <View style={styles.cardItem}>
                {icon && icon}

                <Typography size={isIOS ? 16 : 18} fontFamily="urbanist-medium">{title}</Typography>
            </View>

            <MaterialCommunityIcons name={isActive ? "check-circle" : "checkbox-blank-circle-outline"} size={18} color={isActive ? Colors.primaryLight : Colors.textLighter} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    themeButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        padding: 20,
        borderRadius: radius._10,
        marginBottom: spacingY._10
    },
    cardItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingY._10,
    },
});