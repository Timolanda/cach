import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Web support
if (typeof window !== 'undefined') {
  const rootTag = document.getElementById('root') || document.getElementById('__next');
  if (rootTag) {
    AppRegistry.runApplication(appName, {
      initialProps: {},
      rootTag,
    });
  }
} 