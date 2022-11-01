import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function IconSettings({ navigation }) {
  return (
    <TouchableOpacity onPress={() => {navigation.navigate("Configuración");}}>
      <Ionicons name="settings" size={30} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
