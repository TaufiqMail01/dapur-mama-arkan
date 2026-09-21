// src/data/imageBank.js

// Impor file foto lokal dari folder assets
import dimsumGorengImg from '../assets/dimsumgoreng.jpg';

export const imageBank = {
  makananUtama: [
    {
      id: 'img-dimsum',
      name: 'Dimsum Goreng',
      url: dimsumGorengImg // Menggunakan variabel lokal
    }
  ],
  minuman: [],
  cemilan: []
};