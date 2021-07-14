import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewChecked
} from "@angular/core";
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner";
import { FormControl } from "@angular/forms";

@Component({
  selector: "input-chassi-controller",
  templateUrl: "input-chassi-controller.html"
})
export class InputChassiControllerComponent
  implements OnChanges, AfterViewChecked {
  @Output() onChassiInputed: EventEmitter<string> = new EventEmitter<string>();
  @Output() onChassiScanned: EventEmitter<string> = new EventEmitter<string>();
  @Output() onChassiDisabledClick: EventEmitter<void> = new EventEmitter<
    void
  >();
  @Output() onScannerShowed: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();
  @Output() onScannerHidden: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();
  @Input() disabled: boolean;

  @ViewChild("chassiInput") chassiInput;
  formControlChassi = new FormControl("");

  options: BarcodeScannerOptions;
  inputChassi: string;

  constructor(private barcodeScanner: BarcodeScanner) {

    this.formControlChassi.valueChanges.debounceTime(500).subscribe(value => {
      console.log("debounced", value);
      if (value && value.length) {
        if (!this.disabled) {
          if (value.length >= 6) {
            let chassi = value.replace(/[\W_]+/g, "");
            setTimeout(() => {
              this.inputChassi = "";
              this.onChassiInputed.emit(chassi);
            }, 500);
          }
        } else {
          this.onChassiDisabledClick.emit();
        }
      }
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('SimpleChanges', changes);
  }

  scan() {
    if (!this.disabled) {
      this.options = {
        showTorchButton: true,
        prompt: "",
        resultDisplayDuration: 0
      };

      this.onScannerShowed.emit(true);
      this.barcodeScanner.scan(this.options).then(
        barcodeData => {
          this.onScannerHidden.emit(true);
          if (barcodeData.text != null && barcodeData.text.length > 0) {
            this.onChassiScanned.emit(barcodeData.text);
          }
        },
        err => {
          this.onScannerHidden.emit(true);
        }
      );
    } else {
      this.onChassiDisabledClick.emit();
    }
  }

  // onChange() {
  //   if (!this.disabled) {
  //     if (this.inputChassi.length == 6 || this.inputChassi.length == 17) {
  //       let chassi = this.inputChassi.replace(/[\W_]+/g,"");
  //       setTimeout(() => {
  //         this.inputChassi = "";
  //         this.onChassiInputed.emit(chassi);
  //       },500);
  //     }
  //   } else {
  //     this.onChassiDisabledClick.emit();
  //   }
  // }

  public setFocus() {
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);
  }

  ngAfterViewChecked(): void {
    //console.log('ngAfterViewChecked');
  }
}
