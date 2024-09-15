import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '@/constants/header';
import { Item } from '@/constants/types';
import { fetchItens } from '@/constants/storage';

const Itens: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const loadItems = async () => {
            const fetchedItems = await fetchItens();
            setItems(fetchedItems);
        };
        loadItems();
    }, []);

    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity onPress={() => router.navigate({ pathname: "/item/[nomeItem]", params: { codItem: item.nome } })}>
            <View style={styles.item}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <View style={styles.itemDetails}>
                    <Text>R$: {item.preco}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const filteredItems = items.filter(
        (item) => 
            item.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
      
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Itens" />

            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" enabled>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar item..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.nome}
                        style={styles.list}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={() => router.navigate('/cadastrarItem')} style={styles.button}>
                        Cadastrar Item
                    </Button>
                </View>
            </KeyboardAvoidingView>
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
    buttonContainer: {
        width: '80%',
    },
    button: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
});

export default Itens;
