import { Component, OnInit } from '@angular/core';
import { first, map } from 'rxjs/operators';

import { AccountService } from '../_services';
import { CommonMethods } from "../_helpers/commonMethods";
import { ToastrService } from 'ngx-toastr';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = null;
    notes = null;
    searchedKeyword: string;

    constructor(private accountService: AccountService,
        private toastr: ToastrService) {}

    ngOnInit() {
        let currentUserId;
        // console.log(this.accountService.userValue);
        if(!CommonMethods.isNullorUndefinded(this.accountService.userValue)){
            currentUserId = this.accountService.userValue.id;
        }
        this.accountService.getAllNotes()
            .pipe(
                map(notes => notes.sort((a, b) => new Date(b.lastModified_at).getTime() - new Date(a.lastModified_at).getTime()))
            )
            .subscribe((notes) => {
                let myNotes = notes.filter(note => note.created_by == currentUserId);
                this.notes = myNotes;
            });
    }

    deleteUser(id: string) {
        // const user = this.users.find(x => x.id === id);
        // user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.toastr.success('Note Deleted successful');
                this.notes = this.notes.filter(x => x.id !== id);
            });
    }
}