import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  products = []
  constructor(public angularFirestore: AngularFirestore,public router: Router) {
    this.getCartProducts()
  }

  ngOnInit() {
  }
  productDetails(product) {
    console.log(product.id)
    this.router.navigateByUrl(`product-details/${product.data().pid}`)
  }

  getCartProducts() {
    const uid = localStorage.getItem("UserId");
    this.angularFirestore.firestore.collection('Cart').where("uid", "==", uid).onSnapshot(snapshot => {
      console.log(snapshot);
      this.products = snapshot.docs
    })
  }
  removeFromCart(docid) {
    this.angularFirestore.firestore.collection('Cart').doc(docid).delete()
  }
}
