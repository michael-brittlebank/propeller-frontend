import { IMedicationInterface } from './medication.interface';

export interface IGroupConfigInterface {
    // todo, fill out complex interfaces instead of using "any"
    id: string;
    actRequired: boolean;
    catRequired: boolean;
    assets: [
        {
            name: string;
            url: string;
            contentType: string
        }
        ];
    country: string;
    demographics: string[];
    diseases: string[];
    displayName: string;
    fbTracking: string;
    heroDescription: string;
    hubAllowed: boolean;
    language: string;
    largeDescription: string;
    mailingAddressRequired: boolean;
    medications: IMedicationInterface[];
    memberships: string[];
    name: string;
    postalCodesAllowed: string[];
    preemptiveRequired: boolean;
    selfEnrollmentEnabled: boolean;
    smallDescription: string;
    timeZone: string;
    timeZoneRequired: boolean;
    medicalIdsRequired: any[];
    supportPhone: string;
    supportEmail: string
}