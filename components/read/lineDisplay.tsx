import { useRouter } from 'expo-router';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useState } from 'react';
import { View, Text } from 'react-native';

export default function LineDisplay(startLine: string, endLine: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  
  return (
    <View>
      <Text>Antigone Lines: {startLine} - {endLine}</Text>


    </View>
  );
}