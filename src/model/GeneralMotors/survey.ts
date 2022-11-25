import { Damage } from "./damage";
import { Doc } from "./doc";

export class Survey {
  public company: string;
  public local: number;
  public origin: number;
  public destination: number;
  public checkpoint: number;
  public tripId: number;
  public shipId: number;
  public vin: string;
  public surveyor: number;
  public surveyDate: string;
  public validator: number;
  public validationDate: string;
  public hasDamages: boolean;
  public hasDocuments: boolean;
  public released: number;
  public damages: Damage[];
  public documents: Doc[];
}
