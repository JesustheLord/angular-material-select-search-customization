
import { Component, Input, Output, EventEmitter, ViewChild, OnInit, input } from '@angular/core';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from "../icons/icons.component";
import { MatButtonModule } from '@angular/material/button'
import { CustomFormErrorDirective } from '../../shared/custom-form-error/custom-form-error.directive';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    CommonModule,
    FormsModule,
    IconsComponent,
    MatButtonModule,
    ReactiveFormsModule,
    CustomFormErrorDirective,
    TranslateModule
  ],
  templateUrl:'./select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit {
  _formControl!: FormControl;
  @Input({ required: true }) items: Array<string> | Array<any> = [];
  @Input() valueFieldName: string | undefined;
  @Input() displayFieldName: string | undefined;
  @Input() subFieldName: string | undefined;
  @Input() multiple: boolean = false;
  @Input() selectAllByDefault: boolean = true;
  @Input() showSelectAll: boolean = false;
  @Input() label: string = '';
  @Input() errorLabel: string = '';
  @Input() customWidth: boolean = false;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() placeholder!: string;
  @Input() canClear: boolean = true;
  @Input() removeBottomMargin: boolean = false;
  @Input() errorMessages: any = null;

  @Input({ required: true }) set control(controlName: AbstractControl | null) {
    this._formControl = controlName as FormControl;
  };
  @Output() selectionChange = new EventEmitter<string | string[]>();

  @ViewChild('select', { static: true }) select!: MatSelect;
  // For single selection
  allSelected = false;


  ngOnInit(): void {
    if (this.customWidth) {
      this.select._overlayPanelClass = 'custom-panel';
    }

    // Select all items by default if multiple selection is enabled
    if (this.multiple && this.selectAllByDefault && this.items.length > 0) {
      this.selectAllItems();
    } 
  }

  get selectedValue(): string | string[] {
    return this._formControl.value;
  }



  set selectedValue(value: string | string[]) {
    this._formControl.setValue(value);
    if (this.multiple) {
      const selectedArray = value as string[];
      this.allSelected = this.items.length > 0 && selectedArray.length === this.items.length;
    }
    this.selectionChange.emit(this._formControl.value);
  }

  someSelected(): boolean {
    if (!this.multiple || !Array.isArray(this.selectedValue)) {
      return false;
    }
    return this.selectedValue.length > 0 && this.selectedValue.length < this.items.length;
  }

  // toggleAllSelection(event: any): void {
  //   if (event.checked) {
  //     if (this.valueFieldName) {
  //       // If using valueFieldName, extract values from items
  //       this.selectedValue = this.items.map(item => item[this.valueFieldName!]);
  //     } else {
  //       // Otherwise use items directly
  //       this.selectedValue = [...this.items];
  //     }
  //   } else {
  //     this.selectedValue = [];
  //   }
  // }

  toggleAllSelection(event: any): void {
  if (event.checked) {
    if (this.valueFieldName) {
      // If using valueFieldName, extract values from items
      const allValues = this.items.map(item => item[this.valueFieldName!]);
      this._formControl.setValue(allValues);
      this.selectedValue = allValues;
    } else {
      // Otherwise use items directly
      this._formControl.setValue([...this.items]);
      this.selectedValue = [...this.items];
    }
  } else {
    this._formControl.setValue([]);
    this.selectedValue = [];
  }
}



  selectAllItems(): void {
  if (this.multiple) {
    if (this.valueFieldName) {
      // If we're using a value field name, extract all values
      const allValues = this.items.map(item => item[this.valueFieldName!]);
      this._formControl.setValue(allValues);
    } else {
      // Otherwise use the items directly
      this._formControl.setValue([...this.items]);
    }
    this.allSelected = true;
    this.selectionChange.emit(this._formControl.value);
  }
}

onSelectionChange(event: any): void {
  // Update allSelected state when individual items are selected/deselected
  if (this.multiple) {
    const currentValue = this._formControl.value || [];
    this.allSelected = this.items.length > 0 && currentValue.length === this.items.length;
  }
  this.selectionChange.emit(this.selectedValue);
}

  clearSelection(): void {
    // Reset the form control and selected value
    this._formControl.setValue(this.multiple ? [] : '');
    this.selectedValue = this.multiple ? [] : '';
    this.allSelected = false;
    this.selectionChange.emit(this.selectedValue);
  } 

  getDisplayValue() {
    if (this.multiple && Array.isArray(this.selectedValue)) {
      return this.selectedValue.map((value: string) => {
        const item = this.items.find(i => i[this.valueFieldName || ''] === value);
        return item ? item[this.displayFieldName || ''] : value;
      })[0];
    } else {
      const item = this.items.find(i => i[this.valueFieldName || ''] === this.selectedValue);
      return item ? item[this.displayFieldName || ''] : this.selectedValue;
    }
  }

  /**
   * Mark the form control as touched to trigger validation
   */
  markAsTouched(): void {
    if (this._formControl) {
      this._formControl.markAsTouched();
      this._formControl.updateValueAndValidity();
    }
  }
  
  /**
   * Check if the control has the specified error
   */
  hasError(errorName: string): boolean {
    return this._formControl ? this._formControl.hasError(errorName) : false;
  }
}
