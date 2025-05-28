import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    registerForm: FormGroup;
     constructor(private fb: FormBuilder, private http:HttpClient) {
      this.registerForm = this.fb.group({
        fullName: ['', [Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]],
        password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12),Validators.pattern(/^[a-zA-Z1-9@\$&\*]+$/),
          this.passwordValidator]],
        confirmpassword:['',[Validators.required,this.confirmPasswordValidator]],
        email:['',[Validators.required, Validators.email]],
        phonenumber:['',[Validators.required,Validators.pattern(/^[0-9]{10}$/)]]

    })
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null{
    return (control.value || '').includes(' ') ? {invalidpassword:true} : null ;
  }

  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null{
    const pwd = control.root?.get('password')?.value;
    return control.value === pwd ? null : { confirmpwdinvalid: true}
  }

  onTouch(control: string){
    this.registerForm.get(control)?.markAsTouched();
    this.registerForm.get(control)?.markAsDirty();
  }
  onSubmit(){
      const formData = this.registerForm.value;
      const apiUrl = 'https://localhost:44337/api/registration';

      this.http.post(apiUrl, formData,  { observe: 'response' }).subscribe(
         (res: any) => {
            alert(res.body?.message);
            this.registerForm.reset();
          },
          (error: any) => {
            alert(error.error?.message); 
          }
      );
    }
  }
