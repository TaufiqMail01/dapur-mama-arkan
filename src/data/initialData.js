// src/data/initialData.js
import { imageBank } from './imageBank';

export const initialCategories = [
  { id: 'cat-1', name: 'Makanan Utama' },
  { id: 'cat-2', name: 'Minuman' },
  { id: 'cat-3', name: 'Cemilan' }
];

export const initialMenuItems = [
  {
    id: 'item-1',
    name: 'Dimsum Goreng Lezat',
    categoryId: 'cat-3', // Masuk kategori Cemilan
    price: 20000,
    image: imageBank.makananUtama[0]?.url || '', // Mengambil gambar lokal dimsumgoreng.jpg
    description: 'Dimsum goreng renyah di luar, juicy di dalam, disajikan dengan saus spesial.',
    badge: 'Favorit',
    isAvailable: true
  },
  {
    id: 'item-2',
    name: 'Es Teh Manis (Menu Kosong)',
    categoryId: 'cat-2',
    price: 5000,
    image: '', // Sengaja dikosongkan untuk diisi nanti
    description: 'Teh manis segar. Silakan tambahkan foto atau edit lewat Admin Panel.',
    badge: '',
    isAvailable: true
  }
];