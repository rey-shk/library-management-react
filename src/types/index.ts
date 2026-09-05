export type BookCategory = 
  | 'Computer Science'
  | 'Software Engineering'
  | 'Artificial Intelligence'
  | 'Fiction & Literature'
  | 'Science & Physics'
  | 'Philosophy & Ethics'
  | 'Business & Economics'
  | 'History & Biography'
  | 'Design & UX'
  | 'Psychology';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: BookCategory;
  publishedYear: number;
  publisher: string;
  totalCopies: number;
  availableCopies: number;
  rackLocation: string; // e.g. "Rack A-04, 2nd Floor"
  description: string;
  coverUrl: string;
  rating: number; // 1-5
  language: string;
  pages: number;
  tags: string[];
  addedDate: string;
}

export type MemberRole = 'student' | 'faculty' | 'researcher' | 'patron';
export type MemberStatus = 'active' | 'suspended' | 'expired';

export interface Member {
  id: string;
  memberCode: string; // e.g. "LIB-2026-081"
  name: string;
  email: string;
  phone: string;
  role: MemberRole;
  department?: string;
  joinDate: string;
  avatarUrl: string;
  maxLoanLimit: number;
  activeLoanCount: number;
  status: MemberStatus;
  totalFinesPending: number;
}

export type LoanStatus = 'active' | 'overdue' | 'returned';

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  bookCoverUrl: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  status: LoanStatus;
  renewalCount: number;
  fineAmount: number;
  finePaid: boolean;
  notes?: string;
}

export type ReservationStatus = 'pending' | 'ready' | 'fulfilled' | 'cancelled';

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCoverUrl: string;
  memberId: string;
  memberName: string;
  reservationDate: string;
  status: ReservationStatus;
  queuePosition: number;
  expiryDate?: string;
}

export type FineReason = 'overdue' | 'damage' | 'lost_item' | 'late_return';
export type FineStatus = 'pending' | 'paid' | 'waived';

export interface FineTransaction {
  id: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  loanId?: string;
  bookTitle: string;
  amount: number;
  reason: FineReason;
  status: FineStatus;
  date: string;
  paymentMethod?: 'Cash' | 'Credit Card' | 'Campus Card' | 'Online / UPI';
  receiptNumber?: string;
  notes?: string;
}

export type ActivityType = 'borrow' | 'return' | 'renew' | 'member_join' | 'fine_paid' | 'book_added' | 'reservation';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityType;
  title: string;
  description: string;
  actorName: string;
  badgeColor?: string;
}

export interface LibrarySettings {
  libraryName: string;
  subTitle: string;
  standardLoanDays: number;
  studentLoanDays: number;
  facultyLoanDays: number;
  researcherLoanDays: number;
  maxBooksStudent: number;
  maxBooksFaculty: number;
  maxBooksPatron: number;
  finePerDay: number;
  maxRenewals: number;
  currencySymbol: string;
  contactEmail: string;
  autoCheckOverdue: boolean;
}

export type ActiveTab = 
  | 'dashboard'
  | 'books'
  | 'circulation'
  | 'members'
  | 'reservations'
  | 'fines'
  | 'analytics'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
