import { registerRootComponent } from 'expo';
import App from './App';
import { configureLogger } from 'react-native-reanimated';

configureLogger({ strictMode: false });

registerRootComponent(App);
