import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, Alert, Modal, StyleSheet, Image, RefreshControl } from 'react-native';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/BDconfi';
import * as ImagePicker from 'expo-image-picker';

const GestionObraScreen = () => {
  const [obras, setObras] = useState([]);
  const [selectedObra, setSelectedObra] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchObras();
  }, []);

  const fetchObras = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'catalogoarte'));
      const obrasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setObras(obrasData);
    } catch (error) {
      console.error("Error al obtener las obras: ", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchObras();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'catalogoarte', id));
      Alert.alert("Éxito", "Obra eliminada correctamente");
      setModalVisible(false);
      fetchObras();
    } catch (error) {
      console.error("Error al eliminar la obra: ", error);
    }
  };

  const handleUpdate = async () => {
    if (Object.values(selectedObra).some(value => value === '')) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const obraRef = doc(db, 'catalogoarte', selectedObra.id);
      await updateDoc(obraRef, {
        ...selectedObra,
        año: parseInt(selectedObra.año),
        valor_estimado: parseFloat(selectedObra.valor_estimado)
      });
      Alert.alert("Éxito", "Obra actualizada correctamente");
      setModalVisible(false);
      fetchObras();
    } catch (error) {
      console.error("Error al actualizar la obra: ", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedObra((prev) => ({
        ...prev,
        imagen_url: result.assets[0].uri,
      }));
    }
  };

  const renderObraItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedObra(item);
      setModalVisible(true);
    }}>
      <View style={styles.catalogContainer}>
        <Image source={{ uri: item.imagen_url }} style={styles.catalogImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={obras}
        keyExtractor={(item) => item.id}
        renderItem={renderObraItem}
        numColumns={2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Obra de Arte</Text>

          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Image
              source={{ uri: selectedObra?.imagen_url }}
              style={styles.editImage}
            />
            <Text style={styles.imagePickerText}>Cambiar Imagen</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Artista"
            style={styles.input}
            value={selectedObra?.artista}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, artista: text })}
          />
          <TextInput
            placeholder="Año"
            style={styles.input}
            value={selectedObra?.año.toString()}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, año: text })}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Descripción"
            style={styles.input}
            value={selectedObra?.descripcion}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, descripcion: text })}
          />
          <TextInput
            placeholder="Dimensiones"
            style={styles.input}
            value={selectedObra?.dimensiones}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, dimensiones: text })}
          />
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={selectedObra?.nombre}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, nombre: text })}
          />
          <TextInput
            placeholder="Tipo"
            style={styles.input}
            value={selectedObra?.tipo}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, tipo: text })}
          />
          <TextInput
            placeholder="Ubicación"
            style={styles.input}
            value={selectedObra?.ubicacion}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, ubicacion: text })}
          />
          <TextInput
            placeholder="Valor Estimado"
            style={styles.input}
            value={selectedObra?.valor_estimado.toString()}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, valor_estimado: text })}
            keyboardType="numeric"
          />

          <View style={styles.modalActions}>
            <Button title="Guardar Cambios" onPress={handleUpdate} />
            <Button title="Eliminar" color="red" onPress={() => handleDelete(selectedObra.id)} />
            <Button title="Cancelar" color="gray" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#666699',
  },
  catalogContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  catalogImage: {
    width: 140,
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  editImage: {
    width: 180,
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#999966',
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#255',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default GestionObraScreen;