// RegistroObraScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../Firebase/BDconfi';
import * as ImagePicker from 'expo-image-picker';

const RegistroObraScreen = ({ navigation }) => {
  const [obra, setObra] = useState({
    artista: '',
    año: '',
    descripcion: '',
    dimensiones: '',
    imagen_url: '',
    nombre: '',
    tipo: '',
    ubicacion: '',
    valor_estimado: ''
  });

  const handleChangeText = (field, value) => {
    setObra({ ...obra, [field]: value });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para subir imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setObra({ ...obra, imagen_url: result.assets[0].uri });
    }
  };

  const handleRegister = async () => {
    if (Object.values(obra).some(value => value === '')) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'catalogoarte'), {
        ...obra,
        año: parseInt(obra.año),
        valor_estimado: parseFloat(obra.valor_estimado)
      });
      Alert.alert('Éxito', 'Obra registrada correctamente');
      setObra({
        artista: '',
        año: '',
        descripcion: '',
        dimensiones: '',
        imagen_url: '',
        nombre: '',
        tipo: '',
        ubicacion: '',
        valor_estimado: ''
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la obra');
      console.error("Error al registrar la obra: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Obra de Arte</Text>
      
      {/* Botón para seleccionar imagen y vista previa */}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {obra.imagen_url ? (
        <Image source={{ uri: obra.imagen_url }} style={styles.imagePreview} />
      ) : null}

      {/* Resto del formulario */}
      <TextInput style={styles.input} placeholder="Artista" value={obra.artista} onChangeText={(text) => handleChangeText('artista', text)} />
      <TextInput style={styles.input} placeholder="Año" value={obra.año} onChangeText={(text) => handleChangeText('año', text)} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Descripción" value={obra.descripcion} onChangeText={(text) => handleChangeText('descripcion', text)} multiline />
      <TextInput style={styles.input} placeholder="Dimensiones" value={obra.dimensiones} onChangeText={(text) => handleChangeText('dimensiones', text)} />
      <TextInput style={styles.input} placeholder="Nombre de la Obra" value={obra.nombre} onChangeText={(text) => handleChangeText('nombre', text)} />
      <TextInput style={styles.input} placeholder="Tipo de Obra" value={obra.tipo} onChangeText={(text) => handleChangeText('tipo', text)} />
      <TextInput style={styles.input} placeholder="Ubicación" value={obra.ubicacion} onChangeText={(text) => handleChangeText('ubicacion', text)} />
      <TextInput style={styles.input} placeholder="Valor Estimado" value={obra.valor_estimado} onChangeText={(text) => handleChangeText('valor_estimado', text)} keyboardType="numeric" />
      <Button title="Registrar Obra" onPress={handleRegister} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    flexGrow: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  imageButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default RegistroObraScreen;
