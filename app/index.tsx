import { Redirect } from "expo-router";
import { useAuth } from "./context/AuthContext";

export default function Index() {
  const { user } = useAuth();

  // 🚪 Not logged in → go to login
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // 📝 User logged in but not onboarded → go to onboarding
  if (!user.name || !user.address) {
    return <Redirect href="/auth/onboarding" />;
  }

  // ✅ Fully logged in & onboarded → go to main app
  return <Redirect href="/(tabs)/food" />;
}
