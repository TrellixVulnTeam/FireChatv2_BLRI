import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { User } from '../../model/user';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string;
  email: string;
  password: string;
  isSubmitted: boolean = false;

  registerForm: FormGroup;
  nameCtrl: FormControl;
  emailCtrl: FormControl;
  passCtrl: FormControl;

  constructor(
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    this.nameCtrl = new FormControl('', Validators.required);
    this.emailCtrl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    this.passCtrl = new FormControl('', Validators.required);

    this.registerForm = new FormGroup({
      name: this.nameCtrl,
      email: this.emailCtrl,
      password: this.passCtrl
    });
  }

  registerSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.email, this.password).then((userData) => {
        console.log('userData', userData);
        this.authService.saveUserRegistered(userData['uid'], this.name, this.email, this.password).then(res => {
          this.authService.sendVerificationEmail().then(() => {
            // console.log('emailRes', emailRes);
          });
        });
      });
    }else {
      this.matSnackBar.open("Error! some of fields are incorrect", "close", {duration: 3000});
    }
  }
}
