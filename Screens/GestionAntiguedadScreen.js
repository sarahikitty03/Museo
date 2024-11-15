// GestionAntiguedadScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, Alert, Modal, StyleSheet, Image, RefreshControl } from 'react-native';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/BDconfi';
import * as ImagePicker from 'expo-image-picker';

const GestionAntiguedadScreen = ({ navigation }) => {
  const [antiguedades, setAntiguedades] = useState([]);
  const [selectedAntiguedad, setSelectedAntiguedad] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAntiguedades();
  }, []);

  const fetchAntiguedades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'galeria_antiguedades'));
      const antiguedadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAntiguedades(antiguedadesData);
    } catch (error) {
      console.error("Error al obtener las antigüedades: ", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAntiguedades();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'galeria_antiguedades', id));
      Alert.alert("Éxito", "Antigüedad eliminada correctamente");
      fetchAntiguedades();
    } catch (error) {
      console.error("Error al eliminar la antigüedad: ", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const antiguedadRef = doc(db, 'galeria_antiguedades', selectedAntiguedad.id);
      await updateDoc(antiguedadRef, selectedAntiguedad);
      Alert.alert("Éxito", "Antigüedad actualizada correctamente");
      setModalVisible(false);
      fetchAntiguedades();
    } catch (error) {
      console.error("Error al actualizar la antigüedad: ", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedAntiguedad((prev) => ({ ...prev, imagen_url: result.assets[0].uri }));
    }
  };

  const renderAntiguedadItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedAntiguedad(item);
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
        data={antiguedades}
        keyExtractor={(item) => item.id}
        renderItem={renderAntiguedadItem}
        numColumns={2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Antigüedad</Text>

          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Image source={{ uri: selectedAntiguedad?.imagen_url }} style={styles.editImage} />
            <Text style={styles.imagePickerText}>Cambiar Imagen</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={selectedAntiguedad?.nombre}
            onChangeText={(text) => setSelectedAntiguedad({ ...selectedAntiguedad, nombre: text })}
          />
          <TextInput
            placeholder="Época"
            style={styles.input}
            value={selectedAntiguedad?.epoca}
            onChangeText={(text) => setSelectedAntiguedad({ ...selectedAntiguedad, epoca: text })}
          />
          <TextInput
            placeholder="Origen"
            style={styles.input}
            value={selectedAntiguedad?.origen}
            onChangeText={(text) => setSelectedAntiguedad({ ...selectedAntiguedad, origen: text })}
          />
          <TextInput
            placeholder="Descripción"
            style={styles.input}
            value={selectedAntiguedad?.descripcion}
            onChangeText={(text) => setSelectedAntiguedad({ ...selectedAntiguedad, descripcion: text })}
            multiline
          />
          <TextInput
            placeholder="Estado de Conservación"
            style={styles.input}
            value={selectedAntiguedad?.estado_conservacion}
            onChangeText={(text) => setSelectedAntiguedad({ ...selectedAntiguedad, estado_conservacion: text })}
          />
          <TextInput
            placeholder="Material"
            style={styles.input}
            value={selectedAntiguedad?.material}
            onChangeText={(text) => setSelectedAntiguedad({ ...selectedAntiguedad, material: text })}
          />
          <TextInput
            placeholder="Ubicación"
            style={styles.input}
            value={selectedAntiguedad?.ubicacion}
            onChangeText={(text) => setSelectedAntiguedad({ ...selectedAntiguedad, ubicacion: text })}
          />
          <TextInput
            placeholder="Valor Histórico"
            style={styles.input}
            value={selectedAntiguedad?.valor_historico}
            onChangeText={(text) => setSelectedAntiguedad({ ...selectedAntiguedad, valor_historico: text })}
          />

          <View style={styles.modalActions}>
            <Button title="Guardar Cambios" onPress={handleUpdate} />
            <Button title="Eliminar" color="red" onPress={() => handleDelete(selectedAntiguedad.id)} />
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
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  catalogImage: {
    width: 150,
    height: 200,
    borderRadius: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  editImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default GestionAntiguedadScreen;
