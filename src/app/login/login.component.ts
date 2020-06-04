import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  constructor(formBuild: FormBuilder, public angularFireAuth: AngularFireAuth, public dialog: MatDialogRef<LoginComponent>) {
    this.loginForm = formBuild.group({
      email: new FormControl("", Validators.compose([Validators.required, Validators.email])),
      password: new FormControl("", Validators.required)
    })
  }

  ngOnInit() {
  }
  login() {
    this.loginForm.controls.email.markAsTouched()
    this.loginForm.controls.password.markAsTouched()
    console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      this.angularFireAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(data => {
        localStorage.setItem("UserId", data.user.uid)
        alert("Login Success")
        this.dialog.close(data.user.uid)
      }).catch(error => {
        alert(error.message)
      })
    }
  }
}
