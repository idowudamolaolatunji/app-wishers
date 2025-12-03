import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import { auth } from "@/config/firebase";
import { BaseColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { verticalScale } from "@/utils/styling";
import * as Burnt from "burnt";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalView from "react-native-modal";


export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { Colors } = useTheme();
    const params: { email: string } = useLocalSearchParams();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "" });
    const [showModal, setShowModal] = useState(false);
    

    useEffect(function() {
        setFormData({ ...formData, email: params?.email || "" })
    }, []);


    const handleSubmit = async function () {
        const { email } = formData;
        if(!email) return Burnt.toast({ haptic: "error", title: "Enter a valid email" })
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, formData.email);
            setShowModal(true)
        } catch(err: any) {
            Burnt.toast({ title: err?.message, haptic: "error" });
        } finally {
            setLoading(false);
        }
    }

	return (
		<ScreenWrapper>
			<View style={styles.container}>
                <BackButton iconSize={28} customAction={() => router.push("/(auth)/login")} />

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
                            Forgot Password?
                        </Typography>
                        <Typography size={Platform.OS == "ios" ? 16 : 17.5} color={Colors.textLighter} fontFamily="urbanist-medium">
                            Enter email assiociated with your account and we'll send your recovery OTP code via email 
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
                        <Button onPress={handleSubmit} loading={loading}>
                            <Typography size={21} color={BaseColors.white} fontFamily="urbanist-extrabold">Sent Code</Typography>
                        </Button>
                    </View>

                    <View style={styles.footerArea}>
                        <Typography size={15} color={Colors.text} fontFamily="urbanist-medium">Remember your password?</Typography>
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
                onBackdropPress={() => setShowModal(false)}
            >
                <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
                    <Image
                        source={require("@/assets/images/icon-check.png")}
                        style={{ width: verticalScale(100), aspectRatio: 1, }}
                    />
        
                    <View style={{ alignItems: "center", gap: spacingY._7 }}>
                        <Typography color={Colors.text} fontFamily="urbanist-semibold" style={{ textAlign: "center" }} size={verticalScale(32)}>Password Reset Email Sent</Typography>
                        <Typography color={Colors.textLighter} size={19} style={{ textAlign: "center" }}>Check your email as a password reset email was sent to {formData?.email}</Typography>
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
		justifyContent: "space-between",
		paddingTop: spacingY._7,
        paddingHorizontal: spacingX._18,
	},
    form: {
        gap: spacingY._20,
    },
    footerArea: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginTop: -18
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
