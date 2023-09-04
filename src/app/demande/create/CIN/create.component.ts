import { Component,ViewChild  } from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';
import {FormBuilder, Validators,FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { SnackbarService } from '../../../../shared/snackbar.service';
import { MatStepper } from '@angular/material/stepper';
import {AuthService} from "../../../../shared/auth.service";
import {Router} from "@angular/router";
import {DemandeService} from "../../../../shared/demande.service";


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
    SnackbarService
  ],
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class CreateComponent {
  @ViewChild('stepper', { static: true }) stepper!: MatStepper;

  reason: string = '';
  firstName: string = '';
  lastName: string = '';
  dateOfBirth: string = '';
  placeOfBirth ?: Date;
  fathersName: string = '';
  mothersName: string = '';
  address: string = '';
  sex: string = '';

  requestId: string = '';

  formDataForm: FormGroup;

  selectedFile?: File;

  constructor(private _formBuilder: FormBuilder,public dialogRef: DialogRef,private snackbarService: SnackbarService,
              private demandeService:DemandeService, private router: Router
  ) {
    this.formDataForm = this._formBuilder.group({
      reason: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      placeOfBirth: ['', Validators.required],
      fathersName: ['', Validators.required],
      mothersName: ['', Validators.required],
      address: ['', Validators.required],
      sex: ['', Validators.required],
    });
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });


  onNextClick() {
    if (this.formDataForm.valid) {
      console.log('Next button clicked! Saving form data...');
      console.log('Form Data:', this.formDataForm.value);
      const onSuccess = (res: any)=>{
        this.requestId = res.data.id;
        console.log(res.data.id);
        this.snackbarService.openSnackBar('Les informations du demande a été enregisté avec succes', 'Fermer', 3000);
        //this.router.navigate(['/demande']);
      };
      this.demandeService.create(
        'CIN',
        this.formDataForm.value.reason ?? '',
        this.formDataForm.value.firstName ?? '',
        this.formDataForm.value.lastName ?? '',
        this.formDataForm.value.dateOfBirth ?? '',
        this.formDataForm.value.placeOfBirth ?? '',
        this.formDataForm.value.fathersName ?? '',
        this.formDataForm.value.mothersName ?? '',
        this.formDataForm.value.address ?? '',
        this.formDataForm.value.sex ?? '',
      )
        .subscribe(
          onSuccess,
          err => {
            const error: any = err; // Vous pouvez également ignorer cette ligne si vous n'avez pas besoin de typer 'err'.
            this.stepper.reset();
            console.log(error);
            this.snackbarService.openSnackBar('Votre demande est incorrecte, veuillez recommencer', 'Fermer', 3000);
          }
        )
      this.stepper.next();
    } else {
      this.stepper.reset();
      console.log('Form data is invalid. Cannot proceed to the next step.');
    }
  }

  openSuccessSnackBar() {
    if (!this.selectedFile) {
      console.log("Aucun fichier sélectionné.");
      return;
    }
    console.log('this.requestId : '+this.requestId);
    const formData: FormData = new FormData();
    formData.append('attachment', this.selectedFile, this.selectedFile.name);
    formData.append('requestId', this.requestId);

    const onSuccess = (res: any)=>{
      console.log(res);
      this.dialogRef.close();
      this.snackbarService.openSnackBar('Le fichier justatifs a été enregisté avec succes', 'Fermer', 3000);
      this.router.navigate(['/demande']);
      setTimeout(() => {
        location.reload();
      }, 100);
    };
    this.demandeService.addAttachment(
      formData
    )
      .subscribe(
        onSuccess,
        err => {
          const error: any = err; // Vous pouvez également ignorer cette ligne si vous n'avez pas besoin de typer 'err'.
          console.log(error);
          this.snackbarService.openSnackBar('Votre demande est incorrecte, veuillez recommencer', 'Fermer', 3000);
        }
      )
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }
}
