import { confettiColors } from '@/constants/theme';
import React from 'react';
import { View } from 'react-native';
import Confetti from 'react-native-reanimated-confetti';

export default function ConfettiEL({ show }: { show?: any }) {
    return (
        <View
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0,
                zIndex: 9999,
                elevation: 9999,
                pointerEvents: 'none' // Allow touches through
            }}
        >
            <Confetti
                colors={confettiColors}
                activateAnimation={show}
                count={100}
                origin={{ x: -15, y: 0, }}
                fadeOut
                delay={0}
                duration={3000}
                explosionSpeed={250}
            />
        </View>
    )
}