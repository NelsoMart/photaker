import { TouchableOpacity,} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function IconSettings({ navigation }) {
  return (
    <TouchableOpacity onPress={() => {navigation.navigate("Configuración");}}>
      <Ionicons name="settings" size={30} color="#2F4B51" />
    </TouchableOpacity>
  );
}

