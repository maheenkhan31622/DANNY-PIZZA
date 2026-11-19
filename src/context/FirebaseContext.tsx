import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import type { OrderRecord, OrderStatus, ThemeMode, UserProfile } from '../types';

interface FirebaseContextValue {
  user: User | null;
  profile: UserProfile | null;
  orders: OrderRecord[];
  authReady: boolean;
  signingIn: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  toggleFavorite: (itemId: string) => Promise<void>;
  createFirestoreOrder: (order: Omit<OrderRecord, 'createdAtMs'>) => Promise<void>;
  advanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => Promise<void>;
  clearAuthError: () => void;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [authReady, setAuthReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const ensureUserProfile = useCallback(async (firebaseUser: User) => {
    const userPath = `users/${firebaseUser.uid}`;
    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const displayName = (firebaseUser.displayName || 'Danny Pizza Guest').slice(0, 80);
        const email = (firebaseUser.email || '').slice(0, 120);
        const photoURL = (firebaseUser.photoURL || '').slice(0, 500);
        const newProfile = {
          uid: firebaseUser.uid,
          displayName,
          email,
          photoURL,
          phone: '',
          savedArea: '',
          savedAddress: '',
          favoriteItemIds: [] as string[],
          preferredTheme: (document.documentElement.classList.contains('dark') ? 'dark' : 'light') as ThemeMode,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
        setProfile({
          uid: firebaseUser.uid,
          displayName,
          email,
          photoURL,
          phone: '',
          savedArea: '',
          savedAddress: '',
          favoriteItemIds: [],
          preferredTheme: newProfile.preferredTheme,
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, userPath);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
      if (firebaseUser) {
        try {
          await ensureUserProfile(firebaseUser);
        } catch (err) {
          console.error(err);
        }
      } else {
        setProfile(null);
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, [ensureUserProfile]);

  useEffect(() => {
    if (!authReady || !user) return;

    const userPath = `users/${user.uid}`;
    const unsubProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            uid: data.uid,
            displayName: data.displayName,
            email: data.email,
            photoURL: data.photoURL,
            phone: data.phone,
            savedArea: data.savedArea,
            savedAddress: data.savedAddress,
            favoriteItemIds: Array.isArray(data.favoriteItemIds) ? data.favoriteItemIds : [],
            preferredTheme: data.preferredTheme,
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userPath);
      }
    );

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const loaded: OrderRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          const createdMs =
            data.createdAt && typeof data.createdAt.toMillis === 'function'
              ? data.createdAt.toMillis()
              : Date.now();
          return {
            id: data.id,
            orderNumber: data.orderNumber,
            userId: data.userId,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail,
            orderType: data.orderType,
            area: data.area,
            deliveryAddress: data.deliveryAddress,
            notes: data.notes,
            paymentMethod: data.paymentMethod,
            status: data.status,
            items: Array.isArray(data.items) ? data.items : [],
            subtotal: Number(data.subtotal || 0),
            deliveryFee: Number(data.deliveryFee || 0),
            total: Number(data.total || 0),
            distanceKm: Number(data.distanceKm || 0),
            estimatedMinutes: Number(data.estimatedMinutes || 25),
            createdAtMs: createdMs,
          };
        });
        setOrders(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    return () => {
      unsubProfile();
      unsubOrders();
    };
  }, [authReady, user]);

  const signInWithGoogle = useCallback(async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in could not be completed.';
      if (!message.includes('popup-closed-by-user')) {
        setAuthError('Unable to complete Google Sign-In. Please allow popups and try again.');
      }
      return null;
    } finally {
      setSigningIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setProfile(null);
    setOrders([]);
  }, []);

  const updateProfileData = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) return;
      const path = `users/${user.uid}`;
      const payload: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      };
      if (updates.displayName !== undefined) {
        payload.displayName = updates.displayName.trim().slice(0, 80) || 'Customer';
      }
      if (updates.phone !== undefined) {
        payload.phone = updates.phone.trim().slice(0, 20);
      }
      if (updates.savedArea !== undefined) {
        payload.savedArea = updates.savedArea.trim().slice(0, 100);
      }
      if (updates.savedAddress !== undefined) {
        payload.savedAddress = updates.savedAddress.trim().slice(0, 250);
      }
      if (updates.favoriteItemIds !== undefined) {
        payload.favoriteItemIds = updates.favoriteItemIds.slice(0, 50);
      }
      if (updates.preferredTheme !== undefined) {
        payload.preferredTheme = updates.preferredTheme;
      }
      try {
        await updateDoc(doc(db, 'users', user.uid), payload);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [user]
  );

  const toggleFavorite = useCallback(
    async (itemId: string) => {
      if (!user || !profile) return;
      const current = profile.favoriteItemIds || [];
      const exists = current.includes(itemId);
      const next = exists
        ? current.filter((id) => id !== itemId)
        : [itemId, ...current].slice(0, 50);
      await updateProfileData({ favoriteItemIds: next });
    },
    [user, profile, updateProfileData]
  );

  const createFirestoreOrder = useCallback(
    async (order: Omit<OrderRecord, 'createdAtMs'>) => {
      if (!user) return;
      const path = `orders/${order.id}`;
      try {
        await setDoc(doc(db, 'orders', order.id), {
          id: order.id.slice(0, 128),
          orderNumber: order.orderNumber.slice(0, 24),
          userId: user.uid,
          customerName: order.customerName.trim().slice(0, 80),
          customerPhone: order.customerPhone.trim().slice(0, 20),
          customerEmail: (order.customerEmail || user.email || '').slice(0, 120),
          orderType: order.orderType,
          area: (order.area || '').slice(0, 100),
          deliveryAddress: (order.deliveryAddress || '').slice(0, 250),
          notes: (order.notes || '').slice(0, 300),
          paymentMethod: order.paymentMethod,
          status: 'placed',
          items: order.items.slice(0, 30),
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          total: order.total,
          distanceKm: order.distanceKm,
          estimatedMinutes: order.estimatedMinutes,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    },
    [user]
  );

  const advanceOrderStatus = useCallback(
    async (orderId: string, nextStatus: OrderStatus) => {
      if (!user) return;
      const path = `orders/${orderId}`;
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status: nextStatus,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [user]
  );

  return (
    <FirebaseContext.Provider
      value={{
        user,
        profile,
        orders,
        authReady,
        signingIn,
        authError,
        signInWithGoogle,
        logout,
        updateProfileData,
        toggleFavorite,
        createFirestoreOrder,
        advanceOrderStatus,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error('useFirebase must be used inside FirebaseProvider');
  return ctx;
}
