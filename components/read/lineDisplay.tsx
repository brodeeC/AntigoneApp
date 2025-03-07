import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { View, Text } from 'react-native';

export default function LineDisplay(lines: string) {
  return (
    <View>
      <Text>Line Display - {lines}</Text>
    </View>
  );
}