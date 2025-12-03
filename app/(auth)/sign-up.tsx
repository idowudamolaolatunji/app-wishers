import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typography from '@/components/Typography';
import { BaseColors, radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { verticalScale } from '@/utils/styling';
import * as Burnt from 'burnt';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { sendEmailVerification } from 'firebase/auth';
import * as Icons from "phosphor-react-native";
import React, { useState } from 'react';
import { Alert, Keyboard, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalView from "react-native-modal";
import { useAuth } from '../../contexts/AuthContext';


export default function SignupScreen() {
    const { Colors } = useTheme();
    const router = useRouter();
    const { register: registerUser } = useAuth();
    const { disableBiometric, biometricEnabled } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", referralCode: ""
    });
    const [showModal, setShowModal] = useState(false)
    

    async function handleSubmit() {
        Keyboard.dismiss();

        if(!formData.name || !formData.email || !formData.password) {
            if(Platform.OS === "ios") {
                return Alert.alert("Login", "Please fill all the fields!");
            } {
                return Burnt.toast({ title: "Please fill all the fields!", haptic: "warning" });
            }
        }
        
        try {
            setLoading(true);
            const { name, email, password, referralCode } = formData;
            
            const res = await registerUser(name, email, password, referralCode);
            if(!res.success) {
                throw new Error(res.msg)
            }

            // send verification email
            await sendEmailVerification(res.user!);
            setShowModal(true);
            if(biometricEnabled) {
                await disableBiometric();
            }
            
            if(Platform.OS !== "ios") {
                Burnt.toast({ title: "Successful", haptic: "success" });
            }
        } catch(err: any) {
            if(Platform.OS === "ios") {
                Alert.alert("Sign up", err?.message);
            } else {
                Burnt.toast({ title: err?.message, haptic: "error" });
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* <BackButton iconSize={28} /> */}

                <KeyboardAwareScrollView
                    bounces={false}
                    overScrollMode="never" // default, always, never
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    enableAutomaticScroll={true}
                    contentContainerStyle={{
                        marginVertical: spacingY._30,
                        gap: spacingY._30
                    }}
                    enableOnAndroid
                >
                    <View style={{ gap: 5, marginTop: spacingY._15 }}>
                        <Typography size={Platform.OS == "ios" ? 30 : 32} fontWeight="600" fontFamily="urbanist-bold">
                            Let's get you started!
                        </Typography>
                        <Typography size={Platform.OS == "ios" ? 16 : 17} color={Colors.textLighter} fontFamily="urbanist-medium">
                            Creat an account and start making wishes 🤑
                        </Typography>
                    </View>

                    <View style={styles.form}>
                        <FormInput
                            placeholder="Enter your name"
                            value={formData.name}
                            onChangeText={(value) => setFormData({ ...formData, name: value })}
                            icon={<Icons.UserIcon size={verticalScale(26)} color={BaseColors.neutral400} />}
                        />
                        <FormInput
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(value) => setFormData({ ...formData, email: value?.toLowerCase() })}
                            icon={<Icons.AtIcon size={verticalScale(26)} color={BaseColors.neutral400} />}
                        />
                        <FormInput
                            placeholder="Enter your password"
                            isPassword={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={formData.password}
                            onChangeText={(value) => setFormData({ ...formData, password: value })}
                            icon={<Icons.PasswordIcon size={verticalScale(26)} color={BaseColors.neutral400} />}
                        />
                        <FormInput
                            placeholder="Referral Code (Optional)"
                            autoCorrect={false}
                            autoCapitalize="none"
                            value={formData.referralCode}
                            onChangeText={(value) => setFormData({ ...formData, referralCode: value })}
                            icon={<Icons.UserCirclePlusIcon size={verticalScale(26)} color={BaseColors.neutral400} />}
                        />

                        <View style={{ alignSelf: "flex-start", flexDirection: "row", gap: 3, alignItems: "center" }}>
                            <Typography size={14} color={Colors.text}>
                                By clicking "Sign Up", you are agreeing to our
                            </Typography>
                            <Pressable onPress={() => router.push("https://wishers.app/terms-of-use")}>
                                <Typography size={14} color={Colors.text} style={{ textDecorationLine: "underline" }}>
                                    terms of use
                                </Typography>
                            </Pressable>
                        </View>

                        <Button onPress={handleSubmit} loading={loading}>
                            <Typography size={Platform.OS == "ios" ? 20 : 22} color={BaseColors.white} fontFamily='urbanist-extrabold'>Sign Up</Typography>
                        </Button>
                    </View>

                    <View style={styles.footerArea}>
                        <Typography size={15}>Already have an account?</Typography>
                        <Pressable onPress={() => router.navigate("/(auth)/login")}>
                            <Typography size={15} color={BaseColors.primary} fontFamily="urbanist-bold">Login!</Typography>
                        </Pressable>
                    </View>
                </KeyboardAwareScrollView>
            </View>

            {/* VERIFICATION SENT */}
            <ModalView
                isVisible={showModal}
                backdropOpacity={0.7}
                backdropTransitionInTiming={800}
                backdropTransitionOutTiming={500}
                onBackdropPress={() => {
                    setShowModal(false)
                    router.replace("/(auth)/login");
                }}
            >
                <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
                    <Image
                        source={require("@/assets/images/icon-check.png")}
                        style={{ width: verticalScale(100), aspectRatio: 1, }}
                    />
        
                    <View style={{ alignItems: "center", gap: spacingY._7 }}>
                        <Typography color={Colors.text} fontFamily="urbanist-semibold" style={{ textAlign: "center" }} size={verticalScale(32)}>Email Verification Sent</Typography>
                        <Typography color={Colors.textLighter} size={19} style={{ textAlign: "center" }}>Check your email as a verification email was sent to {formData?.email}</Typography>
                    </View>
        
                    <Button style={{ width: "100%"}} loading={loading} onPress={() => {
                        setShowModal(false);
                        router.replace("/(auth)/login");
                        Linking.openURL("mailto:")
                    }}>
                        <Typography fontFamily="urbanist-semibold" size={25} color={BaseColors.white}>{Platform.OS == "ios" ? "Open Email app" : "Go to Gmail app"}</Typography>
                    </Button>
                </View>

                <Pressable
                    onPress={() => {
                        setShowModal(false)
                        router.replace("/(auth)/login");
                    }}
                    style={styles.cardCloseButton}
                >
                    <Icons.XIcon size={verticalScale(23.5)} color={BaseColors.white} weight="bold" />
                </Pressable>
            </ModalView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._18,
        gap: spacingY._5,
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        // color: Colors.text
    },
    form: {
        gap: spacingY._20,
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: "500",
    },
    footerArea: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginTop: -18
    },
    footerText: {
        textAlign: "center",
        fontSize: verticalScale(15)
    },

    // VERIFICATION CARDS
    card: {
        minHeight: verticalScale(100),
        borderRadius: radius._10,
        padding: spacingY._17,
        paddingVertical: spacingY._25,

        alignItems: "center",
        gap: spacingY._25,
        textAlign: "center",
    },
    cardCloseButton: {
        width: verticalScale(50),
        height: verticalScale(50),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BaseColors.neutral800,
        borderRadius: 70,
        alignSelf: "center",
        marginTop: spacingY._10
    },
});