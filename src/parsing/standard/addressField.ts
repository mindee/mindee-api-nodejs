import { StringField, FieldConstructor } from "./text";

/**
 * A field containing a detailed address value broken down into components
 * (street number, city, postal code, …) while still exposing the full
 * address string through {@link StringField.value}.
 */
export class AddressField extends StringField {
  /** Street number. */
  streetNumber?: string;
  /** Street name. */
  streetName?: string;
  /** PO-box number. */
  poBox?: string;
  /** Additional address complement. */
  addressComplement?: string;
  /** City or locality. */
  city?: string;
  /** Postal / ZIP code. */
  postalCode?: string;
  /** State, province or region. */
  state?: string;
  /** Country. */
  country?: string;

  constructor({
    prediction = {},
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: FieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });

    // Populate the sub-components if they exist in the prediction object
    if (prediction["street_number"]) {
      this.streetNumber = prediction["street_number"] as string;
    }
    if (prediction["street_name"]) {
      this.streetName = prediction["street_name"] as string;
    }
    if (prediction["po_box"]) {
      this.poBox = prediction["po_box"] as string;
    }
    if (prediction["address_complement"]) {
      this.addressComplement = prediction["address_complement"] as string;
    }
    if (prediction["city"]) {
      this.city = prediction["city"] as string;
    }
    if (prediction["postal_code"]) {
      this.postalCode = prediction["postal_code"] as string;
    }
    if (prediction["state"]) {
      this.state = prediction["state"] as string;
    }
    if (prediction["country"]) {
      this.country = prediction["country"] as string;
    }
  }
}
