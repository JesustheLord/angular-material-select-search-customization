# SelectComponent

Reusable standalone Angular select wrapper built on Angular Material `mat-select`.

## Location

- Component: `src/app/components/select/select.component.ts`
- Template: `src/app/components/select/select.component.html`
- Styles: `src/app/components/select/select.component.scss`

## Features

- Single and multi-select modes
- Optional **Select All** for multi-select
- Optional clear icon
- Supports primitive and object item arrays
- Configurable value/display/sub text fields
- Integrated translation support
- Custom form validation error support
- Optional custom panel width

## Inputs

| Input | Type | Default | Required | Description |
|---|---|---:|:---:|---|
| `items` | `Array<string> \| Array<any>` | `[]` | ✅ | Options to display |
| `control` | `AbstractControl \| null` | - | ✅ | Reactive form control |
| `valueFieldName` | `string \| undefined` | `undefined` | ❌ | Field used as value (object items) |
| `displayFieldName` | `string \| undefined` | `undefined` | ❌ | Field shown in option text |
| `subFieldName` | `string \| undefined` | `undefined` | ❌ | Secondary line under option text |
| `multiple` | `boolean` | `false` | ❌ | Enables multi-select |
| `selectAllByDefault` | `boolean` | `true` | ❌ | Pre-select all items in multi mode |
| `showSelectAll` | `boolean` | `false` | ❌ | Shows “Select All” checkbox in panel |
| `label` | `string` | `''` | ❌ | `mat-label` text (translated) |
| `errorLabel` | `string` | `''` | ❌ | Label key passed to custom error directive |
| `customWidth` | `boolean` | `false` | ❌ | Applies `custom-panel` class |
| `appearance` | `MatFormFieldAppearance` | `'outline'` | ❌ | Material form field appearance |
| `placeholder` | `string` | - | ❌ | Placeholder for select |
| `canClear` | `boolean` | `true` | ❌ | Shows clear icon when value exists |
| `removeBottomMargin` | `boolean` | `false` | ❌ | Hides subscript/bottom spacing |
| `errorMessages` | `any` | `null` | ❌ | Validation message map for custom directive |

## Output

| Output | Type | Description |
|---|---|---|
| `selectionChange` | `EventEmitter<string \| string[]>` | Emits selected value(s) on changes |

## Basic Usage (single select)

```html
<app-select
  [items]="brandOptions"
  [control]="form.get('brand')"
  [label]="'COMMON.BRAND'"
  [placeholder]="'Select brand'"
  [valueFieldName]="'id'"
  [displayFieldName]="'name'"
  (selectionChange)="onBrandChange($event)">
</app-select>
```

```ts
brandOptions = [
  { id: '1', name: 'Renault' },
  { id: '2', name: 'Dacia' }
];
```

## Multi-select with Select All

```html
<app-select
  [items]="dealerOptions"
  [control]="form.get('dealers')"
  [multiple]="true"
  [showSelectAll]="true"
  [selectAllByDefault]="false"
  [label]="'COMMON.DEALERS'"
  [placeholder]="'Select dealers'"
  [valueFieldName]="'birCode'"
  [displayFieldName]="'name'"
  [subFieldName]="'address'"
  (selectionChange)="onDealersChange($event)">
</app-select>
```

## Reactive Form Setup

```ts
form = new FormGroup({
  brand: new FormControl('', Validators.required),
  dealers: new FormControl([], Validators.required)
});
```

## Behavior Notes

- In multi-select mode, trigger displays first selected label and `+N more`.
- `clearSelection()` resets:
  - single: `''`
  - multiple: `[]`
- `selectAllByDefault` applies on init when:
  - `multiple === true`
  - `items.length > 0`
- `allSelected` state is synchronized on item and select-all changes.

## Methods (public)

- `clearSelection()` – clears current selection
- `markAsTouched()` – marks control touched and refreshes validation
- `hasError(errorName: string)` – checks control error

## Integration Tips

1. Use `valueFieldName` + `displayFieldName` for object arrays.
2. Keep `control` initialized before rendering component.
3. For translated labels/placeholders, pass translation keys where used in templates.
4. If you hide bottom margin (`removeBottomMargin`), ensure error UX is still acceptable in that screen.

## Common Pitfalls

- Passing object items without `valueFieldName` can cause value mismatch behavior.
- In multi mode, ensure form control default is an array (`[]`).
- If using custom width, ensure styles for `.custom-panel` are globally effective with Angular Material overlay.
