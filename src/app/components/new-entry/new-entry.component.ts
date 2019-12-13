import { Component, Output, EventEmitter, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Validator } from "../../utilities/validator";
@Component({
  selector: "new-entry",
  templateUrl: "./new-entry.component.html",
  styleUrls: ["./new-entry.component.scss"]
})
export class NewEntryComponent {
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
