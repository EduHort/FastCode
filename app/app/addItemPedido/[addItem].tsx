import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '@/constants/header';
import { Item } from '@/constants/types';
import { adicionarItemAoPedido, fetchItens } from '@/constants/storage';

// Tela para adicionar itens ao pedido
const AdicionarItem: React.FC = () => {
  const router = useRouter();
  const [itensDisponiveis, setItensDisponiveis] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [modalVisible, setModalVisible] = useState(false);
  const { codPed } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchItems = async () => {
      const itens = await fetchItens();
      setItensDisponiveis(itens);
    };
    fetchItems();
  }, []);

  const handleConfirmarAdicionarItem = async () => {
    if (selectedItem && quantity) {
      const quantityNumber = parseFloat(quantity.replace(',', '.')); // Substitui vírgula por ponto
      if (isNaN(quantityNumber) || quantityNumber <= 0) {
        Alert.alert("Erro!", "Quantidade inválida!");
        return;
      }

      const item: Item = {
        ...selectedItem,
        quantidade: quantity.replace(',', '.'), // Substitui vírgula por ponto
      };
      const pedidoAtualizado = await adicionarItemAoPedido(codPed as string, item);
      if (pedidoAtualizado) {
        router.back(); // Retorna para a tela do pedido
      }
    }
  };

  const handleQuantityChange = (text: string) => {
    // Remove caracteres que não sejam números, vírgula ou ponto
    let newText = text.replace(/[^0-9.,]/g, '');
    
    // Substitui a primeira vírgula por um ponto
    newText = newText.replace(',', '.'); 
    
    // Remove qualquer ponto ou vírgula adicional
    newText = newText.replace(/([.,].*)[.,]/g, '$1');

    // Garantir que tenha apenas dois dígitos após o ponto decimal
    const parts = newText.split('.');
    if (parts[1]?.length > 3) {
        parts[1] = parts[1].substring(0, 3);
    }
    newText = parts.join('.');

    // Substitui o ponto por vírgula
    newText = newText.replace(',', '.');

    setQuantity(newText);
};

  const renderItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity onPress={() => { setSelectedItem(item); setModalVisible(true); }}>
        <View style={[
          styles.item,
          selectedItem?.nome === item.nome && styles.selectedItem
        ]}>
          <Text style={styles.itemName}>{item.nome}</Text>
          <Text style={styles.itemPrice}>R$ {item.preco}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Adicionar Item" />

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar itens..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
       />

      <View style={styles.content}>
      <FlatList
        data={itensDisponiveis.filter(item =>
            item.nome.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.nome}
      />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Quantidade:</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
              />
              <View style={styles.buttonContainer}>
                <Button onPress={() => setModalVisible(false)}>
                  Cancelar
                </Button>
                <Button onPress={handleConfirmarAdicionarItem}>
                  Confirmar
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('10%'),
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 10,
  },
  selectedItem: {
    backgroundColor: '#f0f0f0', // Cor de fundo para o item selecionado
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  content: {
    width: wp('80%'),
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '90%',
    marginTop: hp('7%'),
    paddingHorizontal: 10,
    marginBottom: hp('1%'),
  }
});

export default AdicionarItem;