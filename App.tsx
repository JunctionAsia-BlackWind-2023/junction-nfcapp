import axios, {AxiosError} from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

// Pre-step, call this before any NFC operations
NfcManager.start();

function App() {
  const [reading, setReading] = useState(false);
  const [cost, setCost] = useState(1000);
  async function readNdef(mode: number) {
    if (reading) {
      return;
    }
    setReading(true);
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      if (tag === null) {
        setReading(false);
        return;
      }
      const id = tag.id!;
      if (mode == 0) {
        axios({
          method: 'post',
          url: `http://43.200.177.169:8000/api/v1/pay/nfc/${cost}`,
          params: {
            nfc_serial: id,
          },
        })
          .then(res => {
            console.log(res.data);
          })
          .catch((err: AxiosError) => {
            console.error(err.message);
            console.error(err.cause);
          });
      } else if (mode == 1) {
        axios({
          method: 'delete',
          url: `http://43.200.177.169:8000/api/v1/pay/nfc`,
          params: {
            nfc_serial: id,
          },
        })
          .then(res => {
            console.log(res.data);
          })
          .catch((err: AxiosError) => {
            console.error(err.message);
            console.error(err.cause);
          });
      } else {
        axios({
          method: 'post',
          url: `http://43.200.177.169:8000/api/v1/amusement/331a93d8-5c0d-4408-8486-a972b2831d32`,
          params: {
            nfc_serial: id,
          },
        })
          .then(res => {
            console.log(res.data);
          })
          .catch((err: AxiosError) => {
            console.error(err.message);
            console.error(err.cause);
          });
      }
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
    setReading(false);
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => {
          readNdef(0);
        }}>
        <Text>Pay by NFC</Text>
      </TouchableOpacity>
      <TextInput
        style={{width: 100, borderWidth: 1}}
        onChangeText={v => {
          setCost(parseInt(v));
        }}
        value={`${cost}`}></TextInput>

      <TouchableOpacity
        onPress={() => {
          readNdef(1);
        }}>
        <Text>adjustment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          readNdef(2);
        }}>
        <Text>queuing</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

export default App;
