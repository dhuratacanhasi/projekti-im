import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { gjeArtikullin } from "@/data/artikujt";

export default function Detajet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artikulli = gjeArtikullin(id);
  if (!artikulli) {
    return <Text>Artikulli “{id}” nuk u gjet.</Text>;
  }
  return (
    <View>
      <Text>{artikulli.titulli}</Text>
      <Text>{artikulli.pershkrimi}</Text>
    </View>
  );
}