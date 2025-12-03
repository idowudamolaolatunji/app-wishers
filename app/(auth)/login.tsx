import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import { BaseColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useBiometricAuth } from "@/hooks/useBiometricsAuth";
import { useTheme } from "@/hooks/useTheme";
import { verticalScale } from "@/utils/styling";
import * as Burnt from "burnt";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { sendEmailVerification, User } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Keyboard, Linking, Platform, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalView from "react-native-modal";


export default function LoginScreen() {
    const { Colors } = useTheme();
    const router = useRouter();
    const { login: loginUser, getStoredUserData, authenticateWithBiometric, biometricEnabled } = useAuth();
    const { isBiometricSupported, isEnrolled } = useBiometricAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "", password: "", name: ""
    });
    const [showModal, setShowModal] = useState({ verify: false, verify_complete: false })
    const [verifyingUser, setVerifyingUser] = useState<User | null>(null)

    const biometricsIsEnabled = isBiometricSupported && isEnrolled && biometricEnabled;

    useEffect(function() {
        (async () => {
            const data = await getStoredUserData();
            if(data) {
                setFormData({
                    ...formData,
                    email: data?.email || "",
                    name: data?.name || ""
                });
            }
        })();
    }, []);


    async function handleSubmit() {
        Keyboard.dismiss();
        
        if(!formData.email || !formData.password) {
            if(Platform.OS === "ios") {
                return Alert.alert("Login", "Please fill all the fields!");
            } else {
                return Burnt.toast({ title: "Please fill all the fields!", haptic: "warning" });
            }
        }
        setLoading(true);
        const { email, password } = formData;

        try {
            const res = await loginUser(email, password);
            
            if(!res.success) {
                // check if the user email is verified!
                if(res.msg === "Email not verified") {
                    setVerifyingUser(res?.user!);
                    setShowModal({ ...showModal, verify: true });
                }

                // and / or show the message
                throw new Error(res.msg)
            }

            if(Platform.OS !== "ios") {
                Burnt.toast({ title: "Successful", haptic: "success" });
            }
        } catch(err: any) {
            if(Platform.OS === "ios") {
                Alert.alert("Login", err?.message);
            } else {
                Burnt.toast({ title: err?.message, haptic: "error" });
            }
        } finally {
            setLoading(false);
        }
    }

    const handleLoginWithBiometrics = async function() {
        try {
            setLoading(true);
            const status = await authenticateWithBiometric();
            if(!status.success) throw new Error(status.msg);

            Burnt.toast({ haptic: "success", title: "Authentication Successful" });
        } catch(err: any) {
            Burnt.toast({ haptic: "error", title: "Authentication Cancelled" });
            console.log("Canceled")
        } finally {
            setLoading(false);
        }
    };

    async function handleSendVerification() {
        setLoading(true)

        try {
            sendEmailVerification(verifyingUser!)
            setShowModal({ ...showModal, verify: false, verify_complete: true })
        } catch(err: any) {
            Burnt.toast({ haptic: "error", title: "Verification failed" });
        } finally {
            setLoading(false);
        }
    }

	return (
		<ScreenWrapper>
			<View style={styles.container}>
                {/* <BackButton iconSize={28} customAction={() => router.push("/(auth)/welcome")} /> */}

                <KeyboardAwareScrollView
                    bounces={false}
                    overScrollMode="never" // default, always, never
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    enableAutomaticScroll={true}
                    contentContainerStyle={{
                        marginTop: spacingY._30,
                        gap: spacingY._30
                    }}
                    enableOnAndroid
                >
                    <View style={{ gap: 5, marginTop: spacingY._15 }}>
                        <Typography size={Platform.OS == "ios" ? 30 : 32} fontWeight="600" fontFamily="urbanist-bold">
                            Hi 👋🏿{formData.name ? ` ${formData.name?.split(" ")[0]}` : ""},
                        </Typography>
                        <Typography size={Platform.OS == "ios" ? 30 : 32} fontWeight="600" fontFamily="urbanist-bold">
                            Welcome Back!
                        </Typography>
                        <Typography size={Platform.OS == "ios" ? 16 : 17.5} color={Colors.textLighter} fontFamily="urbanist-medium">
                            Login now & bring your wishes to life
                        </Typography>
                    </View>

                    <View style={styles.form}>
                        <FormInput
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(value) => setFormData({ ...formData, email: value })}
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

                        <Pressable onPress={() => {
                            router.push({
                                pathname: "/forgot-password",
                                params: { email: formData?.email }
                            })
                        }} style={styles.forgotPassword}>
                            <Typography size={14} color={Colors.textLighter} fontFamily="urbanist-medium">
                                Forgot Password
                            </Typography>
                        </Pressable>

                        <Button onPress={handleSubmit} loading={loading}>
                            <Typography size={21} color={BaseColors.white} fontFamily="urbanist-extrabold">Login</Typography>
                        </Button>
                    </View>

                    <View style={styles.footerArea}>
                        <Typography size={15} color={Colors.text} fontFamily="urbanist-medium">Don't have an account?</Typography>
                        <Pressable onPress={() => router.navigate("/(auth)/sign-up")}>
                            <Typography size={15} color={BaseColors.primary} fontFamily="urbanist-bold">Register!</Typography>
                        </Pressable>
                    </View>
                </KeyboardAwareScrollView>

                {biometricsIsEnabled && (
                    <TouchableOpacity
                        onPress={handleLoginWithBiometrics}
                        activeOpacity={0.7}
                        style={{
                            marginTop: "auto",
                            alignItems: 'center',
                            justifyContent: "center",
                            gap: 6,
                            paddingVertical: spacingY._25,
                            marginBottom: 10
                        }}
                    >
                        {Platform.OS === "ios" ? (
                            <Icons.UserFocusIcon
                                color={Colors.textLighter}
                                weight="regular"
                                size={verticalScale(40)}
                            />
                        ) : (
                            <Icons.FingerprintIcon
                                color={Colors.textLighter}
                                weight="regular"
                                size={verticalScale(40)}
                            />
                        )}
                        <Typography color={Colors.textLighter} fontFamily="urbanist-medium" size={verticalScale(20)}>
                            Login with {Platform.OS == "ios" ? "Face Id /Fingerprint" : "Biometrics"}
                        </Typography>
                    </TouchableOpacity>
                )}
			</View>

            {/* VERIFICATION UNVERIFIED */}
            <ModalView
                isVisible={showModal.verify}
                backdropOpacity={0.7}
                backdropTransitionInTiming={800}
                backdropTransitionOutTiming={500}
            >
                <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
                    <Image
                        source={require("@/assets/images/icon-unverified.png")}
                        style={{ width: verticalScale(100), aspectRatio: 1, }}
                    />
        
                    <View style={{ alignItems: "center", gap: spacingY._7 }}>
                        <Typography color={Colors.text} fontFamily="urbanist-semibold" style={{ textAlign: "center" }} size={verticalScale(32.5)}>Email not Verified</Typography>
                        <Typography color={Colors.textLighter} size={19} style={{ textAlign: "center" }}>Cleck the button below to get a verification email and verify your email</Typography>
                    </View>
        
                    <Button style={{ width: "100%"}} onPress={handleSendVerification} loading={loading}>
                        <Typography fontFamily="urbanist-semibold" size={25} color={BaseColors.white}>Send Verification Email</Typography>
                    </Button>
                </View>
                
                <Pressable
                    onPress={() => {
                        setShowModal({ ...showModal, verify: false })}
                    }
                    style={styles.cardCloseButton}
                >
                    <Icons.XIcon size={verticalScale(23.5)} color={BaseColors.white} weight="bold" />
                </Pressable>
            </ModalView>

            {/* VERIFICATION COMPLETED */}
            <ModalView
                isVisible={showModal.verify_complete}
                backdropOpacity={0.7}
                backdropTransitionInTiming={800}
                backdropTransitionOutTiming={500}
                onBackdropPress={() => setShowModal({ ...showModal, verify_complete: false })}
            >
                <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
                    <Image
                        source={require("@/assets/images/icon-check.png")}
                        style={{ width: verticalScale(100), aspectRatio: 1, }}
                    />
        
                    <View style={{ alignItems: "center", gap: spacingY._7 }}>
                        <Typography color={Colors.text} fontFamily="urbanist-semibold" style={{ textAlign: "center" }} size={verticalScale(32)}>Verfication Email Sent</Typography>
                        <Typography color={Colors.textLighter} size={19} style={{ textAlign: "center" }}>Check your email as a verification email was sent to {verifyingUser?.email}</Typography>
                    </View>
        
                    <Button style={{ width: "100%"}} loading={loading} onPress={() => {
                        setShowModal({ ...showModal, verify_complete: false });
                        Linking.openURL("mailto:")
                    }}>
                        <Typography fontFamily="urbanist-semibold" size={25} color={BaseColors.white}>{Platform.OS == "ios" ? "Open Email app" : "Go to Gmail app"}</Typography>
                    </Button>
                </View>

                <Pressable
                    onPress={() => {
                        setShowModal({ ...showModal, verify_complete: false })}
                    }
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
        // gap: spacingY._30,
        paddingHorizontal: spacingX._18,
        gap: spacingY._5,
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
    },
    form: {
        gap: spacingY._20,
    },
    forgotPassword: {
        textAlign: "right",
        alignSelf: "flex-end"
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
