import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typography from '@/components/Typography';
import { BaseColors, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { verticalScale } from '@/utils/styling';
import * as Burnt from 'burnt';
import { useRouter } from 'expo-router';
import * as Icons from "phosphor-react-native";
import React, { useState } from 'react';
import { Alert, Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../../contexts/AuthContext';


export default function SignupScreen() {
    const { Colors } = useTheme();
    const router = useRouter();
    const { register: registerUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", referralCode: ""
    });

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

            // console.log(res);
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
                <BackButton iconSize={28} />

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
                        <Typography size={Platform.OS == "ios" ? 30 : 36} fontWeight="600" fontFamily="urbanist-bold">
                            Let's get you started!
                        </Typography>
                        <Typography size={Platform.OS == "ios" ? 16 : 20} color={Colors.textLighter} fontFamily="urbanist-medium">
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
                            <Typography size={Platform.OS == "ios" ? 14 : 16} color={Colors.text}>
                                By clicking continue, you are agreeing to our
                            </Typography>
                            <Pressable onPress={() => router.push("https://wishlink.app/terms-of-use")}>
                                <Typography size={Platform.OS == "ios" ? 14 : 16} color={Colors.text} style={{ textDecorationLine: "underline" }}>
                                    terms of use
                                </Typography>
                            </Pressable>
                        </View>


                        <Button onPress={handleSubmit} loading={loading}>
                            <Typography size={Platform.OS == "ios" ? 20 : 25} color={Colors.background} fontFamily='urbanist-extrabold'>Sign Up</Typography>
                        </Button>
                    </View>

                    <View style={styles.footerArea}>
                        <Typography size={Platform.OS == "ios" ? 15 : 17}>Already have an account?</Typography>
                        <Pressable onPress={() => router.navigate("/(auth)/login")}>
                            <Typography size={Platform.OS == "ios" ? 15 : 17} color={BaseColors.primary} fontFamily="urbanist-semibold">Login!</Typography>
                        </Pressable>
                    </View>
                </KeyboardAwareScrollView>
            </View>
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
        marginTop: -5
    },
    footerText: {
        textAlign: "center",
        fontSize: verticalScale(15)
    }
});