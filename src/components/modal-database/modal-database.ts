import { Component } from "@angular/core";
import { AuthService } from "../../providers/auth-service/auth-service";

@Component({
  selector: "modal-database",
  templateUrl: "modal-database.html",
})
export class ModalDatabasePage {
  constructor(public authService: AuthService) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalDatabasePage");
  }
}
