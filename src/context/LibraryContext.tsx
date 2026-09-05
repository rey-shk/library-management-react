import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  Book,
  Member,
  Loan,
  Reservation,
  FineTransaction,
  ActivityLog,
  LibrarySettings,
  ActiveTab,
  ToastMessage
} from '../types';
import {
  INITIAL_BOOKS,
  INITIAL_MEMBERS,
  INITIAL_LOANS,
  INITIAL_RESERVATIONS,
  INITIAL_FINES,
  INITIAL_ACTIVITIES,
  INITIAL_SETTINGS
} from '../data/initialData';

interface LibraryContextType {
  // Data
  books: Book[];
  members: Member[];
  loans: Loan[];
  reservations: Reservation[];
  fines: FineTransaction[];
  activities: ActivityLog[];
  settings: LibrarySettings;

  // Navigation & UI state
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modals & Selection states
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  isIssueModalOpen: boolean;
  setIsIssueModalOpen: (open: boolean) => void;
  preselectedBookId: string | null;
  setPreselectedBookId: (id: string | null) => void;
  isAddBookModalOpen: boolean;
  setIsAddBookModalOpen: (open: boolean) => void;
  isAddMemberModalOpen: boolean;
  setIsAddMemberModalOpen: (open: boolean) => void;

  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  editingBook: Book | null;
  setEditingBook: (book: Book | null) => void;

  selectedMember: Member | null;
  setSelectedMember: (member: Member | null) => void;
  editingMember: Member | null;
  setEditingMember: (member: Member | null) => void;
  cardMember: Member | null;
  setCardMember: (member: Member | null) => void;

  returnLoanTarget: Loan | null;
  setReturnLoanTarget: (loan: Loan | null) => void;
  collectFineTarget: FineTransaction | null;
  setCollectFineTarget: (fine: FineTransaction | null) => void;

  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Actions
  addBook: (bookData: Omit<Book, 'id' | 'addedDate'>) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;

