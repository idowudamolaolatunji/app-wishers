import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typography from '@/components/Typography'
import { BaseColors, spacingX, spacingY } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import React from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

export default function WelcomeScreen() {
    const router = useRouter();
    const { Colors } = useTheme();

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* Login Button and Image */}
                <View>
                    {/* <TouchableOpacity style={styles.loginButton} onPress={() => router.replace("/(auth)/login")}>
                        <Typography fontWeight="500" fontFamily="urbanist-semibold" size={22}>Login</Typography>
                    </TouchableOpacity> */}

                    {/* <Animated.Image
                        entering={FadeIn.duration(1000)}
                        source={require("@/assets/images/test.png")}
                        style={styles.welcomeImage}
                        resizeMode="contain"
                    /> */}

                    <LottieView
                        autoPlay
                        loop
                        source={require("@/assets/lottie/welcome.json")}
                        style={{ width: verticalScale(500), aspectRatio: 1, marginTop: -50, marginLeft: -40 }}
                    />
                </View>

                {/* Footer Area */}
                <View style={styles.footerArea}>
                    <Animated.View style={{ alignItems: "center" }}
                        entering={FadeInDown.duration(1000)}
                    >
                        <Typography size={ Platform.OS == "ios" ? 30 : 33} fontFamily='urbanist-bold' fontWeight="600" style={{ letterSpacing: 1 }}>
                            Make your 
                        </Typography>
                        <Typography size={ Platform.OS == "ios" ? 30 : 33} fontFamily='urbanist-bold' fontWeight="600" style={{ letterSpacing: 1 }}>
                            wishes come through
                        </Typography>
                    </Animated.View>
                    <Animated.View style={{ alignItems: "center", gap: 2 }}
                        entering={FadeInDown.duration(1000).delay(100)}
                    >
                        <Typography size={17} color={Colors.textLighter} fontFamily='urbanist-medium' style={{ letterSpacing: 0.7, textAlign: "center" }}>
                            Create your wishlist, copy and share link
                        </Typography>
                        <Typography size={17} color={Colors.textLighter} fontFamily='urbanist-medium' style={{ letterSpacing: 0.7, textAlign: "center" }}>
                            to start recieving giftings.
                        </Typography>
                    </Animated.View>

                    <View style={styles.ctaButtonConatiner}>
                        <Button onPress={() => router.replace("/(auth)/sign-up")}>
                            <Typography size={22} color={BaseColors.white} fontWeight="600" fontFamily='urbanist-bold'>
                                Get Started
                            </Typography>
                        </Button>

                        <View style={styles.footerExtra}>
                            <Typography size={16} fontFamily="urbanist-semibold" color={BaseColors.neutral500}>I already have a wishers account</Typography>
                            <Pressable onPress={() => router.replace("/(auth)/login")}>
                                <Typography size={17} color={BaseColors.primaryLight} fontFamily="urbanist-semibold">Login</Typography>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingTop: spacingY._7,
    },
    welcomeImage: {
        width: "100%",
        height: verticalScale(300),
        marginTop: verticalScale(100),
        alignSelf: "center",
    },
    // loginButton: {
    //     alignSelf: "flex-end",
    //     marginRight: spacingX._20,
    //     marginTop: spacingY._5,
    // },
    footerArea: {
        width: "100%",
        alignItems: "center",
        paddingTop: verticalScale(30),
        paddingBottom: verticalScale(45),
        gap: spacingY._20,
        shadowColor: "#aaa",
        shadowOffset: { width: 0, height: -10 },
        elevation: 10,
        shadowRadius: 25,
        shadowOpacity: 0.15,
    },
    ctaButtonConatiner: {
        width: "100%",
        paddingHorizontal: spacingX._25
    },
    footerExtra: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginTop: 10
    },
})