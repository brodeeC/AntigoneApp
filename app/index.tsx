import { Redirect } from 'expo-router';

/** Root URL opens the tab navigator (Home is the first tab). */
export default function Index() {
  return <Redirect href="/home" />;
}
