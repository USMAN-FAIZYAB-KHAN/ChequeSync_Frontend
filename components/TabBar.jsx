import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native'; // Optional for dynamic theme handling
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5

const TabBar = ({ state, descriptors, navigation }) => {
    const { colors } = useTheme(); // Use this if you're using a dynamic theme

    return (
        <View className="flex-row justify-between items-center py-4 bg-white shadow-xl border-t border-gray-200">
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

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
                    <Pressable
                        key={route.key} 
                        onPress={onPress}
                        onLongPress={onLongPress}
                        className="flex-1 justify-center items-center me-3"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                    >
                        {/* Icon Rendering */}
                        {options.tabBarIcon && (
                            <FontAwesome5
                                name={options.tabBarIcon.name}
                                size={options.tabBarIcon.size}
                                color={isFocused ? options.tabBarIcon.color : 'gray'}
                            />
                        )}

                        {/* Tab Label */}
                        <Text
                            className={`${options.fontSize} font-semibold transition-all duration-200 ${isFocused ? options.color : 'text-gray-500'}`}
                        >
                            {label}
                        </Text>

                        {/* Underline for selected tab */}
                        {isFocused && (
                            <View className={`mt-2 h-1 w-8 text-blue-600 rounded-full`} />
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
};

export default TabBar;
