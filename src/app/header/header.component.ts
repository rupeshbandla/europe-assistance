import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  count = 0
  constructor(public angularFirestore: AngularFirestore) { }

  ngOnInit() {
    this.getCartProducts()
  }
  getCartProducts() {
    const uid = localStorage.getItem("UserId");
    this.angularFirestore.firestore.collection('Cart').where("uid", "==", uid).onSnapshot(snapshot => {
      console.log(snapshot);
      this.count = snapshot.docs.length
    })
  }

}
