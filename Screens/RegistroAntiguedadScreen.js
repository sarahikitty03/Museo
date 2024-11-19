// RegistroAntiguedadScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../Firebase/BDconfi';
import * as ImagePicker from 'expo-image-picker';

const RegistroAntiguedadScreen = ({ navigation }) => {
  const [antiguedad, setAntiguedad] = useState({
    nombre: '',
    epoca: '',
    origen: '',
    descripcion: '',
    estado_conservacion: '',
    material: '',
    ubicacion: '',
    valor_historico: '',
    imagen_url: '',
  });

  const handleChangeText = (field, value) => {
    setAntiguedad({ ...antiguedad, [field]: value });
  };

  const handleRegister = async () => {
    if (Object.values(antiguedad).some(value => value === '')) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'galeria_antiguedades'), antiguedad);
      Alert.alert('Éxito', 'Antigüedad registrada correctamente');
      setAntiguedad({
        nombre: '',
        epoca: '',
        origen: '',
        descripcion: '',
        estado_conservacion: '',
        material: '',
        ubicacion: '',
        valor_historico: '',
        imagen_url: '',
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la antigüedad');
      console.error("Error al registrar la antigüedad: ", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setAntiguedad((prevState) => ({ ...prevState, imagen_url: result.assets[0].uri }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Antigüedad</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {antiguedad.imagen_url ? (
          <Image source={{ uri: antiguedad.imagen_url }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Nombre" value={antiguedad.nombre} onChangeText={(text) => handleChangeText('nombre', text)} />
      <TextInput style={styles.input} placeholder="Época" value={antiguedad.epoca} onChangeText={(text) => handleChangeText('epoca', text)} />
      <TextInput style={styles.input} placeholder="Origen" value={antiguedad.origen} onChangeText={(text) => handleChangeText('origen', text)} />
      <TextInput style={styles.input} placeholder="Descripción" value={antiguedad.descripcion} onChangeText={(text) => handleChangeText('descripcion', text)} multiline />
      <TextInput style={styles.input} placeholder="Estado de Conservación" value={antiguedad.estado_conservacion} onChangeText={(text) => handleChangeText('estado_conservacion', text)} />
      <TextInput style={styles.input} placeholder="Material" value={antiguedad.material} onChangeText={(text) => handleChangeText('material', text)} />
      <TextInput style={styles.input} placeholder="Ubicación" value={antiguedad.ubicacion} onChangeText={(text) => handleChangeText('ubicacion', text)} />
      <TextInput style={styles.input} placeholder="Valor Histórico" value={antiguedad.valor_historico} onChangeText={(text) => handleChangeText('valor_historico', text)} keyboardType="numeric" />
      
      <Button title="Registrar Antigüedad" onPress={handleRegister} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default RegistroAntiguedadScreen;
