import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: any;
  totalRating = 0;
  constructor(public angularFirestore: AngularFirestore, activatedRoute: ActivatedRoute, public matDialog: MatDialog) {
    activatedRoute.paramMap.subscribe(params => {
      this.getProduct(params.get("pId"))

    })
  }

  getProduct(id) {
    this.angularFirestore.firestore.collection('Products').doc(id).get().then(snapsht => {
      console.log(snapsht.data());
      this.product = snapsht
      this.getRatings()
    })
  }

  getRatings() {
    this.angularFirestore.firestore.collection('Ratings').where("id", "==", this.product.id).onSnapshot(snapsht => {
      let rating = 0
      snapsht.docs.forEach(doc => {
        rating += doc.data().rating
      })
      this.totalRating = Math.ceil(rating / snapsht.docs.length)
    })

  }

  ngOnInit() {
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
        this.angularFirestore.firestore.collection("Cart").add({ ...product.data(), pid:product.id, uid }).then(data => {
          alert("Added to cart")
        })
      }
      else {
        alert("Already added to cart")
      }
    })
  }
  addRating(product) {
    var rating = prompt("Please enter your Rating");
    if (/^[1-5]+$/.test(rating)) {
      this.angularFirestore.firestore.collection('Ratings').add({ id: product.id, rating: parseInt(rating) })
    }
    else {
      console.log(rating);
      alert("Please enter rating between 1 to 5")

    }
  }

}
