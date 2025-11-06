import { BaseColors, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { getProfileImage } from '@/services/imageService';
import { verticalScale } from '@/utils/styling';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import * as Icons from "phosphor-react-native";
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Typography from './Typography';


export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const { Colors, currentTheme } = useTheme();
  const { user } = useAuth();
  const unFocusedColor = BaseColors[currentTheme == "dark" ? "neutral600" : "neutral500"]

    const tabbarIcons: any = {
        index: (isFocused: boolean) => (
            // <Icons.HouseIcon
            <Icons.CompassIcon
                size={verticalScale(Platform.OS === "ios" ? 31 : 33)}
                weight={isFocused ? "fill" : "regular"}
                color={isFocused ? BaseColors.primaryLight : unFocusedColor}
            />
        ),
        wishlist: (isFocused: boolean) => (
            // <Icons.NotepadIcon
            <Icons.ScrollIcon
                size={verticalScale(Platform.OS === "ios" ? 31 : 33)}
                weight={isFocused ? "fill" : "regular"}
                color={isFocused ? BaseColors.primaryLight : unFocusedColor}
            />
        ),
        wallet: (isFocused: boolean) => (
            <Icons.WalletIcon
                size={verticalScale(Platform.OS === "ios" ? 31 : 33)}
                weight={isFocused ? "fill" : "regular"}
                color={isFocused ? BaseColors.primaryLight : unFocusedColor}
            />
        ),
        profile: (isFocused: boolean) => {
            return (user?.image && user?.image !== null) ? (
                <View
                    style={{
                        backgroundColor: isFocused ? BaseColors.primaryLight : unFocusedColor,
                        borderRadius: 200,
                        width: verticalScale(36),
                        height: verticalScale(36),
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Image
                        source={getProfileImage(user?.image)}
                        contentFit="cover"
                        transition={100}
                        style={{ 
                            alignSelf: "center",
                            height: verticalScale(32),
                            width: verticalScale(32),
                            borderRadius: 200
                        }}
                    />
                </View>
            ) : (
                <Icons.UserIcon
                    weight={isFocused ? "fill" : "regular"}
                    size={verticalScale(Platform.OS === "ios" ? 31 : 33)}
                    color={isFocused ? BaseColors.primaryLight : unFocusedColor}
                />
            )
        },
    }

    return (
        <View style={[styles.tabbar, { backgroundColor: Colors.background200, borderTopColor: Colors.background300 }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label: any =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name
                ;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.name}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabItem}
                    >
                        {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
                        <Typography
                            size={verticalScale(11)}
                            fontFamily='urbanist-semibold'
                            style={{
                                color: isFocused ? Colors.primaryLight : unFocusedColor,
                                textTransform: "capitalize",
                                letterSpacing: 0.5
                            }}
                        >
                            {label == "index" ? "Discover" : label}
                        </Typography>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabbar: {
        flexDirection: 'row',
        width: "100%",
        height: Platform.OS === "ios" ? verticalScale(73) : verticalScale(68),
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
    },
    tabItem: {
        marginBottom: Platform.OS === "ios" ? spacingY._7 : spacingY._5,
        justifyContent: "center",
        // gap: 2.5,
        gap: 1,
        alignItems: "center"
    },
});