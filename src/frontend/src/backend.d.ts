import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LOCInquiry {
    client: string;
    statementPeriod: string;
    mrNumber: string;
    payer: string;
    amount: number;
}
export interface Invoice {
    id: bigint;
    status: string;
    projectName: string;
    clientName: string;
    owner?: Principal;
    dueDate: string;
    amountDue: number;
}
export interface Inquiry {
    id: bigint;
    isInvoiced: boolean;
    owner: Principal;
    details: string;
}
export interface UserProfile {
    name: string;
    email: string;
    company: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createInquiry(details: string): Promise<bigint>;
    createInvoice(projectName: string, amountDue: number, dueDate: string, clientName: string): Promise<bigint>;
    deleteInvoice(invoiceId: bigint): Promise<boolean>;
    deleteLOCInvoice(): Promise<boolean>;
    displayLOCInquiry(): Promise<LOCInquiry | null>;
    getAllInvoices(): Promise<Array<Invoice>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInquiries(): Promise<Array<Inquiry>>;
    getInvoice(invoiceId: bigint): Promise<Invoice | null>;
    getInvoicesByClient(clientName: string): Promise<Array<Invoice>>;
    getInvoicesByStatus(status: string): Promise<Array<Invoice>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markInquiryAsInvoiced(inquiryId: bigint, isInvoiced: boolean): Promise<boolean>;
    markInvoiceAsPaid(invoiceId: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
