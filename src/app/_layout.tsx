import { Stack } from "expo-router";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "UniBite" }} />
        <Stack.Screen name="add-restaurant" options={{ title: "Shto Restorant", presentation: "modal" }} />
        <Stack.Screen name="restaurant/[id]" options={{ title: "Menuja" }} />
        <Stack.Screen name="cart" options={{ title: "Shporta" }} />
      </Stack>
    </CartProvider>
  );
}
