import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/storage';
import { useState } from 'react';

export function useImagePicker() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') throw new Error('Permission denied');
  };

  const pickAndUploadImage = async (): Promise<string | null> => {
    await requestPermission();
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (result.canceled) return null;
    const uri = result.assets[0]?.uri;
    if (!uri) return null;

    setUploading(true);
    try {
      const url = await storageService.uploadImage(uri, user?.id);
      return url;
    } finally {
      setUploading(false);
    }
  };

  return { pickAndUploadImage, uploading };
}
