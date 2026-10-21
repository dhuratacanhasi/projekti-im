import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

// Komponenti im
function KomponentiIm() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Komponenti im</Text>
      <Text>Ky eshte komponenti im i pare!</Text>
    </View>
  );
}

export default function Index() {
  let numriLet = 0;

  const [numri, setNumri] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Projekti im</Text>

      <KomponentiIm />

      <Text style={styles.subtitle}>Prova me let</Text>
      <Text>Numri: {numriLet}</Text>

      <Button
        title="Rrit numrin me let"
        onPress={() => {
          numriLet++;
          console.log("Numri me let:", numriLet);
        }}
      />

      <Text style={styles.subtitle}>Prova me useState</Text>
      <Text>Numri: {numri}</Text>

      <Button
        title="Rrit numrin me useState"
        onPress={() => setNumri(n => n + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 15,
  },
  card: {
    padding: 20,
    backgroundColor: "#e0f2fe",
    borderRadius: 10,
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});
