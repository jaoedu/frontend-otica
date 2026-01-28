import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "@/navigation/RootNavigator";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <RootNavigator
        isLoggedIn={isLoggedIn}
        onLoginMock={() => setIsLoggedIn(true)}
        onLogoutMock={() => setIsLoggedIn(false)}
      />
    </NavigationContainer>
  );
}
