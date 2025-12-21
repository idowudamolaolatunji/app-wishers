import { useEffect, useState } from "react";
import { Animated, PanResponder } from "react-native";


export default function useDraggable() {
	const [pan, setPan] = useState(new Animated.ValueXY());
    const [showModal, setShowModal] = useState(false);

	useEffect(function() {
        if (!showModal) {
            pan.setValue({ x: 0, y: 0 });
        }
    }, [showModal]);


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            pan.setValue({ x: 0, y: Math.max(0, gestureState.dy) });
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dy > 100 || gestureState.vy > 1) { // adjust the threshold as needed
                setShowModal(false);
            } else {
                Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            }
        },
    });

	return { pan, panResponder, showModal, setShowModal };
}
