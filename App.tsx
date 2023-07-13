/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import SInfo from 'react-native-sensitive-info';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import ReactNativeBiometrics from 'react-native-biometrics';
type SectionProps = PropsWithChildren<{
  title: string;
}>;
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const USERNAME = 'username';
const PASSWORD = 'password';

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return <View style={styles.sectionContainer} />;
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const mapView = useRef(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [markers, setMarkers] = React.useState([
    {
      latlng: {latitude: 12.896509100356685, longitude: 80.23423788446769},
      title: 'Chennai',
      description: 'Chennai',
    },
  ]);

  useEffect(() => {
    // setTimeout(() => {
    //   if (mapView.current) {
    //     mapView.current.animateToRegion(
    //       {
    //         latitude: LATITUDE,
    //         longitude: LONGITUDE,
    //         latitudeDelta: LATITUDE_DELTA,
    //         longitudeDelta: LONGITUDE_DELTA,
    //       },
    //       2000,
    //     );
    //   }
    // }, 3000);
  }, []);

  const saveReactNativeKeychain = async () => {
    const result = await Keychain.setInternetCredentials(
      'react-native-keychain',
      USERNAME,
      PASSWORD,
      {
        accessControl:
          Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      },
    );

    if (!result) {
      console.log("Keychain couldn't be accessed!");
      return;
    }

    console.log('Credentials saved successfully!');
  };

  const retreiveReactNativeKeychain = async () => {
    const credentials = await Keychain.getInternetCredentials(
      'react-native-keychain',
      {
        accessControl:
          Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      },
    );
    console.log(
      `Credentials retrieved successfully ${JSON.stringify(credentials)}`,
    );
  };

  const deleteReactNativeKeychain = async () => {
    const result = await Keychain.resetInternetCredentials(
      'react-native-keychain',
    );
    console.log(`Credentials successfully deleted ${result}`);
  };

  const saveReactNativeSensitiveInfo = async () => {
    return SInfo.setItem(
      USERNAME,
      JSON.stringify({userName: 'Satheesh', password: '123456'}),
      {
        sharedPreferencesName: 'react-native-sensitive-info',
        keychainService: 'react-native-sensitive-info',
        touchID: true, //add this key
        showModal: true, //add this key
        kSecAccessControl: 'kSecAccessControlBiometryCurrentSet', // optional - Add support for FaceID
      },
    );
  };

  const getReactNativeSensitiveInfo = async () => {
    try {
      const item = await SInfo.getItem(USERNAME, {
        sharedPreferencesName: 'react-native-sensitive-info',
        keychainService: 'react-native-sensitive-info',
        touchID: true,
        showModal: true, //required (Android) - Will prompt user's fingerprint on Android
        strings: {
          // optional (Android) - You can personalize your prompt
          description: 'Custom Title ',
          header: 'Custom Description',
        },
        kSecUseOperationPrompt:
          'We need your permission to retrieve encrypted data',
      });
      console.log(`Credentials retrieved successfully ${item}`);
    } catch (e) {
      console.log(`Failed to fetch credentials ${e}`);
    }
  };

  const deleteReactNativeSensitiveInfo = async () => {
    return SInfo.deleteItem(USERNAME, {
      sharedPreferencesName: 'react-native-sensitive-info',
      keychainService: 'react-native-sensitive-info',
    });
  };

  const rnBiometrics = new ReactNativeBiometrics();

  const createSignatureRNBiometrics = async () => {
    let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
    let payload = epochTimeSeconds + 'some message';

    rnBiometrics.createKeys().then(resultObject => {
      const {publicKey} = resultObject;
      console.log(publicKey);
      // sendPublicKeyToServer(publicKey);
    });
    // rnBiometrics
    //   .createSignature({
    //     promptMessage: 'Sign in',
    //     payload: payload,
    //   })
    //   .then(resultObject => {
    //     const {success, signature} = resultObject;

    //     if (success) {
    //       console.log(`signature ${signature}`);
    //       //verifySignatureWithServer(signature, payload);
    //     }
    //   });
  };

  const getReactNativeBiometrics = async () => {
    rnBiometrics.biometricKeysExist().then(resultObject => {
      const {keysExist} = resultObject;

      if (keysExist) {
        console.log('Keys exist');
      } else {
        console.log('Keys do not exist or were deleted');
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* <MapView
        style={styles.map}
        ref={mapView}
        initialRegion={{
          latitude: 12.99084,
          longitude: 80.21433,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView> */}
      <TouchableOpacity onPress={saveReactNativeKeychain}>
        <Text>Save Data react-native-keychain</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={retreiveReactNativeKeychain}>
        <Text>Retrieve Data react-native-keychain</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteReactNativeKeychain}>
        <Text>Delete all react-native-keychain</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={saveReactNativeSensitiveInfo}>
        <Text>Save Data react-native-sensitive-info</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getReactNativeSensitiveInfo}>
        <Text>Retrieve Data react-native-sensitive-info</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteReactNativeSensitiveInfo}>
        <Text>Delete all react-native-sensitive-info</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={createSignatureRNBiometrics}>
        <Text>Save Data react-native-biometrics</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getReactNativeBiometrics}>
        <Text>Retrieve Data react-native-biometrics</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteReactNativeSensitiveInfo}>
        <Text>Delete all react-native-biometrics</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
