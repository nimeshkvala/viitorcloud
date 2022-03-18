import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '../_services';
import { CommonMethods } from "../_helpers/commonMethods";
import { ToastrService } from 'ngx-toastr';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            des: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.accountService.getNoteById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        let currentUserId;
        // console.log(this.accountService.userValue);
        if(!CommonMethods.isNullorUndefinded(this.accountService.userValue)){
            currentUserId = this.accountService.userValue.id;
        }
        let noteData = this.form.value;
        noteData.created_by = currentUserId;
        noteData.lastModified_at = new Date().toLocaleString();
        this.accountService.addNote(noteData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.toastr.success('Note created successfully');
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.toastr.error(error);
                    this.loading = false;
                }
            });
    }

    private updateUser() {
        let currentUserId;
        // console.log(this.accountService.userValue);
        if(!CommonMethods.isNullorUndefinded(this.accountService.userValue)){
            currentUserId = this.accountService.userValue.id;
        }
        let noteData = this.form.value;
        noteData.created_by = currentUserId;
        noteData.lastModified_at = new Date().toLocaleString();
        this.accountService.updateNote(this.id, noteData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.toastr.success('Note Updated successful');
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.toastr.error(error);
                    this.loading = false;
                }
            });
    }
}