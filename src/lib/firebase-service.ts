import { firestore } from './firebase-init';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query as fsQuery, 
  where as fsWhere, 
  Timestamp 
} from 'firebase/firestore';

// Helper to convert Dates to Timestamps recursively
function convertDatesToTimestamps(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) {
    return Timestamp.fromDate(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToTimestamps);
  }
  if (typeof obj === 'object') {
    if (obj.constructor && obj.constructor.name !== 'Object') return obj;
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertDatesToTimestamps(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// Helper to convert Timestamps back to Dates recursively
function convertTimestampsToDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Timestamp) {
    return obj.toDate();
  }
  if (obj && typeof obj === 'object') {
    const sec = obj.seconds !== undefined ? obj.seconds : obj._seconds;
    const nano = obj.nanoseconds !== undefined ? obj.nanoseconds : obj._nanoseconds;
    if (sec !== undefined && nano !== undefined) {
      return new Timestamp(sec, nano).toDate();
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTimestampsToDates);
  }
  if (typeof obj === 'object') {
    if (obj instanceof Date) return obj;
    if (obj.constructor && obj.constructor.name !== 'Object') return obj;
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertTimestampsToDates(obj[key]);
    }
    if (newObj.id !== undefined && newObj._id === undefined) {
      newObj._id = newObj.id;
    }
    return newObj;
  }
  return obj;
}

// Sanitiza e remove campos "undefined" que causam falhas de escrita no Firestore
function sanitizeData(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (obj instanceof Timestamp) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeData);
  }
  if (typeof obj === 'object') {
    if (obj.constructor && obj.constructor.name !== 'Object') return obj;
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        newObj[key] = sanitizeData(val);
      }
    }
    return newObj;
  }
  return obj;
}

export const FirebaseService = {
  /**
   * Saves or updates a document in Firestore with robust error-handling, logging and guaranteed promise resolution.
   */
  async saveRecord(collectionName: string, id: string | undefined, data: any): Promise<any> {
    const operationId = Math.random().toString(36).substring(2, 9);
    console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] Starting operation. ID: ${id || 'NEW'}`);
    console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] Raw Input Data:`, JSON.stringify(data));

    try {
      // 1. Sanitize the input data (remove undefined, convert dates to timestamps)
      let preparedData = convertDatesToTimestamps(data);
      preparedData = sanitizeData(preparedData);

      // 2. Resolve document reference
      let docRef;
      let finalId = id;
      if (finalId) {
        docRef = doc(firestore, collectionName, finalId);
      } else {
        const collRef = collection(firestore, collectionName);
        docRef = doc(collRef);
        finalId = docRef.id;
        preparedData.id = finalId;
        preparedData._id = finalId;
      }

      // 3. Ensure baseline timestamps exist
      const now = Timestamp.now();
      if (!preparedData.createdAt) {
        preparedData.createdAt = now;
      }
      preparedData.updatedAt = now;

      console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] Prepared Firestore Payload:`, JSON.stringify(preparedData));
      
      // 4. Execute setDoc and await completion to guarantee persistent storage
      await setDoc(docRef, preparedData);
      console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] Write operation succeeded. Fetching to verify persistence...`);

      // 5. Verify write operation by fetching from database
      const verifiedSnap = await getDoc(docRef);
      if (!verifiedSnap.exists()) {
        throw new Error(`Write completed but document was not found immediately in collection '${collectionName}' with ID '${finalId}'`);
      }

      const savedData = convertTimestampsToDates({ id: verifiedSnap.id, ...(verifiedSnap.data() as any || {}) });
      console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] SUCCESS. Document fully persisted and verified:`, savedData);
      
      return savedData;
    } catch (error: any) {
      console.error(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] CRITICAL ERROR during document write:`, error);
      throw error;
    }
  },

  /**
   * Updates a specific record in Firestore.
   */
  async updateRecord(collectionName: string, id: string, data: any): Promise<any> {
    const operationId = Math.random().toString(36).substring(2, 9);
    console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] Starting patch on ID: ${id}`);
    console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] Patch Data:`, JSON.stringify(data));

    try {
      if (!id) {
        throw new Error(`Cannot update document in collection '${collectionName}' without a valid ID`);
      }

      let preparedData = convertDatesToTimestamps(data);
      preparedData = sanitizeData(preparedData);
      preparedData.updatedAt = Timestamp.now();

      const docRef = doc(firestore, collectionName, id);
      console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] Executing updateDoc...`);
      await updateDoc(docRef, preparedData);
      console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] Patch write completed. Fetching to verify...`);

      const verifiedSnap = await getDoc(docRef);
      const savedData = convertTimestampsToDates({ id: verifiedSnap.id, ...(verifiedSnap.data() as any || {}) });
      console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] SUCCESS. Document patched and verified:`, savedData);
      return savedData;
    } catch (error: any) {
      console.error(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] CRITICAL ERROR during updateDoc:`, error);
      throw error;
    }
  },

  /**
   * Deletes a document from Firestore.
   */
  async deleteRecord(collectionName: string, id: string): Promise<any> {
    const operationId = Math.random().toString(36).substring(2, 9);
    console.log(`[FirebaseService:${collectionName}:deleteRecord] [Op:${operationId}] Requesting delete of ID: ${id}`);

    try {
      if (!id) {
        throw new Error(`Cannot delete document in collection '${collectionName}' without a valid ID`);
      }

      const docRef = doc(firestore, collectionName, id);
      const snap = await getDoc(docRef);
      const backupData = snap.exists() ? convertTimestampsToDates({ id: snap.id, ...(snap.data() as any || {}) }) : { id };

      console.log(`[FirebaseService:${collectionName}:deleteRecord] [Op:${operationId}] Executing deleteDoc...`);
      await deleteDoc(docRef);
      console.log(`[FirebaseService:${collectionName}:deleteRecord] [Op:${operationId}] SUCCESS. Document deleted.`);
      return backupData;
    } catch (error: any) {
      console.error(`[FirebaseService:${collectionName}:deleteRecord] [Op:${operationId}] CRITICAL ERROR during deleteDoc:`, error);
      throw error;
    }
  },

  /**
   * Gets a document from Firestore.
   */
  async getRecord(collectionName: string, id: string): Promise<any> {
    console.log(`[FirebaseService:${collectionName}:getRecord] Fetching ID: ${id}`);
    try {
      const docRef = doc(firestore, collectionName, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        console.warn(`[FirebaseService:${collectionName}:getRecord] Document with ID ${id} does not exist.`);
        return null;
      }
      return convertTimestampsToDates({ id: snap.id, ...(snap.data() as any || {}) });
    } catch (error: any) {
      console.error(`[FirebaseService:${collectionName}:getRecord] CRITICAL ERROR:`, error);
      throw error;
    }
  },

  /**
   * Lists and filters documents from Firestore.
   */
  async listRecords(collectionName: string, filter?: { field: string; value: any }): Promise<any[]> {
    console.log(`[FirebaseService:${collectionName}:listRecords] Fetching all documents. Filter:`, filter);
    try {
      const collRef = collection(firestore, collectionName);
      let q = collRef as any;
      if (filter) {
        q = fsQuery(collRef, fsWhere(filter.field, '==', filter.value));
      }
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any || {}) })).map(convertTimestampsToDates);
      console.log(`[FirebaseService:${collectionName}:listRecords] SUCCESS. Found ${items.length} documents.`);
      return items;
    } catch (error: any) {
      console.error(`[FirebaseService:${collectionName}:listRecords] CRITICAL ERROR:`, error);
      throw error;
    }
  }
};
