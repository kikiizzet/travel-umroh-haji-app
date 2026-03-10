package main

import "fmt"

func main() {
    // 1. Menampilkan teks ke layar
    fmt.Println("Halo! Saya sedang belajar Go.")

    // 2. Belajar variabel sederhana
    nama := "Budi"
    angka1 := 10
    angka2 := 5

    // 3. Penjumlahan sederhana
    hasil := angka1 + angka2

    fmt.Printf("Halo %s, hasil dari %d + %d adalah %d\n", nama, angka1, angka2, hasil)

    // 4. Percabangan sederhana (If-Else)
    if hasil > 10 {
        fmt.Println("Wah, hasilnya lebih besar dari 10!")
    } else {
        fmt.Println("Hasilnya kecil ya.")
    }
}