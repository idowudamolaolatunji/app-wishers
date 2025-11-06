import BackButton from '@/components/BackButton'
import ModalWrapper from '@/components/ModalWrapper'
import ScreenHeader from '@/components/ScreenHeader'
import { spacingY } from '@/constants/theme'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function ReferralsModal() {
    return (
        <ModalWrapper>
            <View style={styles.container}>
                <ScreenHeader title='Referrals' leftElement={<BackButton />} style={{ marginBottom: spacingY._10 }} />

                {/* the rest of it... */}
                <ScrollView showsVerticalScrollIndicator={false}>
                </ScrollView>
            </View>
        </ModalWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,
    },
})