  addMember: (memberData: Omit<Member, 'id' | 'memberCode' | 'joinDate' | 'activeLoanCount' | 'totalFinesPending'>) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: string) => void;

  issueBook: (bookId: string, memberId: string, dueDate: string, notes?: string) => boolean;
  returnBook: (loanId: string, condition: 'good' | 'damaged' | 'lost', damageFine?: number, notes?: string) => void;
  renewLoan: (loanId: string, daysToAdd?: number) => boolean;

  createReservation: (bookId: string, memberId: string) => boolean;
  cancelReservation: (reservationId: string) => void;
  fulfillReservation: (reservationId: string) => void;

  payFine: (fineId: string, paymentMethod: 'Cash' | 'Credit Card' | 'Campus Card' | 'Online / UPI') => void;
  waiveFine: (fineId: string, notes?: string) => void;

  updateSettings: (newSettings: LibrarySettings) => void;
  resetToDefaultData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;

  // Computed KPIs
  stats: {
    totalTitles: number;
    totalCopies: number;
    availableCopies: number;
    issuedCopies: number;
    totalMembers: number;
    activeLoansCount: number;
    overdueLoansCount: number;
    pendingReservationsCount: number;
    totalFinesPending: number;
    totalFinesCollected: number;
  };
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'lumina_library_';

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe LocalStorage Initializers
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}books`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}members`);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}loans`);
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}reservations`);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [fines, setFines] = useState<FineTransaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}fines`);
    return saved ? JSON.parse(saved) : INITIAL_FINES;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}activities`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [settings, setSettings] = useState<LibrarySettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}theme`);
    return saved === 'light' ? 'light' : 'dark';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // UI state
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [preselectedBookId, setPreselectedBookId] = useState<string | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [cardMember, setCardMember] = useState<Member | null>(null);

  const [returnLoanTarget, setReturnLoanTarget] = useState<Loan | null>(null);
  const [collectFineTarget, setCollectFineTarget] = useState<FineTransaction | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}books`, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}members`, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}loans`, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}reservations`, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}fines`, JSON.stringify(fines));
  }, [fines]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}activities`, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}theme`, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Recalculate overdues on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setLoans(prevLoans =>
      prevLoans.map(loan => {
        if (loan.status === 'active' && loan.dueDate < today) {
          const due = new Date(loan.dueDate);
          const current = new Date(today);
          const diffDays = Math.max(1, Math.ceil((current.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
          const fine = Number((diffDays * settings.finePerDay).toFixed(2));
          return {
            ...loan,
            status: 'overdue',
            fineAmount: fine
          };
        }
        return loan;
      })
    );
  }, [settings.finePerDay]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logActivity = (type: ActivityLog['type'], title: string, description: string, actorName: string) => {
    const colorMap: Record<string, string> = {
      borrow: '#3b82f6',
      return: '#10b981',
      renew: '#8b5cf6',
      member_join: '#f59e0b',
      fine_paid: '#06b6d4',
      book_added: '#ec4899',
      reservation: '#a855f7'
    };
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type,
      title,
      description,
      actorName,
      badgeColor: colorMap[type] || '#6366f1'
    };
    setActivities(prev => [newLog, ...prev.slice(0, 24)]);
  };

  // Actions: Books
  const addBook = (bookData: Omit<Book, 'id' | 'addedDate'>) => {
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0]
    };
    setBooks(prev => [newBook, ...prev]);
    logActivity('book_added', 'New Book Cataloged', `Added "${newBook.title}" to ${newBook.category}`, 'Librarian');
    addToast('success', 'Book Added', `"${newBook.title}" was successfully added to the catalog.`);
  };

  const updateBook = (updated: Book) => {
    setBooks(prev => prev.map(b => (b.id === updated.id ? updated : b)));
    addToast('info', 'Book Updated', `Changes to "${updated.title}" have been saved.`);
  };

  const deleteBook = (id: string) => {
    const target = books.find(b => b.id === id);
    if (!target) return;
    setBooks(prev => prev.filter(b => b.id !== id));
    addToast('warning', 'Book Removed', `"${target.title}" was deleted from the catalog.`);
  };

  // Actions: Members
  const addMember = (memberData: Omit<Member, 'id' | 'memberCode' | 'joinDate' | 'activeLoanCount' | 'totalFinesPending'>) => {
    const codeNum = Math.floor(100 + Math.random() * 900);
    const newMember: Member = {
      ...memberData,
      id: `mem-${Date.now()}`,
      memberCode: `LIB-2026-${codeNum}`,
      joinDate: new Date().toISOString().split('T')[0],
      activeLoanCount: 0,
      totalFinesPending: 0
    };
    setMembers(prev => [newMember, ...prev]);
    logActivity('member_join', 'New Patron Registered', `${newMember.name} joined as ${newMember.role.toUpperCase()}`, 'Librarian');
    addToast('success', 'Member Registered', `Welcome ${newMember.name}! Assigned ID: ${newMember.memberCode}`);
  };

  const updateMember = (updated: Member) => {
    setMembers(prev => prev.map(m => (m.id === updated.id ? updated : m)));
    addToast('info', 'Member Updated', `Profile updated for ${updated.name}.`);
  };

  const deleteMember = (id: string) => {
    const target = members.find(m => m.id === id);
    if (!target) return;
    setMembers(prev => prev.filter(m => m.id !== id));
    addToast('warning', 'Member Removed', `${target.name}'s account was archived.`);
  };

  // Actions: Issue Book
  const issueBook = (bookId: string, memberId: string, dueDate: string, notes?: string): boolean => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);

    if (!book || !member) {
      addToast('error', 'Issue Failed', 'Selected book or member could not be found.');
      return false;
    }

    if (book.availableCopies <= 0) {
      addToast('error', 'Out of Stock', `All copies of "${book.title}" are currently checked out.`);
      return false;
    }

    if (member.status !== 'active') {
      addToast('error', 'Account Suspended', `${member.name}'s membership is ${member.status}.`);
      return false;
    }

    if (member.activeLoanCount >= member.maxLoanLimit) {
      addToast('error', 'Loan Limit Reached', `${member.name} already reached their maximum allowance of ${member.maxLoanLimit} books.`);
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookIsbn: book.isbn,
      bookCoverUrl: book.coverUrl,
      memberId: member.id,
      memberName: member.name,
      memberCode: member.memberCode,
      issueDate: today,
      dueDate: dueDate || today,
      status: 'active',
      renewalCount: 0,
      fineAmount: 0,
      finePaid: false,
      notes: notes || undefined
    };

    // Update book stock
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b))
    );

    // Update member active count
    setMembers(prev =>
      prev.map(m => (m.id === memberId ? { ...m, activeLoanCount: m.activeLoanCount + 1 } : m))
    );

    // Add loan
    setLoans(prev => [newLoan, ...prev]);

    // Check if member had an active reservation on this book and fulfill it
    setReservations(prev =>
      prev.map(res =>
        res.bookId === bookId && res.memberId === memberId && (res.status === 'pending' || res.status === 'ready')
          ? { ...res, status: 'fulfilled' }
          : res
      )
    );

    logActivity('borrow', 'Book Checked Out', `${member.name} borrowed "${book.title}" (Due: ${newLoan.dueDate})`, member.name);
    addToast('success', 'Book Issued', `"${book.title}" successfully issued to ${member.name}.`);

    // Confetti effect
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }

    return true;
  };

  // Actions: Return Book
  const returnBook = (loanId: string, condition: 'good' | 'damaged' | 'lost', damageFine = 0, notes?: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const today = new Date().toISOString().split('T')[0];
    let totalFine = loan.fineAmount;

    if (condition === 'damaged' || condition === 'lost') {
      totalFine += damageFine;
    }

    // Update loan
    setLoans(prev =>
      prev.map(l =>
        l.id === loanId
          ? {
              ...l,
              returnDate: today,
              status: 'returned',
              fineAmount: totalFine,
              finePaid: totalFine === 0,
              notes: notes ? `${l.notes || ''} [Return Notes: ${notes}]` : l.notes
            }
          : l
      )
    );

    // If fine incurred, create fine transaction
    if (totalFine > 0) {
      const newFine: FineTransaction = {
        id: `fine-${Date.now()}`,
        memberId: loan.memberId,
        memberName: loan.memberName,
        memberCode: loan.memberCode,
        loanId: loan.id,
        bookTitle: loan.bookTitle,
        amount: totalFine,
        reason: condition === 'lost' ? 'lost_item' : condition === 'damaged' ? 'damage' : 'late_return',
        status: 'pending',
        date: today,
        notes: notes || (condition === 'lost' ? 'Replacement charge for lost book' : 'Overdue fine assessment')
      };
      setFines(prev => [newFine, ...prev]);

      setMembers(prev =>
        prev.map(m =>
          m.id === loan.memberId
            ? { ...m, totalFinesPending: Number((m.totalFinesPending + totalFine).toFixed(2)) }
            : m
        )
      );
    }

    // Update book stock if not lost
    if (condition !== 'lost') {
      setBooks(prev =>
        prev.map(b => (b.id === loan.bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b))
      );
    }

    // Decrease member active loans
    setMembers(prev =>
      prev.map(m =>
        m.id === loan.memberId ? { ...m, activeLoanCount: Math.max(0, m.activeLoanCount - 1) } : m
      )
    );

    // Notify any next reservation on this book
    const nextReservation = reservations.find(r => r.bookId === loan.bookId && r.status === 'pending');
    if (nextReservation) {
      setReservations(prev =>
        prev.map(r => (r.id === nextReservation.id ? { ...r, status: 'ready' } : r))
      );
      addToast('info', 'Hold Ready', `Next hold for "${loan.bookTitle}" is ready for pickup by ${nextReservation.memberName}!`);
    }

    logActivity('return', 'Book Returned', `${loan.memberName} returned "${loan.bookTitle}" (${condition.toUpperCase()})`, loan.memberName);
    addToast('success', 'Book Returned', `"${loan.bookTitle}" checked in successfully.`);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }
  };

  // Actions: Renew Loan
  const renewLoan = (loanId: string, daysToAdd = 14): boolean => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return false;

    if (loan.renewalCount >= settings.maxRenewals) {
      addToast('error', 'Renewal Limit', `This loan has already been renewed ${settings.maxRenewals} times.`);
      return false;
    }

    const currentDue = new Date(loan.dueDate);
    currentDue.setDate(currentDue.getDate() + daysToAdd);
    const newDueDate = currentDue.toISOString().split('T')[0];

    setLoans(prev =>
      prev.map(l =>
        l.id === loanId
          ? {
              ...l,
              dueDate: newDueDate,
              renewalCount: l.renewalCount + 1,
              status: 'active',
              fineAmount: 0
            }
          : l
      )
    );

    logActivity('renew', 'Loan Period Extended', `${loan.memberName} renewed "${loan.bookTitle}" to ${newDueDate}`, loan.memberName);
    addToast('success', 'Loan Renewed', `Due date extended to ${newDueDate}.`);
    return true;
  };

  // Actions: Reservations
  const createReservation = (bookId: string, memberId: string): boolean => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);
    if (!book || !member) return false;

    const existingHolds = reservations.filter(r => r.bookId === bookId && (r.status === 'pending' || r.status === 'ready'));
    const isAlreadyReserved = existingHolds.some(r => r.memberId === memberId);

    if (isAlreadyReserved) {
      addToast('warning', 'Already Reserved', `${member.name} already has an active hold on this title.`);
      return false;
    }

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookCoverUrl: book.coverUrl,
      memberId: member.id,
      memberName: member.name,
      reservationDate: new Date().toISOString().split('T')[0],
      status: book.availableCopies > 0 ? 'ready' : 'pending',
      queuePosition: existingHolds.length + 1
    };

    setReservations(prev => [...prev, newReservation]);
    logActivity('reservation', 'Hold Placed', `${member.name} placed a hold on "${book.title}" (Queue #${newReservation.queuePosition})`, member.name);
    addToast('success', 'Reservation Placed', `Hold confirmed for ${member.name} (Position #${newReservation.queuePosition})`);
    return true;
  };

  const cancelReservation = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;
    setReservations(prev => prev.filter(r => r.id !== reservationId));
    addToast('info', 'Hold Cancelled', `Reservation for "${res.bookTitle}" has been cancelled.`);
  };

  const fulfillReservation = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;
    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'fulfilled' } : r))
    );
    addToast('success', 'Hold Fulfilled', `Reserved copy marked as collected.`);
  };

  // Actions: Fines
  const payFine = (fineId: string, paymentMethod: 'Cash' | 'Credit Card' | 'Campus Card' | 'Online / UPI') => {
    const targetFine = fines.find(f => f.id === fineId);
    if (!targetFine) return;

    const receiptNum = `RCPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setFines(prev =>
      prev.map(f =>
        f.id === fineId
          ? {
              ...f,
              status: 'paid',
              paymentMethod,
              receiptNumber: receiptNum
            }
          : f
      )
    );

    // Decrement member's fine balance
    setMembers(prev =>
      prev.map(m =>
        m.id === targetFine.memberId
          ? { ...m, totalFinesPending: Math.max(0, Number((m.totalFinesPending - targetFine.amount).toFixed(2))) }
          : m
      )
    );

    logActivity('fine_paid', 'Fine Payment Processed', `${targetFine.memberName} paid $${targetFine.amount.toFixed(2)} via ${paymentMethod}`, 'Cashier Desk');
    addToast('success', 'Payment Received', `$${targetFine.amount.toFixed(2)} settled. Receipt: ${receiptNum}`);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }
  };

  const waiveFine = (fineId: string, notes?: string) => {
    const targetFine = fines.find(f => f.id === fineId);
    if (!targetFine) return;

    setFines(prev =>
      prev.map(f =>
        f.id === fineId
          ? {
              ...f,
              status: 'waived',
              notes: notes ? `Waived: ${notes}` : 'Waived by administrative discretion'
            }
          : f
      )
    );

    setMembers(prev =>
      prev.map(m =>
        m.id === targetFine.memberId
          ? { ...m, totalFinesPending: Math.max(0, Number((m.totalFinesPending - targetFine.amount).toFixed(2))) }
          : m
      )
    );

    addToast('info', 'Fine Waived', `$${targetFine.amount.toFixed(2)} penalty waived for ${targetFine.memberName}.`);
  };

  const updateSettings = (newSettings: LibrarySettings) => {
    setSettings(newSettings);
    addToast('success', 'Settings Saved', 'System configuration updated successfully.');
  };

  const resetToDefaultData = () => {
    setBooks(INITIAL_BOOKS);
    setMembers(INITIAL_MEMBERS);
    setLoans(INITIAL_LOANS);
    setReservations(INITIAL_RESERVATIONS);
    setFines(INITIAL_FINES);
    setActivities(INITIAL_ACTIVITIES);
    setSettings(INITIAL_SETTINGS);
    addToast('info', 'System Reset', 'All data restored to factory sample dataset.');
  };

  const exportDataJSON = () => {
    const payload = {
      books,
      members,
      loans,
      reservations,
      fines,
      activities,
      settings,
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lumina_library_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', 'Data Exported', 'JSON snapshot downloaded to your computer.');
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.books && parsed.members && parsed.loans) {
        setBooks(parsed.books);
        setMembers(parsed.members);
        setLoans(parsed.loans);
        if (parsed.reservations) setReservations(parsed.reservations);
        if (parsed.fines) setFines(parsed.fines);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.settings) setSettings(parsed.settings);
        addToast('success', 'Backup Restored', 'Library database successfully updated from JSON file.');
        return true;
      }
      addToast('error', 'Import Failed', 'Invalid JSON backup format.');
      return false;
    } catch {
      addToast('error', 'Import Error', 'Failed to parse JSON file.');
      return false;
    }
  };

  // Computed KPIs
  const totalTitles = books.length;
  const totalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const issuedCopies = Math.max(0, totalCopies - availableCopies);
  const totalMembers = members.length;
  const activeLoansCount = loans.filter(l => l.status === 'active' || l.status === 'overdue').length;
  const overdueLoansCount = loans.filter(l => l.status === 'overdue').length;
  const pendingReservationsCount = reservations.filter(r => r.status === 'pending' || r.status === 'ready').length;
  const totalFinesPending = fines.filter(f => f.status === 'pending').reduce((acc, f) => acc + f.amount, 0);
  const totalFinesCollected = fines.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0);

  const stats = {
    totalTitles,
    totalCopies,
    availableCopies,
    issuedCopies,
    totalMembers,
    activeLoansCount,
    overdueLoansCount,
    pendingReservationsCount,
    totalFinesPending,
    totalFinesCollected
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        loans,
        reservations,
        fines,
        activities,
        settings,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        isIssueModalOpen,
        setIsIssueModalOpen,
        preselectedBookId,
        setPreselectedBookId,
        isAddBookModalOpen,
        setIsAddBookModalOpen,
        isAddMemberModalOpen,
        setIsAddMemberModalOpen,
        selectedBook,
        setSelectedBook,
        editingBook,
        setEditingBook,
        selectedMember,
        setSelectedMember,
        editingMember,
        setEditingMember,
        cardMember,
        setCardMember,
        returnLoanTarget,
        setReturnLoanTarget,
        collectFineTarget,
        setCollectFineTarget,
        toasts,
        addToast,
        removeToast,
        addBook,
        updateBook,
        deleteBook,
        addMember,
        updateMember,
        deleteMember,
        issueBook,
        returnBook,
        renewLoan,
        createReservation,
        cancelReservation,
        fulfillReservation,
        payFine,
        waiveFine,
        updateSettings,
        resetToDefaultData,
        exportDataJSON,
        importDataJSON,
        stats
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
