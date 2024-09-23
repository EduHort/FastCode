import React, { useState, useEffect } from 'react';
import { Alert, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '@/constants/header';
import { Button } from 'react-native-paper';
import { removerQR, salvarQR } from '@/constants/storage';
import { Pedido } from '@/constants/types';

interface CameraModalProps {
    isVisible: boolean;
    onCameraClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isVisible, onCameraClose }) => {
    const [facing, setFacing] = useState<'back' | 'front'>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();

    const barcodeResult = (result: any) => {
      try {
          const { data } = result;
          onCameraClose();
          const pedido = JSON.parse(data) as Pedido;
          salvarQR(pedido);
          router.navigate('/conferirPedido/');
      } catch (error) {
          Alert.alert('Erro', 'QR-CODE inválido ou incompatível');
          router.back();
      }
  };
  
  
    useEffect(() => {
      // Solicita permissão quando o modal se torna visível
      if (isVisible && !permission?.granted) {
        requestPermission();
      }
    }, [isVisible, permission, requestPermission]);
  
    if (permission?.status === 'denied') {
      return (
        <View style={styles.modalContainer}>
          <Text>Precisamos da sua permissão para usar a câmera.</Text>
          <Button onPress={requestPermission}>
            Conceder permissão
          </Button>
        </View>
      );
    }

    const fecharCamera = () => {
        onCameraClose();
        router.back();
    }
  
    if (permission?.status === 'granted') {
      return (
        <Modal visible={isVisible} animationType="fade" onRequestClose={onCameraClose}>
          <View style={styles.modalContainer}>
            <CameraView style={styles.cameraView} facing={facing} onBarcodeScanned={barcodeResult} barcodeScannerSettings={{barcodeTypes: ["qr"]}}>
              <TouchableOpacity style={styles.closeButton} onPress={fecharCamera}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
                  <Text style={styles.buttonText}>Trocar Câmera</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        </Modal>
      );
    }
  
    // Renderiza nada enquanto a permissão não for concedida ou negada
    return null; 
};

const LerQR: React.FC = () => {
    const [isCameraModalVisible, setIsCameraModalVisible] = useState(true);

    useEffect(() => {
        removerQR();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Ler QR-Code" />

            <CameraModal isVisible={isCameraModalVisible} onCameraClose={() => setIsCameraModalVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: hp('10%'),
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraView: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    button: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LerQR;