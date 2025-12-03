import { BaseColors, radius, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { verticalScale } from '@/utils/styling';
import { ThemeButtonProps } from '@/utils/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Loading from './Loading';
import Typography from './Typography';

export default function ThemeButton({ title, icon, onPress, isActive }: ThemeButtonProps) {
    const { Colors, currentTheme } = useTheme();
    const [loading, setLoading] = useState(false);

    useEffect(function() {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    }, [onPress]);

    return (
        <TouchableOpacity activeOpacity={0.9} style={[styles.themeButton, { backgroundColor: Colors.cardBackground }]} onPress={onPress}>
            <View style={styles.cardItem}>
                {icon && icon}

                <Typography size={17} fontFamily="urbanist-medium">{title}</Typography>
            </View>

            {(loading && isActive) ? (
                <View style={{ marginLeft: "auto", height: verticalScale(20) }}>
                    <Loading size="small" color={BaseColors[currentTheme == "dark" ? "accentDark" : "primaryLight"]} />
                </View>
            ) : (
                <MaterialCommunityIcons name={isActive ? "check-circle" : "checkbox-blank-circle-outline"} size={18} color={isActive ? Colors.primaryLight : Colors.textLighter} />
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    themeButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        padding: spacingY._20,
        borderRadius: radius._10,
        marginBottom: spacingY._10
    },
    cardItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingY._10,
    },
});