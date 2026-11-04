import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "UniBite" }} />
      <Stack.Screen name="add-restaurant" options={{ title: "Shto Restorant", presentation: "modal" }} />
      <Stack.Screen name="restaurant/[id]" options={{ title: "Menuja" }} />
    </Stack>
  );
}
