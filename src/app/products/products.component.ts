import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products = []
  constructor(public angularFirestore: AngularFirestore, public router: Router, public matDialog: MatDialog) {
    this.getProducts()
  }

  ngOnInit() {
  }

  getProducts() {
    this.angularFirestore.firestore.collection('Products').get().then(products => {
      this.products = products.docs
    })
  }

  productDetails(product) {
    this.router.navigateByUrl(`product-details/${product.id}`)
  }
  addToCart(product) {
    const uid = localStorage.getItem("UserId");
    if (uid) {
      this.saveProduct(product, uid)
    } else {
      const dialogRef = this.matDialog.open(LoginComponent, {
        width: "300px",
        height: "250px"
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveProduct(product, result)
        }
      })
    }
  }
  saveProduct(product, uid) {
    this.angularFirestore.firestore.collection("Cart").where("uid", "==", uid).where("ProductName", "==", product.data().ProductName).get().then(snapshot => {
      if (snapshot.empty) {
        this.angularFirestore.firestore.collection("Cart").add({ ...product.data(), pid: product.id, uid }).then(data => {
          alert("Added to cart")
        })

      }
      else {
        alert("Already added to cart")
      }
    })

  }
}
