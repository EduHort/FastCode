import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, KeyboardAvoidingView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '@/constants/header';
import { Pedido, Item } from '@/constants/types';
import { buscarPedido, buscarTodosPedidos, criarPedido } from '@/constants/storage';

const Pedidos: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pedidoId, setPedidoId] = useState('');

    useEffect(() => {
        const loadPedidos = async () => {
            const fetchedPedidos = await buscarTodosPedidos();
            setPedidos(fetchedPedidos);
        };
        loadPedidos();
    }, []);

    const calcularTotalPedido = (itens: Item[]) => {
        return itens.reduce((total, item) => {
            const preco = parseFloat(item.preco.replace(',', '.'));
            const quantidade = parseFloat(item.quantidade);
            return total + (preco * quantidade);
        }, 0).toFixed(2);
    };

    const renderItem = ({ item }: { item: Pedido }) => {
        const totalPrice = calcularTotalPedido(item.itens);

        return (
            <TouchableOpacity onPress={() => router.navigate({ pathname: "/pedido/[pedidoID]", params: { codPedido: item.id } })}>
                <View style={styles.item}>
                    <Text style={styles.itemName}>{item.id}</Text>
                    <View style={styles.itemDetails}>
                        <Text>{item.hora}</Text>
                        <Text style={styles.totalPrice}>R$ {totalPrice}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const filteredItems = pedidos.filter(
        (item) => 
            item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCriarPedido = async () => {
        try {
          const pedidoExiste = await buscarPedido(pedidoId);
      
          if (pedidoExiste !== null) {
            Alert.alert("Erro ao criar pedido!", "O pedido já existe!");
            return;
          }
      
          const result = await criarPedido(pedidoId);
      
          if (result === null) {
            Alert.alert("Erro ao criar pedido!", "O pedido não pode ser criado.");
            return;
          }
      
          setPedidos([...pedidos, result]);
          setModalVisible(false);
        } catch (error) {
          console.error('Erro ao criar pedido:', error);
          Alert.alert("Erro!", "Ocorreu um erro ao criar o pedido.");
        }
      };
      
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Pedidos" />

            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" enabled>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar pedido..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={styles.list}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.button}>
                        Criar Pedido
                    </Button>
                </View>
            </KeyboardAvoidingView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Informe o ID do pedido:</Text>
                        <TextInput
                            autoFocus={true}
                            style={styles.input}
                            value={pedidoId}
                            onChangeText={setPedidoId}
                            keyboardType="numeric"
                        />
                        <View style={styles.modalButtons}>
                            <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
                            <Button onPress={handleCriarPedido}>Criar</Button>
                        </View>
                    </View>
                </View>
            </Modal>
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
    keyboardAvoidingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    searchContainer: {
        width: '80%',
        marginBottom: wp('5%'),
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    listContainer: {
        width: '80%',
        maxHeight: hp('60%'),
        flex: 1,
        marginBottom: wp('10%'),
    },
    list: {
        flex: 1,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: wp('1%'),
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '80%',
    },
    button: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        width: '80%',
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 10,
      },
});

export default Pedidos;
